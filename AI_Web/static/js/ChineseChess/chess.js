class Chess {
  constructor(str) {
    this.name = str;
  }

  /**
   * Return the chess side: 'red', 'black' or 'empty'
   * @param {string} tag the chess symbol
   */
  getSide(tag) {
    return tag == '0' ? 'empty' : RED.indexOf(tag) == -1 ? 'black' : 'red';
  }

  /**
   * Return true if two chess are the same side
   * @param {string} chessTag_1 first chess
   * @param {string} chessTag_2 second chess
   */
  sameSide(chessTag_1, chessTag_2) {
    return this.getSide(chessTag_1) == this.getSide(chessTag_2);
  }

  /**
   * Return the (posX, posY) is the same half side as side,
   * which means not cross the river
   * @param {string} side 
   * @param {int} posX 
   * @param {int} posY 
   */
  isSameHalf(side, posX, posY) {
    if (side == 'red') {
      return twoToOne(posX, posY) > BLACK_SIDE; // red side
    }
    return twoToOne(posX, posY) < RED_SIDE; // black side
  }

  /**
   * Return the valid move positions for rook in the board
   * @param {int} position current rook position
   * @param {string} board current board
   */
  rookMove(position, board) {
    let pos = oneToTwo(position), ans = [], nextPos;
    for (let i = pos.x -1; i >= MIN_COL; --i) { // left horizontally
      nextPos = twoToOne(i, pos.y);
      if (board[nextPos] == '0')  ans.push(nextPos);
      else {
        if (!this.sameSide(board[nextPos], board[position])) {
          ans.push(nextPos);
        }
        break;
      }
    }
    for (let i = pos.x + 1; i <= MAX_COL; ++i) {  // right horizontally
      nextPos = twoToOne(i,pos.y);
      if (board[nextPos] == '0')  ans.push(nextPos);
      else {
        if (!this.sameSide(board[nextPos], board[position])) {
          ans.push(nextPos);
        }
        break;
      }
    } 
    for (let i = pos.y - 1; i >= MIN_ROW; --i) {  // up vertically
      nextPos = twoToOne(pos.x,i);
      if (board[nextPos] == '0')  ans.push(nextPos);
      else {
        if (!this.sameSide(board[nextPos], board[position])) {
          ans.push(nextPos);
        }
        break;
      }
    }
    for (let i = pos.y+1; i <= MAX_ROW; ++i) {  // down vertically
      nextPos = twoToOne(pos.x,i);
      if (board[nextPos] == '0')  ans.push(nextPos);
      else {
        if (!this.sameSide(board[nextPos], board[position])) {
          ans.push(nextPos);
        }
        break;
      }
    }
    return ans;
  }

  /**
   * Return the valid move positions for knight in the board
   * @param {int} position current knight position
   * @param {string} board current board
   */
  knightMove(position, board) {
    let pos = oneToTwo(position), ans = [];
    if (inBoard(pos.x-1, pos.y) && board[twoToOne(pos.x-1, pos.y)] == '0') {  // left obstacle
      if (inBoard(pos.x-2, pos.y+1) && !this.sameSide(board[twoToOne(pos.x-2, pos.y+1)], board[position])) {
        ans.push(twoToOne(pos.x-2,pos.y+1));
      }
      if (inBoard(pos.x-2, pos.y-1) && !this.sameSide(board[twoToOne(pos.x-2, pos.y-1)], board[position])) {
        ans.push(twoToOne(pos.x-2,pos.y-1));
      }
    }
    if (inBoard(pos.x, pos.y+1) && board[twoToOne(pos.x, pos.y+1)] == '0') { // up obstacle
      if (inBoard(pos.x-1, pos.y+2) && !this.sameSide(board[twoToOne(pos.x-1, pos.y+2)], board[position])){
        ans.push(twoToOne(pos.x-1,pos.y+2));
      }
      if (inBoard(pos.x+1, pos.y+2) && !this.sameSide(board[twoToOne(pos.x+1, pos.y+2)], board[position])){
        ans.push(twoToOne(pos.x+1,pos.y+2));
      }
    }
    if (inBoard(pos.x+1, pos.y) && board[twoToOne(pos.x+1, pos.y)] == '0') { // right obstacle
      if (inBoard(pos.x+2, pos.y+1) && !this.sameSide(board[twoToOne(pos.x+2, pos.y+1)], board[position])) {
        ans.push(twoToOne(pos.x+2,pos.y+1));
      }
      if (inBoard(pos.x+2, pos.y-1) && !this.sameSide(board[twoToOne(pos.x+2, pos.y-1)], board[position])) {
        ans.push(twoToOne(pos.x+2,pos.y-1));
      }
    }
    if (inBoard(pos.x, pos.y-1) && board[twoToOne(pos.x, pos.y-1)] == '0') { // down obstacle
      if (inBoard(pos.x-1, pos.y-2) && !this.sameSide(board[twoToOne(pos.x-1, pos.y-2)], board[position])) {
        ans.push(twoToOne(pos.x-1,pos.y-2));
      }
      if (inBoard(pos.x+1, pos.y-2) && !this.sameSide(board[twoToOne(pos.x+1, pos.y-2)], board[position])) {
        ans.push(twoToOne(pos.x+1,pos.y-2));
      }
    }
    return ans;
  }

  /**
   * Return the valid move positions for bishop in the board
   * @param {int} position current bishop position
   * @param {string} board current board
   */
  bishopMove(position, board, tag) {
    let side = this.getSide(tag);
    let pos = oneToTwo(position), ans = [];
    if (inBoard(pos.x-1, pos.y+1) && board[twoToOne(pos.x-1, pos.y+1)] == '0') {  // left-up obstacle
      if (inBoard(pos.x-2, pos.y+2) && this.isSameHalf(tag, pos.x-2, pos.y+2) &&
        !this.sameSide(board[twoToOne(pos.x-2, pos.y+2)], board[position])) {
        ans.push(twoToOne(pos.x-2, pos.y+2));
      }
    }
    if (inBoard(pos.x+1, pos.y+1) && board[twoToOne(pos.x+1, pos.y+1)] == '0') { // right-up obstacle
      if (inBoard(pos.x+2, pos.y+2) && this.isSameHalf(tag, pos.x+2, pos.y+2) &&
        !this.sameSide(board[twoToOne(pos.x+2, pos.y+2)], board[position])) {
        ans.push(twoToOne(pos.x+2, pos.y+2));
      }
    }
    if (inBoard(pos.x+1, pos.y-1) && board[twoToOne(pos.x+1, pos.y-1)] == '0') { // right-down obstacle
      if (inBoard(pos.x+2, pos.y-2) && this.isSameHalf(tag, pos.x+2, pos.y-2) &&
        !this.sameSide(board[twoToOne(pos.x+2, pos.y-2)], board[position])) {
        ans.push(twoToOne(pos.x+2, pos.y-2));
      }
    }
    if (inBoard(pos.x-1, pos.y-1) && board[twoToOne(pos.x-1, pos.y-1)] == '0') { // left-down obstacle
      if (inBoard(pos.x-2, pos.y-2) && this.isSameHalf(tag, pos.x-2, pos.y-2) &&
        !this.sameSide(board[twoToOne(pos.x-2, pos.y-2)], board[position])) {
        ans.push(twoToOne(pos.x-2, pos.y-2));
      }
    }
    return ans;
  }

  /**
   * Return the valid move position of the chess
   * Other side chess position is also included if can be killed
   * @param {string} tag the chess symbol
   * @param {int} position chess current position
   * @param {string} board current board
   * @return {array} valid positions represented in one dimension
   */
  chessMove(tag, position, board) {
    let ans = [], pos = oneToTwo(position), temp;
    let nextPos;
    switch(tag) {
      case 'r': case 'R':  // rook walks horizontally or vertically
        ans = this.rookMove(position, board);
        break;
      case 'n': case 'N': // knight walks diagonally in a word '日' without obstacle
        ans = this.knightMove(position, board);
        break;
      case 'b': case 'B':  // bishop walks diagonally in a word '田' without obstacle and remains in one half side of board
        ans = this.bishopMove(position, board, tag);
        break;
      case 'a': case 'A':  // advisor walks diagonally one step inside an square area in its half side
        temp = 1;
        for (let i = 0; i < 2; ++i) {
          for (let j = 0; j < 2; ++j) {
            let factorX = i % 2 == 0 ? -1 : 1;
            let factorY = j % 2 == 0 ? -1 : 1;
            let nextX = pos.x + factorX * temp;
            let nextY = pos.y + factorY * temp;
            if (inBoard(nextX, nextY)) { // inside board
                nextPos = twoToOne(nextX, nextY);
                // obey Chinese chess rule
                if (tag == 'B' && BLACK_SQUARE.indexOf(nextPos) != -1 &&
                  !this.sameSide(board[nextPos], board[position])) {
                  ans.push(nextPos);
                } else if (tag == 'b' && RED_SQUARE.indexOf(nextPos) != -1 &&
                  !this.sameSide(board[nextPos], board[position])) {
                  ans.push(nextPos);
                }
            }
          }
        }
        break;
      case 'k': case 'K':  // king walks inside an square area in its half side and one step each
        temp = 1;
        for (let i = 0; i < 4; ++i) {
          let factor = i % 2 == 0 ? -1 : 1;
          let nextX, nextY;
          if (i < 2) {
            nextX = pos.x + factor * temp;
            nextY = pos.y;
          } else {
            nextX = pos.x;
            nextY = pos.y + factor * temp;
          }
          if (inBoard(nextX, nextY)) { // inside board
              nextPos = twoToOne(nextX, nextY);
              // obey Chinese chess rule
              if (tag == 'k' && BLACK_SQUARE.indexOf(nextPos) != -1 &&
                !this.sameSide(board[nextPos], board[position])) {
                ans.push(nextPos);
              } else if (tag == 'K' && RED_SQUARE.indexOf(nextPos) != -1 &&
                !this.sameSide(board[nextPos], board[position])) {
                ans.push(nextPos);
              }
          }
        }
        break;
      case 'c': case 'C':  // cannon walks horizontally or vertically
        for (let i = pos.x - 1; i >= MIN_COL; --i) {  // left horizontally
          nextPos = twoToOne(i, pos.y);
          if (board[nextPos] == '0')  ans.push(nextPos);
          else {
            for (let j = nextPos - 1; j >= MIN_COL; --j) {
              if (board[j] != '0' && !this.sameSide(board[j], board[position])) {
                ans.push(j);
                break;
              }
            }
            break;
          }
        }
        for (let i = pos.x+1; i <= MAX_COL; ++i) {  // right horizontally
          nextPos = twoToOne(i,pos.y);
          if (board[nextPos] == '0')  ans.push(nextPos);
          else {
            for (let j = nextPos + 1; j <= MAX_COL; ++j) {
              if (board[j] != '0' && !this.sameSide(board[j], board[position])) {
                ans.push(j);
                break;
              }
            }
            break;
          }
        } 
        for (let i = pos.y-1; i >= MIN_ROW; --i) {  // up vertically
          nextPos = twoToOne(pos.x,i);
          if (board[nextPos] == '0')  ans.push(nextPos);
          else {
            for (let j = nextPos - 1; j >= MIN_ROW; --j) {
              if (board[j] != '0' && !this.sameSide(board[j], board[position])) {
                ans.push(j);
                break;
              }
            }
            break;
          }
        }
        for (let i = pos.y + 1; i <= MAX_ROW; ++i) {  // down vertically
          nextPos = twoToOne(pos.x,i);
          if (board[nextPos] == '0')  ans.push(nextPos);
          else {
            for (let j = nextPos + 1; j <= MAX_ROW; ++j) {
              if (board[j] != '0' && !this.sameSide(board[j], board[position])) {
                ans.push(j);
                break;
              }
            }
            break;
          }
        }
        break;
      case 'p': case 'P':  // pawn walks one step, could not walk back, no left or right move until cross river
        let isCross = this.isSameHalf(tag, pos.x, pos.y);  // if pawn cross river
        if (tag == 'p') { // red pawn
          if (inBoard(pos.x, pos.y-1) && !this.sameSide(board[twoToOne(pos.x, pos.y-1)], board[position])) {
            ans.push(twoToOne(pos.x, pos.y-1));
          }
        } else {  // black pawn
          if (inBoard(pos.x, pos.y+1) && !this.sameSide(board[twoToOne(pos.x, pos.y+1)], board[position])) {
            ans.push(twoToOne(pos.x, pos.y+1));
          }
        }
        if (isCross) {  // cross river could move left or right
          if (inBoard(pos.x-1, pos.y) && !this.sameSide(board[twoToOne(pos.x-1, pos.y)], board[position])) {
            ans.push(pos.x-1, pos.y);
          }
          if (inBoard(pos.x+1, pos.y) && !this.sameSide(board[twoToOne(pos.x+1, pos.y)], board[position])) {
            ans.push(pos.x+1, pos.y);
          }
        }
        break;
    }
    return ans;
  }
}