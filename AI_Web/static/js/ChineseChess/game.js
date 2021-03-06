let turn = RED_TURN; // Current player
let cur = -1; // Current select chess pos
let next = -1; // Next position for chess to 
let gameState = PLAYING;  // Game state

let chessDom = $('img');  // node of board
let board = new Board(chessDom);  // board
let ai = new AI("MAX"); // AI

// Set index for node in board
chessDom.each(function (index, value) {
  $(this).attr('data-index', index).addClass('not-select');
});

/**
 * AI moves one step
 */
function AIMove() {
  let k = 4;
  // let ai_move = ai.MiniMaxSearch(board.getBoard(), k);
  let ai_move = ai.AlphaBetaSearch(board.getBoard(), k, Infinity);
  ai_move.origin = ai_move.moves[0][0];
  ai_move.next = ai_move.moves[0][1];
  console.log(ai_move);
  let ai_score = board.moveChess(ai_move.origin, ai_move.next);
  if (ai_score.game == PLAYING && ai_score.move) {
    turn = !turn;
  } else if (ai_score.game != PLAYING) {
    if (ai_score.game == RED_WIN) {
      alert('RED WIN');
    } else {
      alert('BLACK WIN');
    }
    gameState = ai_score.game;
  }
}

// Set click event for chess
chessDom.on('click', function () {
  if (gameState == PLAYING) { // Only playing could play
    if (cur == -1) { // select chess
      cur = parseInt($(this).attr('data-index'));
      // if turn matches player
      if (turn && board.getSide(cur) == 'red') {
      // if (turn && board.getSide(cur) == 'red' || !turn && board.getSide(cur) == 'black') {
        if (board.isChess(cur)) { // is chess
          $(this).removeClass('not-select');
          $(this).addClass('select');
        }
      } else {
        cur = -1;
      }
    } else { // select destination
      next = parseInt($(this).attr('data-index'));
      if (board.isChess(next)) {
        if (next == cur) { // give up selection
          $(this).removeClass('select');
          $(this).addClass('not-select');
          cur = -1;
          next = -1;
        } else {
          if (board.isSameSide(cur, next)) { // same side, change selection
            chessDom[cur].classList.remove('select');
            chessDom[cur].classList.add('not-select');
            $(this).removeClass('not-select');
            $(this).addClass('select');
            cur = next;
            next = -1;
          } else {  // other side, kill that chess
            chessDom[cur].classList.remove('select');
            chessDom[cur].classList.add('not-select');
            let temp_store = board.moveChess(cur, next);
            if (temp_store.game == PLAYING && temp_store.move) { // game continue and move successfully, change turn
              turn = !turn;
              // AI moves
              AIMove();
            } else if (temp_store.game != PLAYING){  // game end
              if (temp_store.game == RED_WIN) {
                alert('RED WIN');
              } else {
                alert('BLACK WIN');
              }
              gameState = temp_store.game;
            }
            cur = -1;
            next = -1;
            $('#player').removeClass().addClass(turn ? RED_CLASS : BLACK_CLASS);
            $('#player').html(turn ? RED_PLAYING : BLACK_PLAYING);
          }
        }
      } else { // move chess to empty
        chessDom[cur].classList.remove('select');
        chessDom[cur].classList.add('not-select');
        let temp_store = board.moveChess(cur, next);
        if (temp_store.game == PLAYING && temp_store.move) { // game continue and move successfully, change turn
          turn = !turn;
          // AI moves
          AIMove();
        } else if (temp_store.game != PLAYING) {  // game end
          if (temp_store.game == RED_WIN) {
            alert('RED WIN');
          } else {
            alert('BLACK WIN');
          }
          gameState = temp_store.game;
        }
        cur = -1;
        next = -1;
        $('#player').removeClass().addClass(turn ? RED_CLASS : BLACK_CLASS);
        $('#player').html(turn ? RED_PLAYING : BLACK_PLAYING);
      }
    }
  }
});

/**
 * Set hint for player
 */
let ans = [];
chessDom.hover(function() {
  let pos = $(this).attr('data-index');
  if (turn && board.isChess(pos) && board.getSide(pos) == 'red') {
    ans = board.getChessMovePos(parseInt(pos));
    $.each(ans, (index, value) => {
      $("img[data-index="+ value +"]").removeClass('not-select');
      $("img[data-index="+ value +"]").addClass('hint');
    });
  }
}, function() {
  $.each(ans, (index, value) => {
    $("img[data-index="+ value +"]").removeClass('hint');
    $("img[data-index="+ value +"]").addClass('not-select');
  });
});

/**
 * Start Game
 */
function startGame() {
  board.resetBoard();
  board.initBoard();
  turn = RED_TURN;
  gameState = PLAYING;
  $('#player').removeClass().addClass(turn ? RED_CLASS : BLACK_CLASS);
  $('#player').html(turn ? RED_PLAYING : BLACK_PLAYING);
}

// Bind restart button
$('.button').on('click', startGame);

startGame();