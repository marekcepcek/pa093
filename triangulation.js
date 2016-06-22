
/**
 *
 * @param {Array} inputPoints
 * @returns {Triangulation}
 */
var Triangulation = function (inputPoints) {
  this.points = inputPoints.slice();
  this.lines = [];

  if (this.points.length > 3) {

    inputPoints = this.points.slice();

    var i;
    var n = inputPoints.length;

    /* vytvorime obalku */
    var wrap = new GrahamScanWrap(inputPoints);

    /* zoradime body obalky lexikograficky */
    wrap.points.sort(function (p1, p2) {
      return p1.y === p2.y ? p2.x - p1.x : p1.y - p2.y;
    });

    /* index najvrchnejsiho bodu */
    var t = inputPoints.indexOf(wrap.points[0]);

    /* index najspodnejsiho bodu */
    var b = inputPoints.indexOf(wrap.points[wrap.points.length - 1]);

    /* prava cesta*/
    var rightPath = [inputPoints[t]];
    i = t;
    do {
      i = (i + 1).mod(n);
      rightPath.push(inputPoints[i]);
    } while (i !== b);

    /* lava cesta */
    var leftPath = [inputPoints[t]];
    i = t;
    do {
      i = (i - 1).mod(n);
      leftPath.push(inputPoints[i]);
    } while (i !== b);

    /* ak treba vymenime cesty */
    if ((new Vector(rightPath[0], rightPath[1])).crossProduct(new Vector(leftPath[0], leftPath[1])) < 0) {
      leftPath = [rightPath, rightPath = leftPath][0];
    }

    /* zoradime vsetky body lexikograficky */
    inputPoints.sort(function (p1, p2) {
      return p1.y === p2.y ? p2.x - p1.x : p1.y - p2.y;
    });

    var stack = [inputPoints[0], inputPoints[1]];

    for (var i = 2; i < n; i++) {
      var vI = inputPoints[i];
      var vTop = stack.pop();

      if (leftPath.indexOf(vTop) >= 0 && leftPath.indexOf(vI) >= 0) {
        var vLast = vTop;
        while ((new Vector(vI, vLast)).crossProduct(new Vector(vI, stack[stack.length - 1])) > 0) { // oba na lavej ceste
          vLast = stack[stack.length - 1];
          this.lines.push(new Line(vI, vLast));
        }
        stack.push(vLast);
        stack.push(vI);
      } else if (rightPath.indexOf(vTop) >= 0 && rightPath.indexOf(vI) >= 0) { // oba na pravej ceste
        var vLast = vTop;
        while ((new Vector(vI, vLast)).crossProduct(new Vector(vI, stack[stack.length - 1])) < 0) {
          vLast = stack[stack.length - 1];
          this.lines.push(new Line(vI, vLast));
        }
        stack.push(vLast);
        stack.push(vI);
      } else { // na inej ceste
        stack.shift(); // posledny zahodim
        var vJ = vTop;
        while (vJ) {
          this.lines.push(new Line(vI, vJ));
          vJ = stack.pop();
        }
        stack = [vTop, vI];
      }
    }
  }
};

Triangulation.prototype = {

   /**
   *
   * @param {CanvasRenderingContext2D} context
   * @returns {undefined}
   */
  draw: function (context) {

    /* vykresli triangulaci */
    if (this.lines.length > 0) {
      for (var i = 0; i < this.lines.length; i++) {
        this.lines[i].draw(context);
      }
    }

    /* vykresli vonkajsie hrany */
    if (this.points.length > 1) {
      context.save();
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(this.points[0].x, this.points[0].y);
      for (var i = 1; i < this.points.length; i++) {
        context.lineTo(this.points[i].x, this.points[i].y);
      }
      context.closePath();
      context.stroke();
      context.restore();
    }
  }
};

/**
 *
 * @param {Number} n
 * @returns {Number}
 */
Number.prototype.mod = function (n) {
  return this.valueOf() >= 0 ? this.valueOf() % n : n + this.valueOf() % n;
};