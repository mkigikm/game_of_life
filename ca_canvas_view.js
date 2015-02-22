function CACanvasView (rows, cols, cellWidth, colors, canvas) {
  this.rows      = rows;
  this.cols      = cols;
  this.cellWidth = cellWidth;
  this.colors    = colors;
  this.canvas    = canvas;
  this.ctx       = canvas.getContext('2d');

  canvas.height = cellWidth * rows;
  canvas.width  = cellWidth * cols;
};

CACanvasView.prototype.resetDisplay = function () {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

CACanvasView.prototype.updateDisplay = function (ca) {
  var buffer = this.ctx.createImageData(this.canvas.width, this.canvas.height),
      x, y, state, index;

  for (x = 0; x < buffer.width; x++) {
    for (y = 0; y < buffer.height; y++) {
      state = ca.getCellState(y / this.cellWidth | 0, x / this.cellWidth | 0);
      index = (y * buffer.width + x) * 4;
      buffer.data[index]     = this.colors[state][0];
      buffer.data[index + 1] = this.colors[state][1];
      buffer.data[index + 2] = this.colors[state][2];
      buffer.data[index + 3] = 255;
    }
  }

  this.ctx.putImageData(buffer, 0, 0);
};
