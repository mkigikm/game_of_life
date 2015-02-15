function Cell (parent, row, col, game) {
  this.row = row;
  this.col = col;
  this.game = game;

  this.div = document.createElement("div");
  parent.appendChild(this.div);

  this.div.addEventListener("click", function(){ g.board[row][col].swap_state() });
  this.update_display();
}

Cell.prototype.swap_state = function () {
  console.log(this.row);
  console.log(this.col);
  this.set_value((this.get_value() + 1) % 2);
  this.update_display();
};

Cell.prototype.update_display = function () {
  if (this.get_value() === 1) {
    this.div.className = "alive";
  } else {
    this.div.className = "dead";
  }
};

Cell.prototype.set_value = function(value) {
  this.game.grid[this.row][this.col] = value;
};

Cell.prototype.get_value = function() {
  return this.game.grid[this.row][this.col];
}

function GameOfLife (rows, cols, underpop, overpop, birth) {
  this.rows = rows;
  this.cols = cols;
  this.underpop = underpop;
  this.overpop = overpop;
  this.birth = birth;

  this.grid = new Array(rows);
  this.board = new Array(rows);

  var board_area = document.getElementById("board");


  for (var i = 0; i < rows; i++) {
    this.grid[i] = new Array(cols);
    this.board[i] = new Array(rows);

    for (var j = 0; j < cols; j++) {
      this.grid[i][j] = 0;
      this.board[i][j] = new Cell(board_area, i, j, this);
    }
  }
}

GameOfLife.prototype.randomize = function (p) {
  for (var i = 0; i < this.rows; i++) {
    for (var j = 0; j < this.cols; j++) {
      this.grid[i][j] = p > Math.random() ? 1 : 0;
      this.board[i][j].update_display();
    }
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

      this.board[i][j].update_display();
    }
  }
};

GameOfLife.prototype.next_generation = function () {
  this.count_neighbors();
  this.birth_next_generation();
};

function script () {
  g = new GameOfLife(50,50,2,3,3);
  // g.randomize(0.3);
}

function auto() {
  if (!timer) {
    g.next_generation();
    timer = setInterval(function () { g.next_generation() }, 500)
  }
}

function naughto() {
  clearInterval(timer);
  timer = false;
}

var g;
var timer = false;
