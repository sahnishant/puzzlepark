
document.addEventListener('DOMContentLoaded', () => {
    const keyboardLayout = [
        // Row 1: Numbers and Symbols
        ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace'],
        // Row 2: QWERTY
        ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash'],
        // Row 3: ASDF (Home Row)
        ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter'],
        // Row 4: ZXCV
        ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ShiftRight'],
        // Row 5: Bottom Row
        ['ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'MetaRight', 'ControlRight'] // Simplified, add Fn/Menu if needed
    ];

    // Maps KeyboardEvent.code to the displayed character(s) on the key
    const keyMap = {
        Backquote: ['`', '~'], Digit1: ['1', '!'], Digit2: ['2', '@'], Digit3: ['3', '#'], Digit4: ['4', '$'], Digit5: ['5', '%'],
        Digit6: ['6', '^'], Digit7: ['7', '&'], Digit8: ['8', '*'], Digit9: ['9', '('], Digit0: ['0', ')'], Minus: ['-', '_'], Equal: ['=', '+'],
        Backspace: 'Backspace', Tab: 'Tab', KeyQ: 'q', KeyW: 'w', KeyE: 'e', KeyR: 'r', KeyT: 't', KeyY: 'y', KeyU: 'u', KeyI: 'i', KeyO: 'o', KeyP: 'p',
        BracketLeft: ['[', '{'], BracketRight: [']', '}'], Backslash: ['\\', '|'], CapsLock: 'CapsLock', KeyA: 'a', KeyS: 's', KeyD: 'd',
        KeyF: 'f', KeyG: 'g', KeyH: 'h', KeyJ: 'j', KeyK: 'k', KeyL: 'l', Semicolon: [';', ':'], Quote: ["'", '"'], Enter: 'Enter',
        ShiftLeft: 'Shift', KeyZ: 'z', KeyX: 'x', KeyC: 'c', KeyV: 'v', KeyB: 'b', KeyN: 'n', KeyM: 'm', Comma: [',', '<'], Period: ['.', '>'],
        Slash: ['/', '?'], ShiftRight: 'Shift', ControlLeft: 'Ctrl', MetaLeft: 'Win', AltLeft: 'Alt', Space: ' ', AltRight: 'Alt',
        MetaRight: 'Win', ControlRight: 'Ctrl'
        // Note: This map assumes US QWERTY layout for display purposes.
        // Handling actual typed character relies on event.key
    };

      const fingerMap = {
        // Left Hand (Based on standard touch typing)
        Backquote: 'l-pinky', Digit1: 'l-pinky', KeyQ: 'l-pinky', KeyA: 'l-pinky', KeyZ: 'l-pinky', ShiftLeft: 'l-pinky', ControlLeft: 'l-pinky', MetaLeft: 'l-pinky',
        Digit2: 'l-ring', KeyW: 'l-ring', KeyS: 'l-ring', KeyX: 'l-ring',
        Digit3: 'l-middle', KeyE: 'l-middle', KeyD: 'l-middle', KeyC: 'l-middle',
        Digit4: 'l-index', KeyR: 'l-index', KeyF: 'l-index', KeyV: 'l-index',
        Digit5: 'l-index', KeyT: 'l-index', KeyG: 'l-index', KeyB: 'l-index',
        AltLeft: 'l-thumb', // Often thumb or palm area

        // Right Hand
        Digit6: 'r-index', KeyY: 'r-index', KeyH: 'r-index', KeyN: 'r-index',
        Digit7: 'r-index', KeyU: 'r-index', KeyJ: 'r-index', KeyM: 'r-index',
        Digit8: 'r-middle', KeyI: 'r-middle', KeyK: 'r-middle', Comma: 'r-middle',
        Digit9: 'r-ring', KeyO: 'r-ring', KeyL: 'r-ring', Period: 'r-ring',
        Digit0: 'r-pinky', KeyP: 'r-pinky', Semicolon: 'r-pinky', Slash: 'r-pinky',
        Minus: 'r-pinky', BracketLeft: 'r-pinky', Quote: 'r-pinky', ShiftRight: 'r-pinky',
        Equal: 'r-pinky', BracketRight: 'r-pinky', Backslash: 'r-pinky', Enter: 'r-pinky', ControlRight: 'r-pinky', MetaRight: 'r-pinky', AltRight: 'r-thumb',

        // Thumbs
        Space: 'thumb' // Could be left or right, 'thumb' is generic
        // Note: Backspace is often right pinky, Tab left pinky, CapsLock left pinky
    };
     // Add keys often handled by specific fingers
     fingerMap.Backspace = fingerMap.Equal; // Typically R Pinky
     fingerMap.Tab = fingerMap.KeyQ; // Typically L Pinky
     fingerMap.CapsLock = fingerMap.KeyA; // Typically L Pinky


    const levels = [
        { name: "Home Row: F, J", text: "fj fj fj ff jj fjf jfj" },
        { name: "Home Row: D, K", text: "dk dk dk dd kk dkd kdk" },
        { name: "Home Row: S, L", text: "sl sl sl ss ll sls lsl" },
        { name: "Home Row: A, ;", text: "a; a; a; aa ;; a;a ;a;" },
        { name: "Home Row: ASDF JKL;", text: "asdf jkl; asdf jkl; fjdksla;" },
        { name: "Home Row Practice", text: "a sad lad asks; a flask falls;" },
        { name: "Home Row + G, H", text: "gh gh hg hg fg jh fg jh ;had gall" },
        { name: "Top Row: R, U", text: "ru ru ur ur rr uu fur jur rug fur" },
        { name: "Top Row: E, I", text: "ei ei ie ie ee ii die lie ski rid" },
        { name: "Top Row: W, O", text: "wo wo ow ow ww oo low sow owl wow" },
        { name: "Top Row: Q, P", text: "qp qp pq pq qq pp lap sap q" }, // 'q' often alone initially
        { name: "Top Row: T, Y", text: "ty ty yt yt tt yy try sty yet art" },
        { name: "Top Row Practice", text: " R", text: "the yurt; quit waste; plot rest" },
        { name: "Bottom Row: V, M", text: "vm vm mv mv vv mm van map vim" },
        { name: "Bottom Row: C, ,", text: "c, c, ,c ,c cc ,, call acid, cool," },
        { name: "Bottom Row: X, .", text: "x. x. .x .x xx .. exit flex. ax." },
        { name: "Bottom Row: Z, /", text: "z/ z/ /z /z zz // zip fuzz/ zoo/" },
        { name: "Bottom Row: B, N", text: "bn bn nb nb bb nn ban nab bin bun" },
        { name: "Bottom Row Practice", text: "vexkaz; b/m. ,ncxצב/z nmb," }, // Mix
        { name: "Numbers: 1, 0", text: "10 10 01 01 11 00 f1j0 f1j0" },
        { name: "Numbers: 2, 9", text: "29 29 92 92 22 99 d2k9 d2k9" },
        { name: "Numbers: 3, 8", text: "38 38 83 83 33 88 e3i8 e3i8" },
        { name: "Numbers: 4, 7", text: "47 47 74 74 44 77 r4j7 r4j7" },
        { name: "Numbers: 5, 6", text: "56 56 65 65 55 66 f5h6 f5h6" },
        { name: "Number Row Practice", text: "12345 67890 10 98 76 54 32 1" },
        { name: "Shift Key Practice", text: "The Quick Brown Fox Jumps Over The Lazy Dog." },
        { name: "Punctuation Practice", text: "He asked, \"Really?\" Yes! It costs $5. (Or maybe ~6?)"},
        { name: "Sentence Practice 1", text: "Pack my box with five dozen liquor jugs." },
        { name: "Sentence Practice 2", text: "How quickly daft jumping zebras vex." },
        { name: "Longer Text", text: "Learning to type quickly and accurately is a valuable skill in the modern world. Practice regularly and focus on technique over speed initially."}
        // Add more levels as needed
    ];

    const keyboardElement = document.getElementById('keyboard');
    const textToTypeElement = document.getElementById('text-to-type');
    const levelListElement = document.getElementById('level-list');
    const levelNumberElement = document.getElementById('level-number');
    const levelNameElement = document.getElementById('level-name');
    const fingerIndicatorElement = document.getElementById('finger-indicator');
    const fingerGuideInfoElement = document.getElementById('finger-guide-info');
     const resetProgressButton = document.getElementById('reset-progress');


    let currentLevelIndex = 0;
    let currentCharIndex = 0;
    let maxLevelReached = 0; // Highest level *completed* + 1 (so index of next available level)
    let keyElements = {}; // Store references to key DOM elements by code

    function generateKeyboard() {
        keyboardElement.innerHTML = ''; // Clear existing
        keyElements = {}; // Reset map

        keyboardLayout.forEach(rowCodes => {
            const rowElement = document.createElement('div');
            rowElement.classList.add('keyboard-row');
            rowCodes.forEach(code => {
                const keyElement = document.createElement('div');
                keyElement.classList.add('key');
                keyElement.dataset.code = code; // Store the KeyboardEvent.code

                let displayChars = keyMap[code] || '';
                let primaryChar = '';
                 let keyText = '';

                 if (typeof displayChars === 'string') {
                     primaryChar = displayChars.length === 1 ? displayChars : ''; // Store 'f' but not 'Shift'
                     keyText = displayChars; // Like 'Shift', 'Enter', 'Tab', 'a', '1'
                     if (primaryChar === primaryChar.toLowerCase() && primaryChar !== ' ') {
                         keyElement.classList.add('lowercase'); // Style lowercase keys differently if needed
                     }

                 } else if (Array.isArray(displayChars)) {
                     // For keys with shifted characters like ['1', '!']
                     primaryChar = displayChars[0]; // The non-shifted character
                      // Display both chars, shift char on top
                      keyText = `<span>${displayChars[1]}</span><span>${displayChars[0]}</span>`;
                       keyElement.classList.add('dual-char'); // Add class for specific styling if needed
                 }


                keyElement.innerHTML = keyText; // Set display text

                // Add classes for specific key styling (width)
                const lowerCode = code.toLowerCase();
                if (lowerCode.includes('shift')) keyElement.classList.add('shift');
                if (lowerCode.includes('tab')) keyElement.classList.add('tab');
                if (lowerCode.includes('backspace')) keyElement.classList.add('backspace', 'delete'); // common naming
                if (lowerCode.includes('caps')) keyElement.classList.add('capslock');
                if (lowerCode.includes('enter')) keyElement.classList.add('return'); // common naming
                if (lowerCode.includes('space')) keyElement.classList.add('space');
                if (lowerCode.includes('control')) keyElement.classList.add('ctrl');
                if (lowerCode.includes('alt')) keyElement.classList.add('alt');
                if (lowerCode.includes('meta')) keyElement.classList.add('win'); // Windows/Command key
                 if (lowerCode.includes('backslash')) keyElement.classList.add('backslash');


                // Add finger guide element inside the key
                const finger = fingerMap[code];
                if (finger) {
                    const fingerGuide = document.createElement('span');
                    fingerGuide.classList.add('finger-guide', `finger-${finger}`);
                    fingerGuide.textContent = finger.replace('-', ' '); // e.g., "l index"
                    keyElement.appendChild(fingerGuide);
                    keyElement.dataset.finger = finger; // Store finger data
                }


                rowElement.appendChild(keyElement);
                keyElements[code] = keyElement; // Map code to element
            });
            keyboardElement.appendChild(rowElement);
        });
    }

    function populateLevelList() {
        levelListElement.innerHTML = '';
        levels.forEach((level, index) => {
            const li = document.createElement('li');
            li.textContent = `Level ${index + 1}: ${level.name}`;
            li.dataset.levelIndex = index;

             if (index === currentLevelIndex) {
                 li.classList.add('active');
             }

            if (index <= maxLevelReached) {
                 li.classList.add('unlocked');
                 li.addEventListener('click', () => {
                    if (index <= maxLevelReached) { // Double check unlock status
                        currentLevelIndex = index;
                        loadLevel();
                    }
                 });
            } else {
                 li.classList.add('locked');
            }
            levelListElement.appendChild(li);
        });
    }

    function saveProgress() {
        localStorage.setItem('typingTutorMaxLevel', maxLevelReached.toString());
    }

    function loadProgress() {
        const savedLevel = localStorage.getItem('typingTutorMaxLevel');
        if (savedLevel !== null) {
            maxLevelReached = parseInt(savedLevel, 10);
        } else {
            maxLevelReached = 0; // Start from the beginning if no saved data
        }
         // Start at the highest *unlocked* level
         currentLevelIndex = maxLevelReached < levels.length ? maxLevelReached : levels.length - 1;
    }

     function resetProgress() {
         if (confirm("Are you sure you want to reset all your progress?")) {
             maxLevelReached = 0;
             currentLevelIndex = 0;
             saveProgress();
             loadLevel(); // Reload the first level
         }
     }

    function updateFingerGuide(char) {
         // Clear previous guides
        Object.values(keyElements).forEach(el => el.classList.remove('show-finger', 'highlight-key'));
        fingerIndicatorElement.textContent = '';
        fingerIndicatorElement.className = 'finger-indicator'; // Reset class
         fingerGuideInfoElement.style.visibility = 'hidden';


        if (!char) return;

        // Find the key code and finger for the *character*
        let targetCode = null;
        let targetFinger = null;
        let needsShift = false;

         // Simple direct mapping first (lowercase/space/numbers)
         for (const code in keyMap) {
             const mapEntry = keyMap[code];
             if (typeof mapEntry === 'string' && mapEntry === char.toLowerCase()) {
                  // Check if the character requires shift (e.g. 'A' vs 'a')
                  if (char !== char.toLowerCase() && char === char.toUpperCase() && char.match(/[A-Z]/)) {
                      needsShift = true;
                  }
                  targetCode = code;
                  break;
             } else if (Array.isArray(mapEntry)) {
                 if (mapEntry[0] === char) { // Non-shifted char (e.g., '1')
                     targetCode = code;
                     break;
                 } else if (mapEntry[1] === char) { // Shifted char (e.g., '!')
                     targetCode = code;
                     needsShift = true;
                     break;
                 }
             } else if (char === ' ' && code === 'Space') {
                 targetCode = code;
                 break;
             }
         }


        if (targetCode) {
            targetFinger = fingerMap[targetCode];
            const keyElement = keyElements[targetCode];
            if (keyElement && targetFinger) {
                keyElement.classList.add('show-finger');
                keyElement.classList.add('highlight-key'); // Highlight the target key too

                fingerIndicatorElement.textContent = targetFinger.replace('-', ' ');
                fingerIndicatorElement.classList.add(`finger-${targetFinger}`);
                 fingerGuideInfoElement.style.visibility = 'visible';

                // Highlight Shift key if needed
                if (needsShift) {
                     // Prefer highlighting the opposite shift key if possible
                     let shiftCodeToHighlight = 'ShiftLeft'; // Default
                     if (targetFinger && targetFinger.startsWith('l-')) {
                          shiftCodeToHighlight = 'ShiftRight'; // Use right shift for left hand keys
                     } else if (targetFinger && targetFinger.startsWith('r-')) {
                         shiftCodeToHighlight = 'ShiftLeft'; // Use left shift for right hand keys
                     }
                     if (keyElements[shiftCodeToHighlight]) {
                         keyElements[shiftCodeToHighlight].classList.add('highlight-key');
                     }
                }
            } else {
                 console.warn(`No key element or finger found for code: ${targetCode}`);
                 fingerGuideInfoElement.style.visibility = 'hidden';
            }
        } else {
             console.warn(`No key code found for character: ${char}`);
             fingerGuideInfoElement.style.visibility = 'hidden';
        }
    }


    function loadLevel() {
        if (currentLevelIndex >= levels.length) {
            textToTypeElement.innerHTML = `<span>Congratulations! You've completed all levels!</span>`;
             levelNumberElement.textContent = levels.length;
             levelNameElement.textContent = "Finished!";
             updateFingerGuide(null); // Clear finger guide
             // Update sidebar immediately
             populateLevelList();
            return;
        }

        const level = levels[currentLevelIndex];
        levelNumberElement.textContent = currentLevelIndex + 1;
        levelNameElement.textContent = level.name;

        // Wrap each character in a span
        textToTypeElement.innerHTML = level.text
            .split('')
            .map(char => `<span>${char}</span>`)
            .join('');

        currentCharIndex = 0;
        highlightCurrentChar();
        updateFingerGuide(level.text[currentCharIndex]);
        populateLevelList(); // Update sidebar highlighting/locks
    }

    function highlightCurrentChar() {
        const spans = textToTypeElement.querySelectorAll('span');
        spans.forEach((span, index) => {
            span.classList.remove('current');
            if (index === currentCharIndex) {
                span.classList.add('current');
            }
        });
    }

    function handleKeyPress(event) {
        const key = event.key;
        const code = event.code;

         // Prevent default browser behavior for space, tab, apostrophe, slash etc.
         if (['Space', 'Tab', 'Quote', 'Slash', 'Backspace'].includes(code) || (key.length === 1 && !event.ctrlKey && !event.metaKey)) {
             event.preventDefault();
         } else if (code === 'CapsLock' || code.includes('Control') || code.includes('Alt') || code.includes('Meta') || code.includes('Shift')) {
              // Don't prevent default for modifier keys themselves, allow system behavior
         }
          else {
              return; // Ignore other keys like F1-F12, Arrows, etc. for typing
          }


        // --- Visual Key Press ---
        const keyElement = keyElements[code];
        if (keyElement) {
             keyElement.classList.add('active');
             // Remove 'active' class after a short delay for visual feedback
             setTimeout(() => keyElement.classList.remove('active'), 100);
        }
         // Handle shift key visual press separately as event.key doesn't report 'Shift'
         if (event.shiftKey) {
             if (keyElements['ShiftLeft']) keyElements['ShiftLeft'].classList.add('active');
             if (keyElements['ShiftRight']) keyElements['ShiftRight'].classList.add('active');
              setTimeout(() => {
                  if (keyElements['ShiftLeft']) keyElements['ShiftLeft'].classList.remove('active');
                  if (keyElements['ShiftRight']) keyElements['ShiftRight'].classList.remove('active');
              }, 100);
         }


        // --- Typing Logic ---
        if (currentLevelIndex >= levels.length) return; // Already finished

        const levelText = levels[currentLevelIndex].text;
        const expectedChar = levelText[currentCharIndex];
        const spans = textToTypeElement.querySelectorAll('span');
        const currentSpan = spans[currentCharIndex];

        if (!currentSpan) return; // Should not happen if logic is correct

        // Special handling for Backspace (optional feature)
        if (code === 'Backspace') {
             // Simple version: just ignore backspace during practice
             // More complex: Allow backspace to correct previous error (would need state)
              console.log("Backspace pressed - currently ignored");
              return;
         }

         // Ignore modifier keys for character matching
         if (key.length > 1 && key !== ' ' && key !== 'Enter') { // Allow Space and Enter (if Enter is in lesson text)
              // Exception: If CapsLock is on and we expect a lowercase letter,
              // event.key might be uppercase. We should probably just match case-insensitively
              // for basic levels, or teach CapsLock explicitly.
               // For now, just ignore non-character keys like Shift, Ctrl, Alt press itself.
             return;
         }


        // Compare typed key with expected character
        if (key === expectedChar) {
            currentSpan.classList.remove('incorrect'); // Remove incorrect if previously marked
            currentSpan.classList.add('correct');
            currentCharIndex++;

            if (currentCharIndex === levelText.length) {
                // Level Complete
                maxLevelReached = Math.max(maxLevelReached, currentLevelIndex + 1);
                saveProgress();
                currentLevelIndex++;
                // Add a small delay before loading next level for visual satisfaction
                setTimeout(loadLevel, 300);
            } else {
                // Move to next character
                highlightCurrentChar();
                updateFingerGuide(levelText[currentCharIndex]);
            }
        } else {
            currentSpan.classList.remove('correct'); // Remove correct if correcting a mistake
            currentSpan.classList.add('incorrect');
             // Optionally add a shake animation or sound here
             // Don't advance currentCharIndex on incorrect key
        }
    }

    // --- Initialization ---
    generateKeyboard();
    loadProgress();
    loadLevel(); // Load the initial or saved level
     resetProgressButton.addEventListener('click', resetProgress);


    // Add the main event listener
    document.addEventListener('keydown', handleKeyPress);

     // Optional: Handle keyup to remove 'active' state definitively,
     // especially for modifier keys if held down.
     document.addEventListener('keyup', (event) => {
         const code = event.code;
         const keyElement = keyElements[code];
         if (keyElement) {
             keyElement.classList.remove('active');
         }
         // Ensure shift highlighting is removed if shift is released
         if (code === 'ShiftLeft' || code === 'ShiftRight') {
            if (!event.shiftKey) { // Check if *any* shift key is still pressed
                if (keyElements['ShiftLeft']) keyElements['ShiftLeft'].classList.remove('active', 'highlight-key');
                if (keyElements['ShiftRight']) keyElements['ShiftRight'].classList.remove('active', 'highlight-key');
                // Re-evaluate finger guide if the target char didn't need shift originally
                if (currentLevelIndex < levels.length && currentCharIndex < levels[currentLevelIndex].text.length) {
                     updateFingerGuide(levels[currentLevelIndex].text[currentCharIndex]);
                 }
            }
         }
     });
});
