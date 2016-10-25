const client = require('./client.js');

module.exports = (serverSocket) => {

    const chat = {};
    const users = [];

    chat.addUser = (uid, userSocket, userData) => {
        users[uid] = userData;
        users[uid].socket = userSocket;

        chat.broadcastConnectedUsers('user-enter', userData.username);

        return users[uid];
    };

    chat.getUser = uid => {
        return users[uid];
    };

    chat.uidExists = uid => {
        return (uid in users);
    }

    chat.removeUser = uid => {
        chat.broadcastConnectedUsers('user-leave', users[uid].username);

        delete users[uid];
    };

    chat.broadcastConnectedUsers = (event, data) => {
        for (user in users) {
            users[user].socket.emit(event, data);
        };
    }

    chat.sendInitialData = uid => {
        for (user in users) {
            if (user !== uid) {  
                users[uid].socket.emit('user-enter', users[user].username);
            }
        };
    };

    return () => {
        serverSocket.on('connection', (socket) => {
            client(chat, socket);
        });
    };

};

