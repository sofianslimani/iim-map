const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const socketIo = require('socket.io');

const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

io.on('connection', (socket) => {
  console.log('connexion');

  socket.on('login', (users) => {
    console.log('login', users);
  });
});
