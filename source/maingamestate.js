// Constants
const spaceShipSpeed = 250;
const asteroidSpeedMin = 50;
const asteroidSpeedMax = 200;

// Create an empty object
var mainGameState = { }
// Add the preload function
mainGameState.preload = function() {
    console.log("Pre-loading the Game");
    this.game.load.image("space-bg", "assets/images/space-bg.jpg");
    this.game.load.image("space-ship", "assets/images/player-ship.png");  
    this.game.load.image("asteroid", "assets/images/asteroid-small-02.png");
    this.game.load.image("asteroid-medium", "assets/images/asteroid-medium-01.png");
    this.game.load.image("asteroid-small", "assets/images/asteroid-small-01.png");
    this.game.load.audio("space-music","assets/music/maingame.mp3");
}

// Add the create function
mainGameState.create = function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0,-300, 'space-bg');
    
    // Place the space ship in the middle of the screen
    var midScreenX = game.width/2;
    var midScreenY = game.height/2;
    
    // Read keyboard input
    this.cursors = game.input.keyboard.createCursorKeys();
    
    // First find the middle of the screen
    this.spaceShip = game.add.sprite(midScreenX, midScreenY, 'space-ship');
    // Set the middle of the sprite to anchor the middle of the screen
    this.spaceShip.anchor.set(0.5, 0.5);
    
    // Enable the player to move the space ship
    game.physics.arcade.enable(this.spaceShip);
    
    // Adding some music    
    this.music = game.add.audio('space-music');
    this.music.play();
    this.music.volume = 0.01;
    this.music.loopFull();
    
    this.asteroidTimer = 2.0;
    this.asteroids = game.add.group();
}

// Add the update function
mainGameState.update = function() {
    mainGameState.updatePlayer();
    this.asteroidTimer -= game.time.physicsElapsed;
    
    if(this.asteroidTimer <= 0.0) {
        this.spawnAsteroids();
        this.asteroidTimer = 2.0;
    }
   
    for(var i = 0; i < this.asteroids.children.length; i++) {
        if(this.asteroids.children[i].position.y > (game.height + 100)) {
            this.asteroids.children[i].destroy();
        }
    }    
}

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
    if (this.spaceShip.position.y > (game.height - spaceShipHeight/2) &&
       this.cursors.down.isDown) {
        this.spaceShip.body.velocity.y = 0;
    }
    // Stop the space ship from moving on the top half of the screen
    if (this.spaceShip.position.y < (game.height/2 + spaceShipHeight) && this.cursors.up.isDown) {
        this.spaceShip.body.velocity.y = 0;
    }
    
}

mainGameState.spawnAsteroids = function() {
    var asteroidSelection = ['asteroid', 'asteroid-medium', 'asteroid-small'];
    var randomAsteroid = Math.floor(Math.random() * 3);    
    var randomSize = Math.random() + 0.5;
    var randomX = game.rnd.integerInRange(0, game.width);
    var asteroidSpeed = Math.floor(Math.random() * (asteroidSpeedMax - asteroidSpeedMin) + asteroidSpeedMin);
    var asteroidRotationSpeed = Math.floor(Math.random() * (asteroidSpeedMax - asteroidSpeedMin) + asteroidSpeedMin);
    
    var asteroid = game.add.sprite(randomX, 0, asteroidSelection[randomAsteroid]);
    
    asteroid.anchor.setTo(0.5, 0.5);
    asteroid.scale.setTo(0.5,0.5);
    game.physics.arcade.enable(asteroid);
    asteroid.body.velocity.y = asteroidSpeed;
    asteroid.body.angularVelocity = asteroidRotationSpeed;
    this.asteroids.add(asteroid);
}

mainGameStat.spawnBullets = function() {
    
}