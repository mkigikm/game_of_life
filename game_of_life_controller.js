function GameOfLifeController (parent, game) {
  this.game = game;
  this.view = new GameOfLifeView(this, parent, game.rows, game.cols);
  this.timer = null;
}

//html buttons
GameOfLifeController.prototype.randomize = function (p) {
  this.naughto();
  this.game.randomize(p);
  this.view.reset_display();
  this.view.update_display(this.game);
};

GameOfLifeController.prototype.clear = function () {
  this.randomize(0);
};

GameOfLifeController.prototype.next_generation = function () {
  this.game.nextGeneration();
  this.view.update_display(this.game);
};

GameOfLifeController.prototype.auto = function () {
  if (this.timer === null) {
    this.next_generation();
    var me = this;
    this.timer = setInterval(function () { me.next_generation() }, 500);
  }
};

GameOfLifeController.prototype.naughto = function () {
  clearInterval(this.timer);
  this.timer = null;
};

GameOfLifeController.prototype.game_input = function () {
  var board = document.getElementById("game_input").value;
  this.clear();

  var lines = board.split("\n");

  var row_offset = ~~((this.game.rows - lines.length) / 2);

  var max_columns = Math.max.apply(null,
      lines.map(function (line) { return line.length;})
    );
  var col_offset = ~~((this.game.cols - max_columns) / 2);

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];

    for (var j = 0; j < line.length; j++) {
      if (line[j] === "*")
        this.game.grid[i + row_offset][j + col_offset] = 1;
    }
  }

  this.view.update_display(this.game);
};

//html clicks
GameOfLifeController.prototype.cell_click = function (row, col) {
  var value = (this.game.grid[row][col] + 1) % 2;

  this.game.grid[row][col] = value;
  this.view.cells[row][col].update_display(value);
}
