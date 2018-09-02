var ChessBoard = function (mchessboard) {
    var that = this;

    that.init = function () {
        that.board = [];
        for ( var i = 0; i < 8; i++ ) that.board.push( [null, null, null, null, null, null, null, null] );
        that.board[0] = [
            new Chessman( "rook", "white" ),
            new Chessman( "knight", "white" ),
            new Chessman( "bishop", "white" ),
            new Chessman( "queen", "white" ),
            new Chessman( "king", "white" ),
            new Chessman( "bishop", "white" ),
            new Chessman( "knight", "white" ),
            new Chessman( "rook", "white" )
        ];
        that.board[7] = [
            new Chessman( "rook", "black" ),
            new Chessman( "knight", "black" ),
            new Chessman( "bishop", "black" ),
            new Chessman( "queen", "black" ),
            new Chessman( "king", "black" ),
            new Chessman( "bishop", "black" ),
            new Chessman( "knight", "black" ),
            new Chessman( "rook", "black" )
        ];
        for ( i = 0; i < 8; i++ ) {
            that.board[1][i] = new Chessman( "pawn", "white" );
            that.board[6][i] = new Chessman( "pawn", "black" );
        }
        that.step = 0;
    };

    that.board = [];
    that.step = 0;

    that.gameOver = function ( info ) {
        that.finished = true;
    }

    that.finished = false;

    that.move = function ( x, y, dx, dy ) {
        if ( !that.board[x][y] || that.board[x][y].color != that.getColor() ) return false;

        if ( that.board[dx][dy] && that.board[dx][dy].type == "king" ) {
            that.gameOver( that.getColor() + " win!" );
        }

        try {
            var steps = getOneChessmanWays( that.board, x, y ), p = false;
            steps.forEach( function ( s ) {
                if ( s.dx == dx && s.dy == dy ) p = true;
            } );
            if ( !p ) return false;
        } catch ( er ) {
            console.log( er );
        }
        that.board[dx][dy] = that.board[x][y];
        that.board[x][y] = null;
        that.board[dx][dy].movedStep++;
        that.step++;
        return true;
    };

    that.getColor = function () {
        return ( that.step & 1 ) ? "black" : "white";
    }

    that.getAllWays = function() {
        return getAllWays(that.board, that.getColor());
    };

    that.getOneChessmanWays = function(x, y) {
        return getOneChessmanWays(that.board, x, y);
    };


    if ( mchessboard ) {
        try {
            that.step = mchessboard.step;
            mchessboard.board.forEach(function(row) {
                that.board.push(row.concat());
            });
        } catch (e) {
            console.log( e );
            that.init();
        }
    } else that.init();
}

var Chessman = function ( type, color ) {
    this.type = type;
    this.color = color;
    this.movedStep = 0;
}

var getAllWays = function ( board, color ) {
    var ans = [];
    for ( var x = 0; x < 8; x++ ) {
        for ( var y = 0; y < 8; y++ ) {
            if ( board[x][y] && board[x][y].color == color ) {
                var ways = getOneChessmanWays( board, x, y );
                ways.forEach( function ( way ) {
                    ans.push( {
                        x: x,
                        dx: way.dx,
                        y: y,
                        dy: way.dy
                    } );
                } );
            }
        }
    }
    return ans;
};

//todo en passant
//todo castling
//todo upgrade
var getOneChessmanWays = function(board, x, y) {
    var ans = [], chessman = board[x][y];
    if (!board || !chessman) return ans;
    switch (chessman.type) {
    case "pawn":
        var detx = (chessman.color == "black") ? -1 : 1;
        chessmansMove(x, detx, y, 0, board, ans, true, false);
        [1, -1].forEach(function(dety) {
            chessmansMove(x, detx, y, dety, board, ans, false, true);
        });
        if (chessman.movedStep == 0 && !board[x+detx][y]) {
            detx *= 2;
            chessmansMove(x, detx, y, 0, board, ans, true, false);
        }
        return ans;
    case "rook":
        chessmansRun(x, 1, y, 0, board, ans);
        chessmansRun(x, -1, y, 0, board, ans);
        chessmansRun(x, 0, y, 1, board, ans);
        chessmansRun(x, 0, y, -1, board, ans);
        return ans;
    case "knight":
        chessmansMove(x, 1, y, 2, board, ans);
        chessmansMove(x, -1, y, 2, board, ans);
        chessmansMove(x, 1, y, -2, board, ans);
        chessmansMove(x, -1, y, -2, board, ans);
        chessmansMove(x, 2, y, 1, board, ans);
        chessmansMove(x, -2, y, 1, board, ans);
        chessmansMove(x, 2, y, -1, board, ans);
        chessmansMove(x, -2, y, -1, board, ans);
        return ans;
    case "bishop":
        chessmansRun(x, 1, y, 1, board, ans);
        chessmansRun(x, -1, y, -1, board, ans);
        chessmansRun(x, -1, y, 1, board, ans);
        chessmansRun(x, 1, y, -1, board, ans);
        return ans;
    case "queen":
        chessmansRun(x, 1, y, 0, board, ans);
        chessmansRun(x, -1, y, 0, board, ans);
        chessmansRun(x, 0, y, 1, board, ans);
        chessmansRun(x, 0, y, -1, board, ans);
        chessmansRun(x, 1, y, 1, board, ans);
        chessmansRun(x, -1, y, -1, board, ans);
        chessmansRun(x, -1, y, 1, board, ans);
        chessmansRun(x, 1, y, -1, board, ans);
        return ans;
    case "king":
        chessmansMove(x, 1, y, 1, board, ans);
        chessmansMove(x, -1, y, 1, board, ans);
        chessmansMove(x, 1, y, -1, board, ans);
        chessmansMove(x, -1, y, -1, board, ans);
        chessmansMove(x, 1, y, 0, board, ans);
        chessmansMove(x, -1, y, 0, board, ans);
        chessmansMove(x, 0, y, -1, board, ans);
        chessmansMove(x, 0, y, 1, board, ans);
        return ans;
    default:
        return ans;
    }
};

function moveCheck( x, y ) {
    return x < 8 && x > -1 && y < 8 && y > -1;
}

function chessmansRun( x, detx, y, dety, board, ans ) {
    while ( moveCheck( x + detx, y + dety ) && board[x + detx][y + dety] == null ) {
        ans.push( { dx: x + detx, dy: y + dety } );
        if ( detx != 0 ) detx += ( detx > 0 ) ? 1 : -1;
        if ( dety != 0 ) dety += ( dety > 0 ) ? 1 : -1;
    }
    if ( moveCheck( x + detx, y + dety ) && board[x + detx][y + dety] && board[x + detx][y + dety].color != board[x][y].color )
        ans.push( { dx: x + detx, dy: y + dety } );
}

function chessmansMove( x, detx, y, dety, board, ans, cannotEat, cannotMove ) {
    if ( moveCheck( x + detx, y + dety ) && ( board[x + detx][y + dety] == null || board[x + detx][y + dety].color != board[x][y].color ) ) {
        if ( cannotEat && board[x + detx][y + dety] && board[x + detx][y + dety].color != board[x][y].color ) return;
        if ( cannotMove && board[x + detx][y + dety] == null ) return;
        ans.push( { dx: x + detx, dy: y + dety } );
    }
}

if (!window.exports) window.exports = {};

exports.ChessBoard = ChessBoard;
exports.Chessman = Chessman;
exports.getOneChessmanWays = getOneChessmanWays;
exports.getAllWays = getAllWays;