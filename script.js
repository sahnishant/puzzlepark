document.addEventListener('DOMContentLoaded', function() {
  // Set the current year in the footer
  document.getElementById('currentYear').textContent = new Date().getFullYear();

  // Game data
  const games = [
    {
      title: "1024",
      description: "Combine tiles to reach the 2048 tile.",
      icon: "dices",
      color: "game-green",
      url: "1024",
      category: "puzzle"
    },
    {
      title: "Chess",
      description: "The classic game of strategy.",
      icon: "landmark",
      color: "game-purple",
      url: "chess",
      category: "board"
    },
    {
      title: "Fractals",
      description: "Explore the beauty of fractals.",
      icon: "brain",
      color: "game-blue",
      url: "fractals",
      category: "puzzle"
    },
    {
      title: "Hangman",
      description: "Guess the word before the hangman is complete.",
      icon: "scroll",
      color: "game-orange",
      url: "hangman",
      category: "word"
    },
    {
      title: "Island Puzzle",
      description: "Solve puzzles to explore the island.",
      icon: "puzzle",
      color: "game-yellow",
      url: "IslandPuzzle",
      category: "puzzle"
    },
    {
      title: "Master Mind",
      description: "Crack the code in this classic logic game.",
      icon: "brain",
      color: "game-purple",
      url: "mastermind",
      category: "puzzle"
    },
    {
      title: "Memory Match",
      description: "Test your memory by matching card pairs.",
      icon: "brain",
      color: "game-blue",
      url: "memory",
      category: "puzzle"
    },
    {
      title: "Minesweeper",
      description: "Avoid the mines and clear the field.",
      icon: "target",
      color: "game-red",
      url: "minesweeper",
      category: "puzzle"
    },
    {
      title: "Number Guessing",
      description: "Guess the correct number within a limited range.",
      icon: "dices",
      color: "game-green",
      url: "number-guess",
      category: "puzzle"
    },
    {
      title: "Pacman",
      description: "Eat all the dots while avoiding ghosts.",
      icon: "target",
      color: "game-yellow",
      url: "pacman",
      category: "arcade"
    },
    {
      title: "Riddles",
      description: "Solve tricky riddles to test your brain.",
      icon: "book",
      color: "game-pink",
      url: "riddles",
      category: "word"
    },
    {
      title: "Scramble",
      description: "Unscramble the letters to guess the correct word.",
      icon: "keyboard",
      color: "game-orange",
      url: "scramble",
      category: "word"
    },
    {
      title: "Sliding Puzzle",
      description: "Rearrange the tiles to complete the picture or pattern.",
      icon: "puzzle",
      color: "game-blue",
      url: "sliding-puzzle",
      category: "puzzle"
    },
    {
      title: "Snake",
      description: "Classic snake game - eat food, grow longer, avoid walls.",
      icon: "box",
      color: "game-purple",
      url: "snakes",
      category: "arcade"
    },
    {
      title: "Snake And Ladder",
      description: "A digital version of the classic board game.",
      icon: "dices",
      color: "game-green",
      url: "snakeandladder",
      category: "board"
    },
    {
      title: "Solitaire",
      description: "Classic card game for one player.",
      icon: "joystick",
      color: "game-pink",
      url: "solitaire",
      category: "board"
    },
    {
      title: "Space Invaders",
      description: "Defend Earth from alien invaders.",
      icon: "rocket",
      color: "game-blue",
      url: "space-invaders",
      category: "arcade"
    },
    {
      title: "Sudoku",
      description: "Fill the grid with numbers according to the rules.",
      icon: "puzzle",
      color: "game-yellow",
      url: "sudoku",
      category: "puzzle"
    },
    {
      title: "Tetris",
      description: "Arrange falling blocks to create complete lines.",
      icon: "box",
      color: "game-green",
      url: "tetris",
      category: "puzzle"
    },
    {
      title: "Tic Tac Toe",
      description: "The classic X and O game for two players.",
      icon: "grid",
      color: "game-blue",
      url: "tic-tac-toe",
      category: "board"
    },
    {
      title: "Tower Of Hanoi",
      description: "Solve the Tower of Hanoi puzzle.",
      icon: "landmark",
      color: "game-purple",
      url: "towerofhanoi",
      category: "puzzle"
    },
    {
      title: "Typing Speed Test",
      description: "Test your typing speed and accuracy.",
      icon: "keyboard",
      color: "game-pink",
      url: "typing-speed-test",
      category: "word"
    },
    {
      title: "Typing Tutor",
      description: "Improve your typing speed and accuracy.",
      icon: "keyboard",
      color: "game-pink",
      url: "typing-tutor",
      category: "word"
    },
    {
      title: "Water Sort",
      description: "Sort the colored water into the correct bottles.",
      icon: "joystick",
      color: "game-orange",
      url: "watersort",
      category: "puzzle"
    },
    {
      title: "Wordle",
      description: "Guess the five-letter word in six tries.",
      icon: "book",
      color: "game-yellow",
      url: "wordle",
      category: "word"
    },
    {
      title: "Spin Wheel",
      description: "Spin the wheel and complete the sentence!",
      icon: "target",
      color: "game-pink",
      url: "spin-wheel",
      category: "puzzle"
    }
  ];

  // Function to render the icon
  function renderGameIcon(iconName) {
    const iconMap = {
      'box': '📦',
      'grid': '⊞',
      'puzzle': '🧩',
      'keyboard': '⌨️',
      'brain': '🧠',
      'scroll': '📜',
      'landmark': '🏛️',
      'dices': '🎲',
      'rocket': '🚀',
      'target': '🎯',
      'book': '📚',
      'joystick': '🎮',
      'gamepad': '🎮'
    };
    return iconMap[iconName] || '🎮';
  }

  // Function to render the games
  function renderGames(filteredGames) {
    const gamesGrid = document.getElementById('gamesGrid');
    const noGamesMessage = document.getElementById('noGamesMessage');
    
    // Clear the current games
    gamesGrid.innerHTML = '';
    
    if (filteredGames.length === 0) {
      gamesGrid.classList.add('hidden');
      noGamesMessage.classList.remove('hidden');
    } else {
      gamesGrid.classList.remove('hidden');
      noGamesMessage.classList.add('hidden');
      
      // Render each game card
      filteredGames.forEach(game => {
        const gameCard = document.createElement('a');
        gameCard.href = "games/"+game.url+"/index.html";
        gameCard.className = `game-card ${game.color}`;
        gameCard.setAttribute('data-category', game.category);
        
        gameCard.innerHTML = `
          <div class="card-content">
            <div class="icon-container ${game.color}">
              <span class="game-icon">${renderGameIcon(game.icon)}</span>
            </div>
            <h3 class="game-title">${game.title}</h3>
            <p class="game-description">${game.description}</p>
            <div class="color-bar ${game.color}"></div>
          </div>
        `;
        
        gamesGrid.appendChild(gameCard);
      });
    }
  }

  // Initial render of all games
  renderGames(games);

  // Search functionality
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', filterGames);

  // Category filter functionality
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Update active button styling
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      filterGames();
    });
  });

  // Function to filter games based on search and category
  function filterGames() {
    const searchTerm = searchInput.value.toLowerCase();
    const activeCategory = document.querySelector('.filter-btn.active').getAttribute('data-category');
    
    const filteredGames = games.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchTerm) || 
                           game.description.toLowerCase().includes(searchTerm);
      const matchesCategory = activeCategory === 'all' || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
    
    renderGames(filteredGames);
  }
});