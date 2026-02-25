import { DynamicModule, Module } from "@nestjs/common";

import { CoreConfig } from "@meta-1/agent-shared";
import { ChatAgentService, CoreConfigService, ModelService } from "./service";
import { CORE_MODULE_CONFIG } from "./shared";

@Module({})
export class CoreModule {
  static forRoot(config: CoreConfig, global = true): DynamicModule {
    return {
      global,
      module: CoreModule,
      providers: [
        {
          provide: CORE_MODULE_CONFIG,
          useValue: config,
        },
        CoreConfigService,
        ModelService,
        ChatAgentService,
      ],
      exports: [CoreConfigService, ModelService, ChatAgentService],
      controllers: [],
    };
  }
}
