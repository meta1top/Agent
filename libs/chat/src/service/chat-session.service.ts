import { randomUUID } from "node:crypto";
import { InjectQueue } from "@nestjs/bullmq";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Queue } from "bullmq";
import { I18nContext } from "nestjs-i18n";
import { Repository } from "typeorm";

import { ChatService } from "@meta-1/agent-core";
import { AGENT_TASK_NAME, APP_TASK_QUEUE_NAME } from "@meta-1/agent-shared";
import { CacheableService } from "@meta-1/nest-common";
import { ChatSession } from "../entity";

@Injectable()
@CacheableService()
export class ChatSessionService {
  private readonly logger = new Logger(ChatSessionService.name);
  constructor(
    private readonly chatService: ChatService,
    @InjectRepository(ChatSession) private repository: Repository<ChatSession>,
    @InjectQueue(APP_TASK_QUEUE_NAME) private taskQueue: Queue,
  ) {}

  private async generateSessionId(): Promise<string> {
    return randomUUID();
  }

  private async generateTitle(message: string): Promise<string> {
    const language = I18nContext.current()?.lang ?? "en";
    const prompt = `用户正在创建一个新会话，会话内容是：
${message}
当前用户的界面语言：
${language}
请根据用户的需求，生成一个新会话的标题。
注意：
1. 标题必须简洁明了，能够准确描述会话内容；
2. 不超过50个字；
3. 只需要返回标题，不要返回多余的信息。`;
    this.logger.log(prompt);
    const result = await this.chatService.invoke({
      message: prompt,
    });
    return result.content;
  }

  async create(message: string): Promise<ChatSession | null> {
    const sessionId = await this.generateSessionId();
    const title = await this.generateTitle(message);
    const session = this.repository.create({
      sessionId,
      title,
    });
    await this.repository.save(session);

    await this.taskQueue.add(
      AGENT_TASK_NAME,
      { sessionId, message },
      {
        attempts: 3, // 重试3次
        backoff: {
          type: "exponential",
          delay: 5000, // 5秒起始延迟,指数增长
        },
      },
    );
    return null;
  }

  async continue(sessionId: string, message: string): Promise<void> {
    const session = await this.repository.findOne({ where: { sessionId } });
    if (!session) {
      throw new NotFoundException(`会话 ${sessionId} 不存在`);
    }

    await this.taskQueue.add(
      AGENT_TASK_NAME,
      { sessionId, message },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
      },
    );
  }
}
