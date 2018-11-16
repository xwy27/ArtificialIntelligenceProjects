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
    if (board.isChess(cur)) { // is chess
      cur = $(this).attr('data-index');
      $(this).removeClass('not-select');
      $(this).addClass('select');
    }
  } else { // select destination
    next = $(this).attr('data-index');
    if (board.isChess(next)) {
      if (next == cur) { // give up selection
        $(this).removeClass('select');
        $(this).addClass('not-select');
        cur = -1;
        next = -1;
      } else if (board.getChessSide(cur) == board.getChessSide(next)) { // same side, change selection
        chessDom[cur].classList.remove('select');
        chessDom[cur].classList.add('not-select');
        $(this).removeClass('not-select');
        $(this).addClass('select');
        cur = next;
        next = -1;
      }
    } else { // move chess
      chessDom[cur].classList.remove('select');
      chessDom[cur].classList.add('not-select');
      board.moveChess(cur, next);
      // TODO:Change turn
    }
  }
});

board.initBoard();