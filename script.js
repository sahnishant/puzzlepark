document.addEventListener('DOMContentLoaded', () => {
    const gameList = document.getElementById('game-list');
    const gameContainer = document.getElementById('game-container');
      const messageContainer = document.getElementById('message');

    gameList.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            const gameName = event.target.dataset.game;
           loadGame(gameName);
        }
    });

     function displayMessage(message) {
        messageContainer.textContent = message;
     }

    function loadGame(gameName) {
        gameContainer.innerHTML = ''; // Clear previous content
         displayMessage('');

         if (gameName === 'sudoku') {
            loadSudokuGame();
        } else if (gameName === 'number-guess') {
           loadNumberGuessingGame();
        }  else if (gameName === 'tic-tac-toe') {
            loadTicTacToeGame();
        }  else if (gameName === 'memory-game') {
            loadMemoryGame();
        }
    }


    //Example Sudoku Game
    function loadSudokuGame() {
            // Example Sudoku grid (0 represents an empty cell)
        const initialGrid = [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9],
        ];

            class Sudoku {
            constructor(grid) {
                this.grid = grid; // 2D array representing the board
                this.initialGrid = grid.map(row => [...row]); // Save the original state for resetting
                this.rows = Array(9).fill().map(() => []);
                this.cols = Array(9).fill().map(() => []);
                this.boxes = Array(9).fill().map(() => []);

                // Pre-fill cells in rows, cols, and boxes
                for (let r = 0; r < 9; r++) {
                    for (let c = 0; c < 9; c++) {
                        const value = this.grid[r][c];
                        if(value !== 0) {
                        this.rows[r].push(value);
                        this.cols[c].push(value);
                        this.boxes[this.getBoxIndex(r,c)].push(value)
                        }
                    }
                }
            }

            getBoxIndex(row, col) {
                return Math.floor(row / 3) * 3 + Math.floor(col / 3);
            }


            isValidMove(row, col, value) {
                if(this.rows[row].includes(value) || this.cols[col].includes(value) || this.boxes[this.getBoxIndex(row, col)].includes(value)) {
                    return false;
                }
                return true;
            }

            makeMove(row, col, value) {
                if(!this.isValidMove(row, col, value)) {
                  return false; // Invalid Move
                }

                this.grid[row][col] = value;
                this.rows[row].push(value);
                this.cols[col].push(value);
                this.boxes[this.getBoxIndex(row,col)].push(value);
               return true; // Successful move
            }

             clearMove(row, col, value) {
                  this.grid[row][col] = 0;
                 this.rows[row] = this.rows[row].filter(v => v !== value);
                  this.cols[col] = this.cols[col].filter(v => v !== value);
                  this.boxes[this.getBoxIndex(row,col)] = this.boxes[this.getBoxIndex(row,col)].filter(v => v !== value);
            }

             isSolved() {
                for(let r = 0; r < 9; r++) {
                for(let c = 0; c < 9; c++){
                    if(this.grid[r][c] === 0) {
                    return false
                    }
                }
                }

                for (let i = 0; i < 9; i++) {
                if (new Set(this.rows[i]).size !== 9 ||
                    new Set(this.cols[i]).size !== 9 ||
                    new Set(this.boxes[i]).size !== 9) {
                    return false; // Duplicates in rows, cols, or boxes
                }
                }
                return true;
            }

             reset() {
                 this.grid = this.initialGrid.map(row => [...row]);
                 this.rows = Array(9).fill().map(() => []);
                this.cols = Array(9).fill().map(() => []);
                this.boxes = Array(9).fill().map(() => []);
                // Pre-fill cells in rows, cols, and boxes
                for (let r = 0; r < 9; r++) {
                    for (let c = 0; c < 9; c++) {
                        const value = this.grid[r][c];
                        if(value !== 0) {
                            this.rows[r].push(value);
                            this.cols[c].push(value);
                            this.boxes[this.getBoxIndex(r,c)].push(value)
                        }
                    }
                }
            }
        }
        const game = new Sudoku(initialGrid);
        let selectedCell = null;

        function renderSudoku() {
              gameContainer.innerHTML = '';
               const gridDiv = document.createElement('div');
               gridDiv.classList.add('sudoku-grid');
               for (let row = 0; row < 9; row++) {
                 for (let col = 0; col < 9; col++) {
                    const cellValue = game.grid[row][col];
                   const cellDiv = document.createElement('div');
                        if((row + 1) % 3 === 0 && (col+1) % 3 === 0 ||
                        (row + 1) % 3 === 0 && (col) % 3 === 0 ||
                        (row) % 3 === 0 && (col+1) % 3 === 0 ||
                        (row) % 3 === 0 && (col) % 3 === 0) {
                        cellDiv.classList.add('box');
                        }

                    if(cellValue === 0) {
                        const input = document.createElement('input');
                        input.type = 'number';
                        input.min = 1;
                        input.max = 9;
                         input.addEventListener('focus', () => {
                            selectedCell = {row, col};
                        })
                        input.addEventListener('input', (e) => handleInput(e, row, col));
                        cellDiv.appendChild(input);
                    } else {
                        cellDiv.textContent = cellValue;
                    }
                  gridDiv.appendChild(cellDiv);
                 }
              }
              gameContainer.appendChild(gridDiv)
        }

       function handleInput(event, row, col) {
                const value = parseInt(event.target.value) || 0;
               if (value > 0 && value < 10) {
                   const prevValue = game.grid[row][col];
                    game.clearMove(row, col, prevValue);
                  const move = game.makeMove(row, col, value);
                    if(!move){
                    displayMessage("Invalid Move")
                     game.clearMove(row, col, value);
                  } else {
                   displayMessage('');
                    checkIfSolved();
                  }
               } else if (value === 0) {
                 const prevValue = game.grid[row][col];
                game.clearMove(row, col, prevValue);
               displayMessage('');
            } else {
                    event.target.value = '';
                    displayMessage("Invalid Move")
                }

            renderSudoku()
        }

       function checkIfSolved() {
        if(game.isSolved()) {
          displayMessage('You Won!')
        }
      }

        function resetGame() {
            game.reset();
            displayMessage('');
             renderSudoku();
        }

        const resetButton = document.createElement('button')
        resetButton.textContent = 'Reset'
        resetButton.addEventListener('click', () => resetGame())
        gameContainer.appendChild(resetButton)

         renderSudoku();

           const styleTag = document.createElement('style');
            styleTag.textContent = `
            .sudoku-grid {
                 display: grid;
                grid-template-columns: repeat(9, 40px);
                border: 2px solid black;
                 margin-bottom: 20px;
             }

            .sudoku-grid div {
                 width: 40px;
                height: 40px;
                border: 1px solid lightgray;
               display: flex;
                justify-content: center;
                align-items: center;
                 font-size: 20px;
             }

             .sudoku-grid div.box {
                border: 2px solid black;
             }
            input {
                width: 40px;
                height: 40px;
                font-size: 20px;
                text-align: center;
           }
            `;
             document.head.appendChild(styleTag);
    }


      // Example Number Guessing Game
      function loadNumberGuessingGame() {
        let secretNumber = Math.floor(Math.random() * 100) + 1;
        let attempts = 0;

        const input = document.createElement('input');
        input.type = 'number';
        input.min = 1;
        input.max = 100;
        const guessButton = document.createElement('button');
        guessButton.textContent = 'Guess';

        gameContainer.appendChild(input);
        gameContainer.appendChild(guessButton);

        guessButton.addEventListener('click', () => {
            const guess = parseInt(input.value);
            attempts++;

            if (isNaN(guess) || guess < 1 || guess > 100) {
                displayMessage("Please enter a valid number between 1 and 100.");
            } else if (guess === secretNumber) {
                displayMessage(`Congratulations! You guessed the number in ${attempts} attempts.`);
                 resetButton();
            } else if (guess < secretNumber) {
                displayMessage("Too low! Guess higher.");
            } else {
                displayMessage("Too high! Guess lower.");
            }
            input.value = '';
        });

       function resetButton() {
        const button = document.createElement('button')
         button.textContent = 'Play Again'
         button.addEventListener('click', () => loadNumberGuessingGame())
        gameContainer.appendChild(button);
       }
    }
    // TicTacToe Game
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
              button.addEventListener('click', () => loadTicTacToeGame())
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

      //Memory Game
     function loadMemoryGame() {
        const images = [
            'image1.png', 'image1.png',
            'image2.png', 'image2.png',
            'image3.png', 'image3.png',
            'image4.png', 'image4.png',
            'image5.png', 'image5.png',
            'image6.png', 'image6.png',
            ];

        let flippedCards = [];
        let matchedPairs = 0;
        let cardElements = [];

        // Shuffle the array of images
        const shuffledImages = shuffleArray(images);


        function shuffleArray(array) {
          for (let i = array.length - 1; i > 0; i--) {
             const j = Math.floor(Math.random() * (i + 1));
             [array[i], array[j]] = [array[j], array[i]];
           }
          return array;
         }

        const memoryGrid = document.createElement('div');
        memoryGrid.classList.add('memory-grid');
        for(let i = 0; i < images.length; i++) {
           const cardDiv = document.createElement('div');
            cardDiv.classList.add('memory-card');
            cardDiv.dataset.index = i;
            const cardBack = document.createElement('div');
            cardBack.classList.add('memory-card-back');
            const cardFront = document.createElement('div');
           cardFront.classList.add('memory-card-front');
            cardFront.style.backgroundImage = `url(${shuffledImages[i]})`
            cardDiv.appendChild(cardBack);
             cardDiv.appendChild(cardFront)

            cardDiv.addEventListener('click', handleCardClick);
            memoryGrid.appendChild(cardDiv);
          cardElements.push(cardDiv)
        }

        gameContainer.appendChild(memoryGrid)
        function handleCardClick(event) {
          const clickedCard = event.currentTarget;
           const index = clickedCard.dataset.index;

          if(flippedCards.length < 2 && !clickedCard.classList.contains('matched')) {
            flipCard(clickedCard);
            flippedCards.push({ card: clickedCard, image: shuffledImages[index]});
          }

         if(flippedCards.length === 2) {
                setTimeout(() => {
                      const [firstCard, secondCard] = flippedCards;
                      if(firstCard.image === secondCard.image) {
                          firstCard.card.classList.add('matched')
                          secondCard.card.classList.add('matched');
                         matchedPairs++;

                        if (matchedPairs === images.length / 2) {
                          displayMessage('Congratulations! You won the Memory Game!');
                         resetButton();
                          }
                      } else {
                           flipCard(firstCard.card)
                         flipCard(secondCard.card)
                      }
                    flippedCards = [];
                  }, 1000)

          }
       }

        function flipCard(card) {
            card.classList.toggle('flipped');
        }
        function resetButton() {
            const button = document.createElement('button')
            button.textContent = 'Play Again'
            button.addEventListener('click', () => loadMemoryGame())
             gameContainer.appendChild(button);
       }

        const styleTag = document.createElement('style');
        styleTag.textContent = `
          .memory-grid {
               display: grid;
               grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
               gap: 10px;
             margin-top: 20px;
             }

            .memory-card {
                width: 100%;
               height: 150px;
               position: relative;
              perspective: 1000px; /* Required for 3D flip */
              cursor: pointer;
            }

            .memory-card .memory-card-back,
           .memory-card .memory-card-front {
              position: absolute;
              width: 100%;
                height: 100%;
              backface-visibility: hidden;
              transition: transform 0.6s; /* Smooth transition */
             border: 1px solid #ddd;
               display: flex;
                justify-content: center;
                align-items: center;

           }
          .memory-card .memory-card-back {
             background-color: #eee;
              z-index: 1;

          }

           .memory-card .memory-card-front {
              transform: rotateY(180deg);
              background-size: cover;
              background-position: center;
            }

             .memory-card.flipped .memory-card-back {
               transform: rotateY(180deg)
            }
           .memory-card.flipped .memory-card-front {
                 transform: rotateY(0deg);
          }
            .memory-card.matched .memory-card-back{
               background-color: gray;
            }
            .memory-card.matched .memory-card-front {
              transform: none;
            }
        `;

        document.head.appendChild(styleTag);
     }
});