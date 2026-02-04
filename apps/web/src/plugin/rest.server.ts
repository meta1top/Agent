// Rest 配置

import { get } from "@meta-1/web-common/utils/headers.server";
import { alias } from "@meta-1/web-common/utils/rest";

// 别名配置
alias({
  "@api": {
    url: "/api",
    headers: get,
  },
});
