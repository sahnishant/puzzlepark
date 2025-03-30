let board = [];
let rows, cols, bombs;
let timer = 0;
let timerInterval;

function createBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    gameBoard.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    // Initialize the board with unique objects for each cell
    board = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({
            revealed: false,
            bomb: false,
            flagged: false,
        }))
    );

    // Place bombs randomly
    let bombCount = 0;
    while (bombCount < bombs) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);
        if (!board[r][c].bomb) {
            board[r][c].bomb = true;
            bombCount++;
        }
    }

    // Render the cells
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;

            // Left-click to reveal
            cell.addEventListener('click', () => revealCell(r, c));

            // Right-click to flag
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                toggleFlag(r, c);
            });

            gameBoard.appendChild(cell);
        }
    }
}

function revealCell(r, c) {
    // Ensure the cell exists and hasn't already been revealed
    if (r < 0 || r >= rows || c < 0 || c >= cols || board[r][c].revealed || board[r][c].flagged) return;

    const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
    board[r][c].revealed = true;

    if (board[r][c].bomb) {
        cell.classList.add('bomb');
        cell.textContent = '💣';
        endGame(false);
        return;
    }

    cell.classList.add('revealed');
    const bombCount = countAdjacentBombs(r, c);
    if (bombCount > 0) {
        cell.textContent = bombCount;
    } else {
        // Reveal adjacent cells recursively
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                revealCell(r + dr, c + dc);
            }
        }
    }

    // Check if the player has won
    checkWinCondition();
}

function checkWinCondition() {
    let revealedCells = 0;
    let totalCells = rows * cols;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c].revealed) {
                revealedCells++;
            }
        }
    }

    // If all non-bomb cells are revealed, the player wins
    if (revealedCells === totalCells - bombs) {
        endGame(true);
    }
}

function endGame(win) {
    clearInterval(timerInterval);

    // Reveal all bombs if the player loses
    if (!win) {
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (board[r][c].bomb) {
                    const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
                    cell.classList.add('bomb');
                    cell.textContent = '💣';
                }
            }
        }
    }

    alert(win ? 'You win!' : 'Game over!');
    document.getElementById('game-board').innerHTML = '';
}

function toggleFlag(r, c) {
    if (board[r][c].revealed) return;

    const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
    board[r][c].flagged = !board[r][c].flagged;

    if (board[r][c].flagged) {
        cell.classList.add('flagged');
        cell.textContent = '🚩';
    } else {
        cell.classList.remove('flagged');
        cell.textContent = '';
    }
}

function countAdjacentBombs(r, c) {
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].bomb) {
                count++;
            }
        }
    }
    return count;
}

function startGame() {
    const difficulty = document.getElementById('difficulty').value;
    if (difficulty === 'easy') {
        rows = 8;
        cols = 8;
        bombs = 10;
    } else if (difficulty === 'medium') {
        rows = 12;
        cols = 12;
        bombs = 20;
    } else if (difficulty === 'hard') {
        rows = 16;
        cols = 16;
        bombs = 40;
    }

    timer = 0;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timer++;
        document.getElementById('timer').textContent = timer;
    }, 1000);

    createBoard();
}


document.getElementById('start-game').addEventListener('click', startGame);