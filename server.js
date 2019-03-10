const net = require('net');
const SocketManager = require('./SocketManager');
const { ByteReader } = require('./Network');
const { broadcast } = require('./utils/socket');
const MessageType = require('./enums/MesssageType');
const {
    sendClientID,
    synchronizeNetworkObjects,
    parseInstantiate,
    parseDestroy,
    parseTransform
} = require('./handleMessage');

let socketCounter = 0;    // This value will use for distinguish client for each transmission

const server = net.createServer(function(socket) {
    socket.name = socket.remoteAddress + ":" + socket.remotePort;
    socket.clientID = socketCounter++;
    socket.syncCount = 0;   // Check for Sync Network Object Instantiation

    SocketManager.addSocket(socket);
    console.log('New Client Connected: ' + socket.name);
    console.log('Assigned ID: ' + socket.clientID);

    // Send Client ID to client
    sendClientID(socket);

    socket.on('data', function(data) {
        const byteReader = new ByteReader(data);
        const messageType = byteReader.readByte();
        const clientID = byteReader.readInt();
        
        console.log('Receive Message');
        console.log('MessageType: ' + messageType);
        console.log('ClientID: ' + clientID);

        // Dispatch Message
        switch(messageType) {
            case MessageType.ClientRequestObjectSync:
                console.log('Message Type: Client Request Object Sync');
                synchronizeNetworkObjects(socket);
                break;
            case MessageType.Instantiate:
                console.log('Message Type: Instantiate');
                parseInstantiate(data);
                break;
            case MessageType.Destroy:
                console.log('Message Type: Destroy');
                parseDestroy(data);
                break;
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
