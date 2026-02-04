import enUSZod from "zod-i18n-map/locales/en/zod.json";
import zhCNZod from "zod-i18n-map/locales/zh-CN/zod.json";
import zhTWZod from "zod-i18n-map/locales/zh-TW/zod.json";

import enUSEditor from "@meta-1/editor/locales/en";
import zhCNEditor from "@meta-1/editor/locales/zh-CN";
import zhTWEditor from "@meta-1/editor/locales/zh-TW";
import enUS from "../../../../locales/en.json";
import zhCN from "../../../../locales/zh-CN.json";
import zhTW from "../../../../locales/zh-TW.json";

export const baseResources = {
  "zh-CN": {
    zod: zhCNZod,
    translation: {
      ...zhCN,
      ...zhCNEditor,
    },
  },
  "zh-TW": {
    zod: zhTWZod,
    translation: {
      ...zhTW,
      ...zhTWEditor,
    },
  },
  "en-US": {
    zod: enUSZod,
    translation: {
      ...enUS,
      ...enUSEditor,
    },
  },
};
