import z from "zod";

export const NewChatSessionSchema = z.object({
  message: z.string().describe("消息"),
});

export const NewChatSessionResultSchema = z.object({
  title: z.string().describe("标题"),
  sessionId: z.string().describe("会话 ID"),
});
