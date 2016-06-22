
/**
 *
 * @param {Array} inputPoints
 * @returns {KDTree}
 */
var KDTree = function (inputPoints) {
  this.root = null;
  if (inputPoints.length > 0) {
    this.root = this.build(inputPoints.slice(), 0, null);
  }
};

KDTree.prototype = {

   /**
   *
   * @param {CanvasRenderingContext2D} context
   * @param Number width
   * @param Number height
   * @returns {undefined}
   */
  draw: function (context, width, height) {
    if (this.root !== null) {
      this.root.draw(context, 0, 0, width, height);
    }
  },

  /**
   *
   * @param {Array} points
   * @param {Number} depth
   * @param {KDNode|null} parent
   * @returns {KDNode}
   */
  build: function (points, depth, parent) {
    if (points.length === 0) {
      return null;
    }

    if (points.length === 1) { // jeden uzol
      return new KDNode(points[0], depth, parent);
    }

    if (depth % 2 === 0) { // parna hlbka
      points.sort(function (p1, p2) {
        return p1.x - p2.x;
      });
    } else { // neparna hlbka
      points.sort(function (p1, p2) {
        return p1.y - p2.y;
      });
    }

    var middleIndex = Math.floor(points.length / 2);
    var node = new KDNode(points[middleIndex], depth, parent);
    node.lesser = this.build(points.slice(0, middleIndex), depth + 1, node);
    node.greater = this.build(points.slice(middleIndex + 1), depth + 1, node);

    return node;
  }
};

/**
 *
 * @param {Point} point
 * @param {Number} depth
 * @param {KDNode|null} parent
 * @returns {KDNode}
 */
var KDNode = function (point, depth, parent) {
  this.depth = depth;
  this.point = point;
  this.parent = parent;
  this.lesser = null;
  this.greater = null;
};

KDNode.prototype = {

   /**
    *
    * @param {CanvasRenderingContext2D} context
    * @param {Number} left
    * @param {Number} top
    * @param {Number} right
    * @param {Number} bottom
    * @returns {undefined}
    */
  draw: function (context, left, top, right, bottom) {
    var from = new Point();
    var to = new Point();
    if (this.depth % 2 === 0) { // deli zvisle
      from.x = to.x = this.point.x;
      if (this.parent === null) { // specialny pripad - koren
        from.y = top;
        to.y = bottom;
      } else if (this.point.y < this.parent.point.y) {
        from.y = top;
        to.y = this.parent.point.y;
      } else {
        from.y = this.parent.point.y;
        to.y = bottom;
      }

      /* vykresli podstrom vlavo */
      if (this.lesser !== null) {
        this.lesser.draw(context, left, top, this.point.x, bottom);
      }

      /* vykresli podstom vpravo */
      if (this.greater !== null) {
        this.greater.draw(context, this.point.x, top, right, bottom);
      }
    } else { // deli vodorovne
      from.y = to.y = this.point.y;
      if (this.point.x < this.parent.point.x) {
        from.x = left;
        to.x = this.parent.point.x;
      } else {
        from.x = this.parent.point.x;
        to.x = right;
      }

      /* vykresli podstrom nad */
      if (this.lesser !== null) {
        this.lesser.draw(context, left, top, right, this.point.y);
      }

      /* vykresli podstrom pod */
      if (this.greater !== null) {
        this.greater.draw(context, left, this.point.y, right, bottom);
      }
    }

    context.save();
    context.lineWidth = 1;
    context.strokeStyle = this.depth % 2 === 0 ? '#00FF00' : '#0000FF';
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.closePath();
    context.stroke();
    context.restore();

  }
};