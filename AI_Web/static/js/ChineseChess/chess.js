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
  isSameSide(chessTag_1, chessTag_2) {
    return this.getSide(chessTag_1) == this.getSide(chessTag_2);
  }

  /**
   * Return whether the (posX, posY) is at the half side,
   * which means whether cross the river
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
   * Return the (posX, posY) is inside the same side square,
   * which means whether cross the square
   * @param {string} side 
   * @param {int} posX 
   * @param {int} posY 
   */
  isSameSquare(side, posX, posY) {
    if (side == 'red') {
      return RED_SQUARE.indexOf(twoToOne(posX, posY)) != -1;  // red square
    }
    return BLACK_SQUARE.indexOf(twoToOne(posX, posY)) != -1;  // black square
  }

  /**
   * Return the valid move positions for rook in the board.
   * Rook walks horizontally or vertically
   * @param {int} position current rook position
   * @param {string} board current board
   */
  rookMove(position, board) {
    let pos = oneToTwo(position), ans = [], nextPos;
    for (let i = pos.x -1; i >= MIN_COL; --i) { // left horizontally
      nextPos = twoToOne(i, pos.y);
      if (board[nextPos] == '0')  ans.push(nextPos);
      else {
        if (!this.isSameSide(board[nextPos], board[position])) {
          ans.push(nextPos);
        }
        break;
      }
    }
    for (let i = pos.x + 1; i <= MAX_COL; ++i) {  // right horizontally
      nextPos = twoToOne(i,pos.y);
      if (board[nextPos] == '0')  ans.push(nextPos);
      else {
        if (!this.isSameSide(board[nextPos], board[position])) {
          ans.push(nextPos);
        }
        break;
      }
    } 
    for (let i = pos.y - 1; i >= MIN_ROW; --i) {  // up vertically
      nextPos = twoToOne(pos.x,i);
      if (board[nextPos] == '0')  ans.push(nextPos);
      else {
        if (!this.isSameSide(board[nextPos], board[position])) {
          ans.push(nextPos);
        }
        break;
      }
    }
    for (let i = pos.y+1; i <= MAX_ROW; ++i) {  // down vertically
      nextPos = twoToOne(pos.x,i);
      if (board[nextPos] == '0')  ans.push(nextPos);
      else {
        if (!this.isSameSide(board[nextPos], board[position])) {
          ans.push(nextPos);
        }
        break;
      }
    }
    return ans;
  }

  /**
   * Return the valid move positions for knight in the board
   * Knight walks diagonally in a word '日' without obstacle at next position
   * @param {int} position current knight position
   * @param {string} board current board
   */
  knightMove(position, board) {
    let pos = oneToTwo(position), ans = [];
    if (inBoard(pos.x-1, pos.y) && board[twoToOne(pos.x-1, pos.y)] == '0') {  // left obstacle
      if (inBoard(pos.x-2, pos.y+1) && !this.isSameSide(board[twoToOne(pos.x-2, pos.y+1)], board[position])) {
        ans.push(twoToOne(pos.x-2,pos.y+1));
      }
      if (inBoard(pos.x-2, pos.y-1) && !this.isSameSide(board[twoToOne(pos.x-2, pos.y-1)], board[position])) {
        ans.push(twoToOne(pos.x-2,pos.y-1));
      }
    }
    if (inBoard(pos.x, pos.y+1) && board[twoToOne(pos.x, pos.y+1)] == '0') { // up obstacle
      if (inBoard(pos.x-1, pos.y+2) && !this.isSameSide(board[twoToOne(pos.x-1, pos.y+2)], board[position])){
        ans.push(twoToOne(pos.x-1,pos.y+2));
      }
      if (inBoard(pos.x+1, pos.y+2) && !this.isSameSide(board[twoToOne(pos.x+1, pos.y+2)], board[position])){
        ans.push(twoToOne(pos.x+1,pos.y+2));
      }
    }
    if (inBoard(pos.x+1, pos.y) && board[twoToOne(pos.x+1, pos.y)] == '0') { // right obstacle
      if (inBoard(pos.x+2, pos.y+1) && !this.isSameSide(board[twoToOne(pos.x+2, pos.y+1)], board[position])) {
        ans.push(twoToOne(pos.x+2,pos.y+1));
      }
      if (inBoard(pos.x+2, pos.y-1) && !this.isSameSide(board[twoToOne(pos.x+2, pos.y-1)], board[position])) {
        ans.push(twoToOne(pos.x+2,pos.y-1));
      }
    }
    if (inBoard(pos.x, pos.y-1) && board[twoToOne(pos.x, pos.y-1)] == '0') { // down obstacle
      if (inBoard(pos.x-1, pos.y-2) && !this.isSameSide(board[twoToOne(pos.x-1, pos.y-2)], board[position])) {
        ans.push(twoToOne(pos.x-1,pos.y-2));
      }
      if (inBoard(pos.x+1, pos.y-2) && !this.isSameSide(board[twoToOne(pos.x+1, pos.y-2)], board[position])) {
        ans.push(twoToOne(pos.x+1,pos.y-2));
      }
    }
    return ans;
  }

  /**
   * Return the valid move positions for bishop in the board.
   * Bishop walks diagonally in a word '田' without obstacle at the center and remains in its half side
   * @param {int} position current bishop position
   * @param {string} board current board
   * @param {string} tag current bishop chess symbol
   */
  bishopMove(position, board, tag) {
    let pos = oneToTwo(position), ans = [], side = this.getSide(tag);
    if (inBoard(pos.x-1, pos.y+1) && board[twoToOne(pos.x-1, pos.y+1)] == '0') {  // left-up obstacle
      if (inBoard(pos.x-2, pos.y+2) && this.isSameHalf(side, pos.x-2, pos.y+2) &&
        !this.isSameSide(board[twoToOne(pos.x-2, pos.y+2)], board[position])) {
        ans.push(twoToOne(pos.x-2, pos.y+2));
      }
    }
    if (inBoard(pos.x+1, pos.y+1) && board[twoToOne(pos.x+1, pos.y+1)] == '0') { // right-up obstacle
      if (inBoard(pos.x+2, pos.y+2) && this.isSameHalf(side, pos.x+2, pos.y+2) &&
        !this.isSameSide(board[twoToOne(pos.x+2, pos.y+2)], board[position])) {
        ans.push(twoToOne(pos.x+2, pos.y+2));
      }
    }
    if (inBoard(pos.x+1, pos.y-1) && board[twoToOne(pos.x+1, pos.y-1)] == '0') { // right-down obstacle
      if (inBoard(pos.x+2, pos.y-2) && this.isSameHalf(side, pos.x+2, pos.y-2) &&
        !this.isSameSide(board[twoToOne(pos.x+2, pos.y-2)], board[position])) {
        ans.push(twoToOne(pos.x+2, pos.y-2));
      }
    }
    if (inBoard(pos.x-1, pos.y-1) && board[twoToOne(pos.x-1, pos.y-1)] == '0') { // left-down obstacle
      if (inBoard(pos.x-2, pos.y-2) && this.isSameHalf(side, pos.x-2, pos.y-2) &&
        !this.isSameSide(board[twoToOne(pos.x-2, pos.y-2)], board[position])) {
        ans.push(twoToOne(pos.x-2, pos.y-2));
      }
    }
    return ans;
  }

  /**
   * Return the valid move positions for advisor in the board.
   * Advisor walks diagonally inside an square area in its half side and one step each
   * @param {int} position current advisor position
   * @param {string} board current board
   * @param {string} tag current advisor chess symbol
   */
  advisorMove(position, board, tag) {
    let ans = [], pos = oneToTwo(position), side = this.getSide(tag);
    if (inBoard(pos.x-1, pos.y-1) && this.isSameSquare(side, pos.x-1, pos.y-1) &&
      !this.isSameSide(board[twoToOne(pos.x-1, pos.y-1)], board[position])) { // left-down
      ans.push(twoToOne(pos.x-1, pos.y-1));
    }
    if (inBoard(pos.x-1, pos.y+1) && this.isSameSquare(side, pos.x-1, pos.y+1) &&
      !this.isSameSide(board[twoToOne(pos.x-1, pos.y+1)], board[position])) { // left-up
      ans.push(twoToOne(pos.x-1, pos.y+1));
    }
    if (inBoard(pos.x+1, pos.y+1) && this.isSameSquare(side, pos.x+1, pos.y+1) &&
      !this.isSameSide(board[twoToOne(pos.x+1, pos.y+1)], board[position])) { // right-up
      ans.push(twoToOne(pos.x+1, pos.y+1));
    }
    if (inBoard(pos.x+1, pos.y-1) && this.isSameSquare(side, pos.x+1, pos.y-1) &&
      !this.isSameSide(board[twoToOne(pos.x+1, pos.y-1)], board[position])) { // right-down
      ans.push(twoToOne(pos.x+1, pos.y-1));
    }
    return ans;
  }

  /**
   * Return the valid move positions for king in the board.
   * King walks inside an square area in its half side and one step each
   * @param {int} position current king position
   * @param {string} board current board
   * @param {string} tag current king chess symbol
   */
  kingMove(position, board, tag) {
    let ans = [], pos = oneToTwo(position), side = this.getSide(tag);
    if (inBoard(pos.x-1, pos.y) && this.isSameSquare(side, pos.x-1, pos.y) &&
      !this.isSameSide(board[twoToOne(pos.x-1, pos.y)], board[position])) { // left
      ans.push(twoToOne(pos.x-1, pos.y));
    }
    if (inBoard(pos.x, pos.y+1) && this.isSameSquare(side, pos.x, pos.y+1) &&
      !this.isSameSide(board[twoToOne(pos.x, pos.y+1)], board[position])) { // up
      ans.push(twoToOne(pos.x, pos.y+1));
    }
    if (inBoard(pos.x+1, pos.y) && this.isSameSquare(side, pos.x+1, pos.y) &&
      !this.isSameSide(board[twoToOne(pos.x+1, pos.y)], board[position])) { // right
      ans.push(twoToOne(pos.x+1, pos.y));
    }
    if (inBoard(pos.x, pos.y-1) && this.isSameSquare(side, pos.x, pos.y-1) &&
      !this.isSameSide(board[twoToOne(pos.x, pos.y-1)], board[position])) { // down
      ans.push(twoToOne(pos.x, pos.y-1));
    }
    return ans;
  }

  /**
   * Return the valid move positions for cannon in the board.
   * Cannon walks horizontally or vertically and kills one chess by 'jumping over' one chess
   * @param {int} position current cannon position
   * @param {string} board current board
   */
  cannonMove(position, board) {
    let pos = oneToTwo(position), ans = [], killPos, nextPos;
    for (let i = pos.x - 1; i >= MIN_COL; --i) {  // left horizontally
      nextPos = twoToOne(i, pos.y);
      if (board[nextPos] == '0')  ans.push(nextPos);
      else {
        for (let j = i - 1; j >= MIN_COL; --j) {
          killPos = twoToOne(j, pos.y);
          if (board[killPos] != '0' && !this.isSameSide(board[killPos], board[position])) {
            ans.push(killPos);
            break;
          }
        }
        break;
      }
    }
    for (let i = pos.x + 1; i <= MAX_COL; ++i) {  // right horizontally
      nextPos = twoToOne(i, pos.y);
      if (board[nextPos] == '0')  ans.push(nextPos);
      else {
        for (let j = i + 1; j <= MAX_COL; ++j) {
          killPos = twoToOne(j, pos.y);
          if (board[killPos] != '0' && !this.isSameSide(board[killPos], board[position])) {
            ans.push(killPos);
            break;
          }
        }
        break;
      }
    } 
    for (let i = pos.y - 1; i >= MIN_ROW; --i) {  // up vertically
      nextPos = twoToOne(pos.x, i);
      if (board[nextPos] == '0')  ans.push(nextPos);
      else {
        for (let j = i - 1; j >= MIN_ROW; --j) {
          killPos = twoToOne(pos.x, j);
          if (board[killPos] != '0' && !this.isSameSide(board[killPos], board[position])) {
            ans.push(killPos);
            break;
          }
        }
        break;
      }
    }
    for (let i = pos.y + 1; i <= MAX_ROW; ++i) {  // down vertically
      nextPos = twoToOne(pos.x, i);
      if (board[nextPos] == '0')  ans.push(nextPos);
      else {
        for (let j = i + 1; j <= MAX_ROW; ++j) {
          killPos = twoToOne(pos.x, j);
          if (board[killPos] != '0' && !this.isSameSide(board[killPos], board[position])) {
            ans.push(killPos);
            break;
          }
        }
        break;
      }
    }
    return ans;
  }

  /**
   * Return the valid move positions for pawn in the board.
   * Pawn walks one step, could not walk back, no left or right move until cross river
   * @param {int} position current pawn position
   * @param {string} board current board
   * @param {string} tag current pawn chess symbol
   */
  pawnMove(position, board, tag) {
    let pos = oneToTwo(position), ans = [], side = this.getSide(tag);
    if (tag == 'p') { // red pawn
      if (inBoard(pos.x, pos.y-1) && !this.isSameSide(board[twoToOne(pos.x, pos.y-1)], board[position])) {
        ans.push(twoToOne(pos.x, pos.y-1));
      }
    } else {  // black pawn
      if (inBoard(pos.x, pos.y+1) && !this.isSameSide(board[twoToOne(pos.x, pos.y+1)], board[position])) {
        ans.push(twoToOne(pos.x, pos.y+1));
      }
    }
    if (!this.isSameHalf(side, pos.x, pos.y)) {  // cross river could move left or right
      if (inBoard(pos.x-1, pos.y) && !this.isSameSide(board[twoToOne(pos.x-1, pos.y)], board[position])) {
        ans.push(twoToOne(pos.x-1, pos.y));
      }
      if (inBoard(pos.x+1, pos.y) && !this.isSameSide(board[twoToOne(pos.x+1, pos.y)], board[position])) {
        ans.push(twoToOne(pos.x+1, pos.y));
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
    let ans = []
    switch(tag) {
      case 'r': case 'R': // rook
        ans = this.rookMove(position, board);
        break;
      case 'n': case 'N': // knight
        ans = this.knightMove(position, board);
        break;
      case 'b': case 'B': // bishop
        ans = this.bishopMove(position, board, tag);
        break;
      case 'a': case 'A': // advisor
        ans = this.advisorMove(position, board, tag);
        break;
      case 'k': case 'K': // king
        ans = this.kingMove(position, board, tag);
        break;
      case 'c': case 'C': // cannon
        ans = this.cannonMove(position, board);
        break;
      case 'p': case 'P': // pawn
        ans = this.pawnMove(position, board, tag);
        break;
    }
    return ans;
  }
}