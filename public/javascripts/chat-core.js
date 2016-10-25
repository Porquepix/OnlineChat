'use strict';

class ChatCore extends Polymer.Element {

    static get is () { return 'chat-core'; }

    static get config() {
        return { 
            properties: {
                socket: {
                    type: Object,
                    observer: '_socketChanged'
                },
                messages: {
                    type: Array,
                    value: function() { return []; }
                }
            }
        };
    }

    constructor () {
        super();

        this._onMessageSubmit = this._onMessageSubmit.bind(this);
        this._onMessageReception = this._onMessageReception.bind(this);
    }

    connectedCallback () {
        super.connectedCallback();

        this._interface = this.root.querySelector('#chat-interface');
        this._messagebox = this.root.querySelector('#messagebox');

        this._interface.addEventListener('submit',  this._onMessageSubmit);
        this._messagebox.focus();
    }

    _socketChanged (newSocket, oldSocket) {
        if (oldSocket) {
            this._unbindEventListeners(oldSocket);
        }
        this._bindEventListeners();
    }

    _bindEventListeners () {
        this.socket.on('message', this._onMessageReception);
    }

    _unbindEventListeners (socket) {
        socket.off('message', this._onMessageReception);
    }

    _onMessageSubmit (event) {
        event.preventDefault();

        const message = this._messagebox.value;
        if (message) {
            this.socket.emit('message', message);
            this._messagebox.value = '';
        }
    }

    _onMessageReception (message) {
        this.push('messages', message);
    }

}

customElements.define(ChatCore.is, ChatCore);