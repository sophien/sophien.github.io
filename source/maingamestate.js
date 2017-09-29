// Constants
const spaceShipSpeed = 250;
const asteroidSpeedMin = 50;
const asteroidSpeedMax = 200;
const bulletSpeed = 150;
const minTimeBetweenPlayerShots = 0.3;
const timeBetweenAsteroids = 2.0;
const invulnerableTime = 0.5;
const playerLives = 3;

var SKCurrentPlayerScore = 0;
var SKCurrentPlayerLives = 0;
var SKPlayerScore = 0;
var SKEmitter;

// Create an empty object
var mainGameState = { }

// Add the preload function
mainGameState.preload = function() {
    console.log("Pre-loading the Game");
    //images
    this.game.load.image("space-bg", "assets/images/space-bg.jpg");
    this.game.load.image("space-ship", "assets/images/space-ship.png");  
    this.game.load.image("asteroid", "assets/images/rock.png");
    this.game.load.image("asteroid-medium", "assets/images/rock-2.png");
    this.game.load.image("asteroid-huge", "assets/images/rock-3.png");
    this.game.load.image("bullet", "assets/images/bullet.png");
    this.game.load.image("particle", "assets/images/particle.png");
    
    // music / audio
    this.game.load.audio("space-music", "assets/music/maingame.mp3");
    this.game.load.audio("asteroid-hit1", "assets/audio/asteroid_hit_01.mp3");
    this.game.load.audio("asteroid-hit2", "assets/audio/asteroid_hit_03.mp3");
    this.game.load.audio("asteroid-hit3", "assets/audio/asteroid_hit_06.mp3");
    this.game.load.audio("asteroid-death", "assets/audio/asteroid_death_02.mp3");
    this.game.load.audio("player-fire", "assets/audio/player_fire_01.mp3");
}

// Add the create function
mainGameState.create = function() {
    var displayOptions = {
        font: "Roboto-Light",
        fill: "#fff",
        fontWeight: "normal",
        fontSize: "18px",
        boundsAlignV: "middle"
    }    
    
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0,-300, 'space-bg');

    // Count scores!
    SKPlayerScore = 0;
    var scoreLabel = game.add.text(game.width * 0.9, game.height * 0.05, "SCORE", displayOptions);
    scoreLabel.anchor.setTo(0.5, 0.5);
    this.score = game.add.text(game.width * 0.9, game.height * 0.1, SKPlayerScore, displayOptions);
    this.score.anchor.setTo(0.5, 0.5);
    this.score.fixedToCamera = true;
    
    // Set initial player lives!
    this.playerLives = playerLives;
    SKCurrentPlayerLives = playerLives;
    //Text to display player lives
    var lives = game.add.text(game.width * 0.1, game.height * 0.05, "LIVES", displayOptions);
    lives.anchor.setTo(0.5, 0.5);
    this.playerLife = game.add.text(game.width * 0.1, game.height * 0.1, this.playerLives, displayOptions);
    this.playerLife.anchor.setTo(0.5, 0.5);
    this.playerLife.fixedToCamera = true;
    
    
    // Place the space ship in the middle of the screen
    var midScreenX = game.width/2;
    var midScreenY = game.height/2;
    
    // Read keyboard input
    this.cursors = game.input.keyboard.createCursorKeys();
    
    // First find the middle of the screen
    this.spaceShip = game.add.sprite(midScreenX, game.height, 'space-ship');
    // Set the middle of the sprite to anchor the middle of the screen
    this.spaceShip.anchor.set(0.5, 1);
    
    // Enable the player to move the space ship
    game.physics.arcade.enable(this.spaceShip);
    
    // Adding some music    
    this.music = game.add.audio('space-music');
    this.music.play();
    this.music.volume = 0.05;
    this.music.loopFull();
    
    //adding audio for when bullets are shot
    this.bulletShot = game.add.audio('player-fire');
    
    // Asteroid timer
    this.asteroidTimer = timeBetweenAsteroids;
    this.asteroids = game.add.group();
    
    // Set bulletTimer (not allowed to shoot bullets more often than every 0.3 seconds)
    this.bulletTimer = minTimeBetweenPlayerShots;
    this.bullets = game.add.group();
    
    // Particle effect
    SKEmitter = game.add.emitter(0,0,100);
    SKEmitter.makeParticles('particle');
    SKEmitter.gravity = 200;
    
    // Set timer for player when hit by an asteroid (invulnerable time)
    this.playerInvulnerable = 0.0;
}

