const Cursor = require('./Cursor');
const { Vector3, Quaternion } = require('../UnityClasses');

const floatSize = 4;
const intSize = 4;

class ByteWriter extends Cursor {
    writeInt(value) {
        this.dataSource.writeInt32LE(value, this.cursor);
        this.cursor += intSize;
    }
}

module.exports = ByteWriter;