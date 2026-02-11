import { FC } from "react";
import Link from "next/link";

import { cn, Tooltip } from "@meta-1/design";
import { Nav } from "../config";
import { useNavActive } from "./hooks";

export type SidenavItemProps = {
  nav: Nav;
};

export const SidenavItem: FC<SidenavItemProps> = (props) => {
  const { nav } = props;
  const activeNav = useNavActive();
  const isActive = activeNav === nav.id;
  return (
    <Tooltip content={nav.title} side="right">
      <div
        className={cn(
          "flex size-9 items-center justify-center rounded-lg",
          "[&_svg]:size-6",
          isActive && "bg-white text-(--bg-color-layout)",
        )}
        key={nav.href}
      >
        <Link href={nav.href}>{nav.icon}</Link>
      </div>
    </Tooltip>
  );
};
