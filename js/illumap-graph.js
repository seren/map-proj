var Graph = function(args) {
  this.xNodes = {};
  this.xEdges = {};
  this.xWays = {};
};

// returns xNodes as an array
Graph.prototype.nodes = function() {
  return this.genericAsArray(this.xNodes);
};

Graph.prototype.node = function (id) {
  return this.xNodes[id];
};

Graph.prototype.addNode = function (id) {
  var n = new Node({id: id, graph: this});
  this.xNodes[id] = n;
  return n;
};


// returns xEdges as an array
Graph.prototype.edges = function() {
  return this.genericAsArray(this.xEdges);
};

Graph.prototype.edge = function (id) {
  return this.xEdges[id];
};

Graph.prototype.addEdge = function (nodes) {
  // check that edge doesn't already exist
  var e = this.getEdge(nodes);
  if (e) debugger;

  var id = nodes[0].id+nodes[1].id;
  e = new Edge({id: id, nodes: nodes, graph: this});
  this.xEdges[id] = e;
  return e;
};

Graph.prototype.getEdge = function(nodes) {
  var id = nodes[0].id+nodes[1].id;
  var idRev = nodes[1].id+nodes[0].id;
  return this.edges[id] || this.edges[idRev] || undefined;
};


// returns xWays as an array
Graph.prototype.ways = function() {
  return this.genericAsArray(xWays);
};

Graph.prototype.way = function (id) {
  return this.xWays[id];
};

Graph.prototype.addWay = function (id, nodeArray) {
  if (this.xWays[id] !== undefined) {
    console.log("way '"+id+"' already exists. adding nodes to it");
    debugger;
  }
  var w = new Way({id: id, nodes: nodeArray, graph: this});
  this.xWays[id] = w;
  nodeArray.forEach ( function (n) { n.ways.addWay(w); });
  return w;
};

Graph.prototype.resetWays = function () {
  var n = this.xNodes;
  Object.keys(this.xNodes).forEach( function (k) {
    n[k].ways.length = 0;
  });
  this.xWays = {};
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


Graph.prototype.genericAsArray = function(o) {
  var obj = o;
  return Object.keys(obj).map(function (key) { return obj[key]; } );
}
