import { FC } from "react";

import { ScrollArea } from "@meta-1/design";

export type MessagesListProps = {
  sessionId: string;
};

export const MessagesList: FC<MessagesListProps> = (props) => {
  const { sessionId } = props;

  console.log(sessionId);

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-2">
        <div>Messages1</div>
        <div>Messages2</div>
        <div>Messages3</div>
        <div>Messages4</div>
        <div>Messages5</div>
        <div>Messages6</div>
        <div>Messages7</div>
        <div>Messages8</div>
        <div>Messages9</div>
        <div>Messages10</div>
        <div>Messages11</div>
        <div>Messages12</div>
        <div>Messages13</div>
        <div>Messages14</div>
        <div>Messages15</div>
        <div>Messages16</div>
        <div>Messages17</div>
        <div>Messages18</div>
        <div>Messages19</div>
        <div>Messages20</div>
        <div>Messages21</div>
        <div>Messages22</div>
        <div>Messages23</div>
        <div>Messages24</div>
        <div>Messages25</div>
        <div>Messages26</div>
        <div>Messages27</div>
        <div>Messages28</div>
        <div>Messages29</div>
        <div>Messages30</div>
      </div>
    </ScrollArea>
  );
};
