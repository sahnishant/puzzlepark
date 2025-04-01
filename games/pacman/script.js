const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const messageElement = document.getElementById('message');
const startButton = document.getElementById('startButton');

const gridSize = 16; // Size of each grid cell
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// --- Game Constants ---
const WALL_COLOR = '#0000FF'; // Blue walls
const DOT_COLOR = '#FFFFFF'; // White dots
const POWER_PELLET_COLOR = '#FFB8AE'; // Pinkish Power Pellet
const PACMAN_COLOR = '#FFD700'; // Yellow Pac-Man
const GHOST_COLORS = ['#FF0000', '#FFB8FF', '#00FFFF', '#FFB852']; // Red, Pink, Cyan, Orange
const GHOST_VULNERABLE_COLOR = '#0000FF'; // Blue when vulnerable
const GHOST_VULNERABLE_FLASH_COLOR = '#FFFFFF'; // Flashing white
const GHOST_EYE_COLOR = '#FFFFFF';
const GHOST_PUPIL_COLOR = '#000000';
const PATH_COLOR = '#000000'; // Black background path

const DOT_SCORE = 10;
const POWER_PELLET_SCORE = 50;
const GHOST_SCORE_VALUES = [200, 400, 800, 1600]; // Score for eating consecutive ghosts
const VULNERABLE_DURATION = 420; // Frames (approx 7 seconds at 60fps)
const VULNERABLE_FLASH_TIME = 120; // Frames (start flashing for last 2 seconds)
const GHOST_RESPAWN_TIME = 180; // Frames (3 seconds)
const GHOST_BASE_SPEED = 1.5;
const GHOST_VULNERABLE_SPEED = 1.0;
const GHOST_RESPAWN_SPEED = 3.0; // Faster speed when returning to base (eyes only) - simplified for now

