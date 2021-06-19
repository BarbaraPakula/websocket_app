const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

const messages = [];
const users = [];


app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000')
});
const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);

  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);

  });

  socket.on('join', (userName) => {
    console.log('New user ' + socket.id + ' is logged.');
    users.push({ name: userName, id: socket.id });
    socket.broadcast.emit('newJoinChat', { author: 'ChatBot', content: `<B>${userName}</B> has joined the conversation!` });
    console.log('users', users);
  })

  socket.on('disconnect', () => {
    console.log('Oh, socket ' + socket.id + ' has left');
    findedUser = users.find(user => user.id == socket.id);
    if (findedUser != undefined) {
      socket.broadcast.emit('userLeftChat', { author: 'ChatBot', content: `<B>${findedUser.name}</B> has left the conversation... :(` });
    }
    users.splice(users.findIndex(user => user.id == socket.id), 1);
  });

  console.log('I\'ve added a listener on message and disconnect events \n');
});