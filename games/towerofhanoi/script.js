// script.js
const svg = document.getElementById("game-board");
const moveCounter = document.getElementById("move-counter");
const minMovesDisplay = document.getElementById("min-moves");
const resetButton = document.getElementById("reset-button");
const increaseRingsButton = document.getElementById("increase-rings");
const decreaseRingsButton = document.getElementById("decrease-rings");
const ringCountDisplay = document.getElementById("ring-count");

let moveCount = 0;
let selectedDisk = null;
let offsetX = 0;
let offsetY = 0;
let numRings = 4; // Default number of rings
const rods = [[], [], []]; // Represents the three rods

// Disk sizes (widths)
const diskSizes = [120, 100, 80, 60, 40, 30, 20]; // Supports up to 7 rings
const diskHeight = 20;
const rodWidth = 10;
const rodHeight = 200;
const baseHeight = 10;
const baseWidth = 400; // Broader base
const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF", "#33FFF5", "#F5FF33"];

// Function to calculate minimum moves
function calculateMinMoves(n) {
  return Math.pow(2, n) - 1;
}

// Initialize the game
function initGame() {
  // Clear the SVG
  svg.innerHTML = "";

  // Draw the base
  const base = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  base.setAttribute("x", (svg.width.baseVal.value - baseWidth) / 2);
  base.setAttribute("y", svg.height.baseVal.value - baseHeight);
  base.setAttribute("width", baseWidth);
  base.setAttribute("height", baseHeight);
  base.setAttribute("fill", "#888");
  base.setAttribute("class", "base");
  svg.appendChild(base);

  // Draw the rods
  for (let i = 0; i < 3; i++) {
    const rod = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rod.setAttribute("x", (svg.width.baseVal.value / 4) * (i + 1) - rodWidth / 2);
    rod.setAttribute("y", svg.height.baseVal.value - rodHeight - baseHeight);
    rod.setAttribute("width", rodWidth);
    rod.setAttribute("height", rodHeight);
    rod.setAttribute("fill", "#555");
    rod.setAttribute("class", "rod");
    rod.setAttribute("data-rod-index", i); // Add data attribute for rod index
    svg.appendChild(rod);
  }

  // Add disks to the first rod
  for (let i = 0; i < numRings; i++) {
    const disk = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    disk.setAttribute("width", diskSizes[i]);
    disk.setAttribute("height", diskHeight);
    disk.setAttribute("fill", colors[i % colors.length]);
    disk.setAttribute("x", (svg.width.baseVal.value / 4) - diskSizes[i] / 2);
    disk.setAttribute("y", svg.height.baseVal.value - baseHeight - (i + 1) * diskHeight);
    disk.setAttribute("data-size", diskSizes[i]);
    disk.setAttribute("data-rod", 0);
    disk.setAttribute("class", "disk");
    disk.setAttribute("rx", 10); // Rounded corners
    disk.setAttribute("ry", 10); // Rounded corners
    disk.addEventListener("mousedown", startDrag);
    svg.appendChild(disk);
    rods[0].push(disk);
  }

  moveCount = 0;
  moveCounter.textContent = moveCount;

  // Update minimum moves display
  minMovesDisplay.textContent = calculateMinMoves(numRings);
}

// Start dragging a disk
function startDrag(event) {
  const disk = event.target;
  const rodIndex = parseInt(disk.getAttribute("data-rod"));

  // Ensure only the top disk on the rod can be dragged
  if (rods[rodIndex].length > 0 && rods[rodIndex][rods[rodIndex].length - 1] === disk) {
    selectedDisk = disk;
    const rect = selectedDisk.getBoundingClientRect();
    offsetX = event.clientX - rect.x;
    offsetY = event.clientY - rect.y;

    // Attach event listeners for dragging and dropping
    svg.addEventListener("mousemove", dragDisk);
    svg.addEventListener("mouseup", dropDisk);
  }
}

// Drag a disk
function dragDisk(event) {
  if (!selectedDisk) return;

  // Calculate new position
  const x = event.clientX - offsetX - svg.getBoundingClientRect().left;
  const y = event.clientY - offsetY - svg.getBoundingClientRect().top;

  // Update disk position
  selectedDisk.setAttribute("x", x);
  selectedDisk.setAttribute("y", y);
}

// Drop a disk
function dropDisk(event) {
  if (!selectedDisk) return;

  // Remove event listeners
  svg.removeEventListener("mousemove", dragDisk);
  svg.removeEventListener("mouseup", dropDisk);

  // Find the closest rod
  const rodIndex = getClosestRodIndex(event.clientX);
  if (rodIndex !== -1 && isValidMove(selectedDisk, rodIndex)) {
    moveDisk(selectedDisk, rodIndex);
  } else {
    // Return the disk to its original position
    const originalRodIndex = parseInt(selectedDisk.getAttribute("data-rod"));
    const rod = rods[originalRodIndex];
    const diskIndex = rod.indexOf(selectedDisk);
    selectedDisk.setAttribute("x", (svg.width.baseVal.value / 4) * (originalRodIndex + 1) - selectedDisk.getAttribute("data-size") / 2);
    selectedDisk.setAttribute("y", svg.height.baseVal.value - baseHeight - (diskIndex + 1) * diskHeight);
  }

  selectedDisk = null;
}

// Get the closest rod index based on mouse position
function getClosestRodIndex(clientX) {
  const rodPositions = [svg.width.baseVal.value / 4, svg.width.baseVal.value / 2, (svg.width.baseVal.value / 4) * 3];
  const x = clientX - svg.getBoundingClientRect().left;
  let minDistance = Infinity;
  let closestRodIndex = -1;

  rodPositions.forEach((pos, index) => {
    const distance = Math.abs(x - pos);
    if (distance < minDistance) {
      minDistance = distance;
      closestRodIndex = index;
    }
  });

  return closestRodIndex;
}

// Check if the move is valid
function isValidMove(disk, toRodIndex) {
  const toRod = rods[toRodIndex];
  if (toRod.length === 0) return true; // Empty rod is always valid
  const topDiskSize = toRod[toRod.length - 1].getAttribute("data-size");
  return parseInt(disk.getAttribute("data-size")) < parseInt(topDiskSize);
}

// Move a disk to a rod
function moveDisk(disk, toRodIndex) {
  const fromRodIndex = parseInt(disk.getAttribute("data-rod"));
  rods[fromRodIndex].pop(); // Remove from current rod
  rods[toRodIndex].push(disk); // Add to target rod

  // Update disk position
  disk.setAttribute("x", (svg.width.baseVal.value / 4) * (toRodIndex + 1) - disk.getAttribute("data-size") / 2);
  disk.setAttribute("y", svg.height.baseVal.value - baseHeight - rods[toRodIndex].length * diskHeight);
  disk.setAttribute("data-rod", toRodIndex);

  moveCount++;
  moveCounter.textContent = moveCount;

  // Check for win condition
  if (rods[2].length === numRings) {
    alert(`You won in ${moveCount} moves! Minimum moves required: ${calculateMinMoves(numRings)}`);
    initGame();
  }
}

// Adjust the number of rings
function adjustRings(delta) {
  numRings += delta;
  if (numRings < 3) numRings = 3;
  if (numRings > 7) numRings = 7;
  ringCountDisplay.textContent = numRings;
  initGame();
}

// Event listeners for ring adjustment buttons
increaseRingsButton.addEventListener("click", () => adjustRings(1));
decreaseRingsButton.addEventListener("click", () => adjustRings(-1));

// Reset the game
resetButton.addEventListener("click", initGame);

// Initialize the game on page load
initGame();