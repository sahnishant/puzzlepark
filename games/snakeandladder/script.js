const board = document.querySelector('.board');
const statusDiv = document.querySelector('.status');
const rollDiceButton = document.getElementById('roll-dice');

let playerPosition = 1;
let computerPosition = 1;
const snakes = { 16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78 };
const ladders = { 1: 38, 4: 14, 9: 31, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100 };

function createBoard() {
    for (let i = 100; i >= 1; i--) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.textContent = i;
        board.appendChild(cell);
    }
}

function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

function movePlayer(player, steps) {
    let newPosition = player + steps;
    if (newPosition > 100) {
        newPosition = player;
    }
    if (snakes[newPosition]) {
        newPosition = snakes[newPosition];
    } else if (ladders[newPosition]) {
        newPosition = ladders[newPosition];
    }
    return newPosition;
}

function updateStatus(message) {
    statusDiv.textContent = message;
}

function checkWin(position) {
    if (position === 100) {
        return true;
    }
    return false;
}

function computerTurn() {
    const steps = rollDice();
    computerPosition = movePlayer(computerPosition, steps);
    updateStatus(`Computer rolled a ${steps} and moved to ${computerPosition}`);
    if (checkWin(computerPosition)) {
        updateStatus('Computer wins!');
        rollDiceButton.disabled = true;
    }
}

rollDiceButton.addEventListener('click', () => {
    const steps = rollDice();
    playerPosition = movePlayer(playerPosition, steps);
    updateStatus(`You rolled a ${steps} and moved to ${playerPosition}`);
    if (checkWin(playerPosition)) {
        updateStatus('You win!');
        rollDiceButton.disabled = true;
    } else {
        setTimeout(computerTurn, 1000);
    }
});
// Add this function to draw ladders
function drawLadders() {
    const boardRect = board.getBoundingClientRect(); // Get the board's position relative to the viewport

    for (const [start, end] of Object.entries(ladders)) {
        const startCell = document.querySelector(`.cell:nth-child(${101 - start})`);
        const endCell = document.querySelector(`.cell:nth-child(${101 - end})`);

        const startRect = startCell.getBoundingClientRect();
        const endRect = endCell.getBoundingClientRect();

        // Calculate positions relative to the board container
        const startX = startRect.left + startRect.width / 2 - boardRect.left;
        const startY = startRect.top + startRect.height / 2 - boardRect.top;
        const endX = endRect.left + endRect.width / 2 - boardRect.left;
        const endY = endRect.top + endRect.height / 2 - boardRect.top;

        const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
        const length = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);

        const ladder = document.createElement('div');
        ladder.classList.add('ladder');
        ladder.style.width = `${length}px`;
        ladder.style.transform = `rotate(${angle}deg)`;
        ladder.style.left = `${startX}px`;
        ladder.style.top = `${startY}px`;

        board.appendChild(ladder);
    }
}

// Call this function after creating the board
createBoard();
drawLadders();