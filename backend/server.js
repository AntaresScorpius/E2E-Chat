const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const httpserver = http.createServer(app);
app.use(cors());
app.use(express.json());
app.use(express.static('build'));

const {Server} = require('socket.io');

const io = new Server(httpserver, {cors: {origin: '*'}});

io.on('connection', (socket) => {
  // console.log('socket is : ', socket.id);
  socket.on('custom', (message) => {
    // console.log('message: ', message);
    socket.broadcast.emit('recieve', message);
  });

  socket.on('join', (roomName) => {
    socket.join(roomName);
    // socket.join(roomName + 'key');
    const size = io.sockets.adapter.rooms.get(roomName).size;
    if (size == 2) {
      io.to(roomName).emit('key', 'send key please');
    } else if (size > 2) {
      io.to(socket.id).emit('error', 'Room already Occupied');
    }
    // console.log(`${roomName} size is  ${size}`);
    // console.log(`${socket.id} wants to join ${roomName}`);
  });

  socket.on('chat', (msg) => {
    // console.log('chat', msg);
    let toRoom;
    if (socket.rooms.size === 2) {
      for (let r of socket.rooms) {
        toRoom = r;
      }
    } else {
      return;
    }
    // console.log('toRoom, ', toRoom);
    socket.to(toRoom).emit('chat', msg);
    // io.to(toRoom).emit('chat', msg);
  });
  socket.on('exchange', (jwk) => {
    // console.log('exhange', jwk);
    if (!jwk) return;
    let toRoom;
    if (socket.rooms.size === 2) {
      for (let r of socket.rooms) {
        toRoom = r;
      }
    } else {
      return;
    }
    // console.log('toRoom, ', toRoom);
    socket.to(toRoom).emit('exchange', jwk);
    // io.to(toRoom).emit('chat', msg);
  });
});

// app.get('/', (req, res) => {
//   res.send('hello');
// });

httpserver.listen(8080, () => console.log('server running on 8080'));
