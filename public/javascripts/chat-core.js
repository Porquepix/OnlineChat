'use strict';

class ChatCore extends Polymer.Element {

    static get is () { return 'chat-core'; }

    static get config() {
        return { 
            properties: {
                /** The socket to use */
                socket: {
                    type: Object,
                    observer: '_socketChanged'
                },
                /** The list of all the messages of the chat */
                _messages: {
                    type: Array,
                    value: function() { return []; } // Use function to get a new array instance each time
                }
            }
        };
    }

    constructor () {
        super();

        // Bind callback functions to get access to this element
        this._onMessageSubmit = this._onMessageSubmit.bind(this);
        this._onMessageReception = this._onMessageReception.bind(this);
    }

    connectedCallback () {
        super.connectedCallback();

        // Save some gui elements
        this._interface = this.root.querySelector('#chat-interface');
        this._messagebox = this.root.querySelector('#messagebox');

        this._interface.addEventListener('submit',  this._onMessageSubmit);
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
            socket.off('message', this._onMessageReception);
        }
        // Attach all the callback to the new socket
        this.socket.on('message', this._onMessageReception);
    }

    /**
     * Callback function when the form is submitted (post a message in the chat).
     *
     * @param {Object} event: the submit event
     */
    _onMessageSubmit (event) {
        event.preventDefault();

        const message = this._messagebox.value;
        if (message) {
            this.socket.emit('message', message);
            this._messagebox.value = '';
        }
    }

    /**
     * Callback function when a 'message' event arrives in the socket.
     *
     * @param {String} message: the message contained in the event
     */
    _onMessageReception (message) {
        // Use this.push to notify Polymer of the change in the array
        this.push('_messages', message);
    }

}

customElements.define(ChatCore.is, ChatCore);