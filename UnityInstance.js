class UnityInstance {
    constructor(instanceType, clientID, localID, position, rotation) {
        this.instanceType = instanceType;
        this.clientID = clientID;
        this.localID = localID;
        this.position = position;
        this.rotation = rotation;
    }
}

module.exports = UnityInstance;