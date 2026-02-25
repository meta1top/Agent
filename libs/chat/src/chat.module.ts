import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CoreModule } from "@meta-1/agent-core";
import { ChatSessionController } from "./controller";
import { ChatSession } from "./entity";
import { ChatSessionService } from "./service";

@Module({
  controllers: [ChatSessionController],
  providers: [ChatSessionService],
  exports: [],
  imports: [TypeOrmModule.forFeature([ChatSession]), CoreModule],
})
export class ChatModule {}
