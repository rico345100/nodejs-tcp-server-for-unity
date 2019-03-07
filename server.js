const net = require('net');
const SocketManager = require('./SocketManager');
const NetworkObjectManager = require('./NetworkObjectManager');
const { Vector3, Quaternion } = require('./UnityClasses');
const { ByteReader } = require('./NetworkUtil');
const { broadcast } = require('./utils/socket');
const MessageType = require('./enums/MesssageType');

let socketCounter = 0;    // This value will use for distinguish client for each transmission

/**
 * Parse Unity Transform
 * @param {Buffer[]} data 
 */
function parseTransform(data) {
    // Each values are float type which takes 4 bytes each.
    const byteReader = new ByteReader(data, 1);
    const id = byteReader.readInt();
    const position = byteReader.readVector3();
    const rotation = byteReader.readQuaternion();
    console.log('Client ID: ' + id);
    console.log(position);
    console.log(rotation);
}

const server = net.createServer(function(socket) {
    socket.name = socket.remoteAddress + ":" + socket.remotePort;
    socket.clientID = socketCounter++;
    SocketManager.addSocket(socket);
    console.log('New Client Connected: ' + socket.name);
    console.log('Assigned ID: ' + socket.clientID);

    // Send Client ID to client
    const buffer = Buffer.allocUnsafe(4);
    buffer.writeInt32LE(socket.clientID);

    socket.write(buffer);

    socket.on('data', function(data) {
        const byteReader = new ByteReader(data);
        const messageType = byteReader.readByte();
        const clientID = byteReader.readInt();
        const objectID = byteReader.readInt();

        console.log('Receive Message');
        console.log('MessageType: ' + messageType);
        console.log('ClientID: ' + clientID);
        console.log('ObjectID: ' + objectID);

        // Dispatch Message
        switch(messageType) {
            case MessageType.SyncTransform:
                console.log('Message Type: Sync Transform');
                parseTransform(data);
                break;
            default:
                console.log('Invalid Message Type!');
                return;
        }

        broadcast(data, socket);
    });

    socket.on('end', function() {
        console.log(`Client ${socket.clientID} Left.`);
        broadcast(`${socket.name} left the server.\n`, socket);
        SocketManager.removeSocket(socket);
    });

    socket.on('error', function(err) {
        console.log('Error', err);
    });
});

server.listen(1337, () => console.log('Node.js TCP Server for Unity Multiplayer listening on port 1337...'));
