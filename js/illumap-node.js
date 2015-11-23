var Node = function(args) {
  this.id = (args.id === undefined) ? '0' : args.id;
  var n = this.id.split(',').reduce(
      function(prev,curr){ return prev + parseFloat(curr); },0); // add the lat and lon values and covert to int for a quasi-uid
  this.numericId = parseInt( n * Math.pow(10, illumap.utility.floatPrecision(n)) );
  this.features = (args.features === undefined) ? [] : args.features;
  this.endpoint = (args.endpoint === undefined) ? false : args.endpoint;
  this.intersection = (args.intersection === undefined) ? false : args.intersection;
  // this.wayEnd = (args.wayEnd === undefined) ? false : args.wayEnd;
  // this.wayIds = (args.wayIds === undefined) ? [] : args.wayIds;  // deprecate
  this.ways = (args.ways === undefined) ? [] : args.ways; // array of way objects
  this.edges = (args.edges === undefined) ? [] : args.edges;
  this._coordinates = (args.coordinates === undefined) ? [] : args.coordinates;
  this.coordinates = (args.coordinates === undefined) ? [] : args.coordinates;
  this.graph = args.graph;
  this.rdpMetric = undefined;
  return this;
};

// i don't think nodes should track ways. they can derive them from their edges if necessary
// OTH, we need to track ways so that when we're deleted, we can remove ourselves from the correct ways. sigh
// to deprecate
Node.prototype.addWay = function (way) {
  if (this.ways.indexOf(way) !== -1) debugger; // sanity check for to catch re-adding a way
  this.ways.push(way);
  return this;
};

Node.prototype.deleteWay = function (way) {
  if (this.ways.indexOf(way) === -1) debugger; // sanity check for to catch removing a non-member way
  this.ways.delete(way);
  return this;
};

// remove node from edges and graph. ways don't track nodes, so don't need to deal with them
Node.prototype.delete = function() {
  // delete edges that the node is a member of (edges have to have 2 points)
  this.edges.forEach( function (e) { e.delete(); }); // we may be messing up our forEach if the e.delete alters the edges array while we're using it. may need a while loop.
  // delete this node from the master list
  delete this.graph.xNodes[this];
  return true;
};

Node.prototype.getCoordinates = function() {
  return this._coordinates.slice();
};

Node.prototype.setCoordinates = function(newCoords) {
  this._coordinates = newCoords.slice();
  this.coordinates = this._coordinates;
  return this;
};

Node.prototype.neighbors = function() {
  function isntMe (otherNode) {
    return (this !== otherNode);
  }
  return this.edges.map( function (e) {
    var a = e.nodes.filter(isntMe)[0];
    // Sanity check. Each edge should only have 2 nodes, so length should be 1 after filtering away one.
    if (a.length !== 1) { debugger; }
    return a;
  });
};

Node.prototype.isNeighbor = function(n) {
  if (this.neighbors.indexOf(n) === -1) {
    return false;
  } else {
    return true;
  }
};

Node.prototype.getEdgeWithNode = function (otherNode) {
  function union(arr1, arr2) {
    return arr1.filter(function(n) {
        return (arr2.indexOf(n) != -1);
    });
  }
  // Find the edge that's common to both nodes
  var edge = union(this.edges, otherNode.edges);
  // Sanity check
  if (edge.length > 1) debugger;
  return edge[0];
};

Node.prototype.rediscoverWaysFromEdges = function() {
  this.ways.length = 0;
  this.edges.forEach( function(e) {
    this.addWay(e.way);
  });
};
