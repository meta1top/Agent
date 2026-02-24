"use client";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@meta-1/design";
import { List } from "./session/list";
import { Messages } from "./session/messages";

export const Page = () => {
  return (
    <ResizablePanelGroup className="h-full min-h-0" direction="horizontal">
      <ResizablePanel
        className="flex flex min-h-0 max-w-[360px] flex-col rounded-l-lg bg-(--bg-color-layout)/10"
        defaultSize={30}
      >
        <List />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel className="flex" defaultSize={70}>
        <Messages />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