// Add the update function
mainGameState.update = function() {
    mainGameState.updatePlayer();
    mainGameState.updatePlayerBullets();
    
    this.asteroidTimer -= game.time.physicsElapsed;
    if(this.asteroidTimer <= 0.0) {
        this.spawnAsteroids();
        this.asteroidTimer = timeBetweenAsteroids;
    } 
    
    for(var i = 0; i < this.asteroids.children.length; i++) {
        if(this.asteroids.children[i].position.y > (game.height + 100)) {
            this.asteroids.children[i].destroy();
        }
    }    
    
    // Collision detection
    // Asteroids and bullets
    
    game.physics.arcade.collide(this.asteroids, this.bullets, mainGameState.onAsteroidAndBulletCollision, null, this);
    // Asteroids and space ship
    game.physics.arcade.collide(this.asteroids, this.spaceShip, mainGameState.onAsteroidAndPlayerCollision, null, this);
    
    // Update the scores only when the score is changed
    if(SKPlayerScore >= SKCurrentPlayerScore) {      
        SKCurrentPlayerScore += 1;
        this.score.setText(SKPlayerScore);          
    }
    
    
    // Update lives only when the lives are changed
    if(this.playerLives <= SKCurrentPlayerLives) {
        SKCurrentPlayerLives -= 1;
        this.playerLife.setText(this.playerLives);
    }
    
    //Let the player be invulnerable for a short time after a hit
    if(this.playerInvulnerable > 0) { //If invulnerable
        this.spaceShip.alpha = 0.5; // Fade out space ship when invulnberable
        this.playerInvulnerable -= game.time.physicsElapsed; // count down time as invulnerable
        
        if(this.playerInvulnerable < 0) {
            this.spaceShip.alpha = 1.0;
        }        
    }
    
    //GAME OVER!
    if(this.playerLives <= 0) {
        game.state.start("GameOver");
    }
}

/***
*
*
*/
mainGameState.updatePlayer = function() {
    var spaceShipHeight = this.spaceShip.height;
    var spaceShipWidth = this.spaceShip.width;
    
    // Move the space ship around the screen
    if (this.cursors.right.isDown) {
        this.spaceShip.body.velocity.x = spaceShipSpeed;
    }
    else if (this.cursors.left.isDown) {
        this.spaceShip.body.velocity.x = -spaceShipSpeed;
    }
    else {        
        this.spaceShip.body.velocity.x = 0;
    }
    
    if (this.cursors.up.isDown) {
        this.spaceShip.body.velocity.y = -spaceShipSpeed;
    }
    else if (this.cursors.down.isDown) {
        this.spaceShip.body.velocity.y = spaceShipSpeed;
    }
    else {        
        this.spaceShip.body.velocity.y = 0;
    }    
    
    // Stop the space ship before it gets outside the screen (left)
    if (this.spaceShip.position.x < (spaceShipWidth/2) && this.cursors.left.isDown) {
        this.spaceShip.body.velocity.x = 0;
    }
    // Stop the space ship before it gets outside the screen (right)
    if (this.spaceShip.position.x > (game.width-spaceShipWidth/2) && this.cursors.right.isDown) {
        this.spaceShip.body.velocity.x = 0;
    }
    
    // Stop the space ship from moving outside the screen (bottom)
    if (this.spaceShip.position.y > game.height &&
       this.cursors.down.isDown) {
        this.spaceShip.body.velocity.y = 0;
    }
    // Stop the space ship from moving on the top half of the screen
    if (this.spaceShip.position.y < (game.height/2 + spaceShipHeight) && this.cursors.up.isDown) {
        this.spaceShip.body.velocity.y = 0;
    }
    
}

