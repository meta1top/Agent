import { DynamicModule, Module } from "@nestjs/common";

import { AppConfig } from "./shared.config";
import { SharedConfigService } from "./shared.config.service";
import { APP_MODULE_OPTIONS } from "./shared.const";

@Module({})
export class SharedModule {
  static forRoot(config: AppConfig, global = true): DynamicModule {
    return {
      global,
      module: SharedModule,
      imports: [],
      providers: [
        {
          provide: APP_MODULE_OPTIONS,
          useValue: config,
        },
        SharedConfigService,
      ],
      exports: [SharedConfigService],
      controllers: [],
    };
  }
}
