window.addEventListener('load', () => {
    main.create();
});

// Logic for defining and creating lessons
var lesson = {
    id: null,
    title: null,
    description: null,
    ready: null,
    canvas: null,
    context: null,
    width: 0,
    height: 0,
    centerY: 0,
    centerX: 0,

    create: function(_id, _title, _description, _ready) {
        let obj = Object.create(this);
        obj.id = _id;
        obj.title = _title || 'Untitled';
        obj.description = _description || 'No description.';
        obj.ready = _ready || ((l) => { console.log('Lesson ready; no function defined.'); });
        obj.validate();
        return obj;
    },

    createCanvas: function() {
        // create HTML elements
        let ctnr = document.getElementById('lessons-container');
        let details = document.createElement('details');
        let summary = document.createElement('summary');
        let div = document.createElement('div');
        let p = document.createElement('p');
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('id', this.id);
        this.context = this.canvas.getContext('2d');
        summary.innerText = this.title;
        p.innerText = this.description;
        div.appendChild(p);
        div.append(this.canvas);
        details.appendChild(summary);
        details.appendChild(div);
        ctnr.appendChild(details);

        // initialize canvas dimensions
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight * 0.5;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.centerX = this.width * 0.5;
        this.centerY = this.height * 0.5;

        this.ready(this);
    },

    validate: function() {
        if(this.title === null || this.title === undefined) {
            throw Error(`Invalid lesson title: ${this.title}`);
        }
        if(this.description === null || this.description === undefined) {
            throw Error(`Invalid lesson description: ${this.description}`);
        }
        if(typeof this.ready != 'function')
            throw Error(`Invalid ready function: ${this.ready}`);
    }
}

// Logic for creating the canvases in the UI.
// Each lesson must be initialized using the "register(...)" method.
var main = {
    lessons: [],
    getLesson: function(id) {
        return this.lessons.first((el) => {
            return el.id === id;
        });
    },
    register: function(id, title, description, ready) {
        this.lessons.push(lesson.create(id, title, description, ready));
    },
    create: function() {
        this.lessons.forEach((l) => {
            l.createCanvas();
        })
    }
};

