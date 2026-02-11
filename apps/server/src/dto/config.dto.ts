import { CommonConfigSchema } from "@meta-1/agent-types";
import { createI18nZodDto } from "@meta-1/nest-common";

export class CommonConfigDto extends createI18nZodDto(CommonConfigSchema) {}
