var Node = function(args) {
  this.id = (args.id === undefined) ? '0' : args.id;
  var n = this.id.split(',').reduce(
      function(prev,curr){ return prev + parseFloat(curr); },0); // add the lat and lon values and covert to int for a quasi-uid
  this.numericId = parseInt( n * Math.pow(10, illumap.utility.floatPrecision(n)) );
  this.features = (args.features === undefined) ? [] : args.features;
  this.endpoint = (args.endpoint === undefined) ? false : args.endpoint;
  this.intersection = (args.intersection === undefined) ? false : args.intersection;
  this.wayEnd = (args.wayEnd === undefined) ? false : args.wayEnd;
  this.wayIds = (args.wayIds === undefined) ? [] : args.wayIds;  // deprecate
  this.ways = (args.ways === undefined) ? [] : args.ways; // array of way objects
  this.edges = (args.edges === undefined) ? [] : args.edges;
  this._coordinates = (args.coordinates === undefined) ? [] : args.coordinates;
  this.coordinates = (args.coordinates === undefined) ? [] : args.coordinates;
  this.graph = args.graph;
  this.rdpMetric = undefined;
  return this;
};

// to deprecate
Node.prototype.addWay = function (way) {
  this.ways[way.id] = way;
  return this;
};

// remove node from ways, edges, and graph
Node.prototype.delete = function() {
  // delete edges the node is a member of (edges have to have 2 points)
  this.edges.forEach( function (e) { e.delete(); }); // we may be messing up our forEach if the e.delete alters the edges array while we're using it. may need a while loop.
  // delete point from ways
  this.ways.forEach( function (w) { w.deleteNode(this); }); // will deleteNode(this) work? will "this" refer to the correct object?
  // delete it from the master list
  this.graph.xNodes.delete(this);
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
  return this.graph.neighbors(this.id);
};
