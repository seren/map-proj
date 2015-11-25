var Graph = function(args) {
  var self = this;
  this.xNodes = {};
  this.xEdges = {};
  this.xWays = {};

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
    return self.nodes.length;
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

    var id = nodes[0].id+nodes[1].id;
    e = new Edge({id: id, nodes: nodes, graph: self});
    self.xEdges[id] = e;
    return e;
  };

  this.getEdge = function getEdge(nodes) {
    var id = nodes[0].id+nodes[1].id;
    var idRev = nodes[1].id+nodes[0].id;
    return self.edges[id] || self.edges[idRev] || undefined;
  };

  this.edgeCount = function edgeCount() {
    return self.edges.length;
  };


  // returns xWays as an array
  this.ways = function ways() {
    return self.genericAsArray(self.xWays);
  };

  this.way = function way (id) {
    return self.xWays[id];
  };

  this.addWay = function addWay (id, nodeArray) {
    if (self.xWays[id] !== undefined) {
      console.log("way '"+id+"' already exists. adding nodes to it");
      debugger;
    }
    var w = new Way({id: id, nodes: nodeArray, graph: self});
    self.xWays[id] = w;
    nodeArray.forEach ( function (n) { n.ways.addWay(w); });
    return w;
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
    return self.ways.length;
  };

  // simple counter to give us unique id
  this.wayCounter = (function wayCounter() {
    var counter = 0;
    return function () { return counter += 1; }
  })();

  this.reset = function reset () {
    self.xWays = {};
    self.xNodes = {};
    self.xEdges = {};
  }
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
