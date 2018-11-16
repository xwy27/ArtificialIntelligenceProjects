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
   * Get the chess side: 'red' or 'black'
   * @param {string} chess the chess to be checked
   */
  getChessSide(chess) {
    return RED.indexOf(chess) == -1 ? 'black' : 'red';
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
   * Check if the next move is valid
   * @param {int} curX current chess x coordinate
   * @param {int} curY current chess y coordinate
   * @param {int} nextX next chess x coordinate
   * @param {int} nextY next chess y coordinate
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
    cur = twoToOne(curX, curY);
    next = twoToOne(nextX, nextY);
    if (this.board[next] != '0') {
      let curSide = this.getChessSide(this.board[cur]);
      let nextSide = this.getChessSide(this.board[next]);
      return curSide != nextSide;
    }
    return true;
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
    if (this.isChessMoveValid(cur, next)) {
      this.board[next] = this.board[cur];
      this.board[cur] = '0';
      this.chess[next].src = this.chess[cur].src;
      this.chess[cur].src = CHESS_IMG_PATH[this.board[cur]];
    }
  }
}