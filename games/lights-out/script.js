// --- Cookie Helper Functions ---
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax"; // Added SameSite
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999; path=/; SameSite=Lax'; // Use Max-Age for deletion
}

// --- Game Configuration ---
const TILE_SIZE = 64; // Size of the light sprites
const TILE_SPACING = 10; // Space between lights

const levels = [
    { gridSize: 3, maxMovesBonus: 10 }, // Level 1: 3x3 grid, 10 point bonus threshold
    { gridSize: 4, maxMovesBonus: 20 }, // Level 2: 4x4 grid, 20 point bonus threshold
    { gridSize: 5, maxMovesBonus: 35 }, // Level 3: 5x5 grid, 35 point bonus threshold
    // Add more levels as needed
    // { gridSize: 6, maxMovesBonus: 50 },
];

// --- Phaser Scene ---
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.grid = []; // 2D array for logical state (0=off, 1=on)
        this.lightSprites = []; // 2D array for Phaser sprites
        this.currentLevel = 0;
        this.totalScore = 0;
        this.moves = 0;
        this.gridSize = 0;
        this.levelConfig = null;

        this.levelText = null; // UI Elements (references to HTML spans)
        this.movesText = null;
        this.scoreText = null;
        this.winMessage = null;
        this.gameCompleteMessage = null;
    }

    preload() {
        this.load.image('light_on', 'light_on.png');
        this.load.image('light_off', 'light_off.png');
        // Optional: Load background
        // this.load.image('background', 'assets/background.png');
    }

    create() {
        console.log("Scene Create");
        // Optional Background
        // this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'background');

        // --- Get UI Element References ---
        this.levelText = document.getElementById('level-display');
        this.movesText = document.getElementById('moves-display');
        this.scoreText = document.getElementById('score-display');
        this.winMessage = document.getElementById('win-message');
        this.gameCompleteMessage = document.getElementById('game-complete-message');

        // --- Load Progress ---
        const savedLevel = parseInt(getCookie('lightsOutLevel'), 10);
        const savedScore = parseInt(getCookie('lightsOutScore'), 10);

        this.currentLevel = isNaN(savedLevel) || savedLevel < 0 ? 0 : savedLevel;
        this.totalScore = isNaN(savedScore) || savedScore < 0 ? 0 : savedScore;

        // --- Check if game is already completed ---
        if (this.currentLevel >= levels.length) {
            this.showGameComplete();
            return; // Don't start a level if game is done
        }

        // --- Start the first/saved level ---
        this.startLevel();

        // --- Add Reset Button Listeners ---
         document.getElementById('reset-level-button').addEventListener('click', () => {
             console.log("Resetting Level...");
             this.startLevel(); // Restart current level
         });

         document.getElementById('reset-game-button').addEventListener('click', () => {
              console.log("Resetting Game...");
              eraseCookie('lightsOutLevel');
              eraseCookie('lightsOutScore');
              this.currentLevel = 0;
              this.totalScore = 0;
              this.startLevel(); // Start from level 1
         });
    }

    startLevel() {
        console.log(`Starting Level ${this.currentLevel + 1}`);
        this.winMessage.style.display = 'none';
        this.gameCompleteMessage.style.display = 'none';
        this.moves = 0;

        // --- Check if level exists ---
        if (this.currentLevel >= levels.length) {
           this.showGameComplete();
           return;
        }

        this.levelConfig = levels[this.currentLevel];
        this.gridSize = this.levelConfig.gridSize;

        // --- Update Scoreboard UI ---
        this.updateUIScoreboard();

        // --- Clear previous grid sprites if any ---
        this.lightSprites.flat().forEach(sprite => sprite.destroy());
        this.grid = [];
        this.lightSprites = [];

        // --- Calculate Grid Position (Center it) ---
        const totalGridWidth = this.gridSize * TILE_SIZE + (this.gridSize - 1) * TILE_SPACING;
        const totalGridHeight = this.gridSize * TILE_SIZE + (this.gridSize - 1) * TILE_SPACING;
        const startX = (this.cameras.main.width - totalGridWidth) / 2;
        const startY = (this.cameras.main.height - totalGridHeight) / 2;

        // --- Create Logical Grid and Sprites ---
        for (let row = 0; row < this.gridSize; row++) {
            this.grid[row] = [];
            this.lightSprites[row] = [];
            for (let col = 0; col < this.gridSize; col++) {
                // Initialize all lights OFF logically
                this.grid[row][col] = 0;

                const x = startX + col * (TILE_SIZE + TILE_SPACING) + TILE_SIZE / 2;
                const y = startY + row * (TILE_SIZE + TILE_SPACING) + TILE_SIZE / 2;

                // Create sprite (initially off)
                const light = this.add.sprite(x, y, 'light_off');
                light.setInteractive({ useHandCursor: true });
                light.setData('row', row);
                light.setData('col', col);

                this.lightSprites[row][col] = light;
            }
        }

        // --- Generate a Solvable Starting Pattern ---
        // Start with all off (which is solvable) and make N random moves
        const setupMoves = this.gridSize * this.gridSize; // Number of random setup clicks
        for (let i = 0; i < setupMoves; i++) {
            const rRow = Phaser.Math.Between(0, this.gridSize - 1);
            const rCol = Phaser.Math.Between(0, this.gridSize - 1);
            this.toggleCellAndNeighbors(rRow, rCol, false); // Toggle without counting moves or checking win
        }
         // If after random moves, all are off (unlikely but possible), toggle the center one
        if (this.isGridOff()) {
             const center = Math.floor(this.gridSize / 2);
             this.toggleCellAndNeighbors(center, center, false);
        }


        // --- Setup Input Listener AFTER generating pattern ---
         this.input.off('gameobjectdown'); // Remove previous listeners if any
         this.input.on('gameobjectdown', this.handleLightClick, this);

        console.log("Level setup complete.");
    }

    handleLightClick(pointer, gameObject) {
        const row = gameObject.getData('row');
        const col = gameObject.getData('col');
        console.log(`Clicked: [${row}, ${col}]`);

        this.moves++;
        this.updateUIScoreboard();

        this.toggleCellAndNeighbors(row, col, true); // Toggle AND check for win
    }

    toggleCellAndNeighbors(row, col, checkWinCondition = true) {
        // Define the offsets for the cell itself and its orthogonal neighbors
        const offsets = [
            { r: 0, c: 0 },  // The cell itself
            { r: -1, c: 0 }, // Top
            { r: 1, c: 0 },  // Bottom
            { r: 0, c: -1 }, // Left
            { r: 0, c: 1 }   // Right
        ];

        offsets.forEach(offset => {
            const nr = row + offset.r;
            const nc = col + offset.c;

            // Check if the neighbor is within the grid boundaries
            if (nr >= 0 && nr < this.gridSize && nc >= 0 && nc < this.gridSize) {
                // Flip the logical state (0 becomes 1, 1 becomes 0)
                this.grid[nr][nc] = 1 - this.grid[nr][nc];

                // Update the sprite texture
                const neighborSprite = this.lightSprites[nr][nc];
                neighborSprite.setTexture(this.grid[nr][nc] === 1 ? 'light_on' : 'light_off');
            }
        });

        // Check for win condition only if requested (i.e., during player moves)
        if (checkWinCondition && this.isGridOff()) {
            this.levelWon();
        }
    }

    isGridOff() {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (this.grid[row][col] === 1) {
                    return false; // Found a light that is still on
                }
            }
        }
        return true; // All lights are off
    }

    levelWon() {
        console.log("Level Won!");
        this.winMessage.style.display = 'block'; // Show win message

        // Calculate Score for the level
        // Base score + bonus for fewer moves
        let levelScore = 100; // Base score for completing a level
        const maxMovesForBonus = this.levelConfig.maxMovesBonus || (this.gridSize * this.gridSize * 2); // Fallback bonus threshold
        if (this.moves <= maxMovesForBonus) {
            levelScore += 50; // Bonus score
            console.log(`Bonus awarded! Moves (${this.moves}) <= Threshold (${maxMovesForBonus})`);
        }
        this.totalScore += levelScore;

        // --- Save Progress ---
        this.currentLevel++;
        setCookie('lightsOutLevel', this.currentLevel, 30); // Save for 30 days
        setCookie('lightsOutScore', this.totalScore, 30);

        // --- Update UI ---
        this.updateUIScoreboard(); // Show final score update

        // --- Move to next level after a delay ---
        this.time.delayedCall(1500, () => { // Wait 1.5 seconds
             if (this.currentLevel < levels.length) {
                this.startLevel();
             } else {
                this.showGameComplete();
             }
        });
    }

     showGameComplete() {
        console.log("Game Complete!");
        this.gameCompleteMessage.style.display = 'block';
         // Optional: Disable game input or clear sprites
         this.input.off('gameobjectdown');
         this.lightSprites.flat().forEach(sprite => sprite.input?.disableInteractive()); // Safely disable
    }

    updateUIScoreboard() {
        this.levelText.textContent = this.currentLevel < levels.length ? (this.currentLevel + 1) : 'All';
        this.movesText.textContent = this.moves;
        this.scoreText.textContent = this.totalScore;
    }
}

// --- Phaser Game Instance ---
const config = {
    type: Phaser.AUTO, // Use WebGL if available, otherwise Canvas
    width: 500, // Adjust as needed
    height: 500, // Adjust as needed
    parent: 'game-container', // ID of the div to inject the canvas into
    backgroundColor: '#1a1a1a', // Dark background for the canvas area
    scene: [GameScene] // The scene(s) to run
};

// Create the game instance when the window loads
window.onload = () => {
    const game = new Phaser.Game(config);
};