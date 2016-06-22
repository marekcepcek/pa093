$(function () {
  Drawing.init();
});

var Drawing = {
  canvas: null,
  context: null,
  mode: null,
  points: [],
  object: null,
  selectedPoint: null,
  R: 5,
  modes: {
    none: null,
    pointsAdd: 'PA',
    pointMove: 'PM'
  },

  /**
   *
   * @returns {undefined}
   */
  resizeCanvas: function () {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.render();
  },

  /**
   *
   * @returns {undefined}
   */
  createObject: function () {
    switch ($('.select-object-button.selected').attr('data-object-type')) {
      case 'gift-wrap' :
        this.object = new GiftWrap(this.points);
        break;
      case 'graham-scan-wrap' :
        this.object = new GrahamScanWrap(this.points);
        break;
      case 'triangulation' :
        this.object = new Triangulation(this.points);
        break;
      case 'kd-tree' :
        this.object = new KDTree(this.points);
        break;
      case 'delaunay-triangulation' :
        this.object = new DelaunayTriangulation(this.points);
        break;
      case 'voronoi-diagram' :
        this.object = new VoronoiDiagram(this.points, this.canvas.width, this.canvas.height);
        break;
    }
  },

  /**
   *
   * @param {Point} point
   * @returns {undefined}
   */
  selectPoint: function (point) {
    if (this.selectedPoint !== null) {
      this.unselectPoint(this.selectedPoint);
    }
    this.selectedPoint = point;
    this.selectedPoint.selected = true;
    $('#poins-remove').addClass('active');
    this.render();
  },

  /**
   *
   * @returns {undefined}
   */
  unselectPoint: function () {
    if (this.selectedPoint !== null) {
      this.selectedPoint.selected = false;
      this.selectedPoint = null;
      $('#poins-remove').removeClass('active');
      this.render();
    }
  },

  /**
   *
   * @param {String} mode
   * @returns {undefined}
   */
  setMode: function (mode) {
    for (var key in this.modes) {
      if (this.modes[key] === mode) {
        this.mode = mode;
        return;
      }
    }
    throw 'Invalid mode';
  },

  /**
   *
   * @returns {undefined}
   */
  render: function () {

    /* vycistenie platna */
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    /* vykreslenie objektu */
    if (this.object !== null) {
      this.object.draw(this.context, this.canvas.width, this.canvas.height);
    }

    /* vykreslenie bodov */
    for (var i = 0; i < this.points.length; i++) {
      this.points[i].draw(this.context);
    }
  },

  /**
   *
   * @param {type} event
   * @returns {undefined}
   */
  move: function (event) {
    var position = this.getPosition(event);
    switch (Drawing.mode) {
      case Drawing.modes.pointMove :
        if (this.selectedPoint) {
          this.selectedPoint.x = position.x;
          this.selectedPoint.y = position.y;
          this.createObject();
        }
        break;
    }
    this.render();
  },

  /**
   *
   * @param {Point} position
   * @returns {Point|null}
   */
  getPointOnPosition: function (position) {
    for (var i = 0; i < this.points.length; i++) {
      if (this.points[i].distance(position) < this.R) {
        return this.points[i];
      }
    }
    return null;
  },

  /**
   *
   * @param {Point} point
   * @returns {undefined}
   */
  addPoint: function (point) {
    this.points.push(point);
    this.createObject();
  },

  /**
   *
   * @returns {undefined}
   */
  clear: function () {
    this.mode = null;
    this.points = [];
    this.object = null;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },

  /**
   *
   * @param {type} event
   * @returns {Point}
   */
  getPosition: function (event) {
    return new Point(event.pageX - $(this.canvas).offset().left, event.pageY - $(this.canvas).offset().top);
  },

  /**
   *
   * @returns {undefined}
   */
  generatePoints: function () {
    for (var i = Math.floor(Math.random() * 30); i > 0; i--) {
      this.points.push(new Point(Math.floor(Math.random() * this.canvas.width), Math.floor(Math.random() * this.canvas.height)));
    }
    this.createObject();
  },

  /**
   *
   * @returns {undefined}
   */
  init: function () {
    this.canvas = document.getElementById('canvas');
    this.context = this.canvas.getContext('2d');

    $(this.canvas).click(function (event) {
      var position = Drawing.getPosition(event);
      switch (Drawing.mode) {
        case Drawing.modes.pointsAdd :
          Drawing.addPoint(position);
          Drawing.render();
          break;
      }
    }).mousemove(function (event) {
      Drawing.move(event);
    }).mousedown(function (event) {
      switch (Drawing.mode) {
        case Drawing.modes.none :
          var point = Drawing.getPointOnPosition(Drawing.getPosition(event));
          if (point !== null) {
            Drawing.selectPoint(point);
          } else {
            Drawing.unselectPoint();
          }
          Drawing.setMode(Drawing.modes.pointMove);
          Drawing.render();
          break;
      }
    }).mouseup(function (event) {
      switch (Drawing.mode) {
        case Drawing.modes.pointMove :
          Drawing.setMode(Drawing.modes.none);
          break;
      }
    });

    $('#poins-add').click(function () {
      $('.tool-button.selected').removeClass('selected');
      $(this).addClass('selected');
      Drawing.setMode(Drawing.modes.pointsAdd);
    });

    $('#poins-remove').click(function () {
      if (Drawing.selectedPoint !== null) {
        var index = Drawing.points.indexOf(Drawing.selectedPoint);
        if (index > -1) {
          Drawing.points.splice(index, 1);
          Drawing.unselectPoint();
          Drawing.createObject();
          Drawing.render();
        }
      }
    });

    $('#stop').click(function () {
      $('.tool-button.selected').removeClass('selected');
      $(this).addClass('selected');
      Drawing.setMode(Drawing.modes.none);
    });

    $('#generate').click(function () {
      Drawing.clear();
      Drawing.generatePoints();
      Drawing.render();
    });

    $('#clear').click(function () {
      $('.tool-button.selected, .tool-button.active').removeClass('selected active');
      Drawing.clear();
    });

    $('.select-object-button').click(function (event) {
      $('.select-object-button.selected').removeClass('selected');
      $(this).addClass('selected');
      Drawing.createObject();
      Drawing.render();
    });

    $(window).resize(function () {
      Drawing.resizeCanvas();
    });

    this.resizeCanvas();
  }
};