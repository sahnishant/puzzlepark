let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
const gameContainer = document.getElementById('game-container')
const messageContainer = document.getElementById('message');

function displayMessage(message) {
   messageContainer.textContent = message;
}

const boardDiv = document.createElement('div');
boardDiv.classList.add('tic-tac-toe-board');
 function renderBoard() {
   boardDiv.innerHTML = '';
     for(let i = 0; i < 9; i++) {
       const cell = document.createElement('div');
       cell.classList.add('tic-tac-toe-cell');
        cell.textContent = board[i];
         cell.dataset.index = i;
         cell.addEventListener('click', handleCellClick)
       boardDiv.appendChild(cell);
     }
      gameContainer.appendChild(boardDiv);
 }

function handleCellClick(event) {
     const index = parseInt(event.target.dataset.index);
     if(board[index] === '') {
       board[index] = currentPlayer;
        renderBoard();

        if(checkWinner()) {
             displayMessage(`Player ${currentPlayer} Wins!`);
             resetButton();
             return;
        } else if(isBoardFull()){
            displayMessage(`It's a tie!`);
            resetButton();
             return;
        }
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
     }
 }
function checkWinner() {
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
     if(board[a] && board[a] === board[b] && board[a] === board[c]) {
       return true;
      }
   }
   return false;
}

function isBoardFull() {
    return board.every(cell => cell !== '');
}

 function resetButton() {
     const button = document.createElement('button')
      button.textContent = 'Play Again'
      button.addEventListener('click', () => resetGame())
     gameContainer.appendChild(button);
}

function resetGame() {
 currentPlayer = 'X';
  board = ['', '', '', '', '', '', '', '', ''];
  gameContainer.innerHTML = '';
  displayMessage('');
    loadTicTacToeGame();
}
renderBoard();

function loadTicTacToeGame() {
   let currentPlayer = 'X';
  let board = ['', '', '', '', '', '', '', '', ''];
   const boardDiv = document.createElement('div');
   boardDiv.classList.add('tic-tac-toe-board');
    function renderBoard() {
       boardDiv.innerHTML = '';
       for(let i = 0; i < 9; i++) {
           const cell = document.createElement('div');
            cell.classList.add('tic-tac-toe-cell');
            cell.textContent = board[i];
           cell.dataset.index = i;
           cell.addEventListener('click', handleCellClick)
         boardDiv.appendChild(cell);
      }
       gameContainer.appendChild(boardDiv);
  }

function handleCellClick(event) {
       const index = parseInt(event.target.dataset.index);
      if(board[index] === '') {
         board[index] = currentPlayer;
          renderBoard();

           if(checkWinner()) {
                displayMessage(`Player ${currentPlayer} Wins!`);
              resetButton();
                return;
           } else if(isBoardFull()){
              displayMessage(`It's a tie!`);
                resetButton();
              return;
          }
           currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      }
}
function checkWinner() {
      const winningConditions = [
          [0, 1, 2], [3, 4, 5], [6, 7, 8],
         [0, 3, 6], [1, 4, 7], [2, 5, 8],
          [0, 4, 8], [2, 4, 6]
     ];
      for (let condition of winningConditions) {
         const [a, b, c] = condition;
          if(board[a] && board[a] === board[b] && board[a] === board[c]) {
              return true;
         }
      }
      return false;
}

  function isBoardFull() {
      return board.every(cell => cell !== '');
  }

    function resetButton() {
      const button = document.createElement('button')
       button.textContent = 'Play Again'
      button.addEventListener('click', () => resetGame())
      gameContainer.appendChild(button);
  }
     renderBoard();
      const styleTag = document.createElement('style');
    styleTag.textContent = `
     .tic-tac-toe-board {
         display: grid;
        grid-template-columns: repeat(3, 100px);
         gap: 10px;
        margin-top: 20px;
     }

   .tic-tac-toe-cell {
       width: 100px;
        height: 100px;
        border: 1px solid #ddd;
        display: flex;
        justify-content: center;
         align-items: center;
         font-size: 2em;
        cursor: pointer;
      }

      .tic-tac-toe-cell:hover {
       background-color: #f0f0f0;
     }
    `;
     document.head.appendChild(styleTag);
}