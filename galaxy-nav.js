(function() {
    // Wait for the DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        // Create the navigation container
        const nav = document.createElement('nav');
        nav.className = 'galaxy-nav';
        
        const homeUrl = '../../index.html';
        
        nav.innerHTML = `
            <div class="galaxy-nav-links">
                <a href="${homeUrl}" class="galaxy-back-btn">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
                    </svg>
                    Back to Galaxy
                </a>
                <button id="randomGameBtnNav" class="galaxy-back-btn icon-only" title="Random Game">
                   🎲
                </button>
            </div>
        `;
        
        document.body.prepend(nav);

        // Random Game Handler
        const randomBtn = document.getElementById('randomGameBtnNav');
        if (randomBtn) {
            randomBtn.addEventListener('click', function() {
                // If the game registry is available centrally, we could pick from it.
                // For now, Since we don't have the registry in every game, 
                // we'll just go back to home and let the home page handle it? 
                // Actually, let's just go back to home to avoid duplication of data.
                window.location.href = homeUrl;
            });
        }
    });
})();
