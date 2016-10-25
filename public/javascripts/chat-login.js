'use strict';

class ChatLogin extends Polymer.Element {

    static get is () { return 'chat-login'; }

    static get config() {
        return { 
            properties: {
                /** The socket to use */
                socket: {
                    type: Object,
                    observer: '_socketChanged'
                },
                /** The online status of the server */
                _isServerOnline: {
                    type: Boolean,
                    value: false
                },
                /** The login state of the current user */
                _isUserLogged: {
                    type: Boolean,
                    value: false,
                    observer: '_isUserLoggedChanged'
                },
                /** The HTML class corresponding to the login state of the current user */
                _loginStateClass: {
                    type: String,
                    computed: '_computeStateClass(_isUserLogged)'
                },
                /** The error message if the login attempt fails */
                _loginErrorMessage: String
            }
        };
    }

    constructor () {
        super();

        // Bind callback functions to get access to this element
        this._refreshServerStatus = this._refreshServerStatus.bind(this);
        this._onLoginRequest = this._onLoginRequest.bind(this);
        this._onLoginResponse = this._onLoginResponse.bind(this);
    }

    connectedCallback () {
        super.connectedCallback();

        // Save some gui elements
        this._loginPage = this.root.querySelector('#login');
        this._loginForm = this.root.querySelector('#login-form');
        this._usernameInput = this.root.querySelector('#username');

        this._loginForm.addEventListener('submit', this._onLoginRequest);
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
            this.oldSocket.off('login', this._onLoginResponse);
        }
        // Attach all the callback to the new socket
        this.socket.on('login', this._onLoginResponse);
    }

    /**
     * Observer function for the login state of the user.
     *
     * @event is-user-logged-changed
     * @param {Boolean} _isUserLogged: the new state
     */
    _isUserLoggedChanged (_isUserLogged) {
        // If the user is not logged, we update the status of the server
        if (!_isUserLogged) {
            this._loginErrorMessage = '';
            requestAnimationFrame(this._refreshServerStatus);
        }
    }

    /**
     * Compute the HTML class corresponding to the login state of the current user.
     *
     * @param {Boolean} _isUserLogged: the login state of the current user
     */
    _computeStateClass (_isUserLogged) {
        if (_isUserLogged) {
            return 'login--logged';
        } 
        return '';
    }

    /**
     * Refresh the status (reachable or unreachable) of the server.
     */
    _refreshServerStatus () {
        // Test if the socket is connected to the server to determine the status
        if (this.socket && this.socket.connected) {
            if (!this._isServerOnline) {
                this._isServerOnline = true;
            }
        } else {
            if (this._isServerOnline) {
                this._isServerOnline = false;
            }
        }

        if (!this._isUserLogged) {
            requestAnimationFrame(_ => {
                setTimeout(this._refreshServerStatus, 2000);
            });
        }
    }

    /**
     * Callback function when the login form is submitted.
     *
     * @param {Object} event: the submit event
     */
    _onLoginRequest (event) {
        event.preventDefault();

        this.socket.emit('login', { username: this._usernameInput.value });
    }

    /**
     * Callback function when a 'login' event arrives in the socket.
     *
     * @param {Object} response: the response of the server to a login attempt
     */
    _onLoginResponse (response) {
        if (response.status) { // If the login succeded
            this._usernameInput.blur();
            this._isUserLogged = true;
        } else {
            this.displayErrorMessage(response.message);
        }
    }

    /**
     * Display an error message in the HTML view.
     *
     * @param {String} response: the message to display
     */
    displayErrorMessage (message) {
        this._loginErrorMessage = message;
    }

}

customElements.define(ChatLogin.is, ChatLogin);