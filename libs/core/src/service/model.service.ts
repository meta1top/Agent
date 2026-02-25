import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { Injectable } from "@nestjs/common";

import type { ResolvedModelConfig } from "@meta-1/agent-shared";
import { CoreConfigService } from "./core-config.service";

type ChatModelOptions = {
  model: string;
  apiKey?: string;
  configuration?: { baseURL: string };
};

type EmbeddingModelOptions = {
  model: string;
  apiKey?: string;
  configuration?: { baseURL: string };
};

@Injectable()
export class ModelService {
  constructor(private readonly coreConfig: CoreConfigService) {}

  getChatModel(): ChatOpenAI {
    const config = this.coreConfig.getChatModelConfig();
    return this.createChatModel(config);
  }

  getEmbeddingModel(): OpenAIEmbeddings {
    const config = this.coreConfig.getEmbeddingModelConfig();
    return this.createEmbeddingModel(config);
  }

  private createChatModel(config: ResolvedModelConfig): ChatOpenAI {
    const options: ChatModelOptions = {
      model: config.name,
    };
    if (config.apiKey) {
      options.apiKey = config.apiKey;
    }
    if (config.baseUrl) {
      options.configuration = { baseURL: config.baseUrl };
    }
    return new ChatOpenAI(options);
  }

  private createEmbeddingModel(config: ResolvedModelConfig): OpenAIEmbeddings {
    const options: EmbeddingModelOptions = {
      model: config.name,
    };
    if (config.apiKey) {
      options.apiKey = config.apiKey;
    }
    if (config.baseUrl) {
      options.configuration = { baseURL: config.baseUrl };
    }
    return new OpenAIEmbeddings(options);
  }
}
