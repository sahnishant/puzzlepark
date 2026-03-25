document.addEventListener('DOMContentLoaded', () => {
    const gameOutput = document.getElementById('game-output');
    const animationOutput = document.getElementById('animation-output'); // Get the new div
    const userInput = document.getElementById('user-input');
    const submitButton = document.getElementById('submit-button');
    const hintButton = document.getElementById('hint-button');
    const resetButton = document.getElementById('reset-button');

    // --- ASCII Art Definitions ---
    // Keep your existing 'art' object with static art definitions
    const art = {
        plane: `✈️✈️✈️✈️✈️✈️✈️✈️✈️✈️✈️`,
        train: `
     ----       _____________
    | O |_____//___________\\ \\__________
    |   |-----/ ---         \\ \\        |
    |   | \\ O \\   ___         \\ \\_______|
   =|=|=|=[ ]-[ ]-| - |--------[ ]-----[ ]-=
  /o"o"o"o"o"o"o"o"o"o"o"o"o"o"o"o"o"o"o"o"o\\
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        `, // Adjusted train art slightly
        boat: `
            |\\             ~
           /|.\\         ~~
          / |. \\      ~~~
         /  | . \\   ~~~~
        |___|__.-\`\\~~~~~
        | . . . . . \\_________
        \\ . . . . . . . . . ./
         \\_______________/ ~~~
          \`-------------  ~~
                🚢 Sailing...
        `,
         museum: `
           /\\
          //\\\\
         //__\\\\        🏛️
        //____\\\\
        ||-----||
        || [_] ||
        =========
        `,
        windmills: `
           |         |
         \\-| windmills/- \\-| /-- <--Spin?
          \\|/       \\|/
          [ ]       [ ]
         /___\\     /___\\   🌷🌷
        `,
        rio: `
             .--""--.
            /        \\
           |  O    O  |   ☀️
           \\   (_     /
            \\   _   /
           __'.(_).'__
        ," /   '''   \\ ",
       /../           \\..\\
      /../             \\..\\
     '--'               '--'
        (Christ the Redeemer)
        `,
        tokyo_skyline: `
      🗼🗼🗼🗼🗼🗼🗼🗼🗼🗼🗼🗼🗼🗼🗼
        🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸
        (Tokyo Tower & Cherry Blossom)
        `,
        singapore_gardens: `
         .-'-.     .-'-.      🌳
       .'=---= '. .=---= '.
      / Gardens \\/ By The \\  🦁
     |  Bay      |  Merlion |
      \\.-.-./    \\.-.-./
           \\ | /    \\ | /
            \\|/      \\|/
             Y        Y
            [ ]      [ ]
           (Supertrees & Merlion)
        `,
        nyc_skyline: `
        |~|    |~~|    |~|    |~|    |~| 🗽
        |=|    |==|    |=|    |=|    |=| 🍎
       || ||  ||  ||  || ||  || ||  || ||
       ||_||  ||__||  ||_||  ||_||  ||_||
     =====================================
           (Skyscrapers, Liberty, Apple)
        `,
        confrontation: `
          You         Silas
           O             O       <-- Gotcha!
          /|\\           /|\\      💎 <-- Diamond
         / | \\         / | \\
        -------[POLICE]-------
           \\ /           \\ /
            |             |
           / \\           / \\
           Times Square Takedown!
        `
    };


    // --- Game Data (Minor changes may be needed if art changed) ---
    // Keep your existing 'levels' array, ensure 'travelMethod' is correct
    const levels = [
        // Level 0 - London to Amsterdam
        {
            location: "London, UK",
            mission: "Investigate the museum heist.",
            clue: "The display case... windmills and tulips.",
            hint: "Think about... tulips are famously associated.",
            answer: "amsterdam",
            travelMethod: 'train',
            locationArt: art.museum, // Start with museum view
            arrivalMessage: "You arrive at Amsterdam Centraal Station. The scent of canals and freedom is in the air." // More specific arrival
        },
        // Level 1 - Amsterdam to Paris
        {
            location: "Amsterdam, Netherlands",
            mission: "Search for Silas's trail.",
            clue: "A canal boat operator... 'going to see Mona'...",
            hint: "Which famous museum houses the Mona Lisa?",
            answer: "paris",
            travelMethod: 'plane',
            locationArt: art.windmills, // Show windmills on arrival
            arrivalMessage: "Touchdown in Paris! The Eiffel Tower glints in the distance. Time to check near the Louvre."
        },
         // Level 2 - Paris to Venice
        {
            location: "Paris, France",
            mission: "Investigate near the Louvre.",
            clue: "Security near the Louvre... 'city of water and masks.'...",
            hint: "Which Italian city is famous for canals, gondolas, masks...?",
            answer: "venice",
            travelMethod: 'plane', // Could be train, let's keep plane
            locationArt: art.museum, // Show Louvre again? Or Eiffel Tower ASCII?
            arrivalMessage: "You land in Venice. The air is humid, carrying the sound of water lapping against stone."
        },
        // Level 3 - Venice to Rio
        {
            location: "Venice, Italy",
            mission: "Find Silas in the city of canals.",
            clue: "A nervous gondolier... 'giant stone savior'...",
            hint: "Which major South American city features a massive statue of Christ the Redeemer...?",
            answer: "rio de janeiro",
            travelMethod: 'plane',
            locationArt: art.boat, // Show gondola/boat
            arrivalMessage: "After a long flight, you arrive in Rio! The energy is palpable, Christ the Redeemer watches over the city."
        },
         // Level 4 - Rio to Tokyo
        {
            location: "Rio de Janeiro, Brazil",
            mission: "Track Silas in the vibrant city.",
            clue: "An informant saw Silas... 'order, technology, and maybe some cherry blossoms'...",
            hint: "Which major Asian capital city is known for... cherry blossoms?",
            answer: "tokyo",
            travelMethod: 'plane',
            locationArt: art.rio, // Show Rio statue
            arrivalMessage: "Welcome to Tokyo! The sheer scale of the city, the lights, the sounds – it's overwhelming. Let's find Silas."
        },
        // Level 5 - Tokyo to Singapore
        {
            location: "Tokyo, Japan",
            mission: "Search the bustling metropolis.",
            clue: "You trace Silas to Shinjuku... 'half-lion, half-fish' statue...",
            hint: "Which Southeast Asian island city-state has the Merlion...?",
            answer: "singapore",
            travelMethod: 'plane',
            locationArt: art.tokyo_skyline, // Show Tokyo skyline
            arrivalMessage: "You land in Singapore Changi Airport, known for its efficiency. Time to hunt near the Merlion and Gardens."
        },
        // Level 6 - Singapore to New York
        {
            location: "Singapore",
            mission: "Close in on Silas.",
            clue: "Silas was spotted near Gardens by the Bay... 'Big Apple'...",
            hint: "Which major US city is nicknamed the 'Big Apple'...?",
            answer: "new york",
            travelMethod: 'plane',
            locationArt: art.singapore_gardens, // Show Gardens/Merlion
            arrivalMessage: "The final leg? You arrive at JFK, New York City. The buzz is electric. Intel points to Times Square."
        },
        // Level 7 - New York (Final)
        {
            location: "New York City, USA",
            mission: "Apprehend Silas.",
            clue: "Intel places Silas near Times Square... Your final challenge: Confront him.",
            hint: "You've got him cornered... Type 'confront' or 'apprehend'.",
            answer: ["confront", "apprehend"],
            travelMethod: 'none', // No travel animation needed here
            locationArt: art.nyc_skyline, // Show NYC skyline
            arrivalMessage: "You're in the heart of Times Square. Scan the crowds..." // Message before confrontation input
        }
    ];

    let currentLevelIndex = 0;
    let hintsUsedThisLevel = false;
    let animationInterval = null; // To store the interval ID

    // --- Animation Functions ---

    function clearAnimationOutput() {
        if (animationInterval) {
            clearInterval(animationInterval);
            animationInterval = null;
        }
         // Fade out effect using CSS transition
        const currentArt = animationOutput.querySelector('pre');
        if (currentArt) {
            currentArt.style.opacity = '0';
             // Remove after fade out
            setTimeout(() => {
                if (animationOutput.contains(currentArt)){ // Check if it wasn't cleared already
                     animationOutput.innerHTML = '';
                }
            }, 500); // Match CSS transition duration
        } else {
            animationOutput.innerHTML = ''; // Clear immediately if no element/fade needed
        }
    }

    function animateArt(artString, frames, durationPerFrame, finalCallback) {
        clearAnimationOutput(); // Clear previous animation
        userInput.disabled = true; // Disable input during animation
        submitButton.disabled = true;
        hintButton.disabled = true;

        let currentFrame = 0;
        const artElement = document.createElement('pre');
        animationOutput.appendChild(artElement);

        function nextFrame() {
            const frameContent = typeof frames === 'function' ? frames(currentFrame, artString) : artString; // Allow function-based frames
            artElement.textContent = frameContent;
             artElement.style.opacity = '1'; // Ensure visible

            currentFrame++;
            if (currentFrame >= frames || typeof frames !== 'number') { // Stop if frame count reached or frames is not a number (e.g., function)
                if (currentFrame >= frames && typeof frames === 'number'){ // Only clear interval if frame count is the limit
                     clearInterval(animationInterval);
                     animationInterval = null;
                } else if (typeof frames !== 'number') {
                     // If frames is a function, it must handle its own stopping logic or run indefinitely until cleared
                     // For simplicity here, we will assume function-based animations run for a fixed time or are cleared externally
                }


                // Add a slight delay before fading out and calling callback
                 setTimeout(() => {
                     artElement.style.opacity = '0'; // Start fade out
                     setTimeout(() => {
                         clearAnimationOutput(); // Fully clear after fade
                         userInput.disabled = false; // Re-enable input
                         submitButton.disabled = false;
                         hintButton.disabled = false;
                         if (finalCallback) {
                             finalCallback();
                         }
                     }, 500); // Wait for fade out transition
                }, durationPerFrame * 2); // Wait a bit after last frame

            }
        }

        // Initial frame draw
        nextFrame();

        // Set interval only if 'frames' is a number indicating multiple steps
         if (typeof frames === 'number' && frames > 1) {
            animationInterval = setInterval(nextFrame, durationPerFrame);
         } else if (typeof frames === 'function'){
             // For function-based frame generation, we might need a different timing logic
             // Or rely on the function itself to manage intervals/timeouts if needed.
             // For this example, function based frames will show once and then fade.
             // To make it continuous, the function `frames` would need modification and interval handling.
             // We'll stick to the simple timeout model from above for now.
         } else {
             // If only 1 frame, just use the timeout logic already set up
         }

    }

    // Example: Train Animation (Moves Right)
    function animateTrain(callback) {
        const trainArt = art.train;
        const width = 60; // Width of the animation window
        const totalFrames = width + trainArt.split('\n')[1].length; // Frames to move across screen
        let padding = " ".repeat(width);

        function getTrainFrame(frameIndex) {
            const artLines = trainArt.split('\n');
            let currentPos = frameIndex - Math.floor(trainArt.split('\n')[1].length / 2) ;
             if (currentPos < 0) currentPos = 0;
             if (currentPos > width) currentPos = width; // Cap position

             let result = "";
             artLines.forEach(line => {
                 if (!line.trim()) { // Keep empty lines for spacing
                     result += "\n";
                     return;
                 }
                 let paddedLine = padding + line + padding;
                 // Calculate start index based on frame - move right to left
                 let start = paddedLine.length - width - currentPos;
                 if(start < 0) start = 0;

                 result += paddedLine.substring(start, start + width) + "\n";
             });
             return result;

           // Simplified version (just appears, stays, disappears)
           // return trainArt;
        }

        // Use the frame generation function
        animateArt(null, getTrainFrame, 100, callback); // Adjust duration (100ms)
         // For simpler appear/disappear:
         // animateArt(trainArt, 1, 2000, callback); // Show for 2 seconds
    }


    // Example: Plane Animation (Simpler: Appears, small movement/change, disappears)
    function animatePlane(callback) {
         const planeArt = art.plane;
         const frames = [
            planeArt, // Frame 1
            // Frame 2 (Slightly different maybe, or just pause)
            planeArt.replace('✈️', '슝슝✈️'), // Add whoosh
            // Frame 3 (Back to normal or start fade)
            planeArt
         ];
         let currentFrame = 0;

         function getPlaneFrame() {
             const frame = frames[currentFrame % frames.length];
             currentFrame++;
             return frame;
         }
         // Use the frame function, run for ~3 cycles (adjust frame count/duration)
          animateArt(null, getPlaneFrame, 500, callback); // 500ms per frame, calls callback after ~1.5s + fade
          // For simpler appear/disappear:
          // animateArt(planeArt, 1, 2500, callback); // Show for 2.5 seconds
    }

     // Example: Boat Animation (Bobbing effect)
     function animateBoat(callback) {
        const boatArtBase = art.boat;
        const boatLines = boatArtBase.split('\n');

        function getBoatFrame(frameIndex) {
            // Simple bobbing: alternate between base and slightly shifted version
            if (frameIndex % 2 === 0) {
                return boatArtBase;
            } else {
                // Add a slight vertical shift simulation by adding/removing a top line maybe
                // Or just wiggle the waves
                return boatArtBase.replace(/~/g, (match, offset) => (offset % 3 === 0 ? ' ' : '~')); // Simple wave change
            }
        }

        animateArt(null, getBoatFrame, 600, callback); // 600ms per frame, bobbles a bit
         // For simpler appear/disappear:
         // animateArt(art.boat, 1, 2500, callback); // Show for 2.5 seconds
     }

     // Map travel methods to animation functions
     const travelAnimations = {
         train: animateTrain,
         plane: animatePlane,
         boat: animateBoat,
         none: (callback) => { if(callback) callback(); } // No animation
     };


    // --- Game Logic ---

    function saveProgress() { /* ... keep existing ... */ }
    function loadProgress() { /* ... keep existing ... */ }

    function appendOutput(text, className = '') {
        const p = document.createElement('p');
        // Sanitize text slightly to prevent accidental HTML injection if needed
        p.textContent = text;
        if (className) p.classList.add(className);
        gameOutput.appendChild(p);
        gameOutput.scrollTop = gameOutput.scrollHeight;
    }

    // Static ASCII art display (for locations) - keep using <pre> in main output
     function appendStaticAsciiArt(artString, className = 'ascii-art') {
        if (!artString) return;
        const pre = document.createElement('pre');
        pre.textContent = artString;
        pre.classList.add('ascii-art'); // Base class
        if (className && className !== 'ascii-art') {
             pre.classList.add(className);
        }
        gameOutput.appendChild(pre); // Append to main log
        gameOutput.scrollTop = gameOutput.scrollHeight;
    }


    function displayCurrentLevel() {
        hintsUsedThisLevel = false;
        const level = levels[currentLevelIndex];

        appendOutput(`\n--- Arrived at Level ${currentLevelIndex + 1} ---`);
        appendOutput(`Location: ${level.location}`, 'location');

        // Display static location art in the main log
        if (level.locationArt) {
             appendStaticAsciiArt(level.locationArt, 'location-art');
        }

        appendOutput(`Mission: ${level.mission}`);
        appendOutput(`\n${level.clue}`, 'clue');
        appendOutput("\nWhat's your next move, Detective?");
        userInput.value = '';
        // Ensure input is enabled (might have been disabled by animation)
        userInput.disabled = false;
        submitButton.disabled = false;
        hintButton.disabled = false;
        userInput.focus();
    }

    function processInput() {
        const input = userInput.value.trim().toLowerCase();
        if (!input || userInput.disabled) return; // Ignore if disabled

        appendOutput(`\n> ${userInput.value}`, 'user-input-log');

        const currentLevel = levels[currentLevelIndex];
        const expectedAnswer = currentLevel.answer;

        let isCorrect = false;
        if (Array.isArray(expectedAnswer)) {
            isCorrect = expectedAnswer.includes(input);
        } else {
            isCorrect = (input === expectedAnswer);
        }

        if (input === 'hint') {
            provideHint();
             userInput.value = ''; // Clear input after hint
        } else if (isCorrect) {
            // Correct Answer - Trigger Animation & Level Advance
            const travelMethod = currentLevel.travelMethod;
            const animationFunction = travelAnimations[travelMethod] || travelAnimations.none;

            // The callback function to run AFTER the animation finishes
            const afterAnimationCallback = () => {
                // Append the arrival message AFTER animation
                appendOutput(currentLevel.arrivalMessage, 'success-message');

                currentLevelIndex++;
                saveProgress();

                if (currentLevelIndex < levels.length) {
                    // Display the *next* level's details
                    displayCurrentLevel();
                } else {
                    // Game Won
                    appendOutput("\n--- CASE CLOSED ---", 'success-message');
                    appendStaticAsciiArt(art.confrontation); // Show final scene in main log
                    appendOutput("You corner Silas... Excellent work, Detective.");
                    appendOutput("You have successfully completed the game!");
                    userInput.disabled = true;
                    submitButton.disabled = true;
                    hintButton.disabled = true;
                     clearAnimationOutput(); // Clear animation area on win
                }
            };

             // Start the animation, passing the callback
             appendOutput("On the move...", "system-message"); // Indicate travel is starting
             userInput.value = ''; // Clear input field now
             animationFunction(afterAnimationCallback);


        } else {
            appendOutput("That doesn't seem right. Check the clues again or try 'Hint'. 🤔", 'system-message');
             userInput.value = ''; // Clear input on wrong answer
        }

         // Don't clear input here if animation is running, it's cleared before animation starts or on wrong answer/hint
         // userInput.focus(); // Focus might be weird during animation, let displayCurrentLevel handle it
    }

    function provideHint() { /* ... keep existing ... */
        if (hintsUsedThisLevel) {
             appendOutput("You already received a hint for this location.", 'system-message');
             return;
        }
        const hint = levels[currentLevelIndex].hint;
        if (hint) {
            appendOutput(`Hint: ${hint}`, 'hint-text');
            hintsUsedThisLevel = true;
        } else {
            appendOutput("No specific hint available for this stage.", 'system-message');
        }
         userInput.focus();
     }

     function resetGame() { /* ... keep existing ... */
        if (confirm("Are you sure you want to reset the game? Your progress will be lost.")) {
             clearAnimationOutput(); // Clear animation on reset
             localStorage.removeItem('detectiveGameState');
             currentLevelIndex = 0;
             gameOutput.innerHTML = ''; // Clear the main log
             appendOutput("Game reset. Starting over.");
             startGame();
         }
      }

    function startGame() {
        appendOutput("Welcome to Detective Chase: The Serpent's Eye.");
        appendOutput("An international art thief, 'Silas', has stolen the priceless Serpent's Eye Diamond.");
        appendOutput("Your mission: Track him down using the clues he leaves behind.");

        clearAnimationOutput(); // Ensure animation area is clear on start

        if (!loadProgress()) {
             currentLevelIndex = 0;
             appendOutput("Starting new game...");
             displayCurrentLevel(); // Display level 0 directly
        } else {
             appendOutput(`Resuming game from Level ${currentLevelIndex + 1}...`, 'success-message');
             // Check if the game was saved in the "won" state
             if (currentLevelIndex >= levels.length) {
                 // Already won - show end screen directly
                 appendOutput("\n--- CASE CLOSED ---", 'success-message');
                 appendStaticAsciiArt(art.confrontation);
                 appendOutput("You corner Silas... Excellent work, Detective.");
                 appendOutput("You have successfully completed the game!");
                 userInput.disabled = true;
                 submitButton.disabled = true;
                 hintButton.disabled = true;
             } else {
                 // Resume normally
                 displayCurrentLevel();
             }
        }
    }

    // --- Event Listeners ---
    submitButton.addEventListener('click', processInput);
    hintButton.addEventListener('click', provideHint);
    resetButton.addEventListener('click', resetGame);
    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            processInput();
        }
    });

    // --- Start Game ---
    startGame();

});