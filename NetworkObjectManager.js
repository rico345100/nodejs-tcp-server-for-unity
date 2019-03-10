const UnityInstance = require('./UnityInstance');
let m_NetworkObjects = [];

function getObjects() {
    return m_NetworkObjects;
}

function addObject(uInstance) {
    if (!(uInstance instanceof UnityInstance)) {
        throw new Error('Only Unity Instance can be added.');
    }

    m_NetworkObjects.push(uInstance);
}

function removeObject(uInstance) {
    if (!(uInstance instanceof UnityInstance)) {
        throw new Error('Only Unity Instance can be added.');
    }

    m_NetworkObjects.splice(m_NetworkObjects.indexOf(uInstance), 1);
}

/**
 * Remove NetworkObject by ClientID
 * @param {int} clientID 
 */
function removeObjectByClientID(clientID) {
    const newList = [];

    for(let i = 0; i < m_NetworkObjects.length; i++) {
        const networkObject = m_NetworkObjects[i];

        if(networkObject.clientID !== clientID) {
            newList.push(networkObject);
        }
    }

    m_NetworkObjects = newList;
}

module.exports = {
    getObjects,
    addObject,
    removeObject,
    removeObjectByClientID,
};