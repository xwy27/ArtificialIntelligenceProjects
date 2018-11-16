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
  return x * 9 + y;
}

/**
 * Transform one dimension coordinate to two dimension
 * @param {int} pos position
 */
function oneToTwo(pos) {
  return {
    'x': pos / 9,
    'y': pos % 9
  }
}