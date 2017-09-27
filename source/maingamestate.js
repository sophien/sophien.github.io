// Create an empty object
var mainGameState = {}
// Add the preload function
mainGameState.preload = function() {
    console.log("Pre-loading the Game");
    this.game.load.image("space-bg", "assets/images/space-bg.jpg");
    this.game.load.image("space-ship", "assets/images/player-ship.png");
}

// Add the create function
mainGameState.create = function() {
    game.add.sprite(0,-300, 'space-bg');
    
    // add the space ship to the middle of the screen
    var midScreenX = game.width/2;
    var midScreenY = game.height/2;
    
    // First find the middle of the screen
    this.spaceShip = game.add.sprite(midScreenX, midScreenY, 'space-ship');
    // Set the middle of the sprite to anchor the middle of the screen
    this.spaceShip.anchor.set(0.5, 0.5);
    this.spaceShip.angle = 30;
    
}

// Add the update function
mainGameState.update = function() {
    
}