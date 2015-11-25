// object for storing and working with geojson
var Mutators = function() {
};

Mutators.prototype.generic = function(g, mutationFunc) {

};

// force directed repulsion-from-point algorithm
Mutators.prototype.repulse = function(opts) {
  var g = opts.g, // graph
      repulsionPoint = opts.repulsionPoint,
      chargeForce = 80,
      offset = [],
      screenOffset = [],
      newCoord = {},
      nodeCoord,
      attenuation = function attenuation (dist) {
        // inverse-square law
        return (1/(dist*dist));
      };

  // for each node, calculate the offset
  g.nodes().forEach( function(nd) {
// debugger
    nodeCoord = nd.getCoordinates();
    offset = [nodeCoord[0] - repulsionPoint[0],
              nodeCoord[1] - repulsionPoint[1]];

    // calculate the force based on distance using the user's contex (screen distance)
    screenOffset = [illumap.d3projection(nodeCoord)[0] - illumap.d3projection(repulsionPoint)[0],
                    illumap.d3projection(nodeCoord)[1] - illumap.d3projection(repulsionPoint)[1]];
    screenDist = Math.sqrt((screenOffset[0]*screenOffset[0]) + (screenOffset[1]*screenOffset[1]));
    force = Math.min(1, attenuation(screenDist) * chargeForce);

// console.log('node:'+nd+' offsets:'+offset0+','+offset1+' force:'+force);
// if (force > 1) { debugger }
    newCoord[nd.id] = [nodeCoord[0] + (offset[0] * force),
                       nodeCoord[1] + (offset[1] * force)];
// debugger
  });
    // now update the nodes
  g.nodes().forEach( function(nd) {

// var oldcoord = nd.getCoordinates();
    nd.setCoordinates(newCoord[nd.id]);
// var newcoord = nd.getCoordinates();

// console.log('changed node '+nd+' way '+nd.wayIds+' from ' + oldcoord +' to ' + newcoord);
  });
  return g;
};

// force directed relaxation algorithm
Mutators.prototype.relax = function(opts) {
  var g = opts.g, // graph
      springForce = 0.2,
      offset = [],
      nodeCoord,
      nbrCoord,
      newCoord = {};

  // for each node, calculate the offset
  g.nodes().forEach( function(nd) {
    nodeCoord = nd.getCoordinates();
    offset = [0,0];
    // get the neighbors and calc the offset
    nd.neighbors().forEach( function(nbr) {
      nbrCoord = nbr.getCoordinates();
      offset[0] += (nbrCoord[0] - nodeCoord[0]);
      offset[1] += (nbrCoord[1] - nodeCoord[1]);
    });
    newCoord[nd.id] = [nodeCoord[0] + (offset[0] * springForce),
                       nodeCoord[1] + (offset[1] * springForce)];
  });
    // now update the nodes
  g.nodes().forEach( function(nd) {

var oldcoord = nd.getCoordinates();
    nd.setCoordinates(newCoord[nd.id]);
var newcoord = nd.getCoordinates();

console.log('changed node '+nd.id+' from ' + oldcoord +' to ' + newcoord);
  });

  return g;
};

