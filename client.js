const WebSocket = require('ws');

const ws = new WebSocket('http://localhost:3002/');
// console.log(ws);
ws.on('open', () => {
    console.log('WebSocket connection opened.');
    ws.send('Hello, server!');
    console.log('Message Sending')
});

ws.on('message', (message) => {
    console.log('Received message from server:', message);
    ws.close();
});

ws.on('close', () => {
    console.log('WebSocket connection closed.');
});

ws.on('error', (error) => {
    console.error('WebSocket error:', error);
});