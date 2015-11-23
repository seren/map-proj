var Graph = function(args) {
  this.xNodes = {};
  this.xEdges = {};
  this.xWays = {};
  return this;
};

// returns xNodes as an array
Graph.prototype.nodes = function() {
  return Object.keys(xNodes).map(function (key) { return xNodes[key]; } );
};

Graph.prototype.node = function (id) {
  return this.xNodes[id];
};

Graph.prototype.addNode = function (id) {
  var n = new Node({id: id, graph: this});
  xNodes[id] = n;
  return n;
};


// returns xEdges as an array
Graph.prototype.edges = function() {
  return Object.keys(xEdges).map(function (key) { return xEdges[key]; } );
};

Graph.prototype.edge = function (id) {
  return this.xEdges[id];
};

Graph.prototype.addEdge = function (nodes) {
  // check that edge doesn't already exist
  var e = this.getEdge(nodes);
  if (e) debugger;

  e = new Edge({id: id, nodes: nodes, graph: this});
  xEdges[id] = e;
  return e;
};

Graph.prototype.getEdge = function(nodes) {
  var id = nodes[0].id+nodes[1].id;
  var idRev = nodes[1].id+nodes[0].id;
  return this.edges[id] || this.edges[idRev] || undefined;
};


// returns xWays as an array
Graph.prototype.ways = function() {
  return Object.keys(xWays).map(function (key) { return xWays[key]; } );
};

Graph.prototype.way = function (id) {
  return this.xWays[id];
};

Graph.prototype.addWay = function (id, nodeArray) {
  if (xWays[id] !== undefined) {
    console.log("way '"+id+"' already exists. adding nodes to it");
    debugger;
  }
  var w = new Way({id: id, nodes: nodeArray, graph: this});
  xWays[id] = w;
  nodeArray.forEach ( function (n) { n.ways.addWay(w); });
  return w;
};

Graph.prototype.resetWays = function () {
  xNodes.forEach( function (n) {
    n.ways.length = 0;
  });
  xWays = {};
  return true;
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
