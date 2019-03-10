const MessageType = {
    AssignID: 0,
    ClientRequestObjectSync: 10,
    ServerRequestObjectSync: 11,
    ServerRequestObjectSyncComplete: 12,
    Instantiate: 20,
    Destroy: 21,
    DestroyNetworkObjects: 22,
    SyncTransform: 30
};

module.exports = MessageType;