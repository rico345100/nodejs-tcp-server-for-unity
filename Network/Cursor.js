function Cursor(dataSource, initOffset = 0) {
    this.dataSource = dataSource;
    this.cursor = initOffset;
}
Cursor.prototype.ResetCursor = function() {
    this.cursor = 0;
}
Cursor.prototype.MoveCursor = function(offset) {
    this.cursor = offset;
}

module.exports = Cursor
