const UnityInstance = require('./UnityInstance');
const m_NetworkObjects = [];

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


module.exports = {
    getObjects,
    addObject,
    removeObject,
};