var parseGame = function (board, game) {
  var lines = board.split("\n");

  if (lines[0].match(/#Life 1\.05/)) {
    console.log("life 1.05 file")
    var start = 0;

    do {
      start++;
    } while (start < lines.length && lines[start].match(/^#/));

    parseLife105(lines.slice(start), game);

  } else {
    console.log("RLE encoding")
    var start = 0;
    while (lines[start].match(/^#/)) {
      start++;
    }

    var rle_header = /^x = (\d+), y = (\d+)/.exec(lines[start++]);
    if (rle_header) {
      parseRLE(lines.slice(start), parseInt(rle_header[1]),
        parseInt(rle_header[2]), game);
    } else {
      console.log("Bad RLE header");
    }
  }
  console.log("exiting parser")
};

var parseLife105 = function (lines, game) {
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
};

var parseRLE = function (lines, x, y, game) {
  var i = ~~((game.rows - y) / 2);
  var startCol = ~~((game.cols - x) / 2)
  var j = startCol;
  var runExp = new RegExp(/(\d*)([bo$])!?/);
  lines = lines.join('');
  var match;

  while (match = runExp.exec(lines)) {
    console.log("found match")
    console.log(lines)
    console.log(i)
    console.log(j)
    var count = parseInt(match[1]);
    if (isNaN(count)) {
      count = 1;
    }
    console.log("count " + count)

    switch (match[2]) {
      case "o":
        while (count--) {
          game.setCellAlive(i, j++);
        }
        break;
      case "b":
        j += count;
        break;
      case "$":
        i += count;
        j = startCol;
        break;
    }
    lines = lines.slice(match[0].length);
  }
};
