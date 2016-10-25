// Require HTTP module (to start server) and Socket.IO
var http = require('http');
var io = require('socket.io');
var port = 80;


// Start the server at 80
var server = http.createServer(function (req, res) { 
    res.end();
});
server.listen(port);


// Create a Socket.IO instance, passing it our server
var socket = io.listen(server);

// Create the chat instance
require('./chat.js')(socket)();

console.log('Server running at localhost:' + port + '/');