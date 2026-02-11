import { useTranslation } from "react-i18next";

import { Empty, Popover, Tooltip } from "@meta-1/design";
import { ThemeSwitcher } from "@meta-1/web-common/components/theme-switcher";
import SettingsIcon from "@/assets/icons/settings.svg";

export const SidenavSettings = () => {
  const { t } = useTranslation();
  return (
    <Popover
      align="end"
      className="p-0 shadow-none"
      content={
        <div>
          <div className="p-2">
            <div className="font-medium text-sm">{t("设置")}</div>
            <div>
              <Empty text={t("暂无设置")} />
            </div>
          </div>
          <div className="flex items-center justify-end border-t px-2 py-1">
            <ThemeSwitcher size="sm" />
          </div>
        </div>
      }
      side="right"
    >
      <Tooltip content={t("设置")} side="right">
        <div className="flex size-9 items-center justify-center rounded-lg hover:bg-white/20">
          <SettingsIcon className="size-6" />
        </div>
      </Tooltip>
    </Popover>
  );
};
