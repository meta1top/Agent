import { usePathname } from "next/navigation";

export const useNavActive = () => {
  const pathname = usePathname();
  return pathname.split("/").pop() || "chat";
};
