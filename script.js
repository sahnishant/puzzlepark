document.addEventListener('DOMContentLoaded', () => {
    const gameList = document.getElementById('game-list');
    const gameContainer = document.getElementById('game-container');
     const messageContainer = document.getElementById('message');

    gameList.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            const gameName = event.target.dataset.game;
            loadGame(gameName);
        }
    });

   function displayMessage(message) {
        messageContainer.textContent = message;
   }


    function loadGame(gameName) {
      gameContainer.innerHTML = '';
      displayMessage('');
       // Load the game's HTML and scripts based on the game name
      const iframe = document.createElement('iframe');
        iframe.src = `games/${gameName}/${gameName}.html`;
         iframe.style.width = '100%';
          iframe.style.height = '400px';
        iframe.frameBorder = '0'; // Remove iframe border
      gameContainer.appendChild(iframe);
    }
});