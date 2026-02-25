import { Inject, Injectable } from "@nestjs/common";

import type { AppConfig, ResolvedModelConfig } from "@meta-1/agent-shared";
import { CORE_MODULE_CONFIG } from "../shared";

const OPENAI_API_KEY = "OPENAI_API_KEY";
const OPENAI_BASE_URL = "OPENAI_BASE_URL";

@Injectable()
export class ConfigService {
  constructor(@Inject(CORE_MODULE_CONFIG) private readonly config: AppConfig) {}

  get(): AppConfig {
    return this.config;
  }

  getChatModelConfig(): ResolvedModelConfig {
    return this.resolveModelConfig(this.config.core.model.chat, this.config.core.model.apiKey, this.config.core.model.baseUrl);
  }

  getEmbeddingModelConfig(): ResolvedModelConfig {
    return this.resolveModelConfig(this.config.core.model.embedding, this.config.core.model.apiKey, this.config.core.model.baseUrl);
  }

  getDbUri(): string {
    const db = this.config.database;
    const encodedPassword = encodeURIComponent(db.password);
    return `postgresql://${db.username}:${encodedPassword}@${db.host}:${db.port}/${db.database}?sslmode=disable`;
  }

  private resolveModelConfig(
    specific: { name: string; apiKey?: string; baseUrl?: string },
    fallbackApiKey?: string,
    fallbackBaseUrl?: string,
  ): ResolvedModelConfig {
    const apiKey = specific.apiKey ?? fallbackApiKey ?? process.env[OPENAI_API_KEY];
    const baseUrl = specific.baseUrl ?? fallbackBaseUrl ?? process.env[OPENAI_BASE_URL];
    return {
      name: specific.name,
      apiKey,
      baseUrl,
    };
  }
}
