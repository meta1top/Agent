import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { CommonConfig } from "@meta-1/agent-types";
import { Public } from "@meta-1/nest-security";
import { CommonConfigDto } from "../dto";

@ApiTags("ConfigController")
@Controller("/api/config")
export class ConfigController {
  @Public()
  @Get("/common")
  @ApiOperation({ summary: "获取公共配置", description: "获取公共配置" })
  @ApiResponse({
    status: 200,
    description: "获取公共配置成功",
    type: CommonConfigDto,
  })
  async common(): Promise<CommonConfig> {
    return {
      publicKey: "",
    };
  }
}
