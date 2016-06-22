
/**
 *
 * @param {Point} a
 * @param {Point} b
 * @returns {Line}
 */
var Line = function (a, b) {
  this.a = a;
  this.b = b;
};

Line.prototype = {

   /**
   *
   * @param {CanvasRenderingContext2D} context
   * @returns {undefined}
   */
  draw: function (context) {
    context.save();
    context.beginPath();
    context.moveTo(this.a.x, this.a.y);
    context.lineTo(this.b.x, this.b.y);
    context.stroke();
    context.restore();
  },

  /**
   *
   * @param {Line} line
   * @returns {Boolean}
   */
  equals: function (line) {
    return this.a === line.a && this.b === line.b;
  },

  /**
   *
   * @param {Point} point
   * @returns {Boolean}
   */
  left: function (point) {
    return (new Vector(this.a, this.b)).crossProduct(new Vector(this.a, point)) < 0;
  },

  /**
   *
   * @returns {Line}
   */
  reverse: function () {
    return new Line(this.b, this.a);
  },

  /**
   * 
   * @returns {Point}
   */
  center: function () {
    return new Point((this.a.x + this.b.x) / 2, (this.a.y + this.b.y) / 2);
  },

  /**
   *
   * @param {Point} point
   * @returns {Number}
   */
  delaunayDistance: function (point) {
    var circle = Circle.createCircle(this.a, this.b, point);

    return circle.radius * (this.left(circle.center) ? 1 : -1);
  }
};
