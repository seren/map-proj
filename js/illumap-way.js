var Way = function(args) {
  var self = this;
  // this.nodes = (args.nodes === undefined) ? [] : args.nodes;  // should way keep track of nodes? probably not. can be derived from edges
  this.edges = (args.edges === undefined) ? [] : args.edges;
  this.graph = args.graph;
  if (this.graph === undefined) debugger;
  this.id = this.graph.wayCounter();

debugger
  this.addNode = function addNode (node) {
    if (self.edges.indexOf(e) === -1) {
      self.nodes[node.id] = node;
    }
    return self;
  };

  this.addEdge = function addEdge (edge) {
    if (self.edges.indexOf(e) === -1) {
      self.edges[edge.id] = edge;
    } else {
      debugger; // sanity check to catch re-adding edge
    }
    return self;
  };

  this.removeEdge = function removeEdge (e) {
    if (self.edges.indexOf(e) === -1) {
      debugger; // sanity check to catch trying to remove non-member edge
    } else {
      self.edges.removeByValue(e);
    }
    // if this way has no more edges, delete it
    if (self.edges.length === 0) {
      // delete it from the master list
      if (self.graph.xWays[self.id] === undefined) {
        console.log("way '"+self.id+"' doesn't exist in graph's list");
        debugger;
      }
      delete self.graph.xWays[self.id];
    }
    return true;
  };

};
