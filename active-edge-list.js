
/**
 *
 * @returns {ActiveEdgeList}
 */
var ActiveEdgeList = function () {
  this.activeEdges = [];
};

ActiveEdgeList.prototype = {

  /**
   *
   * @param {ActiveEdge} activeEdge
   * @returns {AciveEdgeList}
   */
  add : function (activeEdge) {
    if (!this.contains.activeEdge) {

      var index;
      if ((index = this.indexOf(new ActiveEdge(activeEdge.edge.reverse()))) >= 0) { // obsahuje opacnu hranu
          this.activeEdges[index].twin = activeEdge;
          activeEdge.twin = this.activeEdges[index];
      }

      this.activeEdges.push(activeEdge);
    }

    return this;
  },

  /**
   *
   * @param {ActiveEdge} activeEdge
   * @returns {Number}
   */
  indexOf: function (activeEdge) {
    for (var i = 0; i < this.activeEdges.length; i++) {
      if (this.activeEdges[i].equals(activeEdge)) {
        return i;
      }
    }
    return -1;
  },

  /**
   *
   * @param {ActiveEdge} activeEdge
   * @returns {Boolean}
   */
  contains: function (activeEdge) {
    return this.indexOf(activeEdge) >= 0;
  },

  eachActiveEdge: function (callback) {
    this.activeEdges.forEach(callback);
  }
};

/**
 * 
 * @param {Line} edge
 * @returns {ActiveEdge}
 */
var ActiveEdge = function (edge, next, area) {
  this.edge = edge;
  this.next = next;
  this.twin = null;
  this.area = area;
};

ActiveEdge.prototype = {

  /**
   *
   * @param {ActiveEdge} activeEdge
   * @returns {Boolean}
   */
  equals : function (activeEdge) {
    return this.edge.equals(activeEdge.edge);
  }
};