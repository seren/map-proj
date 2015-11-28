var Way = function(args) {
  var self = this;
  self.graph = args.graph;
  if (self.graph === undefined) debugger;
  self.id = self.graph.wayCounter();
  if (self.graph.xWays[self.id] !== undefined) {
    console.log("way '"+self.id+"' already exists.");
    debugger;
  }
  self.edges = [];
  args.edges.forEach( function (e) { addEdge(e); }); // will addEdge be defined yet?

// debugger
  this.addNode = function addNode (node) {
    if (self.edges.indexOf(e) === -1) {
      self.nodes[node.id] = node;
    }
    return self;
  };

  this.addEdge = addEdge;
  function addEdge (e) {
    if (self.edges.indexOf(e) === -1) {
      self.edges.push(e);
      e.way = self;
    } else {
      debugger; // sanity check to catch re-adding edge
    }
    return self;
  }

  this.removeEdge = function removeEdge (e) {
    console.log('way '+self.id+': remove edge ['+e.id+']');
    if (self.edges.indexOf(e) === -1) {
      console.log('caught trying to remove non-member edge');
      debugger;
    } else {
      self.edges.removeByValue(e);
    }
    // if this way has no more edges, delete it
    if (self.edges.length === 0) {
      // delete this way from the master list
      if (self.graph.xWays[self.id] === undefined) {
        console.log("way '"+self.id+"' doesn't exist in graph's list");
        debugger;
      }
      delete self.graph.xWays[self.id];
    }
    return true;
  };

};
