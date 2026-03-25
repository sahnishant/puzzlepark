/* Dashboard Particle Background */
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '-1';
        canvas.style.pointerEvents = 'none';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let width, height, stars = [];

        function init() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            
            stars = [];
            for (let i = 0; i < 150; i++) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    size: Math.random() * 2,
                    opacity: Math.random(),
                    speed: Math.random() * 0.05
                });
            }
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = 'white';
            
            stars.forEach(star => {
                ctx.globalAlpha = star.opacity;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
                
                star.opacity += star.speed;
                if (star.opacity > 1 || star.opacity < 0) {
                    star.speed = -star.speed;
                }
            });
            
            requestAnimationFrame(draw);
        }

        window.addEventListener('resize', init);
        init();
        draw();
    });
})();
