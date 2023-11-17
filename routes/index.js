const express = require("express");
const router = express.Router();
const connection = require("../database");
const User = connection.models.User;
const passport = require("passport");
const bcrypt = require("bcrypt");
const Room = require("../models/room");
const _ = require("lodash");

router.post(
  "/api/login",
  passport.authenticate("local", { successRedirect: "/api/login-success" })
);

router.get("/api/login-success", (req, res) => {
  res.send("Authenticated");
});

router.get("/api/logout", (req, res) => {
  req.logout();
  return res.status(200).send("User Logged Out");
});

router.get("/api/home", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const rooms = await Room.find({ _id: { $in: [...req.user.rooms] } });

      return res.send({
        user: req.user,
        rooms: rooms,
      });
    } catch (err) {
      return res.status(500).send("Database Error while fetching Rooms");
    }
  }

  return res.status(400).send("Cannot access home without login");
});

router.get("/api/login", (req, res) => {
  if (req.isAuthenticated()) return res.status(200).send("Authenticated");
  return res.status(400).send("sfsdfsdf");
});

router.post("/api/rooms", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const newRoom = new Room({
        name: req.body.roomName,
        members: 1,
        messages: [
          {
            sender: { id: req.user._id, name: req.user.username },
            body: "Welcome to WisperWise",
            time: getLocalTime(),
          },
        ],
      });

      await newRoom.save();

      // update the user's rooms

      const updatedUser = await User.updateOne(
        { _id: req.user._id },
        {
          $set: {
            rooms: [...req.user.rooms, newRoom._id],
          },
        }
      );

      return res.status(201).send(newRoom);
    } catch (err) {
      return res.status(400).send("not able to create a room");
    }
  }
});

router.post("/api/register", async (req, res) => {
  let user = await User.findOne({ username: req.body.username });
  if (user) return res.status(400).send("user already exist");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  user = new User({
    username: req.body.username,
    password: hashedPassword,
    rooms: [],
  });

  await user.save();

  res.status(201).send("user registered");
});

router.post("/api/join-room", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const room = await Room.findById(req.body.roomId);
      if (!room)
        return res.status(404).send("Room with given id does not exist");

      room.set({
        members: room.members + 1,
      });
      await room.save();

      let updatedUser = await User.findById(req.user.id);

      updatedUser.set({
        rooms: [...updatedUser.rooms, room._id],
      });

      updatedUser = await updatedUser.save();
      return res.status(200).send({ updatedUser, room });
    } catch (err) {}
  }
});

const getLocalTime = () => {
  const localDate = new Date();

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Get local time components
  const localYear = localDate.getFullYear();
  const localMonth = months[localDate.getMonth()]; // Months are zero-indexed, so add 1
  const localDateNo = localDate.getDate();
  const localHours = localDate.getHours();
  const localMinutes = localDate.getMinutes();
  const localSeconds = localDate.getSeconds();

  const localDay = daysOfWeek[localDate.getDay()];

  return `${localDay}, ${localDateNo} ${localMonth} ${localYear} ${localHours}:${localMinutes}`;
};

module.exports = router;
