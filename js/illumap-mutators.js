// object for storing and working with geojson
var Mutators = function() {
};

// force directed algorithm
Mutators.prototype.relax = function(g) {
// debugger

  var springForce = 0.1;

  var newCoord0 = {};
  var newCoord1 = {};
  // var nodeVal; // value of the node
  var nbrVal; // value of the neighbor node
  // for each node, calculate the offset
  g.nodes().forEach( function(nd) {
    var nodeVal = g.node(nd);
    var offset0=0;
    var offset1=0;
    // get the neighbors and calc the offset
    g.neighbors(nd).forEach( function(nbr) {
      nbrVal = g.node(nbr);
// debugger
      offset0 = offset0 + ((nbrVal.coordinates[0] - nodeVal.coordinates[0]) * springForce);
      offset1 = offset1 + ((nbrVal.coordinates[1] - nodeVal.coordinates[1]) * springForce);
    });
    newCoord0[nd] = nodeVal.coordinates[0] + offset0;
    newCoord1[nd] = nodeVal.coordinates[1] + offset1;
  });
    // now update the nodes
  g.nodes().forEach( function(nd) {
// debugger
var nodeVal = g.node(nd);
var index = nodeVal.coordinateIndex;
var oldcoord = nodeVal.coordinates.slice();
var oldcoorddeep = nodeVal.feature.geometry.coordinates[index].slice();
var wayId = nodeVal.feature.id;
    // g.node(nd).coordinates = [newCoord0[nd], newCoord1[nd]];  // this creates a new array, when we actually want to update the existing one
                                                                 //  since it's a reference to the feature coordinate array
    g.node(nd).coordinates[0] = newCoord0[nd];
    g.node(nd).coordinates[1] = newCoord1[nd];
var newcoord = nodeVal.coordinates.slice();  //g.node(nd)
var newcoorddeep = nodeVal.feature.geometry.coordinates[index].slice();

console.log('changed node '+nd+' way '+wayId+' from ' + oldcoord + '(' + oldcoorddeep +') to ' + newcoord + '(' + newcoorddeep + ')');
  });
  return g;
};
