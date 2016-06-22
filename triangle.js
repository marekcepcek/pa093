
/**
 *
 * @param {Point} a
 * @param {Point} b
 * @param {Point} c
 * @returns {Triangle}
 */
var Triangle = function (a, b, c) {
  this.a = a;
  this.b = b;
  this.c = c;
};

Triangle.prototype = {

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
    context.lineTo(this.c.x, this.c.y);
    context.closePath();
    context.stroke();
    context.restore();
  }
};
