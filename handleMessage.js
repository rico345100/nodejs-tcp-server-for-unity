const NetworkObjectManager = require('./NetworkObjectManager');
const { Vector3, Quaternion } = require('./UnityClasses');
const UnityInstance = require('./UnityInstance');
const { ByteReader, ByteWriter } = require('./Network');
const MessageType = require('./enums/MesssageType');
const InstantiateType = require('./enums/InstantiateType');
const { byteSize, intSize, floatSize, vector3Size, quaternionSize } = require('./typeSize');

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
        byteWriter.writeByte(uInstance.instanceType);
        byteWriter.writeInt(uInstance.clientID);
        byteWriter.writeInt(uInstance.localID);
        byteWriter.writeVector3(uInstance.position);
        byteWriter.writeQuaternion(uInstance.rotation);

        socket.syncCount++;
        console.log(`Send Request to Instantiate Object ${socket.syncCount} / ${totalCount}`);
    }

    socket.write(sendingBytes);
}

/**
 * Parse Instantiate
 * @param {Buffer[]} data 
 */
function parseInstantiate(data) {
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
}

/**
 * Parse Destroy
 * @param {Buffer[]} data 
 */
function parseDestroy(data) {
    
}

/**
 * Parse Unity Transform
 * @param {Buffer[]} data 
 */
function parseTransform(data) {
    const byteReader = new ByteReader(data);
    const messageType = byteReader.readByte();
    const clientID = byteReader.readInt();
    
    const localID = byteReader.readInt();
    const position = byteReader.readVector3();
    const rotation = byteReader.readQuaternion();
    console.log('Client ID: ' + clientID);
    console.log('Local ID: ' + localID);
    console.log(position);
    console.log(rotation);
}

module.exports = {
    sendClientID,
    synchronizeNetworkObjects,
    parseInstantiate,
    parseDestroy,
    parseTransform
};