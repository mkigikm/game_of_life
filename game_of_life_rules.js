function GameOfLifeClass (birthRule, survivalRule) {
  this.birthRule    = birthRule;
  this.survivalRule = survivalRule;
  this.states       = 2;
}

GameOfLifeClass.prototype.transistionRule = function (state, neighborCounts) {
  return state === 1 ? this.aliveRule(neighborCounts[1]) :
    this.deadRule(neighborCounts[1]);
}
GameOfLifeClass.prototype.aliveRule = function (aliveCount) {
  this.survivalRule.indexOf(aliveCount) === -1 ? 0 : 1;
};

GameOfLifeClass.prototype.deadRule = function (aliveCount) {
  this.birthRule.indexOf(aliveCount) === -1 ? 0 : 1;
};
