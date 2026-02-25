import {
  ContinueChatSessionSchema,
  NewChatSessionResultSchema,
  NewChatSessionSchema,
} from "@meta-1/agent-types";
import { createI18nZodDto } from "@meta-1/nest-common";

export class NewChatSessionSchemaDto extends createI18nZodDto(NewChatSessionSchema) {}

export class NewChatSessionResultSchemaDto extends createI18nZodDto(NewChatSessionResultSchema) {}

export class ContinueChatSessionSchemaDto extends createI18nZodDto(ContinueChatSessionSchema) {}
