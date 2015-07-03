// object for storing and working with geojson
var Mutators = function() {
};

// force directed algorithm
Mutators.prototype.relax = function(g) {
// debugger
  var newNodeVal0 = {};
  var newNodeVal1 = {};
  var nodeVal; // value of the node
  var nbrVal; // value of the neighbor node
  // for each node, calculate the offset
  g.nodes().forEach( function(nd) {
    nodeVal = g.node(nd);
    var offset0=0;
    var offset1=0;
    // get the neighbors and calc the offset
    g.neighbors(nd).forEach( function(nbr) {
      nbrVal = g.node(nbr);
// debugger
      offset0 = offset0 + ((nbrVal[0] - nodeVal[0]) / 2);
      offset1 = offset1 + ((nbrVal[1] - nodeVal[1]) / 2);
    });
    newNodeVal0[nd] = nodeVal[0] + offset0;
    newNodeVal1[nd] = nodeVal[1] + offset1;
  });
    // now update the nodes
  g.nodes().forEach( function(nd) {
// debugger
var oldcoord = g.node(nd);
    g.setNode(nd, [newNodeVal0[nd], newNodeVal1[nd]]);
console.log('changed coordinates from ' + oldcoord + ' to ' + g.node(nd));
  });
};
