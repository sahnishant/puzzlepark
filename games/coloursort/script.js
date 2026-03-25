const gameContainer = document.getElementById('game-container');
const nextLevelButton = document.getElementById('next-level');
const resetButton = document.getElementById('reset-level'); // Renamed reference
const levelDisplay = document.getElementById('level-display');

const MAX_CAPACITY = 4; // Maximum number of colors per bottle
const MIN_SHUFFLE_MOVES = 20; // Minimum moves to shuffle a level
const MOVES_PER_LEVEL = 10;  // How many extra shuffle moves per level

// Define a pool of colors to use
const COLOR_PALETTE = [
    '#FF5733', '#33FF57', '#3357FF', '#FFC300', '#C70039',
    '#900C3F', '#581845', '#FF69B4', '#1E90FF', '#ADFF2F',
    '#FF4500', '#7FFF00', '#DAA520', '#8A2BE2', '#00FFFF'
];

let currentLevel = 0;
let bottleData = []; // Array of arrays, e.g., [['red', 'blue'], ['red'], []]
let bottleElements = []; // Array of DOM elements for bottles
let selectedBottleIndex = null;
let history = []; // To store moves for potential undo functionality (optional)

// --- Level Generation ---

function generateLevelConfig(level) {
    // Increase difficulty: more colors, potentially more bottles
    const numColors = Math.min(3 + Math.floor(level / 2), COLOR_PALETTE.length);
    const numBottles = numColors + 1; // Standard: number of colors + 2 empty bottles
    const colors = COLOR_PALETTE.slice(0, numColors); // Select colors for the level
    const shuffleMoves = MIN_SHUFFLE_MOVES*10 + level * MOVES_PER_LEVEL;

    return {
        numBottles,
        colors,
        shuffleMoves
    };
}

function generateSolvableLevelState(config) {
    const { numBottles, colors, shuffleMoves } = config;
    let initialState = [];

    // 1. Create the solved state
    for (const color of colors) {
        initialState.push(Array(MAX_CAPACITY).fill(color));
    }
    // Add empty bottles
    for (let i = 0; i < numBottles - colors.length; i++) {
        initialState.push([]);
    }

    // 2. Shuffle the state with random valid moves
    let currentState = JSON.parse(JSON.stringify(initialState)); // Deep copy to avoid modifying the original
    let movesMade = 0;

    while (movesMade < shuffleMoves) {
        const possibleSources = [];
        const possibleTargets = [];

        // Find possible source and target bottles for a move
        for (let i = 0; i < numBottles; i++) {
            if (currentState[i].length > 0) {
                possibleSources.push(i);
            }
            if (currentState[i].length < MAX_CAPACITY) {
                possibleTargets.push(i);
            }
        }

        if (possibleSources.length === 0 || possibleTargets.length === 0) {
            break; // No valid moves possible
        }

        // Randomly select a source and target bottle
        const sourceIndex = possibleSources[Math.floor(Math.random() * possibleSources.length)];
        const targetIndex = possibleTargets[Math.floor(Math.random() * possibleTargets.length)];

        if (sourceIndex === targetIndex) continue; // Skip if source and target are the same

        const sourceBottle = currentState[sourceIndex];
        const targetBottle = currentState[targetIndex];
        const colorToMove = sourceBottle[sourceBottle.length - 1];

        // Check if the move is valid
        if (targetBottle.length === 0 || targetBottle[targetBottle.length - 1] === colorToMove) {
            // Perform the move
            targetBottle.push(sourceBottle.pop());
            movesMade++;

            // Add complexity: Perform additional random moves after every few moves
            if (movesMade % 5 === 0) {
                performRandomMove(currentState, numBottles);
            }
        }
    }

    // 3. Ensure the generated state isn't already solved
    if (checkWinCondition(currentState)) {
        console.log("Generated state was already solved, re-shuffling slightly...");
        // Perform a simple shuffle to ensure it's not solved
        const sourceIndex = currentState.findIndex(bottle => bottle.length > 0);
        const targetIndex = currentState.findIndex(bottle => bottle.length < MAX_CAPACITY && bottle.length > 0);

        if (sourceIndex !== -1 && targetIndex !== -1 && sourceIndex !== targetIndex) {
            currentState[targetIndex].push(currentState[sourceIndex].pop());
        }
    }

    return currentState;
}

