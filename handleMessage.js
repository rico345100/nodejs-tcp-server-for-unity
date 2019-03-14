const NetworkObjectManager = require('./NetworkObjectManager');
const { Vector3, Quaternion } = require('./UnityClasses');
const UnityInstance = require('./UnityInstance');
const { ByteReader, ByteWriter } = require('./Network');
const MessageType = require('./enums/MessageType');
const InstantiateType = require('./enums/InstantiateType');
const { byteSize, intSize, floatSize, vector3Size, quaternionSize } = require('./typeSize');
const { broadcast } = require('./utils/socket');

/**
 * Send ClientID to client
 * @param {net.Socket} socket
 */
function sendClientID(socket) {
    const buffer = Buffer.allocUnsafe(byteSize + intSize);
    const byteWriter = new ByteWriter(buffer);
    byteWriter.writeByte(MessageType.AssignID);
    byteWriter.writeInt(socket.clientID);
    
    socket.write(buffer);
}

/**
 * Synchronize Network objects 
 * @param {net.Socket} socket 
 */
function synchronizeNetworkObjects(socket) {
    const networkObjects = NetworkObjectManager.getObjects();
    const totalCount = networkObjects.length;
    let sendingBytes;

    if(socket.syncCount >= totalCount) {
        sendingBytes = Buffer.allocUnsafe(byteSize);
        sendingBytes[0] = MessageType.ServerRequestObjectSyncComplete;
        console.log('Nothing to Sync. Complete Instantiation...');
    } else {
        const uInstance = networkObjects[socket.syncCount];

        // Skip own objects
        if(uInstance.clientID == socket.clientID) {
            socket.syncCount++;
            return synchronizeNetworkObjects(socket);
        }

        sendingBytes = Buffer.allocUnsafe((byteSize * 2) + (intSize * 2) + vector3Size + quaternionSize);

        const byteWriter = new ByteWriter(sendingBytes);
        byteWriter.writeByte(MessageType.ServerRequestObjectSync);
        byteWriter.writeInt(uInstance.clientID);
        byteWriter.writeInt(uInstance.localID);
        byteWriter.writeByte(uInstance.instanceType);
        byteWriter.writeVector3(uInstance.position);
        byteWriter.writeQuaternion(uInstance.rotation);

        socket.syncCount++;
        console.log(`Send Request to Instantiate Object ${socket.syncCount} / ${totalCount}`);
    }

    socket.write(sendingBytes);
}

/**
 * Destroy all NetworkObject belongs to specified socket
 * @param {net.Socket} socket 
 */
function destroyNetworkObjects(socket) {
    const { clientID } = socket;
    const buffer = Buffer.allocUnsafe(byteSize + intSize);
    const byteWriter = new ByteWriter(buffer);
    byteWriter.writeByte(MessageType.DestroyNetworkObjects);
    byteWriter.writeInt(clientID);

    broadcast(buffer, socket);

    // Remove from Server
    NetworkObjectManager.removeObjectByClientID(socket.clientID);
}

/**
 * Parse Instantiate
 * @param {net.Socket} socket
 * @param {Buffer[]} data 
 */
function parseInstantiate(socket, data) {
    const byteReader = new ByteReader(data);
    const messageType = byteReader.readByte();
    const clientID = byteReader.readInt();

    const localID = byteReader.readInt();
    const instantiateType = byteReader.readByte();
    const position = byteReader.readVector3();
    const rotation = byteReader.readQuaternion();
    
    if(instantiateType == InstantiateType.Player) {
        console.log('Instantiating Player...');
    }

    const instance = new UnityInstance(instantiateType, clientID, localID, position, rotation);
    console.log('Saving Instance...');
    console.log(instance);

    NetworkObjectManager.addObject(instance);
    broadcast(data, socket);
}

/**
 * Parse Sync Transform
 * @param {net.Socket} socket 
 * @param {Buffer[]} data 
 */
function parseSyncTransform(socket, data) {
    // Just uncomment above lines if you want to see the data between sockets
    // const byteReader = new ByteReader(data);
    // const messageType = byteReader.readByte();
    // const clientID = byteReader.readInt();
    
    // const localID = byteReader.readInt();
    // const position = byteReader.readVector3();
    // const rotation = byteReader.readQuaternion();
    // const positionStr = `Vector3 (x: ${position.x}, y: ${position.y}, z: ${position.z})`;
    // const rotationStr = `Quaternion (x: ${rotation.x}, y: ${rotation.y}, z: ${rotation.z}, w: ${rotation.w})`;
    // console.log(`Sync Transform\nLocalID: ${localID}\nPosition: ${positionStr}\nRotation: ${rotationStr}`);

    broadcast(data, socket);
}

module.exports = {
    sendClientID,
    synchronizeNetworkObjects,
    destroyNetworkObjects,
    parseInstantiate,
    parseSyncTransform
};