/***
*
*
*/
mainGameState.updatePlayerBullets = function() {
    this.bulletTimer -= game.time.physicsElapsed;
    // Keep track of fire key (Z)
    this.fireKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    
    if(this.bulletTimer <= 0.0) {
        if(this.fireKey.isDown) {
            mainGameState.spawnBullets();
            this.bulletTimer = minTimeBetweenPlayerShots;
        }
    }
    
    for(var i = 0; i < this.bullets.children.length; i++) {
        if(this.bullets.children[i].position.y < (0 - 100)) {
            this.bullets.children[i].destroy();
        } 
    }
}

/***
*
*
*/
mainGameState.spawnAsteroids = function() {
    var asteroidSelection = ['asteroid', 'asteroid-medium', 'asteroid-huge'];
    var randomAsteroid = Math.floor(Math.random() * 3);    
    var randomSize = Math.random() + 0.5;    
    var asteroidWidth = game.cache.getImage(asteroidSelection[randomAsteroid]).width; // Get asteroidwidth to not allow asteroid outside the screen
    var randomX = game.rnd.integerInRange(asteroidWidth, game.width - asteroidWidth);
    var asteroidSpeed = Math.floor(Math.random() * (asteroidSpeedMax - asteroidSpeedMin) + asteroidSpeedMin);
    var asteroidRotationSpeed = Math.floor(Math.random() * (asteroidSpeedMax - asteroidSpeedMin) + asteroidSpeedMin);
    var asteroid = game.add.sprite(randomX, 0, asteroidSelection[randomAsteroid]);
    
    asteroid.health = 100 * randomAsteroid;    
    asteroid.anchor.setTo(0.5, 0.5);
    asteroid.scale.setTo(0.5,0.5);
    game.physics.arcade.enable(asteroid);
    asteroid.body.immovable = true;
    asteroid.body.velocity.y = asteroidSpeed;
    asteroid.body.angularVelocity = asteroidRotationSpeed;
    this.asteroids.add(asteroid);
}

/***
*
*
*/
mainGameState.spawnBullets = function() {
    var x = this.spaceShip.position.x;
    var y = this.spaceShip.position.y - this.spaceShip.height;
    var bullet = game.add.sprite(x, y, 'bullet');
    bullet.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(bullet);
    bullet.body.velocity.y = -bulletSpeed;
    this.bulletShot.play();
    this.bullets.add(bullet);
}

/***
* What will happen when a bullet hits an asteroid
*
*/
mainGameState.onAsteroidAndBulletCollision = function(asteroid, bullet) {
    
    if(asteroid.key.includes('asteroid')) {        
        if(asteroid.health <= 0) {
            SKPlayerScore += 1;
            mainGameState.particelBurst(10, asteroid.position.x, asteroid.position.y);
            //adding audio for when asteroids are hit by a bullet
            var asteroidHitAudio = ['asteroid-hit1','asteroid-hit2','asteroid-hit3'];
            var index = game.rnd.integerInRange(0, asteroidHitAudio.length - 1);
            this.asteroidHit = game.add.audio(asteroidHitAudio[index]);
            this.asteroidHit.play();
            asteroid.pendingDestroy = true;            
        }
        else {
            mainGameState.particelBurst(3, asteroid.position.x, asteroid.position.y);
            asteroid.health -= 100;
        }
    }
    bullet.pendingDestroy = true;    
}

/***
* What will hapen when an asteroid hits a space ship
* Count down lives and destroy asteroid
*/
mainGameState.onAsteroidAndPlayerCollision = function(asteroid, spaceShip) {
    
    if(this.playerInvulnerable > 0) {
        if(asteroid.key.includes('asteroid')) {
            asteroid.pendingDestroy = true;    
        }   
        else {
            spaceShip.pendingDestroy = true;
        }
        return;
    }
    
    if(asteroid.key.includes('asteroid')) {
        asteroid.pendingDestroy = true;    
    }
    else {
        spaceShip.pendingDestroy = true;
    }
    this.playerLives -= 1; // count down lives
    this.playerInvulnerable = invulnerableTime;
}

mainGameState.particelBurst = function(burstEffect, x, y) {
    SKEmitter.x = x;
    SKEmitter.y = y;
    SKEmitter.start(true, 2000, null, burstEffect);
} 

