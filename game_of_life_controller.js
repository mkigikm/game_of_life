function GameOfLifeController (parent, game) {
  this.game = game;
  this.view = new GameOfLifeView(this, parent, game.rows, game.cols);
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
};

GameOfLifeController.prototype.nextGeneration = function () {
  this.game.nextGeneration();
  this.view.updateDisplay(this.game);
};

GameOfLifeController.prototype.auto = function () {
  if (this.timer === null) {
    this.nextGeneration();
    var me = this;
    this.timer = setInterval(function () { me.nextGeneration() }, 500);
  }
};

GameOfLifeController.prototype.naughto = function () {
  clearInterval(this.timer);
  this.timer = null;
};

GameOfLifeController.prototype.gameInput = function () {
  var board = document.getElementById("game_input").value;
  this.clear();

  var lines = board.split("\n");

  var rowOffset = ~~((this.game.rows - lines.length) / 2);

  var maxColumns = Math.max.apply(null,
      lines.map(function (line) { return line.length;})
    );
  var colOffset = ~~((this.game.cols - maxColumns) / 2);

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];

    for (var j = 0; j < line.length; j++) {
      if (line[j] === "*") {
        this.game.setCellAlive(i + rowOffset, j + colOffset);
      }
    }
  }

  this.view.updateDisplay(this.game);
};

//html clicks
GameOfLifeController.prototype.cellClick = function (i, j) {
  this.view.cells[i][j].updateDisplay(this.game.flipCellState(i, j));
}
