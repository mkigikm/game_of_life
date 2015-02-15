function GameOfLifeController (parent, game) {
  this.game = game;
  this.view = new GameOfLifeView(this, parent, game.rows, game.cols);
  var timer = null;
}

//html buttons
GameOfLifeController.prototype.randomize = function (p) {
  this.naughto();
  this.game.randomize(p);
  this.view.reset_display();
  this.view.update_display(this.game);
};

GameOfLifeController.prototype.clear = function () {
  this.game.randomize(0);
  this.view.update_display(this.game);
};

GameOfLifeController.prototype.next_generation = function () {
  this.game.next_generation();
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

//html clicks
GameOfLifeController.prototype.cell_click = function (row, col) {
  var value = (this.game.grid[row][col] + 1) % 2;

  this.game.grid[row][col] = value;
  this.view.cells[row][col].update_display(value);
}

function GameOfLifeView (controller, parent, rows, cols) {
  this.rows = rows;
  this.cols = cols;
  this.cells = new Array(rows);

  for (var i = 0; i < rows; i++) {
    this.cells[i] = new Array(cols);

    for (var j = 0; j < cols; j++)
      this.cells[i][j] = new CellView(controller, parent, i, j);
  }
}

GameOfLifeView.prototype.update_display = function (game) {
  for (var i = 0; i < this.rows; i++) {
    for (var j = 0; j < this.cols; j++) {
      this.cells[i][j].update_display(game.grid[i][j]);
    }
  }
};

GameOfLifeView.prototype.reset_display = function () {
  for (var i = 0; i < this.rows; i++) {
    for (var j = 0; j < this.cols; j++) {
      this.cells[i][j].reset_display();
    }
  }
};

function CellView (controller, parent, row, col) {
  this.div = document.createElement("div");
  this.reset_display();
  parent.appendChild(this.div);

  this.div.addEventListener("click",
    function() {
      controller.cell_click(row, col);
    });
};

CellView.prototype.update_display = function (value) {
  if (value === 1) {
    this.div.className = "alive";
  } else {
    var current = this.div.className;

    this.div.className = current === "unvisited" ? current : "dead";
  }
};

CellView.prototype.reset_display = function () {
  this.div.className = "unvisited";
}

function GameOfLife (rows, cols, underpop, overpop, birth) {
  this.rows = rows;
  this.cols = cols;
  this.underpop = underpop;
  this.overpop = overpop;
  this.birth = birth;

  this.grid = new Array(rows);

  for (var i = 0; i < rows; i++) {
    this.grid[i] = new Array(cols);

    for (var j = 0; j < cols; j++)
      this.grid[i][j] = 0;
  }
}

GameOfLife.prototype.randomize = function (p) {
  for (var i = 0; i < this.rows; i++) {
    for (var j = 0; j < this.cols; j++)
      this.grid[i][j] = p > Math.random() ? 1 : 0;
  }
};

GameOfLife.prototype.wrap_add = function (i, d_i, max) {
  d_i = (d_i + i) % max;
  if (d_i === -1) d_i = max - 1;

  return d_i;
};

GameOfLife.prototype.count_neighbors = function () {
  for (var i = 0; i < this.rows; i++) {
    for (var j = 0; j < this.cols; j++) {
      var neighbors = 0;

      for (var d_i = -1; d_i < 2; d_i++) {
        for (var d_j = -1; d_j < 2; d_j++) {
          if (d_i === 0 && d_j === 0) continue;

          var n_i = this.wrap_add(i, d_i, this.rows);
          var n_j = this.wrap_add(j, d_j, this.cols);

          if (this.grid[n_i][n_j] & 1 === 1)
            neighbors += 1;
        }
      }

      this.grid[i][j] = this.grid[i][j] | (neighbors << 1);
    }
  }
};

GameOfLife.prototype.birth_next_generation = function () {
  for (var i = 0; i < this.rows; i++) {
    for (var j = 0; j < this.cols; j++) {
      var neighbors = this.grid[i][j] >> 1;
      var alive = this.grid[i][j] & 1 === 1;

      if (alive) {
        this.grid[i][j] =
          neighbors < this.underpop || neighbors > this.overpop ? 0 : 1;
      } else {
        this.grid[i][j] = neighbors === this.birth ? 1 : 0;
      }
    }
  }
};

GameOfLife.prototype.next_generation = function () {
  this.count_neighbors();
  this.birth_next_generation();
};

function setup () {
  var game = new GameOfLife(50,50,2,3,3);
  c = new GameOfLifeController(document.getElementById("board"), game);
}

var c;
