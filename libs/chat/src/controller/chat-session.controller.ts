import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import {
  ContinueChatSessionSchemaDto,
  NewChatSessionResultSchemaDto,
  NewChatSessionSchemaDto,
} from "../dto";
import { ChatSessionService } from "../service";

@ApiTags("ChatSessionController")
@Controller("/api/chat/session")
export class ChatSessionController {
  constructor(private readonly chatSessionService: ChatSessionService) {}

  @Post("/create")
  @ApiOperation({ summary: "新建会话" })
  @ApiResponse({
    status: 200,
    type: NewChatSessionResultSchemaDto,
  })
  async create(@Body() dto: NewChatSessionSchemaDto) {
    return this.chatSessionService.create(dto.message);
  }

  @Post("/continue")
  @ApiOperation({ summary: "继续对话" })
  @ApiResponse({ status: 200, description: "消息已加入处理队列" })
  @ApiResponse({ status: 404, description: "会话不存在" })
  async continue(@Body() dto: ContinueChatSessionSchemaDto) {
    await this.chatSessionService.continue(dto.sessionId, dto.message);
  }
}
