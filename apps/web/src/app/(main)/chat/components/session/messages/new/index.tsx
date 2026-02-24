import { useTranslation } from "react-i18next";

import { Textarea } from "@meta-1/design";
import SendFillIcon from "@/assets/icons/send-fill.svg";

export const NewSession = () => {
  const { t } = useTranslation();
  return (
    <div className="flex w-10/12 max-w-3xl flex-col gap-6">
      <div className="text-center font-medium text-xl">{t("你好，有什么可以帮忙的吗？")}</div>
      <div className="rounded-3xl border p-4 ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <Textarea
          className="resize-none border-none p-0 shadow-none focus-visible:outline-none focus-visible:ring-0 dark:bg-transparent"
          placeholder="请输入问题"
        />
        <div className="flex justify-end">
          <button
            className="flex size-8 items-center justify-center rounded-full bg-primary p-0 text-white hover:bg-primary/90 disabled:bg-primary/50"
            type="button"
          >
            <SendFillIcon className="mr-0.5 size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
