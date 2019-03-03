/**
 * Broadcast message to all clients except sender
 * @param {string} message 
 * @param {Socket} senderSocket 
 */
function broadcast(message, senderSocket) {
    sockets.forEach(function(socket) {
        if(socket == senderSocket) return;

        socket.write(message);
    });
}

module.exports = {
    broadcast
};