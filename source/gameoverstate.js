// Create an empty object
var gameOverState = { }

gameOverState.preload = function() {

}

gameOverState.create = function() {
    var textStyle = {font: "14px Arial", fill: "#fff", align: "center"};
    
    //GAME OVER
    var title = game.add.text(game.width * 0.5, game.height * 0.2, "GAME OVER", textStyle);
    title.anchor.setTo(0.5, 0.5);
    
    //SCORE
    var scoreTitle = game.add.text(game.width * 0.5, game.height * 0.6, "Your Score", textStyle);
    scoreTitle.anchor.setTo(0.5, 0.5);
    var score = game.add.text(game.width * 0.5, game.height * 0.65, playerScore, textStyle);
    score.anchor.setTo(0.5, 0.5);
    
    this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
}

gameOverState.update = function() {
    if(this.spaceKey.isDown) {
        game.state.start("MainGame");
    }
}