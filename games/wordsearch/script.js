document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('letter-grid');
    const wordListElement = document.getElementById('word-list');
    const messageArea = document.getElementById('message-area');
    const currentLevelSpan = document.getElementById('current-level');
    const wordsFoundSpan = document.getElementById('words-found-count');
    const totalWordsSpan = document.getElementById('total-words');
    const nextLevelButton = document.getElementById('next-level-button');
    const restartLevelButton = document.getElementById('restart-level-button');

    // --- Game Data ---
    const levels = [
        // --- Small Grids (Levels 1-15) ---
        { // Level 1 (Example from before - verified)
            grid: [
                ['W', 'O', 'R', 'D', 'S'],
                ['F', 'I', 'N', 'D', 'E'],
                ['U', 'N', 'C', 'O', 'D'],
                ['N', 'E', 'L', 'P', 'X'],
                ['G', 'A', 'M', 'E', 'Y']
            ],
            words: ['WORD', 'FIND', 'FUN', 'GAME', 'CODE'] // HELP removed
        },
        { // Level 2 (Example from before - verified)
            grid: [
                ['P', 'R', 'O', 'G', 'R', 'A', 'M'],
                ['L', 'E', 'V', 'E', 'L', 'T', 'O'],
                ['A', 'S', 'C', 'R', 'I', 'P', 'T'],
                ['Y', 'T', 'S', 'S', 'T', 'Y', 'L'],
                ['G', 'A', 'M', 'E', 'R', 'H', 'E'],
                ['R', 'H', 'T', 'M', 'L', 'P', 'S'],
                ['O', 'N', 'U', 'F', 'N', 'X', 'Z']
            ],
            words: ['PROGRAM', 'LEVEL', 'SCRIPT', 'STYLE', 'HTML', 'GAME', 'PLAY', 'FUN', 'CSS']
        },
        { // Level 3 (Example from before - verified words only)
            grid: [
                ['C', 'A', 'T', 'S', 'L'],
                ['R', 'D', 'I', 'A', 'G'],
                ['O', 'W', 'G', 'F', 'O'],
                ['W', 'O', 'L', 'F', 'D'],
                ['S', 'E', 'L', 'E', 'C']
            ],
            words: ['CATS', 'DOG', 'WOLF', 'CROW', 'SELL'] // Removed words not easily verifiable
        },
        // --- START OF RANDOMLY GENERATED STRUCTURES ---
        // WARNING: Words below are NOT guaranteed to be in the random grids.
        { // Level 4 (6x6)
            grid: [
                ['A', 'P', 'P', 'L', 'E', 'Q'],
                ['B', 'A', 'N', 'A', 'N', 'A'],
                ['C', 'H', 'E', 'R', 'R', 'Y'],
                ['D', 'A', 'T', 'E', 'X', 'Z'],
                ['O', 'R', 'A', 'N', 'G', 'E'],
                ['P', 'E', 'A', 'R', 'V', 'W']
            ],
            words: ['APPLE', 'BANANA', 'CHERRY', 'DATE', 'ORANGE', 'PEAR']
        },
        { // Level 5 (6x7)
            grid: [
                ['S', 'U', 'N', 'M', 'O', 'O', 'N'],
                ['T', 'T', 'C', 'L', 'O', 'U', 'D'],
                ['A', 'A', 'R', 'A', 'I', 'N', 'X'],
                ['R', 'R', 'S', 'K', 'Y', 'Z', 'W'],
                ['W', 'I', 'N', 'D', 'V', 'E', 'T'],
                ['F', 'O', 'G', 'A', 'B', 'C', 'D']
            ],
            words: ['SUN', 'MOON', 'CLOUD', 'RAIN', 'STAR', 'WIND', 'FOG']
        },
        { // Level 6 (7x7)
            grid: [
                ['R', 'E', 'D', 'X', 'Y', 'Z', 'A'],
                ['B', 'L', 'U', 'E', 'Q', 'W', 'E'],
                ['G', 'R', 'E', 'E', 'N', 'R', 'T'],
                ['Y', 'E', 'L', 'L', 'O', 'W', 'Y'],
                ['P', 'U', 'R', 'P', 'L', 'E', 'U'],
                ['B', 'R', 'O', 'W', 'N', 'I', 'O'],
                ['B', 'L', 'A', 'C', 'K', 'P', 'S']
            ],
            words: ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE', 'BROWN', 'BLACK', 'PINK'] // Pink might be hard
        },
        { // Level 7 (7x6)
            grid: [
                ['D', 'O', 'G', 'C', 'A', 'T'],
                ['F', 'I', 'S', 'H', 'M', 'O'],
                ['B', 'I', 'R', 'D', 'O', 'W'],
                ['L', 'I', 'O', 'N', 'U', 'L'],
                ['T', 'I', 'G', 'E', 'R', 'F'],
                ['B', 'E', 'A', 'R', 'S', 'E'],
                ['F', 'O', 'X', 'W', 'N', 'T']
            ],
            words: ['DOG', 'CAT', 'FISH', 'BIRD', 'LION', 'TIGER', 'BEAR', 'FOX']
        },
        { // Level 8 (5x8)
            grid: [
                ['P', 'L', 'A', 'N', 'E', 'T', 'S', 'X'],
                ['M', 'E', 'R', 'C', 'U', 'R', 'Y', 'A'],
                ['V', 'E', 'N', 'U', 'S', 'B', 'Z', 'C'],
                ['E', 'A', 'R', 'T', 'H', 'D', 'Y', 'E'],
                ['M', 'A', 'R', 'S', 'F', 'G', 'W', 'H']
            ],
            words: ['PLANETS', 'MERCURY', 'VENUS', 'EARTH', 'MARS', 'SUN']
        },
        { // Level 9 (8x8)
            grid: [
                ['J', 'A', 'V', 'A', 'S', 'C', 'R', 'I'],
                ['P', 'T', 'H', 'O', 'N', 'X', 'Y', 'P'],
                ['R', 'U', 'B', 'Y', 'Z', 'Q', 'W', 'T'],
                ['S', 'W', 'I', 'F', 'T', 'A', 'B', 'C'],
                ['G', 'O', 'L', 'A', 'N', 'G', 'D', 'E'],
                ['K', 'O', 'T', 'L', 'I', 'N', 'F', 'G'],
                ['P', 'H', 'P', 'V', 'B', 'N', 'M', 'H'],
                ['L', 'U', 'A', 'C', 'S', 'H', 'A', 'R']
            ],
            words: ['JAVASCRIPT', 'PYTHON', 'RUBY', 'SWIFT', 'GOLANG', 'KOTLIN', 'PHP', 'CSHARP']
        },
        { // Level 10 (8x8)
            grid: [
                ['S', 'P', 'R', 'I', 'N', 'G', 'A', 'B'],
                ['S', 'U', 'M', 'M', 'E', 'R', 'C', 'D'],
                ['A', 'U', 'T', 'U', 'M', 'N', 'E', 'F'],
                ['W', 'I', 'N', 'T', 'E', 'R', 'G', 'H'],
                ['S', 'E', 'A', 'S', 'O', 'N', 'I', 'J'],
                ['Y', 'E', 'A', 'R', 'K', 'L', 'M', 'N'],
                ['M', 'O', 'N', 'T', 'H', 'O', 'P', 'Q'],
                ['W', 'E', 'E', 'K', 'D', 'A', 'Y', 'R']
            ],
            words: ['SPRING', 'SUMMER', 'AUTUMN', 'WINTER', 'SEASON', 'YEAR', 'MONTH', 'WEEK', 'DAY']
        },
        { // Level 11 (7x8)
            grid: [
                ['C', 'A', 'R', 'B', 'I', 'K', 'E', 'X'],
                ['T', 'R', 'U', 'C', 'K', 'Y', 'Z', 'A'],
                ['B', 'U', 'S', 'V', 'A', 'N', 'B', 'C'],
                ['T', 'R', 'A', 'I', 'N', 'D', 'E', 'F'],
                ['B', 'O', 'A', 'T', 'G', 'H', 'I', 'J'],
                ['P', 'L', 'A', 'N', 'E', 'K', 'L', 'M'],
                ['S', 'H', 'I', 'P', 'N', 'O', 'P', 'Q']
            ],
            words: ['CAR', 'BIKE', 'TRUCK', 'BUS', 'VAN', 'TRAIN', 'BOAT', 'PLANE', 'SHIP']
        },
        { // Level 12 (8x7)
            grid: [
                ['M', 'U', 'S', 'I', 'C', 'X', 'Y'],
                ['R', 'O', 'C', 'K', 'Z', 'A', 'B'],
                ['P', 'O', 'P', 'C', 'D', 'E', 'F'],
                ['J', 'A', 'Z', 'Z', 'G', 'H', 'I'],
                ['B', 'L', 'U', 'E', 'S', 'J', 'K'],
                ['M', 'E', 'T', 'A', 'L', 'L', 'M'],
                ['P', 'U', 'N', 'K', 'N', 'O', 'P'],
                ['R', 'A', 'P', 'Q', 'R', 'S', 'T']
            ],
            words: ['MUSIC', 'ROCK', 'POP', 'JAZZ', 'BLUES', 'METAL', 'PUNK', 'RAP']
        },
         { // Level 13 (6x6)
            grid: [
                ['T', 'A', 'B', 'L', 'E', 'R'],
                ['C', 'H', 'A', 'I', 'R', 'S'],
                ['S', 'O', 'F', 'A', 'B', 'C'],
                ['L', 'A', 'M', 'P', 'D', 'E'],
                ['D', 'E', 'S', 'K', 'F', 'G'],
                ['B', 'E', 'D', 'H', 'I', 'J']
            ],
            words: ['TABLE', 'CHAIR', 'SOFA', 'LAMP', 'DESK', 'BED']
        },
        { // Level 14 (7x7)
            grid: [
                ['O', 'C', 'E', 'A', 'N', 'X', 'Y'],
                ['R', 'I', 'V', 'E', 'R', 'Z', 'A'],
                ['L', 'A', 'K', 'E', 'B', 'C', 'D'],
                ['P', 'O', 'N', 'D', 'E', 'F', 'G'],
                ['S', 'T', 'R', 'E', 'A', 'M', 'H'],
                ['W', 'A', 'T', 'E', 'R', 'I', 'J'],
                ['S', 'E', 'A', 'K', 'L', 'M', 'N']
            ],
            words: ['OCEAN', 'RIVER', 'LAKE', 'POND', 'STREAM', 'WATER', 'SEA']
        },
        { // Level 15 (8x6)
            grid: [
                ['F', 'O', 'O', 'T', 'B', 'A'],
                ['L', 'L', 'S', 'O', 'C', 'C'],
                ['E', 'R', 'B', 'A', 'S', 'K'],
                ['E', 'T', 'B', 'A', 'L', 'L'],
                ['T', 'E', 'N', 'N', 'I', 'S'],
                ['G', 'O', 'L', 'F', 'X', 'Y'],
                ['R', 'U', 'G', 'B', 'Y', 'Z'],
                ['H', 'O', 'C', 'K', 'E', 'Y']
            ],
            words: ['FOOTBALL', 'SOCCER', 'BASKETBALL', 'TENNIS', 'GOLF', 'RUGBY', 'HOCKEY']
        },
    
        // --- Medium Grids (Levels 16-35) ---
        { // Level 16 (9x9)
            grid: [
                ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
                ['J', 'K', 'L', 'M', 'O', 'U', 'N', 'T', 'A'],
                ['I', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U'],
                ['V', 'W', 'X', 'Y', 'Z', 'V', 'A', 'L', 'L'],
                ['E', 'Y', 'A', 'B', 'C', 'D', 'E', 'F', 'G'],
                ['H', 'I', 'J', 'K', 'L', 'P', 'L', 'A', 'I'],
                ['N', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'],
                ['U', 'V', 'W', 'X', 'H', 'I', 'L', 'L', 'Y'],
                ['Z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
            ],
            words: ['MOUNTAIN', 'VALLEY', 'PLAIN', 'HILL', 'RIVER', 'FOREST', 'DESERT', 'CANYON']
        },
        { // Level 17 (10x10)
            grid: [
                ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
                ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z'],
                ['X', 'C', 'V', 'B', 'R', 'E', 'A', 'K', 'F', 'A'],
                ['S', 'T', 'N', 'M', 'Q', 'W', 'E', 'R', 'T', 'Y'],
                ['L', 'U', 'N', 'C', 'H', 'U', 'I', 'O', 'P', 'A'],
                ['S', 'D', 'I', 'N', 'N', 'E', 'R', 'F', 'G', 'H'],
                ['J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'],
                ['Q', 'W', 'E', 'R', 'T', 'Y', 'S', 'N', 'A', 'C'],
                ['K', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G'],
                ['H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N']
            ],
            words: ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK', 'MEAL', 'FOOD', 'DRINK', 'WATER', 'JUICE']
        },
        { // Level 18 (9x10)
            grid: [
                ['H', 'T', 'M', 'L', 'X', 'Y', 'Z', 'A', 'B', 'C'],
                ['C', 'S', 'S', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
                ['J', 'A', 'V', 'A', 'S', 'C', 'R', 'I', 'P', 'T'],
                ['F', 'R', 'A', 'M', 'E', 'W', 'O', 'R', 'K', 'L'],
                ['L', 'I', 'B', 'R', 'A', 'R', 'Y', 'M', 'N', 'O'],
                ['B', 'A', 'C', 'K', 'E', 'N', 'D', 'P', 'Q', 'R'],
                ['F', 'R', 'O', 'N', 'T', 'E', 'N', 'D', 'S', 'T'],
                ['D', 'A', 'T', 'A', 'B', 'A', 'S', 'E', 'U', 'V'],
                ['S', 'E', 'R', 'V', 'E', 'R', 'W', 'X', 'Y', 'Z']
            ],
            words: ['HTML', 'CSS', 'JAVASCRIPT', 'FRAMEWORK', 'LIBRARY', 'BACKEND', 'FRONTEND', 'DATABASE', 'SERVER', 'CLIENT']
        },
         { // Level 19 (10x9)
            grid: [
                ['M', 'A', 'T', 'H', 'E', 'M', 'A', 'T', 'I'],
                ['C', 'S', 'C', 'I', 'E', 'N', 'C', 'E', 'J'],
                ['H', 'I', 'S', 'T', 'O', 'R', 'Y', 'K', 'L'],
                ['G', 'E', 'O', 'G', 'R', 'A', 'P', 'H', 'Y'],
                ['L', 'A', 'N', 'G', 'U', 'A', 'G', 'E', 'M'],
                ['A', 'R', 'T', 'S', 'N', 'O', 'P', 'Q', 'R'],
                ['M', 'U', 'S', 'I', 'C', 'S', 'T', 'U', 'V'],
                ['P', 'H', 'Y', 'S', 'I', 'C', 'S', 'W', 'X'],
                ['C', 'H', 'E', 'M', 'I', 'S', 'T', 'R', 'Y'],
                ['B', 'I', 'O', 'L', 'O', 'G', 'Y', 'Z', 'A']
            ],
            words: ['MATHEMATICS', 'SCIENCE', 'HISTORY', 'GEOGRAPHY', 'LANGUAGE', 'ARTS', 'MUSIC', 'PHYSICS', 'CHEMISTRY', 'BIOLOGY']
        },
        { // Level 20 (11x11)
            grid: [
                ['S', 'H', 'I', 'R', 'T', 'A', 'B', 'C', 'D', 'E', 'F'],
                ['P', 'A', 'N', 'T', 'S', 'G', 'H', 'I', 'J', 'K', 'L'],
                ['S', 'H', 'O', 'E', 'S', 'M', 'N', 'O', 'P', 'Q', 'R'],
                ['S', 'O', 'C', 'K', 'S', 'S', 'T', 'U', 'V', 'W', 'X'],
                ['H', 'A', 'T', 'Y', 'Z', 'J', 'A', 'C', 'K', 'E', 'T'],
                ['G', 'L', 'O', 'V', 'E', 'S', 'A', 'B', 'C', 'D', 'E'],
                ['S', 'C', 'A', 'R', 'F', 'F', 'G', 'H', 'I', 'J', 'K'],
                ['D', 'R', 'E', 'S', 'S', 'L', 'M', 'N', 'O', 'P', 'Q'],
                ['S', 'K', 'I', 'R', 'T', 'R', 'S', 'T', 'U', 'V', 'W'],
                ['C', 'O', 'A', 'T', 'X', 'Y', 'Z', 'A', 'B', 'C', 'D'],
                ['B', 'E', 'L', 'T', 'E', 'F', 'G', 'H', 'I', 'J', 'K']
            ],
            words: ['SHIRT', 'PANTS', 'SHOES', 'SOCKS', 'HAT', 'JACKET', 'GLOVES', 'SCARF', 'DRESS', 'SKIRT', 'COAT', 'BELT']
        },
        // ... Add levels 21-35 with varying 9x9 to 12x12 grids and 8-12 words ...
        // Example structure for one more medium:
        { // Level 21 (12x10)
            grid: [
                ['K', 'I', 'T', 'C', 'H', 'E', 'N', 'A', 'B', 'C'],
                ['B', 'A', 'T', 'H', 'R', 'O', 'O', 'M', 'D', 'E'],
                ['L', 'I', 'V', 'I', 'N', 'G', 'R', 'O', 'O', 'M'],
                ['B', 'E', 'D', 'R', 'O', 'O', 'M', 'F', 'G', 'H'],
                ['G', 'A', 'R', 'A', 'G', 'E', 'I', 'J', 'K', 'L'],
                ['G', 'A', 'R', 'D', 'E', 'N', 'M', 'N', 'O', 'P'],
                ['H', 'A', 'L', 'L', 'W', 'A', 'Y', 'Q', 'R', 'S'],
                ['O', 'F', 'F', 'I', 'C', 'E', 'T', 'U', 'V', 'W'],
                ['B', 'A', 'L', 'C', 'O', 'N', 'Y', 'X', 'Y', 'Z'],
                ['R', 'O', 'O', 'F', 'A', 'B', 'C', 'D', 'E', 'F'],
                ['F', 'L', 'O', 'O', 'R', 'G', 'H', 'I', 'J', 'K'],
                ['W', 'I', 'N', 'D', 'O', 'W', 'L', 'M', 'N', 'O']
            ],
            words: ['KITCHEN', 'BATHROOM', 'LIVINGROOM', 'BEDROOM', 'GARAGE', 'GARDEN', 'HALLWAY', 'OFFICE', 'BALCONY', 'ROOF', 'FLOOR', 'WINDOW', 'DOOR']
        },
         // (Continue adding levels 22 through 35 here)
        { // Level 35 (placeholder 10x10)
            grid: Array(10).fill(0).map(() => Array(10).fill(0).map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))),
            words: ['EXAMPLE', 'PLACEHOLDER', 'MEDIUM', 'THIRTYFIVE', 'RANDOMIZE', 'WORDSLIST', 'FILLER']
        },
    
    
        // --- Large Grids (Levels 36-50) ---
        { // Level 36 (13x13)
            grid: Array(13).fill(0).map(() => Array(13).fill(0).map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))),
            words: ['CONSTELLATION', 'GALAXY', 'NEBULA', 'SUPERNOVA', 'ASTEROID', 'COMET', 'SATELLITE', 'SPACESHIP', 'ASTRONOMY', 'TELESCOPE', 'UNIVERSE']
        },
        { // Level 37 (14x14)
            grid: Array(14).fill(0).map(() => Array(14).fill(0).map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))),
            words: ['ADVENTURE', 'EXPLORATION', 'JOURNEY', 'TREASURE', 'MYSTERY', 'DISCOVERY', 'QUEST', 'EXPEDITION', 'CHALLENGE', 'SURVIVAL', 'WILDERNESS', 'MAP']
        },
        { // Level 38 (15x15)
            grid: Array(15).fill(0).map(() => Array(15).fill(0).map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))),
            words: ['ARCHITECTURE', 'ENGINEERING', 'CONSTRUCTION', 'SKYSCRAPER', 'BRIDGE', 'TUNNEL', 'HIGHWAY', 'MATERIALS', 'DESIGN', 'BLUEPRINT', 'STRUCTURE', 'FOUNDATION', 'PROJECT']
        },
         { // Level 39 (13x14)
            grid: Array(13).fill(0).map(() => Array(14).fill(0).map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))),
            words: ['TEMPERATURE', 'PRESSURE', 'HUMIDITY', 'PRECIPITATION', 'WEATHER', 'CLIMATE', 'FORECAST', 'ATMOSPHERE', 'METEOROLOGY', 'TORNADO', 'HURRICANE', 'BLIZZARD']
        },
        { // Level 40 (14x13)
            grid: Array(14).fill(0).map(() => Array(13).fill(0).map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))),
            words: ['CARBOHYDRATE', 'PROTEIN', 'VITAMIN', 'MINERAL', 'NUTRITION', 'HEALTHY', 'CALORIES', 'FIBER', 'INGREDIENTS', 'RECIPE', 'DIET', 'METABOLISM', 'SUGAR']
        },
        // ... Add levels 41-49 with varying 13x13 to 16x16 grids and 10-15 words ...
        // Example structure for one more large:
        { // Level 41 (16x16)
            grid: Array(16).fill(0).map(() => Array(16).fill(0).map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))),
            words: ['ELEPHANT', 'GIRAFFE', 'ZEBRA', 'RHINOCEROS', 'HIPPOPOTAMUS', 'CROCODILE', 'CHEETAH', 'HYENA', 'BUFFALO', 'WILDEBEEST', 'GAZELLE', 'OSTRICH', 'SAVANNA', 'SAFARI']
        },
        // (Continue adding levels 42 through 49 here)
        { // Level 50 (placeholder 15x15)
            grid: Array(15).fill(0).map(() => Array(15).fill(0).map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))),
            words: ['FINALLEVEL', 'FIFTY', 'CONGRATULATIONS', 'LARGEGRID', 'COMPLETION', 'CHAMPION', 'WORDSEARCH', 'PUZZLEMASTER', 'FINISHED', 'VICTORY']
        }
    ];
    
