
/**
 *
 * @param {Array} inputPoints
 * @returns {VoronoiDiagram}
 */
var VoronoiDiagram = function (inputPoints, width, height) {

  this.dT = new DelaunayTriangulation(inputPoints);
  var ael = new ActiveEdgeList();

  /* analyza trojuholnikov riangulacie */
  this.dT.triangles.forEach(function (triangle) {
    var area = {
      center: Circle.createCircle(triangle.a, triangle.b, triangle.c).center,
      processed: false
    };

    var e = new ActiveEdge(new Line(triangle.a, triangle.b), null, area);
    var e2 = new ActiveEdge(new Line(triangle.b, triangle.c), null, area);
    var e3 = new ActiveEdge(new Line(triangle.c, triangle.a), e, area);

    e.next = e2;
    e2.next = e3;

    ael.add(e).add(e2).add(e3);
  });

  /* vytvorenie diagramu */
  var lines = [];
  ael.eachActiveEdge(function (activeEdge) {
    if (!activeEdge.area.processed) { // aktualny trojuholnik este nebol spracovany
      for (var i = 0; i < 3; i++) { // vsetky 3 hrany trojuhilnika
        if (activeEdge.twin) { // ma dvojce - pridame usecku spojujucu stredy oblasti
          lines.push(new Line(activeEdge.area.center, activeEdge.twin.area.center));
        } else { // jedna sa o hranu na okraji
          var p1 = activeEdge.area.center;
          var p2 = activeEdge.edge.center();

          var a = -(p2.y - p1.y);
          var b = p2.x - p1.x;
          var c = -1 * (a * p1.x + b * p1.y);

          var getPoint = function (x) { // pomocna funkcia kotora vrati bod na hranici platna
            var y = (-a * x - c) / b;

            if (y < 0) {
              y = 0;
            } else if (y > height) {
              y = height;
            }

            x = (-b * y - c) / a;

            return new Point(x, y);
          };

          var p = getPoint(0);
          if (!activeEdge.edge.left(p)) { // je na spravnej strane
            lines.push(new Line(activeEdge.area.center, p));
          } else {
            p = getPoint(width); // bod na druhej strane plochy
            if (!activeEdge.edge.left(p)) { // ked neni na spravnej strane sme mimo plochy
              lines.push(new Line(activeEdge.area.center, p));
            }
          }
        }

        activeEdge = activeEdge.next;
      }
      activeEdge.area.processed = true;
    }
  });

  this.lines = lines;

};

VoronoiDiagram.prototype = {

   /**
   *
   * @param {CanvasRenderingContext2D} context
   * @returns {undefined}
   */
  draw: function (context) {
    context.save();
    context.strokeStyle = "#CCCCCC";
    this.dT.draw(context);
    context.strokeStyle = "#FF0000";
    for (var i = 0; i < this.lines.length; i++) {
      this.lines[i].draw(context);
    }
    context.restore();
  }
};