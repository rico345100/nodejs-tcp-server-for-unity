const Cursor = require('./Cursor');
const { Vector3, Quaternion } = require('../UnityClasses');
const { floatSize, intSize } = require('../typeSize');

class ByteReader extends Cursor {
    readInt() {
        const value = this.dataSource.readInt32LE(this.cursor);
        this.cursor += intSize;

        return value;
    }

    readVector3() {
        const x = this.dataSource.readFloatLE(this.cursor + (floatSize * 0));
        const y = this.dataSource.readFloatLE(this.cursor + (floatSize * 1));
        const z = this.dataSource.readFloatLE(this.cursor + (floatSize * 2));
        this.cursor += floatSize * 3;
        
        return new Vector3(x, y, z);
    }

    readQuaternion() {
        const x = this.dataSource.readFloatLE(this.cursor + (floatSize * 0));
        const y = this.dataSource.readFloatLE(this.cursor + (floatSize * 1));
        const z = this.dataSource.readFloatLE(this.cursor + (floatSize * 2));
        const w = this.dataSource.readFloatLE(this.cursor + (floatSize * 3));
        this.cursor += floatSize * 4;
        
        return new Quaternion(x, y, z, w);
    }

    readByte() {
        const value = this.dataSource[this.cursor];
        this.cursor++;

        return value;
    }
}

module.exports = ByteReader;