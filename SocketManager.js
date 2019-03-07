const m_Sockets = [];

/**
 * Get Sockets
 * @return {net.Socket[]}
 */
function getSockets() {
    return m_Sockets;
}

/**
 * Add Socket
 * @param {net.Socket} socket 
 */
function addSocket(socket) {
    m_Sockets.push(socket);
}

/**
 * Remove Socket
 * @param {net.Socket} socket 
 */
function removeSocket(socket) {
    m_Sockets.splice(m_Sockets.indexOf(socket), 1);
}

module.exports = {
    getSockets,
    addSocket,
    removeSocket,
};