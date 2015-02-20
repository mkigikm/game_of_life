function CellularAutomata (rows, cols, rule, torus) {
  this.rows           = rows;
  this.cols           = cols;
  this.rule           = rule;
  this.torus          = torus;

  this.shift  = Math.ceil(Math.log(rule.states) / Math.LN2);
  this.mask   = Math.pow(2, this.shift) - 1;
  this.perInt = 32 / this.shift;

  this.grid = new Array(rows);
  for (var i = 0; i < rows; i++) {
    this.grid[i] = new Int32Array(this.colShift(cols) + 1);
  }
}

CellularAutomata.prototype.randomize = function (p) {
  for (var i = 0; i < this.rows; i++) {
    for (var j = 0; j < this.cols; j++) {
      p > Math.random() ? this.setCellState(i, j, 1) :
        this.setCellState(i, j, 0);
    }
  }
};

CellularAutomata.prototype.countInterior = function (row, j, top, bot) {
  var count = new Int32Array(this.rule.states);

  for (var dj = -1; dj < 2; dj++) {
    count[this.getCellStateFromRow(top, j + dj)]++;
  }

  for (dj = -1; dj < 2; dj+= 2) {
    count[this.getCellStateFromRow(row, j + dj)]++;
  }

  for (dj = -1; dj < 2; dj++) {
    count[this.getCellStateFromRow(bot, j + dj)]++;
  }

  return count;
};

CellularAutomata.prototype.countRightEdge =
    function (row, top, bot, firstState) {
  var count = new Int32Array(this.rule.states);

  count[this.getCellStateFromRow(top, this.cols - 2)]++;
  count[this.getCellStateFromRow(top, this.cols - 1)]++;
  if (this.torus)
    count[this.getCellStateFromRow(top,            0)]++;

  count[this.getCellStateFromRow(row, this.cols - 2)]++;
  if (this.torus)
    count[firstState]++;

  count[this.getCellStateFromRow(bot, this.cols - 2)]++;
  count[this.getCellStateFromRow(bot, this.cols - 1)]++;
  if (this.torus)
    count[this.getCellStateFromRow(bot,           0)]++;

  return count;
};

CellularAutomata.prototype.countLeftEdge = function (row, top, bot) {
  var count = new Int32Array(this.rule.states);

  if (this.torus)
    count[this.getCellStateFromRow(top, this.cols - 1)]++;
  count[this.getCellStateFromRow(top,               0)]++;
  count[this.getCellStateFromRow(top,               1)]++;

  if (this.torus)
    count[this.getCellStateFromRow(row, this.cols - 1)]++;
  count[this.getCellStateFromRow(row,               1)]++;

  if (this.torus)
    count[this.getCellStateFromRow(bot, this.cols - 1)]++;
  count[this.getCellStateFromRow(bot,               0)]++;
  count[this.getCellStateFromRow(bot,               1)]++;

  return count;
};

CellularAutomata.prototype.nextGeneration = function () {
  var first, top;

  // if we are a torus, connect the top and bottom rows
  if (this.torus) {
    first = new Int32Array(this.grid[0]);
    top   = new Int32Array(this.grid[this.cols - 1]);
  } else {
    first = new Int32Array(this.colShift(this.cols) + 1);
    top   = new Int32Array(this.colShift(this.cols) + 1);
  }

  for (var i = 0; i < this.rows - 1; i++) {
    var nextTop = new Int32Array(this.grid[i]);
    this.birthRow(i, top, this.grid[i+1]);
    top = nextTop;
  }

  this.birthRow(i, top, first);
};

CellularAutomata.prototype.birthRow = function (i, top, bot) {
  var row = this.grid[i];
  // save for torus
  var firstState = this.getCellState(i, 0);
  var prevCount = this.countLeftEdge(row, top, bot);
  var curCount;

  for (var j = 1; j < this.cols - 1; j++) {
    curCount = this.countInterior(row, j, top, bot);
    this.birthCell(i, j - 1, prevCount);
    prevCount = curCount;
  }

  curCount = this.countRightEdge(row, top, bot, firstState);
  this.birthCell(i, j - 1, prevCount);
  this.birthCell(i,     j,  curCount);
};

CellularAutomata.prototype.birthCell = function (i, j, count) {
  this.setCellState(i, j, this.rule.transition(this.getCellState(i, j), count));
};

CellularAutomata.prototype.getCellStateFromRow = function (row, j) {
  return (row[this.colShift(j)] >>> this.bitShift(j)) & this.mask;
}

CellularAutomata.prototype.getCellState = function (i, j) {
  return this.getCellStateFromRow(this.grid[i], j);
};

CellularAutomata.prototype.setCellState = function (i, j, state) {
  // clear the cell state
  this.grid[i][this.colShift(j)] &= ~(this.mask << this.bitShift(j));
  // set the cell state
  this.grid[i][this.colShift(j)] |= state << this.bitShift(j);
};

CellularAutomata.prototype.nextCellState = function (i, j) {
  var state = (this.getCellState(i, j) + 1) % this.rule.states;
  this.setCellState(i, j, state);
}

CellularAutomata.prototype.colShift = function (j) {
  return ~~(j / this.perInt);
};

CellularAutomata.prototype.bitShift = function (j) {
  return (j % this.perInt) * this.shift;
};