// NEW: Define colors for found words
const foundWordColors = [
    '#e76f51', '#f4a261', '#e9c46a', '#2a9d8f', '#264653',
    '#a8dadc', '#457b9d', '#1d3557', '#e63946', '#6a994e',
    '#a7c957', '#9b5de5', '#f15bb5', '#fee440', '#00bbf9',
    '#ff758f', '#606c38' // Add more colors if needed
];
let foundColorIndex = 0; // To track which color to use next


    // --- Game State ---
    let currentLevelIndex = 0;
    let currentGrid = [];
    let wordsToFind = [];
    let foundWords = [];
    let isSelecting = false;
    let selectedCells = []; // Stores {element, row, col}

    // --- Initialization ---
    function initGame() {
        loadLevel(currentLevelIndex);
        setupEventListeners();
    }

    // --- Level Loading ---
    function loadLevel(levelIndex) {
        if (levelIndex >= levels.length) {
            displayMessage("Congratulations! You completed all levels!", true);
            nextLevelButton.style.display = 'none';
            restartLevelButton.textContent = 'Play Again?';
            currentLevelIndex = 0;
            return;
        }

        const level = levels[levelIndex];
        currentGrid = level.grid;
        wordsToFind = [...level.words].map(word => word.toUpperCase());
        foundWords = [];
        selectedCells = [];
        isSelecting = false;
        foundColorIndex = 0; // Reset color index for the new level
        currentLevelSpan.textContent = levelIndex + 1;
        updateWordCount();
        displayMessage("");
        nextLevelButton.style.display = 'none';
        restartLevelButton.textContent = 'Restart Level';

        generateGrid();
        populateWordList();
    }

    // --- Grid Generation ---
    function generateGrid() {
        gridContainer.innerHTML = '';
        gridContainer.style.gridTemplateColumns = `repeat(${currentGrid[0].length}, var(--cell-size))`;

        currentGrid.forEach((row, rowIndex) => {
            row.forEach((letter, colIndex) => {
                const cell = document.createElement('div');
                cell.classList.add('grid-cell');
                cell.textContent = letter;
                cell.dataset.row = rowIndex;
                cell.dataset.col = colIndex;
                gridContainer.appendChild(cell);
            });
        });
    }

    // --- Word List Population ---
    function populateWordList() {
        wordListElement.innerHTML = '';
        wordsToFind.forEach(word => {
            const li = document.createElement('li');
            li.textContent = word;
            li.dataset.word = word;
            wordListElement.appendChild(li);
        });
    }

    // --- Event Listeners Setup ---
    function setupEventListeners() {
        gridContainer.addEventListener('pointerdown', handleInteractionStart);
        gridContainer.addEventListener('pointermove', handleInteractionMove);
        document.addEventListener('pointerup', handleInteractionEnd);
        gridContainer.addEventListener('contextmenu', (e) => e.preventDefault());

        nextLevelButton.addEventListener('click', () => {
            currentLevelIndex++;
            loadLevel(currentLevelIndex);
        });

        restartLevelButton.addEventListener('click', () => {
             if (restartLevelButton.textContent === 'Play Again?') {
                 currentLevelIndex = 0;
             }
            loadLevel(currentLevelIndex);
        });
    }

    // --- Interaction Handlers ---
    function handleInteractionStart(event) {
        const cell = event.target.closest('.grid-cell');
        // Allow starting on ANY cell
        if (!cell) return;

        isSelecting = true;
        selectedCells = [];
        event.preventDefault();
        gridContainer.style.cursor = 'crosshair';

        clearSelectionClasses();
        addSelectedCell(cell);
    }
    function handleInteractionMove(event) {
        if (!isSelecting) return;
        event.preventDefault();
    
        const elementUnderPointer = document.elementFromPoint(event.clientX, event.clientY);
         if (!elementUnderPointer) return;
    
        const cell = elementUnderPointer.closest('.grid-cell');
    
        // Allow selecting over any cell unless it's part of the CURRENT selection path
        if (cell && !cell.classList.contains('selected')) { // No change needed here
             const lastCell = selectedCells[selectedCells.length - 1];
             if (isAdjacent(cell, lastCell)) {
                 addSelectedCell(cell);
             } else if (selectedCells.length === 1 && !isAdjacent(cell, lastCell) && cell !== lastCell.element){
                 clearSelectionClasses();
                 const firstCell = selectedCells[0];
                 selectedCells = [];
                 addSelectedCell(firstCell.element);
                 if (isAdjacent(cell, firstCell)) {
                     addSelectedCell(cell);
                 }
             }
        }
    }
    

    function isAdjacent(cell1Element, lastSelectedCell) {
        if (!lastSelectedCell) return true;

        const r1 = parseInt(cell1Element.dataset.row);
        const c1 = parseInt(cell1Element.dataset.col);
        const r2 = parseInt(lastSelectedCell.element.dataset.row);
        const c2 = parseInt(lastSelectedCell.element.dataset.col);

        return Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1;
    }

    function handleInteractionEnd(event) {
        if (!isSelecting) return;
        isSelecting = false;
        gridContainer.style.cursor = 'pointer';

        const wordWasFound = checkSelectedWord();

        if (!wordWasFound) {
             clearSelectionClasses();
        }
        // Always clear the logical selection data for the next attempt
        selectedCells = [];
    }

    // --- Selection Management ---
    function addSelectedCell(cell) {
        if (!cell) return;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        if (selectedCells.length > 0) {
             const lastCell = selectedCells[selectedCells.length - 1];
             if(lastCell.row === row && lastCell.col === col) return; // Avoid adding same cell twice
        }

        // If the cell was already found from a *previous* word, it will have '.found'.
        // Applying '.selected' will visually override it during the drag, which is fine.
        cell.classList.add('selected');
        selectedCells.push({ element: cell, row: row, col: col });
    }



    function clearSelectionClasses() {
        gridContainer.querySelectorAll('.grid-cell.selected').forEach(cell => {
            cell.classList.remove('selected');
        });
    }

    function getSelectedWord(reversed = false) {
        let word = '';
        const cellsToUse = reversed ? [...selectedCells].reverse() : selectedCells;
        cellsToUse.forEach(cellInfo => {
            // Ensure cellInfo and cellInfo.element exist before accessing textContent
            if (cellInfo && cellInfo.element) {
                 word += cellInfo.element.textContent; // Use textContent which is already uppercase from the grid data
            }
           // Original code used currentGrid, which is fine too:
           // word += currentGrid[cellInfo.row][cellInfo.col];
        });
        return word;
    }


    // --- Word Checking ---
    function checkSelectedWord() {
        if (selectedCells.length < 2) return false; // Return false if not enough letters

        const forwardWord = getSelectedWord(false);
        const backwardWord = getSelectedWord(true); // Check reverse selection too

        let wordFound = null;

        if (wordsToFind.includes(forwardWord) && !foundWords.includes(forwardWord)) {
            wordFound = forwardWord;
        } else if (wordsToFind.includes(backwardWord) && !foundWords.includes(backwardWord)) {
            // If reversed word is found, we need to mark the cells in the original selection order
            wordFound = backwardWord;
        }

        if (wordFound) {
            markWordAsFound(wordFound);
            updateWordCount();
            checkLevelComplete();
            return true; // Indicate a word was found
        } else {
           // Optionally add feedback for incorrect words here if desired
           // displayMessage("Not a word!");
           // setTimeout(() => displayMessage(""), 1000);
           return false; // Indicate no word was found
        }
    }


    function markWordAsFound(word) {
        foundWords.push(word);
        displayMessage(`Found: ${word}!`);

    // Get the next color and cycle through the palette
    const chosenColor = foundWordColors[foundColorIndex % foundWordColors.length];
    foundColorIndex++; // Move to the next color for the next word


        const listItem = wordListElement.querySelector(`li[data-word="${word}"]`);
        if (listItem) {
            listItem.classList.add('found');
        }

        // Mark the *logically selected* cells as found in the grid
        selectedCells.forEach(cellInfo => {
            if (cellInfo && cellInfo.element) {
               // Apply the background color directly
               cellInfo.element.style.backgroundColor = chosenColor;
   
               // Add a generic class to identify found cells (e.g., for text color)
               cellInfo.element.classList.add('found-cell');
   
               // Remove temporary selection highlight
               cellInfo.element.classList.remove('selected');
            }
       });
         // Don't clear selectedCells here, handleInteractionEnd does that
    }

    // --- Game State Updates ---
    function updateWordCount() {
        wordsFoundSpan.textContent = foundWords.length;
        totalWordsSpan.textContent = wordsToFind.length;
    }

    function checkLevelComplete() {
        if (foundWords.length === wordsToFind.length) {
            displayMessage(`Level ${currentLevelIndex + 1} Complete!`, true);
            nextLevelButton.style.display = 'inline-block';
        }
    }

    function displayMessage(msg, isPersistent = false) {
        messageArea.textContent = msg;
         if (!isPersistent && msg !== "") {
              setTimeout(() => {
                  if (messageArea.textContent === msg) {
                      messageArea.textContent = "";
                  }
              }, 1500);
         }
    }

    // --- Start the Game ---
    initGame();
});