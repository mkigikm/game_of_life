function GameOfLifeView (controller, parent, rows, cols) {
  this.rows = rows;
  this.cols = cols;
  this.cells = new Array(rows);

  for (var i = 0; i < rows; i++) {
    this.cells[i] = new Array(cols);

    for (var j = 0; j < cols; j++) {
      this.cells[i][j] = new CellView(controller, parent, i, j);
    }
  }
}

GameOfLifeView.prototype.updateDisplay = function (game) {
  for (var i = 0; i < this.rows; i++) {
    for (var j = 0; j < this.cols; j++) {
      this.cells[i][j].updateDisplay(game.getCellState(i, j));
    }
  }
};

GameOfLifeView.prototype.resetDisplay = function () {
  for (var i = 0; i < this.rows; i++) {
    for (var j = 0; j < this.cols; j++) {
      this.cells[i][j].resetDisplay();
    }
  }
};

function CellView (controller, parent, row, col) {
  this.div = document.createElement("div");
  this.resetDisplay();
  parent.appendChild(this.div);

  this.div.addEventListener("click",
    function() {
      controller.cellClick(row, col);
    });
};

CellView.prototype.updateDisplay = function (value) {
  if (value === 1 && this.div.className != "alive") {
    this.div.className = "alive";
  }
  if (value === 0 && this.div.className === "alive") {
    // var current = this.div.className;
    //
    // this.div.className = current === "unvisited" ? current : "dead";
    this.div.className = "dead";
  }
};

CellView.prototype.resetDisplay = function () {
  this.div.className = "unvisited";
}
