import React from "react";

const Message = ({ sender, time, body, sent }) => {
  return (
    <p className={`chat__message  ${sent ? "chat__receiver" : " "} `}>
      <span className="chat__name">{sender}</span>
      {body}
      <span className="chat__timestamp">{time}</span>
    </p>
  );
};

export default Message;
