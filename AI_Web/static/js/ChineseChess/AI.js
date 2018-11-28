class AI {
  constructor(name) {
    this.name = name;
    this.chessHelper = new Chess('AI_Chess_Helper');
  }

  /**
   * Return the estimation for the board(node)
   * @param {*} board the board to be estimated
   */
  calcBoardValue(board) {
    if (getBoardState(board) == RED_WIN)  return -Infinity;
    if (getBoardState(board) == BLACK_WIN)  return Infinity;

    let MAXScore = 0, MINScore = 0;
    for (let index = 0; index < board.length; ++index) {
      switch (board[index]) {
        case 'r': // MIN rook
          MINScore += ROOK_VALUE[index];
          break;
        case 'R': // MAX rook
          MAXScore += ROOK_VALUE[89-index];
          break;
        case 'n': // MIN knight
          MINScore += KNIGHT_VALUE[index];
          break;
        case 'N': // MAX knight
          MAXScore += KNIGHT_VALUE[89-index];
          break;
        case 'b': // MIN bishop
          MINScore += ADVISOR_BISHOP_VALUE[index];
          break;
        case 'B': // MAX bishop
          MAXScore += ADVISOR_BISHOP_VALUE[89-index];
          break;
        case 'a': // MIN advisor
          MINScore += ADVISOR_BISHOP_VALUE[index];
          break;
        case 'A': // MAX advisor
          MAXScore += ADVISOR_BISHOP_VALUE[89-index];
          break;
        case 'k': // MIN king
          MINScore += KING_PAWN_VALUE[index];
          break;
        case 'K': // MAX king
          MAXScore += KING_PAWN_VALUE[89-index];
          break;
        case 'c': // MIN cannon
          MINScore += CANNON_VALUE[index];
          break;
        case 'C': // MAX cannon
          MAXScore += CANNON_VALUE[89-index];
          break;
        case 'p': // MIN pawn
          MINScore += KING_PAWN_VALUE[index];
          break;
        case 'P': // MAX pawn
          MAXScore += KING_PAWN_VALUE[89-index];
          break;
      }
    }
    return MAXScore - MINScore;
  }

  /**
   * Create child nodes for the parent with valid chess moves
   * @param {Node} parent Parent node
   */
  createChildren(parent) {
    var child = [];
    let board = parent.getBoard();
    if (parent.getDepth() % 2) {  // MIN Turn
      for (let index = 0; index < board.length; ++index) {
        if (RED.indexOf(board[index]) != -1) {
          let moves = this.chessHelper.chessMove(board[index], index, board);
          $.each(moves, (i, v) => {
            let new_board = replaceCharAt(board, v, board[index]);
            new_board = replaceCharAt(new_board, index, '0');
            let temp = new Node(new_board);
            temp.setDepth(parent.getDepth()+1);
            child.push(temp);
          });
        }
      }
    } else {  // MAX Turn
      for (let index = 0; index < board.length; ++index) {
        if (BLACK.indexOf(board[index]) != -1) {
          let moves = this.chessHelper.chessMove(board[index], index, board);
          $.each(moves, (i, v) => {
            let new_board = replaceCharAt(board, v, board[index]);
            new_board = replaceCharAt(new_board, index, '0');
            let temp = new Node(new_board);
            temp.setDepth(parent.getDepth()+1);
            temp.setOrigin(index);
            temp.setNext(v);
            child.push(temp);
          });
        }
      }
    }
    parent.setChild(child);
    return child;
  }

  /**
   * MiniMax Search for AI to find a move from current situation
   * @param {string} board current board
   */
  MiniMaxSearch(board, k) {
    var next, origin;
    let StartNode = new Node(board);
    let Open = [StartNode], Closed = [];

    // Generate nodes within k depth
    while (Open.length != 0) {
      let node = Open.shift();  // Retrieve one node
      Closed.push(node);  // Search finish

      // if game finish at this node, no need to search
      if (node.getValue() == Infinity || node.getValue() == -Infinity) {
        continue;
      }

      // if k depth match, break
      if (node.getDepth() >= k) {
        break;
      }
      
      // find child nodes
      let child = this.createChildren(node);

      // Evaluate child nodes and
      // add to open to find grandchildren 
      $.each(child, (index, value) => {
        value.setValue(this.calcBoardValue(value.getBoard()));
        Open.push(value);
      });
    }

    // Update node estimation from bottom to top
    while (Closed.length != 0) {
      let node = Closed.pop();
      let children = node.getChild();
      if (children.length != 0) { // Have children
        var max_value = -Infinity;
        var min_value = Infinity;
        if (node.getDepth() % 2) {  // MIN Layer
          $.each(children, (index, value) => {
            min_value = min_value > value.getValue() ? value.getValue() : min_value;
          });
          node.setValue(min_value);
        } else {  // MAX Layer
          $.each(children, (index, value) => {
            if (max_value < value.getValue()) {
              max_value = value.getValue();
              if (node.depth == 0) {
                origin = value.getOrigin();
                next = value.getNext();
              }
            }            
          });
          node.setValue(max_value);
        }
      }
    }

    return  {
      'value': StartNode.getValue(),
      'origin': origin,
      'next': next
    }
  }

  /**
   * Alpha-Beta Search
   * @param {string} board current board 
   * @param {int} k depth
   */
  AlphaBetaSearch(board, depth, val) {
    if (depth == 0) {
      return {
        'value' : this.calcBoardValue(board),
        'moves': [[]]
      }
    }

    if (depth % 2 == 0) {  // MAX Layer
      var alpha = -Infinity, max_value = -Infinity, beta = val;
      var move = [[]], temp;
      let node = new Node(board);
      node.setDepth(depth);
      let child = this.createChildren(node);
      for (let i = 0; i < child.length; ++i) {
        temp = (new AI('temp')).AlphaBetaSearch(child[i].getBoard(), depth-1, alpha);
        if (temp.value > beta) {  // Bigger than previous min layer beta, no use to search
          return {
            'value': temp.value,
            'moves': [[]]
          }
        }
        if (temp.value > max_value) { // Within beta, find the max_value for node move.
          max_value = temp.value;
          alpha = max_value;
          move = [[child[i].getOrigin(), child[i].getNext()]];
        }
      }
      return {
        'value' : max_value,
        'moves': move.concat(temp.moves)
      }
    } else {  // MIN Layer
      var alpha = val, min_value = Infinity, beta = Infinity;
      var move = [[]];
      let node = new Node(board);
      node.setDepth(depth);
      let child = this.createChildren(node);
      for (let i = 0; i < child.length; ++i) {
        temp = (new AI('temp')).AlphaBetaSearch(child[i].getBoard(), depth-1, beta);
        if (temp.value < alpha) {  // Smaller than previous max layer beta, no use to search
          return {
            'value': temp.value,
            'moves': [[]]
          }
        }
        if (temp.value < min_value) { // Within alpha, find the min_value for node move.
          min_value = temp.value;
          beta = min_value;
          move = [[child[i].getOrigin(), child[i].getNext()]];
        }
      }
      return {
        'value' : min_value,
        'moves': move.concat(temp.moves)
      }
    }
  }
}

