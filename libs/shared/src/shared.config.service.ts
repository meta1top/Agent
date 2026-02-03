import { Inject, Injectable } from "@nestjs/common";

import { type AppConfig } from "./shared.config";
import { APP_MODULE_OPTIONS } from "./shared.const";

/**
 * Shared 配置服务
 * 用于读取 SharedModule 的配置
 */
@Injectable()
export class SharedConfigService {
  constructor(@Inject(APP_MODULE_OPTIONS) private readonly config: AppConfig) {}

  /**
   * 获取当前配置
   */
  get(): AppConfig {
    return this.config;
  }
}
