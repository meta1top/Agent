import { randomUUID } from "node:crypto";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { I18nContext } from "nestjs-i18n";
import { Repository } from "typeorm";

import { ChatAgentService } from "@meta-1/agent-core";
import { CacheableService } from "@meta-1/nest-common";
import { ChatSession } from "../entity";

@Injectable()
@CacheableService()
export class ChatSessionService {
  private readonly logger = new Logger(ChatSessionService.name);
  constructor(
    private readonly chatAgentService: ChatAgentService,
    @InjectRepository(ChatSession) private repository: Repository<ChatSession>,
  ) {}

  private async generateSessionId(): Promise<string> {
    return randomUUID();
  }

  private async generateTitle(message: string): Promise<string> {
    const language = I18nContext.current()?.lang ?? "en";
    const prompt = `用户正在创建一个新会话，会话内容是：
${message}
当前用户的界面语言：
${language}
请根据用户的需求，生成一个新会话的标题。
注意：
1. 标题必须简洁明了，能够准确描述会话内容；
2. 不超过20个字；
3. 只需要返回标题，不要返回多余的信息。`;
    this.logger.log(prompt);
    const result = await this.chatAgentService.invoke({
      message: prompt,
    });
    return result.content;
  }

  async create(message: string): Promise<ChatSession> {
    const sessionId = await this.generateSessionId();
    const title = await this.generateTitle(message);
    const session = this.repository.create({
      sessionId,
      title,
    });
    return this.repository.save(session);
  }
}