// --- Game Map ---
// 0 = Wall, 1 = Path, 2 = Dot, 3 = Power Pellet, 4 = Ghost Start, 5 = Pacman Start
// Added some Power Pellets (3) and paths (1) for ghosts to escape house
const map = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 0],
    [0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0],
    [0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0],
    [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
    [0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 2, 0],
    [0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 0],
    [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 0, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 0, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 2, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0], // Ghost house path
    [1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 4, 1, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 2, 1, 1, 1, 1], // Added more '1's
    [0, 0, 0, 0, 0, 2, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 2, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 0, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 2, 0, 1, 1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0], // Pacman start row
    [0, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 0],
    [0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0],
    [0, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 0],
    [0, 0, 0, 2, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 2, 0, 0, 0, 0],
    [0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 0],
    [0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0],
    [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

// --- Game State ---
let score = 0;
let lives = 3;
let pacman;
let ghosts = [];
let gameInterval;
let isGameOver = false;
let isGamePaused = false; // For temporary pauses like losing a life
let totalDots = 0;
let ghostsEatenInPowerMode = 0; // Counter for scoring consecutive ghosts
let powerPelletTimer = 0; // General timer for flashing pellets

// --- Classes ---
class Pacman {
    constructor(x, y) {
        this.x = x * gridSize + gridSize / 2;
        this.y = y * gridSize + gridSize / 2;
        this.radius = gridSize / 2 - 2;
        this.speed = 2;
        this.dx = 0;
        this.dy = 0;
        this.nextDx = 0;
        this.nextDy = 0;
        this.mouthOpen = 0.2;
        this.mouthOpening = true;
        this.startX = x; // Store starting position
        this.startY = y;
    }

    draw() {
        // Animate mouth
        if (this.mouthOpening) {
            this.mouthOpen += 0.05;
            if (this.mouthOpen >= 0.4) this.mouthOpening = false;
        } else {
            this.mouthOpen -= 0.05;
            if (this.mouthOpen <= 0.1) this.mouthOpening = true;
        }

        let angleOffset = 0;
        if (this.dx > 0) angleOffset = 0; // Right
        else if (this.dx < 0) angleOffset = Math.PI; // Left
        else if (this.dy > 0) angleOffset = Math.PI / 2; // Down
        else if (this.dy < 0) angleOffset = -Math.PI / 2; // Up
        // If stopped, keep last direction's angle (or default) - need to store lastDx, lastDy if needed

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, angleOffset + this.mouthOpen * Math.PI, angleOffset - this.mouthOpen * Math.PI);
        ctx.lineTo(this.x, this.y);
        ctx.closePath();
        ctx.fillStyle = PACMAN_COLOR;
        ctx.fill();
    }

    update() {
        if (isGamePaused) return;
        this.move();
        this.eat(); // Renamed from eatDot
        this.handleTunnel();
    }

    move() {
        const currentGridX = Math.floor(this.x / gridSize);
        const currentGridY = Math.floor(this.y / gridSize);
        const xCentered = Math.abs(this.x - (currentGridX * gridSize + gridSize / 2)) < this.speed;
        const yCentered = Math.abs(this.y - (currentGridY * gridSize + gridSize / 2)) < this.speed;

        // Check if intended direction is valid
        if (this.nextDx !== 0 || this.nextDy !== 0) {
             const nextTileX = currentGridX + this.nextDx;
             const nextTileY = currentGridY + this.nextDy;
             // Check if centered AND the next tile in the intended direction is not a wall
             if (xCentered && yCentered && map[nextTileY] && map[nextTileY][nextTileX] !== 0) {
                 this.dx = this.nextDx;
                 this.dy = this.nextDy;
                 this.nextDx = 0;
                 this.nextDy = 0;
             }
        }

        // Check collision in the current direction
        const targetX = this.x + this.dx * this.speed;
        const targetY = this.y + this.dy * this.speed;
        if (!this.isWallCollision(targetX, targetY)) {
             this.x = targetX;
             this.y = targetY;
        } else {
            // Stop movement and snap to grid center if hitting wall
             this.x = currentGridX * gridSize + gridSize / 2;
             this.y = currentGridY * gridSize + gridSize / 2;
            this.dx = 0;
            this.dy = 0;
        }
    }

     isWallCollision(nextX, nextY) {
        const collisionMargin = 1;
        const corners = [
            { x: nextX - this.radius + collisionMargin, y: nextY - this.radius + collisionMargin },
            { x: nextX + this.radius - collisionMargin, y: nextY - this.radius + collisionMargin },
            { x: nextX - this.radius + collisionMargin, y: nextY + this.radius - collisionMargin },
            { x: nextX + this.radius - collisionMargin, y: nextY + this.radius - collisionMargin }
        ];

        for (const corner of corners) {
            const gridX = Math.floor(corner.x / gridSize);
            const gridY = Math.floor(corner.y / gridSize);

            if (gridX < 0 || gridX >= map[0].length || gridY < 0 || gridY >= map.length) {
                return true; // Boundary collision
            }
            if (map[gridY] && map[gridY][gridX] === 0) { // Check map wall
                 // Allow entering tunnels (represented by non-zero values outside main grid)
                 if ((gridX === 0 || gridX === map[0].length - 1) && map[gridY][gridX] !== 0) continue;
                return true;
            }
        }
        return false;
    }

    eat() {
        const gridX = Math.floor(this.x / gridSize);
        const gridY = Math.floor(this.y / gridSize);

        if (gridY < 0 || gridY >= map.length || gridX < 0 || gridX >= map[0].length) return; // Out of bounds

        const tile = map[gridY][gridX];

        if (tile === 2) { // Eat dot
            map[gridY][gridX] = 1; // Change map to path
            score += DOT_SCORE;
            totalDots--;
            scoreElement.textContent = score;
            if (totalDots === 0) {
                winGame();
            }
        } else if (tile === 3) { // Eat power pellet
            map[gridY][gridX] = 1;
            score += POWER_PELLET_SCORE;
            scoreElement.textContent = score;
            ghostsEatenInPowerMode = 0; // Reset counter for this power-up
            ghosts.forEach(ghost => {
                // Only make vulnerable if not already respawning
                if(ghost.respawnTimer <= 0) {
                    ghost.isVulnerable = true;
                    ghost.vulnerabilityTimer = VULNERABLE_DURATION;
                    // Optional: Reverse ghost direction
                    ghost.dx *= -1;
                    ghost.dy *= -1;
                }
            });
        }
    }

    handleTunnel() {
        if (this.x < -this.radius) {
            this.x = canvasWidth + this.radius;
        }
        if (this.x > canvasWidth + this.radius) {
             this.x = -this.radius;
        }
    }

    resetPosition() {
        this.x = this.startX * gridSize + gridSize / 2;
        this.y = this.startY * gridSize + gridSize / 2;
        this.dx = 0;
        this.dy = 0;
        this.nextDx = 0;
        this.nextDy = 0;
    }
}

class Ghost {
    constructor(x, y, color) {
        this.startX = x; // Store initial grid position
        this.startY = y;
        this.x = x * gridSize + gridSize / 2;
        this.y = y * gridSize + gridSize / 2;
        this.radius = gridSize / 2 - 2;
        this.speed = GHOST_BASE_SPEED;
        this.dx = [1, -1][Math.floor(Math.random() * 2)]; // Start random horizontal inside house maybe
        this.dy = 0;
        this.baseColor = color;
        this.isVulnerable = false;
        this.vulnerabilityTimer = 0;
        this.respawnTimer = 0; // Timer while ghost is 'eyes only' returning/respawning
    }

    draw() {
        let drawColor = this.baseColor;
        let drawEyesOnly = this.respawnTimer > 0;

        if (this.isVulnerable) {
            this.speed = GHOST_VULNERABLE_SPEED;
            // Flash if timer is low
            if (this.vulnerabilityTimer < VULNERABLE_FLASH_TIME && Math.floor(this.vulnerabilityTimer / 10) % 2 === 0) {
                 drawColor = GHOST_VULNERABLE_FLASH_COLOR;
            } else {
                 drawColor = GHOST_VULNERABLE_COLOR;
            }
        } else {
             this.speed = GHOST_BASE_SPEED; // Reset speed if not vulnerable or respawning (handle respawn speed later)
        }

        if (!drawEyesOnly) {
            // Body
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, Math.PI, 0); // Semi-circle top
            ctx.lineTo(this.x + this.radius, this.y + this.radius); // Bottom corners
             // Wavy bottom approximation
             ctx.lineTo(this.x + this.radius * 0.66, this.y + this.radius * 0.66);
             ctx.lineTo(this.x + this.radius * 0.33, this.y + this.radius);
             ctx.lineTo(this.x, this.y + this.radius * 0.66);
             ctx.lineTo(this.x - this.radius * 0.33, this.y + this.radius);
             ctx.lineTo(this.x - this.radius * 0.66, this.y + this.radius * 0.66);
            ctx.lineTo(this.x - this.radius, this.y + this.radius); // Bottom left corner
            ctx.closePath();
            ctx.fillStyle = drawColor;
            ctx.fill();
        }

         // Eyes (always drawn)
        const eyeOffsetX = this.radius / 2.5;
        const eyeOffsetY = -this.radius / 5;
        const pupilOffsetX = (this.dx > 0 ? 1 : (this.dx < 0 ? -1 : 0));
        const pupilOffsetY = (this.dy > 0 ? 1 : (this.dy < 0 ? -1 : 0));

        ctx.fillStyle = GHOST_EYE_COLOR;
        ctx.beginPath();
        ctx.arc(this.x - eyeOffsetX, this.y + eyeOffsetY, 3, 0, Math.PI * 2); // Left eye white
        ctx.arc(this.x + eyeOffsetX, this.y + eyeOffsetY, 3, 0, Math.PI * 2); // Right eye white
        ctx.fill();

         ctx.fillStyle = GHOST_PUPIL_COLOR;
        ctx.beginPath();
        ctx.arc(this.x - eyeOffsetX + pupilOffsetX, this.y + eyeOffsetY + pupilOffsetY, 1.5, 0, Math.PI * 2); // Left pupil
        ctx.arc(this.x + eyeOffsetX + pupilOffsetX, this.y + eyeOffsetY + pupilOffsetY, 1.5, 0, Math.PI * 2); // Right pupil
        ctx.fill();
    }

    update() {
        if (isGamePaused) return;

        if (this.respawnTimer > 0) {
            this.respawnTimer--;
            // Simple: Stay in place until respawn timer ends
            this.x = this.startX * gridSize + gridSize / 2;
            this.y = this.startY * gridSize + gridSize / 2;
            if(this.respawnTimer <= 0) {
                 this.dx = [1, -1][Math.floor(Math.random() * 2)]; // Start moving again
                 this.dy = 0;
                 // Could force dy = -1 if above house exit
            }
            return; // Don't move or check vulnerability while respawning
        }

        if (this.isVulnerable) {
            this.vulnerabilityTimer--;
            if (this.vulnerabilityTimer <= 0) {
                this.isVulnerable = false;
            }
        }

        this.move();
        this.handleTunnel();
    }

    move() {
        const currentGridX = Math.floor(this.x / gridSize);
        const currentGridY = Math.floor(this.y / gridSize);
        const xCentered = Math.abs(this.x - (currentGridX * gridSize + gridSize / 2)) < this.speed * 1.1; // More tolerance
        const yCentered = Math.abs(this.y - (currentGridY * gridSize + gridSize / 2)) < this.speed * 1.1;

        let changedDirection = false;

        // Only change direction when centered
        if (xCentered && yCentered) {
            const possibleDirections = this.getValidDirections(currentGridX, currentGridY);

             // If blocked in current direction OR at an intersection (more than 2 ways)
             if (this.isWallCollision(this.x + this.dx * this.speed, this.y + this.dy * this.speed) || possibleDirections.length > 2) {
                 let validChoices = possibleDirections.filter(dir => !(dir.dx === -this.dx && dir.dy === -this.dy)); // Try not to reverse

                 // If only option is reversing (dead end), or no other valid choices left
                 if (validChoices.length === 0 && possibleDirections.length > 0) {
                    validChoices = possibleDirections; // Allow reversal if necessary
                 }

                 if (validChoices.length > 0) {
                    const choice = validChoices[Math.floor(Math.random() * validChoices.length)];
                    this.dx = choice.dx;
                    this.dy = choice.dy;
                    changedDirection = true;
                 } else {
                     // Completely stuck? Stop. Should ideally not happen with correct map.
                     this.dx = 0;
                     this.dy = 0;
                 }
             }
        }

        // If we didn't just change direction, keep moving if possible
        if (!changedDirection) {
            if (!this.isWallCollision(this.x + this.dx * this.speed, this.y + this.dy * this.speed)) {
                this.x += this.dx * this.speed;
                this.y += this.dy * this.speed;
            } else {
                // If moving along a wall and hit corner, snap and force direction check next frame
                this.x = currentGridX * gridSize + gridSize / 2;
                this.y = currentGridY * gridSize + gridSize / 2;
                this.dx = 0; // Force recalculation
                this.dy = 0;
            }
        } else {
             // If we *did* change direction, take the first step in the new direction
             if (!this.isWallCollision(this.x + this.dx * this.speed, this.y + this.dy * this.speed)) {
                this.x += this.dx * this.speed;
                this.y += this.dy * this.speed;
             } else {
                // Snap if new direction also blocked (should be rare if getValidDirections is correct)
                this.x = currentGridX * gridSize + gridSize / 2;
                this.y = currentGridY * gridSize + gridSize / 2;
             }
        }
    }

     isWallCollision(nextX, nextY) { // Same logic as Pacman
        const collisionMargin = 1;
        const corners = [
            { x: nextX - this.radius + collisionMargin, y: nextY - this.radius + collisionMargin },
            { x: nextX + this.radius - collisionMargin, y: nextY - this.radius + collisionMargin },
            { x: nextX - this.radius + collisionMargin, y: nextY + this.radius - collisionMargin },
            { x: nextX + this.radius - collisionMargin, y: nextY + this.radius - collisionMargin }
        ];
        for (const corner of corners) {
            const gridX = Math.floor(corner.x / gridSize);
            const gridY = Math.floor(corner.y / gridSize);
             if (gridX < 0 || gridX >= map[0].length || gridY < 0 || gridY >= map.length ) {
                  // Check if it's a tunnel entrance/exit (allow movement there)
                 if (gridY === 9 || gridY === 11) { // Example tunnel rows, adjust if map changes
                     if (gridX <= 0 || gridX >= map[0].length -1) continue; // Allow passing through tunnel entrances
                 }
                 return true; // Hit boundary otherwise
             }
             if (map[gridY] && map[gridY][gridX] === 0) {
                 return true; // Hit map wall
             }
        }
        return false;
    }

    getValidDirections(gridX, gridY) {
        const directions = [{ dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 }];
        const validDirections = [];

        for (const dir of directions) {
            const nextGridX = gridX + dir.dx;
            const nextGridY = gridY + dir.dy;
            // Basic check: within bounds and not a wall (map code 0)
            if (nextGridX >= 0 && nextGridX < map[0].length && nextGridY >= 0 && nextGridY < map.length &&
                map[nextGridY] && map[nextGridY][nextGridX] !== 0) {
                validDirections.push(dir);
            }
            // Advanced: Could add rules here, e.g., ghosts can't turn upwards in certain zones
        }
        return validDirections;
    }

     handleTunnel() { // Same logic as Pacman
        if (this.x < -this.radius) this.x = canvasWidth + this.radius;
        if (this.x > canvasWidth + this.radius) this.x = -this.radius;
    }

    getEaten() {
        score += GHOST_SCORE_VALUES[ghostsEatenInPowerMode];
        ghostsEatenInPowerMode++; // Increment for next potential ghost
        scoreElement.textContent = score;
        this.isVulnerable = false;
        this.vulnerabilityTimer = 0;
        this.respawnTimer = GHOST_RESPAWN_TIME; // Start respawn timer
        // Position will be reset in update() while respawnTimer > 0
        // TODO: Add visual effect for score display near eaten ghost
    }

     resetPosition() { // Used when Pacman dies, not when ghost is eaten
         this.x = this.startX * gridSize + gridSize / 2;
         this.y = this.startY * gridSize + gridSize / 2;
         this.dx = [1, -1][Math.floor(Math.random() * 2)]; // Reset direction too
         this.dy = 0;
         this.isVulnerable = false;
         this.vulnerabilityTimer = 0;
         this.respawnTimer = 0; // Ensure not respawning on life reset
     }
}


