const client = require('./client.js');

/*
 * Chat Server
 *
 * @param {Object} serverSocket: the server socket to use
 * @return {Function} function to call for strating the chat server
 */
module.exports = (serverSocket) => {

    // Function available in the chat server
    const chat = {};

    // All the connected users to the chat
    const users = [];

    /*
     * Add a user to the list of connected users.
     * Emit a 'user-enter' event to all the connected users.
     * This event contains data about the user.
     *
     * @param uid: the user unique identifier
     * @param {Object} userSocket: the socket of the user
     * @param {Object} userData: all other data about the user
     * @return {Object} the added user
     */
    chat.addUser = (uid, userSocket, userData) => {
        users[uid] = userData;
        users[uid].socket = userSocket;

        chat.broadcastConnectedUsers('user-enter', userData.username);

        return users[uid];
    };

    /*
     * Retrieve a conected user with his uid.
     *
     * @param uid: the user unique identifier
     * @return {Object} the user
     */
    chat.getUser = uid => {
        return users[uid];
    };

    /*
     * Check if a uid is already used by a connected user.
     *
     * @param uid: the user unique identifier
     * @return {Boolean} true if the uid is already used, false either.
     */
    chat.uidExists = uid => {
        return (uid in users);
    }

    /*
     * Remove a user from the list of connected users.
     * Emit a 'user-leave' event to all the connected users.
     * This event contains the uid of the user that was removed.
     *
     * @param uid: the user unique identifier
     */
    chat.removeUser = uid => {
        chat.broadcastConnectedUsers('user-leave', uid);

        delete users[uid];
    };

    /*
     * Broadcast an event with data to all the connected users.
     *
     * @param {String} event: the name of the event to brodcast
     * @param data: the data to send with the event
     */
    chat.broadcastConnectedUsers = (event, data) => {
        for (user in users) {
            users[user].socket.emit(event, data);
        };
    }

    /*
     * Send all the data needed by a fresh user to him.
     * This data contains for example the list of connected users.
     *
     * @param uid: the fresh user who needs the initial data
     */
    chat.sendInitialData = uid => {
        for (user in users) {
            if (user !== uid) {  
                users[uid].socket.emit('user-enter', users[user].username);
            }
        };
    };

    /*
     * Function to start the server.
     * The chat server will not listen any events until this function is callled. 
     */
    return () => {
        serverSocket.on('connection', (socket) => {
            // When a user comes, create a new client to handle him 
            client(chat, socket);
        });
    };

};

