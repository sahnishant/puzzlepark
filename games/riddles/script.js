const easyRiddles = [
    {"question": "I fall from the sky and make everything wet. What am I?", "answer": "rain"},
    {"question": "I float on water and have sails. What am I?", "answer": "boat"},
    {"question": "I fly in the sky and have wings. What am I?", "answer": "airplane"},
    {"question": "I have a long neck and spots on my body. What am I?", "answer": "giraffe"},
    {"question": "I have feathers to help me fly, and I’m a bird, but I can’t fly high. What am I?", "answer": "penguin"},
    {"question": "I have two wheels and you can ride me. What am I?", "answer": "bicycle"},
    {"question": "I have wheels and take you to school. What am I?", "answer": "school bus"},
    {"question": "I hop around and carry my babies in a pouch. What am I?", "answer": "kangaroo"},
    {"question": "I’m a holiday in December with presents. What am I?", "answer": "christmas"},
    {"question": "I’m a vegetable that’s orange and rabbits love me. What am I?", "answer": "carrot"},
    {"question": "I’m as big as a house, but I live in the ocean. What am I?", "answer": "whale"},
    {"question": "I’m green and grow in the ground. You can walk on me. What am I?", "answer": "grass"},
    {"question": "I’m long and travel on tracks. What am I?", "answer": "train"},
    {"question": "I’m red and juicy, and you can make ketchup out of me. What am I?", "answer": "tomato"},
    {"question": "I’m round and have numbers, and you use me to play games. What am I?", "answer": "dice"},
    {"question": "I’m round, and you can put toppings on me. What am I?", "answer": "pizza"},
    {"question": "I’m tall and have leaves, and birds live in me. What am I?", "answer": "tree"},
    {"question": "I’m the hottest season. What am I?", "answer": "summer"},
    {"question": "I’m the season when flowers bloom. What am I?", "answer": "spring"},
    {"question": "I’m the season when leaves fall. What am I?", "answer": "fall/autumn"},
    {"question": "I’m white and fluffy, and I float in the sky. What am I?", "answer": "cloud"},
    {"question": "I’m white, and you can drink me. Cows make me. What am I?", "answer": "milk"},
    {"question": "I’m yellow and curved, and monkeys love me. What am I?", "answer": "banana"},
    {"question": "I’m yellow and hot, and I shine in the sky. What am I?", "answer": "sun"},
    {"question": "If you have 3 apples and I give you 2 more, how many do you have?", "answer": "5 apples"},
    {"question": "If you have 5 cookies and eat 2, how many are left?", "answer": "3 cookies"},
    {"question": "What has a neck but no head?", "answer": "bottle"},
    {"question": "What has a ring but no finger?", "answer": "telephone"},
    {"question": "What has a tail, a head, but no body?", "answer": "coin"},
    {"question": "What has keys but can’t open locks?", "answer": "piano"},
    {"question": "What has ключи but can’t open locks?", "answer": "keyboard"}, // Note: "ключи" seems to be a typo for "keys"
    {"question": "What is 2 + 3?", "answer": "5"},
    {"question": "What is half of 10?", "answer": "5"},
    {"question": "What number comes after 9?", "answer": "10"},
    {"question": "I come after fall and bring snow. What am I?", "answer": "winter"},
    {"question": "I’m a hunter with no bow, stalking prey in fields of snow. What am I?", "answer": "wolf"},
    {"question": "I’m a bird that sings no song, soaring where the clouds belong. What am I?", "answer": "kite"},
    {"question": "I’m a light that casts no beam, guiding sailors in a dream. What am I?", "answer": "star"},
    {"question": "I roar without a mouth, crashing where land meets sea. What am I?", "answer": "wave"},
    {"question": "I’m a dance with no feet, swaying where the breezes meet. What am I?", "answer": "leaf"},
    {"question": "I’m half of twelve, but double of three. What am I?", "answer": "six"},
    {"question": "I’m a feather that writes no note, floating where the currents vote. What am I?", "answer": "wind"},
    {"question": "I’m a painter with no brush, coloring skies at dusk’s hush. What am I?", "answer": "sunset"}
];

