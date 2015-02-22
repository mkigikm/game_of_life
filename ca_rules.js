function GoLClass (birthRule, survivalRule) {
  this.birthRule    = birthRule;
  this.survivalRule = survivalRule;
  this.states       = 2;
};

GoLClass.prototype.transition = function (state, count) {
  return state === 1 ? this.aliveRule(count[1]) :
    this.deadRule(count[1]);
};

GoLClass.prototype.aliveRule = function (aliveCount) {
  return this.survivalRule.indexOf(aliveCount) === -1 ? 0 : 1;
};

GoLClass.prototype.deadRule = function (aliveCount) {
  return this.birthRule.indexOf(aliveCount) === -1 ? 0 : 1;
};

GoLClass.prototype.randomize = function (p) {
  return p > Math.random() ? 1 : 0;
}

function BriansBrainRules () {
  this.states = 3;
};

BriansBrainRules.DEAD  = 0;
BriansBrainRules.DYING = 1;
BriansBrainRules.ALIVE = 2;

BriansBrainRules.prototype.transition = function (state, count) {
  switch (state) {
    case BriansBrainRules.DEAD:
      return count[BriansBrainRules.ALIVE] === 2 ? BriansBrainRules.ALIVE
        : BriansBrainRules.DEAD;
    case BriansBrainRules.DYING:
      return BriansBrainRules.DEAD;
    case BriansBrainRules.ALIVE:
      return BriansBrainRules.DYING;
  }
};

BriansBrainRules.prototype.randomize = function (p) {
  return p > Math.random() ? 2 : 0;
};

function WireWorld () {
  this.states = 4;
};

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
};

var RULES = {
  conway:      new GoLClass(            [3],          [2, 3]),
  highLife:    new GoLClass(         [3, 6],          [2, 3]),
  cave:        new GoLClass(   [5, 6, 7, 8], [4, 5, 6, 7, 8]),
  maze:        new GoLClass(            [3], [1, 2, 3, 4, 5]),
  mazectric:   new GoLClass(            [3],    [1, 2, 3, 4]),
  dayAndNight: new GoLClass([3, 4, 6, 7, 8],    [3, 6, 7, 8]),
  seeds:       new GoLClass(            [2],              []),
  briansBrain: new BriansBrainRules()
}
