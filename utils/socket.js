const SocketManager = require('../SocketManager');

/**
 * Broadcast message to all clients except sender
 * @param {string|Buffer} message 
 * @param {net.Socket} senderSocket 
 */
function broadcast(message, senderSocket) {
    const sockets = SocketManager.getSockets();

    sockets.forEach(function(socket) {
        if(socket == senderSocket) return;

        socket.write(message);
    });
}

module.exports = {
    broadcast
};