import React, { useState } from "react";
import "./Sidebar.css";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import { Avatar, Button, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ChatIcon from "@mui/icons-material/Chat";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SidebarChat from "./SidebarChat";
import AddCommentIcon from "@mui/icons-material/AddComment";

import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import LoginIcon from "@mui/icons-material/Login";
import MapsUgcOutlinedIcon from "@mui/icons-material/MapsUgcOutlined";
import axios from "axios";

function Sidebar({ rooms, setRooms, handleSidebarChatClick, setUser }) {
  const [open, setOpen] = useState(false);
  const [newRoomInput, setNewRoomInput] = useState("");

  const [joinRoomDialog, setJoinRoomDialog] = useState(false);
  const [joinRoomInput, setJoinRoomInput] = useState("");

  const handleCloseDialog = () => {
    setOpen(false);
  };
  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleOpenJoinDialog = () => {
    setJoinRoomDialog(true);
  };

  const handleCloseJoinDialog = () => {
    setJoinRoomDialog(false);
  };

  const handleRoomCreation = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/rooms",
        {
          roomName: newRoomInput,
        },
        {
          withCredentials: true,
        }
      );

      setRooms([response.data, ...rooms]);
      handleCloseDialog();
    } catch (err) {
      alert("Failed Room Creation");
    }
  };

  const handleJoinRoom = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/join-room",
        {
          roomId: joinRoomInput,
        },
        {
          withCredentials: true,
        }
      );

      setUser(response.data.updatedUser);
      setRooms([response.data.room, ...rooms]);
      handleCloseJoinDialog();
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar
          src="https://gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50
"
        />
        <div className="sidebar__headerRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search or start new chat" />
        </div>
      </div>

      <div
        className="sidebar__addChat"
        style={{
          paddingLeft: "20px",
          borderTop: "1px solid #bdbdbd",
          borderBottom: "1px solid #bdbdbd",
        }}
      >
        <IconButton color="success" onClick={handleOpenDialog}>
          <MapsUgcOutlinedIcon />
        </IconButton>
        <span
          style={{ marginRight: "20px", fontSize: "16px", marginLeft: "-5px" }}
        >
          Add Room
        </span>
        <Dialog open={open} onClose={handleCloseDialog}>
          <DialogTitle>Add new Room</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Create personalized chat spaces tailored to your interests,
              passions, or projects.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="roomName"
              label="Room name"
              type="text"
              fullWidth
              variant="standard"
              value={newRoomInput}
              onChange={(e) => setNewRoomInput(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleRoomCreation}>Add</Button>
          </DialogActions>
        </Dialog>

        <IconButton>
          <LoginIcon color="success" onClick={handleOpenJoinDialog} />
        </IconButton>
        <span style={{ fontSize: "16px" }}>Join Room</span>

        {/* <Button
          style={{}}
          color="success"
          variant="outlined"
          disableElevation
          onClick={handleOpenJoinDialog}
          startIcon={<LoginIcon />}
        >
          Join Room
        </Button> */}
        <Dialog open={joinRoomDialog} onClose={handleCloseJoinDialog}>
          <DialogTitle>Join Room</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Join a room by entering the Room Id
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="roomId"
              label="Room Id"
              type="text"
              fullWidth
              variant="standard"
              value={joinRoomInput}
              onChange={(e) => setJoinRoomInput(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseJoinDialog}>Cancel</Button>
            <Button onClick={handleJoinRoom}>Join</Button>
          </DialogActions>
        </Dialog>
      </div>

      <div className="sidebar__chats">
        {rooms.map((room, index) => {
          const { _id, name } = room;
          return (
            <SidebarChat
              room={room}
              key={_id}
              _id={_id}
              name={name}
              handleSidebarChatClick={handleSidebarChatClick}
            />
          );
        })}

        {/* <SidebarChat />
        <SidebarChat />
        <SidebarChat /> */}
      </div>
    </div>
  );
}

export default Sidebar;
