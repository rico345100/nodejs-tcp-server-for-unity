const net = require('net');
const { broadcast } = require('./utils');
const { Vector3, Quaternion } = require('./UnityClasses');
const { MessageType } = require('./enums');
const { addSocket, removeSocket } = require('./socket');
const { ByteReader } = require('./NetworkUtil');

/**
 * Parse Unity Transform
 * @param {Buffer[]} data 
 */
function parseTransform(data) {
    // Each values are float type which takes 4 bytes each.
    const byteReader = new ByteReader(data, 1);
    const position = byteReader.readVector3();
    const rotation = byteReader.readQuaternion();
    console.log(position);
    console.log(rotation);
}

const server = net.createServer(function(socket) {
    socket.name = socket.remoteAddress + ":" + socket.remotePort;
    addSocket(socket);

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
        broadcast(`${socket.name} left the server.\n`);
        removeSocket(socket);
    });

    socket.on('error', function(err) {
        console.log('Error', err);
    });
});

server.listen(1337, () => console.log('Node.js TCP Server for Unity Multiplayer listening on port 1337...'));
