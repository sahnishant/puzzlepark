document.addEventListener('DOMContentLoaded', () => {
  const gameList = document.getElementById('game-list');


  gameList.addEventListener('click', (event) => {
      if (event.target.tagName === 'BUTTON') {
          const gameName = event.target.dataset.game;
            window.location.href = `games/${gameName}/index.html`;
        }
  });

});