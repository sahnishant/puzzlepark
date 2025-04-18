const gameContainer = document.getElementById('game-container');
const messageContainer = document.getElementById('message');
function displayMessage(message) {
    messageContainer.textContent = message;
}
 const images = [
        'image1.png', 'image1.png',
        'image2.png', 'image2.png',
        'image3.png', 'image3.png',
        'image4.png', 'image4.png',
        'image5.png', 'image5.png',
        'image6.png', 'image6.png',
    ];

let flippedCards = [];
let matchedPairs = 0;
let cardElements = [];

// Shuffle the array of images
const shuffledImages = shuffleArray(images);

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
       const j = Math.floor(Math.random() * (i + 1));
       [array[i], array[j]] = [array[j], array[i]];
     }
    return array;
}


const memoryGrid = document.createElement('div');
memoryGrid.classList.add('memory-grid');
for(let i = 0; i < images.length; i++) {
     const cardDiv = document.createElement('div');
    cardDiv.classList.add('memory-card');
    cardDiv.dataset.index = i;
    const cardBack = document.createElement('div');
    cardBack.classList.add('memory-card-back');
    const cardFront = document.createElement('div');
    cardFront.classList.add('memory-card-front');
    cardFront.style.backgroundImage = `url(${shuffledImages[i]})`
     cardDiv.appendChild(cardBack);
    cardDiv.appendChild(cardFront)
    cardDiv.addEventListener('click', handleCardClick);
     memoryGrid.appendChild(cardDiv);
   cardElements.push(cardDiv)
}

gameContainer.appendChild(memoryGrid)


function handleCardClick(event) {
   const clickedCard = event.currentTarget;
   const index = clickedCard.dataset.index;

   if(flippedCards.length < 2 && !clickedCard.classList.contains('matched')) {
     flipCard(clickedCard);
      flippedCards.push({ card: clickedCard, image: shuffledImages[index]});
    }
    if(flippedCards.length === 2) {
        setTimeout(() => {
          const [firstCard, secondCard] = flippedCards;
              if(firstCard.image === secondCard.image) {
                   firstCard.card.classList.add('matched')
                  secondCard.card.classList.add('matched');
                 matchedPairs++;

                if (matchedPairs === images.length / 2) {
                    displayMessage('Congratulations! You won the Memory Game!');
                   resetButton();
                }
            } else {
                 flipCard(firstCard.card)
                flipCard(secondCard.card)
            }
              flippedCards = [];
        }, 1000)

    }
}

function flipCard(card) {
    card.classList.toggle('flipped');
}
function resetButton() {
    const button = document.createElement('button')
     button.textContent = 'Play Again'
     button.addEventListener('click', () => resetGame())
    gameContainer.appendChild(button);
}

function resetGame() {
   flippedCards = [];
    matchedPairs = 0;
  cardElements = [];
  gameContainer.innerHTML = '';
    displayMessage('');
    loadMemoryGame()
}

function loadMemoryGame() {
const images = [
        'image1.png', 'image1.png',
        'image2.png', 'image2.png',
        'image3.png', 'image3.png',
        'image4.png', 'image4.png',
        'image5.png', 'image5.png',
        'image6.png', 'image6.png',
    ];

  let flippedCards = [];
    let matchedPairs = 0;
   let cardElements = [];

    // Shuffle the array of images
    const shuffledImages = shuffleArray(images);

      function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
           const j = Math.floor(Math.random() * (i + 1));
           [array[i], array[j]] = [array[j], array[i]];
         }
        return array;
     }

    const memoryGrid = document.createElement('div');
   memoryGrid.classList.add('memory-grid');
   for(let i = 0; i < images.length; i++) {
       const cardDiv = document.createElement('div');
      cardDiv.classList.add('memory-card');
      cardDiv.dataset.index = i;
       const cardBack = document.createElement('div');
      cardBack.classList.add('memory-card-back');
       const cardFront = document.createElement('div');
       cardFront.classList.add('memory-card-front');
        cardFront.style.backgroundImage = `url(${shuffledImages[i]})`
       cardDiv.appendChild(cardBack);
       cardDiv.appendChild(cardFront)

       cardDiv.addEventListener('click', handleCardClick);
       memoryGrid.appendChild(cardDiv);
      cardElements.push(cardDiv)
   }

    gameContainer.appendChild(memoryGrid)


 function handleCardClick(event) {
       const clickedCard = event.currentTarget;
       const index = clickedCard.dataset.index;

     if(flippedCards.length < 2 && !clickedCard.classList.contains('matched')) {
          flipCard(clickedCard);
         flippedCards.push({ card: clickedCard, image: shuffledImages[index]});
        }

       if(flippedCards.length === 2) {
        setTimeout(() => {
            const [firstCard, secondCard] = flippedCards;
              if(firstCard.image === secondCard.image) {
                    firstCard.card.classList.add('matched')
                  secondCard.card.classList.add('matched');
                  matchedPairs++;

               if (matchedPairs === images.length / 2) {
                  displayMessage('Congratulations! You won the Memory Game!');
                    resetButton();
              }
            } else {
                  flipCard(firstCard.card)
                flipCard(secondCard.card)
              }
            flippedCards = [];
        }, 1000)

       }
   }

   function flipCard(card) {
      card.classList.toggle('flipped');
   }

 const styleTag = document.createElement('style');
 styleTag.textContent = `
       .memory-grid {
          display: grid;
           grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 10px;
           margin-top: 20px;
         }

       .memory-card {
           width: 100%;
           height: 150px;
           position: relative;
           perspective: 1000px; /* Required for 3D flip */
           cursor: pointer;
        }

       .memory-card .memory-card-back,
       .memory-card .memory-card-front {
            position: absolute;
            width: 100%;
           height: 100%;
          backface-visibility: hidden;
           transition: transform 0.6s; /* Smooth transition */
             border: 1px solid #ddd;
            display: flex;
           justify-content: center;
           align-items: center;

      }
       .memory-card .memory-card-back {
            background-color: #eee;
          z-index: 1;

      }

       .memory-card .memory-card-front {
           transform: rotateY(180deg);
           background-size: cover;
           background-position: center;
        }

         .memory-card.flipped .memory-card-back {
            transform: rotateY(180deg)
        }
        .memory-card.flipped .memory-card-front {
              transform: rotateY(0deg);
     }
        .memory-card.matched .memory-card-back{
          background-color: gray;
        }
       .memory-card.matched .memory-card-front {
           transform: none;
       }