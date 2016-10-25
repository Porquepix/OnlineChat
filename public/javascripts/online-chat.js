'use strict';

class OnlineChat extends Polymer.Element {

    static get is () { return 'online-chat'; }

    static get config() {
        return { 
            properties: {
                /** The url of the chat server */
                chatUrl: {
                    type: String,
                    observer: '_chatUrlChanged'
                }
            }
        };
    }

    /**
     * Observer function for the chatUrl.
     *
     * @event chat-url-changed
     * @param {String} chatUrl: the new chat url
     */
    _chatUrlChanged (chatUrl) {
        // If a socket already exists, close it
        if (this.socket) {
            this.socket.close();
        }

        this.socket = io(chatUrl);
    }

}

customElements.define(OnlineChat.is, OnlineChat);