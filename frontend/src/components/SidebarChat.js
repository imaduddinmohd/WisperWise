import { Avatar } from "@mui/material";
import React from "react";
import "./SidebarChat.css";
function SidebarChat({ _id, name, handleSidebarChatClick, room }) {
  return (
    <div className="sidebarChat" onClick={() => handleSidebarChatClick(_id)}>
      <Avatar />
      <div className="sidebarChat__info">
        <h3>{name}</h3>
        <p>{room.messages[room.messages.length - 1].body}</p>
      </div>
    </div>
  );
}

export default SidebarChat;
