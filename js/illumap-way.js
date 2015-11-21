var Way = function(args) {
  this.id = (args.id === undefined) ? '0' : args.id;
  this.nodes = (args.nodes === undefined) ? [] : args.nodes;
  // this.edges = (args.edges === undefined) ? [] : args.edges;
  this.graph = (args.graph === undefined) ? [] : args.graph;
  return this;
};

Way.prototype.addNode = function (node) {
  if (this.nodes[node.id] === undefined) {
    this.nodes[node.id] = node;
  }
  return this;
}