// Helper function to perform additional random moves
function performRandomMove(state, numBottles) {
    const possibleSources = [];
    const possibleTargets = [];

    // Find possible source and target bottles for a move
    for (let i = 0; i < numBottles; i++) {
        if (state[i].length > 0) {
            possibleSources.push(i);
        }
        if (state[i].length < MAX_CAPACITY) {
            possibleTargets.push(i);
        }
    }

    if (possibleSources.length === 0 || possibleTargets.length === 0) {
        return; // No valid moves possible
    }

    // Randomly select a source and target bottle
    const sourceIndex = possibleSources[Math.floor(Math.random() * possibleSources.length)];
    const targetIndex = possibleTargets[Math.floor(Math.random() * possibleTargets.length)];

    if (sourceIndex === targetIndex) return; // Skip if source and target are the same

    const sourceBottle = state[sourceIndex];
    const targetBottle = state[targetIndex];
    const colorToMove = sourceBottle[sourceBottle.length - 1];

    // Check if the move is valid
    if (targetBottle.length === 0 || targetBottle[targetBottle.length - 1] === colorToMove) {
        // Perform the move
        targetBottle.push(sourceBottle.pop());
    }
}
// --- Game Logic ---

function startGame() {
    createLevel(currentLevel);
}

function createLevel(level) {
    const config = generateLevelConfig(level);
    bottleData = generateSolvableLevelState(config);
    history = []; // Reset history for the new level
    selectedBottleIndex = null;

    levelDisplay.textContent = level + 1; // Update level display (1-based)
    renderBottles();
    hideButtons();
}

function handleBottleClick(index) {
    const clickedBottle = bottleData[index];

    if (selectedBottleIndex === null) {
        // Selecting a source bottle
        if (clickedBottle.length > 0) { // Can only select non-empty bottles
            selectedBottleIndex = index;
            updateBottleSelectionVisuals();
        }
    } else {
        // Have a source bottle selected, now selecting a target
        if (selectedBottleIndex === index) {
            // Deselecting the current bottle
            selectedBottleIndex = null;
            updateBottleSelectionVisuals();
        } else {
            // Attempting to pour
            if (canPour(selectedBottleIndex, index)) {
                pourColor(selectedBottleIndex, index);
                // Record move (optional)
                // history.push({ from: selectedBottleIndex, to: index });

                selectedBottleIndex = null; // Deselect after pouring
                renderBottles(); // Re-render after pouring data change

                // Check game state
                if (checkWinCondition(bottleData)) {
                    showButton(nextLevelButton);
                    // Optionally disable further clicks
                    // gameContainer.style.pointerEvents = 'none';
                } else if (!hasValidMoves(bottleData)) {
                     showButton(resetButton);
                     // Optionally disable further clicks
                     // gameContainer.style.pointerEvents = 'none';
                }
            } else {
                // Invalid pour target, just deselect the source
                // console.log("Invalid move"); // Optional feedback
                const previouslySelected = selectedBottleIndex;
                selectedBottleIndex = null;
                updateBottleSelectionVisuals(previouslySelected); // Deselect old one
                // If the newly clicked bottle is valid to be selected, select it
                if(clickedBottle.length > 0) {
                    selectedBottleIndex = index;
                    updateBottleSelectionVisuals();
                }
            }
        }
    }
}

function canPour(fromIndex, toIndex) {
    const sourceBottle = bottleData[fromIndex];
    const targetBottle = bottleData[toIndex];

    if (sourceBottle.length === 0) return false; // Cannot pour from empty
    if (targetBottle.length >= MAX_CAPACITY) return false; // Cannot pour to full

    const colorToMove = sourceBottle[sourceBottle.length - 1];

    // Can pour if target is empty OR top colors match
    return targetBottle.length === 0 || targetBottle[targetBottle.length - 1] === colorToMove;
}

function pourColor(fromIndex, toIndex) {
    const sourceBottle = bottleData[fromIndex];
    const targetBottle = bottleData[toIndex];
    const colorToMove = sourceBottle[sourceBottle.length - 1];

    // Move colors until the top color changes or target is full
    while (
        sourceBottle.length > 0 &&
        targetBottle.length < MAX_CAPACITY &&
        sourceBottle[sourceBottle.length - 1] === colorToMove
    ) {
        // Only allow pouring if target is empty or colors match (redundant check with canPour, but safe)
         if (targetBottle.length === 0 || targetBottle[targetBottle.length - 1] === colorToMove) {
             targetBottle.push(sourceBottle.pop());
         } else {
             break; // Should not happen if canPour was checked, but safety first
         }
    }
    // No need to return anything, data is modified directly
}

