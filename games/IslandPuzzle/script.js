// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    const solveButton = document.getElementById('solveButton');
    const solutionDiv = document.getElementById('solution');
    const aliceTribe = document.getElementById('aliceTribe');
    const bobTribe = document.getElementById('bobTribe');
    const carolTribe = document.getElementById('carolTribe');
  
    // Add event listener to the button
    solveButton.addEventListener('click', () => {
      // Solve the puzzle
      const tribes = solvePuzzle();
  
      // Display the solution
      aliceTribe.textContent = tribes.alice;
      bobTribe.textContent = tribes.bob;
      carolTribe.textContent = tribes.carol;
  
      // Show the solution div
      solutionDiv.classList.remove('hidden');
    });
  
    // Function to solve the puzzle
    function solvePuzzle() {
      // Assume Alice is a Truth-teller
      const alice = 'Truth-teller';
      const bob = 'Liar';
      const carol = 'Truth-teller';
  
      // Return the tribes
      return { alice, bob, carol };
    }
  });