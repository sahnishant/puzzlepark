// --- Configuration ---

const GAME_WIDTH = 700; // Slightly wider for UI text
const GAME_HEIGHT = 700; // Slightly taller for UI text

const ROWS = 4;
const COLS = 4;
const CARD_WIDTH = 100;
const CARD_HEIGHT = 100;
const CARD_SPACING = 20;
const CARD_BACK_COLOR = 0x5555ff; // Blueish back
const CARD_PAIRS_COUNT = (ROWS * COLS) / 2;
const REVEAL_TIME_MS = 1000; // Time cards stay revealed if they don't match

// Generate distinct colors for card faces
const CARD_FACE_COLORS = generateDistinctColors(CARD_PAIRS_COUNT);


// --- Level Definitions ---
// Define levels with different grid sizes
const LEVELS = [
  { rows: 2, cols: 3, cardWidth: 120, cardHeight: 120, spacing: 25 }, // Level 1: 6 cards
  { rows: 4, cols: 4, cardWidth: 100, cardHeight: 100, spacing: 20 }, // Level 2: 16 cards
  { rows: 4, cols: 5, cardWidth: 90, cardHeight: 90, spacing: 15 },   // Level 3: 20 cards
  { rows: 5, cols: 6, cardWidth: 80, cardHeight: 80, spacing: 12 }    // Level 4: 30 cards
];
let currentLevelIndex = 0; // Start at level 0


// --- Helper Function ---
// Basic function to generate somewhat distinct HSL colors
function generateDistinctColors(count) {
  const colors = [];
  const hueStep = 360 / count;
  for (let i = 0; i < count; i++) {
      const hue = i * hueStep;
      const saturation = 70 + Math.random() * 30;
      const lightness = 50 + Math.random() * 20;
      colors.push(Phaser.Display.Color.HSLToColor(hue / 360, saturation / 100, lightness / 100).color);
  }
  return colors;
}


// Fisher-Yates Shuffle Algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

// Format time in seconds to MM:SS
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(secs).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
}
// --- Phaser Scene ---
class GameScene extends Phaser.Scene {
    constructor() {
      super('GameScene');
      this.cards = [];
      this.firstCard = null;
      this.secondCard = null;
      this.canClick = true;
      this.matchesFound = 0;
      this.moves = 0;
      this.startTime = 0;
      this.timerEvent = null;
      this.totalPairs = 0;
    
      // UI Text Objects
      this.levelText = null;
      this.movesText = null;
      this.timerText = null;
      this.scoreText = null; // Matches found
      this.bestStatsText = null;
      this.levelCompleteText = null; // Replaces winText
    }

    preload() {
        // No assets to preload in this version (using graphics)
        console.log("Preloading complete.");
    }

