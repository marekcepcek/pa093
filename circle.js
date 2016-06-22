
/**
 *
 * @param {Point} center
 * @param {Number} radius
 * @returns {Circle}
 */
var Circle = function (center, radius) {
  this.center = center;
  this.radius = radius;
};

Circle.prototype = {

  /**
   *
   * @param {Point} point
   * @returns {Boolean}
   */
  inside: function (point) {
    return this.center.distanceSq(point) < this.radius * this.radius;
  }
};

/**
 *
 * @param {Point} p1
 * @param {Point} p2
 * @param {Point} p3
 * @returns {Circle|null}
 */
Circle.createCircle = function (p1, p2, p3) {
  var cp = Point.crossProduct(p1, p2, p3);

  /* body nelezia na jednej priamke */
  if (cp !== 0) {
    var p1Sq = p1.x * p1.x + p1.y * p1.y;
    var p2Sq = p2.x * p2.x + p2.y * p2.y;
    var p3Sq = p3.x * p3.x + p3.y * p3.y;

    var cx = (p1Sq * (p2.y - p3.y) + p2Sq * (p3.y - p1.y) + p3Sq * (p1.y - p2.y)) / (2.0 * cp);
    var cy = (p1Sq * (p3.x - p2.x) + p2Sq * (p1.x - p3.x) + p3Sq * (p2.x - p1.x)) / (2.0 * cp);

    var center = new Point(cx, cy);

    return new Circle(center, center.distance(p1));
  }

  return null;
};
