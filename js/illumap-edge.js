var Edge = function(args) {
  this.id = (args.id === undefined) ? '00' : args.id;
  this.graph = args.graph;
  this.nodes = (args.nodes === undefined) ? [] : args.nodes;
  // this.ways = (args.ways === undefined) ? [] : args.ways;
  this.way = (args.way === undefined) ? [] : args.way;

  // update nodes' edge list, and intersection and endpoint status
  this.nodes.forEach( function (n) {
    n.edges.push(this);
    n.endpoint = (n.edges < 1);
    n.intersection = (n.edges > 2);
  });

  return this;
};

Edge.prototype.otherNode = function (n1) {
  return this.nodes.filter( function (n) { return (n !== n1); });
};

// deletes an edge and references to it
Edge.prototype.delete = function() {
  // remove this edge from nodes
  nodes.forEach( function (n) {
    n.edges.removeByValue(this);
  });
  // remove this edge from its way
  this.way.removeEdge(this);
  // delete it from the master list
  if (this.graph.xEdges[e.id] === undefined) {
    console.log("edge '"+e.id+"' doesn't exist in graph's list");
    debugger;
  }
  delete this.graph.xEdges[e.id];
  return true;
};

