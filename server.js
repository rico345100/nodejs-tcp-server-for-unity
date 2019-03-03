const net = require('net');
const { broadcast } = require('./utils');
const { Vector3, Quaternion } = require('./UnityClasses');
const { MessageType } = require('./enums');

const sockets = [];

/**
 * Parse Unity Transform
 * @param {Buffer[]} data 
 */
function parseTransform(data) {
    // Each values are float type which takes 4 bytes each.
    const offset = 1;
    const floatSize = 4;

    for(let i = offset; i < data.length; i++) {

    }
}

const server = net.createServer(function(socket) {
    socket.name = socket.remoteAddress + ":" + socket.remotePort;
    sockets.push(socket);

    socket.write(`Welcome, ${socket.name}!\n`);
    broadcast(`${socket.name} joined the server.\n`, socket);

    socket.on('data', function(data) {
        const messageType = data[0];

        switch(messageType) {
            case MessageType.SyncTransform:
                console.log('Message Type: Sync Transform');
                parseTransform(data);
                break;
            default:
                console.log('Invalid Message Type!');
                return;
        }
    });

    socket.on('end', function() {
        sockets.splice(sockets.indexOf(socket), 1);
        broadcast(`${socket.name} left the server.\n`);
    });

    socket.on('error', function(err) {
        console.log('Error', err);
    });
});

server.listen(1337, () => console.log('Node.js TCP Server for Unity Multiplayer listening on port 1337...'));