// --- Game Logic ---

function drawMap() {
    powerPelletTimer++; // Increment animation timer

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            ctx.fillStyle = PATH_COLOR;
            ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);

            if (map[y][x] === 0) { // Wall
                ctx.fillStyle = WALL_COLOR;
                ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
            } else if (map[y][x] === 2) { // Dot
                ctx.beginPath();
                ctx.arc(x * gridSize + gridSize / 2, y * gridSize + gridSize / 2, gridSize / 8, 0, Math.PI * 2);
                ctx.fillStyle = DOT_COLOR;
                ctx.fill();
            } else if (map[y][x] === 3) { // Power Pellet
                 // Simple flashing effect
                 if (Math.floor(powerPelletTimer / 15) % 2 === 0) {
                     ctx.beginPath();
                     ctx.arc(x * gridSize + gridSize / 2, y * gridSize + gridSize / 2, gridSize / 4, 0, Math.PI * 2);
                     ctx.fillStyle = POWER_PELLET_COLOR;
                     ctx.fill();
                 }
            }
        }
    }
}

function checkCollisions() {
    if (isGamePaused) return;

    for (const ghost of ghosts) {
        if (ghost.respawnTimer > 0) continue; // Cannot interact with respawning ghosts

        const dx = pacman.x - ghost.x;
        const dy = pacman.y - ghost.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < pacman.radius + ghost.radius - 2) { // Slightly smaller collision radius
             if (ghost.isVulnerable) {
                 ghost.getEaten();
                 // TODO: Add sound effect
             } else {
                 loseLife();
                 // TODO: Add sound effect
                 break; // Exit loop after losing life
             }
        }
    }
}