// orthoganalization algorithm
Mutators.prototype.mondrianize = function(opts) {
  log('mondrianizing');
  var g = opts.g,
      dampeningFactor = 0.25,
      newCoord = {}, // Note: the coordinates are stored: [longitude, latitude]
      nodeCoord = [],
      delta = [],
      absLat,
      absLongCorrected;

  g.nodes().forEach( function(nd) {
    nodeCoord = nd.getCoordinates();
    offset = [0,0];

    // get the neighbors and calc the offset
    g.neighbors(nd).forEach( function(nbr) {
      nbrCoord = nbr.getCoordinates();

// start algo
      delta = [(nbrCoord[0] - nodeCoord[0]),
               (nbrCoord[1] - nodeCoord[1])];

    // // since the longitude sections are thinning toward the pole
    // double effective_delta_longitude = delta_longitude * cos((float) (center_lattitude * PI / 180.0));
    // _longitudeFactor = effective_delta_longitude / delta_longitude;


      // just used for checking which direction to offset
      // absLongCorrected = Math.abs(offset0) * longitudeFactor
      absLongCorrected = Math.abs(offset[0]);
      absLat = Math.abs(offset[1]);

      // check if edge is approximately horizontal or vertical
      if (absLongCorrected < absLat) {
        offset[0] += dampeningFactor * delta[0];
      } else {
        offset[1] += dampeningFactor * delta[1];
      }

      // check if edge is close to diagonal
      if (absLongCorrected > 0.01) {
        var angle = Math.acos(absLat / absLongCorrected);
        if (angle < 1) {
console.log('angle is close to diagonal');
          offset[0] += Math.random() * angle * delta[0];
          offset[1] += Math.random() * angle * delta[1];
        }
      }
/// end algo
      newCoord[nd.id] = [nodeCoord[0] + offset[0],
                         nodeCoord[1] + offset[1]];
    });
  });
  // now update the nodes
  g.nodes().forEach( function(nd) {

var oldcoord = nd.getCoordinates();
    nd.setCoordinates(newCoord[nd.id]);
var newcoord = nd.getCoordinates();

console.log('changed node '+nd.id+' from ' + oldcoord +' to ' + newcoord);
  });
  return g;
};


// we may want to memoize the sorted array or some other data-structures
Mutators.prototype.progressiveMesh = function(opts) {
  var g = opts.g,
      sortedEdges,
      ec;

  // quick length generator (for when don't need absolute length, just roughly relative length)
  function edgeLengthSquared (e) {
    var v = e.nodes[0];
    var w = e.nodes[1];
    return (
      Math.pow((v.getCoordinates()[0] - w.getCoordinates()[0]), 2) +
      Math.pow((v.getCoordinates()[1] - w.getCoordinates()[1]), 2)
    );
  }

  // returns true if e1 length >= e2 length
  function edgeLengthComparator (e1,e2) {
    var e1Len = edgeLengthSquared(e1);
    var e2Len = edgeLengthSquared(e2);
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

  function collapseEdge (e) {
    // debugger
    var n1Frozen, n2Frozen, n1Neighbors, n2Neighbors, neighborWays, newEdge,
        g = e.graph,
        n1 = e.nodes[0],
        n2 = e.nodes[1];
    // can't collapse if they're both frozen
    if (n1.frozen && n2.frozen) { return false; }
    // if one is frozen, make sure it's not n2
    if (n2.frozen) {
      n2 = e.nodes[0];
      n1 = e.nodes[1];
    }

    // move edges from n2 to n1
    n1Neighbors = n1.neighbors();
    n2Neighbors = n2.neighbors();

    // for each n2 neighbor (nbr), if it doesn't already connect to n1, create an edge [nbr, n1]
    n2Neighbors.forEach(function(nbr) {
      if ((n1Neighbors.indexOf(nbr) == -1) && (nbr !== n1)) {
        console.log('creating edge ['+n1.id+','+nbr.id+'] from old edge ['+n2.id+','+nbr.id+'], wayid '+g.edge(n2id, nbr).wayId);
        // create new edge, preserving the old edge's value
        newEdge = g.addEdge([n1, nbr]);
        oldEdge = g.getEdge([n2, nbr]);
        newEdge.way = oldEdge.way;  // assign the old edge's way to the new edge
      }
    });

    // refresh the ways of n1
    n1.rediscoverWaysFromEdges();

    // reposition n1 toward n2
    n1.setCoordinates(midpoint(n1, n2));

    n2.delete();
    return true;
  }

  function midpoint (n1, n2) {
    return [
      (n1.getCoordinates()[0] + n2.getCoordinates()[0]) / 2,
      (n1.getCoordinates()[1] + n2.getCoordinates()[1]) / 2
    ];
  }

  sortedEdges = g.edges.sort(edgeLengthComparator);
  // need extra logic if we want to support freezing certain nodes (e.g. endnodes, wayends, borders, connectors)
  collapseEdge(sortedEdges[0]);
  return g;
};


// Ramer-Douglas-Peucker
Mutators.prototype.rpd = function(opts) {
  return false;
};



