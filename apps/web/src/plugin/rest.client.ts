import type { AxiosResponse } from "axios";

import type { RestResult } from "@meta-1/nest-types";
import bus from "@meta-1/web-common/events";
import { get } from "@meta-1/web-common/utils/headers.client";
// Rest 配置
import { alias, config } from "@meta-1/web-common/utils/rest";
import { UNAUTHORIZED } from "@/events/auth";

config({
  // biome-ignore lint/suspicious/noExplicitAny: onResponse
  onResponse: (data: RestResult<any>, response: AxiosResponse) => {
    const { url } = response.config;
    const { code } = data;
    if (code === 401 && !url?.includes("main/account/profile")) {
      bus.emit(UNAUTHORIZED);
    }
  },
});

// 别名配置
alias({
  "@api": {
    url: "/api",
    headers: get,
  },
});
