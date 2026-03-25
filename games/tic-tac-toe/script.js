document.addEventListener('DOMContentLoaded', () => {
  const cells = document.querySelectorAll('.cell');
  const statusDisplay = document.getElementById('statusDisplay');
  const restartButton = document.getElementById('restartButton');
  const gameBoard = document.getElementById('gameBoard'); // Get the board itself

  let gameActive = true;
  let currentPlayer = 'X';
  let gameState = ["", "", "", "", "", "", "", "", ""]; // Represents the 9 cells

  const winningMessage = () => {
      statusDisplay.classList.add('win'); // Add class for styling
      return `Player ${currentPlayer} has won!`;
  };
  const drawMessage = () => {
      statusDisplay.classList.add('draw'); // Add class for styling
      return `Game ended in a draw!`;
  };
  const currentPlayerTurn = () => `Player ${currentPlayer}'s turn`;

  const winningConditions = [
      [0, 1, 2], // Top row
      [3, 4, 5], // Middle row
      [6, 7, 8], // Bottom row
      [0, 3, 6], // Left column
      [1, 4, 7], // Middle column
      [2, 5, 8], // Right column
      [0, 4, 8], // Diagonal \
      [2, 4, 6]  // Diagonal /
  ];

  // --- Functions ---

  const handleCellPlayed = (clickedCell, clickedCellIndex) => {
      gameState[clickedCellIndex] = currentPlayer; // Update internal state
      clickedCell.innerHTML = ''; // Clear potential previous text node if restart was weird
      clickedCell.classList.add(currentPlayer.toLowerCase()); // Add 'x' or 'o' class for styling
      // We use CSS ::before pseudo-element for the visual 'X' or 'O' with animation
  };

  const handlePlayerChange = () => {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      statusDisplay.innerHTML = currentPlayerTurn();
      // Reset status text color classes
      statusDisplay.classList.remove('win', 'draw');
  };

  const handleResultValidation = () => {
      let roundWon = false;
      for (let i = 0; i < winningConditions.length; i++) {
          const winCondition = winningConditions[i];
          const a = gameState[winCondition[0]];
          const b = gameState[winCondition[1]];
          const c = gameState[winCondition[2]];

          if (a === '' || b === '' || c === '') {
              continue; // If any cell in the condition is empty, skip it
          }
          if (a === b && b === c) {
              roundWon = true; // We have a winner!
              break;
          }
      }

      if (roundWon) {
          statusDisplay.innerHTML = winningMessage();
          gameActive = false;
          return; // End the check, someone won
      }

      // Check for Draw (if no winner and all cells are filled)
      const roundDraw = !gameState.includes("");
      if (roundDraw && !roundWon) { // Make sure it's not a win on the last move
          statusDisplay.innerHTML = drawMessage();
          gameActive = false;
          return; // End the check, it's a draw
      }

      // If we reach here, the game continues, change player
      handlePlayerChange();
  };

  const handleCellClick = (event) => {
      const clickedCell = event.target;
      const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

      // Check if the cell is already played or if the game is inactive
      if (gameState[clickedCellIndex] !== "" || !gameActive) {
          return;
      }

      // Process the click
      handleCellPlayed(clickedCell, clickedCellIndex);
      handleResultValidation();
  };

  const handleRestartGame = () => {
      gameActive = true;
      currentPlayer = "X";
      gameState = ["", "", "", "", "", "", "", "", ""];
      statusDisplay.innerHTML = currentPlayerTurn();
      statusDisplay.classList.remove('win', 'draw'); // Reset status style
      cells.forEach(cell => {
          cell.innerHTML = ''; // Clear the visual content (though CSS handles it)
          cell.classList.remove('x', 'o'); // Remove player classes
      });
  };

  // --- Initial Setup ---

  statusDisplay.innerHTML = currentPlayerTurn(); // Set initial status

  // --- Event Listeners ---

  cells.forEach(cell => cell.addEventListener('click', handleCellClick));
  restartButton.addEventListener('click', handleRestartGame);
});