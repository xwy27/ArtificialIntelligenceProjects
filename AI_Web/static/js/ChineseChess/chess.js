class Chess {
  constructor() {}


  getSide(tag) {
    return RED.indexOf[tag] == -1 ? 'black' : 'red';
  }

  chessMove(tag, position) {
    let ans = [], pos = OneToTwo(position);
    switch(tag) {
      case 'r', 'R':  // rook walks horizontally or vertically
        for (let i = pos.x+1; i < ROW_MAX; ++i) { ans.push(twoToOne(i,pos.y)); }
        for (let i = pos.y+1; i < COL_MAX; ++i) { ans.push(twoToOne(pos.x,i)); }
        break;
      case 'n', 'N': // knight walks like a Chinese word '日'
        let temp = [1, 2];
        for (let i = 0; i < 2; ++i) {
          for (let k = 0; k < 2; ++k) {
            for (let j = 0; j < 2; ++j) {
              let factorX = k % 2 == 0 ? 1 : -1; 
              let factorY = j % 2 == 0 ? 1 : -1;
              let nextX = pos.x + factorX * temp[i%2];
              let nextY = pos.y + factorY * temp[(i+1)%2];
              if (nextX < ROW_MAX && nextX > ROW_MIN &&
                nextY < COL_MAX && nextY > COL_MIN) {
                  ans.push(twoToOne(nextX, nextY));
              }
            }
          }
        }
        break;
      case 'b', 'B':  // bishop walks like a Chinese word '田'
        break;
      case 'a', 'A':  //
        break;
      case 'k', 'K':
        break;
      case 'c', 'C':
        break;
      case 'p', 'P':
        break;
    }
    return ans;
  }
}