function GameOfLife (rows, cols, birthRule, survivalRule) {
  this.rows = rows;
  this.cols = cols;
  this.birthRule = birthRule;
  this.survivalRule = survivalRule;

  this.grid = new Array(rows);
  for (var i = 0; i < rows; i++) {
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

GameOfLife.prototype.countInteriorNeighbors = function (row, j, top, bot) {
  var count = 0;

  for (var dj = -1; dj < 2; dj++) {
    count += this.getCellStateFromRow(top, j + dj);
  }

  for (dj = -1; dj < 2; dj+= 2) {
    count += this.getCellStateFromRow(row, j + dj);
  }

  for (dj = -1; dj < 2; dj++) {
    count += this.getCellStateFromRow(bot, j + dj);
  }

  return count;
};

GameOfLife.prototype.countRightEdgeNeighbors =
    function (row, top, bot, firstState) {
  var count = 0;

  count += this.getCellStateFromRow(top, this.cols - 1);
  count += this.getCellStateFromRow(top,     this.cols);
  count += this.getCellStateFromRow(top,             0);

  count += this.getCellStateFromRow(row, this.cols - 1);
  count += firstState;

  count += this.getCellStateFromRow(bot, this.cols - 1);
  count += this.getCellStateFromRow(bot,     this.cols);
  count += this.getCellStateFromRow(bot,             0);

  return count;
};

GameOfLife.prototype.countLeftEdgeNeighbors =
    function (row, top, bot) {
  var count = 0;

  count += this.getCellStateFromRow(top, this.cols - 1);
  count += this.getCellStateFromRow(top,             0);
  count += this.getCellStateFromRow(top,             1);

  count += this.getCellStateFromRow(row, this.cols - 1);
  count += this.getCellStateFromRow(row,             0);

  count += this.getCellStateFromRow(bot, this.cols - 1);
  count += this.getCellStateFromRow(bot,             0);
  count += this.getCellStateFromRow(bot,             1);

  return count;
};

GameOfLife.prototype.nextGeneration = function () {
  var first = new Int32Array(this.grid[0]);
  var top   = new Int32Array(this.grid[this.cols - 1]);

  for (var i = 0; i < this.rows - 1; i++) {
    var nextTop = new Int32Array(this.grid[i]);
    this.birthRow(i, top, this.grid[i+1]);
    top = nextTop;
  }

  this.birthRow(i, top, first);
};

GameOfLife.prototype.birthRow = function (i, top, bot) {
  var row = this.grid[i];
  var firstState = this.getCellState(i, 0);
  var prevNeighbors = this.countLeftEdgeNeighbors(row, top, bot);
  var curNeighbors = 0;

  for (var j = 1; j < this.cols - 1; j++) {
    curNeighbors = this.countInteriorNeighbors(row, j, top, bot);
    this.birthCell(i, j - 1, prevNeighbors);
    prevNeighbors = curNeighbors;
  }

  curNeighbors = this.countRightEdgeNeighbors(row, top, bot, firstState);
  this.birthCell(i, j - 1, prevNeighbors);
  this.birthCell(i, j, curNeighbors);
};

GameOfLife.prototype.birthCell = function (i, j, neighbors) {

  if (this.getCellState(i, j) === 1) {
    this.aliveRule(i, j, neighbors);
  } else {
    this.deadRule(i, j, neighbors);
  };
};

GameOfLife.prototype.aliveRule = function (i, j, neighbors) {
  if (this.survivalRule.indexOf(neighbors) === -1) {
    this.setCellDead(i, j);
  }
};

GameOfLife.prototype.deadRule = function (i, j, neighbors) {
  if (this.birthRule.indexOf(neighbors) !== -1) {
    this.setCellAlive(i, j);
  }
};

GameOfLife.prototype.getCellStateFromRow = function (row, j) {
  return (row[this.colShift(j)] >>> this.bitShift(j)) & 1;
}

GameOfLife.prototype.getCellState = function (i, j) {
  return (this.grid[i][this.colShift(j)] >>> this.bitShift(j)) & 1
};

GameOfLife.prototype.setCellAlive = function (i, j) {
  this.grid[i][this.colShift(j)] |= 1 << this.bitShift(j)
};

GameOfLife.prototype.setCellDead = function (i, j) {
  this.grid[i][this.colShift(j)] &= ~(1 << this.bitShift(j));
};

GameOfLife.prototype.flipCellState = function (i, j) {
  this.grid[i][this.colShift(j)] ^= (1 << this.bitShift(j));
};

GameOfLife.prototype.colShift = function (j) {
  return ~~(j / 32);
};

GameOfLife.prototype.bitShift = function (j) {
  return j % 32;
};
