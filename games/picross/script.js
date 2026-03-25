document.addEventListener('DOMContentLoaded', () => {
    // ... (Keep all existing DOM element selections and variable declarations) ...
    const gridSizeSelect = document.getElementById('gridSize');
    const maxMistakesSelect = document.getElementById('maxMistakes');
    const newGameBtn = document.getElementById('newGameBtn');
    const cluesTopContainer = document.getElementById('cluesTop');
    const cluesLeftContainer = document.getElementById('cluesLeft');
    const gridContainer = document.getElementById('picrossGrid');
    const mistakesDisplay = document.getElementById('mistakes');
    const progressDisplay = document.getElementById('progress');
    const timerDisplay = document.getElementById('timer');
    const messageOverlay = document.getElementById('messageOverlay');
    const messageContent = document.getElementById('messageContent');
    const closeMessageBtn = document.getElementById('closeMessageBtn');
    const gameArea = document.querySelector('.game-area');

    let gridSize = 10;
    let maxMistakes = 5;
    let mistakesMade = 0;
    let solution = [];
    let playerGrid = [];
    let rowClues = [];
    let colClues = [];
    let isGameOver = false;
    let correctlyFilled = 0;
    let totalToFill = 0;
    let startTime;
    let timerInterval;
    let isMouseDown = false;
    let currentAction = null;

    // --- Game Initialization (Keep existing initGame, generateSolution, calculateClues, getCluesForLine) ---
    function initGame() {
        console.log("Initializing game...");
        gridSize = parseInt(gridSizeSelect.value);
        maxMistakes = parseInt(maxMistakesSelect.value);
        if (maxMistakes === 999) maxMistakes = Infinity;

        mistakesMade = 0;
        correctlyFilled = 0;
        totalToFill = 0;
        isGameOver = false;
        isMouseDown = false;
        currentAction = null;

        solution = generateSolution(gridSize);
        playerGrid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
        [rowClues, colClues] = calculateClues(solution);
        totalToFill = solution.flat().reduce((sum, cell) => sum + cell, 0);

        createGrid(); // This now calls addGridEventListeners internally
        renderClues();
        updateScorecard();
        resetTimer();
        startTimer();

        messageOverlay.classList.add('hidden');
        gridContainer.classList.remove('game-over');
        console.log("Game initialized. Grid Size:", gridSize, "Max Mistakes:", maxMistakes);
    }

    function generateSolution(size) {
        const newSolution = [];
        const fillProbability = 0.4 + Math.random() * 0.2;
        for (let r = 0; r < size; r++) {
            const row = [];
            for (let c = 0; c < size; c++) {
                row.push(Math.random() < fillProbability ? 1 : 0);
            }
            newSolution.push(row);
        }
        const filledCount = newSolution.flat().reduce((a, b) => a + b, 0);
        if (filledCount === 0 || filledCount === size * size) {
            return generateSolution(size);
        }
        return newSolution;
    }

    function calculateClues(grid) {
        const size = grid.length;
        const rClues = [];
        const cClues = [];
        for (let r = 0; r < size; r++) {
            rClues.push(getCluesForLine(grid[r]));
        }
        for (let c = 0; c < size; c++) {
            const column = grid.map(row => row[c]);
            cClues.push(getCluesForLine(column));
        }
        return [rClues, cClues];
    }

    function getCluesForLine(line) {
        const clues = [];
        let count = 0;
        for (let i = 0; i < line.length; i++) {
            if (line[i] === 1) {
                count++;
            } else {
                if (count > 0) {
                    clues.push(count);
                }
                count = 0;
            }
        }
        if (count > 0) {
            clues.push(count);
        }
        return clues.length === 0 ? [0] : clues;
    }


    // --- Grid and Clue Rendering (Keep existing createGrid, renderClues) ---
     function createGrid() {
        gridContainer.innerHTML = '';
        cluesTopContainer.innerHTML = '';
        cluesLeftContainer.innerHTML = '';
        gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        gridContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

        const maxGridWidth = Math.min(window.innerWidth * 0.7, 600);
        const cellSize = Math.max(20, Math.floor(maxGridWidth / gridSize));

        const clueWidthEstimate = Math.max(60, gridSize * 3);
        const clueHeightEstimate = Math.max(60, gridSize * 3);
        gameArea.style.gridTemplateColumns = `${clueWidthEstimate}px minmax(${gridSize * 20}px, ${maxGridWidth}px)`;
        gameArea.style.gridTemplateRows = `${clueHeightEstimate}px minmax(${gridSize * 20}px, ${maxGridWidth}px)`;

        const cells = [];
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = r;
                cell.dataset.col = c;
                cell.style.width = `${cellSize}px`;
                cell.style.height = `${cellSize}px`;

                if ((r + 1) % 5 === 0 && r < gridSize - 1) cell.style.borderBottom = '2px solid #888';
                if ((c + 1) % 5 === 0 && c < gridSize - 1) cell.style.borderRight = '2px solid #888';

                gridContainer.appendChild(cell);
                cells.push(cell);
            }
        }
        addGridEventListeners(); // Call listener setup here
    }

     function renderClues() {
        cluesTopContainer.style.display = 'flex';
        cluesTopContainer.innerHTML = '';
        colClues.forEach((clueSet, index) => {
            const clueList = document.createElement('div');
            clueList.classList.add('clue-list');
            clueList.dataset.clueType = 'col';
            clueList.dataset.index = index;
            clueSet.forEach(num => {
                const span = document.createElement('span');
                span.textContent = num;
                clueList.appendChild(span);
            });
            cluesTopContainer.appendChild(clueList);
        });

        cluesLeftContainer.style.display = 'flex';
        cluesLeftContainer.innerHTML = '';
        rowClues.forEach((clueSet, index) => {
            const clueList = document.createElement('div');
            clueList.classList.add('clue-list');
             clueList.dataset.clueType = 'row';
             clueList.dataset.index = index;
            clueSet.forEach(num => {
                const span = document.createElement('span');
                span.textContent = num;
                clueList.appendChild(span);
            });
            cluesLeftContainer.appendChild(clueList);
        });

        requestAnimationFrame(() => {
            const topCluesHeight = cluesTopContainer.offsetHeight+24;
            const leftCluesWidth = cluesLeftContainer.offsetWidth;
            gameArea.style.gridTemplateRows = `${topCluesHeight}px auto`;
            gameArea.style.gridTemplateColumns = `${leftCluesWidth}px auto`;

            const cells = gridContainer.querySelectorAll('.cell');
            if (cells.length > 0) {
                 const cellSize = cells[0].offsetWidth;
                 document.querySelectorAll('.clues-top .clue-list').forEach(cl => cl.style.minWidth = `${cellSize}px`);
                 document.querySelectorAll('.clues-left .clue-list').forEach(cl => cl.style.minHeight = `${cellSize}px`);
            }
        });
    }

    // --- Event Handling (Listeners Setup) ---
    function addGridEventListeners() {
         // Remove previous listeners if any (important for New Game)
         gridContainer.removeEventListener('mousedown', handleMouseDown);
         gridContainer.removeEventListener('contextmenu', handleRightClick);
         document.removeEventListener('mousemove', handleMouseMove);
         document.removeEventListener('mouseup', handleMouseUp);
         gridContainer.removeEventListener('touchstart', handleTouchStart);
         gridContainer.removeEventListener('touchmove', handleTouchMove);
         gridContainer.removeEventListener('touchend', handleTouchEnd);

         // Add listeners
         gridContainer.addEventListener('mousedown', handleMouseDown);
         gridContainer.addEventListener('contextmenu', handleRightClick);
         document.addEventListener('mousemove', handleMouseMove);
         document.addEventListener('mouseup', handleMouseUp);
         gridContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
         gridContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
         gridContainer.addEventListener('touchend', handleTouchEnd);
    }

    // --- Event Handling (Handlers - Keep existing Mouse/Touch handlers: handleMouseDown, handleMouseMove, handleMouseUp, handleRightClick, handleTouchStart, handleTouchMove, handleTouchEnd) ---
    // Make sure handleMouseDown correctly sets currentAction and calls fillCell/toggleMark
    // Make sure handleRightClick calls toggleMark
    // Make sure touch handlers call the correct actions

    function handleMouseDown(e) {
        if (isGameOver || !e.target.classList.contains('cell')) return;
        e.preventDefault();

        isMouseDown = true;
        const cell = e.target;
        const r = parseInt(cell.dataset.row);
        const c = parseInt(cell.dataset.col);

        // Right-click OR Left-click + Ctrl/Alt/Meta key = Mark Action
        if (e.button === 2 || (e.button === 0 && (e.ctrlKey || e.altKey || e.metaKey))) {
             currentAction = 'mark';
             toggleMark(cell, r, c);
        } else if (e.button === 0) { // Left-click = Fill Action
             currentAction = 'fill';
             fillCell(cell, r, c);
        }
    }

     function handleMouseMove(e) {
        if (!isMouseDown || isGameOver || currentAction === null) return;
        const targetElement = document.elementFromPoint(e.clientX, e.clientY);

        if (targetElement && targetElement.classList.contains('cell') && targetElement.closest('#picrossGrid')) {
            const cell = targetElement;
            const r = parseInt(cell.dataset.row);
            const c = parseInt(cell.dataset.col);

             if (!cell.dataset.dragProcessed) {
                if (currentAction === 'fill') {
                    fillCell(cell, r, c, true); // Pass true for isDragging
                } else if (currentAction === 'mark') {
                    toggleMark(cell, r, c, true); // Pass true for isDragging
                }
                cell.dataset.dragProcessed = 'true';
            }
        }
    }

    function handleMouseUp(e) {
        if (isMouseDown) {
            isMouseDown = false;
            currentAction = null;
            gridContainer.querySelectorAll('.cell[data-drag-processed]').forEach(cell => {
                delete cell.dataset.dragProcessed;
            });
            checkWinCondition(); // Check win only after interaction sequence ends
        }
    }

    function handleRightClick(e) {
        e.preventDefault(); // Prevent context menu ALWAYS on the grid
        if (isGameOver || !e.target.classList.contains('cell')) return;

        // If not currently dragging with the mouse button down, treat as a single toggle mark
        // This allows single right-clicks to work even if the mouse button was previously down elsewhere
        if (!isMouseDown) {
            const cell = e.target;
            const r = parseInt(cell.dataset.row);
            const c = parseInt(cell.dataset.col);
            toggleMark(cell, r, c);
        }
        // If mouse IS down, the mousedown handler already initiated the action.
    }


    // --- Touch Handlers (Keep existing structure, ensure they call fillCell/toggleMark correctly) ---
    let touchStartCell = null;
    let touchAction = null;
    let longPressTimer = null;

    function handleTouchStart(e) {
        if (isGameOver || e.touches.length !== 1) return;
        e.preventDefault();

        const touch = e.touches[0];
        const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);

        if (targetElement && targetElement.classList.contains('cell')) {
            touchStartCell = targetElement;
            isMouseDown = true; // Use this flag for drag logic consistency

            clearTimeout(longPressTimer);
            longPressTimer = setTimeout(() => {
                 if (isMouseDown && touchStartCell === targetElement) {
                     const r = parseInt(touchStartCell.dataset.row);
                     const c = parseInt(touchStartCell.dataset.col);
                     currentAction = 'mark'; // Set for potential drag
                     touchAction = 'mark';   // Set for potential drag
                     toggleMark(touchStartCell, r, c); // Perform the mark
                     touchStartCell = null; // Action done for this cell
                 }
                 longPressTimer = null;
            }, 500);

            touchAction = 'pending'; // Will become 'fill' or 'mark'
        }
    }

    function handleTouchMove(e) {
        if (!isMouseDown || isGameOver || e.touches.length !== 1) return;
        e.preventDefault();

        clearTimeout(longPressTimer); // Moving cancels long press

        const touch = e.touches[0];
        const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);

         if (targetElement && targetElement.classList.contains('cell') && targetElement.closest('#picrossGrid')) {
             const cell = targetElement;
             const r = parseInt(cell.dataset.row);
             const c = parseInt(cell.dataset.col);

             // Determine drag action if not set yet (default to fill if not long-pressed)
             if (touchAction === 'pending') {
                 currentAction = 'fill';
                 touchAction = 'fill';
             } else {
                 currentAction = touchAction; // Use 'fill' or 'mark' established earlier
             }

            if (!cell.dataset.dragProcessed && currentAction) {
                 if (currentAction === 'fill') {
                     fillCell(cell, r, c, true);
                 } else if (currentAction === 'mark') {
                     toggleMark(cell, r, c, true);
                 }
                 cell.dataset.dragProcessed = 'true';
            }
        }
    }

    function handleTouchEnd(e) {
         clearTimeout(longPressTimer);

         if (isMouseDown) {
             // If it was a short tap (no move, no long press fired)
            if (touchAction === 'pending' && touchStartCell) {
                 const r = parseInt(touchStartCell.dataset.row);
                 const c = parseInt(touchStartCell.dataset.col);
                 currentAction = 'fill'; // Short tap defaults to fill
                 fillCell(touchStartCell, r, c); // Perform fill on original cell
             }

             isMouseDown = false;
             currentAction = null;
             touchStartCell = null;
             touchAction = null;
             gridContainer.querySelectorAll('.cell[data-drag-processed]').forEach(cell => {
                 delete cell.dataset.dragProcessed;
             });
             checkWinCondition();
         }
    }

    // --- Cell Interaction Logic ---

    /**
     * Attempts to fill a cell (Left-Click Action).
     * Will not fill if the cell is already correctly filled or marked with an X.
     */
    function fillCell(cell, r, c, isDragging = false) {
        if (isGameOver || playerGrid[r][c] === 1 || playerGrid[r][c] === 2) {
            // Do nothing if: game over, cell already correctly filled, or cell is marked (X)
            return;
        }

        // At this point, cell must be empty (playerGrid[r][c] === 0)
        if (solution[r][c] === 1) {
            // Correct Fill
            playerGrid[r][c] = 1;
            cell.classList.add('filled');
            cell.classList.remove('marked'); // Should be redundant, but safe
            correctlyFilled++;
            updateScorecard();
            checkClueCompletion(r, c);
            if (!isDragging || correctlyFilled === totalToFill) {
                checkWinCondition();
            }
        } else {
            // Incorrect Fill (Mistake)
            handleMistake(cell);
        }
    }

    /**
     * Toggles the marked state ('X') of a cell (Right-Click Action).
     * Will not mark a cell that is already correctly filled.
     */
    function toggleMark(cell, r, c, isDragging = false) {
        if (isGameOver || playerGrid[r][c] === 1) {
            // Do nothing if: game over, or cell is already correctly filled
            return;
        }

        if (playerGrid[r][c] === 2) {
            // Unmark the cell
            playerGrid[r][c] = 0;
            cell.classList.remove('marked');
        } else {
            // Mark the cell (it must be 0 - empty)
            playerGrid[r][c] = 2;
            cell.classList.add('marked');
            cell.classList.remove('filled'); // Ensure filled class is removed if somehow present
        }
        // Check clues after marking/unmarking as it can affect visual completion status
        checkClueCompletion(r, c);
    }

    function handleMistake(cell) {
        if (isGameOver) return;

        mistakesMade++;
        updateScorecard();
        // Add visual feedback for mistake even if it doesn't change cell state
        cell.classList.add('mistake-flash');
        setTimeout(() => {
            cell.classList.remove('mistake-flash');
        }, 500);

        if (mistakesMade >= maxMistakes && maxMistakes !== Infinity) {
            gameOver(false);
        }
    }


    // --- Game State Checks (Keep existing checkClueCompletion, areCluesSatisfied, checkWinCondition, gameOver) ---
     function checkClueCompletion(row, col) {
        const rowLine = playerGrid[row];
        const rowClueElement = cluesLeftContainer.querySelector(`.clue-list[data-index="${row}"]`);
        if (areCluesSatisfied(rowLine, rowClues[row])) {
            rowClueElement.classList.add('completed');
        } else {
            rowClueElement.classList.remove('completed');
        }

        const colLine = playerGrid.map(r => r[col]);
        const colClueElement = cluesTopContainer.querySelector(`.clue-list[data-index="${col}"]`);
        if (areCluesSatisfied(colLine, colClues[col])) {
            colClueElement.classList.add('completed');
        } else {
            colClueElement.classList.remove('completed');
        }
    }

    function areCluesSatisfied(line, clues) {
        // Treat marked (2) cells as empty (0) for checking runs
        const currentRuns = getCluesForLine(line.map(cell => cell === 1 ? 1 : 0));
        return JSON.stringify(currentRuns) === JSON.stringify(clues);
    }

    function checkWinCondition() {
         if (isGameOver) return;
         if (correctlyFilled === totalToFill) {
             let win = true;
              for (let r = 0; r < gridSize; r++) {
                  for (let c = 0; c < gridSize; c++) {
                      // This check ensures no empty cell (0) is wrongly filled (1)
                      // It implicitly handles marked cells (2) correctly, as they aren't filled (1)
                      if (solution[r][c] === 0 && playerGrid[r][c] === 1) {
                          win = false;
                          break;
                      }
                      // We only need to check if all '1's in the solution are matched by '1's in playerGrid,
                      // which is what `correctlyFilled === totalToFill` already ensures.
                  }
                  if (!win) break;
              }
              if(win) {
                gameOver(true);
              }
         }
    }

    function gameOver(isWin) {
        isGameOver = true;
        stopTimer();
        gridContainer.classList.add('game-over');

        const finalTime = timerDisplay.textContent;
        let message = '';
        if (isWin) {
             message = `<h2>Congratulations!</h2><p>You solved the ${gridSize}x${gridSize} puzzle!</p><p>Time: ${finalTime}</p><p>Mistakes: ${mistakesMade}</p>`;
             document.querySelectorAll('.clue-list').forEach(cl => cl.classList.add('completed'));
             // Optionally, automatically mark all remaining non-filled cells
             for(let r=0; r<gridSize; r++){
                 for(let c=0; c<gridSize; c++){
                     if(playerGrid[r][c] === 0 && solution[r][c] === 0) {
                         // Optional: auto-mark empty cells on win for clarity?
                         // const cell = gridContainer.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
                         // toggleMark(cell, r, c); // Mark empty cells visually
                     } else if (playerGrid[r][c] === 2 && solution[r][c] === 0) {
                         // Correctly marked - leave as is
                     }
                 }
             }

        } else {
            message = `<h2>Game Over!</h2><p>You made ${mistakesMade} mistakes.</p><p>Time: ${finalTime}</p>`;
            // Optionally reveal solution on loss
            // revealSolution();
        }
        messageContent.innerHTML = message;
        messageOverlay.classList.remove('hidden');
    }

    /* // Optional Reveal Solution Function (keep commented out unless needed)
    function revealSolution() {
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                const cell = gridContainer.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
                cell.classList.remove('filled', 'marked', 'mistake-flash'); // Clear player state
                if (solution[r][c] === 1) {
                    cell.classList.add('filled');
                } else {
                     // Optionally add a different style for revealed empty cells
                    // cell.classList.add('revealed-empty');
                }
            }
        }
         // Mark all clues as complete visually when revealing
         document.querySelectorAll('.clue-list').forEach(cl => cl.classList.add('completed'));
    }
    */


    // --- UI Updates (Keep existing updateScorecard, formatTime, startTimer, stopTimer, resetTimer) ---
    function updateScorecard() {
        const mistakeText = maxMistakes === Infinity ? `${mistakesMade} / ∞` : `${mistakesMade} / ${maxMistakes}`;
        mistakesDisplay.textContent = `Mistakes: ${mistakeText}`;
        const progress = totalToFill === 0 ? 100 : Math.max(0, Math.min(100, Math.floor((correctlyFilled / totalToFill) * 100)));
        progressDisplay.textContent = `Progress: ${progress}%`;
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

     function startTimer() {
        if (timerInterval) clearInterval(timerInterval); // Clear existing timer if any
        startTime = Date.now();
        timerDisplay.textContent = `Time: ${formatTime(0)}`; // Reset display immediately
        timerInterval = setInterval(() => {
            if (!isGameOver) { // Only update if game is running
                const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
                timerDisplay.textContent = `Time: ${formatTime(elapsedTime)}`;
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
        timerInterval = null; // Clear the interval ID
    }

     function resetTimer() {
        stopTimer();
        timerDisplay.textContent = "Time: 00:00";
    }

    // --- Event Listeners Setup (Keep existing listeners for buttons/selects) ---
    newGameBtn.addEventListener('click', initGame);
    closeMessageBtn.addEventListener('click', () => messageOverlay.classList.add('hidden'));
    gridSizeSelect.addEventListener('change', initGame);
    maxMistakesSelect.addEventListener('change', initGame);


    // --- Initial Game Load ---
    initGame();

}); // End DOMContentLoaded