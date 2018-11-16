let turn = RED_TURN; // Current player
let cur = -1; // Current select chess pos
let next = -1; // Next position for chess to move

let chessDom = $('img');
let board = new Board(chessDom);

chessDom.each(function (index, value) {
  $(this).attr('data-index', index);
});
chessDom.on('click', function () {
  if (cur == -1) { // select chess
    cur = parseInt($(this).attr('data-index'));
    if (board.isChess(cur)) { // is chess
      $(this).removeClass('not-select');
      $(this).addClass('select');
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
          console.log('same');
          chessDom[cur].classList.remove('select');
          chessDom[cur].classList.add('not-select');
          $(this).removeClass('not-select');
          $(this).addClass('select');
          cur = next;
          next = -1;
        } else {  // other side, kill that chess
          console.log('diff');
          chessDom[cur].classList.remove('select');
          chessDom[cur].classList.add('not-select');
          board.moveChess(cur, next);
          cur = -1;
          next = -1;
          // TODO:Change turn
        }
      }
    } else { // move chess
      chessDom[cur].classList.remove('select');
      chessDom[cur].classList.add('not-select');
      board.moveChess(cur, next);
      cur = -1;
      next = -1;
      // TODO:Change turn
    }
  }
});
chessDom.on('hover', function() {
  let ans = board.getChessMovePos(parseInt($(this).attr('data-index')));
  console.log(ans);
});

board.initBoard();