const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {

  socket.on("joinRoom", ({ name, room }) => {
    socket.name = name;
    socket.room = room;

    socket.join(room);

    io.to(room).emit("message", {
      user: "System",
      text: `${name} joined`,
    });
  });

  socket.on("sendMessage", (msg) => {
    if (!socket.room) return;

    io.to(socket.room).emit("message", {
      user: socket.name,
      text: msg,
    });
  });

  // 🔥 Typing indicator
  socket.on("typing", (name) => {
    socket.broadcast.to(socket.room).emit("typing", name);
  });

});

server.listen(5000, () => console.log("Server running on 5000"));