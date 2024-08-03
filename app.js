const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});
app.get('/test', (req, res) => {
    console.log('test')
    let message = { "message": "halo kak", "senderNickname": "senderNickname" }
    io.emit('message', message)
});
io.on('connection', (socket) => {
        console.log('user connected')
        socket.on('join', function(userNickname) {
            console.log(userNickname + " : has joined the chat ");
            socket.broadcast.emit('userjoinedthechat', userNickname + " : has joined the chat ");
        })
        socket.on('messagedetection', (senderNickname, messageContent) => {
            console.log(senderNickname + " : " + messageContent)
            let message = { "message": messageContent, "senderNickname": senderNickname }
            io.emit('message', message)
        })
        socket.on('disconnect', function() {
            console.log(userNickname + ' has left ')
            socket.broadcast.emit("userdisconnect", ' user has left')
        })
    })
    // io.on('connection', (socket) => {
    //   console.log('a user connected');
    // });

server.listen(3000, () => {
    console.log('listening on *:3000');
});