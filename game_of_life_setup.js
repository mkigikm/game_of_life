function setup () {
  var game = new GameOfLife(300,300,[2,3],[3]);
  c = new GameOfLifeController(document.getElementById("board"), game);
}

var c;
