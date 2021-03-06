function CAController () {
  this.wireControls();
  this.setup();
};

CAController.prototype.wireControls = function () {
  $('#step').click(function () {
    this.nextGeneration();
  }.bind(this));

  $('#randomize').click(function () {
    this.randomize(parseFloat($('#probability').val()));
    $('#go').text('Go');
  }.bind(this));

  $('#go').click(function () {
    if (this.timer) {
      this.naughto();
      $('#go').text('Go');
    } else {
      this.auto(parseInt($('#wait').val()));
      $('#go').text('Stop');
    }
  }.bind(this));

  $('#clear').click(function () {
    this.randomize(0);
    $('#go').text('Go');
  }.bind(this));

  $('#refreshGame').click(function () {
    this.setup();
    $('#go').text('Go');
  }.bind(this));

  $('#refreshDisplay').click(function () {
    console.log('refreshing')
    this.setupDisplay();
  }.bind(this));

  $('#input').click(function () {
    this.gameInput($('#game_input').val());
  }.bind(this));
};

CAController.prototype.setup = function () {
  this.naughto();
  this.setupGame();
  this.setupDisplay();
};

CAController.prototype.setupGame = function () {
  var torus  = $('#torus').is(':checked'),
      rows   = parseInt($('#rows').val()),
      cols   = parseInt($('#cols').val()),
      rules  = RULES[$('#rules').val()];

  this.game = new CA(rows, cols, rules, torus);
};

CAController.prototype.setupDisplay = function () {
  var scale    = parseFloat($('#scale').val()),
      colors   = [[0, 0, 0],[0, 0, 255]],
      hardware = $('#hardware').is(':checked'),
      canvas   = $('#canvas').get(0);

  if (this.game.rule === RULES.briansBrain) {
    console.log('adding colors')
    colors.push([255, 255, 255]);
  }

  this.view = new CACanvasView(this.game, scale, colors, hardware, canvas);
  this.view.updateDisplay(this.game);
};

//html buttons
CAController.prototype.randomize = function (p) {
  console.log(this.game)
  this.naughto();
  this.game.randomize(p);
  this.view.resetDisplay();
  this.view.updateDisplay(this.game);
};

CAController.prototype.clear = function () {
  this.randomize(0);
  this.view.resetDisplay();
};

CAController.prototype.nextGeneration = function () {
  this.game.nextGeneration();
  this.view.updateDisplay(this.game);
};

CAController.prototype.auto = function (wait) {
  if (this.timer === null) {
    this.nextGeneration();
    var me = this;
    this.timer = setInterval(function () { me.nextGeneration() }, wait);
  }
};

CAController.prototype.naughto = function () {
  clearInterval(this.timer);
  this.timer = null;
};

CAController.prototype.gameInput = function (board) {
  this.clear();
  parseGame(board, this.game);
  this.view.updateDisplay(this.game);
};

//html clicks
CAController.prototype.cellClick = function (i, j) {
  this.game.nextCellState(i, j);
  this.view.cells[i][j].updateDisplay(this.game.getCellState(i, j));
};
