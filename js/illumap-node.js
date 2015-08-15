var Node = function(args) {
  this.features = (args['features'] === undefined) ? [] : args['features'];
  this.coordinateIndices = (args['coordinateIndices'] === undefined) ? [] : args['coordinateIndices'];
  this.endpoint = (args['endpoint'] === undefined) ? false : args['endpoint'];
  this.intersection = (args['intersection'] === undefined) ? false : args['intersection'];
  this.wayEnd = (args['wayEnd'] === undefined) ? false : args['wayEnd'];
  this.wayIds = (args['wayIds'] === undefined) ? [] : args['wayIds'];
  this._coordinates = (args['coordinates'] === undefined) ? [] : args['coordinates'];
};

Node.prototype.getCoordinates = function() {
  return this._coordinates.slice();
}

Node.prototype.setCoordinates = function(newCoords) {
  this._coordinates = newCoords.slice();
  return this;
}
