import type { FC, PropsWithChildren } from "react";
import type { Metadata } from "next";

import { HTMLLayout } from "@meta-1/web-common/components/layout/html";
import { RootLayout } from "@meta-1/web-common/components/layout/root";
import "@/plugin/rest.server";
import "@/plugin/locales";
import "@/assets/style/index.css";

import { getLocale } from "@meta-1/web-common/utils/locale.server";
import { HydrationBoundary } from "@meta-1/web-common/utils/query";
import { getTheme } from "@meta-1/web-common/utils/theme.server";
import { ServerStateLoader } from "@/components/common/server-state-loader";
import { dehydratedState } from "@/components/common/server-state-loader/state";

export type LayoutProps = PropsWithChildren;

export const metadata: Metadata = {
  icons: {
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32" },
      { url: "/favicon-16x16.png", sizes: "16x16" },
    ],
    other: [{ url: "/site.webmanifest", rel: "manifest" }],
  },
};

const Layout: FC<LayoutProps> = async (props) => {
  const locale = await getLocale();
  const theme = await getTheme();
  const state = await dehydratedState();
  return (
    <HTMLLayout>
      <RootLayout locale={locale} theme={theme}>
        <HydrationBoundary state={state}>
          <ServerStateLoader>{props.children}</ServerStateLoader>
        </HydrationBoundary>
      </RootLayout>
    </HTMLLayout>
  );
};

export default Layout;