const mediumRiddles = [
    {"question": "I have a spine but no bones. What am I?", "answer": "book"},
    {"question": "I have hands but can’t clap. What am I?", "answer": "clock"},
    {"question": "I have a thumb and four fingers but isn’t alive?", "answer": "glove"},
    {"question": "I’m a blanket woven by night, studded with twinkling light. What am I?", "answer": "sky"},
    {"question": "I’m a book with no pages to turn, teaching all who dare to learn. What am I?", "answer": "nature"},
    {"question": "I’m a box that holds no treasure, but opens worlds beyond measure. What am I?", "answer": "book"},
    {"question": "I’m a chain that binds no prisoner, linking stars in a glimmer. What am I?", "answer": "constellation"},
    {"question": "I’m a coin that buys no bread, earned in dreams while you’re in bed. What am I?", "answer": "wish"},
    {"question": "I’m a crown that’s never worn, shining bright when day is born. What am I?", "answer": "dawn"},
    {"question": "I’m a crown worn by no king, yet I rule the sky in spring. What am I?", "answer": "rainbow"},
    {"question": "I’m a drum that beats no sound, buried deep beneath the ground. What am I?", "answer": "root"},
    {"question": "I’m a gate that guards no land, opened by a tiny hand. What am I?", "answer": "eyelid"},
    {"question": "I’m a mountain with no peak, flowing where the thirsty seek. What am I?", "answer": "fountain"},
    {"question": "I’m a number you can’t divide, yet I’m the start of every line. What am I?", "answer": "one"},
    {"question": "I’m a path that twists and turns, but never moves from where I burn. What am I?", "answer": "candle wick"},
    {"question": "I’m a river with no water, flowing through circuits with power. What am I?", "answer": "electricity"},
    {"question": "I’m a shadow that grows at noon, but shrinks beneath the moon. What am I?", "answer": "sundial"},
    {"question": "I’m a ship that sails no sea, carrying thoughts from me to thee. What am I?", "answer": "letter"},
    {"question": "I’m a thread that sews no cloth, binding tales from north to south. What am I?", "answer": "story"},
    {"question": "I’m a wall that blocks no foe, built by waves where waters flow. What am I?", "answer": "sandbar"},
    {"question": "I’m a wheel that spins no cart, pumping life to every heart. What am I?", "answer": "lung"},
    {"question": "I’m full of holes but can still hold water. What am I?", "answer": "sponge"},
    {"question": "What can you catch but not throw?", "answer": "cold"},
    {"question": "What can you hold without ever touching?", "answer": "breath"},
    {"question": "What gets wetter as it dries?", "answer": "towel"},
    {"question": "What goes up but never comes down?", "answer": "age"},
    {"question": "What has a bottom at the top?", "answer": "legs"},
    {"question": "What has a face and two hands but no arms or legs?", "answer": "clock"},
    {"question": "What has a heart but no other organs?", "answer": "artichoke"},
    {"question": "What has to be broken before you can use it?", "answer": "egg"},
    {"question": "What has words but never speaks?", "answer": "book"},
    {"question": "I whisper secrets without a voice, carried by the wind through leaves. What am I?", "answer": "echo"},
    {"question": "I’m a harp with no strings to play, singing soft at break of day. What am I?", "answer": "birdsong"},
    {"question": "I’m a clock that counts no hour, blooming briefly as a flower. What am I?", "answer": "day"},
    {"question": "I’m a ladder with no steps, climbing high where danger creeps. What am I?", "answer": "cliff"},
    {"question": "I’m a lock with no key to fit, opened wide by human wit. What am I?", "answer": "puzzle"},
    {"question": "I’m a storm with no rain or thunder, tearing friendships asunder. What am I?", "answer": "argument"},
    {"question": "I’m a thief that steals no gold, leaving warmth for young and old. What am I?", "answer": "winter"},
    {"question": "I’m a thief that steals your breath, climbing high to bring you death. What am I?", "answer": "mountain"},
    {"question": "I’m read in red, but never said. What am I?", "answer": "stop sign"},
    {"question": "I’m a seed that’s never sown, growing where the wild winds moan. What am I?", "answer": "dust"},
    {"question": "I’m a bell that rings no chime, marking ends of borrowed time. What am I?", "answer": "deadline"}
];


