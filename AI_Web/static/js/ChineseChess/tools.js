/**
 * Swap two objects
 * @param {object} x 
 * @param {object} y 
 */
function swap(x, y) {
  temp = x;
  x = y;
  y = temp;
}

/**
 * Transform two dimension coordinate to one dimension
 * @param {int} x x cordinate
 * @param {int} y y cordinate
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