var Graph = function(args) {
  var self = this;
  self.xNodes = {};
  self.xEdges = {};
  self.xWays = {};

  self.rdpStale = true;
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

  this.updateNodeAttributes = function updateNodeAttributes() {
    Object.keys(self.xNodes).forEach( function (k) {self.xNodes[k].updateGraphAttributes(); });
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
    if (e) {
      console.log('edge '+e.id+' already exists. returning it');
      return e;
    }
    e = new Edge({nodes: nodes, graph: self});
    self.xEdges[e.id] = e;
    nodes[0].updateGraphAttributes();
    nodes[1].updateGraphAttributes();
console.log('new edge '+e.id+' created');
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
        (w[k].getEdges().map(function(e) {return e.id; } ).toString())
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
  };

  this.reset = function reset () {
    self.xWays = {};
    self.xNodes = {};
    self.xEdges = {};
  };

  this.selfTest = function selfTest() {
  var nodesInWays = self.ways().map(function(w) {return w.getNodes();}).flatten();
  var nodesInEdges = self.edges().map(function(e) {return e.getNodes();}).flatten();
  var edgesInWays = self.ways().map(function(w) {return w.getEdges();}).flatten();
  var allEdges = self.edges();
  var allNodes = self.nodes();
  // edges in ways should == edges total
  if (edgesInWays.length !== allEdges.length) debugger;
  // // nodes in ways should == nodes in edges
  // if (nodesInWays.length !== nodesInEdges.length) debugger;
  // unique nodes in ways == all nodes
  if (nodesInWays.unique().length !== allNodes.length) debugger;
  // unique nodes in edges == all nodes
  if (nodesInEdges.unique().length !== allNodes.length) debugger;
  // no way should share a non-endpoint node
  var nonEndpointToWayHash = {};
  var neps;
  function nep(x) {return !x.endpoint; }
  self.ways().forEach(function(w) {
// console.log('working on way '+w.id);
    neps = w.getNodes().filter(nep);
    neps.forEach(function(n) {
// console.log('non-endpoint '+n.id+', hash: '+objToArray(nonEndpointToWayHash));
      if (nonEndpointToWayHash[n.id] === undefined) {
        nonEndpointToWayHash[n.id] = w;
      } else {
        console.log('non-endpoint node ['+n.id+'] is in way '+w.id+', and also way '+nonEndpointToWayHash[n.id].id);
        debugger; // we found a non-endpoint way-member that was already in a different way
      }
    });
  });
  // all ways should have 2 endpoints (or 1 if they're circular)
  self.ways().forEach(function(w) {
    if (w.getNodes().filter(fep).length !== 2) {
      if (w.getNodes().filter(fep).length === 1) {
        console.log('way '+w.id+' is circular (has one endpoint)');
      } else {
        console.log('way '+w.id+' should have 1 or 2 endpoints, not '+w.getNodes().filter(fep).length);
        debugger;
      }
    }
  });

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

