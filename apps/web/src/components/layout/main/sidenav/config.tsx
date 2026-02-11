import { useTranslation } from "react-i18next";

import ChatIcon from "@/assets/icons/chat.svg";
import KnowledgeBaseIcon from "@/assets/icons/knowledge-base.svg";
import MemoryIcon from "@/assets/icons/memory.svg";
import TodoIcon from "@/assets/icons/todo.svg";

export type Nav = {
  id: string;
  title: string;
  icon: React.ReactNode;
  href: string;
};

export const useNavs = (): Nav[] => {
  const { t } = useTranslation();
  return [
    {
      id: "chat",
      title: t("会话"),
      icon: <ChatIcon />,
      href: "/chat",
    },
    {
      id: "knowledge-base",
      title: t("知识库"),
      icon: <KnowledgeBaseIcon />,
      href: "/knowledge-base",
    },
    {
      id: "memory",
      title: t("记忆"),
      icon: <MemoryIcon />,
      href: "/memory",
    },
    {
      id: "todo",
      title: t("待办事项"),
      icon: <TodoIcon />,
      href: "/todo",
    },
  ];
};
