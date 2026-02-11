import { useNavs } from "./config";
import { SidenavItem } from "./item";
import { SidenavSettings } from "./settings";

export const Sidenav = () => {
  const navs = useNavs();
  return (
    <div className="flex w-[var(--sidenav-width)] flex-col items-center gap-4 px-2 py-4 text-white">
      <div className="size-8 bg-[url('@/assets/image/logo.png')] bg-center bg-cover bg-no-repeat" />
      <ul className="flex flex-1 flex-col gap-1">
        {navs.map((nav) => (
          <li key={nav.id}>
            <SidenavItem nav={nav} />
          </li>
        ))}
      </ul>
      <SidenavSettings />
    </div>
  );
};
