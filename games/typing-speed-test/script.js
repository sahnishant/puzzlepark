const paragraph = `java is a versatile programming language used for web development. It allows developers to create interactive and dynamic web pages. HTML and CSS work together with JavaScript to build the structure, style, and functionality of websites. JavaScript frameworks like React, Angular, and Vue are popular for building modern web applications. Learning JavaScript is essential for anyone aspiring to become a web developer. Practice regularly to improve your skills and become proficient in coding.`;

let timeLeft = 120; // 2 minutes
let wordsTyped = 0;
let timerInterval;


const userInputField = document.getElementById('user-input'); // Get reference

function startGame() {
    timeLeft = 120;
    wordsTyped = 0; // Resetting this global variable might be confusing, see checkInput modification

    // Reset scoreboard
    document.getElementById('words-typed').textContent = 0; // Start at 0
    document.getElementById('wpm').textContent = 0;
    document.getElementById('time-left').textContent = timeLeft;

    // Clear and enable/focus input field
    userInputField.value = ''; // Clear previous input
    userInputField.disabled = false; // Enable input
    userInputField.focus(); // Set focus to the input field

    // Display the paragraph as individual letters
    const paragraphLetters = paragraph
        .split('')
        .map(letter => {
            // Keep space handling simple
            return `<span>${letter}</span>`;
        })
        .join('');
    document.getElementById('paragraph-display').innerHTML = paragraphLetters;

    // Start the timer
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('time-left').textContent = timeLeft;
        // Re-calculate WPM every second based on current progress
        updateWPM(); 

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

// Helper function to update WPM (called by timer and checkInput)
function updateWPM() {
    const currentInput = userInputField.value;
    // Count words based on spaces followed by non-space characters or beginning of input
    const typedWordsArray = currentInput.trim().split(/\s+/).filter(word => word !== "");
    const currentWordsTyped = typedWordsArray.length;
    
    document.getElementById('words-typed').textContent = currentWordsTyped; // Update words typed count

    const timeElapsed = 120 - timeLeft; // Calculate elapsed time
    const wpm = timeElapsed > 0 ? Math.round((currentWordsTyped / timeElapsed) * 60) : 0; // Calculate WPM
    document.getElementById('wpm').textContent = wpm; // Update WPM display
}



function checkInput() {
    const userInput = userInputField.value; // Get typed text from the INPUT FIELD
    const paragraphLetters = document.querySelectorAll('#paragraph-display span'); // Get all letter spans

    // Highlight correct and incorrect letters
    paragraphLetters.forEach((letterSpan, index) => {
        const originalLetter = letterSpan.textContent;
        const typedLetter = userInput[index];

        // Reset classes first
        letterSpan.classList.remove('correct', 'incorrect');

        if (typedLetter === undefined) {
            // This part of the paragraph hasn't been typed yet
            letterSpan.classList.remove('correct', 'incorrect');
        } else if (typedLetter === originalLetter) {
            // Correct letter
            letterSpan.classList.add('correct');
        } else {
            // Incorrect letter
            letterSpan.classList.add('incorrect');
            // Optional: Handle space specifically if needed for visual clarity
            // if (originalLetter === ' ') {
            //     letterSpan.style.backgroundColor = '#e74c3c'; // Example: Red background for wrong space
            // }
        }
    });

    // Update WPM and words typed count dynamically on input
    updateWPM(); 
}


function endGame() {
    clearInterval(timerInterval);
    userInputField.disabled = true; // Disable input field

    // Calculate final WPM based on the input field's content
    const finalInput = userInputField.value;
    const finalWordsArray = finalInput.trim().split(/\s+/).filter(word => word !== "");
    const finalWordsTyped = finalWordsArray.length;

    // Use the full duration (120 seconds) for final WPM calculation
    const wpm = Math.round((finalWordsTyped / 120) * 60); 
    
    alert(`Time's up! Your final WPM is ${wpm}`);
    // You could also update the display one last time if needed
    document.getElementById('wpm').textContent = wpm;
    document.getElementById('words-typed').textContent = finalWordsTyped; 
}

// Highlight the key pressed
document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    const keyElement = document.querySelector(`.key[data-key="${key}"]`);
    if (keyElement) {
        keyElement.classList.add('active');
    }
});

document.addEventListener('keyup', (event) => {
    const key = event.key.toLowerCase();
    const keyElement = document.querySelector(`.key[data-key="${key}"]`);
    if (keyElement) {
        keyElement.classList.remove('active');
    }
});

document.getElementById('start-game').addEventListener('click', startGame);
userInputField.addEventListener('input', checkInput);