main.register(
    '00-intro-canvas',
    '#0: Introduction',
    'Basic drawing practice.',
    (l) => {
        for(let i = 0; i < 10000; i++) {
            l.context.beginPath();
            l.context.globalAlpha = Math.random();
            l.context.moveTo(Math.random() * l.width, Math.random() * l.height);
            l.context.lineTo(Math.random() * l.width, Math.random() * l.height);
            l.context.stroke();
        }
    }
);
main.register(
    '01-trig-canvas',
    '#1: Trigonometry - Part 1',
    'Basic sine wave practice',
    (l) => {
        let stretch = 100;
        let thickness = 1;

        l.context.save();
        l.context.translate(100, l.centerY); // shift the graph down to the center of the screen
        l.context.scale(1, -1); // flip the y axis for a more normal sine wave view

        for(let angle = 0; angle < Math.PI * 2; angle += 0.01) {
            degrees = Math.round(angle * (180/Math.PI))
            //console.log(`Degrees: ${degrees}; Radians: ${angle}`)

            // draw dots at each point along the wave
            //console.log(Math.sin(angle));
            let x = angle * stretch;
            let y = Math.sin(angle) * stretch;
            l.context.fillRect(x, y, thickness*2, thickness*2);

            // draw a dot on the x axis for each point along the wave
            l.context.fillRect(x, 0, thickness, thickness);

            //console.log('x: ', x);
            if(degrees % 90 == 0) {
                // draw hash
                l.context.fillRect(x, -5, 1, 10);
                l.context.scale(1, -1);
                l.context.fillText(degrees, x, -10);
                l.context.scale(1, -1);
            }
        }

        l.context.restore();
        l.context.font = "20pt Arial";
        l.context.fillText("Sine Wave", 10, 50);
    }
);
main.register(
    '02-trig-canvas',
    '#2: Trigonometry - Part 2',
    'More basic trigonometry practice.',
    (l) => {
        let objs = [{
            description: "circle bobbing up and down",
            offsetY: l.height * 0.1,
            offsetX: 0,
            speed: 0.1,
            color: 'black',
            angle: 0,
            yFn: 'sin',
            xFn: 'sin'
        }, {
            description: "circle shifting left and right",
            offsetY: 0,
            offsetX: l.width * 0.1,
            speed: 0.1,
            color: 'red',
            angle: 0,
            yFn: 'cos',
            xFn: 'cos'
        }, {
            description: "object going in sine pattern",
            offsetY: 200,
            offsetX: -200,
            speed: 0.1,
            color: 'blue',
            angle: 0,
            yFn: 'cos',
            xFn: 'sin'
        }];

        render();
        function render() {
            l.context.clearRect(0, 0, l.width, l.height);
            for(let i = 0; i < objs.length; i++) {
                let obj = objs[i];
                let y = l.centerY + (Math[obj.yFn](obj.angle) * obj.offsetY);
                let x = l.centerX + (Math[obj.xFn](obj.angle) * obj.offsetX);

                l.context.beginPath();
                l.context.arc(x, y, 50, 0, Math.PI * 2, false);
                l.context.fillStyle = obj.color;
                l.context.fill();

                obj.angle += obj.speed;
            }
            requestAnimationFrame(render);
        }
    }
);
main.register(
    '03-trig-canvas',
    '#3: Trigonometry - Part 3',
    'More basic trigonometry practice.',
    (l) => {
        let flyRadius = 3;
        let xMoveRadius = l.width * 0.5;
        let yMoveRadius = l.height * 0.5;
        let numFlies = 100;
        let numObjs = 10;
        let color = 'black';
        let radius = 100;
        let slice = Math.PI * 2 / numObjs;

        // generate flies
        let flies = [];
        for(let j = 0; j < numFlies; j++) {
            let fly = {
                x: 0,
                y: 0,
                xAngle: 0,
                yAngle: 0,
                // Lissajou curve: use different x and y speeds
                xSpeed: Math.random() * 0.05 + 0.01,
                ySpeed: Math.random() * 0.04 + 0.005
            }
            flies.push(fly);
        }

        render();
        function render() {
            // reset the screen coordinates
            l.context.clearRect(0, 0, l.width, l.height);

            // draw flies
            for(let j = 0; j < flies.length; j++) {
                let fly = flies[j];
                fly.x = xMoveRadius * Math.cos(fly.xAngle) + l.centerX;
                fly.y = yMoveRadius * Math.sin(fly.yAngle) + l.centerY;
                l.context.beginPath();
                l.context.arc(fly.x, fly.y, flyRadius, 0, Math.PI * 2, false);
                l.context.fillStyle = color;
                l.context.fill();
                fly.xAngle += fly.xSpeed;
                fly.yAngle += fly.ySpeed;
            }

            // draw objs in fixed circular position
            for(var i = 0; i < numObjs; i++) {
                let angle = i * slice;
                var ox = radius * Math.cos(angle) + l.centerX;
                var oy = radius * Math.sin(angle) + l.centerY;
                l.context.beginPath();
                l.context.arc(ox, oy, 10, 0, Math.PI * 2);
                l.context.fill();
            }

            requestAnimationFrame(render);
        }
      }
);
main.register(
    '04-trig-canvas',
    '#4: Trigonometry - Part 4',
    'More basic trigonometry practice.',
    (l) => {
            // define arrow variables
        let arrX = l.centerX,
            arrY = l.centerY,
            dx, dy,
            angle = 0;

        render();
        function render() {
            // clear the canvas
            l.context.clearRect(0, 0, l.width, l.height);
            // save initial context
            l.context.save();
            // then, translate the coordinates to center screen
            l.context.translate(arrX, arrY);
            // then, rotate the canvas relative to the arrow
            l.context.rotate(angle);

            // draw arrow
            l.context.beginPath();
            l.context.moveTo(20, 0);
            l.context.lineTo(-20, 0);
            l.context.moveTo(20, 0);
            l.context.lineTo(10, -10);
            l.context.moveTo(20, 0);
            l.context.lineTo(10, 10);
            l.context.stroke();


            // finally, reset the screen coordinates to original
            l.context.restore();
            requestAnimationFrame(render);
        }

        // listen to mouse move
        // get its position
        // calculate the update value for angle
        document.body.addEventListener('mousemove', (e) => {
            //console.log(e);
            // need to factor in the canvas's position on screen; the
            // online tutorial uses a full-screen canvas; however, in my
            // implementation, the canvas is only part of the screen, and
            // can be scrolled; so actual mouse position must be adjusted
            // by the canvas position.
            let canvasPos = l.canvas.getBoundingClientRect();
            //console.log(canvasPos.left, canvasPos.top);
            dx = e.clientX + canvasPos.left - arrX;
            dy = e.clientY - canvasPos.top - arrY;

            // Arc Tangent (atan) function takes a ratio of the
            // opposite over adjacent (tan = opp/adj). Angle is
            // at the coordinate origin, so opposite is the y component,
            // adjacent is the x component, hence:
            //
            // angle = Math.atan(dy / dx);
            //
            // ...however the atan function returns values in only 2
            // quadrants, since, given a value of say -0.5, it isn't
            // sure whether that's due to a neg Y and pos X or
            // pos Y and neg X...So the arrow will only ever point to
            // the right and not follow the cursor if its in either 2
            // left-side quadrants...
            //
            // ...Math.atan2 to the rescue...this function simply
            // takes the y and x arguments individually and can then
            // determine the correct quadrant for us:
            angle = Math.atan2(dy, dx);
        });
    }
);
main.register(
    '05-vectors-canvas',
    '#5: Vectors - Part 1',
    'Basic vector practice.',
    (l) => {
        // TODO: Nothing actuall moves or does anything interesting
        // in this tutorial. Upgrade it to do so.

        let angle = 0;
        let v1 = vector.create(10, 5);
        v1.addTo(vector.create(3, 4));
        //console.log(v1.getX(), v1.getY());

        update();
        function update() {
            // clear the canvas
            l.context.clearRect(0, 0, l.width, l.height);
            // save initial context
            l.context.save();
            // then, translate the coordinates to center screen
            l.context.translate(l.centerX, l.centerY);
            // then, rotate the canvas to a given angle...
            l.context.rotate(angle);

            // draw ...
            l.context.fillRect(0, 0, 10, 10);

            // finally, reset the screen coordinates to original
            l.context.restore();
            requestAnimationFrame(update);
        }
    }
);
main.register(
    '06-velocity-canvas',
    '#6: Velocity - Part 1',
    'Basic velocity practice.',
    (l) => {
        let angle = 0;
        let particles = [];
        let numParticles = 100;

        for(let i = 0; i < numParticles; i++) {
            let p = particle.create(
                l.centerX, l.centerY,
                Math.random() * 4 + 1,
                Math.random() * Math.PI * 2
            );
            particles.push(p);
        }

        let update = () => {
            // clear the canvas
            l.context.clearRect(0, 0, l.width, l.height);
            // save initial context
            l.context.save();
            // then, translate the coordinates to center screen
            l.context.translate(0, 0);
            // then, rotate the canvas to a given angle...
            l.context.rotate(angle);

            // draw ...
            for(let i = 0; i < particles.length; i++) {
                let p = particles[i];
                p.update();
                if(p.position.getX() > l.width) {
                    p.position.setX(0);
                }
                if(p.position.getX() < 0) {
                    p.position.setX(l.width);
                }
                if(p.position.getY() > l.height) {
                    p.position.setY(0);
                }
                if(p.position.getY() < 0) {
                    p.position.setY(l.height);
                }

                l.context.beginPath();
                l.context.arc(
                    p.position.getX(), p.position.getY(),
                    10, 0, Math.PI * 2, false
                );
                l.context.fill();
            }

            // finally, reset the screen coordinates to original
            l.context.restore();
            requestAnimationFrame(update);
        }
        update();
    }
);
main.register(
    '07-acceleration-canvas',
    '#7: Acceleration - Part 1',
    'Basic acceleration practice.',
    (l) => {
        let angle = 0;
        let particles2 = [];
        let particles3 = [];
        let numParticles = 100;
        let useParticles2 = true;
        //gravity = vector.create(0, 0.1);

        for(let i = 0; i < numParticles; i++) {
            let p = particle.create(
                l.centerX, l.centerY,
                Math.random() * 4 + 1,
                Math.random() * Math.PI * 2,
                0.1
            );
            particles2.push(p);
        }

        let update = () => {
            // clear the canvas
            l.context.clearRect(0, 0, l.width, l.height);
            // save initial context
            l.context.save();
            // then, translate the coordinates to center screen
            l.context.translate(0, 0);
            // then, rotate the canvas to a given angle...
            l.context.rotate(angle);

            // draw ...
            for(let i = 0; i < particles2.length; i++) {
                const p2 = particles2[i];
                p2.update();
                l.context.beginPath();
                l.context.arc(
                    p2.position.getX(), p2.position.getY(),
                    4, 0, Math.PI * 2, false
                );
                l.context.fill();
            }

            // finally, reset the screen coordinates to original
            l.context.restore();
            requestAnimationFrame(update);
        }
        update();
    }
);
main.register(
    '08-acceleration-canvas',
    '#8: Acceleration - Part 2',
    'More acceleration practice.',
    (l) => {
        let ship = particle.create(l.centerX, l.centerY, 0, 0, 0.01);
        let thrust = vector.create(0, 0);
        let angle = 0;
        let turningLeft = false;
        let turningRight = false;
        let thrusting = false;
        let projectiles = [];
        let projectileSpeed = 10;

        document.addEventListener('keydown', (e) => {
            //console.log(`Keydown: ${e.code}`);
            switch(e.code) {
                case 'KeyW':
                    thrusting = true;
                    break;
                // case 'KeyS':
                //     thrust.setY(0.1);
                //     break;
                case 'KeyD':
                    //thrust.setX(0.1);
                    turningRight = true;
                    break;
                case 'KeyA':
                    //thrust.setX(-0.1);
                    turningLeft = true;
                    break;
                case 'Space':
                    let p = particle.create(
                        ship.position.getX(),
                        ship.position.getY(),
                        Math.max(1, thrust.getLength()) * projectileSpeed,
                        angle,
                        0
                    );
                    projectiles.push(p);
                    break;
                default:
                    break;
            }
        });
        document.addEventListener('keyup', (e) => {
            //console.log(`Keyup: ${e.code}`);
            switch(e.code) {
                case 'KeyW':
                    //thrust.setY(0);
                    thrusting = false;
                    break;
                // case 'KeyS':
                //     thrust.setY(0);
                //     break;
                case 'KeyD':
                    //thrust.setX(0);
                    turningRight = false;
                    break;
                case 'KeyA':
                    //thrust.setX(0);
                    turningLeft = false;
                    break;
                default:
                    break;
            }
        });

        let update = () => {
            l.context.clearRect(0, 0, l.width, l.height);
            l.context.save();
            l.context.translate(ship.position.getX(), ship.position.getY());
            l.context.rotate(angle);

            let dx = Math.round(l.centerX - ship.position.getX()),
                dy = Math.round(l.centerY - ship.position.getY());
            //console.log(`${dx}, ${dy}`);

            if(turningLeft) {
                angle -= 0.05;
            }
            if(turningRight) {
                angle += 0.05;
            }

            thrust.setAngle(angle);
            if(thrusting) {
                thrust.setLength(0.02);
            } else {
                thrust.setLength(0);
            }

            ship.accelerate(thrust);
            ship.update();
            l.context.beginPath();
            l.context.strokeStyle = 'black';
            //l.context.arc(ship.position.getX(), ship.position.getY(), 5, 0, Math.PI * 2, false);
            l.context.moveTo(10, 0);
            l.context.lineTo(-10, -7);
            l.context.lineTo(-10, 7);
            l.context.lineTo(10, 0);
            l.context.stroke();
            if(thrusting) {
                l.context.beginPath();
                l.context.strokeStyle = 'orange';
                l.context.moveTo(-10, 0);
                l.context.lineTo(-18, 0);
                l.context.stroke();
            }

            if(ship.position.getX() > l.width) {
                ship.position.setX(0);
            }
            if(ship.position.getX() < 0) {
                ship.position.setX(l.width);
            }
            if(ship.position.getY() > l.height) {
                ship.position.setY(0);
            }
            if(ship.position.getY() < 0) {
                ship.position.setY(l.height);
            }

            l.context.restore();

            // draw projectiles
            for(let i = 0; i < projectiles.length; i++) {
                let proj = projectiles[i];
                proj.update();
                l.context.beginPath();
                l.context.fillStyle = 'magenta';
                l.context.arc(
                    proj.position.getX(), proj.position.getY(),
                    2, 0, Math.PI*2
                );
                l.context.fill();
            }
            requestAnimationFrame(update);
        }
        update();
    }
);
main.register(
    '09-gravity-canvas',
    '#9: Gravity - Part 1',
    'Basic gravity practice. Disappearing/reappearing circle.',
    (l) => {
        let angle = 0;
        let sun = particle.create(l.centerX, l.centerY, 0, 0, 0);
        let planet = particle.create(l.centerX + 100, l.centerY, 1, -Math.PI/2, 0);

        sun.mass = 100;

        let update = () => {
            l.context.clearRect(0, 0, l.width, l.height);
            l.context.save();
            // l.context.translate(0, 0);
            // l.context.rotate(angle);

            // physics
            planet.gravitateTo(sun);
            planet.update();

            // draw planet
            l.context.beginPath();
            l.context.fillStyle = 'blue';
            l.context.arc(planet.position.getX(), planet.position.getY(), 5, 0, Math.PI * 2);
            l.context.fill();
            // draw sun
            l.context.beginPath();
            l.context.fillStyle = 'yellow';
            l.context.arc(sun.position.getX(), sun.position.getY(), 20, 0, Math.PI * 2);
            l.context.fill();

            l.context.restore();
            requestAnimationFrame(update);
        }

        update();
    }
);
main.register(
    '10-edge-handling-0-canvas',
    '#10: Edge Handling - Part 1',
    'Basic edge handling practice. Multi-colored fireworks.',
    (l) => {
        let angle = 0;
        let p = particle.create(l.centerX, l.centerY, 5, Math.random() * Math.PI * 2, 0);
        // single large particle for smooth edge disappear/appear
        p.radius = 50;

        let update = () => {
            l.context.clearRect(0, 0, l.width, l.height);

            // single particle
            // note that the radius of the object is taken into account
            // so that the object fully disappears beyond the edge before
            // reappearing.
            p.update();
            if(p.position.getX() - p.radius > l.width) {
                p.position.setX(0 - p.radius);
            }
            if(p.position.getX() + p.radius < 0) {
                p.position.setX(l.width + p.radius);
            }
            if(p.position.getY() - p.radius > l.height) {
                p.position.setY(0 - p.radius);
            }
            if(p.position.getY() + p.radius < 0) {
                p.position.setY(l.height + p.radius);
            }
            // draw
            l.context.beginPath();
            l.context.arc(p.position.getX(), p.position.getY(), p.radius, 0, Math.PI * 2);
            l.context.fillStyle = '#333';
            l.context.fill();

            requestAnimationFrame(update);
        }
        update();
    }
);
main.register(
    '10-edge-handling-1-canvas',
    '#10: Edge Handling - Part 2',
    'More edge handling practice.',
    (l) => {
        let angle = 0;
        let particles3 = [];
        let numParticles3 = 100;

        // fireworks
        // multiple particles for edge removal for render efficiency (explosion)
        let populate3 = () => {
            // random position
            let cx = Math.random() * l.width,
                cy = Math.random() * l.height;
            for(let i = 0; i < numParticles3; i++) {
                let p2 = particle.create(
                    cx, cy,
                    Math.random() * 5 + 2,
                    Math.random() * Math.PI * 2,
                    0.05
                );
                p2.radius = 3;
                p2.fill = p2.randomRGB();
                particles3.push(p2);
            }
        }
        // initial population
        populate3();

        // remove dead particles once they disappear beyond the boundary
        // of the canvas.
        let removeDeadParticles = () => {
            for(let i = particles3.length - 1; i >= 0; i--) {
                let p2 = particles3[i];
                if( p2.position.getX() - p2.radius > l.width ||
                    p2.position.getX() + p2.radius < 0 ||
                    p2.position.getY() - p2.radius > l.height ||
                    p2.position.getY() + p2.radius < 0) {
                    particles3.splice(i, 1);
                    //console.log(particles3.length);
                }
            }
            if(particles3.length == 0) populate3(); // repopulate
        }

        let update = () => {
            l.context.clearRect(0, 0, l.width, l.height);

            // explosion particles
            for(let i = 0; i < particles3.length; i++) {
                let p2 = particles3[i];
                p2.update();
                l.context.beginPath();
                l.context.arc(p2.position.getX(), p2.position.getY(), p2.radius, 0, Math.PI * 2);
                l.context.fillStyle = p2.fill;
                l.context.fill();
            }
            removeDeadParticles();
            requestAnimationFrame(update);
        }
        update();
    }
);
main.register(
    '10-edge-handling-2-canvas',
    '#10: Edge Handling - Part 3',
    'More edge handling practice. Fountain of particles.',
    (l) => {
        let angle = 0;
        let particles4 = [];
        let numParticles4 = 100;
        let fountainStrengthMax = 10;

        // fountain
        let populate4 = () => {
            for(let i = 0; i < numParticles4; i++) {
                let p4 = particle.create(
                    l.centerX, l.height,
                    Math.random() * fountainStrengthMax,
                    -Math.PI / 2 + (Math.random() * .2 - .1),
                    0.1
                );
                p4.radius = Math.random() * 5 + 1;
                particles4.push(p4);
            }
        }
        populate4();

        let update = () => {
            l.context.clearRect(0, 0, l.width, l.height);

            // fountain particles
            for(let i = 0; i < particles4.length; i++) {
                let p4 = particles4[i];
                p4.update();
                l.context.beginPath();
                l.context.arc(p4.position.getX(), p4.position.getY(), p4.radius, 0, Math.PI * 2);
                l.context.fillStyle = 'blue';
                l.context.fill();

                if(p4.position.getY() + p4.radius > l.height) {
                    p4.position.setX(l.centerX);
                    p4.position.setY(l.height);
                    p4.velocity.setLength(Math.random() * fountainStrengthMax);
                    p4.velocity.setAngle(-Math.PI / 2 + (Math.random() * .2 - .1));
                }
            }
            requestAnimationFrame(update);
        }
        update();
    }
);
main.register(
    '10-edge-handling-3-canvas',
    '#10: Edge Handling - Part 4',
    'More edge handling practice. Ball bouncing withing the bounds of the canvas.',
    (l) => {
        let angle = 0;
        let p = particle.create(l.centerX, l.centerY, 20, Math.random() * Math.PI * 2, 0.1);
        p.radius = 40;

        let update = () => {
            l.context.clearRect(0, 0, l.width, l.height);

            p.update();
            l.context.beginPath();
            l.context.arc(p.position.getX(), p.position.getY(), p.radius, 0, Math.PI * 2);
            l.context.fill();

            if(p.position.getX() + p.radius > l.width) {
                p.position.setX(l.width - p.radius);
                p.velocity.setX(p.velocity.getX() * p.bounce);
            }
            if(p.position.getX() - p.radius < 0) {
                p.position.setX(p.radius);
                p.velocity.setX(p.velocity.getX() * p.bounce);
            }
            if(p.position.getY() + p.radius > l.height) {
                p.position.setY(l.height - p.radius);
                p.velocity.setY(p.velocity.getY() * p.bounce);
            }
            if(p.position.getY() - p.radius < 0) {
                p.position.setY(p.radius);
                p.velocity.setY(p.velocity.getY() * p.bounce);
            }
            requestAnimationFrame(update);
        }
        update();
    }
);
main.register(
    '11-friction-canvas',
    '#11: Friction - Part 1',
    'Basic friction practice. Movement of the circle will slow to a halt.',
    (l) => {
        let angle = 0;
        let p = particle.create(l.centerX, l.centerY, 20, Math.random() * Math.PI * 2);
        p.radius = 10;
        p.friction = 0.93; // more performant, less accurate
        //let friction = vector.create(0.15, 0); // not as peformant, more accurate

        let update = () => {
            l.context.clearRect(0, 0, l.width, l.height);
            l.context.save();
            l.context.translate(0, 0);
            l.context.rotate(angle);

            // draw
            // NOTE:
            // According to the tutorial, this method for calculating friction
            // is more accurate but much less performant.
            // friction.setAngle(p.velocity.getAngle());
            // if(p.velocity.getLength() > friction.getLength()) {
            //     p.velocity.subtractFrom(friction);
            // } else {
            //     p.velocity.setLength(0);
            //}

            p.update();
            l.context.beginPath();
            l.context.arc(p.position.getX(), p.position.getY(), p.radius, 0, Math.PI * 2);
            l.context.fill();

            l.context.restore();
            requestAnimationFrame(update);
        }
        update();
    }
);
main.register(
    '12-collision-detection-canvas',
    '#12: Collision Detection - Part 1',
    'Basic collision detection practice.',
    (l) => {
        let angle = 0;

        let update = () => {
            l.context.clearRect(0, 0, l.width, l.height);
            l.context.save();
            l.context.translate(0, 0);
            l.context.rotate(angle);

            // draw

            l.context.restore();
            requestAnimationFrame(update);
        }

        update();
    }
);