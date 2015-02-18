function GameOfLife (rows, cols, underpop, overpop, birth) {
  this.rows = rows;
  this.cols = cols;
  this.underpop = underpop;
  this.overpop = overpop;
  this.birth = birth;

  this.grid = new Array(rows);

  for (var i = 0; i < rows; i++) {
    this.grid[i] = new Array(cols);

    for (var j = 0; j < cols; j++) {
      this.grid[i][j] = 0;
    }
  }
}

GameOfLife.prototype.randomize = function (p) {
  for (var i = 0; i < this.rows; i++) {
    for (var j = 0; j < this.cols; j++)
      this.grid[i][j] = p > Math.random() ? 1 : 0;
  }
};

GameOfLife.prototype.wrapAdd = function (i, di, max) {
  i = (i + di) % max;
  if (i === -1) i = max - 1;

  return i;
};

GameOfLife.prototype.countNeighbors = function (row, col) {
  var neighbors = 0;

  for (var di = -1; di < 2; di++) {
    for (var dj = -1; dj < 2; dj++) {
      if (di === 0 && dj === 0){
        continue;
      }

      var ni = this.wrapAdd(row, di, this.rows);
      var nj = this.wrapAdd(col, dj, this.cols);

      if (this.grid[ni][nj] & 1 === 1)
        neighbors += 1;
    }
  }

  return neighbors;
}

GameOfLife.prototype.countAllNeighbors = function () {
  for (var i = 0; i < this.rows; i++) {
    for (var j = 0; j < this.cols; j++) {
      this.grid[i][j] = this.grid[i][j] |
        (this.countNeighbors(i, j) << 1);
    }
  }
};

GameOfLife.prototype.birthNextGeneration = function () {
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

GameOfLife.prototype.nextGeneration = function () {
  this.countAllNeighbors();
  this.birthNextGeneration();
};
