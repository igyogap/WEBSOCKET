const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const os = require('os');

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});
app.get('/test', (req, res) => {
    console.log('test')
    let message = { "message": "halo kak", "senderNickname": "senderNickname" }
    io.emit('message', message)
    res.send(message);
});
io.on('connection', (socket) => {
    console.log('user connected')
    socket.on('join', function(userNickname) {
        console.log(userNickname + " : has joined the chat ");
        socket.broadcast.emit('userjoinedthechat', userNickname + " : has joined the chat ");
    })
    socket.on('connect', function() {
        console.log('Connected status onConnect', socket.socket.connected);
    });
    socket.on('messagedetection', (senderNickname, messageContent) => {
        console.log(senderNickname + " : " + messageContent)
        let message = { "message": messageContent, "senderNickname": senderNickname }
        io.emit('message', message)
    })
    socket.on('disconnect', () => {
        if (socket.userNickname) {
            console.log(`${socket.userNickname} has left`);
            socket.broadcast.emit("userdisconnect", `${socket.userNickname} has left the chat`);
        } else {
            console.log('A user has left');
            socket.broadcast.emit("userdisconnect", 'A user has left');
        }
    });
})

app.get('/sendmessage', (req, res) => {
    console.log('sendMessage')
    const message = req.query.text;
    if (!message) {
        return res.status(400).send('No message text provided');
    }

    // Broadcast message to all connected clients
    let send = { "message": message, "senderNickname": "" }
    io.emit('message', send)

    res.send(`Message broadcasted: ${message}`);
});

server.listen(3002, '0.0.0.0', () => {
    const networkInterfaces = os.networkInterfaces();
    const addresses = [];

    for (const interfaceName in networkInterfaces) {
        const interfaces = networkInterfaces[interfaceName];
        for (const interface of interfaces) {
            if (interface.family === 'IPv4' && !interface.internal) {
                addresses.push(interface.address);
            }
        }
    }

    console.log(`Server listening on ${addresses.join(', ')}:3002`);
});