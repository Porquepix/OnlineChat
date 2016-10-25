'use strict';

class ChatLogin extends Polymer.Element {

    static get is () { return 'chat-login'; }

    static get config() {
        return { 
            properties: {
                socket: {
                    type: Object,
                    observer: '_socketChanged'
                },
                isServerOnline: {
                    type: Boolean,
                    value: false
                },
                isUserLogged: {
                    type: Boolean,
                    value: false,
                    observer: '_isUserLoggedChanged'
                },
                loginStateClass: {
                    type: String,
                    computed: '_computeStateClass(isUserLogged)'
                },
                loginErrorMessage: String
            }
        };
    }

    constructor () {
        super();

        this._refreshServerStatus = this._refreshServerStatus.bind(this);
        this._onLoginRequest = this._onLoginRequest.bind(this);
        this._onLoginResponse = this._onLoginResponse.bind(this);
    }

    connectedCallback () {
        super.connectedCallback();

        this._loginPage = this.root.querySelector('#login');
        this._loginForm = this.root.querySelector('#login-form');
        this._usernameInput = this.root.querySelector('#username');

        this._loginForm.addEventListener('submit', this._onLoginRequest);
    }

    _socketChanged (newSocket, oldSocket) {
        if (oldSocket) {
            this.oldSocket.off('login', this._onLoginResponse);
        }

        this.socket.on('login', this._onLoginResponse);
    }

    _isUserLoggedChanged (isUserLogged) {
        if (!isUserLogged) {
            this.loginErrorMessage = '';
            requestAnimationFrame(this._refreshServerStatus);
        }
    }

    _computeStateClass (isUserLogged) {
        if (isUserLogged) {
            return 'login--logged';
        } 
        return '';
    }

    _refreshServerStatus () {
        if (this.socket && this.socket.connected) {
            if (!this.isServerOnline) {
                this.isServerOnline = true;
            }
        } else {
            if (this.isServerOnline) {
                this.isServerOnline = false;
            }
        }

        if (!this.isUserLogged) {
            requestAnimationFrame(_ => {
                setTimeout(this._refreshServerStatus, 2000);
            });
        }
    }

    _onLoginRequest (event) {
        event.preventDefault();
        this.socket.emit('login', { username: this._usernameInput.value });
    }

    _onLoginResponse (response) {
        if (response.status) {
            this._usernameInput.blur();
            this.isUserLogged = true;
        } else {
            this.displayErrorMessage(response.message);
        }
    }

    displayErrorMessage (message) {
        this.loginErrorMessage = message;
    }

}

customElements.define(ChatLogin.is, ChatLogin);