function loseLife() {
    lives--;
    livesElement.textContent = lives;
    isGamePaused = true; // Pause briefly
    // TODO: Add death animation for Pacman

    if (lives <= 0) {
        setTimeout(gameOver, 1000); // Delay game over message
    } else {
         setTimeout(() => {
             resetPositions(); // Reset Pacman and Ghosts
             isGamePaused = false; // Resume game
         }, 1000); // Pause for 1 second
    }
}

function gameOver() {
    isGameOver = true;
    isGamePaused = false;
    clearInterval(gameInterval);
    showMessage('Game Over!');
    startButton.textContent = 'Restart Game';
    startButton.style.display = 'block';
}

function winGame() {
    isGameOver = true;
    isGamePaused = false;
    clearInterval(gameInterval);
    showMessage('You Win!');
    startButton.textContent = 'Play Again?';
    startButton.style.display = 'block';
}


function showMessage(text) {
    messageElement.textContent = text;
    messageElement.style.display = 'block';
}

function hideMessage() {
    messageElement.style.display = 'none';
}

function resetPositions() {
     pacman.resetPosition();
     ghosts.forEach(ghost => ghost.resetPosition());
}

function initializeGame() {
    score = 0;
    lives = 3;
    isGameOver = false;
    isGamePaused = false;
    ghostsEatenInPowerMode = 0;
    scoreElement.textContent = score;
    livesElement.textContent = lives;
    ghosts = [];
    totalDots = 0;
     hideMessage();

    // Deep copy the original map state if we want level resets
    // For now, assume `map` is mutated and not reset between games unless page reloads
    let currentMapState = JSON.parse(JSON.stringify(map)); // Work with a copy for initialization run

     // Initialize Pacman and Ghosts based on map codes
     let pacmanStartX, pacmanStartY;
     let ghostStarts = [];

    for (let y = 0; y < currentMapState.length; y++) {
        for (let x = 0; x < currentMapState[y].length; x++) {
            if (currentMapState[y][x] === 5) {
                pacmanStartX = x;
                pacmanStartY = y;
            } else if (currentMapState[y][x] === 4) {
                ghostStarts.push({ x, y });
            }
            // Count initial dots/pellets from the *current* map state
            if (map[y][x] === 2) { // Count from the potentially modified map
                totalDots++;
            }
        }
    }

    pacman = new Pacman(pacmanStartX, pacmanStartY);

     ghostStarts.forEach((start, index) => {
        ghosts.push(new Ghost(start.x, start.y, GHOST_COLORS[index % GHOST_COLORS.length]));
     });

     if (totalDots === 0) {
        console.warn("No dots found on the map. Level might be cleared.");
        // Consider adding logic to fully reset the `map` array here if needed
     }
}


