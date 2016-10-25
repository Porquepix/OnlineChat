/*
 * Client handler
 *
 * @param {Object} chat: the chat where is the client is connected
 * @param {Object} client: the socket of the user
 */
module.exports = (chat, client) => {

    // Data about the curent user (defined after the client has login)
    var clientData = null;
    
    /*
     * Login event handler.
     * This event is call when the user login.
     * This event has for data the username of the user who tries to login.
     * This event always responses with a 'login' event to the user which attemps to connect.
     * The response has for data the result of the login and an error message if the result is false.
     */
    client.on('login', user => {
        if (!user || !user.username) { // Check the validity of the username
            client.emit('login', { status: false, message: 'Invalid username !' });
        } else if (chat.uidExists(user.username)) { // Check if the username is already used in the chat
            client.emit('login', { status: false, message: 'This username is already taken !' });
        } else { // Username valid and available
            // The username is used as uid of user
            clientData = chat.addUser(user.username, client, user);
            client.emit('login', { status: true });
            chat.sendInitialData(user.username);
        }
    });

    /*
     * Message event handler.
     * This event is call when a connected user send a message.
     * This event has for data the message send by the user.
     * This event responses with a 'message' event to all connected users (or does nothing if the user is not logged).
     * The response has for data the message and the user who send it.
     */
    client.on('message', message => { 
        if (!clientData) { // If the current user is not logged
            return;
        }      

        chat.broadcastConnectedUsers('message', { message, username: clientData.username });
    });

    /*
     * TODO
     */
    client.on('writing', message => { 
        if (!clientData) { // If the current user is not logged
            return;
        }      

        chat.broadcastConnectedUsers('writing', { username: clientData.username });
    });

    /*
     * Disconnect event handler.
     * This event is call when a user leaves the chat.
     */
    client.on('disconnect', function () {
        if (clientData) { // If the current user is logged
            chat.removeUser(clientData.username);
        }
    });

};