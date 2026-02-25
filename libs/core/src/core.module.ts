import { DynamicModule, Module } from "@nestjs/common";

import { AppConfig } from "@meta-1/agent-shared";
import { AgentProcessor } from "./processor";
import { AgentService, ChatService, ConfigService, ModelService } from "./service";
import { CORE_MODULE_CONFIG } from "./shared";

@Module({})
export class CoreModule {
  static forRoot(config: AppConfig, global = true): DynamicModule {
    return {
      global,
      module: CoreModule,
      providers: [
        {
          provide: CORE_MODULE_CONFIG,
          useValue: config,
        },
        ConfigService,
        ModelService,
        ChatService,
        AgentService,
        AgentProcessor,
      ],
      exports: [ConfigService, ModelService, ChatService],
      controllers: [],
    };
  }
}
