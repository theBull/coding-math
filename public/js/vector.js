var vector = {
    _x: 1,
    _y: 0,

    create: function(x, y) {
        var obj = Object.create(this);
        obj.setX(x);
        obj.setY(y);
        return obj;
    },

    setX: function(value) {
        this._x = value;
    },
    getX: function() {
        return this._x;
    },
    setY: function(value) {
        this._y = value;
    },
    getY: function() {
        return this._y;
    },

    setAngle: function(angle) {
        var length = this.getLength();
        this._x = Math.cos(angle) * length;
        this._y = Math.sin(angle) * length;
    },
    getAngle: function() {
        return Math.atan2(this._y, this._x);
    },

    setLength: function(length) {
        var angle = this.getAngle();
        this._x = Math.cos(angle) * length;
        this._y = Math.sin(angle) * length;
    },
    getLength: function() {
        return Math.sqrt(
            Math.pow(this._x,2) +
            Math.pow(this._y,2)
        );
    },

    /** adds the given vector to this vector and returns a new vector. */
    add: function(v2) {
        return vector.create(this._x + v2.getX(), this._y + v2.getY());
    },
    /** adds the given vector to this vector, modifying it in place. */
    addTo: function(v2) {
        this._x += v2.getX();
        this._y += v2.getY();
    },
    /** subtracts the given vector from this vector and returns a new vector. */
    subtract: function(v2) {
        return vector.create(this._x - v2.getX(), this._y - v2.getY());
    },
    /** subtracts the given vector from this vector, modifying it in place. */
    subtractFrom: function(v2) {
        this._x -= v2.getX();
        this._y -= v2.getY();
    },
    /** multiplies this vector by a given scalar value, returns a new vector. */
    multiply: function(val) {
        return vector.create(this._x * val, this._y * val);
    },
    /** multiplies this vector by a given scalar value, modifying it in place. */
    multiplyBy: function(val) {
        this._x *= val;
        this._y *= val;
    },
    /** divides this vector by a given scalar value, returns a new vector. */
    divide: function(val) {
        return vector.create(this._x / val, this._y / val);
    },
    /** multiplies this vector by a given scalar value, modifies it in place. */
    divideBy: function(val) {
        this._x /= val;
        this._y /= val;
    }
}