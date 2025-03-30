let secretNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;
const pastGuesses = [];

const gameContainer = document.getElementById('game-container');
const messageContainer = document.getElementById('message');
const guessInput = document.getElementById('guess-input');
const guessButton = document.getElementById('guess-button');
const resetButton = document.getElementById('reset-button');
const guessList = document.getElementById('guess-list');

function displayMessage(message) {
  messageContainer.textContent = message;
}

function updateGuessList(guess, feedback) {
  const listItem = document.createElement('li');
  listItem.textContent = `Guess #${attempts}: ${guess} (${feedback})`;
  guessList.appendChild(listItem);
}

function endGame() {
  guessInput.style.display = 'none'; // Hide the input field
  guessButton.style.display = 'none'; // Hide the guess button
  resetButton.style.display = 'block'; // Show the reset button
}

guessButton.addEventListener('click', () => {
  const guess = parseInt(guessInput.value);
  attempts++;

  if (isNaN(guess) || guess < 1 || guess > 100) {
    displayMessage("Please enter a valid number between 1 and 100.");
  } else if (guess === secretNumber) {
    displayMessage(`🎉 Congratulations! You guessed the number in ${attempts} attempts.`);
    updateGuessList(guess, "Correct!");
    endGame(); // Call endGame to hide input and guess button
  } else if (guess < secretNumber) {
    displayMessage("Too low! Guess higher.");
    updateGuessList(guess, "Too low");
  } else {
    displayMessage("Too high! Guess lower.");
    updateGuessList(guess, "Too high");
  }
  guessInput.value = '';
});

resetButton.addEventListener('click', () => {
  secretNumber = Math.floor(Math.random() * 100) + 1;
  attempts = 0;
  pastGuesses.length = 0; // Clear past guesses
  displayMessage('');
  guessInput.value = '';
  guessInput.style.display = 'block'; // Show the input field
  guessButton.style.display = 'block'; // Show the guess button
  resetButton.style.display = 'none'; // Hide the reset button
  guessList.innerHTML = ''; // Clear the guess list
});