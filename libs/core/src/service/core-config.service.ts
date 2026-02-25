import { Inject, Injectable } from "@nestjs/common";

import type { CoreConfig, ResolvedModelConfig } from "@meta-1/agent-shared";
import { CORE_MODULE_CONFIG } from "../shared";

const OPENAI_API_KEY = "OPENAI_API_KEY";
const OPENAI_BASE_URL = "OPENAI_BASE_URL";

@Injectable()
export class CoreConfigService {
  constructor(@Inject(CORE_MODULE_CONFIG) private readonly config: CoreConfig) {}

  get(): CoreConfig {
    return this.config;
  }

  getChatModelConfig(): ResolvedModelConfig {
    return this.resolveModelConfig(
      this.config.model.chat,
      this.config.model.apiKey,
      this.config.model.baseUrl,
    );
  }

  getEmbeddingModelConfig(): ResolvedModelConfig {
    return this.resolveModelConfig(
      this.config.model.embedding,
      this.config.model.apiKey,
      this.config.model.baseUrl,
    );
  }

  private resolveModelConfig(
    specific: { name: string; apiKey?: string; baseUrl?: string },
    fallbackApiKey?: string,
    fallbackBaseUrl?: string,
  ): ResolvedModelConfig {
    const apiKey =
      specific.apiKey ?? fallbackApiKey ?? process.env[OPENAI_API_KEY];
    const baseUrl =
      specific.baseUrl ?? fallbackBaseUrl ?? process.env[OPENAI_BASE_URL];
    return {
      name: specific.name,
      apiKey,
      baseUrl,
    };
  }
}
