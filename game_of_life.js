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

GameOfLife.prototype.count_neighbors = function (row, col) {
  var neighbors = 0;

  for (var d_i = -1; d_i < 2; d_i++) {
    for (var d_j = -1; d_j < 2; d_j++) {
      if (d_i === 0 && d_j === 0) continue;

      var n_i = this.wrap_add(row, d_i, this.rows);
      var n_j = this.wrap_add(col, d_j, this.cols);

      if (this.grid[n_i][n_j] & 1 === 1)
        neighbors += 1;
    }
  }

  return neighbors;
}

GameOfLife.prototype.count_all_neighbors = function () {
  for (var i = 0; i < this.rows; i++) {
    for (var j = 0; j < this.cols; j++)
      this.grid[i][j] = this.grid[i][j] |
        (this.count_neighbors(i, j) << 1);
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
  this.count_all_neighbors();
  this.birth_next_generation();
};
