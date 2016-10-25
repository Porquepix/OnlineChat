'use strict';

class ChatUsers extends Polymer.Element {

    static get is () { return 'chat-users'; }

    static get config() {
        return {
            properties: {
                /** The socket to use */
                socket: {
                    type: Object,
                    observer: '_socketChanged'
                },
                /** The list of all the user currently connected to the chat */
                _users: {
                    type: Object,
                    value: function() { return []; } // Use function to get a new array instance each time
                }
            } 
        };
    }

    constructor () {
        super();

        // Bind callback functions to get access to this element
        this._onUserConnection = this._onUserConnection.bind(this);
        this._onUserDisconnection = this._onUserDisconnection.bind(this);
    }

    /**
     * Observer function for the socket.
     *
     * @event socket-changed
     * @param {Object} newSocket: the new socket object
     * @param {Object} oldSocket: the old socket object
     */
    _socketChanged (newSocket, oldSocket) {
        // Detach all the callback binds to the old socket
        if (oldSocket) {
            this._unbindEventListeners(oldSocket);
        }
         // Attach all the callback to the new socket
        this._bindEventListeners();
    }

    /**
     * Attach all the callback needed by this element to the current socket.
     */
    _bindEventListeners () {
        this.socket.on('user-enter', this._onUserConnection);
        this.socket.on('user-leave', this._onUserDisconnection);
    }

    /**
     * Detach all the callback needed by this element to socket in parameter.
     *
     * @param {Object} socket: the socket
     */
    _unbindEventListeners (socket) {
        this.socket.off('user-enter', this._onUserConnection);
        this.socket.off('user-leave', this._onUserDisconnection);
    }

    /**
     * Callback function when a 'user-enter' event arrives in the socket.
     *
     * @param uid: the unique identifier of the user who enters
     */
    _onUserConnection (uid) {
        // Use this.push to notify Polymer of the change in the array
        this.push('_users', uid);
    }

    /**
     * Callback function when a 'user-leave' event arrives in the socket.
     *
     * @param uid: the unique identifier of the user who leaves
     */
    _onUserDisconnection (uid) {
        // Use this.pop to notify Polymer of the change in the array
        this.pop('_users', uid);
    }

    /**
     * Compare to uid. This function is used to sort all the connected user.
     *
     * @param uid1: the unique identifier of one user
     * @param uid2: the unique identifier of a second user
     */
    _sortUid (uid1, uid2) {
        return uid1.localeCompare(uid2);
    }

}

customElements.define(ChatUsers.is, ChatUsers);