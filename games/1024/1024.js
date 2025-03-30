const grid = document.querySelector('.grid');
const scoreDisplay = document.getElementById('score');
const resetButton = document.getElementById('reset');
let board = Array(4).fill().map(() => Array(4).fill(0));
let score = 0;
let touchStartX, touchStartY, touchEndX, touchEndY;

// Initialize the game
function init() {
  board = Array(4).fill().map(() => Array(4).fill(0));
  score = 0;
  scoreDisplay.textContent = score;
  addRandomTile();
  addRandomTile();
  renderBoard();
}

// Add a random tile (2 or 4) to the board
function addRandomTile() {
  const emptyCells = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 0) {
        emptyCells.push({ x: i, y: j });
      }
    }
  }
  if (emptyCells.length > 0) {
    const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[x][y] = Math.random() < 0.9 ? 2 : 4;
  }
}

// Render the board
function renderBoard() {
  grid.innerHTML = '';
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const cell = document.createElement('div');
      cell.textContent = board[i][j] === 0 ? '' : board[i][j];
      cell.style.backgroundColor = getTileColor(board[i][j]);
      grid.appendChild(cell);
    }
  }
}

// Get tile color based on value
function getTileColor(value) {
  const colors = {
    0: '#cdc1b4',
    2: '#eee4da',
    4: '#ede0c8',
    8: '#f2b179',
    16: '#f59563',
    32: '#f67c5f',
    64: '#f65e3b',
    128: '#edcf72',
    256: '#edcc61',
    512: '#edc850',
    1024: '#edc53f',
    2048: '#edc22e',
  };
  return colors[value] || '#cdc1b4';
}

// Handle keyboard input
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') {
    moveUp();
  } else if (e.key === 'ArrowDown') {
    moveDown();
  } else if (e.key === 'ArrowLeft') {
    moveLeft();
  } else if (e.key === 'ArrowRight') {
    moveRight();
  }
  renderBoard();
  updateScore();
});

// Move tiles up
function moveUp() {
  for (let j = 0; j < 4; j++) {
    let column = [];
    for (let i = 0; i < 4; i++) {
      if (board[i][j] !== 0) {
        column.push(board[i][j]);
      }
    }
    column = mergeTiles(column);
    for (let i = 0; i < 4; i++) {
      board[i][j] = column[i] || 0;
    }
  }
  addRandomTile();
}

// Move tiles down
function moveDown() {
  for (let j = 0; j < 4; j++) {
    let column = [];
    for (let i = 3; i >= 0; i--) {
      if (board[i][j] !== 0) {
        column.push(board[i][j]);
      }
    }
    column = mergeTiles(column);
    for (let i = 3; i >= 0; i--) {
      board[i][j] = column[3 - i] || 0;
    }
  }
  addRandomTile();
}

// Move tiles left
function moveLeft() {
  for (let i = 0; i < 4; i++) {
    let row = [];
    for (let j = 0; j < 4; j++) {
      if (board[i][j] !== 0) {
        row.push(board[i][j]);
      }
    }
    row = mergeTiles(row);
    for (let j = 0; j < 4; j++) {
      board[i][j] = row[j] || 0;
    }
  }
  addRandomTile();
}

// Move tiles right
function moveRight() {
  for (let i = 0; i < 4; i++) {
    let row = [];
    for (let j = 3; j >= 0; j--) {
      if (board[i][j] !== 0) {
        row.push(board[i][j]);
      }
    }
    row = mergeTiles(row);
    for (let j = 3; j >= 0; j--) {
      board[i][j] = row[3 - j] || 0;
    }
  }
  addRandomTile();
}

// Merge tiles and update score
function mergeTiles(tiles) {
  for (let i = 0; i < tiles.length - 1; i++) {
    if (tiles[i] === tiles[i + 1]) {
      tiles[i] *= 2;
      score += tiles[i];
      tiles.splice(i + 1, 1);
      tiles.push(0);
    }
  }
  return tiles;
}

// Update the score display
function updateScore() {
  scoreDisplay.textContent = score;
}

// Reset the game
resetButton.addEventListener('click', init);

// Touchscreen swipe detection
document.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].clientX;
  touchEndY = e.changedTouches[0].clientY;
  handleSwipe();
});

function handleSwipe() {
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;
  const absDeltaX = Math.abs(deltaX);
  const absDeltaY = Math.abs(deltaY);

  if (Math.max(absDeltaX, absDeltaY) > 30) { // Minimum swipe distance
    if (absDeltaX > absDeltaY) {
      if (deltaX > 0) {
        moveRight();
      } else {
        moveLeft();
      }
    } else {
      if (deltaY > 0) {
        moveDown();
      } else {
        moveUp();
      }
    }
    renderBoard();
    updateScore();
  }
}

// Start the game
init();