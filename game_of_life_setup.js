function setup () {
  var game = new GameOfLife(250,250,[3],[2,3]);
  c = new GameOfLifeController(document.getElementById("board"), game);
}

var c;
