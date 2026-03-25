(function() {
    // Wait for the DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        // Create the navigation container
        const nav = document.createElement('nav');
        nav.className = 'galaxy-nav';
        
        // Find the relative path to the root index.html
        // Since all games are in /games/game-name/, they need to go up two directories
        // But some might be in different structures. We'll check the current script source if possible.
        // For simplicity in this project structure, it's always ../../index.html
        const homeUrl = '../../index.html';
        
        nav.innerHTML = `
            <a href="${homeUrl}" class="galaxy-back-btn">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
                </svg>
                Back to Galaxy
            </a>
        `;
        
        // Prepend to the body to keep it at the top
        document.body.prepend(nav);
    });
})();
