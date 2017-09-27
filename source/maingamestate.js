// Constants
const spaceShipSpeed = 250;

// Create an empty object
var mainGameState = { }
// Add the preload function
mainGameState.preload = function() {
    console.log("Pre-loading the Game");
    this.game.load.image("space-bg", "assets/images/space-bg.jpg");
    this.game.load.image("space-ship", "assets/images/player-ship.png");    
}

// Add the create function
mainGameState.create = function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    game.add.sprite(0,-300, 'space-bg');
    
    // add the space ship to the middle of the screen
    var midScreenX = game.width/2;
    var midScreenY = game.height/2;
    
    this.cursors = game.input.keyboard.createCursorKeys();
    
    // First find the middle of the screen
    this.spaceShip = game.add.sprite(midScreenX, midScreenY, 'space-ship');
    // Set the middle of the sprite to anchor the middle of the screen
    this.spaceShip.anchor.set(0.5, 0.5);
    // Enable the player to move the space ship
    game.physics.arcade.enable(this.spaceShip);        
}

// Add the update function
mainGameState.update = function() {
    mainGameState.updatePlayer();
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
    if (this.spaceShip.position.x > (game.width-spaceShipWidth/2) &&                          this.cursors.right.isDown) {
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