const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const matrixCanvas = document.getElementById("matrixCanvas");
const matrixCtx = matrixCanvas.getContext("2d");

matrixCanvas.width = window.innerWidth;
matrixCanvas.height = window.innerHeight;

const snake = [
    {x: 150, y: 150},
    {x: 140, y: 150},
    {x: 130, y: 150},
    {x: 120, y: 150},
    {x: 110, y: 150}
];

let dx = 10;
let dy = 0;
let foodX;
let foodY;
let changingDirection = false;
let gameRunning = true;
let score = 0;
let level = 1;
const levelUpScore = 5;

document.addEventListener("keydown", changeDirection);
document.getElementById("restartButton").addEventListener("click", restartGame);
document.getElementById("exitButton").addEventListener("click", exitGame);

main();
createFood();
drawMatrixBackground();

function main() {
    if (!gameRunning) return;

    if (didGameEnd()) {
        gameRunning = false;
        document.getElementById("gameOver").classList.remove("hidden");
        return;
    }

    changingDirection = false;
    setTimeout(function onTick() {
        clearCanvas();
        drawFood();
        advanceSnake();
        drawSnake();
        main();
    }, 100 - (level * 10));
}

function clearCanvas() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function drawSnakePart(snakePart) {
    ctx.fillStyle = "lightgreen";
    ctx.strokeStyle = "darkgreen";
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function advanceSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
    if (didEatFood) {
        score += 1;
        document.getElementById("score").innerHTML = score;
        if (score % levelUpScore === 0) {
            level += 1;
            document.getElementById("level").innerHTML = level;
        }
        createFood();
    } else {
        snake.pop();
    }
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    if (changingDirection) return;
    changingDirection = true;

    const keyPressed = event.keyCode;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
    }
}

function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        const didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
        if (didCollide) return true;
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= canvas.width;
    const hitToptWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= canvas.height;

    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
}

function randomTen(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function createFood() {
    foodX = randomTen(0, canvas.width - 10);
    foodY = randomTen(0, canvas.height - 10);

    snake.forEach(function isFoodOnSnake(part) {
        const foodIsOnSnake = part.x === foodX && part.y === foodY;
        if (foodIsOnSnake) createFood();
    });
}

function drawFood() {
    ctx.fillStyle = "red";
    ctx.strokeStyle = "darkred";
    ctx.fillRect(foodX, foodY, 10, 10);
    ctx.strokeRect(foodX, foodY, 10, 10);
}

function restartGame() {
    gameRunning = true;
    score = 0;
    level = 1;
    document.getElementById("score").innerHTML = score;
    document.getElementById("level").innerHTML = level;
    snake.splice(0, snake.length, 
        {x: 150, y: 150},
        {x: 140, y: 150},
        {x: 130, y: 150},
        {x: 120, y: 150},
        {x: 110, y: 150}
    );
    dx = 10;
    dy = 0;
    document.getElementById("gameOver").classList.add("hidden");
    createFood();
    main();
}

function exitGame() {
    window.close();
}

function drawMatrixBackground() {
    const columns = matrixCanvas.width / 20;
    const drops = Array(columns).fill(1);
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    function drawMatrix() {
        matrixCtx.fillStyle = "rgba(0, 0, 0, 0.05)";
        matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        
        matrixCtx.fillStyle = "#0F0";
        matrixCtx.font = "20px monospace";
        
        for (let i = 0; i < drops.length; i++) {
            const text = letters.charAt(Math.floor(Math.random() * letters.length));
            matrixCtx.fillText(text, i * 20, drops[i] * 20);
            
            if (drops[i] * 20 > matrixCanvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(drawMatrix, 33);
}

window.addEventListener("resize", () => {
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    drawMatrixBackground();
});
