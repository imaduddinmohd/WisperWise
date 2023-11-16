const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo")(session);
const LocalStrategy = require("passport-local").Strategy;
const connection = require("./database");
const routes = require("./routes");
const path = require("path");
const User = connection.models.User;
const Room = connection.models.Room;

const bcrypt = require("bcrypt");
const { isatty } = require("tty");

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(express.static(path.join(__dirname, "frontend", "build")));

const server = http.createServer(app);

const sessionStore = new MongoStore({
  mongooseConnection: connection,
  collection: "sessions",
});

app.use(
  session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username })
      .then((user) => {
        if (!user) return done(null, false);
        bcrypt
          .compare(password, user.password)
          .then((isValid) => {
            if (isValid) return done(null, user);
            else return done(null, false);
          })

          .catch((err) => done(err));
      })
      .catch((err) => {
        done(err);
      });
  })
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((userId, done) => {
  User.findById(userId).then((user) => {
    done(null, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log(`User with id:${socket.id} connected`);

  socket.on("joinRooms", (rooms) => {
    rooms.forEach((room) => {
      socket.join(room);
    });
  });

  socket.on("sendMessage", async (data) => {
    let newRoom = await Room.updateOne(
      { _id: data.roomId },
      {
        $push: {
          messages: {
            sender: data.msg.sender,
            body: data.msg.body,
            time: getLocalTime(),
          },
        },
      }
    );

    newRoom = await Room.findById(data.roomId);

    io.to(data.roomId).emit("receiveMessage", newRoom);
  });

  //This is a new Event that the server is listening to

  socket.on("sendTyping", (data) => {
    socket.broadcast.emit("receiveTyping", data);
  });
});

app.use(routes);

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

server.listen(port, () => {
  console.log(`Server started listening on port:${port}`);
});
