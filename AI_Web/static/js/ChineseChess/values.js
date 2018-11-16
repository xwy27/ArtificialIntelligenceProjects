// chess image source path
const CHESS_IMG_PATH = {
  'R': '/static/img/ChineseChess/black_rook.gif',
  'N': '/static/img/ChineseChess/black_knight.gif',
  'B': '/static/img/ChineseChess/black_bishop.gif',
  'A': '/static/img/ChineseChess/black_advisor.gif',
  'K': '/static/img/ChineseChess/black_king.gif',
  'C': '/static/img/ChineseChess/black_cannon.gif',
  'P': '/static/img/ChineseChess/black_pawn.gif',
  'r': '/static/img/ChineseChess/red_rook.gif',
  'n': '/static/img/ChineseChess/red_knight.gif',
  'b': '/static/img/ChineseChess/red_bishop.gif',
  'a': '/static/img/ChineseChess/red_advisor.gif',
  'k': '/static/img/ChineseChess/red_king.gif',
  'c': '/static/img/ChineseChess/red_cannon.gif',
  'p': '/static/img/ChineseChess/red_pawn.gif',
  '0': '/static/img/ChineseChess/empty.jpg'
};

// chess side
const BLACK = ['R','N','B','A','K','C','P'];
const RED = ['r','n','b','a','k','c','p'];
const BLACK_SIDE = 44;
const RED_SIDE = 45;
const BLACK_SQUARE = [3, 4, 5, 12, 13, 14, 21, 22, 23];
const RED_SQUARE = [66, 67, 68, 75, 76, 77, 84, 85, 86];

// game state
const RED_WIN = 'R';
const BLACK_WIN = 'B';
const PLAYING = 'P';

// board size limits
const MIN_ROW = 0;
const MAX_ROW = 9;
const MIN_COL = 0;
const MAX_COL = 8;

// player turn
const BLACK_TURN = 0;
const RED_TURN = 1;
