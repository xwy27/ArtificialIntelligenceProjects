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
    let MAXScore = 0, MINScore = 0;
    $.each(board, (index, value) => {
      switch (value) {
        case 'r': // MIN rook
          MINScore += ROOK_VALUE[index];
          break;
        case 'R': // MAX rook
          MAXScore += ROOK_VALUE[index];
          break;
        case 'n': // MIN knight
          MINScore += KNIGHT_VALUE[index];
          break;
        case 'N': // MAX knight
          MAXScore += KNIGHT_VALUE[index];
          break;
        case 'b': // MIN bishop
          MINScore += ADVISOR_BISHOP_VALUE[index];
          break;
        case 'B': // MAX bishop
          MAXScore += ADVISOR_BISHOP_VALUE[index];
          break;
        case 'a': // MIN advisor
          MINScore += ADVISOR_BISHOP_VALUE[index];
          break;
        case 'A': // MAX advisor
          MAXScore += ADVISOR_BISHOP_VALUE[index];
          break;
        case 'k': // MIN king
          MINScore += KING_PAWN_VALUE[index];
          break;
        case 'K': // MAX king
          MAXScore += KING_PAWN_VALUE[index];
          break;
        case 'c': // MIN cannon
          MINScore += CANNON_VALUE[index];
          break;
        case 'C': // MAX cannon
          MAXScore += CANNON_VALUE[index];
          break;
        case 'p': // MIN pawn
          MINScore += KING_PAWN_VALUE[index];
          break;
        case 'P': // MAX pawn
          MAXScore += KING_PAWN_VALUE[index];
          break;
      }
    });
    return MAXScore - MINScore;
  }

  /**
   * Create child nodes for the parent with valid chess moves
   * @param {Node} parent Parent node
   */
  createChildren(parent) {
    let child = [];
    let board = parent.getBoard();
    if (parent.getDepth() % 2) {  // MIN Turn
      for (let index = 0; index < board.length; ++index) {
        if (board[index] in RED) {
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
        if (board[index] in BLACK) {
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

    return child;
  }

  /**
   * MiniMax Search for AI to find a move from current situation
   * @param {string} board current board
   */
  MiniMaxSearch(board, k) {
    var next, origin;
    let StartNode = new Node(board);
    let Tree = [], Open = [StartNode], Closed = [];

    while (Open.length != 0) {
      let node = Open.shift();  // Retrieve one node
      Closed.push(node);  // Search finish

      // if game finish at this node, no need to search
      if (getBoardState(node.getBoard()) == RED_WIN) {
        node.setValue(-Infinity);
        continue;
      } else if (getBoardState(node.getBoard()) == BLACK_WIN) {
        node.setValue(Infinity);
        continue;
      }

      // find child nodes
      let child = this.createChildren(node);
      console.log(child);

      // add child nodes to tree
      $.each(child, (index, value) => {
        Tree.push(value);
      });

      // if k depth match, break
      if (child[0].getDepth() >= k) {
        break;
      }

      // depth not match, evaluate child nodes and
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
      let max_value = -Infinity;
      let min_value = Infinity;
      if (node.getDepth() % 2) {  // MIN Turn
        $.each(children, (index, value) => {
          min_value = min_value > value.getValue() ? value.getValue() : min_value;
        });
        node.setValue(min_value);
      } else {  // MAX Turn
        $.each(children, (index, value) => {
          if (max_value < value.getValue()) {
            max_value = value.getValue();
            if (node.getDepth() == 0) { // get the move
              next = node.getNext();
              origin = node.getOrigin();
            }
          }
        });
        node.setValue(max_value);
      }
    }

    return  {
      'value': StartNode.getValue(),
      'origin': origin,
      'next': next
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
   * Push a node into children
   * @param {Node} node 
   */
  pushChild(node) {
    this.child.push(node);
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