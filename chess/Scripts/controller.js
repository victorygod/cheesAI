var chessboard = new ChessBoard(),
    ai = new SampleAi( chessboard, "black" );

chessboard.gameOver = function ( info ) {
    chessboard.finished = true;
    setTimeout(function() {
        alert( info );
        chessboard = new ChessBoard();
        drawChessman( chessboard );
    }, 1000);
}

$( document ).ready( function () {
    //draw the chessboard
    var rows = $( ".row" );
    forTheWholeChessboard( function ( i, j ) {
        rows[i].innerHTML += "<div id='" + ( 7 - i ) + "" + j + "' class='lattice'></div>";
    } );
    drawChessman( chessboard );
    $( "#info" ).text( "Your turn" );
} );

function drawChessman( chess ) {
    var board = chess.board;
    forTheWholeChessboard( function ( i, j ) {
        if ( board[i][j] ) {
            $( "#" + i + "" + j ).addClass( "hoverable" );
            $( "#" + i + "" + j ).html( "<div class='chessman " + board[i][j].color + "Chessman " + board[i][j].type + "'></div>" );
            $( "#" + i + "" + j ).unbind( "click" ).click( function () {
                clickMove( chess, i, j );
            } );
        } else {
            $( "#" + i + "" + j ).removeClass( "hoverable" );
            $( "#" + i + "" + j ).unbind( "click" );
            $( "#" + i + "" + j ).html( "" );
        }
    } );
}

function forTheWholeChessboard( func ) {
    if ( !func ) return;
    for ( var i = 0; i < 8; i++ )
        for ( var j = 0; j < 8; j++ )
            func( i, j );
}

function clickMove( chess, x, y ) { //hint
    forTheWholeChessboard( function ( r, c ) {
        $( "#" + r + "" + c ).unbind( "click" );
        $( "#" + r + "" + c ).removeClass( "canMoveTo" );
    } );
    var ways = chess.getOneChessmanWays( x, y );
    ways.forEach( function ( way ) {
        $( "#" + way.dx + "" + way.dy ).click( function () { 
            forTheWholeChessboard( function ( r, c ) {
                $( "#" + r + "" + c ).removeClass( "canMoveTo" );
                $( "#" + r + "" + c ).click( function () {
                    clickMove( chess, r, c );
                } );
            } );
            move( chess, x, y, way.dx, way.dy );
        } );
        $( "#" + way.dx + "" + way.dy ).addClass( "canMoveTo" );
    } );
    forTheWholeChessboard( function ( r, c ) {
        if ( $( "#" + r + "" + c ).attr("class").indexOf("canMoveTo")==-1  ) {
            $( "#" + r + "" + c ).click( function () {
                clickMove( chess, r, c );
            } );
        }
    } );
}

function move( chess, x, y, dx, dy ) { //move
    if ( chess.move( x, y, dx, dy ) ) {
        drawChessman( chess );
        $( "#info" ).text( "AI turn. AI is thinking..." );
        setTimeout(function() {
            var ans = ai.move();
            drawChessman( chess );
            $( "#info" ).text( "AI moved: " + translatePos( ans.x, ans.y ) + " " + translatePos( ans.dx, ans.dy ) );
        }, 200);
    }
}

var rowTag = [1, 2, 3, 4, 5, 6, 7, 8],
    columnTag = ["a", "b", "c", "d", "e", "f", "g", "h"];

function translatePos( x, y ) {
    return columnTag[y] + rowTag[x];
}