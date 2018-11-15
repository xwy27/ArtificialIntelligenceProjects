class Chess {
  constructor(position) {
    let temp = oneToTwo(position, tag);
    this.pos = position;
    this.x = temp.x;
    this.y = temp.y;
    this.tag = tag;
  }

  getTag() {
    return this.tag;
  }
  
  getPos() {
    return {
      'pos': this.pos,
      'x': this.x,
      'y': this.y
    }
  }

  getSide() {
    return RED.indexOf[this.tag] == -1 ? 'black' : 'red';
  }

  move(x, y) {
    this.x = x;
    this.y = y;
    this.pos = twoToOne(x, y);
  }

  move(pos) {
    this.pos = pos;
    let temp = oneToTwo(pos);
    this.x = temp.x;
    this.y = temp.y;
  }
}