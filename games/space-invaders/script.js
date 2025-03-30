const config = {
    type: Phaser.AUTO,
    width: 600,
    height: 400,
    backgroundColor: '#000',
    parent: 'phaser-game',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let bullets;
let enemies;
let score = 0;
let scoreText;

function preload() {
    // Load custom shapes for bullets and enemies
    this.load.image('player', 'https://examples.phaser.io/assets/sprites/player.png'); // Player sprite
}

function create() {
    // Player
    player = this.physics.add.sprite(300, 350, 'player').setCollideWorldBounds(true);

    // Bullets
    bullets = this.physics.add.group({
        classType: Phaser.GameObjects.Graphics,
        runChildUpdate: true
    });

    // Enemies
    enemies = this.physics.add.group({
        classType: Phaser.GameObjects.Graphics,
        runChildUpdate: true
    });

    // Create enemies with custom shapes
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 8; j++) {
            const enemy = enemies.get();
            enemy.clear();
            enemy.fillStyle(0xff0000, 1); // Red color
            enemy.fillTriangle(0, 0, 20, 40, 40, 0); // Triangle shape
            enemy.setPosition(50 + j * 60, 50 + i * 40);
            enemy.setActive(true);
            enemy.setVisible(true);
            this.physics.world.enable(enemy);
            enemy.body.setVelocity(50, 0);
        }
    }

    // Score
    scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '16px', fill: '#fff' });

    // Input
    cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown-SPACE', shootBullet, this);

    // Collisions
    this.physics.add.overlap(bullets, enemies, destroyEnemy, null, this);
}

function update() {
    // Player movement
    if (cursors.left.isDown) {
        player.setVelocityX(-200);
    } else if (cursors.right.isDown) {
        player.setVelocityX(200);
    } else {
        player.setVelocityX(0);
    }

    // Move enemies
    enemies.children.iterate(enemy => {
        if (enemy.x >= 550) {
            enemy.body.setVelocityX(-50);
            enemy.y += 10;
        } else if (enemy.x <= 50) {
            enemy.body.setVelocityX(50);
            enemy.y += 10;
        }
    });
}

function shootBullet() {
    const bullet = bullets.get();
    if (bullet) {
        bullet.clear();
        bullet.fillStyle(0xffff00, 1); // Yellow color
        bullet.fillCircle(0, 0, 5); // Circle shape
        bullet.setPosition(player.x + player.width / 2, player.y - 10);
        bullet.setActive(true);
        bullet.setVisible(true);
        this.physics.world.enable(bullet);
        bullet.body.velocity.y = -300;
    }
}

function destroyEnemy(bullet, enemy) {
    bullet.destroy();
    enemy.destroy();
    score += 10;
    scoreText.setText(`Score: ${score}`);
}