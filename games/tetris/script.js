const canvas = document.getElementById('tetrisCanvas');
const ctx = canvas.getContext('2d');
const grid = 20; // Size of each block
const rows = canvas.height / grid;
const cols = canvas.width / grid; // Adjusted for increased width (15 columns)

let board = Array.from({ length: rows }, () => Array(cols).fill(0));
let currentPiece;
let score = 0;

// Define pieces with their colors
const pieces = [
    { shape: [[1, 1, 1], [0, 1, 0]], color: '#FF5733' }, // T - Orange
    { shape: [[1, 1], [1, 1]], color: '#FFC300' },       // O - Yellow
    { shape: [[1, 1, 1, 1]], color: '#DAF7A6' },         // I - Light Green
    { shape: [[0, 1, 1], [1, 1, 0]], color: '#33FF57' }, // S - Green
    { shape: [[1, 1, 0], [0, 1, 1]], color: '#33C1FF' }, // Z - Blue
    { shape: [[1, 1, 1], [1, 0, 0]], color: '#9D33FF' }, // L - Purple
    { shape: [[1, 1, 1], [0, 0, 1]], color: '#FF33A8' }  // J - Pink
];

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c]) {
                ctx.fillStyle = board[r][c]; // Use the stored color
                ctx.fillRect(c * grid, r * grid, grid - 1, grid - 1);
            }
        }
    }
}

function drawPiece(piece, x, y, color) {
    ctx.fillStyle = color;
    piece.forEach((row, r) => {
        row.forEach((cell, c) => {
            if (cell) {
                ctx.fillRect((x + c) * grid, (y + r) * grid, grid - 1, grid - 1);
            }
        });
    });
}

function canMove(piece, x, y) {
    return piece.every((row, r) =>
        row.every((cell, c) => {
            if (!cell) return true;
            const newX = x + c;
            const newY = y + r;
            return newX >= 0 && newX < cols && newY < rows && !board[newY][newX];
        })
    );
}

function mergePiece(piece, x, y, color) {
    piece.forEach((row, r) => {
        row.forEach((cell, c) => {
            if (cell) {
                board[y + r][x + c] = color; // Store the color in the board
            }
        });
    });
}

function clearLines() {
    board = board.filter(row => row.some(cell => !cell));
    while (board.length < rows) {
        board.unshift(Array(cols).fill(0));
        score += 10;
        document.getElementById('score').textContent = score;
    }
}

function spawnPiece() {
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
    currentPiece = { ...randomPiece, x: Math.floor(cols / 2) - 1, y: 0 };
    if (!canMove(currentPiece.shape, currentPiece.x, currentPiece.y)) {
        alert('Game Over!');
        board = Array.from({ length: rows }, () => Array(cols).fill(0));
        score = 0;
        document.getElementById('score').textContent = score;
    }
}

function dropPiece() {
    if (canMove(currentPiece.shape, currentPiece.x, currentPiece.y + 1)) {
        currentPiece.y++;
    } else {
        mergePiece(currentPiece.shape, currentPiece.x, currentPiece.y, currentPiece.color);
        clearLines();
        spawnPiece();
    }
    drawBoard();
    drawPiece(currentPiece.shape, currentPiece.x, currentPiece.y, currentPiece.color);
}

function movePiece(dx) {
    if (canMove(currentPiece.shape, currentPiece.x + dx, currentPiece.y)) {
        currentPiece.x += dx;
    }
    drawBoard();
    drawPiece(currentPiece.shape, currentPiece.x, currentPiece.y, currentPiece.color);
}

function rotatePiece() {
    const rotated = currentPiece.shape[0].map((_, i) =>
        currentPiece.shape.map(row => row[i]).reverse()
    );
    if (canMove(rotated, currentPiece.x, currentPiece.y)) {
        currentPiece.shape = rotated;
    }
    drawBoard();
    drawPiece(currentPiece.shape, currentPiece.x, currentPiece.y, currentPiece.color);
}

document.addEventListener('keydown', event => {
    switch (event.key) {
        case 'ArrowLeft':
            movePiece(-1);
            break;
        case 'ArrowRight':
            movePiece(1);
            break;
        case 'ArrowDown':
            dropPiece();
            break;
        case 'ArrowUp':
            rotatePiece();
            break;
    }
});

spawnPiece();
setInterval(dropPiece, 500);