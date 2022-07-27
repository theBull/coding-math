var particle = {
    position: null,
    velocity: null,
    gravity: null,
    mass: 1,
    radius: 0,
    fill: 'black',
    bounce: -0.7, // how much velocity is lost on a collision (90% each)
    friction: 1, // how much velocity is lost per frame by friction percentage multiplier (1=100%, no friction)

    create: function(x, y, speed, direction, grav) {
        var obj = Object.create(this);
        obj.position = vector.create(x, y);
        obj.velocity = vector.create(0, 0);
        obj.velocity.setLength(speed);
        obj.velocity.setAngle(direction);
        obj.gravity = vector.create(0, grav || 0);
        return obj;
    },

    update: function() {
        this.velocity.multiplyBy(this.friction); // more performant, less accurate than using a friction vector
        this.velocity.addTo(this.gravity);
        this.position.addTo(this.velocity);
    },

    accelerate: function(accel) {
        this.velocity.addTo(accel);
    },

    angleTo: function(p2) {
        return Math.atan2(
            p2.position.getY() - this.position.getY(),
            p2.position.getX() - this.position.getX()
        );
    },

    distanceTo: function(p2) {
        let dx = p2.position.getX() - this.position.getX(),
            dy = p2.position.getY() - this.position.getY();
        return Math.sqrt(dx * dx + dy * dy);
    },

    gravitateTo: function(p2) {
        let grav = vector.create(0, 0),
            dist = this.distanceTo(p2);
        grav.setLength(p2.mass / (dist * dist));
        grav.setAngle(this.angleTo(p2));
        this.accelerate(grav);
    },

    // miscellaneous
    randomRGB: () => {
        let r = Math.round(Math.random() * 255);
        let g = Math.round(Math.random() * 255);
        let b = Math.round(Math.random() * 255);
        return `rgb(${r}, ${g}, ${b})`;
    }
}