    create() {
      console.log(`Creating scene for Level ${currentLevelIndex + 1}`);
      this.cameras.main.setBackgroundColor('#ffffff');

      // --- Reset Scene State ---
      this.matchesFound = 0;
      this.moves = 0;
      this.canClick = false; // Disable clicking until cards are briefly shown
      this.firstCard = null;
      this.secondCard = null;
      if (this.timerEvent) {
          this.timerEvent.remove(false); // Stop previous timer if restarting
      }
      this.startTime = this.time.now; // Record start time

      // --- Get Level Config ---
      const levelConfig = LEVELS[currentLevelIndex];
      const { rows, cols, cardWidth, cardHeight, spacing } = levelConfig;
      this.totalPairs = (rows * cols) / 2;

      if (rows * cols % 2 !== 0) {
          console.error("Level configuration error: Rows * Columns must be an even number.");
          return; // Stop creation if invalid config
      }

      // --- Prepare Card Values ---
      const cardFaceColors = generateDistinctColors(this.totalPairs);
      let cardValues = [];
      for (let i = 0; i < this.totalPairs; i++) {
          cardValues.push(cardFaceColors[i]);
          cardValues.push(cardFaceColors[i]);
      }
      shuffleArray(cardValues);

      // --- Calculate Grid Layout ---
      const totalGridWidth = cols * cardWidth + (cols - 1) * spacing;
      const totalGridHeight = rows * cardHeight + (rows - 1) * spacing;
      const topMargin = 80; // Increased margin for UI text
      const offsetX = (GAME_WIDTH - totalGridWidth) / 2;
      const offsetY = (GAME_HEIGHT - totalGridHeight) / 2 + topMargin / 2;

      // --- Create Card Game Objects ---
      this.cards = this.add.group(); // Use a group for easier management
      let cardIndex = 0;
      for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
              const x = offsetX + col * (cardWidth + spacing) + cardWidth / 2;
              const y = offsetY + row * (cardHeight + spacing) + cardHeight / 2;

              const card = this.add.rectangle(x, y, cardWidth, cardHeight, CARD_BACK_COLOR)
                                 .setInteractive({ useHandCursor: true });

              card.setData('value', cardValues[cardIndex]);
              card.setData('isRevealed', false);
              card.setData('isMatched', false);
              card.setData('id', cardIndex);

              card.on('pointerdown', () => this.handleCardClick(card));
              this.cards.add(card); // Add to the group
              cardIndex++;
          }
      }
        // --- Create UI Text ---
        const uiTextStyle = { fontSize: '20px', fill: '#222', fontFamily: 'sans-serif' };
        this.levelText = this.add.text(offsetX, 20, `Level: ${currentLevelIndex + 1} / ${LEVELS.length}`, uiTextStyle);
        this.movesText = this.add.text(offsetX + 200, 20, `Moves: 0`, uiTextStyle);
        this.timerText = this.add.text(offsetX + 350, 20, `Time: 00:00`, uiTextStyle);
        this.scoreText = this.add.text(offsetX, 50, `Matches: 0 / ${this.totalPairs}`, uiTextStyle);

        // --- Display Best Stats ---
        const bestTime = getCookie(`level_${currentLevelIndex}_best_time`);
        const leastMoves = getCookie(`level_${currentLevelIndex}_least_moves`);
        let bestStatsStr = "Best: ";
        if (leastMoves) bestStatsStr += `${leastMoves} moves`;
        if (bestTime) bestStatsStr += (leastMoves ? " / " : "") + `${formatTime(bestTime)}s`;
        if (!bestTime && !leastMoves) bestStatsStr += "N/A";
        this.bestStatsText = this.add.text(offsetX + 200, 50, bestStatsStr, uiTextStyle);


        // --- Level Complete/Win Text (initially hidden) ---
        this.levelCompleteText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'Level Complete!', {
            fontSize: '40px', fill: '#00aa00', backgroundColor: 'rgba(0,0,0,0.7)',
            align: 'center', padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setVisible(false)
        .setDepth(10)
        .setInteractive({ useHandCursor: true });

        // --- Setup Timer ---
        this.timerEvent = this.time.addEvent({
            delay: 1000, // Update every second
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

        // --- Brief Initial Reveal (Optional but good UX) ---
        this.showAllCardsBriefly();
    }
    showAllCardsBriefly() {
      const allCards = this.cards.getChildren();
      allCards.forEach(card => {
          card.setFillStyle(card.getData('value'));
      });

      this.time.delayedCall(1500 + currentLevelIndex * 500, () => { // Show longer for harder levels
           allCards.forEach(card => {
              if (!card.getData('isMatched')) { // Should not be matched yet anyway
                 card.setFillStyle(CARD_BACK_COLOR);
              }
           });
           this.canClick = true; // Enable clicking AFTER cards are hidden again
           this.startTime = this.time.now; // Start timer officially after reveal
      }, [], this);
  }


  updateTimer() {
    if (this.matchesFound === this.totalPairs) return; // Stop timer if game won

    const elapsedTime = (this.time.now - this.startTime) / 1000; // Time in seconds
    this.timerText.setText(`Time: ${formatTime(elapsedTime)}`);
}

handleCardClick(card) {
    if (!this.canClick || card.getData('isRevealed') || card.getData('isMatched')) {
        return;
    }

    this.revealCard(card);

    if (!this.firstCard) {
        this.firstCard = card;
    } else if (!this.secondCard && card.getData('id') !== this.firstCard.getData('id')) {
        this.secondCard = card;
        this.canClick = false; // Disable clicking while checking

        // --- Increment Moves ---
        this.moves++;
        this.movesText.setText(`Moves: ${this.moves}`);

        this.checkForMatch();
    }
}

revealCard(card) {
    card.setFillStyle(card.getData('value'));
    card.setData('isRevealed', true);
    this.tweens.add({
        targets: card, scaleX: 1.1, scaleY: 1.1, duration: 150, yoyo: true, ease: 'Quad.easeInOut'
    });
}

hideCard(card) {
    if (card && !card.getData('isMatched')) { // Add check if card exists
        card.setFillStyle(CARD_BACK_COLOR);
        card.setData('isRevealed', false);
         this.tweens.add({
            targets: card, scaleX: 1, scaleY: 1, duration: 150, ease: 'Quad.easeInOut'
        });
    }
}


    checkForMatch() {
        const value1 = this.firstCard.getData('value');
        const value2 = this.secondCard.getData('value');

        if (value1 === value2) {
            // It's a match!
            // console.log("Match found!");
            this.firstCard.setData('isMatched', true);
            this.secondCard.setData('isMatched', true);

             // Optional: Visual feedback for match (e.g., tint or slightly fade)
             this.firstCard.setAlpha(0.7); // Make it 70% opaque
             this.secondCard.setAlpha(0.7); // Make it 70% opaque
             

            this.matchesFound++;
            this.scoreText.setText('Matches: ' + this.matchesFound + ' / ' + CARD_PAIRS_COUNT);

            this.resetSelectedCards();
            this.canClick = true; // Allow next click immediately after match

            // Check for win condition
            if (this.matchesFound === CARD_PAIRS_COUNT) {
                this.triggerWinState();
            }

        } else {
            // Not a match
            // console.log("No match.");
            // Use a delayed call to hide the cards after a short period
            this.time.delayedCall(REVEAL_TIME_MS, () => {
                this.hideCard(this.firstCard);
                this.hideCard(this.secondCard);
                this.resetSelectedCards();
                this.canClick = true; // Re-enable clicking after hiding
            }, [], this);
        }
    }

    checkForMatch() {
      // Added checks to ensure both cards exist before accessing data
      if (!this.firstCard || !this.secondCard) {
          console.warn("Checking match with missing card(s). Resetting.");
          this.resetSelectedCards(true); // Force allow click true
          return;
      }

      const value1 = this.firstCard.getData('value');
      const value2 = this.secondCard.getData('value');

      if (value1 === value2) {
          // Match found
          this.firstCard.setData('isMatched', true);
          this.secondCard.setData('isMatched', true);
          this.firstCard.setAlpha(0.7); // Use alpha instead of tint
          this.secondCard.setAlpha(0.7);
          // Optional: Disable interaction on matched cards
          // this.firstCard.disableInteractive();
          // this.secondCard.disableInteractive();

          this.matchesFound++;
          this.scoreText.setText(`Matches: ${this.matchesFound} / ${this.totalPairs}`);

          this.resetSelectedCards(true); // Allow click immediately after match

          if (this.matchesFound === this.totalPairs) {
              this.levelComplete();
          }
      } else {
          // No match
          this.time.delayedCall(REVEAL_TIME_MS, () => {
              this.hideCard(this.firstCard);
              this.hideCard(this.secondCard);
              this.resetSelectedCards(true); // Allow click after hiding
          }, [], this);
      }
  }

  resetSelectedCards(allowClick = false) {
      this.firstCard = null;
      this.secondCard = null;
      this.canClick = allowClick; // Control when clicking is re-enabled
  }

  levelComplete() {
      console.log(`Level ${currentLevelIndex + 1} complete!`);
      this.canClick = false; // Disable board clicks
      if (this.timerEvent) {
          this.timerEvent.remove(false); // Stop the timer
      }
      const finalTime = Math.floor((this.time.now - this.startTime) / 1000); // Final time in seconds
      const finalMoves = this.moves;

      // --- Save Best Stats ---
      const bestTimeKey = `level_${currentLevelIndex}_best_time`;
      const leastMovesKey = `level_${currentLevelIndex}_least_moves`;

      const storedBestTime = parseInt(getCookie(bestTimeKey) || Infinity);
      const storedLeastMoves = parseInt(getCookie(leastMovesKey) || Infinity);

      let newBest = false;
      if (finalTime < storedBestTime) {
          setCookie(bestTimeKey, finalTime, 365); // Save for 1 year
          this.bestStatsText.setText(this.bestStatsText.text.replace(/(\d+:\d+s?)|(N\/A)/, formatTime(finalTime)+'s')); // Update display
          newBest = true;
          console.log(`New best time for Level ${currentLevelIndex + 1}: ${finalTime}s`);
      }
       if (finalMoves < storedLeastMoves) {
          setCookie(leastMovesKey, finalMoves, 365);
           // Update display - more complex regex or rebuild string needed if both shown
           // Simple update for now, assumes moves shown first if present:
          this.bestStatsText.setText(this.bestStatsText.text.replace(/(\d+\s+moves)|(N\/A)/, `${finalMoves} moves`));
          newBest = true;
          console.log(`New least moves for Level ${currentLevelIndex + 1}: ${finalMoves}`);
      }

      // --- Prepare Completion Message ---
      let message;
      let isLastLevel = currentLevelIndex >= LEVELS.length - 1;

      if (isLastLevel) {
          message = `Game Complete!\nFinal Score: ${finalMoves} moves / ${formatTime(finalTime)}s\n\nClick to Play Again`;
      } else {
          message = `Level ${currentLevelIndex + 1} Complete!\n${finalMoves} moves / ${formatTime(finalTime)}s\n\nClick for Level ${currentLevelIndex + 2}`;
      }
      if (newBest) {
          message = `🎉 New Best Score! 🎉\n${message}`;
      }

      this.levelCompleteText.setText(message).setVisible(true);

      // --- Setup Click Handler for Next Action ---
      this.levelCompleteText.off('pointerdown'); // Remove previous listener if any
      this.levelCompleteText.on('pointerdown', () => {
          if (isLastLevel) {
              currentLevelIndex = 0; // Reset to first level
          } else {
              currentLevelIndex++; // Go to next level
          }
          this.scene.restart(); // Restart the scene for the new level
      });
  }
    triggerWinState() {
        console.log("You Win!");
        this.winText.setVisible(true);
        // Disable clicking on any remaining cards (though all should be matched)
        this.canClick = false;
         this.cards.forEach(card => card.disableInteractive()); // Make sure cards are not clickable
    }

    update() {
        // Typically used for continuous updates, not strictly needed for turn-based logic
    }
}
// --- Cookie Helper Functions ---
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
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

// --- Phaser Game Configuration ---
const config = {
    type: Phaser.AUTO, // Use WebGL if available, otherwise Canvas
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'game-container', // ID of the div to render in
    scene: [GameScene], // List of scenes, starting with the first one
    backgroundColor: '#d3d3d3' // Background color outside the scene's camera view
};

// --- Initialize Phaser Game ---
const game = new Phaser.Game(config);