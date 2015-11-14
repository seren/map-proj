var Node = function(args) {
  this.id = (args.id === undefined) ? '0' : args.id;
  this.features = (args.features === undefined) ? [] : args.features;
  this.endpoint = (args.endpoint === undefined) ? false : args.endpoint;
  this.intersection = (args.intersection === undefined) ? false : args.intersection;
  this.wayEnd = (args.wayEnd === undefined) ? false : args.wayEnd;
  this.wayIds = (args.wayIds === undefined) ? [] : args.wayIds;  // deprecate
  this.ways = (args.ways === undefined) ? [] : args.ways;
  this._coordinates = (args.coordinates === undefined) ? [] : args.coordinates;
  this.coordinates = (args.coordinates === undefined) ? [] : args.coordinates;
  this.graph = (args.graph === undefined) ? [] : args.graph;
  var n = this.id.split(',').reduce(
      function(prev,curr){ return prev + parseFloat(curr); },0); // add the lat and lon values and covert to int for a quasi-uid
  this.numericId = parseInt( n * Math.pow(10, illumap.utility.floatPrecision(n)) );
};

Node.prototype.addWay = function (way) {
  if (this.ways[way.id] === undefined) {
    this.ways[way.id] = way;
  }
  return this;
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
