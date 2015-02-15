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
