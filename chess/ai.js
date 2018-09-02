var chess = require("./chess.js"),
    ChessBoard = chess.ChessBoard;

var RandomAi = function ( chessboard, color ) {
    this.move = function () {
        if ( color != chessboard.getColor() ) {
            console.log( "not ai turn!" );
            return {};
        }
        var ans = chessboard.getAllWays();
        var i = Math.round( Math.random() * ans.length );
        if ( !chessboard.move( ans[i].x, ans[i].y, ans[i].dx, ans[i].dy ) ) return null;
        return ans[i];
    };
};

var SampleAi = function ( chessboard, color ) {
    var that = this;
    that.move = function () {
        if ( color != chessboard.getColor() ) {
            console.log( "not ai turn!" );
            return {};
        }
        var ans = that.getWay( chessboard, 4 );
        if ( ans.failed ) {
            console.log( "I give up, you win!" );
            return null;
        }
        if ( !chessboard.move( ans.x, ans.y, ans.dx, ans.dy ) ) return null;
        return ans;
    };

    that.getWay = function ( mchessboard, deep ) {
        if ( deep == 0 || mchessboard.finished ) {
            return targetFunc( mchessboard );
        }

        var mcb = new ChessBoard( mchessboard ),
            mWays = mcb.getAllWays(),
            c = mcb.getColor(), oc = ( c == "black" ? "white" : "black" ),
            temp = {
                way: -1,
                result: {
                    black: 0,
                    white: 0
                }
            };
        for ( var i = 0; i < mWays.length; i++ ) {
            mcb = new ChessBoard( mchessboard );
            mcb.move( mWays[i].x, mWays[i].y, mWays[i].dx, mWays[i].dy );
            if ( mcb.finished ) {
                temp.way = i;
                temp.result = targetFunc( mcb );
                mcb.board[mWays[i].dx][mWays[i].dy].movedStep--;
                break;
            }

            var result = that.getWay( mcb, deep - 1 );

            if ( temp.way == -1 || ( result[c] - result[oc] > temp.result[c] - temp.result[oc] ) || ( ( result[c] - result[oc] == temp.result[c] - temp.result[oc] ) && Math.random() > 0.8 ) ) {
                temp.way = i;
                temp.result = result;
            }

            //rollback
            mcb.board[mWays[i].dx][mWays[i].dy].movedStep--;
        }
        if ( temp.way == -1 ) {
            return {
                failed: true
            };
        } else {
            var ans = mWays[temp.way];
            ans.black = temp.result.black;
            ans.white = temp.result.white;
            return ans;
        }
    }
};

function targetFunc( mcb ) {
    var ans = {
        black: 0,
        white: 0
    },
        cnum = getAllChessmenNum( mcb );

    with ( cnum ) {
        ans.black = bpa * 1 + bki * 10000 + bro * 5.5 + bbi * 3.5 + bqu * 10 + bkn * 3.5;
        ans.white = wpa * 1 + wki * 10000 + wro * 5.5 + wbi * 3.5 + wqu * 10 + wkn * 3.5;
    }
    return ans;
}


function getAllChessmenNum( mcb ) {
    var ans = {
        "wpa": 0,
        "bpa": 0,
        "wki": 0,
        "bki": 0,
        "wro": 0,
        "bro": 0,
        "wkn": 0,
        "bkn": 0,
        "wbi": 0,
        "bbi": 0,
        "wqu": 0,
        "bqu": 0
    };
    mcb.board.forEach( function ( row ) {
        row.forEach( function ( chessman ) {
            if ( chessman ) {
                var type = chessman.color.substr( 0, 1 ) + chessman.type.substr( 0, 2 );
                ans[type]++;
            }
        } );
    } );
    return ans;
}

exports.RandomAi = RandomAi;
exports.SampleAi = SampleAi;