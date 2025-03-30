const gameContainer = document.getElementById('game-container')
const messageContainer = document.getElementById('message');

function displayMessage(message) {
    messageContainer.textContent = message;
}
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    let secretCode = [];
    let guesses = [];
     const codeLength = 4;
     const maxGuesses = 10;

    function generateSecretCode() {
        secretCode = [];
        for(let i = 0; i < codeLength; i++) {
            secretCode.push(colors[Math.floor(Math.random() * colors.length)])
        }
        console.log(secretCode); //For debugging
    }

  function createGame() {
     generateSecretCode();
    guesses = []; //Reset the guesses
      renderGame();
  }

    function renderGame() {
       gameContainer.innerHTML = '';
        const gameBoard = document.createElement('div');
       gameBoard.classList.add('mastermind-board')
         renderGuesses(gameBoard) //Render previous guesses
      const guessInput = document.createElement('div');
     guessInput.classList.add('mastermind-input');
       renderColorButtons(guessInput); //Render Input color buttons
        gameContainer.appendChild(gameBoard);
        gameContainer.appendChild(guessInput);
        const button = document.createElement('button')
          button.textContent = 'Submit Guess'
          button.addEventListener('click', submitGuess);
          gameContainer.appendChild(button)
    }

    function renderGuesses(gameBoard) {
       guesses.forEach((guess, guessIndex) => { //Loop through guesses
            const guessRow = document.createElement('div');
            guessRow.classList.add('mastermind-guess-row');
             guess.forEach(color => {
               const colorElement = document.createElement('div');
                colorElement.classList.add('mastermind-color');
                colorElement.style.backgroundColor = color;
              guessRow.appendChild(colorElement);
           });
             const feedback = getFeedback(guess);
             feedback.forEach(type => {
                 const feedbackElement = document.createElement('div');
               feedbackElement.classList.add('mastermind-feedback');
                 feedbackElement.classList.add(type); //Feedback will either be "correct" or "present"
              guessRow.appendChild(feedbackElement);
           })
             gameBoard.appendChild(guessRow)
        })
  }

    function renderColorButtons(guessInput) {
     colors.forEach(color => { //Loop through colors array
            const colorButton = document.createElement('div');
            colorButton.classList.add('mastermind-color-button');
          colorButton.style.backgroundColor = color;
          colorButton.addEventListener('click', () => addToGuess(color))
        guessInput.appendChild(colorButton)
     })
  }

    let currentGuess = []

    function addToGuess(color) {
        if(currentGuess.length < codeLength) { // Only allow codeLength in currentGuess array
          currentGuess.push(color)
       }
     }

   function submitGuess() {
       if(currentGuess.length === codeLength){
            guesses.push([...currentGuess]); // Add current guess to guesses
          if (checkWin(currentGuess)) { // Check if the guess equals the secretCode
               displayMessage('Congratulations! You won the game!');
               resetButton();
           } else if (guesses.length >= maxGuesses) {
                displayMessage('You ran out of guesses. Better luck next time!');
                resetButton();
          } else {
               renderGame(); // Re-render board
              currentGuess = []; // Clear current guess
           }
       } else {
          displayMessage("Please submit a valid guess");
        }
   }

    function getFeedback(guess) {
        const feedback = [];
         const secretCopy = [...secretCode]; // Copy of the secretCode to prevent mutation
          const guessCopy = [...guess]; // Copy of the guess to prevent mutation

        for (let i = 0; i < codeLength; i++) {
           if (guessCopy[i] === secretCopy[i]) {
             feedback.push('correct');
               guessCopy[i] = null; //Mark cell to prevent double counting
             secretCopy[i] = null; //Mark cell to prevent double counting
            }
         }
        for (let i = 0; i < codeLength; i++) {
            if (guessCopy[i] !== null) {
                 const secretIndex = secretCopy.indexOf(guessCopy[i]);
                  if (secretIndex !== -1) {
                    feedback.push('present');
                    secretCopy[secretIndex] = null; // Mark cell to prevent double counting
                }
           }
     }
      return feedback;
    }

   function checkWin(guess) {
      return guess.every((color, index) => color === secretCode[index]);
   }

   function resetButton() {
        const button = document.createElement('button')
         button.textContent = 'Play Again'
        button.addEventListener('click', () => resetGame())
      gameContainer.appendChild(button);
    }

    function resetGame() {
       gameContainer.innerHTML = '';
         displayMessage('');
          createGame();
     }
  createGame();

    const styleTag = document.createElement('style');
   styleTag.textContent = `
   .mastermind-board {
     display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;
  }
  .mastermind-guess-row {
   display: flex;
  gap: 5px;
   align-items: center;
  }
   .mastermind-color {
        width: 30px;
        height: 30px;
         border: 1px solid #ddd;
     }

     .mastermind-feedback {
         width: 10px;
         height: 10px;
          border: 1px solid #ddd;
       }
       .mastermind-feedback.correct {
            background-color: black;
       }
    .mastermind-feedback.present {
       background-color: white;
      }
   .mastermind-input {
      display: flex;
       gap: 5px;
     margin-top: 10px;
   }
  .mastermind-color-button {
        width: 40px;
      height: 40px;
       border: 1px solid #ddd;
        cursor: pointer;
    }
`;

    document.head.appendChild(styleTag);