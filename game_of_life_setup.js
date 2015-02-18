function setup () {
  var game = new GameOfLife(400,400,2,3,3);
  c = new GameOfLifeController(document.getElementById("board"), game);
}

var c;
