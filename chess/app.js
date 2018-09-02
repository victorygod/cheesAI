var chess = require( "./chess.js" ),
    AI = require( "./ai.js" );

var chessboard = new chess.ChessBoard();

function showBoard( chessboard ) {
    console.log( "====================chessboard====================  step:" + chessboard.step );
    for ( var x = 7; x > -1; x-- ) {
        var str = (x+1) + "| ";
        for (var y = 0; y <8; y++) {
            if (chessboard.board[x][y]) str += chessboard.board[x][y].color.substr(0, 1) + chessboard.board[x][y].type.substr(0, 2) + " | ";
            else str += "    | ";
        }
        console.log(str);
    }
    console.log( "   a     b     c     d     e     f     g     h" );
    console.log( "===================endChessboard==================" );
}

var rowTag = [1, 2, 3, 4, 5, 6, 7, 8],
    columnTag = ["a", "b", "c", "d", "e", "f", "g", "h"],
    ai = new AI.SampleAi( chessboard, "black");

function translatePos(x, y) {
    return columnTag[y] + rowTag[x];
}

function parsePos(str) {
    var row = str[1], column = str[0];
    return {
        x: rowTag.indexOf(parseInt(row)),
        y: columnTag.indexOf(column)
    }
}

showBoard( chessboard );
infoWords();

function infoWords() {
    console.log( chessboard.getColor() + " turn. Move: (input '-' or '- position' to get help)" );
}

process.stdin.on('readable', function() {
    var chunk = process.stdin.read();
    if (chunk) {
        try {
            //player
            var res = chunk.toString().replace(/[\r|\n]/g, "").split(" ");

            if (res[0].indexOf("-") == 0) {
                var ways = [];
                if (res[1] && !isFinite(res[1])) ways = chess.getOneChessmanWays(chessboard.board, parsePos(res[1]).x, parsePos(res[1]).y);
                else ways = chessboard.getAllWays();

                ways.forEach(function(way) {
                    var sx = way.x || (res[1] ? parsePos(res[1]).x : 0),
                        sy = way.y || (res[1] ? parsePos(res[1]).y : 0);

                    console.log(translatePos(sx, sy) + " " + translatePos(way.dx, way.dy));
                });

                infoWords();
                return;
            }
            var op = parsePos(res[0]), tp = parsePos(res[1]);
            if (!chessboard.move(op.x, op.y, tp.x, tp.y)) {
                console.log( "Cannot move like that. Move: (input '-' or '- position' to get help)" );
                return;
            }
            showBoard(chessboard);
            if (chessboard.finished) return;

            //ai
            var color = chessboard.getColor(), ans = ai.move();
            console.log(color + " turn. AI moved: " + translatePos(ans.x, ans.y) + " " + translatePos(ans.dx, ans.dy));
            showBoard(chessboard);
            infoWords();
        } catch (e) {
            console.log("wrong input");
        }
    }
});

chessboard.gameOver = function ( info ) {
    chessboard.finished = true;
    console.log( info );
    process.stdin.end();
}