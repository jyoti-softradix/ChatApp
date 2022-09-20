const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(__dirname + "/public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
const users = {};
io.on("connection", (socket) => {
  //   console.log("👾 New socket connected! >>", socket.id);

  // handles new connection
  socket.on("new user-joined", (name) => {
    // captures event when new clients join
    console.log("👾 New socket connected! >>", name);
    // adds user to list
    users[socket.id] = name;
    // emit welcome message event
    socket.broadcast.emit("user-joined", name);
  });

  // handles message posted by client
  socket.on("send", (message) => {
    // broadcast message to all sockets except the one that triggered the event
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });

  socket.on("disconnect", (message) => {
    // broadcast message to all sockets except the one that triggered the event
    socket.broadcast.emit("left", users[socket.id]);; 
    delete users[socket.id];
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
