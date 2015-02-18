function GameOfLife (rows, cols, underpop, overpop, birth) {
  this.rows = rows;
  this.cols = cols;
  this.underpop = underpop;
  this.overpop = overpop;
  this.birth = birth;
  this.neighborCount = new Int8Array(cols);

  this.grid = new Array(rows);
  for (var i = 0; i < rows; i++) {
    // this.grid[i] = new Array(this.colShift(cols) + 1);
    this.grid[i] = new Int32Array(this.colShift(cols) + 1);

    for (var j = 0; j < cols; j++) {
      this.setCellDead(i, j);
    }
  }
}

GameOfLife.prototype.randomize = function (p) {
  for (var i = 0; i < this.rows; i++) {
    for (var j = 0; j < this.cols; j++)
      p > Math.random() ? this.setCellAlive(i, j) : this.setCellDead(i, j);
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

      if (this.getCellState(ni, nj) === 1) {
        neighbors += 1;
      }
    }
  }

  return neighbors;
};

GameOfLife.prototype.countAllNeighbors = function () {
  for (var i = 0; i < this.rows; i++) {
    for (var j = 0; j < this.cols; j++) {
      this.storeNeighborCount(j, this.countNeighbors(i, j));
      // this.grid[i][j] = this.grid[i][j] |
      //   (this.countNeighbors(i, j) << 1);
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

GameOfLife.prototype.storeNeighborCount = function (j, count) {
  // this.grid[i][j] = this.grid[i][j] | (count << 1);
  this.neighborCount[j] = count;
};

GameOfLife.prototype.storeRowNeighbors = function (row, top, bottom) {
  for (var j = 0; j < this.cols; j++) {
    var count = 0;

    for (var dj = -1; dj < 2; dj++) {
      count += this.getCellStateFromRow(top, this.wrapAdd(j, dj, this.cols));
      // console.log("counting top neighbors " + this.getCellStateFromRow(top, this.wrapAdd(j, dj, this.cols)));
      // console.log(top[this.colShift(dj)])
    }

    for (dj = -1; dj < 2; dj+= 2) {
      count += this.getCellStateFromRow(row, this.wrapAdd(j, dj, this.cols));
      // console.log("counting row neighbors " + count)
    }
    for (dj = -1; dj < 2; dj++) {
      count += this.getCellStateFromRow(bottom, this.wrapAdd(j, dj, this.cols));
      // console.log("counting bottom neighbors " + count)
    }
    // console.log(count + " neighbors")
    this.storeNeighborCount(j, count);
  }
};

GameOfLife.prototype.birthRow = function (i) {
  // console.log("birthing " + i)
  // console.log(this.neighborCount);
  for (var j = 0; j < this.cols; j++) {
    if (this.getCellState(i, j) === 1) {
      this.aliveRule(i, j, this.neighborCount[j]);
    } else {
      this.deadRule(i, j, this.neighborCount[j]);
    }
  }
};

GameOfLife.prototype.aliveRule = function (i, j, neighbors) {
  if (neighbors < this.underpop || neighbors > this.overpop) {
    this.setCellDead(i, j);
  }
};

GameOfLife.prototype.deadRule = function (i, j, neighbors) {
  if (neighbors === this.birth) {
    this.setCellAlive(i, j);
  }
};

GameOfLife.prototype.nextGeneration = function () {
  // this.countAllNeighbors();
  // this.birthNextGeneration();
  var first = new Int32Array(this.grid[0]);
  var top   = new Int32Array(this.grid[this.cols - 1]);
  // var top   = this.grid[this.rows - 1].slice(0);

  for (var i = 0; i < this.rows - 1; i++) {
    this.storeRowNeighbors(this.grid[i], top, this.grid[i+1]);
    // top = this.grid[i].slice(0);
    top = new Int32Array(this.grid[i]);
    this.birthRow(i);
  }

  this.storeRowNeighbors(this.grid[i], top, first);
  this.birthRow(i);
};

GameOfLife.prototype.getCellStateFromRow = function (row, j) {
  return (row[this.colShift(j)] >>> this.bitShift(j)) & 1;
}

GameOfLife.prototype.getCellState = function (i, j) {
  // return this.grid[i][j] & 1;
  return (this.grid[i][this.colShift(j)] >>> this.bitShift(j)) & 1
};

GameOfLife.prototype.setCellAlive = function (i, j) {
  // this.grid[i][j] = 1;
  // console.log("setting alive")
  this.grid[i][this.colShift(j)] |= 1 << this.bitShift(j)
};

GameOfLife.prototype.setCellDead = function (i, j) {
  // this.grid[i][j] = 0;
  this.grid[i][this.colShift(j)] &= ~(1 << this.bitShift(j));
};

GameOfLife.prototype.flipCellState = function (i, j) {
  // return this.grid[i][j] = (this.grid[i][j] + 1) % 2;
  // console.log(this.getCellState(i,j))
  this.grid[i][this.colShift(j)] ^= (1 << this.bitShift(j));
};

GameOfLife.prototype.colShift = function (j) {
  return ~~(j / 32);
};

GameOfLife.prototype.bitShift = function (j) {
  return j % 32;
};
