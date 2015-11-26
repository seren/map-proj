var Edge = function(args) {
  var self = this;
  self.id = (args.id === undefined) ? '00' : args.id;
  self.graph = args.graph;
  self._nodes = (args.nodes === undefined) ? [] : args.nodes;
  self.numericId = Math.floor( (this._nodes[0].numericId / 2) + (this._nodes[1].numericId / 2) );
  self.way = args.way;

  if (self.graph === undefined) debugger;

  // update nodes' edge list, and intersection and endpoint status
  this._nodes.forEach( function (n) {
    n.addEdge(self);
    n.endpoint = (n.getEdges() < 1);
    n.intersection = (n.getEdges() > 2);
  });

  this.getNodes = function getNodes() {
    return self._nodes;
  }

  this.addNode = function addNode(n) {
    self._nodes.push(n);
    if (self._nodes.length > 2) debugger;  //sanity check
    return self._nodes;
  }

  this.otherNode = function otherNode(n1) {
    return self._nodes.filter( function (n) { return (n !== n1); });
  };

  // deletes an edge and references to it
  this.destroy = function destroy() {
    // remove this edge from nodes
    self._nodes.forEach( function (n) {
      n.getEdges().removeByValue(self);
    });
    // remove this edge from its way
    self.way.removeEdge(self);
    // delete it from the master list
    if (self.graph.xEdges[self.id] === undefined) {
      console.log("edge '"+self.id+"' doesn't exist in graph's list");
      debugger;
    }
    delete self.graph.xEdges[self.id];
    return true;
  };

};
