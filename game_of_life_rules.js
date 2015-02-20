function GameOfLifeClass (birthRule, survivalRule) {
  this.birthRule    = birthRule;
  this.survivalRule = survivalRule;
  this.states       = 2;
}

GameOfLifeClass.prototype.transition = function (state, count) {
  return state === 1 ? this.aliveRule(count[1]) :
    this.deadRule(count[1]);
}
GameOfLifeClass.prototype.aliveRule = function (aliveCount) {
  return this.survivalRule.indexOf(aliveCount) === -1 ? 0 : 1;
};

GameOfLifeClass.prototype.deadRule = function (aliveCount) {
  return this.birthRule.indexOf(aliveCount) === -1 ? 0 : 1;
};

function BriansBrainRules () {
  this.states = 3;
}

BriansBrainRules.prototype.transition = function (state, count) {
  switch (state) {
    case 0:
      return count[1] === 2 ? 1 : 0;
    case 1:
      return 2;
    case 2:
      return 0;
  }
};

function WireWorld () {
  this.states = 4;
}

WireWorld.EMPTY = 0;
WireWorld.HEAD  = 2;
WireWorld.TAIL  = 1;
WireWorld.COND  = 3;

WireWorld.prototype.transition = function (state, count) {
  var heads = count[WireWorld.HEAD];

  switch (state) {
    case WireWorld.EMPTY:
      return WireWorld.EMPTY;
    case WireWorld.HEAD:
      return WireWorld.TAIL;
    case WireWorld.TAIL:
      return WireWorld.COND;
    case WireWorld.COND:
      return heads == 1 || heads == 2 ? WireWorld.HEAD : WireWorld.COND;
  }
}
