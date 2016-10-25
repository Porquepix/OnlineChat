'use strict';

class ChatUsers extends Polymer.Element {

    static get is () { return 'chat-users'; }

    static get config() {
        return {
            properties: {
                socket: {
                    type: Object,
                    observer: '_socketChanged'
                },
                users: {
                    type: Object,
                    value: function() { return []; }
                }
            } 
        };
    }

    constructor () {
        super();

        this._onUserConnection = this._onUserConnection.bind(this);
        this._onUserDisconnection = this._onUserDisconnection.bind(this);
    }

    _socketChanged (newSocket, oldSocket) {
        if (oldSocket) {
            this._unbindEventListeners(oldSocket);
        }
        this._bindEventListeners();
    }

    _bindEventListeners () {
        this.socket.on('user-enter', this._onUserConnection);
        this.socket.on('user-leave', this._onUserDisconnection);
    }

    _unbindEventListeners (socket) {
        this.socket.off('user-enter', this._onUserConnection);
        this.socket.off('user-leave', this._onUserDisconnection);
    }

    _onUserConnection (uid) {
        this.push('users', uid);
    }

    _onUserDisconnection (uid) {
        this.pop('users', uid);
    }

    _sortUid (uid1, uid2) {
        return uid1.localeCompare(uid2);
    }

}

customElements.define(ChatUsers.is, ChatUsers);