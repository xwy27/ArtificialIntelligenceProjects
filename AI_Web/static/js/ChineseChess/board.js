class Board {
  /**
   * Control the chess board
   * 
   * Member var:
   * string board: the chess board string
   * Array chess: the chess dom nodes
   */

  /**
   * Constructor
   * @param {Array} chess chess dom nodes
   */
  constructor(chess) {
    this.chess = chess;
    this.chessHelper = new Chess('myChess');
    this.board = [];
    let temp = this.getInitialBoard();
    for (let i = 0; i < temp.length; ++i) {
      this.board.push(temp[i]);
    }
  }

  /**
   * return the initial board string
   */
  getInitialBoard() {
    return 'RNBAKABNR' + 
      '000000000' +
      '0C00000C0' +
      'P0P0P0P0P' +
      '000000000' +
      '000000000' +
      'p0p0p0p0p' +
      '0c00000c0' +
      '000000000' +
      'rnbakabnr';
  }

  /**
   * return the current board
   */
  getBoard() {
    let temp = '';
    $.each(this.board, (index, value) => {
      temp += value;
    })
    return temp;
  }

  /**
   * Return which side the chess is
   * @param {int} pos the position of the chess
   */
  getSide(pos) {
    return this.chessHelper.getSide(this.board[pos]);
  }

  /**
   * return the game state
   */
  getGameState() {
    if (this.board.indexOf('K') == -1) {
      return RED_WIN;
    } else if (this.board.indexOf('k') == -1) {
      return BLACK_WIN;
    }
    return PLAYING;
  }
  
  /**
   * Check the position contains a chess
   * @param {int} pos position to be checked
   */
  isChess(pos) {
    return this.board[pos] != '0';
  }

  /**
   * Return if two chess are at the same side
   * @param {int} pos1 pos for chess 1
   * @param {int} pos2 pos for chess 2
   */
  isSameSide(pos1, pos2) {
    return this.chessHelper.isSameSide(this.board[pos1], this.board[pos2]);
  }

  /**
   * Check if the next move is valid
   * @param {int} cur current chess coordinate
   * @param {int} next next chess coordinate
   */
  isChessMoveValid(cur, next) {
    let temp = oneToTwo(cur);
    let curX = temp.x;
    let curY = temp.y;
    temp = oneToTwo(next);
    let nextX = temp.x;
    let nextY = temp.y;
    if (nextX < MIN_ROW || nextX > MAX_ROW ||
      nextY < MIN_COL || nextY > MAX_COL){
      return false;
    }
    
    let ans = this.chessHelper.chessMove(this.board[cur], cur, this.getBoard());
    if (ans.length == 0) {
      return false;
    }
    return true;
  }

  /**
   * Return the possible positions for chess to move
   * @param {int} cur current chess position
   */
  getChessMovePos(cur) {
    return this.chessHelper.chessMove(this.board[cur], cur, this.getBoard());
  }

  /**
   * Initial the board view
   */
  initBoard() {
    let board = this.getInitialBoard();
    $.each(this.chess, (index, value) => {
      value.src = CHESS_IMG_PATH[board[index]];
    });
  }

  /**
   * Move chess from current pos to next pos if valid
   * @param {int} cur current chess pos
   * @param {int} next next chess pos
   */
  moveChess(cur, next) {
    let ans = this.getChessMovePos(cur);
    // console.log(this.board[cur] + ' moves from: (' + oneToTwo(cur).x + ',' + oneToTwo(cur).y + ') to:' +
    //   '(' + oneToTwo(next).x + ', ' + oneToTwo(next).y + ')');
    // console.log(typeof(ans), ans);
    // console.log(typeof(next), next);
    if (ans.indexOf(next) != -1) {
      this.board[next] = this.board[cur];
      this.board[cur] = '0';
      this.chess[next].src = this.chess[cur].src;
      this.chess[cur].src = CHESS_IMG_PATH[this.board[cur]];
      return {
        'move': true,
        'game': this.getGameState()
      }
    } else {
      console.log("Invalid!");
    }
    return {
      'move': false,
      'game': this.getGameState()
    };
  }

  /**
   * Reset the board
   */
  resetBoard() {
    this.board = [];
    let temp = this.getInitialBoard();
    for (let i = 0; i < temp.length; ++i) {
      this.board.push(temp[i]);
    }
  }
}