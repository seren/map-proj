var Graph = function(args) {
  var xNodes = {},
      xEdges = {},
      xWays = {};
};

// returns xNodes as an array
Graph.prototype.nodes = function() {
  return Object.keys(xNodes).map(function (key) { return xNodes[key]; } );
}

Graph.prototype.node = function (id) {
  return this.xNodes[id];
}

Graph.prototype.addNode = function (id) {
  var n = new Node({id: id, graph: this});
  xNodes[id] = n;
  return n;
}


// returns xEdges as an array
Graph.prototype.edges = function() {
  return Object.keys(xEdges).map(function (key) { return xEdges[key]; } );
}

Graph.prototype.edge = function (id) {
  return this.xEdges[id];
}

Graph.prototype.addEdge = function (id, n1, n2) {
  var e = new Edge({id: id, node1: n1, node2: n2, graph: this});
  xEdges[id] = e;
  n1.edges.push(e);
  n2.edges.push(e);
  return e;
}


// returns xWays as an array
Graph.prototype.ways = function() {
  return Object.keys(xWays).map(function (key) { return xWays[key]; } );
}

Graph.prototype.way = function (id) {
  return this.xWays[id];
}

Graph.prototype.addWay = function (id, nodeArray) {
  var w = new Way({id: id, nodes: nodeArray, graph: this});
  nodeArray.forEach ( function (n) { n.ways.push(w) });
  xWays[id] = w;
  return w;
}




"6.1668354,53.4766041", "6.1671293,53.4758415", "6.1674498,53.4759629", "6.1688231,53.4759547"
path

e.v
"6.1668354,53.4766041"
way "6530017"
"6.1671293,53.4758415"
"6.1668354,53.4766041"


"6.1671293,53.4758415"


node = coordinate, point, graphlib node with value set to Node obj stored in xNodes, obj {ways}
way = collection of nodes from one endpoint/intersection to another
edge = pair of connected nodes, graphlib edge with value set to an Edge object stored in xEdges, obj {ways, nodes}
graph = graphlib object containing relations between edges

storage of raw json tiles in cache (illumap.tileCache)
storage of json data:

