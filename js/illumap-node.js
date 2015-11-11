var Node = function(args) {
  this.id = (args['id'] === undefined) ? [] : args['id'];
  this.features = (args['features'] === undefined) ? [] : args['features'];
  this.endpoint = (args['endpoint'] === undefined) ? false : args['endpoint'];
  this.intersection = (args['intersection'] === undefined) ? false : args['intersection'];
  this.wayEnd = (args['wayEnd'] === undefined) ? false : args['wayEnd'];
  this.wayIds = (args['wayIds'] === undefined) ? [] : args['wayIds'];  // deprecate
  this.ways = (args['ways'] === undefined) ? [] : args['ways'];
  this._coordinates = (args['coordinates'] === undefined) ? [] : args['coordinates'];
  this.graph = (args['graph'] === undefined) ? [] : args['graph'];
};

Node.prototype.addWay = function (way) {
  if (this.ways[way.id] === undefined) {
    this.ways[way.id] = way;
  }
  return this;
}

Node.prototype.getCoordinates = function() {
  return this._coordinates.slice();
}

Node.prototype.setCoordinates = function(newCoords) {
  this._coordinates = newCoords.slice();
  return this;
}

Node.prototype.neighbors = function() {
  return this.graph.neighbors(this.id);
}
