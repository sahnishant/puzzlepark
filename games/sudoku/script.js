document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('sudoku-board');
    const seedInput = document.getElementById('seed');
    const difficultySelect = document.getElementById('difficulty');
    const generateButton = document.getElementById('generate');
  
    let puzzle = [];
    let solution = [];
  
    generateButton.addEventListener('click', () => {
      const seed = parseInt(seedInput.value);
      const difficulty = difficultySelect.value;
      generateSudoku(seed, difficulty);
      renderBoard();
    });
  
    function generateSudoku(seed, difficulty) {
      // Reset puzzle and solution
      puzzle = [];
      solution = [];
  
      // Generate a full solved Sudoku grid
      solution = generateSolvedGrid(seed);
  
      // Create a puzzle by removing numbers based on difficulty
      puzzle = removeNumbers(solution, difficulty);
    }
  
    function generateSolvedGrid(seed) {
      const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
      const random = new Random(seed);
  
      // Fill the grid using a backtracking algorithm
      solveSudoku(grid, random);
      return grid;
    }
  
    function solveSudoku(grid, random) {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (grid[row][col] === 0) {
            const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], random);
            for (const num of numbers) {
              if (isValid(grid, row, col, num)) {
                grid[row][col] = num;
                if (solveSudoku(grid, random)) {
                  return true;
                }
                grid[row][col] = 0;
              }
            }
            return false;
          }
        }
      }
      return true;
    }
  
    function removeNumbers(grid, difficulty) {
      const cellsToRemove = difficulty === 'easy' ? 40 : difficulty === 'medium' ? 50 : 60;
      const puzzle = JSON.parse(JSON.stringify(grid));
      const random = new Random(parseInt(seedInput.value));
  
      for (let i = 0; i < cellsToRemove; i++) {
        let row, col;
        do {
          row = random.nextInt(9);
          col = random.nextInt(9);
        } while (puzzle[row][col] === 0);
        puzzle[row][col] = 0;
      }
      return puzzle;
    }
  
    function renderBoard() {
      board.innerHTML = '';
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          const cell = document.createElement('input');
          cell.type = 'text';
          cell.classList.add('cell');
          cell.dataset.row = row;
          cell.dataset.col = col;
          cell.value = puzzle[row][col] === 0 ? '' : puzzle[row][col];
          cell.readOnly = puzzle[row][col] !== 0;
          cell.addEventListener('input', validateInput);
          cell.addEventListener('keydown', handleKeyDown);
          board.appendChild(cell);
        }
      }
    }
  
    function validateInput(event) {
      const cell = event.target;
      const row = parseInt(cell.dataset.row);
      const col = parseInt(cell.dataset.col);
      const value = parseInt(cell.value) || 0;
      if (cell.value === '') {
        // If the cell is empty, remove both correct and incorrect classes
        cell.classList.remove('correct', 'incorrect');}
        else  
      if (value === solution[row][col]) {
        cell.classList.remove('incorrect');
        cell.classList.add('correct');
      } else {
        cell.classList.remove('correct');
        cell.classList.add('incorrect');
      }
    }
  
    function handleKeyDown(event) {
        const key = event.key;
        const currentCell = event.target;
        const row = parseInt(currentCell.dataset.row);
        const col = parseInt(currentCell.dataset.col);
      
        if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight') {
          event.preventDefault(); // Prevent default scrolling behavior
      
          let nextRow = row;
          let nextCol = col;
      
          do {
            if (key === 'ArrowUp') {
              nextRow = nextRow - 1;
              if (nextRow < 0) nextRow = 8; // Wrap around to the bottom
            } else if (key === 'ArrowDown') {
              nextRow = nextRow + 1;
              if (nextRow > 8) nextRow = 0; // Wrap around to the top
            } else if (key === 'ArrowLeft') {
              nextCol = nextCol - 1;
              if (nextCol < 0) nextCol = 8; // Wrap around to the right
            } else if (key === 'ArrowRight') {
              nextCol = nextCol + 1;
              if (nextCol > 8) nextCol = 0; // Wrap around to the left
            }
      
            const nextCell = document.querySelector(`.cell[data-row="${nextRow}"][data-col="${nextCol}"]`);
            if (nextCell) {
              nextCell.focus();
              break; // Exit the loop once an empty cell is found and focused
            }
          } while (nextRow !== row || nextCol !== col); // Ensure we don't loop indefinitely
        }
      }
  
    function isValid(grid, row, col, num) {
      for (let i = 0; i < 9; i++) {
        if (grid[row][i] === num || grid[i][col] === num) return false;
      }
      const startRow = Math.floor(row / 3) * 3;
      const startCol = Math.floor(col / 3) * 3;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (grid[startRow + i][startCol + j] === num) return false;
        }
      }
      return true;
    }
  
    function shuffle(array, random) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = random.nextInt(i + 1);
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
  
    class Random {
      constructor(seed) {
        this.seed = seed;
      }
  
      nextInt(max) {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return Math.floor((this.seed / 233280) * max);
      }
    }
  });