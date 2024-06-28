let canvas, ctx, ball, holes, blackHoles, interval, startTime;
const ballRadius = 10;
const holeRadius = 15;

function startGame(mode) {
    document.body.innerHTML = '<canvas id="gameCanvas" width="400" height="400"></canvas>';
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    resetGame();

    switch (mode) {
        case 'one-hole':
            setupOneHole();
            break;
        case 'multiple-holes':
            setupMultipleHoles();
            break;
        case 'black-hole':
            setupBlackHoles();
            break;
    }

    window.addEventListener('deviceorientation', handleOrientation);
    requestAnimationFrame(draw);
}

function resetGame() {
    ball = { x: 200, y: 200 };
    holes = [];
    blackHoles = [];
    startTime = Date.now();
}

function setupOneHole() {
    holes.push(randomPosition());
}

function setupMultipleHoles() {
    for (let i = 0; i < 5; i++) {
        holes.push(randomPosition());
    }
}

function setupBlackHoles() {
    for (let i = 0; i < 3; i++) {
        blackHoles.push(randomPosition());
    }
    holes.push(randomPosition());
}

function randomPosition() {
    return {
        x: Math.random() * (canvas.width - holeRadius * 2) + holeRadius,
        y: Math.random() * (canvas.height - holeRadius * 2) + holeRadius
    };
}

function handleOrientation(event) {
    const gamma = event.gamma; // left to right
    const beta = event.beta; // front to back
    ball.x += gamma / 2;
    ball.y += beta / 2;

    if (ball.x < ballRadius) ball.x = ballRadius;
    if (ball.x > canvas.width - ballRadius) ball.x = canvas.width - ballRadius;
    if (ball.y < ballRadius) ball.y = ballRadius;
    if (ball.y > canvas.height - ballRadius) ball.y = canvas.height - ballRadius;

    checkCollisions();
}

function checkCollisions() {
    holes.forEach((hole, index) => {
        const dist = Math.hypot(ball.x - hole.x, ball.y - hole.y);
        if (dist < ballRadius + holeRadius) {
            holes.splice(index, 1);
            if (holes.length === 0) {
                endGame();
            }
        }
    });

    blackHoles.forEach((blackHole) => {
        const dist = Math.hypot(ball.x - blackHole.x, ball.y - blackHole.y);
        if (dist < ballRadius + holeRadius) {
            ball = randomPosition();
        }
    });
}

function endGame() {
    const endTime = Date.now();
    const elapsedTime = (endTime - startTime) / 1000;
    alert(`Congratulations! You completed the game in ${elapsedTime} seconds.`);
    window.location.reload();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'green';
    holes.forEach(hole => {
        ctx.beginPath();
        ctx.arc(hole.x, hole.y, holeRadius, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.fillStyle = 'red';
    blackHoles.forEach(blackHole => {
        ctx.beginPath();
        ctx.arc(blackHole.x, blackHole.y, holeRadius, 0, Math.PI * 2);
        ctx.fill();
    });

    requestAnimationFrame(draw);
}
