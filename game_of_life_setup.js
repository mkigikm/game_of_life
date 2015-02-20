function setup () {
  var conwayRules = new GameOfLifeClass(         [3],          [2, 3]);
  var highLife    = new GameOfLifeClass(      [3, 6],          [2, 3]);
  var caveRules   = new GameOfLifeClass([5, 6, 7, 8], [4, 5, 6, 7, 8]);
  var torus       = true;
  var game        = new CellularAutomata(50, 50, conwayRules, true);

  c = new GameOfLifeController(document.getElementById("board"), game);
}
