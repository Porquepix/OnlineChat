'use strict';

class OnlineChat extends Polymer.Element {

    static get is () { return 'online-chat'; }

    static get config() {
        return { 
            properties: {
                chatUrl: {
                    type: String,
                    observer: '_chatUrlChanged'
                }
            }
        };
    }

    _chatUrlChanged (chatUrl) {
        if (this.socket) {
            this.socket.close();
        }

        this.socket = io(chatUrl);
    }

}

customElements.define(OnlineChat.is, OnlineChat);