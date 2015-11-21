var Edge = function(args) {
  this.id = (args.id === undefined) ? '00' : args.id;
  this.graph = args.graph;
  // this.nodes = (args.nodes === undefined) ? [] : args.nodes;
  this.node1 = (args.node1 === undefined) ? [] : args.node1;
  this.node2 = (args.node2 === undefined) ? [] : args.node2;
  // this.ways = (args.ways === undefined) ? [] : args.ways;
};


Edge.prototype.delete = function() {
  // remove edge from member nodes
  node1.edges.removeByValue(this);
  node2.edges.removeByValue(this);
  // delete it from the master list
  this.graph.xEdges.delete(this);
  return true;
}


// Edge.prototype.getCoordinates = function() {
//   return this._coordinates.slice();
// }

// Edge.prototype.setCoordinates = function(newCoords) {
//   this._coordinates = newCoords.slice();
//   return this;
// }
