const { getSockets } = require('./socket');

/**
 * Broadcast message to all clients except sender
 * @param {string|Buffer} message 
 * @param {net.Socket} senderSocket 
 */
function broadcast(message, senderSocket) {
    const sockets = getSockets();

    sockets.forEach(function(socket) {
        if(socket == senderSocket) return;

        socket.write(message);
    });
}

module.exports = {
    broadcast
};