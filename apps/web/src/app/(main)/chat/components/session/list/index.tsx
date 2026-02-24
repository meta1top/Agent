import { useTranslation } from "react-i18next";

import { Action, Empty, ScrollArea } from "@meta-1/design";
import PlusIcon from "@/assets/icons/plus.svg";

export const List = () => {
  const { t } = useTranslation();
  return (
    <div className="h-full min-h-0 flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-2 p-2">
          <Action className="gap-2 bg-white/50 shadow-sm dark:bg-white/15">
            <PlusIcon className="size-4" />
            <span>{t("新建会话")}</span>
          </Action>
          <Empty text={t("暂无会话")} />
        </div>
      </ScrollArea>
    </div>
  );
};
