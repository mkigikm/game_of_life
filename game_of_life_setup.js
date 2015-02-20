function setup () {
  var game = new GameOfLife(1000, 1000, [5,6,7,8], [4,5,6,7,8], true);
  c = new GameOfLifeController(document.getElementById("board"), game);
}

var c;
