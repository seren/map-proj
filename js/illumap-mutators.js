// object for storing and working with geojson
var Mutators = function() {
};

Mutators.prototype.generic = function(g, graphNodes, mutationFunc) {

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
      offset0 += (nbrCoord[0] - nodeCoord[0]);
      offset1 += (nbrCoord[1] - nodeCoord[1]);
    });
    newCoord0[nd] = nodeCoord[0] + (offset0 * springForce);
    newCoord1[nd] = nodeCoord[1] + (offset1 * springForce);
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
log('mondrianizing');
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
        offset0 += 0.25 * delta0;
      } else {
        offset1 += 0.25 * delta1;
      }

      // check if edge is close to diagonal
      if (absLongCorrected > 0.01) {
        var angle = Math.acos(absLat / absLongCorrected);
        if (angle < 1) {
console.log('angle is close to diagonal');
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


// we may want to memoize the sorted array or some other data-structures
Mutators.prototype.progressiveMesh = function(g, graphNodes, ways) {
  var sortedEdges, ec;

  // quick length generator (for when don't need absolute length, just roughly relative length)
  function edgeLengthSquared (e,graphNodes) {
    return (Math.pow((graphNodes[e.v].coordinates[0] - graphNodes[e.w].coordinates[0]), 2) + Math.pow((graphNodes[e.v].coordinates[1] - graphNodes[e.w].coordinates[1]), 2));
  }

  // returns true if e1 length >= e2 length
  function edgeLengthComparator (e1,e2) {
    var e1Len = edgeLengthSquared(e1,graphNodes);
    var e2Len = edgeLengthSquared(e2,graphNodes);
    // console.log('edge ['+e1.v+','+e1.w+']='+ e1Len + ' ' + ((e1Len >= e2Len) ? '>=' : '<') +' ['+e2.v+','+e2.w+']='+e2Len);
    // return ((edgeLengthSquared(e1) >= edgeLengthSquared(e2)) ? 1 : -1);
    if (e1Len > e2Len) {
      return 1;
    }
    if (e1Len < e2Len) {
      return -1;
    }
    return 0;
  }

  function collapseEdge (g, e) {
    // debugger
    var n1, n2, n1int, n2int, n1Frozen, n2Frozen, n1Edges, n2Edges, n1Neighbors, n2Neighbors, nbrVal;
    n1 = e.v;
    n2 = e.w;
    n1Frozen = illumap.utility.nodeFrozen(graphNodes[n1]);
    n2Frozen = illumap.utility.nodeFrozen(graphNodes[n2]);
    // can't collapse if they're both frozen
    if (n1Frozen && n2Frozen) { return false; }
    // if one is frozen, make sure it's not n2
    if (n2Frozen) {
      n2 = e.v;
      n1 = e.w;
    }

    n1int = parseInt(n1);
    n2int = parseInt(n2);

    // move edges from n2 to n1 (if necessary)
    n1Edges = g.nodeEdges(n1);
    n2Edges = g.nodeEdges(n2);
    n1Neighbors = g.neighbors(n1);
    n2Neighbors = g.neighbors(n2);
    // add edge to n1 if it's not already there, and not the edge we're collapsing
    n2Neighbors.forEach(function(nbr) {
      if ((nbr !== n1) && (n1Neighbors.indexOf(nbr) == -1)) {
// debugger;
        nbrVal = g.edge(n2, nbr);
        console.log('creating edge ['+n1+','+nbr+'] from old edge ['+n2+','+nbr+'], wantayid '+g.edge(n2, nbr).wayId);
        // create new edge, preserving the old edge's value
        g.setEdge(n1, nbr, nbrVal);
        // add any new wayIds to n1
        if (graphNodes[n1int].wayIds.indexOf(nbrVal.wayId) === -1) {
          graphNodes[n1int].wayIds.push(nbrVal.wayId);
        }
      }
    });

    // reposition n1 toward n2
    graphNodes[n1int].coordinates = midpoint(n1, n2);

    // remove n2 from any ways. This can leave us with empty arrays in the ways list. Problem?
    graphNodes[n2int].wayIds.forEach(function(wid) {
// debugger
      console.log('removing '+n2+' from way '+wid);
      ways[wid].removeByValue(n2int);
      // clear any ways with only 1 node
      if (ways[wid].length === 1) {
        ways[wid].length = 0;
      }
    });

    g.removeNode(n2);
    return g;
  }

  function midpoint (n1, n2) {
    return [
      (graphNodes[n1].coordinates[0] + graphNodes[n2].coordinates[0]) / 2,
      (graphNodes[n1].coordinates[1] + graphNodes[n2].coordinates[1]) / 2
    ];
  }

  ec = g.edgeCount();
  sortedEdges = g.edges().sort(edgeLengthComparator);
  // need extra logic if we want to support freezing certain nodes (e.g. endnodes, wayends, borders, connectors)
  collapseEdge(g, sortedEdges[0]);
  return g;


};

