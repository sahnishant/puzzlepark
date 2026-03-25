const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const stopBtn = document.getElementById('stopBtn');
const resultModal = document.getElementById('resultModal');
const questionDisplay = document.getElementById('questionDisplay');
const closeBtn = document.querySelector('.close-btn');
const nextBtn = document.getElementById('nextBtn');

const questions = [
    "I love ...",
    "I don't like ...",
    "I want to become ...",
    "My favorite color is ...",
    "I am good at ...",
    "My best friend is ...",
    "I feel happy when ...",
    "My favorite animal is ...",
    "My favorite hobby is ...",
    "My favorite food is ...",
    "I love playing ...",
    "I wish I could fly to ...",
    "My favorite movie is ...",
    "I am thankful for ...",
    "My favorite season is ...",
    "I want to learn ...",
    "I like to help with ...",
    "My favorite toy is ...",
    "I am proud of ...",
    "Tomorrow I want to ..."
];

const colors = [
    '#FF6B6B', '#4ECDC4', '#FFE66D', '#FF9F43', '#A29BFE',
    '#6C5CE7', '#FD79A8', '#FAB1A0', '#00B894', '#00CEC9',
    '#0984E3', '#636E72', '#D63031', '#E84393', '#2D3436',
    '#FF7675', '#74B9FF', '#81ECEC', '#55E6C1', '#F7D794'
];

let currentRotation = 0;
let rotationSpeed = 0;
let isSpinning = false;
let isStopping = false;
const deceleration = 0.992;
let animationId = null;

const numSegments = questions.length;
const segmentAngle = (2 * Math.PI) / numSegments;

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(currentRotation);

    for (let i = 0; i < numSegments; i++) {
        const angle = i * segmentAngle;
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, angle, angle + segmentAngle);
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.rotate(angle + segmentAngle / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "white";
        ctx.font = "bold 14px Poppins";
        
        // Truncate text if it's too long
        let text = (i + 1).toString();
        ctx.fillText(text, radius - 20, 5);
        ctx.restore();
    }

    // Draw center pin
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.stroke();

    ctx.restore();
}

function update() {
    if (isSpinning) {
        currentRotation += rotationSpeed;
        
        if (isStopping) {
            rotationSpeed *= deceleration;
            
            if (rotationSpeed < 0.001) {
                stopSpinning();
                return;
            }
        }
        drawWheel();
        animationId = requestAnimationFrame(update);
    }
}

function startSpinning() {
    if (isSpinning) return;
    
    isSpinning = true;
    isStopping = false;
    rotationSpeed = 0.1 + Math.random() * 0.1; // Random initial speed
    
    spinBtn.disabled = true;
    stopBtn.disabled = false;
    
    update();
}

function triggerStop() {
    isStopping = true;
    stopBtn.disabled = true;
}

function stopSpinning() {
    isSpinning = false;
    isStopping = false;
    cancelAnimationFrame(animationId);
    
    // Calculate winning segment
    // The pointer is at the top (1.5 PI or -0.5 PI)
    // Canvas rotation is relative to 0 (right side)
    const normalizedRotation = (currentRotation % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    // Angle distance from 0 to pointer at 1.5 PI
    // Winning angle on the wheel is (1.5 PI - normalizedRotation)
    const winAngle = (1.5 * Math.PI - normalizedRotation + 2 * Math.PI) % (2 * Math.PI);
    const winIndex = Math.floor(winAngle / segmentAngle);
    
    showResult(questions[winIndex]);
}

function showResult(question) {
    questionDisplay.textContent = question;
    resultModal.classList.remove('hidden');
    resultModal.classList.add('visible');
    
    // Confetti effect or something? (Maybe too complex for now)
}

function resetGame() {    resultModal.classList.remove('visible');
    setTimeout(() => {
        resultModal.classList.add('hidden');
        spinBtn.disabled = false;
    }, 300);
}

spinBtn.addEventListener('click', startSpinning);
stopBtn.addEventListener('click', triggerStop);
closeBtn.addEventListener('click', resetGame);
nextBtn.addEventListener('click', resetGame);
window.addEventListener('click', (e) => {
    if (e.target === resultModal) resetGame();
});

// Initial draw
drawWheel();
