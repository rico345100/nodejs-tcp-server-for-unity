const Cursor = require('./Cursor');
const { Vector3, Quaternion } = require('../UnityClasses');

const floatSize = 4;

class ByteReader extends Cursor {
    readInt() {

    }

    readFloat() {
        
    }

    readVector2() {

    }

    readVector3() {
        const x = this.dataSource.readFloatLE(this.cursor + (floatSize * 0));
        const y = this.dataSource.readFloatLE(this.cursor + (floatSize * 1));
        const z = this.dataSource.readFloatLE(this.cursor + (floatSize * 2));
        
        return new Vector3(x, y, z);
    }

    readQuaternion() {
        const x = this.dataSource.readFloatLE(this.cursor + (floatSize * 0));
        const y = this.dataSource.readFloatLE(this.cursor + (floatSize * 1));
        const z = this.dataSource.readFloatLE(this.cursor + (floatSize * 2));
        const w = this.dataSource.readFloatLE(this.cursor + (floatSize * 3));
        
        return new Quaternion(x, y, z, w);
    }

    readBytes() {

    }

    readByte() {

    }
}

module.exports = ByteReader;