function checkWinCondition(currentBottleData) {
    // Win if every bottle is either empty or full with a single color
    return currentBottleData.every(bottle => {
        if (bottle.length === 0) return true; // Empty is winning state
        // If not empty, must be full and have only one color
        // NOTE: Changed logic - a bottle partially filled with one color is also valid!
        // e.g. [R,R] in a capacity 4 bottle is fine.
        // So, check if all colors in the bottle are the same.
        if (bottle.length > 0) {
             const firstColor = bottle[0];
             return bottle.every(color => color === firstColor);
        }
        return false; // Should not be reachable if length > 0 check is done first
    });
}


function hasValidMoves(currentBottleData) {
    for (let i = 0; i < currentBottleData.length; i++) {
        for (let j = 0; j < currentBottleData.length; j++) {
            if (i !== j && canPour(i, j)) {
                return true; // Found at least one valid move
            }
        }
    }
    return false; // No valid moves left
}

// --- Rendering & DOM Manipulation ---

function renderBottles() {
    gameContainer.innerHTML = ''; // Clear previous DOM elements
    bottleElements = []; // Reset the elements array

    bottleData.forEach((colors, index) => {
        const bottleDiv = document.createElement('div');
        bottleDiv.classList.add('bottle');
        bottleDiv.dataset.index = index;
        // REMOVE DYNAMIC HEIGHT SETTING FOR BOTTLE
        // bottleDiv.style.height = `${(MAX_CAPACITY * 50) + 40}px`;

        // Calculate color segment height dynamically (or keep fixed)
        // const colorHeightPercentage = 100 / MAX_CAPACITY; // Alternative

        colors.forEach(color => {
            const colorDiv = document.createElement('div');
            colorDiv.classList.add('color');
            colorDiv.style.backgroundColor = color;
            // Keep fixed pixel height for color segments
            colorDiv.style.height = `50px`;
            // Or use percentage: colorDiv.style.height = `${colorHeightPercentage}%`;
            bottleDiv.appendChild(colorDiv);
        });

        bottleDiv.addEventListener('click', () => handleBottleClick(index));
        gameContainer.appendChild(bottleDiv);
        bottleElements.push(bottleDiv);
    });

    updateBottleSelectionVisuals(); // Ensure selection style is applied if needed
    // Re-enable clicks if they were disabled
    gameContainer.style.pointerEvents = 'auto';
}

function updateBottleSelectionVisuals(deselectedIndex = null) {
     // Remove 'selected' class from all bottles first
     bottleElements.forEach((bottleEl, idx) => {
         // Only remove if it's the currently deselected one or the newly selected one (to handle quick clicks)
         if (deselectedIndex === idx || selectedBottleIndex === idx || selectedBottleIndex === null) {
              bottleEl.classList.remove('selected');
         }
     });

     // Add 'selected' class to the currently selected bottle (if any)
     if (selectedBottleIndex !== null && bottleElements[selectedBottleIndex]) {
         bottleElements[selectedBottleIndex].classList.add('selected');
     }
}


function hideButtons() {
    nextLevelButton.classList.add('hidden');
    resetButton.classList.add('hidden');
}

function showButton(button) {
    button.classList.remove('hidden');
}

// --- Event Listeners ---

nextLevelButton.addEventListener('click', () => {
    currentLevel++;
    // We can dynamically generate indefinitely, or add a max level check
    // if (currentLevel >= MAX_LEVELS) {
    //     alert('Congratulations! You completed all levels!');
    //     // Optional: Reset to level 0 or disable next button
    // } else {
        startGame(); // Start the next level
    // }
});

resetButton.addEventListener('click', () => {
    // Re-create the *same* current level
    createLevel(currentLevel);
});


document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const nextLevelButton = document.getElementById('next-level');
    const resetButton = document.getElementById('reset-level');
    const levelDisplay = document.getElementById('level-display');

    if (!gameContainer || !nextLevelButton || !resetButton || !levelDisplay) {
        console.error("One or more required DOM elements are missing.");
        return;
    }

    // --- Game Initialization ---
    startGame(); // Start the game with level 0
});