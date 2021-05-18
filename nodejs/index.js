const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });
app.use(express.static(__dirname));

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('chat message', (msg, sender) => {
    io.emit('chat message', msg, sender); 
    io.emit('typing-stopped');
    console.log(msg);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  })
});

server.listen(80, () => {
  console.log('listening on *:80');
});