function setup () {
  var game = new GameOfLife(125, 125, [3], [2, 3], true);
  c = new GameOfLifeController(document.getElementById("board"), game);
}

var c;
