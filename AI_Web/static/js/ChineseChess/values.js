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
const BLACK = ['R', 'N', 'B', 'A', 'K', 'C', 'P'];
const RED = ['r', 'n', 'b', 'a', 'k', 'c', 'p'];
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
const BLACK_TURN = false;
const BLACK_CLASS = 'black';
const BLACK_PLAYING = '黑方';
const RED_TURN = true;
const RED_CLASS = 'red';
const RED_PLAYING = '红方';

// Evaluation of chess position
const KING_PAWN_VALUE = [
  9, 9, 9, 11, 13, 11, 9, 9, 9,
  19, 24, 34, 42, 44, 42, 34, 24, 19,
  19, 24, 32, 37, 37, 37, 32, 24, 19,
  19, 23, 27, 29, 30, 29, 27, 23, 19,
  14, 18, 20, 27, 29, 27, 20, 18, 14,
  7, 0, 13, 0, 16, 0, 13, 0, 7,
  7, 0, 7, 0, 15, 0, 7, 0, 7,
  0, 0, 0, 1, 1, 1, 0, 0, 0,
  0, 0, 0, 2, 2, 2, 0, 0, 0,
  0, 0, 0, 11, 15, 11, 0, 0, 0,
];
const ADVISOR_BISHOP_VALUE = [
  0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 20, 0, 0, 0, 20, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0,
  18, 0, 0, 20, 23, 20, 0, 0, 18,
  0, 0, 0, 0, 23, 0, 0, 0, 0,
  0, 0, 20, 20, 0, 20, 20, 0, 0,
];
const KNIGHT_VALUE = [
  90, 90, 90, 96, 90, 96, 90, 90, 90,
  90, 96, 103, 97, 94, 97, 103, 96, 90,
  92, 98, 99, 103, 99, 103, 99, 98, 92,
  93, 108, 100, 107, 100, 107, 100, 108, 93,
  90, 100, 99, 103, 104, 103, 99, 100, 90,
  90, 98, 101, 102, 103, 102, 101, 98, 90,
  92, 94, 98, 95, 98, 95, 98, 94, 92,
  93, 92, 94, 95, 92, 95, 94, 92, 93,
  85, 90, 92, 93, 78, 93, 92, 90, 85,
  88, 85, 90, 88, 90, 88, 90, 85, 88,
];
const ROOK_VALUE = [
  206, 208, 207, 213, 214, 213, 207, 208, 206,
  206, 212, 209, 216, 233, 216, 209, 212, 206,
  206, 208, 207, 214, 216, 214, 207, 208, 206,
  206, 213, 213, 216, 216, 216, 213, 213, 206,
  208, 211, 211, 214, 215, 214, 211, 211, 208,
  208, 212, 212, 214, 215, 214, 212, 212, 208,
  204, 209, 204, 212, 214, 212, 204, 209, 204,
  198, 208, 204, 212, 212, 212, 204, 208, 198,
  200, 208, 206, 212, 200, 212, 206, 208, 200,
  194, 206, 204, 212, 200, 212, 204, 206, 194,
];
const CANNON_VALUE = [
  100, 100, 96, 91, 90, 91, 96, 100, 100,
  98, 98, 96, 92, 89, 92, 96, 98, 98,
  97, 97, 96, 91, 92, 91, 96, 97, 97,
  96, 99, 99, 98, 100, 98, 99, 99, 96,
  96, 96, 96, 96, 100, 96, 96, 96, 96,
  95, 96, 99, 96, 100, 96, 99, 96, 95,
  96, 96, 96, 96, 96, 96, 96, 96, 96,
  97, 96, 100, 99, 101, 99, 100, 96, 97,
  96, 97, 98, 98, 98, 98, 98, 97, 96,
  96, 96, 97, 99, 99, 99, 97, 96, 96,
];