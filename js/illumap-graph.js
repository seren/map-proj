var Graph = function(args) {
  var self = this;
  self.xNodes = {};
  self.xEdges = {};
  self.xWays = {};

  this.debug = function debug() {
    debugger;
  };

  // returns xNodes as an array
  this.nodes = function nodes() {
    return self.genericAsArray(self.xNodes);
  };

  this.node = function node (id) {
    return self.xNodes[id];
  };

  this.addNode = function addNode (id) {
    var n = new Node({id: id, graph: self});
    self.xNodes[id] = n;
    return n;
  };

  this.nodeCount = function nodeCount() {
    return self.nodes().length;
  };

  this.printNodes = function printNodes() {
    console.log('nodes:');
    var n = self.xNodes;
    Object.keys(self.xNodes).forEach( function (k) {
      console.log('id: '+n[k].id
        // +' coordinates: '+ (n[k].getCoordinates().map(function(c) {return c.toString(); } ).toString())
        // +' ways: '+ (n[k].ways.map(function(w) {return w.toString(); } ).toString())
        +' numericId: '+ (n[k].numericId)
      );
    });
  };


  // returns xEdges as an array
  this.edges = function edges() {
    return self.genericAsArray(self.xEdges);
  };

  this.edge = function edge (id) {
    return self.xEdges[id];
  };

  this.addEdge = function addEdge (nodes) {
    // check that edge doesn't already exist
    var e = self.getEdge(nodes);
    if (e) debugger;
    e = new Edge({nodes: nodes, graph: self});
    self.xEdges[e.id] = e;
    return e;
  };

  this.getEdge = function getEdge(nodes) {
    var id = nodes[0].id+'-'+nodes[1].id;
    var idRev = nodes[1].id+'-'+nodes[0].id;
    return self.xEdges[id] || self.xEdges[idRev] || undefined;
  };

  this.edgeCount = function edgeCount() {
    return self.edges().length;
  };

  this.printEdges = function printEdges() {
    console.log('edges:');
    var e = self.xEdges;
    Object.keys(self.xEdges).forEach( function (k) {
      console.log('id: '+e[k].id
        // +' nodes: '+(e[k].getNodes().map(function(n) {return n.id; } ).toString())
        +' way: '+(e[k].way.id)
      );
    });
  };


  // returns xWays as an array
  this.ways = function ways() {
    return self.genericAsArray(self.xWays);
  };

  this.way = function way (id) {
    return self.xWays[id];
  };

  this.addWay = function addWay (args) {
    var w = new Way({edges: args.edgeArray, graph: self});
    self.xWays[w.id] = w;
    return w;
  };

  this.printWays = function printWays() {
    console.log('ways:');
    var w = self.xWays;
    Object.keys(self.xWays).forEach( function (k) {
      console.log('id: '+w[k].id+' edges: '+
        (w[k].edges.map(function(e) {return e.id; } ).toString())
      );
    });
  };

  // We use this when we want to rebuild the ways
  this.resetWays = function resetWays () {
    var n = self.xNodes;
    Object.keys(self.xNodes).forEach( function (k) {
      n[k].ways.length = 0;
    });
    self.xWays = {};
    return true;
  };

  this.wayCount = function wayCount() {
    return self.ways().length;
  };

  // simple counter to give us unique id
  this.wayCounter = (function wayCounter() {
    var counter = 0;
    return function () { return counter += 1; };
  })();

  this.print = function print() {
    this.printNodes();
    this.printEdges();
    this.printWays();
  }

  this.reset = function reset () {
    self.xWays = {};
    self.xNodes = {};
    self.xEdges = {};
  };

};


// Graph.prototype.getEdgeWithNodes = function (nodes) {
//   function union(arr1, arr2) {
//     return arr1.filter(function(n) {
//         return arr2.indexOf(n) != -1
//     });
//   }
//   // Find the edge that's common to both nodes
//   var edge = union(nodes[0].edges, nodes[1].edges);
//   // Sanity check
//   if (edge.length > 1) debugger;
//   return edge[0];
// };

Graph.prototype.genericAsArray = function(o) {
  var obj = o;
  return Object.keys(obj).map(function (key) { return obj[key]; } );
};

