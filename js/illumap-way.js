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
  args.edges.forEach( function (e) { addEdge(e); });
  self.nodesRdpSorted = undefined;

// debugger
  this.addNode = function addNode (node) {
    if (self.edges.indexOf(e) === -1) {
      self.nodes[node.id] = node;
    }
    return self;
  };

  // adds an edge without regard to order. Efficient for bulk loading, followed by an explicit ordering call
  // this.addEdgeUnordered = addEdgeUnordered;
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

  this.findEndpoint = findEndpoint;
  function findEndpoint(nodes) {
    nodes = nodes || self.nodes();
    var i;
    for (i = nodes.length - 1; i >= 0; i--) {
      if (nodes[i].endpoint) break;
    }
    return nodes[i];
  };

  this.orderEdges = function orderEdges() {
    self.edges = getOrderedEdges();
    return self;
  }

  function getOrderedEdges() {
    // find endpoint
    var endpoint = findEndpoint();
    // from one endpoint, get other node, find common edge from hash, repeat till other endpoint
    var edgesCopy = self.edges.slice();
    var len = edgesCopy.length;
    var neigborNode;
    var prevEdge;
    var currNode = endpoint;
    var orderedEdges = [];
    // rebuild the self.edges array in order
    do {
      // find the edge containing the current node ( isn't the previous node,
      currEdge = currNode.getEdges().filter(function(e) { return ((e.way === self) && (e !== prevEdge)); })[0];
      orderedEdges.push(currEdge);
      prevEdge = currEdge;
      prevNode = currNode;
      currNode = prevEdge.getNodes().filter(function(n) { return (n !== prevNode); })[0];
    } while (!currNode.endpoint);
    return orderedEdges;
  };

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

  this.getOrderedNodes = getOrderedNodes;
  function getOrderedNodes() {
    if (self.edges.length === 0) {
      return [];
    }
    // self.edges = getOrderedEdges();  // shouldn't be necessary if the edges are already in order
    var first = self.edges[0].getEndpoints()[0];
    if (first === undefined) {
      console.log('Our first edge should have had a node that was an endpoint.');
      debugger;
    } else {
      return self.edges.reduce( function (nodes, e) {
      // return self.edges.reduce( function (nodes, e) {
        nodes.push(e.otherNode(nodes[0]));
        return nodes;
      },[first]);
    }
  }

  this.nodes = function nodes () {
    var ns = [];
    return self.edges.reduce( function (acc, e) {
      ns = e.getNodes();
      if (acc.indexOf(ns[0]) === -1) acc.push(ns[0]);
      if (acc.indexOf(ns[1]) === -1) acc.push(ns[1]);
      return acc;
    },[]);
  };

  // check to make sure that way edges are ordered
  this.checkEdgesOrdered = function checkEdgesOrdered() {
    var endEdges = [];
    var endNodes = [];
    var nonEndNodes = [];
    var ordered = [];
    var nodes;
    var i;
    for (i = self.edges.length - 1; i >= 0; i--) {
      nodes = self.edges[i].getNodes();
      if (nodes[0].endpoint) {
        endEdges.push(self.edges[i]);
        endNodes.push(nodes[0]);
        nonEndNodes.push(nodes[1]);
      }
      if (nodes[1].endpoint) {
        endEdges.push(self.edges[i]);
        endNodes.push(nodes[1]);
        nonEndNodes.push(nodes[0]);
      }
    }
    if (endEdges.length !== 2) debugger;

    // prev - curr - next
    ordered.push(endEdges[0]);
    var nextNode = nonEndNodes[0];
    var currNode = endNodes[0];
    var prevNode;
    function nodeNotPrevNode() { return arguments[0] !== prevNode; }
    while (ordered.length < self.edges.length) {
      if (nextNode.endpoint) debugger; // we shouldn't hit an endpoint since the loop should exit before then
      if (nextEdge === endEdges[1]) debugger; // we should quit before we hit this
      if (nextNode.neighbors().length !== 2) debugger; // we shouldn't hit a node with more than 2 neighbors
      prevNode = currNode;
      currNode = nextNode;
      nextNode = currNode.neighbors().filter(nodeNotPrevNode)[0];
      if (nextNode === undefined) debugger;
      nextEdge = self.graph.getEdge([currNode,nextNode]);
      ordered.push(nextEdge);
    }

    // we now have an ordered set of edges. compare to the normal edge list and see if it's the same (back or forward)
    var len = self.edges.length;
    if (ordered[0] === self.edges[0]) {
      for (i = 0; i < len; i++) {
        if (self.edges[i] !== ordered[i]) debugger;
      }
    } else {
      for (i = 0; i < len; i++) {
        if (self.edges[i] !== ordered[len - i - 1]) debugger;
      }
    }
    console.log("edges in way "+self.id+" seem ordered. yay.");
  };

};
