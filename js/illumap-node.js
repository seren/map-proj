var Node = function(args) {
  this.features = (args['features'] === undefined) ? [] : args['features'];
  this.coordinateIndices = (args['coordinateIndices'] === undefined) ? [] : args['coordinateIndices'];
  this.endpoint = (args['endpoint'] === undefined) ? false : args['endpoint'];
  this.intersection = (args['intersection'] === undefined) ? false : args['intersection'];
  this.wayEnd = (args['wayEnd'] === undefined) ? false : args['wayEnd'];
  this.wayIds = (args['wayIds'] === undefined) ? [] : args['wayIds'];
  this.tangentStale = (args['tangentStale'] === undefined) ? true : args['tangentStale'];

  this._coordinates = (args['coordinates'] === undefined) ? [] : args['coordinates'];
  this._tangentVector = (args['tangentVector'] === undefined) ? [] : args['tangentVector'];

  function tangentVectors (p1,p2) {
    // if we define dx=x2-x1 and dy=y2-y1, then the normals are (-dy, dx) and (dy, -dx)
    var dx = p2[0] - p1[0];
    var dy = p2[1] - p1[1];
    return [[-dy, dx, dy, -dx]];
  }

};

Node.prototype.getCoordinates = function() {
  return this._coordinates.slice();
}

Node.prototype.setCoordinates = function(newCoords) {
  this._coordinates = newCoords.slice();
  this.tangentStale = true;
  return this;
}


Node.prototype.tangentVector = function() {
  if (this.tangentStale) {
    this._tangentVector = tangentVectors(coordinates);
  }
  this.tangentStale = false;
  // could add some logic to choose the tangent to return
  return this._tangentVector[0];
};