class Node {
  constructor(board) {
    this.board = board;
    this.value = 0;
    this.depth = 0;
    this.child = [];
    this.origin = 0;
    this.next = 0;
  }

  /**
   * Set the estimation value of the node(board)
   * @param {string} value estimation value
   */
  setValue(value) {
    this.value = value;
  }

  /**
   * Return the estimation value of the node(board)
   */
  getValue() {
    return this.value;
  }

  /**
   * Return the board of the node
   */
  getBoard() {
    return this.board;
  }

  /**
   * Set the depth of the node
   * @param {int} depth 
   */
  setDepth(depth) {
    this.depth = depth;
  }

  /**
   * Return the node's depth
   */
  getDepth() {
    return this.depth;
  }

  /**
   * Set children of node
   * @param {Array[Node]} child 
   */
  setChild(child) {
    this.child = child;
  }

  /**
   * Get the children nodes for Node
   */
  getChild() {
    return this.child;
  }

  /**
   * Set the moved chess origin position
   * @param {int} origin origin position
   */
  setOrigin(origin) {
    this.origin = origin;
  }
  
  /**
   * Get the moved chess origin position
   */
  getOrigin() {
    return this.origin;
  }
  
  /**
   * Set the moved chess target position
   * @param {int} next target position
   */
  setNext(next) {
    this.next = next;
  }

  /**
   * Get the moved chess target position
   */
  getNext() {
    return this.next;
  }
}