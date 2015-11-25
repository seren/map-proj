var Node = function(args) {
  var self = this;
  this.id = (args.id === undefined) ? '0' : args.id;
  var n = this.id.split(',').reduce(
      function(prev,curr){ return prev + parseFloat(curr); },0); // add the lat and lon values and covert to int for a quasi-uid
  this.numericId = parseInt( n * Math.pow(10, illumap.utility.floatPrecision(n)) );
  this.features = (args.features === undefined) ? [] : args.features;
  this.endpoint = (args.endpoint === undefined) ? false : args.endpoint;
  this.intersection = (args.intersection === undefined) ? false : args.intersection;
  this.ways = (args.ways === undefined) ? [] : args.ways; // array of way objects
  this._edges = (args.edges === undefined) ? [] : args.edges;
  this._coordinates = (args.coordinates === undefined) ? [] : args.coordinates;
  this.graph = args.graph;
  this.rdpMetric = undefined;

  if (this.graph === undefined) debugger;

  this.getEdges = function getEdges() {
    return self._edges;
  }
  this.addEdge = function addEdge(e) {
    self._edges.push(e);
    return self._edges;
  }

  this.neighbors = function neighbors() {
    function isntMe (otherNode) {
      return (self !== otherNode);
    }
    return self._edges.map( function (e) {
      var nodes = e.getNodes().filter(isntMe);
      // Sanity check. Each edge should only have 2 nodes, so length should be 1 after filtering away one.
      if (nodes.length !== 1) { debugger; }
      return nodes[0];
    });
  };

  // i don't think nodes should track ways. they can derive them from their edges if necessary
  // OTH, we need to track ways so that when we're deleted, we can remove ourselves from the correct ways. sigh
  // to deprecate
  this.addWay = function addWay(way) {
    if (self.ways.indexOf(way) !== -1) debugger; // sanity check for to catch re-adding a way
    self.ways.push(way);
    return self;
  };

  this.deleteWay = function deleteWay(way) {
    if (self.ways.indexOf(way) === -1) debugger; // sanity check for to catch removing a non-member way
    self.ways.delete(way);
    return self;
  };

  // remove node from edges and graph. ways don't track nodes, so don't need to deal with them
  this.destroy = function destroy() {
    // delete edges that the node is a member of (edges have to have 2 points)
    self._edges.forEach( function (e) { e.destroy(); }); // we may be messing up our forEach if the e.delete alters the edges array while we're using it. may need a while loop.
    // delete this node from the master list
    delete self.graph.xNodes[self];
    return true;
  };

  this.getCoordinates = function getCoordinates() {
    return self._coordinates.slice();
  };

  this.setCoordinates = function setCoordinates(newCoords) {
    self._coordinates = newCoords.slice();
    return self;
  };

// Node.prototype.neighbors = function() {
//   function isntMe (otherNode) {
//     return (self !== otherNode);
//   }
// // context problems. this is referring to the global object again.
// debugger
//   return self.edges.map( function (e) {
//     var a = e.nodes.filter(isntMe)[0];
//     // Sanity check. Each edge should only have 2 nodes, so length should be 1 after filtering away one.
//     if (a.length !== 1) { debugger; }
//     return a;
//   });
// };

  this.isNeighbor = function isNeighbor(n) {
    if (self.neighbors.indexOf(n) === -1) {
      return false;
    } else {
      return true;
    }
  };

  this.getEdgeWithNode = function getEdgeWithNode(otherNode) {
    function union(arr1, arr2) {
      return arr1.filter(function(n) {
          return (arr2.indexOf(n) != -1);
      });
    }
    // Find the edge that's common to both nodes
    var edge = union(self._edges, otherNode.getEdges());
    // Sanity check
    if (edge.length > 1) debugger;
    return edge[0];
  };


  this.rediscoverWaysFromEdges = function rediscoverWaysFromEdges() {
    self.ways.length = 0;
    self._edges.forEach( function(e) {
      self.addWay(e.way);
    });
  };

};
