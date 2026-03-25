/* Galaxy Progress System - Unified Scoring & Ranks */
(function() {
    const GALAXY_STORAGE_KEY = 'whimsy_game_galaxy_data';
    
    const RANKS = [
        { minXp: 0, name: 'Stardust Cadet' },
        { minXp: 500, name: 'Nebula Voyager' },
        { minXp: 1500, name: 'Comet Chaser' },
        { minXp: 4000, name: 'Planet Hopper' },
        { minXp: 10000, name: 'Interstellar Knight' },
        { minXp: 25000, name: 'Galaxy Overlord' }
    ];

    window.Galaxy = {
        getData: function() {
            const data = localStorage.getItem(GALAXY_STORAGE_KEY);
            return data ? JSON.parse(data) : { xp: 0, gamesPlayed: {}, totalPlayed: 0 };
        },
        
        saveData: function(data) {
            localStorage.setItem(GALAXY_STORAGE_KEY, JSON.stringify(data));
            // Dispatch event for UI updates
            window.dispatchEvent(new CustomEvent('galaxyProgressUpdate', { detail: data }));
        },
        
        recordWin: function(gameId, xpEarned = 100) {
            const data = this.getData();
            data.xp += xpEarned;
            data.totalPlayed += 1;
            data.gamesPlayed[gameId] = (data.gamesPlayed[gameId] || 0) + 1;
            this.saveData(data);
            console.log(`[Galaxy] +${xpEarned} XP earned! Total XP: ${data.xp}`);
        },

        getRank: function(xp) {
            let currentRank = RANKS[0];
            for (const rank of RANKS) {
                if (xp >= rank.minXp) currentRank = rank;
                else break;
            }
            return currentRank;
        },

        getProgressToNextRank: function(xp) {
            const currentRank = this.getRank(xp);
            const currentIndex = RANKS.findIndex(r => r.name === currentRank.name);
            const nextRank = RANKS[currentIndex + 1];
            
            if (!nextRank) return { percent: 100, needed: 0 };
            
            const range = nextRank.minXp - currentRank.minXp;
            const progress = xp - currentRank.minXp;
            return {
                percent: Math.round((progress / range) * 100),
                needed: nextRank.minXp - xp
            };
        }
    };
})();
