const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/formatMessage");
const {
  joinRoom,
  getUser,
  leaveUser,
  getUsersOfRoom,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// set up static files
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("joinroom", ({ username, room }) => {
    const user = joinRoom(socket.id, username, room);

    socket.join(user.room);

    socket.emit("message", formatMessage("Chat Bot", "Welcome to chat"));

    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(
          "Chat Bot",
          `${user && user.username} has joined the chat`
        )
      );
    io.to(user && user.room).emit("getUsersAndRoom", {
      inRoom: room,
      users: getUsersOfRoom(room),
    });
  });

  socket.on("disconnect", () => {
    const user = leaveUser(socket.id);
    io.to(user && user.room).emit(
      "message",
      formatMessage(
        user && user.username,
        `${user && user.username} has left the chat`
      )
    );
  });

  socket.on("chatMessage", (msg) => {
    const user = getUser(socket.id);
    io.to(user && user.room).emit("message", formatMessage(user.username, msg));
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, console.log(`server running on port ${PORT}`));
