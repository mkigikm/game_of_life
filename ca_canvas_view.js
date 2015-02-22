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
  if (this.hardware) {
    this.updateDisplayHardware(ca);
  } else {
    this.updateDisplaySoftware(ca);
  }
};

CACanvasView.prototype.updateDisplaySoftware = function (ca) {
  var buffer, x, y, state;

  buffer = this.ctx.createImageData(this.canvas.width, this.canvas.height);

  for (x = 0; x < buffer.width; x++) {
    for (y = 0; y < buffer.height; y++) {
      state = ca.getCellState(y / this.scale | 0, x / this.scale | 0);
      this.setBufferColor(buffer, x, y, state);
    }
  }

  this.ctx.putImageData(buffer, 0, 0);
};

CACanvasView.prototype.setBufferColor = function (buffer, x, y, state) {
  var index = (y * buffer.width + x) * 4;

  buffer.data[index]     = this.colors[state][0];
  buffer.data[index + 1] = this.colors[state][1];
  buffer.data[index + 2] = this.colors[state][2];
  buffer.data[index + 3] = 255;
}

CACanvasView.prototype.updateDisplayHardware = function (ca) {
  var buffer, x, y;

  buffer = this.ctx.createImageData(this.cols, this.rows);

  for (x = 0; x < buffer.width; x++) {
    for (y = 0; y < buffer.height; y++) {
      this.setBufferColor(buffer, x, y, ca.getCellState(y, x));
    }
  }

  this.ctx.putImageData(buffer, 0, 0);
};
