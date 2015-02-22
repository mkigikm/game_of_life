function GameOfLifeDomView (controller, parent, rows, cols) {
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

GameOfLifeDomView.prototype.updateDisplay = function (game) {
  for (var i = 0; i < this.rows; i++) {
    for (var j = 0; j < this.cols; j++) {
      this.cells[i][j].updateDisplay(game.getCellState(i, j));
    }
  }
};

GameOfLifeDomView.prototype.resetDisplay = function () {
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
  if (value === 2 && this.div.className !== "dying") {
    this.div.className = "dying";
  }
  if (value === 1 && this.div.className !== "alive") {
    this.div.className = "alive";
  }
  if (value === 0 && this.div.className !== "dead") {
    // var current = this.div.className;
    //
    // this.div.className = current === "unvisited" ? current : "dead";
    this.div.className = "dead";
  }
  if (value === 3 && this.div.className !== "cond") {
    this.div.className = "cond";
  }
};

CellView.prototype.resetDisplay = function () {
  this.div.className = "unvisited";
}
