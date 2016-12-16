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

    connections.push(conn);
    let number = connections.length;
    users.push(number);
    conn.on('data', msg => {
        msg = JSON.parse(msg);

        if (msg.name) {
            users[number - 1] = msg.name;
            // console.log(users);
            conn.write('welcome ' + users[number - 1]);
        } else {
            for (let i = 0; i < connections.length; i++) {
                let data = {
                    user: users[number - 1],
                    content: msg.value,
                    time: new Date().toTimeString()
                };
                // console.log(data);
                connections[i].write(JSON.stringify(data));
            }
        }

    });
    conn.on('close', () => {
        for (let i = 0; i < connections.length; i++) {
            connections[i].write('user' + number + ' disconnected!');
        }
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

