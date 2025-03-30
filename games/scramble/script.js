const words = ["javascript", "html", "css", "developer", "website", "browser", "function", "variable", "array", "object"];

let currentWord = "";
let scrambledWord = "";

function scrambleWord(word) {
    let wordArray = word.split('');
    for (let i = wordArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
    }
    return wordArray.join('');
}

function newWord() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    scrambledWord = scrambleWord(currentWord);
    document.getElementById('scrambled-word').textContent = scrambledWord;
    document.getElementById('result').textContent = "";
    document.getElementById('user-input').value = "";
}

document.getElementById('submit-btn').addEventListener('click', function() {
    const userGuess = document.getElementById('user-input').value.toLowerCase();
    if (userGuess === currentWord) {
        document.getElementById('result').textContent = "Correct! Well done!";
        setTimeout(newWord, 1500);
    } else {
        document.getElementById('result').textContent = "Incorrect. Try again!";
    }
});

// Initialize the game with a new word
newWord();