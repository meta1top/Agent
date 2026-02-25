import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { NewChatSessionResultSchemaDto, NewChatSessionSchemaDto } from "../dto";
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
}
