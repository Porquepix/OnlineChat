# OnlineChat

OnlinChat is a personal project of building a chat with NodeJS and socket.io to discorver Node.  
The chat is available here: https://sleepy-plains-61985.herokuapp.com/ (working only on Chrome Canary). 

This project is composed of two parts: 
- WebServer: the server which sends response to the user request. This server provides all the client parts of socket.io. It's build with NodeJS and the express framework. The client application is build with native custom elements and Polymer.
- ChatServer: the server which contains the logic to handle all the chat functionalities. This server is build with NodeJS and socket.io.

This two parts have their own branch in this repo.

## Installation

1. Download this project.
2. Run `npm install` in the WebServer and in the ChatServer.
3. If you are on Windows, run `bower install` in the WebServer.
4. Define the `CHATURL` variable (In Windows, `set CHARURL=...`).
5. Run `npm start` in the WebServer and in the ChatServer.


