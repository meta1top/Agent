import * as path from "node:path";
import { config } from "dotenv";
import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

// ✅ 指定 .env 文件位置
const envPath = path.join(process.cwd(), "apps/server/.env");
config({ path: envPath });

// 从环境变量获取模块名 (由 migration-cli.ts 设置)
// "*" 表示所有模块
const moduleName = process.env.TYPEORM_MODULE || "*";

console.log(`📋 Loading env from: ${envPath}`);
console.log(`🗄️  Database: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`);
console.log(`📦 Module: ${moduleName}`);

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_DATABASE || "wiki",
  entities: [`${__dirname}/../../../libs/${moduleName}/src/entity/*.entity.{ts,js}`],
  migrations: [`${__dirname}/../../../libs/${moduleName}/src/migrations/[0-9]*.{ts,js}`],
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
  migrationsRun: false,
  logging: process.env.NODE_ENV === "development",
});
