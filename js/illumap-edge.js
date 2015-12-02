var Edge = function(args) {
  var self = this;
  self.graph = args.graph;
  self._nodes = args.nodes;
  self.numericId = Math.floor( (this._nodes[0].numericId / 2) + (this._nodes[1].numericId / 2) );
  self.way = args.way;
  self.id = self._nodes[0].id+'-'+self._nodes[1].id;
  self.featureId; // for debugging

  if (self.graph === undefined) debugger;

  // update nodes' edge list, and intersection and endpoint status
  self._nodes.forEach( function (n) {
    n.addEdge(self);
    n.endpoint = (n.getEdges() < 1);
    n.intersection = (n.getEdges() > 2);
  });

  this.getNodes = function getNodes() {
    return self._nodes;
  };

  this.addNode = function addNode(n) {
    self._nodes.push(n);
    if (self._nodes.length > 2) debugger;  //sanity check
    return self._nodes;
  };

  this.otherNode = function otherNode(n1) {
    return self._nodes.filter( function (n) { return (n !== n1); });
  };

  // deletes an edge and references to it
  this.destroy = function destroy() {
    // sanity check to prevent loops
    if (self.graph.xEdges[self.id] === undefined) {
      console.log('edge ['+self.id+'] already destroyed');
    } else {
      console.log('destroying refs for edge: '+self.id);
      // Remove this edge from master list
      if (self.graph.xEdges[self.id] === undefined) {
        console.log("edge '"+self.id+"' doesn't exist in graph's list");
        debugger;
      }
      console.log('deleting edge ['+self.id+'] from graph master list');
      delete self.graph.xEdges[self.id];
      // remove this edge from nodes
      for (var i = self._nodes.length - 1; i >= 0; i--) {
        self._nodes[i].removeEdge(self);
      };
      // remove this edge from its way
      self.way.removeEdge(self);
    }
    return true;
  };

};