function gameLoop() {
    if (isGameOver) return; // Stop loop if game ended fully

    // 1. Clear Canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // 2. Draw Map and Dots/Pellets
    drawMap();

    // 3. Update and Draw Pacman
    pacman.update();
    pacman.draw();

    // 4. Update and Draw Ghosts
    ghosts.forEach(ghost => {
        ghost.update();
        ghost.draw();
    });

    // 5. Check Collisions (only if not paused)
    if (!isGamePaused) {
        checkCollisions();
    }

    // 6. Check Win Condition (handled in pacman.eat)
}

// --- Event Listeners ---
document.addEventListener('keydown', (e) => {
    if (!pacman || isGameOver || isGamePaused) return; // Ignore input if game over/paused

    let handled = false;
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
            pacman.nextDx = 0;
            pacman.nextDy = -1;
            handled = true;
            break;
        case 'ArrowDown':
        case 's':
             pacman.nextDx = 0;
             pacman.nextDy = 1;
             handled = true;
            break;
        case 'ArrowLeft':
        case 'a':
            pacman.nextDx = -1;
            pacman.nextDy = 0;
            handled = true;
            break;
        case 'ArrowRight':
        case 'd':
            pacman.nextDx = 1;
            pacman.nextDy = 0;
            handled = true;
            break;
    }
    if (handled) {
        e.preventDefault(); // Prevent arrow keys from scrolling page
    }
});

startButton.addEventListener('click', () => {
    if (gameInterval) {
        clearInterval(gameInterval);
    }
    // IMPORTANT: You might want to reset the 'map' array here if you want
    // subsequent games after winning/losing to have the dots/pellets back.
    // e.g., map = JSON.parse(JSON.stringify(originalMapData));
    // Otherwise, the map remains cleared from the previous game.
    // For this example, we'll assume a page refresh is needed for a full reset.

    initializeGame();
    gameInterval = setInterval(gameLoop, 1000 / 60); // ~60 FPS
    startButton.style.display = 'none';
    canvas.focus();
});

// --- Initial Draw ---
drawMap(); // Draw map initially
showMessage("Click Start Game!");
messageElement.style.display = 'block';