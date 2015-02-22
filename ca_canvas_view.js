function CACanvasView (game, scale, colors, hardware, canvas) {
  this.rows   = game.rows;
  this.cols   = game.cols;
  this.canvas = canvas;
  this.ctx    = canvas.getContext('2d');

  this.setupDisplay(scale, colors, hardware);
};

CACanvasView.prototype.setupDisplay = function (scale, colors, hardware) {
  console.log(this.rows, this.cols, scale, hardware)
  this.scale    = scale;
  this.colors   = colors;
  this.hardware = hardware;

  if (this.hardware) {
    this.canvas.width        = this.cols;
    this.canvas.height       = this.rows;
    this.canvas.style.width  = this.scale * this.cols + 'px';
    this.canvas.style.height = this.scale * this.rows + 'px';
  } else {
    this.canvas.width        = this.cols * this.scale;
    this.canvas.height       = this.rows * this.scale;
    this.canvas.style.width  = this.canvas.width + 'px';
    this.canvas.style.height = this.canvas.height + 'px';
  }
  console.log(this.canvas.width, this.canvas.height)
};

CACanvasView.prototype.resetDisplay = function () {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

CACanvasView.prototype.updateDisplay = function (ca) {
  var buffer, x, y, state, index;

  if (this.hardware) {
    buffer = this.ctx.createImageData(this.cols, this.rows);
  } else {
    buffer = this.ctx.createImageData(this.canvas.width, this.canvas.height);
  }

  for (x = 0; x < buffer.width; x++) {
    for (y = 0; y < buffer.height; y++) {
      if (this.hardware) {
        state = ca.getCellState(y, x);
      } else {
        state = ca.getCellState(y / this.scale | 0, x / this.scale | 0);
      }
      index = (y * buffer.width + x) * 4;
      buffer.data[index]     = this.colors[state][0];
      buffer.data[index + 1] = this.colors[state][1];
      buffer.data[index + 2] = this.colors[state][2];
      buffer.data[index + 3] = 255;
    }
  }

  this.ctx.putImageData(buffer, 0, 0);
};
