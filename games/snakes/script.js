let canvas;
let ctx;
let snake;
let food;
let score;
let highScore = 0;
let level = 1;
let gameInterval;
let direction = 'RIGHT'; // Default direction
let difficulty = 200; // Default difficulty (milliseconds)

function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    // Attach event listeners
    document.addEventListener('keydown', changeDirection);
    document.getElementById('start-game-button').addEventListener('click', () => {
        const selectedDifficulty = document.getElementById('difficulty').value;
        showGameScreen(getDifficultySpeed(selectedDifficulty));
    });
}
function resetGame() {
    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    score = 0;
    level = 1;
    direction = 'RIGHT';
    updateScore();
    updateLevel();
    document.getElementById('end-message').style.display = 'none';
}

function startGame(selectedDifficulty) {
    difficulty = selectedDifficulty;
    resetGame();
    clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, difficulty);
}
function updateLevel() {
    document.getElementById('level').textContent = level;
}
function updateGame() {
    moveSnake();
    if (checkCollision()) {
        endGame();
        return;
    }
    if (checkFoodCollision()) {
        score++;
        updateScore();
        food = generateFood();
        if (score % 5 === 0) {
            level++;
            updateLevel();
            difficulty -= 20; // Increase speed
            clearInterval(gameInterval);
            gameInterval = setInterval(updateGame, difficulty);
        }
    }
    drawGame();
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
}

function drawSnake() {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#4CAF50');
    gradient.addColorStop(1, '#2E7D32');
    ctx.fillStyle = gradient;

    snake.forEach(part => {
        ctx.fillRect(part.x * 20, part.y * 20, 18, 18);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(part.x * 20, part.y * 20, 18, 18);
    });
}

function drawFood() {
    const gradient = ctx.createRadialGradient(
        food.x * 20 + 10, food.y * 20 + 10, 5,
        food.x * 20 + 10, food.y * 20 + 10, 10
    );
    gradient.addColorStop(0, '#FF5722');
    gradient.addColorStop(1, '#D32F2F');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(food.x * 20 + 10, food.y * 20 + 10, 9, 0, Math.PI * 2);
    ctx.fill();
}
function moveSnake() {
    const head = { ...snake[0] };
    switch (direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
    }
    snake.unshift(head);
    if (!checkFoodCollision()) {
        snake.pop();
    }
}

function generateFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / 20)),
        y: Math.floor(Math.random() * (canvas.height / 20))
    };
}

function checkCollision() {
    const head = snake[0];
    // Check wall collision
    if (head.x < 0 || head.x >= canvas.width / 20 || head.y < 0 || head.y >= canvas.height / 20) {
        return true;
    }
    // Check self-collision
    return snake.slice(1).some(part => part.x === head.x && part.y === head.y);
}

function checkFoodCollision() {
    const head = snake[0];
    return head.x === food.x && head.y === food.y;
}

function endGame() {
    clearInterval(gameInterval);
    document.getElementById('end-message').textContent = `Game Over! Your score: ${score}`;
    document.getElementById('end-message').style.display = 'block';
}

function changeDirection(event) {
    switch (event.key) {
        case 'ArrowUp': if (direction !== 'DOWN') direction = 'UP'; break;
        case 'ArrowDown': if (direction !== 'UP') direction = 'DOWN'; break;
        case 'ArrowLeft': if (direction !== 'RIGHT') direction = 'LEFT'; break;
        case 'ArrowRight': if (direction !== 'LEFT') direction = 'RIGHT'; break;
    }
}

function updateScore() {
    document.getElementById('score').textContent = score;
    if (score > highScore) {
        highScore = score;
        document.getElementById('high-score').textContent = highScore;
    }
}

function getDifficultySpeed(level) {
    switch (level) {
        case 'easy': return 300;
        case 'medium': return 200;
        case 'hard': return 100;
        default: return 200;
    }
}


function showGameScreen() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';

    // Attach event listener to the "Play Game" button
    document.getElementById('play-game-button').addEventListener('click', () => {
        const selectedDifficulty = document.getElementById('difficulty').value;
        startGame(getDifficultySpeed(selectedDifficulty));
    });
}
window.onload = init;