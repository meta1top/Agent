import { Injectable } from "@nestjs/common";

import { ModelService } from "./model.service";

export type InvokeOptions = {
  message: string;
};

export type InvokeResult = {
  content: string;
};

@Injectable()
export class ChatService {
  constructor(private readonly modelService: ModelService) {}

  async invoke(options: InvokeOptions): Promise<InvokeResult> {
    const model = this.modelService.getChatModel();
    const response = await model.invoke(options.message);
    const content = typeof response.content === "string" ? response.content : String(response.content ?? "");
    return { content };
  }
}
