// Create an empty object
var gameOverState = { }

gameOverState.preload = function() {
    this.game.load.image("space-bg", "assets/images/space-bg.jpg");
}

gameOverState.create = function() {
    game.add.sprite(-500,0, 'space-bg');
    var textStyleGO = {
        font: "Roboto-Light",
        fill: "#fff",
        fontWeight: "normal",
        fontSize: "24px",
        boundsAlignV: "middle"
    }
    
    var textStyleScore = {
        font: "Roboto-Light",
        fill: "#fff",
        fontWeight: "normal",
        fontSize: "18px",
        boundsAlignV: "middle"
    }
    
    //GAME OVER
    var title = game.add.text(game.width * 0.5, game.height * 0.2, "GAME OVER", textStyleGO);
    title.anchor.setTo(0.5, 0.5);
    
    //SCORE
    var scoreTitle = game.add.text(game.width * 0.5, game.height * 0.6, "YOUR SCORE", textStyleScore);
    scoreTitle.anchor.setTo(0.5, 0.5);
    var score = game.add.text(game.width * 0.5, game.height * 0.65, SKPlayerScore, textStyleScore);
    score.anchor.setTo(0.5, 0.5);
    
    this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
}

gameOverState.update = function() {
    if(this.spaceKey.isDown) {
        game.state.start("MainGame");
    }
}