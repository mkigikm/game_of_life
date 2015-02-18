function parseGame (board, game) {
  var lines = board.split("\n");

  var rowOffset = ~~((game.rows - lines.length) / 2);

  var maxColumns = Math.max.apply(null,
      lines.map(function (line) { return line.length;})
    );
  var colOffset = ~~((game.cols - maxColumns) / 2);

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];

    for (var j = 0; j < line.length; j++) {
      if (line[j] === "*") {
        game.setCellAlive(i + rowOffset, j + colOffset);
      }
    }
  }
}
