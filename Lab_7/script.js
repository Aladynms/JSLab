const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const forceRange = document.getElementById('forceRange');
const xRange = document.getElementById('xRange');
const yRange = document.getElementById('yRange');

let animationFrameId;
let isRunning = false;
let force = parseFloat(forceRange.value);
let xFactor = parseFloat(xRange.value);
let yFactor = parseFloat(yRange.value);
let mouseX = 0;
let mouseY = 0;
let mouseDown = false;
let mouseButton = null;

class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 10 + 5;
        this.vx = (Math.random() * 2 - 1) / this.size;
        this.vy = (Math.random() * 2 - 1) / this.size;
    }

    update() {
        this.x += this.vx * xFactor;
        this.y += this.vy * xFactor;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        if (this.size < 1) {
            this.size = 0;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    getEnergy() {
        return this.size * (xFactor * Math.sqrt(this.vx ** 2 + this.vy ** 2) + yFactor * this.size);
    }
}

function distance(node1, node2) {
    return Math.sqrt(Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2));
}

let nodes = [];
const maxDistance = 100;
const nodeCount = 100;

function init() {
    nodes.length = 0;
    for (let i = 0; i < nodeCount; i++) {
        nodes.push(new Node(Math.random() * canvas.width, Math.random() * canvas.height));
    }
}

function applyMouseForce() {
    if (mouseDown) {
        nodes.forEach(node => {
            const dist = distance({ x: mouseX, y: mouseY }, node);
            if (dist < maxDistance) {
                const angle = Math.atan2(node.y - mouseY, node.x - mouseX);
                const strength = force / dist;

                if (mouseButton === 0) {
                    node.vx += Math.cos(angle) * strength;
                    node.vy += Math.sin(angle) * strength;
                } else if (mouseButton === 2) {
                    node.vx -= Math.cos(angle) * strength;
                    node.vy -= Math.sin(angle) * strength;
                }
            }
        });
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            if (distance(nodes[i], nodes[j]) < maxDistance) {
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.stroke();
                ctx.closePath();

                if (nodes[i].size > 0 && nodes[j].size > 0) {
                    let energyTransfer = Math.min(nodes[i].getEnergy(), nodes[j].getEnergy()) / 150;
                    if (nodes[i].getEnergy() > nodes[j].getEnergy()) {
                        nodes[i].size += energyTransfer;
                        nodes[j].size -= energyTransfer;
                    } else {
                        nodes[i].size -= energyTransfer;
                        nodes[j].size += energyTransfer;
                    }
                }
            }
        }
    }

    applyMouseForce();

    nodes.forEach(node => {
        node.update();
        node.draw();
    });

    nodes = nodes.filter(node => node.size >= 1); 

    animationFrameId = requestAnimationFrame(animate);
}

function startAnimation() {
    if (!isRunning) {
        isRunning = true;
        animate();
    }
}

function resetAnimation() {
    if (isRunning) {
        cancelAnimationFrame(animationFrameId);
        isRunning = false;
    }
    init();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    nodes.forEach(node => node.draw());
}

startBtn.addEventListener('click', startAnimation);
resetBtn.addEventListener('click', resetAnimation);
forceRange.addEventListener('input', () => {
    force = parseFloat(forceRange.value);
});
xRange.addEventListener('input', () => {
    xFactor = parseFloat(xRange.value);
});
yRange.addEventListener('input', () => {
    yFactor = parseFloat(yRange.value);
});

canvas.addEventListener('mousedown', event => {
    mouseDown = true;
    mouseButton = event.button;
});

canvas.addEventListener('mouseup', () => {
    mouseDown = false;
    mouseButton = null;
});

canvas.addEventListener('mousemove', event => {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
});

canvas.addEventListener('contextmenu', event => event.preventDefault());

init();
