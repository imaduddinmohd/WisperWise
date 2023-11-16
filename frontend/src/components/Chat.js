import React, { useState, useEffect, useRef } from "react";
import "./Chat.css";
import { Avatar, IconButton } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import MoreVert from "@mui/icons-material/MoreVert";
import AttachFile from "@mui/icons-material/AttachFile";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import MicIcon from "@mui/icons-material/Mic";
import Message from "./Message";

function Chat({
  messages,
  user,
  sendMessage,
  roomId,
  roomName,
  socket,
  setActiveRoom,
}) {
  const [inputMessage, setInputMessage] = useState("");

  const [isTyping, setIsTyping] = useState({ typing: false, name: "" });

  const handleSendMessage = (e) => {
    e.preventDefault();
    const msg = {
      sender: {
        id: user._id,
        name: user.username,
      },

      body: inputMessage,
    };

    setInputMessage("");

    sendMessage(roomId, msg);
  };

  //useEffect here

  useEffect(() => {
    socket.on("receiveTyping", (data) => {
      setActiveRoom((prevActiveRoom) => {
        if (data.roomId == prevActiveRoom._id) {
          setIsTyping({ typing: true, name: data.username });
          setTimeout(() => {
            setIsTyping({ typing: false, name: "" });
          }, 2000);
        }

        return prevActiveRoom;
      });
    });
  }, []);

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar />
        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
          <p
            style={{
              color: "darkgreen",
              display: isTyping.typing ? "block" : "hidden",

              height: "10px",
            }}
          >
            {isTyping?.typing ? isTyping.name + " typing..." : ""}
          </p>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlinedIcon />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
        {messages.map((message) => {
          const { sender, time, body, _id } = message;
          const sent = sender.id == user._id ? true : false;
          return (
            <Message
              sent={sent}
              key={_id}
              sender={sender.name}
              time={time}
              body={body}
            />
          );
        })}

        {/* <p className="chat__message">
          <span className="chat__name">Sonny</span>
          This is a message
          <span className="chat__timestamp">{new Date().toUTCString()}</span>
        </p>
        <p className="chat__message">
          <span className="chat__name">Sonny</span>
          This is a message
          <span className="chat__timestamp">{new Date().toUTCString()}</span>
        </p>
        <p className="chat__receiver chat__message">
          <span className="chat__name">Sonny</span>
          This is a message
          <span className="chat__timestamp">{new Date().toUTCString()}</span>
        </p>
        <p className="chat__message">
          <span className="chat__name">Sonny</span>
          This is a message
          <span className="chat__timestamp">{new Date().toUTCString()}</span>
        </p> */}
      </div>

      <div className="chat__footer">
        <InsertEmoticonIcon />
        <form onSubmit={handleSendMessage}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => {
              socket.emit("sendTyping", {
                username: user.username,
                roomId: roomId,
              });
              setInputMessage(e.target.value);
            }}
            placeholder="Type a message"
          />
          <button type="submit">Send a message</button>
        </form>
        <MicIcon />
      </div>
    </div>
  );
}

export default Chat;
