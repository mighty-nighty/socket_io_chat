const express = require('express');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

server.listen(3100);

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/index.html')
})