const hardRiddles = [
    {"question": "I’m a bridge that spans no river, connecting thoughts with a quiver. What am I?", "answer": "metaphor"},
    {"question": "I’m a cage with no bars or lock, holding whispers that never talk. What am I?", "answer": "secret"},
    {"question": "I’m a chain that frees, not binds, linking souls of like kinds. What am I?", "answer": "friendship"},
    {"question": "I’m a clock with no hands or face, ticking in an endless race. What am I?", "answer": "heartbeat"},
    {"question": "I’m a creature with no legs or wings, yet I crawl through history’s rings. What am I?", "answer": "time"},
    {"question": "I’m a cup that holds no drink, filled with thoughts that make you think. What am I?", "answer": "mind"},
    {"question": "I’m a fire that warms no hand, sparked by those who understand. What am I?", "answer": "truth"},
    {"question": "I’m a flame that doesn’t burn, lighting paths for those who learn. What am I?", "answer": "idea"},
    {"question": "I’m a jewel that’s never mined, glowing bright in every mind. What am I?", "answer": "thought"},
    {"question": "I’m a key that locks no door, opening minds forevermore. What am I?", "answer": "knowledge"},
    {"question": "I’m a map that guides no feet, drawn in lines where thoughts meet. What am I?", "answer": "plan"},
    {"question": "I’m a mirror that shows no face, reflecting time in every place. What am I?", "answer": "history"},
    {"question": "I’m a mirror with no glass, reflecting dreams that come to pass. What am I?", "answer": "memory"},
    {"question": "I’m a race with no finish line, run by all in every clime. What am I?", "answer": "life"},
    {"question": "I’m a riddle with no clue, solved by simply being you. What am I?", "answer": "self"},
    {"question": "I’m a road with no end or start, mapped within the human heart. What am I?", "answer": "hope"},
    {"question": "I’m a seed that grows no tree, planted deep in mystery. What am I?", "answer": "riddle"},
    {"question": "I’m a shadow with no form, born where light and dark conform. What am I?", "answer": "silhouette"},
    {"question": "I’m a song with no tune or rhyme, sung by silence all the time. What am I?", "answer": "quiet"},
    {"question": "I’m a tide that pulls no shore, drawing dreams forevermore. What am I?", "answer": "ambition"},
    {"question": "I’m a voice that speaks no word, heard by all who’ve ever stirred. What am I?", "answer": "conscience"},
    {"question": "I’m a window with no frame, showing worlds that never tame. What am I?", "answer": "imagination"},
    {"question": "I’m a word that’s never said, written only when you’re dead. What am I?", "answer": "epitaph"},
    {"question": "If a rooster lays an egg on the roof, which way will it roll?", "answer": "roosters don’t lay eggs!"}
];


const riddles = easyRiddles.concat(mediumRiddles, hardRiddles);




let currentRiddleIndex = 0;
let score = 0;
const answeredRiddles = new Set(); // Track correctly answered riddles
const attemptedRiddles = new Set(); // Track attempted riddles

// Function to update the scoreboard
function updateScoreboard() {
    const scoreboardElement = document.getElementById('scoreboard');
    scoreboardElement.textContent = `Score: ${score} / ${attemptedRiddles.size}`;
}

// Function to display the current riddle
function displayRiddle(index) {
    const riddle = riddles[index];
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const feedbackElement = document.getElementById('feedback');
    const answerElement = document.getElementById('answer');
    const progressElement = document.getElementById('progress');

    // Update progress
    progressElement.textContent = `Riddle ${index + 1} of ${riddles.length}`;

    // Display the question
    questionElement.textContent = riddle.question;

    // Input box for answer
    optionsElement.innerHTML = `
        <input type="text" id="userAnswer" placeholder="Type your answer here">
        <button id="submitAnswerBtn">Submit</button>
    `;

    // Clear feedback and hide answer
    feedbackElement.textContent = '';
    answerElement.textContent = '';
    answerElement.classList.add('hidden');

    // Enable/disable navigation buttons
    document.getElementById('prevBtn').disabled = index === 0;
    document.getElementById('nextBtn').disabled = index === riddles.length - 1;

    // Event listener for submit button
    document.getElementById('submitAnswerBtn').onclick = () => checkAnswer(riddle.answer, index);
}

// Function to check the answer
function checkAnswer(correctAnswer, riddleIndex) {
    const userAnswer = document.getElementById('userAnswer').value.trim().toLowerCase();
    const feedbackElement = document.getElementById('feedback');
    const cleanCorrectAnswer = correctAnswer.toLowerCase().replace(/^(a|an|the)\s+/i, '').trim();

    // Mark this riddle as attempted
    attemptedRiddles.add(riddleIndex);

    if (userAnswer === cleanCorrectAnswer || userAnswer === correctAnswer.toLowerCase()) {
        if (!answeredRiddles.has(riddleIndex)) { // Only increase score if not already answered correctly
            score++;
            answeredRiddles.add(riddleIndex);
        }
        feedbackElement.textContent = "Correct! Great job!";
        feedbackElement.style.color = "#4CAF50";
    } else {
        feedbackElement.textContent = "Oops, that's not quite right. Try again!";
        feedbackElement.style.color = "#ff4444";
    }

    // Update scoreboard after every submission
    updateScoreboard();
}

// Event listeners for navigation buttons
document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentRiddleIndex > 0) {
        currentRiddleIndex--;
        displayRiddle(currentRiddleIndex);
    }
});

document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentRiddleIndex < riddles.length - 1) {
        currentRiddleIndex++;
        displayRiddle(currentRiddleIndex);
    }
});

// Event listener for showing the answer
document.getElementById('showAnswerBtn').addEventListener('click', () => {
    const answerElement = document.getElementById('answer');
    answerElement.textContent = `Answer: ${riddles[currentRiddleIndex].answer}`;
    answerElement.classList.remove('hidden');
});

// Load the first riddle and initialize scoreboard on page load
window.onload = () => {
    displayRiddle(currentRiddleIndex);
    updateScoreboard();
};