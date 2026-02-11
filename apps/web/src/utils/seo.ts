import { st } from "@meta-1/web-common/utils/locale.server";

export const title = async (title: string) => {
  const titles = [await st("元神")];
  if (title) {
    titles.unshift(title);
  }
  return titles.join(" - ");
};

export const keywords = async (keyword?: string | string[]) => {
  const list = [await st("元文")];
  if (typeof keyword === "string") {
    list.push(keyword);
  } else if (Array.isArray(keyword)) {
    list.push(...keyword);
  }
  return list.join(", ");
};
