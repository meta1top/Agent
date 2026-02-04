#!/usr/bin/env ts-node
/**
 * TypeORM 迁移命令简化包装
 * 用法:
 *   pnpm migration:generate account AddUserAge
 *   pnpm migration:create account AddUserAge
 *   pnpm migration:run
 *   pnpm migration:revert
 *   pnpm migration:show
 */

import * as path from "node:path";

import { runMigration } from "@meta-1/nest-common";

runMigration({
  libsPath: path.join(process.cwd(), "libs"),
  dataSourcePath: path.join(process.cwd(), "apps/server/src/data-source.ts"),
});
