const words = [
    "javascript", "html", "css", "developer", "website", "browser", "function", "variable", "array", "object",
    "programming", "algorithm", "framework", "database", "frontend", "backend", "debugging", "iteration", "recursion",
    "syntax", "compiler", "interpreter", "virtual", "hosting", "responsive", "design", "network", "protocol", "server",
    "client", "authentication", "authorization", "encryption", "decryption", "session", "cookie", "cache", "rendering",
    "optimization", "performance", "scalability", "usability", "accessibility", "integration", "deployment", "testing",
    "automation", "version", "control", "repository", "branch", "merge", "commit", "push", "pull", "clone", "fork",
    "issue", "bug", "feature", "release", "sprint", "agile", "scrum", "kanban", "waterfall", "iteration", "loop",
    "condition", "boolean", "integer", "string", "float", "double", "arraylist", "dictionary", "hashmap", "stack",
    "queue", "binary", "tree", "graph", "node", "edge", "vertex", "weight", "path", "cycle", "directed", "undirected",
    "sorting", "searching", "bubble", "merge", "quick", "heap", "insertion", "selection", "linear", "binary", "hashing",
    "encryption", "security", "firewall", "malware", "phishing", "ransomware", "trojan", "worm", "spyware", "adware"
];

let currentWord = "";
let scrambledWord = "";
let correctAnswers = 0;
let totalQuestions = 0;
let totalTime = 0;
let startTime = 0;

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
    startTime = Date.now(); // Start the timer for the new word
    totalQuestions++;
    updateScoreboard();
}

function updateScoreboard() {
    document.getElementById('correct-answers').textContent = correctAnswers;
    document.getElementById('total-questions').textContent = totalQuestions;
    document.getElementById('total-time').textContent = Math.floor(totalTime / 1000); // Convert ms to seconds
    document.getElementById('time-per-answer').textContent = totalQuestions > 0
        ? (totalTime / totalQuestions / 1000).toFixed(2) // Average time in seconds
        : 0;
}

document.getElementById('submit-btn').addEventListener('click', function() {
    const userGuess = document.getElementById('user-input').value.toLowerCase();
    const resultElement = document.getElementById('result');
    const timeTaken = Date.now() - startTime; // Calculate time taken for this word
    totalTime += timeTaken;

    if (userGuess === currentWord) {
        resultElement.textContent = "Correct! Well done!";
        resultElement.classList.remove('incorrect');
        resultElement.classList.add('correct');
        correctAnswers++;
        setTimeout(newWord, 1500);
    } else {
        resultElement.textContent = "Incorrect. Try again!";
        resultElement.classList.remove('correct');
        resultElement.classList.add('incorrect');
    }

    updateScoreboard();
});

// Trigger submit on Enter key press
document.getElementById('user-input').addEventListener('keypress', function(event) {
    if (event.key === "Enter") {
        document.getElementById('submit-btn').click();
    }
});

// Function to handle "Give Up" button click
document.getElementById('give-up-btn').addEventListener('click', function() {
    const resultElement = document.getElementById('result');
    resultElement.textContent = `The correct answer was: ${currentWord}`;
    resultElement.classList.remove('correct', 'incorrect');
    resultElement.classList.add('give-up');
    totalTime += Date.now() - startTime; // Add time taken before giving up
    setTimeout(newWord, 2000); // Show the answer briefly, then load a new word
    updateScoreboard();
});

// Initialize the game with a new word
newWord();