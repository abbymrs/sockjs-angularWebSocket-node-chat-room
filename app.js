const http = require('http');
const sockjs = require('sockjs');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/src'));
app.use(express.static(__dirname + '/node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.all('*', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

let num = 0;
let connections = [];
let users = [];
let sock = sockjs.createServer();
sock.on('connection', conn => {

    connections.push(conn); // add new connection to connections list
    let number = connections.length; // specify the connected number when has new connection
    users.push(number);
    conn.on('data', msg => {
        msg = JSON.parse(msg);
        if (msg.name) {
            // login
            let newUser;
            users[number - 1] = msg.name; // change new connected number to user name which user submit when login
            newUser = users[number - 1];
            // console.log(users);
            let data = {
                welcomeMsg: newUser + ' is online',
                users: users
            };
            for (let i = 0; i < connections.length; i++) {
                connections[i].write(JSON.stringify(data)); // send the new user is online to all connection users
            }
        } else {
            // chat messages
            for (let i = 0; i < connections.length; i++) {
                let data = {
                    user: users[number - 1],
                    content: msg.value,
                    time: new Date().toTimeString(),
                    users: users
                };
                connections[i].write(JSON.stringify(data));
            }
        }

    });
    conn.on('close', () => {
        // when the user is offline, remove this user from users list
        user = users.splice(number-1,1);
        for (let i = 0; i < connections.length; i++) {
            let data = {
                disconnectMsg:user[0] + ' is disconnected!',
                time: new Date().toTimeString(),
                users: users
            };
            connections[i].write(JSON.stringify(data)); // tell all the online users that this user is offline
        }
        connections.splice(number-1,1); // remove this connection from connections list
    });
    conn.on('error', (e) => {
        console.log(e);
    });

});

const PORT = process.env.PORT || 3000;
const server = http.createServer(app).listen(PORT, () => {
    console.log('express server port: ' + PORT);
});
sock.installHandlers(server, { prefix: '/echo' });

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/views/index.html');
});

