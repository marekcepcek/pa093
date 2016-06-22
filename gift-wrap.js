
/**
 *
 * @param {Array} inputPoints
 * @returns {GiftWrap}
 */
var GiftWrap = function (inputPoints) {

  inputPoints = inputPoints.slice();

  if (inputPoints.length > 3) {

    var initPoint = null;
    for (var i = 0; i < inputPoints.length; i++) {
      if (initPoint === null || initPoint.x < inputPoints[i].x) {
        initPoint = inputPoints[i];
      }
    }

    this.points = [initPoint];

    var nextPoint = null;
    var actPoint = initPoint;
    var prevPoint = new Point(initPoint.x, initPoint.y - 10);

    do {
      for (var i = 0; i < inputPoints.length; i++) {
        if (inputPoints[i] === actPoint) {
          continue;
        }
        if (nextPoint === null || this.angle(prevPoint, actPoint, actPoint, inputPoints[i]) < this.angle(prevPoint, actPoint, actPoint, nextPoint)) {
          nextPoint = inputPoints[i];
        }
      }
      if (nextPoint === initPoint) {
        break;
      }
      this.points.push(nextPoint);
      inputPoints.splice(inputPoints.indexOf(nextPoint), 1);
      prevPoint = actPoint;
      actPoint = nextPoint;
      nextPoint = null;
    } while (actPoint !== initPoint);
  } else {
    this.points = inputPoints;
  }
};

GiftWrap.prototype = {

  /**
   *
   * @param {CanvasRenderingContext2D} context
   * @returns {undefined}
   */
  draw: function (context) {
    if (this.points.length > 1) {
      context.save();
      context.beginPath();
      context.moveTo(this.points[0].x, this.points[0].y);
      for (var i = 1; i < this.points.length; i++) {
        context.lineTo(this.points[i].x, this.points[i].y);
      }
      context.closePath();
      context.stroke();
      context.restore();
    }
  },

  /**
   *
   * @param {Point} p1
   * @param {Point} p2
   * @param {Point} p3
   * @param {Point} p4
   * @returns {Number}
   */
  angle: function (p1, p2, p3, p4) {
    var v1 = new Vector(p1, p2);
    var v2 = new Vector(p3, p4);

    return v1.angle(v2);
  }
};
