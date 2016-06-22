
/**
 *
 * @param {Array} inputPoints
 * @returns {DelaunayTriangulation}
 */
var DelaunayTriangulation = function (inputPoints) {
  var points = inputPoints.slice();
  this.triangles = [];

  if (points.length > 2) {

    var el = new EdgeQueue();

    /* lubovolny bod */
    var p1 = points[0];

    /* najblizsi bod k p1 */
    var p2 = null;
    for (var i = 1; i < points.length; i++) {
      if (p2 === null || p1.distanceSq(points[i]) < p1.distanceSq(p2)) {
        p2 = points[i];
      }
    }

    /* vytvorime prvu hranu */
    var e = new Line(p1, p2);

    /* bod s najmensou delaunay vzialenostou v levo */
    var p = this.nearestPoint(e, points);

    if (p === null) { // nema bod vlavo - jedna sa o okraj
      e = e.reverse(); // otocime hranu
      p = this.nearestPoint(e, points); // najdeme bod
    }

    var e2 = new Line(e.b, p);
    var e3 = new Line(p, e.a);
    el.add(e);
    el.add(e2);
    el.add(e3);
    this.triangles.push(new Triangle(e.a, e.b, p));

    while (e = el.shift()) {
      e = e.reverse();  // prva hrana - s opacnou orientaci
      p = this.nearestPoint(e, points); // najblizsi bod v levo (ak existuje)

      if (p !== null) {
        e2 = new Line(e.b, p);
        e3 = new Line(p, e.a);

        el.add(e2);
        el.add(e3);
        this.triangles.push(new Triangle(e.a, e.b, p));
      }
    }
  }
};

DelaunayTriangulation.prototype = {

  /**
   *
   * @param {Line} e
   * @param {Array} points
   * @returns {Point|null}
   */
  nearestPoint: function (e, points) {

    var p = null;
    for (var i = 0; i < points.length; i++) {
      if (!e.left(points[i])) { // neni vlavo
        continue;
      }

      if (p === null || e.delaunayDistance(points[i]) < e.delaunayDistance(p)) {
        p = points[i];
      }
    }

    return p;
  },

   /**
   *
   * @param {CanvasRenderingContext2D} context
   * @returns {undefined}
   */
  draw: function (context) {
    for (var i = 0; i < this.triangles.length; i++) {
      this.triangles[i].draw(context);
    }
  }
};

/**
 *
 * @returns {EdgeQueue}
 */
var EdgeQueue = function () {
  this.edges = [];
};

EdgeQueue.prototype = {

  /**
   *
   * @param {Line} edge
   * @returns {Number}
   */
  indexOf: function (edge) {
    for (var i = 0; i < this.edges.length; i++) {
      if (this.edges[i].equals(edge)) {
        return i;
      }
    }

    return -1;
  },

  /**
   *
   * @param {Line} edge
   * @returns {undefined}
   */
  add: function (edge) {
    var reverseEdge = edge.reverse();
    var index;

    if ((index = this.indexOf(reverseEdge)) !== -1) {
      this.edges.splice(index, 1);
    } else if (this.indexOf(edge) === -1) {
      this.edges.push(edge);
    }
  },

  /**
   *
   * @returns {Line|null}
   */
  shift: function () {
    return this.edges.shift();
  }
};