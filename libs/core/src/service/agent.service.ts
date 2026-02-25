import { HumanMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { END, GraphNode, MessagesValue, START, StateGraph, StateSchema } from "@langchain/langgraph";
import { ToolNode, toolsCondition } from "@langchain/langgraph/prebuilt";
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { Injectable, OnModuleDestroy, OnModuleInit, Optional } from "@nestjs/common";
import { InjectRedis } from "@nestjs-modules/ioredis";
import type { Redis } from "ioredis";
import { z } from "zod";

import { ConfigService } from "./config.service";
import { ModelService } from "./model.service";

const CHAT_STREAM_PREFIX = "chat:stream:";

const getWeather = tool(
  ({ city }) => {
    const conditions = ["晴", "多云", "阴", "小雨", "晴转多云"];
    const condition = conditions[city.length % conditions.length];
    const temp = 15 + (city.charCodeAt(0) % 20);
    return `${city}：${condition}，${temp}°C`;
  },
  {
    name: "get_weather",
    description: "查询指定城市的模拟天气信息",
    schema: z.object({
      city: z.string().describe("城市名称"),
    }),
  },
);

const builtinTools = [getWeather];

@Injectable()
export class AgentService implements OnModuleInit, OnModuleDestroy {
  private mcpClient: MultiServerMCPClient | null = null;
  private tools: typeof builtinTools = builtinTools;

  constructor(
    private readonly modelService: ModelService,
    private readonly configService: ConfigService,
    @Optional() @InjectRedis() private readonly redis?: Redis,
  ) {}

  async onModuleInit(): Promise<void> {
    const context7Args = ["-y", "@upstash/context7-mcp@latest"];
    const apiKey = process.env.CONTEXT7_API_KEY;
    if (apiKey) {
      context7Args.push("--api-key", apiKey);
    }
    try {
      this.mcpClient = new MultiServerMCPClient({
        mcpServers: {
          Context7: {
            transport: "stdio",
            command: "npx",
            args: context7Args,
          },
        },
      });
      const mcpTools = await this.mcpClient.getTools();
      this.tools = [...builtinTools, ...mcpTools] as typeof builtinTools;
    } catch {
      this.tools = builtinTools;
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.mcpClient) {
      await this.mcpClient.close();
      this.mcpClient = null;
    }
  }

  async streamToRedis(sessionId: string, message: string): Promise<void> {
    const model = this.modelService.getChatModel().bindTools(this.tools);
    const State = new StateSchema({
      messages: MessagesValue,
    });
    const callModel: GraphNode<typeof State> = async (state) => {
      const response = await model.invoke(state.messages);
      return { messages: [response] };
    };
    const toolNode = new ToolNode(this.tools);
    const builder = new StateGraph(State)
      .addNode("call_model", callModel)
      .addNode("tools", toolNode)
      .addEdge(START, "call_model")
      .addConditionalEdges("call_model", toolsCondition, ["tools", END])
      .addEdge("tools", "call_model");

    const checkpointer = PostgresSaver.fromConnString(this.configService.getDbUri());
    await checkpointer.setup();
    const graph = builder.compile({ checkpointer });

    const config = {
      configurable: {
        thread_id: sessionId,
      },
    };

    const streamKey = `${CHAT_STREAM_PREFIX}${sessionId}`;

    if (this.redis) {
      const humanMsg = new HumanMessage(message);
      await this.redis.xadd(streamKey, "*", "message", JSON.stringify(humanMsg.toDict()));
    }

    for await (const chunk of await graph.stream(
      { messages: [{ role: "user", content: message }] },
      { ...config, streamMode: "messages" },
    )) {
      const msg = chunk[0];
      if (this.redis && typeof msg.toDict === "function") {
        await this.redis.xadd(streamKey, "*", "message", JSON.stringify(msg.toDict()));
      }
    }
  }
}
