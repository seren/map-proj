// object for storing and working with geojson
var Mutators = function() {
};

// force directed algorithm
Mutators.prototype.relax = function(g, graphNodes) {
// debugger

  var springForce = 0.3;

  var newCoord0 = {};
  var newCoord1 = {};
  // var nodeVal; // value of the node
  var nbrVal; // value of the neighbor node
  // for each node, calculate the offset
  g.nodes().forEach( function(nd) {
    // debugger
    var nodeCoord = graphNodes[nd].coordinates;
    var offset0=0;
    var offset1=0;
    // get the neighbors and calc the offset
    g.neighbors(nd).forEach( function(nbr) {
      nbrCoord = graphNodes[nbr].coordinates;
// debugger
      offset0 = offset0 + ((nbrCoord[0] - nodeCoord[0]) * springForce);
      offset1 = offset1 + ((nbrCoord[1] - nodeCoord[1]) * springForce);
    });
    newCoord0[nd] = nodeCoord[0] + offset0;
    newCoord1[nd] = nodeCoord[1] + offset1;
  });
    // now update the nodes
  g.nodes().forEach( function(nd) {
// debugger

var oldcoord = graphNodes[nd].coordinates.slice();
    graphNodes[nd].coordinates = [newCoord0[nd], newCoord1[nd]];
var newcoord = graphNodes[nd].coordinates.slice();

console.log('changed node '+nd+' way '+graphNodes[nd].wayIds+' from ' + oldcoord +' to ' + newcoord);
  });
  return g;
};
