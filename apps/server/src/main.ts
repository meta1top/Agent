import { existsSync } from "node:fs";
import * as path from "node:path";
import { ConsoleLogger, Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { config } from "dotenv";
import { ZodValidationPipe } from "nestjs-zod";

import { AppConfig } from "@meta-1/agent-shared";
import { ConfigLoader, ConfigSourceType, syncLocales } from "@meta-1/nest-common";
import { AppModule } from "./app.module";
import { setupSwagger } from "./app.swagger";
import { printBanner } from "./app.utils";

const nodeEnv = process.env.NODE_ENV;
const devEnvPath = path.join(process.cwd(), "apps/server/.env");
const hasDevEnvFile = existsSync(devEnvPath);
const isDevelopment = nodeEnv === "development" || (!nodeEnv && hasDevEnvFile);

const envPath = isDevelopment ? devEnvPath : path.join(process.cwd(), ".env");
config({ path: envPath });

async function bootstrap() {
  const logger = new Logger("Main");
  const loader = new ConfigLoader<AppConfig>({
    type: ConfigSourceType.LOCAL_YAML,
    filePath: path.join(process.cwd(), "conf/server.yaml"),
  });
  const config = await loader.load();
  if (!config) {
    throw new Error("Failed to load configuration");
  }

  if (isDevelopment) {
    logger.log("Syncing locales in development mode");
    syncLocales({
      sourceDir: path.join(process.cwd(), "locales"),
      targetDir: path.join(process.cwd(), "dist/apps/server/i18n"),
      watch: true,
    });
  } else {
    logger.log("Skipping locales sync in production (already copied during build)");
  }
  // 生产环境禁用日志颜色，避免配色影响阅读
  const app = await NestFactory.create(AppModule.forRoot(config), {
    logger: new ConsoleLogger({ colors: isDevelopment }),
  });

  app.enableCors({
    origin: true,
    credentials: true,
  });
  // biome-ignore lint/correctness/useHookAtTopLevel: it is not a hook
  app.useGlobalPipes(new ZodValidationPipe());

  setupSwagger(app);

  const port = process.env.PORT ?? 3710;
  await app.listen(port);

  printBanner(port);
}

bootstrap();
