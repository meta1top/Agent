import type { Metadata } from "next";

import { st } from "@meta-1/web-common/utils/locale.server";
import { keywords, title } from "@/utils/seo";
import { Page } from "./chat/components";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await title(await st("首页")),
    keywords: await keywords(),
  };
}

export default Page;
