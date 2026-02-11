"use client";

import { FC, PropsWithChildren } from "react";

import { cn } from "@meta-1/design";
import { Sidenav } from "./sidenav";
import "./style.css";

export type MainLayoutProps = PropsWithChildren<{
  className?: string;
}>;

export const MainLayout: FC<MainLayoutProps> = (props) => {
  const { className, children } = props;
  return (
    <div className={cn("layout flex h-screen bg-(--bg-color-layout)", className)}>
      <Sidenav />
      <div className="flex flex-1 flex-col p-1">
        <div className="flex-1 rounded-lg border border-white bg-background dark:border-border">{children}</div>
      </div>
    </div>
  );
};
