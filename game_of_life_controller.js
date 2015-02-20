function GameOfLifeController (parent, game) {
  this.game = game;
  this.view = new GameOfLifeView(this, parent, game.rows, game.cols);
  this.view.updateDisplay(game);
  this.timer = null;
}

//html buttons
GameOfLifeController.prototype.randomize = function (p) {
  this.naughto();
  this.game.randomize(p);
  this.view.resetDisplay();
  this.view.updateDisplay(this.game);
};

GameOfLifeController.prototype.clear = function () {
  this.randomize(0);
  this.view.resetDisplay();
};

GameOfLifeController.prototype.nextGeneration = function () {
  this.game.nextGeneration();
  this.view.updateDisplay(this.game);
};

GameOfLifeController.prototype.auto = function () {
  if (this.timer === null) {
    this.nextGeneration();
    var me = this;
    this.timer = setInterval(function () { me.nextGeneration() }, 1);
  }
};

GameOfLifeController.prototype.naughto = function () {
  clearInterval(this.timer);
  this.timer = null;
};

GameOfLifeController.prototype.gameInput = function () {
  this.clear();
  var board = document.getElementById("game_input").value;
  parseGame(board, this.game);
  this.view.updateDisplay(this.game);
};

//html clicks
GameOfLifeController.prototype.cellClick = function (i, j) {
  this.game.nextCellState(i, j);
  this.view.cells[i][j].updateDisplay(this.game.getCellState(i, j));
}
