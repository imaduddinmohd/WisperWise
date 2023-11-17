import React, { useEffect, useState } from "react";
import "./Home.css";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

const socket = io.connect("/");

const Home = () => {
  const [rooms, setRooms] = useState([]);

  const [messages, setMessages] = useState([]);

  const [user, setUser] = useState({});

  const navigate = useNavigate();

  const [activeRoom, setActiveRoom] = useState({});

  const handleSidebarChatClick = (_id) => {
    const clickedRoom = rooms.find((room) => {
      return room?._id == _id;
    });

    setMessages(clickedRoom.messages);
    setActiveRoom(clickedRoom);
  };

  const sendMessage = (roomId, msg) => {
    try {
      socket.emit("sendMessage", { roomId, msg });
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    async function run() {
      let response;
      try {
        response = await axios.get("/api/home", {
          withCredentials: true,
        });

        let u = response?.data?.user || []; // u means user
        setUser(u);
        const r = response?.data?.rooms || [];

        setRooms(r);
        setMessages(r?.[0]?.messages || []); // messages state here means the messages in the chat that is open

        setActiveRoom(r?.[0]); // I am managing the activeRoom state because when the user sends a message, it should be added to active room.

        //Join all the rooms of the current logged in user

        socket.emit("joinRooms", u?.rooms);

        socket.on("receiveMessage", (updatedRoom) => {
          setActiveRoom((prevActiveRoom) => {
            if (prevActiveRoom._id == updatedRoom._id) {
              setMessages(updatedRoom.messages);
            }

            return prevActiveRoom;
          });

          setRooms((prevRooms) => {
            let newRooms = prevRooms.map((r) => {
              if (r?._id == updatedRoom?._id) return updatedRoom;

              return r;
            });

            return newRooms;
          });
        });
      } catch (err) {
        navigate("/");
      }
    }

    run();
  }, []);

  useEffect(() => {}, []);

  return (
    <div className="app__body">
      <Sidebar
        rooms={rooms}
        setRooms={setRooms}
        handleSidebarChatClick={handleSidebarChatClick}
        setUser={setUser}
        socket={socket}
      />
      <Chat
        messages={messages}
        sendMessage={sendMessage}
        roomId={activeRoom?._id}
        setActiveRoom={setActiveRoom}
        user={user}
        roomName={activeRoom?.name}
        socket={socket}
      />
    </div>
  );
};

export default Home;
