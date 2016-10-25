const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

// The port on which the chat server will listen
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

// Create the HTTP server with express
const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

// Create the server socket with socket.io
const io = socketIO(server);

// Create the chat instance
require('./chat.js')(io)();