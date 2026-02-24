"use client";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@meta-1/design";
import { List } from "./session/list";
import { Messages } from "./session/messages";

export const Page = () => {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel className="max-w-[360px] rounded-l-lg bg-(--bg-color-layout)/10" defaultSize={30}>
        <List />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={70}>
        <Messages />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
