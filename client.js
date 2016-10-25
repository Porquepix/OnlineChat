module.exports = (chat, client) => {

    var clientData = null;
    
    client.on('login', user => {
        if (!user || !user.username) {
            client.emit('login', { status: false, message: 'Invalid username !' });
        } else if (chat.uidExists(user.username)) {
            client.emit('login', { status: false, message: 'This username is already taken !' });
        } else {
            clientData = chat.addUser(user.username, client, user);
            client.emit('login', { status: true });
            chat.sendInitialData(user.username);
        }
    });

    client.on('message', message => { 
        if (!clientData) {
            return;
        }      

        chat.broadcastConnectedUsers('message', { message, username: clientData.username });
    });

    client.on('writing', message => { 
        if (!clientData) {
            return;
        }      

        chat.broadcastConnectedUsers('writing', { username: clientData.username });
    });

    client.on('disconnect', function () {
        if (clientData) {
            chat.removeUser(clientData.username);
        }
    });

};