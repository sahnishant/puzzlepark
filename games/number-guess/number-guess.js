let secretNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;
const gameContainer = document.getElementById('game-container');
 const messageContainer = document.getElementById('message');

 function displayMessage(message) {
     messageContainer.textContent = message;
}


     const input = document.createElement('input');
     input.type = 'number';
     input.min = 1;
     input.max = 100;
     const guessButton = document.createElement('button');
     guessButton.textContent = 'Guess';

     gameContainer.appendChild(input);
     gameContainer.appendChild(guessButton);

     guessButton.addEventListener('click', () => {
         const guess = parseInt(input.value);
         attempts++;

         if (isNaN(guess) || guess < 1 || guess > 100) {
             displayMessage("Please enter a valid number between 1 and 100.");
         } else if (guess === secretNumber) {
             displayMessage(`Congratulations! You guessed the number in ${attempts} attempts.`);
              resetButton();
         } else if (guess < secretNumber) {
             displayMessage("Too low! Guess higher.");
         } else {
             displayMessage("Too high! Guess lower.");
         }
         input.value = '';
     });

    function resetButton() {
     const button = document.createElement('button')
      button.textContent = 'Play Again'
      button.addEventListener('click', () => resetGame())
     gameContainer.appendChild(button);
    }
  function resetGame() {
     secretNumber = Math.floor(Math.random() * 100) + 1;
      attempts = 0;
      gameContainer.innerHTML = '';
      displayMessage('');
       loadNumberGuessingGame();
    }