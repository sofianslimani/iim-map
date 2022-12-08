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

let rooms = [];

function createRoom() {
  rooms.push({
    miam: new Date(new Date().getTime() + +(1 * 60 * 60 * 1000)),
    users: [],
  });
}

createRoom();

io.on('connection', (socket) => {
  // ROOMS

  let data = {
    roomId: -1,
    userId: -1,
  };

  socket.on('getRooms', (id) => {
    socket.emit('initRooms', rooms);
  });

  socket.on('selectRoom', (id) => {
    data.roomId = id;
    setTimeout(() => {
      socket.emit('initData', rooms[id].users, data.roomId);
    }, 600);
  });

  socket.on('newRoom', () => {
    createRoom();
    socket.emit('initRooms', rooms);
  });

  // MAP

  socket.on('login', (user) => {
    rooms[data.roomId].users.push(user);
    data.userId = user.id;
    socket.broadcast.emit('addUser', user, data.roomId);
  });

  socket.on('dragArrival', (position) => {
    socket.broadcast.emit('updateArrival', position);
  });

  socket.on('chat', (data, isCommand) => {
    isCommand
      ? socket.broadcast.emit('sendCommand', data, data.roomId)
      : socket.broadcast.emit('sendMessage', data, data.roomId);
  });

  socket.on('setMiam', (value, roomId) => {
    rooms[roomId].miam = new Date(new Date().setHours(parseInt(value), 0, 0));
    socket.emit('initRooms', rooms);
  });

  socket.on('newUserPosition', (id, position) => {
    socket.broadcast.emit('updateUserPosition', id, position);
  });

  function removeUser(userId, roomId) {
    rooms[roomId].users = rooms[roomId].users.filter(
      (user) => user.id !== userId
    );
    socket.broadcast.emit('removeUser', userId, roomId);
  }

  socket.on('removeUser', (id, roomdId) => {
    removeUser(id, roomdId);
  });

  socket.on('disconnect', () => {
    if (data.roomId !== -1 && data.userId !== -1)
      removeUser(data.userId, data.roomId);
  });
});
