const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let balls = [];
let animationFrameId;
let numBalls = 10;
let maxDistance = 100;
let force = 1;

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

class Ball {
    constructor(x, y, dx, dy, radius) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.closePath();
    }

    update() {
        if (this.x + this.dx > canvas.width - this.radius || this.x + this.dx < this.radius) {
            this.dx = -this.dx;
        }
        if (this.y + this.dy > canvas.height - this.radius || this.y + this.dy < this.radius) {
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;
    }
}

function init() {
    balls = [];
    for (let i = 0; i < numBalls; i++) {
        let radius = getRandomInt(10, 20);
        let x = getRandomInt(radius, canvas.width - radius);
        let y = getRandomInt(radius, canvas.height - radius);
        let dx = getRandomInt(-2, 2);
        let dy = getRandomInt(-2, 2);
        balls.push(new Ball(x, y, dx, dy, radius));
    }
}

function drawLines() {
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            let distance = Math.hypot(balls[i].x - balls[j].x, balls[i].y - balls[j].y);
            if (distance < maxDistance) {
                ctx.beginPath();
                ctx.moveTo(balls[i].x, balls[i].y);
                ctx.lineTo(balls[j].x, balls[j].y);
                ctx.strokeStyle = 'red';
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach(ball => {
        ball.update();
        ball.draw();
    });
    drawLines();
    animationFrameId = requestAnimationFrame(animate);
}

function start() {
    numBalls = parseInt(document.getElementById('numBalls').value);
    maxDistance = parseInt(document.getElementById('distance').value);
    force = parseInt(document.getElementById('force').value);
    init();
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    animate();
}

function reset() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls = [];
}

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    balls.forEach(ball => {
        const distance = Math.hypot(ball.x - mouseX, ball.y - mouseY);
        if (distance < maxDistance) {
            const angle = Math.atan2(ball.y - mouseY, ball.x - mouseX);
            ball.dx += force * Math.cos(angle);
            ball.dy += force * Math.sin(angle);
        }
    });
});

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    for (let i = 0; i < balls.length; i++) {
        const distance = Math.hypot(balls[i].x - mouseX, balls[i].y - mouseY);
        if (distance < balls[i].radius) {
            balls.splice(i, 1);
            balls.push(new Ball(getRandomInt(20, canvas.width - 20), getRandomInt(20, canvas.height - 20), getRandomInt(-2, 2), getRandomInt(-2, 2), getRandomInt(10, 20)));
            balls.push(new Ball(getRandomInt(20, canvas.width - 20), getRandomInt(20, canvas.height - 20), getRandomInt(-2, 2), getRandomInt(-2, 2), getRandomInt(10, 20)));
            break;
        }
    }
});

start();
