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
