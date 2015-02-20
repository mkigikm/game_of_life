function setup () {
  var conway      = new GameOfLifeClass(            [3],          [2, 3]);
  var highLife    = new GameOfLifeClass(         [3, 6],          [2, 3]);
  var cave        = new GameOfLifeClass(   [5, 6, 7, 8], [4, 5, 6, 7, 8]);
  var maze        = new GameOfLifeClass(            [3], [1, 2, 3, 4, 5]);
  var mazectric   = new GameOfLifeClass(            [3],    [1, 2, 3, 4]);
  var dayAndNight = new GameOfLifeClass([3, 4, 6, 7, 8],    [3, 6, 7, 8]);
  var seeds       = new GameOfLifeClass(            [2],              []);

  var briansBrain = new BriansBrainRules();
  var wireWorld   = new WireWorld();

  var game        = new CellularAutomata(25, 25, wireWorld, true);
  var torus       = true;

  c = new GameOfLifeController(document.getElementById("board"), game);
}
