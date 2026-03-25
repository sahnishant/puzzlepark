document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const setupScreen = document.getElementById('setup-screen');
    const gameScreen = document.getElementById('game-screen');
    const playerCountSelect = document.getElementById('player-count');
    const startGameBtn = document.getElementById('start-game');
    const boardElement = document.getElementById('ludo-board');
    const diceElement = document.getElementById('dice');
    const rollDiceBtn = document.getElementById('roll-dice-btn');
    const messageArea = document.getElementById('message-area');
    const currentPlayerColorEl = document.getElementById('current-player-color');
    const currentPlayerNameEl = document.getElementById('current-player-name');
    const resetGameBtn = document.getElementById('reset-game-btn');


    // --- Game Constants ---
    const PLAYERS = [
        { id: 0, name: 'Player 1', color: 'red', isAI: false },
        { id: 1, name: 'Player 2', color: 'green', isAI: false },
        { id: 2, name: 'Player 3', color: 'yellow', isAI: false },
        { id: 3, name: 'Player 4', color: 'blue', isAI: false },
    ];
    const PIECES_PER_PLAYER = 4;
    const BOARD_SIZE = 15; // 15x15 grid

    // --- Game State ---
    let activePlayers = [];
    let pieces = []; // { id, playerId, color, position: { type: 'yard'/'track'/'homepath'/'finished', index }, element }
    let currentPlayerIndex = 0;
    let currentDiceValue = 0;
    let gameState = 'setup'; // setup, rolling, moving, gameover
    let sixRolled = false;
    let consecutiveSixes = 0; // Basic handling for extra turns

    // --- Board Path Definitions (Crucial!) ---
    // This needs careful mapping from logical positions to grid cells [row, col] (0-indexed)
    const YARD_POSITIONS = {
        red: [[1, 1], [1, 4], [4, 1], [4, 4]],
        green: [[1, 10], [1, 13], [4, 10], [4, 13]],
        yellow: [[10, 10], [10, 13], [13, 10], [13, 13]],
        blue: [[10, 1], [10, 4], [13, 1], [13, 4]],
    };

    const START_CELLS = { // Grid cell [row, col] for starting square
        red: [6, 1],
        green: [1, 8],
        yellow: [8, 13],
        blue: [13, 6],
    };

    const START_TRACK_INDEX = { // Logical index on the main track
        red: 0,
        green: 13,
        yellow: 26,
        blue: 39,
    };

    const HOME_PATH_ENTRIES = { // Last track index before entering home path
        red: 50,
        green: 11,
        yellow: 24,
        blue: 37,
    };

    const HOME_PATH_CELLS = { // Grid cells [row, col] for home paths
        red: [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6]], // Path length 6
        green: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7]],
        yellow: [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9], [7, 8]],
        blue: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7], [8, 7]],
    };

    const HOME_CELLS = { // Grid cells [row, col] for the final home base
        red: [7, 7], // Center square - adjust as needed
        green: [7, 7],
        yellow: [7, 7],
        blue: [7, 7],
    };

    // Define the main track path as sequence of [row, col] coordinates
    // This is tedious but essential. Total 52 track cells (0-51).
    const TRACK_PATH_CELLS = [
        // Red side out to Green start
        [6, 1], [6, 2], [6, 3], [6, 4], [6, 5],            // 0-4
        [5, 6], [4, 6], [3, 6], [2, 6], [1, 6],            // 5-9
        [0, 7], [0, 8],                                   // 10-11
        // Green side out to Yellow start
        [1, 8], [2, 8], [3, 8], [4, 8], [5, 8],            // 12-16 (Start Green = 13)
        [6, 9], [6, 10], [6, 11], [6, 12], [6, 13],        // 17-21
        [7, 14], [8, 14],                                  // 22-23
        // Yellow side out to Blue start
        [8, 13], [8, 12], [8, 11], [8, 10], [8, 9],        // 24-28 (Start Yellow = 26)
        [9, 8], [10, 8], [11, 8], [12, 8], [13, 8],        // 29-33
        [14, 7], [14, 6],                                  // 34-35
        // Blue side out to Red start
        [13, 6], [12, 6], [11, 6], [10, 6], [9, 6],        // 36-40 (Start Blue = 39)
        [8, 5], [8, 4], [8, 3], [8, 2], [8, 1],            // 41-45
        [7, 0], [6, 0]                                    // 46-47
        // Path indexes 48-51 lead back towards red start, need to check HOME_PATH_ENTRIES
        // Let's refine the path slightly to make indexes consistent
        // Red Path: 0..50, Green: 13..11, Yellow: 26..24, Blue: 39..37
        // Map logical track index to cell coordinates
    ].map((cell, index) => ({ index, cell })); // Add index for easier lookup

    // Combine into a lookup map for faster access cell -> track index
    const cellToTrackIndexMap = new Map();
    TRACK_PATH_CELLS.forEach(item => {
        cellToTrackIndexMap.set(item.cell.join(','), item.index);
    });

    const SAFE_ZONE_TRACK_INDICES = [0, 9, 12, 21, 24, 33, 36, 45, 48]; // Example safe zones


    // --- Initialization Functions ---

    function createBoard() {
        boardElement.innerHTML = ''; // Clear previous board
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = r;
                cell.dataset.col = c;
                cell.id = `cell-${r}-${c}`;
                // cell.textContent = `${r},${c}`; // Optional: for debugging coordinates

                // --- Apply Styling based on cell coordinates ---
                // Bases / Yards
                if (r < 6 && c < 6) cell.classList.add('base-red');
                else if (r < 6 && c > 8) cell.classList.add('base-green');
                else if (r > 8 && c > 8) cell.classList.add('base-yellow');
                else if (r > 8 && c < 6) cell.classList.add('base-blue');

                // Center Home Area
                else if (r >= 6 && r <= 8 && c >= 6 && c <= 8) {
                    cell.classList.add('home-area');
                    if (r === 7 && c === 6) cell.classList.add('home-red');    // Final home triangle part
                    if (r === 6 && c === 7) cell.classList.add('home-green');
                    if (r === 7 && c === 8) cell.classList.add('home-yellow');
                    if (r === 8 && c === 7) cell.classList.add('home-blue');
                    if (r === 7 && c === 7) cell.classList.add('home-base'); // Center square
                }

                // Home Paths
                else if (c > 0 && c < 7 && r === 7) cell.classList.add('home-path-red'); // Red home path
                else if (r > 0 && r < 7 && c === 7) cell.classList.add('home-path-green'); // Green
                else if (c > 7 && c < 14 && r === 7) cell.classList.add('home-path-yellow'); // Yellow
                else if (r > 7 && r < 14 && c === 7) cell.classList.add('home-path-blue'); // Blue

                // Main Track Path & Start squares
                else {
                    const coordStr = `${r},${c}`;
                    if (cellToTrackIndexMap.has(coordStr)) {
                        cell.classList.add('track');
                        const trackIndex = cellToTrackIndexMap.get(coordStr);

                        // Mark safe zones
                        if (SAFE_ZONE_TRACK_INDICES.includes(trackIndex)) {
                            cell.classList.add('safe');
                        }
                        // Mark start squares
                        if (r === START_CELLS.red[0] && c === START_CELLS.red[1]) cell.classList.add('start-red', 'safe');
                        else if (r === START_CELLS.green[0] && c === START_CELLS.green[1]) cell.classList.add('start-green', 'safe');
                        else if (r === START_CELLS.yellow[0] && c === START_CELLS.yellow[1]) cell.classList.add('start-yellow', 'safe');
                        else if (r === START_CELLS.blue[0] && c === START_CELLS.blue[1]) cell.classList.add('start-blue', 'safe');

                    }
                }

                boardElement.appendChild(cell);
            }
        }
    }

    function createPieces() {
        pieces = [];
        activePlayers.forEach(player => {
            for (let i = 0; i < PIECES_PER_PLAYER; i++) {
                const pieceId = `${player.color}-piece-${i}`;
                const pieceElement = document.createElement('div');
                pieceElement.classList.add('piece', player.color);
                pieceElement.id = pieceId;
                pieceElement.dataset.playerId = player.id;
                pieceElement.dataset.pieceIndex = i; // Store original index if needed

                const pieceData = {
                    id: pieceId,
                    playerId: player.id,
                    color: player.color,
                    position: { type: 'yard', index: i }, // Start in yard
                    element: pieceElement,
                };
                pieces.push(pieceData);
                boardElement.appendChild(pieceElement); // Add to board initially (will be positioned)
                positionPiece(pieceData); // Position it in the yard
                // Add click listener for movement
                pieceElement.addEventListener('click', () => handlePieceClick(pieceData));
            }
        });
    }

    function positionPiece(pieceData) {
        const { element, position, color } = pieceData;
        let targetCellId;
        let targetCellCoords;

        if (position.type === 'yard') {
            targetCellCoords = YARD_POSITIONS[color][position.index];
        } else if (position.type === 'track') {
            const trackData = TRACK_PATH_CELLS.find(p => p.index === position.index);
            if (trackData) {
                targetCellCoords = trackData.cell;
            } else {
                console.error(`Invalid track index ${position.index} for piece ${pieceData.id}`);
                return; // Don't move if position is invalid
            }
        } else if (position.type === 'homepath') {
            targetCellCoords = HOME_PATH_CELLS[color][position.index];
        } else if (position.type === 'finished') {
            targetCellCoords = HOME_CELLS[color]; // Move to final home
        }

        if (targetCellCoords) {
            targetCellId = `cell-${targetCellCoords[0]}-${targetCellCoords[1]}`;
            const targetCellElement = document.getElementById(targetCellId);

            if (targetCellElement) {
                // Find other pieces already on the target cell to handle offset/stacking
                const piecesOnCell = pieces.filter(p =>
                    p.id !== pieceData.id && // Exclude self
                    p.position.type === position.type &&
                    p.position.index === position.index
                );

                // Apply offset based on how many pieces are already there
                element.dataset.offset = piecesOnCell.length + 1;

                // Simple append - CSS handles absolute positioning relative to cell
                targetCellElement.appendChild(element);
            } else {
                console.error(`Target cell element not found: ${targetCellId}`);
            }
        } else if (position.type !== 'finished') {
            console.warn(`Could not determine target cell for piece ${pieceData.id} at`, position);
        } else {
            // If finished, maybe hide or move off-board visually
            element.style.display = 'none'; // Simple hide for finished pieces
        }
    }


    // --- Game Logic Functions ---
    function rollDice() {
        if (gameState !== 'rolling') return;

        rollDiceBtn.disabled = true;
        diceElement.classList.add('rolling-animation');

        // Simulate roll "tension"
        setTimeout(() => {
            diceElement.classList.remove('rolling-animation');
            currentDiceValue = Math.floor(Math.random() * 6) + 1;
            diceElement.textContent = currentDiceValue;

            // Add a "pop" effect
            diceElement.style.transform = 'scale(1.2)';
            setTimeout(() => diceElement.style.transform = 'scale(1)', 100);

            sixRolled = currentDiceValue === 6;
            if (sixRolled) consecutiveSixes++;
            else consecutiveSixes = 0;

            handleAfterRoll();
        }, 600);
    }
    function handleAfterRoll() {
        setMessage(`Rolled a ${currentDiceValue}. Select a piece!`);
        gameState = 'moving';
        highlightSelectablePieces();

        const possibleMoves = getPossibleMoves(activePlayers[currentPlayerIndex].id, currentDiceValue);

        if (possibleMoves.length === 0) {
            setMessage(`No moves for ${currentDiceValue}...`);
            setTimeout(nextTurn, 1200);
        } else if (activePlayers[currentPlayerIndex].isAI) {
            setTimeout(runAI, 800);
        }
    }
    function getPossibleMoves(playerId, diceValue) {
        const playerPieces = pieces.filter(p => p.playerId === playerId);
        const possibleMoves = []; // Stores { piece, newPosition }

        playerPieces.forEach(piece => {
            const currentPos = piece.position;
            let newPos = null;

            if (currentPos.type === 'yard') {
                if (diceValue === 6) {
                    const startTrackIndex = START_TRACK_INDEX[piece.color];
                    newPos = { type: 'track', index: startTrackIndex };
                    // TODO: Check if start square is blocked by own pieces (optional rule)
                }
            } else if (currentPos.type === 'track') {
                const currentTrackIndex = currentPos.index;
                const homeEntryIndex = HOME_PATH_ENTRIES[piece.color];
                let targetTrackIndex = (currentTrackIndex + diceValue) % 52; // Wrap around track

                // Check if moving towards or past home entry
                let stepsToHomeEntry = (homeEntryIndex - currentTrackIndex + 52) % 52;
                if (currentTrackIndex === homeEntryIndex && diceValue > 0) { // Already past or at entry, handle wrap around logic
                    stepsToHomeEntry = 52; // Effectively means cannot enter home this way
                }


                if (stepsToHomeEntry < diceValue) { // Will enter home path
                    const stepsIntoHomePath = diceValue - stepsToHomeEntry - 1; // -1 because entry counts as step 1
                    const maxHomePathIndex = HOME_PATH_CELLS[piece.color].length - 1;

                    if (stepsIntoHomePath <= maxHomePathIndex) {
                        newPos = { type: 'homepath', index: stepsIntoHomePath };
                    } else if (stepsIntoHomePath === maxHomePathIndex + 1) { // Exact roll to finish
                        newPos = { type: 'finished', index: 0 }; // Or use a specific index if needed
                    }
                    // Else: Overshot home, invalid move from track
                } else { // Stays on main track
                    newPos = { type: 'track', index: targetTrackIndex };
                }

            } else if (currentPos.type === 'homepath') {
                const targetHomePathIndex = currentPos.index + diceValue;
                const maxHomePathIndex = HOME_PATH_CELLS[piece.color].length - 1;

                if (targetHomePathIndex <= maxHomePathIndex) {
                    newPos = { type: 'homepath', index: targetHomePathIndex };
                } else if (targetHomePathIndex === maxHomePathIndex + 1) { // Exact roll to finish
                    newPos = { type: 'finished', index: 0 };
                }
                // Else: Overshot home, invalid move from homepath
            }
            // Cannot move 'finished' pieces

            if (newPos) {
                // TODO: Add check for validity (e.g., not landing on own blockade)
                possibleMoves.push({ piece, newPosition: newPos });
            }
        });
        return possibleMoves;
    }

    function handlePieceClick(pieceData) {
        if (gameState !== 'moving' || pieceData.playerId !== activePlayers[currentPlayerIndex].id) {
            console.log("Not your turn or not in moving state, or not your piece.");
            return; // Not this player's turn or not in move state
        }
        if (!pieceData.element.classList.contains('selectable')) {
            console.log("Piece not selectable for current dice roll.");
            return; // Piece wasn't highlighted as a valid move
        }

        // Find the intended move for this piece from possible moves
        const possibleMoves = getPossibleMoves(pieceData.playerId, currentDiceValue);
        const move = possibleMoves.find(m => m.piece.id === pieceData.id);

        if (move) {
            clearHighlights();
            executeMove(move.piece, move.newPosition);
        } else {
            console.error("Clicked selectable piece, but move not found in possibilities?");
        }
    }

    function executeMove(piece, newPosition) {
        console.log(`Moving piece ${piece.id} to`, newPosition);
        const oldPosition = { ...piece.position }; // Copy old position

        // --- Capture Logic ---
        let capturedOpponent = false;
        if (newPosition.type === 'track') {
            const targetCoords = TRACK_PATH_CELLS.find(p => p.index === newPosition.index)?.cell;
            if (targetCoords) {
                const isSafe = SAFE_ZONE_TRACK_INDICES.includes(newPosition.index);
                if (!isSafe) {
                    const opponentPiecesOnTarget = pieces.filter(p =>
                        p.playerId !== piece.playerId && // Different player
                        p.position.type === 'track' &&
                        p.position.index === newPosition.index
                    );
                    // Simple rule: capture if exactly one opponent piece is there
                    if (opponentPiecesOnTarget.length === 1) {
                        const pieceToCapture = opponentPiecesOnTarget[0];
                        console.log(`Capturing ${pieceToCapture.id}!`);
                        pieceToCapture.position = { type: 'yard', index: getYardIndex(pieceToCapture) }; // Find next available yard slot
                        positionPiece(pieceToCapture); // Move captured piece visually
                        capturedOpponent = true;
                        setMessage(`Captured ${pieceToCapture.color} piece!`);
                    }
                    // Optional: Handle blockades (if landing on 2+ opponents) - maybe invalid move
                }
            }
        }

        // Update piece's logical position
        piece.position = newPosition;
        // Update piece's visual position
        positionPiece(piece);

        // --- Check Win Condition ---
        if (newPosition.type === 'finished') {
            if (checkWinCondition(piece.playerId)) {
                setMessage(`Player ${piece.color} Wins!`);
                gameState = 'gameover';
                rollDiceBtn.disabled = true;
                // TODO: Show proper game over screen/message
                alert(`Player ${piece.color} Wins!`);
                return; // End game
            }
        }

        // --- Handle Next Turn ---
        // Get another turn if: rolled 6 OR captured OR reached home (finished)
        if (sixRolled || capturedOpponent || newPosition.type === 'finished') {
            setMessage(`Rolled ${currentDiceValue}. Move again!`);
            gameState = 'rolling'; // Allow rolling again
            consecutiveSixes = sixRolled ? consecutiveSixes : 0; // Reset if turn was due to capture/finish
            clearHighlights(); // Should be cleared already, but just in case
            // AI needs to roll again, humans get button enabled
            if (activePlayers[currentPlayerIndex].isAI) {
                setTimeout(runAI, 500);
            } else {
                rollDiceBtn.disabled = false;
            }
        } else {
            nextTurn();
        }
    }

    function getYardIndex(piece) {
        // Find the index of this piece within its player's pieces
        const playerPieces = pieces.filter(p => p.playerId === piece.playerId);
        // Find first available yard slot (simple version assumes piece index maps to yard index)
        // A more robust version would check current yard positions
        const originalIndex = parseInt(piece.id.split('-')[2]); // piece-0, piece-1 etc.
        return originalIndex;
    }

    function checkWinCondition(playerId) {
        const playerPieces = pieces.filter(p => p.playerId === playerId);
        return playerPieces.every(p => p.position.type === 'finished');
    }

    function nextTurn() {
        currentPlayerIndex = (currentPlayerIndex + 1) % activePlayers.length;
        // TODO: Skip players who have already won/finished

        updatePlayerInfo();
        setMessage(`Player ${activePlayers[currentPlayerIndex].color}'s turn. Roll the dice!`);
        gameState = 'rolling';
        currentDiceValue = 0;
        diceElement.textContent = '?';
        sixRolled = false;
        consecutiveSixes = 0;
        clearHighlights();

        // Enable/Disable button based on AI
        rollDiceBtn.disabled = activePlayers[currentPlayerIndex].isAI;

        if (activePlayers[currentPlayerIndex].isAI) {
            setTimeout(runAI, 1000); // AI takes its turn after a short delay
        }
    }


    // --- UI & Helper Functions ---

    function updatePlayerInfo() {
        const player = activePlayers[currentPlayerIndex];
        currentPlayerColorEl.style.backgroundColor = player.color;
        currentPlayerNameEl.textContent = player.isAI ? 'AI' : player.name;
    }

    function setMessage(msg) {
        messageArea.textContent = msg;
    }

    function highlightSelectablePieces() {
        clearHighlights();
        const possibleMoves = getPossibleMoves(activePlayers[currentPlayerIndex].id, currentDiceValue);
        possibleMoves.forEach(move => {
            move.piece.element.classList.add('selectable');
        });
        // console.log("Selectable moves:", possibleMoves);
    }

    function clearHighlights() {
        pieces.forEach(p => p.element.classList.remove('selectable'));
    }

    function initGame() {
        const selectedCount = parseInt(playerCountSelect.value);
        activePlayers = PLAYERS.slice(0, selectedCount);

        // Assign AI if 1 player selected
        if (selectedCount === 1) {
            // Add AI players (e.g., Green, Yellow, Blue)
            activePlayers.push({ ...PLAYERS[1], isAI: true, name: 'AI Green' });
            activePlayers.push({ ...PLAYERS[2], isAI: true, name: 'AI Yellow' });
            activePlayers.push({ ...PLAYERS[3], isAI: true, name: 'AI Blue' });
        } else {
            // Mark players beyond selectedCount as inactive if needed, or just use the slice
            // For simplicity, assume players array only contains active ones for now
        }

        setupScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');

        createBoard();
        createPieces(); // Creates and positions pieces in yards

        currentPlayerIndex = 0; // Start with player 1 (Red)
        gameState = 'rolling';
        updatePlayerInfo();
        setMessage(`Player ${activePlayers[0].color}'s turn. Roll the dice!`);
        rollDiceBtn.disabled = false;
        if (activePlayers[0].isAI) { // If player 1 is AI (unlikely setup, but possible)
            rollDiceBtn.disabled = true;
            setTimeout(runAI, 1000);
        }
    }


    // --- AI Logic (Very Basic) ---
    function runAI() {
        if (gameState !== 'rolling' && gameState !== 'moving') return; // Should only act on its turn

        if (gameState === 'rolling') {
            // AI rolls the dice
            console.log(`AI (${activePlayers[currentPlayerIndex].color}) is rolling...`);
            rollDice(); // This function already handles state changes and calls AI again if moves exist
        } else if (gameState === 'moving') {
            // AI selects a piece to move
            console.log(`AI (${activePlayers[currentPlayerIndex].color}) is choosing a move for dice ${currentDiceValue}...`);
            const possibleMoves = getPossibleMoves(activePlayers[currentPlayerIndex].id, currentDiceValue);

            if (possibleMoves.length > 0) {
                // --- Simple AI Strategy ---
                let chosenMove = null;

                // 1. Prioritize getting out of yard with a 6
                if (currentDiceValue === 6) {
                    const yardPieceMove = possibleMoves.find(m => m.piece.position.type === 'yard');
                    if (yardPieceMove) {
                        chosenMove = yardPieceMove;
                    }
                }

                // 2. Prioritize capturing (if not chosen yet)
                if (!chosenMove) {
                    for (const move of possibleMoves) {
                        if (move.newPosition.type === 'track') {
                            const targetIndex = move.newPosition.index;
                            const isSafe = SAFE_ZONE_TRACK_INDICES.includes(targetIndex);
                            if (!isSafe) {
                                const opponentsOnTarget = pieces.filter(p =>
                                    p.playerId !== activePlayers[currentPlayerIndex].id &&
                                    p.position.type === 'track' &&
                                    p.position.index === targetIndex
                                );
                                if (opponentsOnTarget.length === 1) {
                                    chosenMove = move;
                                    console.log("AI chooses to capture!");
                                    break;
                                }
                            }
                        }
                    }
                }


                // 3. Prioritize finishing a piece (if not chosen yet)
                if (!chosenMove) {
                    const finishingMove = possibleMoves.find(m => m.newPosition.type === 'finished');
                    if (finishingMove) {
                        chosenMove = finishingMove;
                        console.log("AI chooses to finish a piece!");
                    }
                }


                // 4. Move piece closest to home (simple distance) (if not chosen yet)
                // TODO: Calculate distance properly based on track/home path

                // 5. Default: Move the first possible piece (if still not chosen)
                if (!chosenMove) {
                    chosenMove = possibleMoves[0]; // Just take the first available move
                    console.log("AI chooses default move (first available).");
                }

                // Execute the chosen move after a short delay
                setTimeout(() => {
                    executeMove(chosenMove.piece, chosenMove.newPosition);
                }, 500); // Delay for move visibility

            } else {
                // This case should be handled by rollDice logic (no moves)
                console.error("AI in moving state but no possible moves found?");
                // If it was a 6, AI should roll again, otherwise turn should pass.
                // The rollDice function handles the transition back to rolling or next turn.
            }
        }
    }


    // --- Event Listeners ---
    startGameBtn.addEventListener('click', initGame);
    rollDiceBtn.addEventListener('click', rollDice);
    resetGameBtn.addEventListener('click', () => {
        // Simple reset: reload the page or hide game and show setup
        gameScreen.classList.add('hidden');
        setupScreen.classList.remove('hidden');
        // Or more complex state reset if needed without reload
        // resetGameState(); // Would need a function to clear all state variables
        window.location.reload(); // Easiest way to reset fully
    });

}); // End DOMContentLoaded