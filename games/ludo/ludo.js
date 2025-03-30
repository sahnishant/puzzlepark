// script.js
const pieces = document.querySelectorAll('.piece');
const rollDiceButton = document.getElementById('roll-dice');
const diceResult = document.getElementById('dice-result');
let currentPlayer = 1;
let diceValue = 0;

// Positions for each player's pieces
const positions = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
};

// Roll dice
rollDiceButton.addEventListener('click', () => {
  diceValue = Math.floor(Math.random() * 6) + 1;
  diceResult.textContent = `Dice: ${diceValue}`;
  movePiece(currentPlayer, diceValue);
  currentPlayer = currentPlayer === 4 ? 1 : currentPlayer + 1; // Switch player
});

// Move piece
function movePiece(player, steps) {
  const piece = document.querySelector(`.piece[data-player="${player}"]`);
  let position = positions[player];
  position += steps;

  // Check if the piece reaches the center grid
  if (position >= 15) {
    position = 15; // Winning position
    alert(`Player ${player} wins!`);
  }

  positions[player] = position;
  updatePiecePosition(piece, position);
}

// Update piece position on the board
function updatePiecePosition(piece, position) {
  const x = (position % 3) * 50 + 25;
  const y = Math.floor(position / 3) * 50 + 25;
  piece.style.left = `${x}px`;
  piece.style.top = `${y}px`;
}

// Click to move piece (optional)
pieces.forEach((piece) => {
  piece.addEventListener('click', () => {
    if (parseInt(piece.dataset.player) === currentPlayer) {
      movePiece(currentPlayer, diceValue);
    }
  });
});