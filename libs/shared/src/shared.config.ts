import { RedisClusterOptions, RedisSingleOptions } from "@nestjs-modules/ioredis";
import { DefaultJobOptions } from "bullmq";

import { AssetsConfig } from "@meta-1/nest-assets";
import { MessageConfig } from "@meta-1/nest-message";
import { SecurityConfig } from "@meta-1/nest-security";

export type DatabaseConfig = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize?: boolean;
  logging?: boolean;
};

export type RedisConfig = RedisSingleOptions | RedisClusterOptions;

export type TaskQueueConfig = DefaultJobOptions;

export const DEFAULT_TASK_QUEUE_CONFIG: TaskQueueConfig = {
  removeOnComplete: {
    age: 3600,
    count: 1000,
  },
  removeOnFail: {
    age: 86400,
    count: 100,
  },
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 2000,
  },
};

export type AppConfig = {
  database: DatabaseConfig;
  redis: RedisConfig;
  message: MessageConfig;
  security: SecurityConfig;
  assets: AssetsConfig;
  taskQueue: TaskQueueConfig;
};
