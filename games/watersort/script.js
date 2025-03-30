const tubesContainer = document.getElementById('tubes-container');
const resetBtn = document.getElementById('resetBtn');
const startBtn = document.getElementById('startBtn');
const seedInput = document.getElementById('seed');
const message = document.getElementById('message');

let tubes = [];
let selectedTube = null;

// Generate a solved state
function generateSolvedState() {
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    const solvedTubes = colors.map(color => Array(4).fill(color)); // Each tube has 4 units of one color
    solvedTubes.push([]); // Add an empty tube
    return solvedTubes;
}

// Scramble the solved state
function scrambleTubes(tubes, moves = 20) {
    for (let i = 0; i < moves; i++) {
        const fromIndex = Math.floor(Math.random() * tubes.length);
        const toIndex = Math.floor(Math.random() * tubes.length);

        if (fromIndex !== toIndex && tubes[fromIndex].length > 0 && tubes[toIndex].length < 4) {
            const liquid = tubes[fromIndex].pop();
            tubes[toIndex].push(liquid);
        }
    }
    return tubes;
}

// Generate a random game based on a seed
function generateGame(seed) {
    const solvedTubes = generateSolvedState();
    const scrambledTubes = scrambleTubes([...solvedTubes], 20); // Scramble with 20 moves
    tubes = scrambledTubes;
}

// Render the tubes
function renderTubes() {
    tubesContainer.innerHTML = '';
    tubes.forEach((tube, index) => {
        const tubeElement = document.createElement('div');
        tubeElement.classList.add('tube');
        tubeElement.dataset.index = index;

        // Add liquid layers (bottom to top)
        tube.forEach(color => {
            const liquid = document.createElement('div');
            liquid.classList.add('liquid', color);
            tubeElement.appendChild(liquid);
        });

        // Add event listeners for drag-and-drop
        tubeElement.addEventListener('click', () => handleTubeClick(index));
        tubesContainer.appendChild(tubeElement);
    });
}

// Handle tube click (drag-and-drop)
function handleTubeClick(index) {
    if (selectedTube === null) {
        // Select the tube if it's not empty
        if (tubes[index].length > 0) {
            selectedTube = index;
            highlightTube(index);
        }
    } else {
        // Move liquid from selected tube to clicked tube
        moveLiquid(selectedTube, index);
        selectedTube = null;
        removeHighlights();
        checkWin();
    }
}

// Move liquid from one tube to another (topmost liquid moves)
function moveLiquid(fromIndex, toIndex) {
    const fromTube = tubes[fromIndex];
    const toTube = tubes[toIndex];

    if (toTube.length < 4) {
        // Get the topmost liquid from the source tube
        const liquid = fromTube[fromTube.length - 1];

        // Check if the destination tube is empty or has the same color on top
        if (toTube.length === 0 || toTube[toTube.length - 1] === liquid) {
            fromTube.pop(); // Remove the topmost liquid
            toTube.push(liquid); // Add it to the destination tube
            renderTubes();
        }
    }
}

// Highlight the selected tube
function highlightTube(index) {
    const tubeElements = document.querySelectorAll('.tube');
    tubeElements[index].style.borderColor = '#ffcc00';
}

// Remove highlights from all tubes
function removeHighlights() {
    const tubeElements = document.querySelectorAll('.tube');
    tubeElements.forEach(tube => tube.style.borderColor = '#333');
}

// Check if the player has won
function checkWin() {
    const isWin = tubes.every(tube => {
        return tube.length === 0 || (tube.length === 4 && new Set(tube).size === 1);
    });

    if (isWin) {
        message.textContent = 'Congratulations! You won!';
        message.classList.remove('hidden');
    }
}

// Reset the game
resetBtn.addEventListener('click', () => {
    const seed = parseInt(seedInput.value, 10);
    if (seed >= 1 && seed <= 100) {
        generateGame(seed);
        renderTubes();
        message.classList.add('hidden');
    } else {
        alert('Please enter a seed between 1 and 100.');
    }
});

// Start the game with the entered seed
startBtn.addEventListener('click', () => {
    const seed = parseInt(seedInput.value, 10);
    if (seed >= 1 && seed <= 100) {
        generateGame(seed);
        renderTubes();
        message.classList.add('hidden');
    } else {
        alert('Please enter a seed between 1 and 100.');
    }
});

// Initial render with default seed
generateGame(1); // Default seed
renderTubes();