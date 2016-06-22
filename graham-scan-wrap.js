
/**
 *
 * @param {Array} inputPoints
 * @returns {GrahamScanWrap}
 */
var GrahamScanWrap = function (inputPoints) {

  inputPoints = inputPoints.slice();

  if (inputPoints.length > 3) {

    var initPoint = null;
    /* najprv najmensia y (prip x ak je rovnake y)*/
    for (var i = 0; i < inputPoints.length; i++) {
      if (initPoint === null || initPoint.y > inputPoints[i].y || (initPoint.y == inputPoints[i].y && initPoint.x > inputPoints[i].x)) {
        initPoint = inputPoints[i];
      }
    }

    inputPoints.splice(inputPoints.indexOf(initPoint), 1);

    /* vypocitame uhly */
    var inputPointAngles = [];
    for (var i = 0; i < inputPoints.length; i++) {
      inputPointAngles.push({
        angle: this.angle(new Point(0, 0), new Point(10, 0), initPoint, inputPoints[i]),
        point: inputPoints[i]
      });
    }

    /* zoradime podla uhlov */
    inputPointAngles.sort(function (a, b) {
      return a.angle - b.angle;
    });


    /* prevediem strukturu spet na body */
    inputPoints = inputPointAngles.map(function (item) {
      return item.point;
    });

    /* inicializace */
    this.points = [initPoint, inputPoints[0]];

    var i = 1;
    while (i < inputPoints.length) {

      var p1 = this.points[this.points.length - 2];
      var p2 = this.points[this.points.length - 1];
      var p3 = inputPoints[i];

      if ((new Vector(p1, p2)).crossProduct(new Vector(p1, p3)) > 0) {
        this.points.push(p3);
        i++;
      } else {
        this.points.pop();
      }

    }
  } else {
    this.points = inputPoints;
  }
};

GrahamScanWrap.prototype = {

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
