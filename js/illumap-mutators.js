// object for storing and working with geojson
var Mutators = function() {
};

// force directed algorithm
Mutators.prototype.relax = function(g, graphNodes) {

  var springForce = 0.2;
  var offset0, offset1, nodeCoord;

  var newCoord0 = {};
  var newCoord1 = {};
  var nbrVal; // value of the neighbor node
  // for each node, calculate the offset
  g.nodes().forEach( function(nd) {
    nodeCoord = graphNodes[nd].coordinates;
    offset0 = 0;
    offset1 = 0;
    // get the neighbors and calc the offset
    g.neighbors(nd).forEach( function(nbr) {
      nbrCoord = graphNodes[nbr].coordinates;
      offset0 += ((nbrCoord[0] - nodeCoord[0]) * springForce);
      offset1 += ((nbrCoord[1] - nodeCoord[1]) * springForce);
    });
    newCoord0[nd] = nodeCoord[0] + offset0;
    newCoord1[nd] = nodeCoord[1] + offset1;
  });
    // now update the nodes
  g.nodes().forEach( function(nd) {

var oldcoord = graphNodes[nd].coordinates.slice();
    graphNodes[nd].coordinates = [newCoord0[nd], newCoord1[nd]];
var newcoord = graphNodes[nd].coordinates.slice();

console.log('changed node '+nd+' way '+graphNodes[nd].wayIds+' from ' + oldcoord +' to ' + newcoord);
  });
  return g;
};

// orthoganalization algorithm
Mutators.prototype.mondrianize = function(g, graphNodes) {
  // Note: the coordinates are stored: [longitude, latitude]

  var newCoord0 = {};
  var newCoord1 = {};

  var delta0, delta1, absLat, absLongCorrected;

  g.nodes().forEach( function(nd) {
    nodeCoord = graphNodes[nd].coordinates;
    offset0 = 0;
    offset1 = 0;

    // get the neighbors and calc the offset
    g.neighbors(nd).forEach( function(nbr) {
      nbrCoord = graphNodes[nbr].coordinates;

// start algo
      delta0 = (nbrCoord[0] - nodeCoord[0]);
      delta1 = (nbrCoord[1] - nodeCoord[1]);

    // // since the longitude sections are thinning toward the pole
    // double effective_delta_longitude = delta_longitude * cos((float) (center_lattitude * PI / 180.0));
    // _longitudeFactor = effective_delta_longitude / delta_longitude;


      // just used for checking which direction to offset
      // absLongCorrected = Math.abs(offset0) * longitudeFactor
      absLongCorrected = Math.abs(offset0);
      absLat = Math.abs(offset1);

      // check if edge is approximately horizontal or vertical
      if (absLongCorrected < absLat) {
        offset0 += 0.35 * delta0;
      } else {
        offset1 += 0.35 * delta1;
      }

      // check if edge is close to diagonal
      if (absLongCorrected > 0.01) {
        var angle = Math.acos(absLat / absLongCorrected);
        if (angle < 1) {
          offset0 += Math.random() * angle * delta0;
          offset1 += Math.random() * angle * delta1;
        }
      }
/// end algo
      newCoord0[nd] = nodeCoord[0] + offset0;
      newCoord1[nd] = nodeCoord[1] + offset1;
    });
  });
  // now update the nodes
  g.nodes().forEach( function(nd) {

var oldcoord = graphNodes[nd].coordinates.slice();
    graphNodes[nd].coordinates = [newCoord0[nd], newCoord1[nd]];
var newcoord = graphNodes[nd].coordinates.slice();

console.log('changed node '+nd+' way '+graphNodes[nd].wayIds+' from ' + oldcoord +' to ' + newcoord);
  });
  return g;
};


