import { FC } from "react";

import { MessagesList } from "./list";
import { NewSession } from "./new";

export type MessagesProps = {
  sessionId?: string;
};

export const Messages: FC<MessagesProps> = (props) => {
  const { sessionId } = props;
  return (
    <div className="flex flex-1 items-center justify-center">
      {sessionId ? <MessagesList sessionId={sessionId} /> : <NewSession />}
    </div>
  );
};
