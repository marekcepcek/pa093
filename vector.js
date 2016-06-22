
/**
 *
 * @param {Point} p1
 * @param {Point} p2
 * @returns {Vector}
 */
var Vector = function (p1, p2) {
  this.x = p2.x - p1.x;
  this.y = p2.y - p1.y;
};

Vector.prototype = {

  /**
   *
   * @param {Vector} vector
   * @returns {PNumber}
   */
  dotProduct: function (vector) {
    return this.x * vector.x + this.y * vector.y;
  },

  /**
   *
   * @param {Vector} vector
   * @returns {Number}
   */
  crossProduct: function (vector) {
    return this.x * vector.y - this.y * vector.x;
  },

  /**
   *
   * @returns {Number}
   */
  size: function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  },

  /**
   *
   * @param {Vector} vector
   * @returns {Number}
   */
  angle: function (vector) {
    return Math.acos(this.dotProduct(vector) / (vector.size() * this.size()));
  }
};
