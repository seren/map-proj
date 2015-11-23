var Way = function(args) {
  this.id = (args.id === undefined) ? '0' : args.id;
  // this.nodes = (args.nodes === undefined) ? [] : args.nodes;  // should way keep track of nodes? probably not. can be derived from edges
  this.edges = (args.edges === undefined) ? [] : args.edges;
  this.graph = (args.graph === undefined) ? [] : args.graph;
  return this;
};

Way.prototype.addNode = function (node) {
  if (this.nodes[node.id] === undefined) {
    this.nodes[node.id] = node;
  }
  return this;
};

Way.prototype.addEdge = function (edge) {
  if (this.edges[edge.id] === undefined) {
    this.edges[edge.id] = edge;
  } else {
    debugger; // sanity check to catch re-adding edge
  }
  return this;
};

Way.prototype.removeEdge = function (e) {
  if (this.edges[e.id] === undefined) {
    debugger; // sanity check to catch trying to remove non-member edge
  } else {
    this.edges.removeByValue(e);
  }
  // if this way has no more edges, delete it
  if (edges.length === 0) {
    // delete it from the master list
    if (this.graph.xWays[this.id] === undefined) {
      console.log("way '"+this.id+"' doesn't exist in graph's list");
      debugger;
    }
    delete this.graph.xWays[this.id];
  }
  return true;
};

