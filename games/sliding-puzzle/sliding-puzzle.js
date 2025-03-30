  const gameContainer = document.getElementById('game-container')
   const messageContainer = document.getElementById('message');

    function displayMessage(message) {
        messageContainer.textContent = message;
   }
      let tiles = [];
        let emptyTileIndex = 15; // index of the empty tile in the array (0 to 15);
       const gridSize = 4;

       function createPuzzle() {
           tiles = [...Array(16).keys()]; //Create a sequence of number 0 to 15;
           tiles.sort(() => Math.random() - 0.5); // Shuffle tiles
           emptyTileIndex = tiles.indexOf(0); // Make sure 0 is the empty tile
           renderPuzzle();
       }

       function renderPuzzle() {
            gameContainer.innerHTML = '';
           const puzzleDiv = document.createElement('div');
          puzzleDiv.classList.add('sliding-puzzle-grid')
         for (let i = 0; i < 16; i++) {
           const tile = document.createElement('div');
           tile.classList.add('sliding-puzzle-tile');
           tile.dataset.index = i; // Store tile index
           tile.textContent = tiles[i] === 0 ? '' : tiles[i]; //Show content if not 0;
           tile.addEventListener('click', () => handleTileClick(i)); // Add click event to tile
             if(tiles[i] === 0){
                 tile.classList.add('empty-tile'); // Highlight an empty tile
             }
              puzzleDiv.appendChild(tile);
          }
           gameContainer.appendChild(puzzleDiv);
       }

       function handleTileClick(tileIndex) {
          if (isAdjacent(tileIndex)) { //Make sure tiles clicked is adjacent to empty tile
               swapTiles(tileIndex);
              renderPuzzle();
              if (checkWin()) { // If puzzle is won then show winning message
                 displayMessage('Congratulations, you solved the puzzle');
               resetButton();
              }
          }
       }

      function isAdjacent(tileIndex) {
          const tileRow = Math.floor(tileIndex / gridSize);
           const tileCol = tileIndex % gridSize;
         const emptyRow = Math.floor(emptyTileIndex / gridSize);
         const emptyCol = emptyTileIndex % gridSize;

           return (Math.abs(tileRow - emptyRow) + Math.abs(tileCol - emptyCol) === 1)
      }

       function swapTiles(tileIndex) {
           [tiles[tileIndex], tiles[emptyTileIndex]] = [tiles[emptyTileIndex], tiles[tileIndex]]; //Swap tiles array values
             emptyTileIndex = tileIndex; // Update empty tile index
       }

        function checkWin() {
           for(let i = 0; i < 15; i++){
              if(tiles[i] !== i+1) {
                 return false;
               }
          }
           return true
        }

        function resetButton() {
         const button = document.createElement('button')
          button.textContent = 'Play Again'
           button.addEventListener('click', () => resetGame())
        gameContainer.appendChild(button);
        }

       function resetGame() {
         createPuzzle(); //Create a new shuffled puzzle
         displayMessage('');
       }
      createPuzzle();

       const styleTag = document.createElement('style');
        styleTag.textContent = `
          .sliding-puzzle-grid {
               display: grid;
                grid-template-columns: repeat(4, 100px);
                gap: 2px;
             margin-top: 20px;
            }

            .sliding-puzzle-tile {
              width: 100px;
                height: 100px;
                border: 1px solid #ddd;
                display: flex;
               justify-content: center;
              align-items: center;
                font-size: 2em;
               cursor: pointer;
              background-color: #f0f0f0;
             }

          .sliding-puzzle-tile:hover {
              background-color: #e0e0e0;
           }

            .sliding-puzzle-tile.empty-tile {
               background-color: lightgray;
              cursor: default;
         }
      `;
        document.head.appendChild(styleTag);