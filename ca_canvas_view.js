function CACanvasView (rows, cols, scale, colors, canvas) {
  this.rows   = rows;
  this.cols   = cols;
  this.scale  = scale;
  this.colors = colors;
  this.canvas = canvas;
  this.ctx    = canvas.getContext('2d');

  canvas.width        = cols;
  canvas.height       = rows;
  canvas.style.width  = scale * cols + 'px';
  canvas.style.height = scale * rows + 'px';
};

CACanvasView.prototype.resetDisplay = function () {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

CACanvasView.prototype.updateDisplay = function (ca) {
  var buffer = this.ctx.createImageData(this.cols, this.rows),
      x, y, state, index;

  for (x = 0; x < buffer.width; x++) {
    for (y = 0; y < buffer.height; y++) {
      state = ca.getCellState(y, x);
      index = (y * buffer.width + x) * 4;
      buffer.data[index]     = this.colors[state][0];
      buffer.data[index + 1] = this.colors[state][1];
      buffer.data[index + 2] = this.colors[state][2];
      buffer.data[index + 3] = 255;
    }
  }

  this.ctx.putImageData(buffer, 0, 0);
};
