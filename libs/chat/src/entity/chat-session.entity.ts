import { Column, Entity } from "typeorm";

import { SnowflakeId } from "@meta-1/nest-common";

@Entity({
  name: "chat_session",
  comment: "会话",
})
export class ChatSession {
  @SnowflakeId()
  id: string;

  @Column({
    type: "varchar",
    length: 50,
    comment: "标题",
  })
  title: string;

  @Column({
    type: "varchar",
    length: 36,
    comment: "会话 ID",
  })
  sessionId: string;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    comment: "创建时间",
  })
  createTime: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
    comment: "更新时间",
  })
  updateTime: Date;
}
