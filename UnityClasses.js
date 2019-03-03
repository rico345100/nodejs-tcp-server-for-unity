class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class Quaternion {
    constructor(x = 0, y = 0, z = 0, w = 0) {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 0;
    }
}

module.exports = {
    Vector3,
    Quaternion
};