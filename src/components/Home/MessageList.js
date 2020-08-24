import React from "react";
// Components
import MessageItem from "./MessageItem";

const MessageList = ({
  authUser,
  messages,
  onRemoveMessage,
  onEditMessage,
}) => (
  <ul>
    {messages.map((item) => (
      <MessageItem
        key={item.uid}
        authUser={authUser}
        message={item}
        onRemoveMessage={onRemoveMessage}
        onEditMessage={onEditMessage}
      />
    ))}
  </ul>
);

export default MessageList;
