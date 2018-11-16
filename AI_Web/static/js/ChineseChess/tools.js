/**
 * Replace character str[pos] with c
 * @param {string} str origin string
 * @param {int} pos target position
 * @param {string} c target character
 */
String.prototype.replaceCharAt = function (n, c) {
  return this.substr(0, n) + c + this.substr(n + 1, this.length - 1 - n);
}

/**
 * Transform two dimension coordinate to one dimension
 * @param {int} x x coordinate
 * @param {int} y y coordinate
 */
function twoToOne(x, y) {
  return y * 9 + x;
}

/**
 * Transform one dimension coordinate to two dimension
 * @param {int} pos position
 */
function oneToTwo(pos) {
  return {
    'y': Math.floor(pos / 9),
    'x': pos % 9
  }
}

/**
 * Return if the (posX, posY) inside the board
 * @param {int} posX 
 * @param {int} posY 
 */
function inBoard(posX, posY) {
  return posX >= MIN_COL && posX <= MAX_COL &&
    posY >= MIN_ROW && posY <= MAX_ROW;
}