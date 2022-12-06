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

app.get('/', (req, res) => {
  console.log('server default res');
  res.send('<h1>oklm</h1>');
});

server.listen(3000, () => {
  console.log('run in 3000');
});

io.on('connection', (socket) => {
  console.log('user co ' + socket.id);
  socket.on('msg', (msg) => {
    console.log(msg);
    msg = socket.id + ' : ' + msg;
    io.emit('msg', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disco');
  });
});
