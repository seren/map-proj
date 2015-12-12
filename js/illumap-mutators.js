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
    nodeCoord = nd.getCoordinates();
    if (nd.frozen) {
      newCoord[nd.id] = nodeCoord;
    } else {
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
   }
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
    if (nd.frozen) {
      newCoord[nd.id] = nodeCoord;
    } else {
      offset = [0,0];
      // get the neighbors and calc the offset
      nd.neighbors().forEach( function(nbr) {
        nbrCoord = nbr.getCoordinates();
        offset[0] += (nbrCoord[0] - nodeCoord[0]);
        offset[1] += (nbrCoord[1] - nodeCoord[1]);
      });
      newCoord[nd.id] = [nodeCoord[0] + (offset[0] * springForce),
                         nodeCoord[1] + (offset[1] * springForce)];
    }
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
    if (nd.frozen) {
      newCoord[nd.id] = nodeCoord;
    } else {
      offset = [0,0];

      // get the neighbors and calc the offset
      nd.neighbors().forEach( function(nbr) {
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
    }
  });
  // now update the nodes
  g.nodes().forEach( function(nd) {

var oldcoord = nd.getCoordinates();
if (newCoord[nd.id] === undefined) debugger;
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
    var v = e.getNodes()[0];
    var w = e.getNodes()[1];
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
    console.log('PM: collapsing edge ['+e.id+']');
    // debugger
    var n1Neighbors, n2Neighbors, neighborWays, newEdge,
        g = e.graph,
        n1 = e.getNodes()[0],
        n2 = e.getNodes()[1];
    // can't collapse if they're both frozen
    if (n1.frozen && n2.frozen) {
      console.log("PM: can't collapse. Both edges frozen.");
      return false;
    }
    // if one is frozen, make sure it's not n2
    if (n2.frozen) {
      console.log('PM: n2 frozen. Swapping...');
      n2 = e.getNodes()[0];
      n1 = e.getNodes()[1];
    }

    // move edges from n2 to n1
    n1Neighbors = n1.neighbors();
    n2Neighbors = n2.neighbors();

    console.log('PM: n2 has '+n2Neighbors.length+' neighbors (one is n1)');
    // for each n2 neighbor (nbr), if it doesn't already connect to n1, create an edge [nbr, n1]
    n2Neighbors.forEach(function(nbr) {
      if ((n1Neighbors.indexOf(nbr) == -1) && (nbr !== n1)) {
        console.log('PM: making new edge from n1 ('+n1.id+') to nbr ('+nbr.id+')');
        oldEdge = g.getEdge([n2, nbr]);
        if (oldEdge === undefined) debugger;
        // create new edge, preserving the old edge's way value
        console.log('n1,nbr edges before: '+n1._edges.length+','+nbr._edges.length);
        newEdge = g.addEdge([n1, nbr]);
        console.log('n1,nbr edges after: '+n1._edges.length+','+nbr._edges.length);
        oldEdge.way.addEdge(newEdge);  // assign the old edge's way to the new edge
        console.log('PM: created edge ['+newEdge.id+'] from old edge ['+oldEdge.id+'], wayid '+oldEdge.way.id);
        // remove the old edge
        console.log('PM: destroying old edge ['+oldEdge.id+']');
        oldEdge.destroy();
        console.log('n1,nbr edges after2: '+n1._edges.length+','+nbr._edges.length);
      }
    });

    // refresh the ways of n1
    n1.rediscoverWaysFromEdges();

    // reposition n1 toward n2
    n1.setCoordinates(midpoint(n1, n2));

    console.log('PM: destroy node: ['+n2.id+']');
    n2.destroy();
    // e.destroy(); // destroying n2 will destroy e

    n1.updateGraphAttributes();
    n1.neighbors().forEach(function(nbr) { nbr.updateGraphAttributes(); });

    return true;
  }

  function midpoint (n1, n2) {
    return [
      (n1.getCoordinates()[0] + n2.getCoordinates()[0]) / 2,
      (n1.getCoordinates()[1] + n2.getCoordinates()[1]) / 2
    ];
  }

  // try to collapse edges
  sortedEdges = g.edges().sort(edgeLengthComparator);
  var i = 0;
  var len = sortedEdges.length;
  while ( (i < len ) && (!collapseEdge(sortedEdges[i])) ) {
    console.log('PM: edge ['+sortedEdges[i].id+'] cannot be collapsed. Trying next...');
    i+=1;
  }
  return g;
};







// Ramer-Douglas-Peucker
Mutators.prototype.RDP = function(opts) {
  var g = opts.g,
      sortedEdges,
      ec,
      n;

  if (g.rdpStale) {
    generateRdpSequence(g);
    g.rdpStale = false;
  }
// debugger;
  if (g.rdpSequence.length === 0) { // if we have no more nodes we can eliminate, return
    return false;
  }
  n = g.rdpSequence.pop()
// could do n.getEdges, find the edge's index in the way
  // var newEdge = joinNeighbors(n);
  var neighbors = n.neighbors();
  if (neighbors.length !== 2) debugger; // our node should be in the middle of an array, so should have 2 neighbors
  var w = n.getEdges()[0].way;
  n.destroy();
  var newEdge = g.addEdge(neighbors);
  newEdge.way = w;
  w.addEdge(newEdge);
  w.orderEdges();
  newEdge.way.checkEdgesOrdered();
// debugger

  function joinNeighbors(n) {
    var ns = n.neighbors();
    var oldEdge = n.getEdges()[0];
    var w = oldEdge.way;

    var e = g.addEdge(ns);
    e.way = w;
    var i = w.edges.indexOf(oldEdge);
    // w.edges[i] = e;
    w.edges.push(e);
    // console.log('may throw debugger since we are replacing an edge that Way.removeEdge expects to be there');
    return e;
  }


  // Computers a modified RDP sequence to simplify map. Can be reused until map is modified with some other technique
  function generateRdpSequence (g) {

    var nodeRdpOrder = [];
    // reset nodes' error metrics
    Object.keys(g.xNodes).forEach(function (k) {g.xNodes[k].rdpMetric = undefined; } );
    // reset ways' sorted nodes list
    Object.keys(g.xWays).forEach(function (k) {g.xWays[k].nodesRdpSorted = undefined; } );
    // build array of ways containing nodes in retention order (highest to lowest)
    var orderedWayNodes = Object.keys(g.xWays).map(function (k) {
      var w = g.xWays[k];
      g.xWays[k].nodesRdpSorted = waySortRDPStyle( w.getOrderedNodes(), w );
      return g.xWays[k].nodesRdpSorted;
    });
    if (orderedWayNodes.flatten().containsDuplicates()) debugger; // Sanity check: there shouldn't be any duplicates
    // take all the arrays of sorted nodes, and merge them, maintaining the order of each array's nodes
    // if (true) {  // we cheat at the moment and...
      g.rdpSequence = orderedWayNodes.flatten().sort(rdpNodeComparator).reverse(); // ...just order everything by rdpMetric value
    // } else {
    //   var a1, a2;
    //   while (orderedWayNodes.length > 1) {
    //     a1 = [];
    //     a2 = [];
    //     do { a1 = orderedWayNodes.pop(); } while (a1.length === 0 && orderedWayNodes.length > 1); // find a non-empty sorted way
    //     do { a2 = orderedWayNodes.pop(); } while (a2.length === 0 && orderedWayNodes.length > 1); // find a non-empty sorted way
    //     orderedWayNodes.unshift(mergeArrays(a1,a2,rdpNodeComparator)); // add the merged arrays onto the end
    //   }
    //   g.rdpSequence = orderedWayNodes[0];
    // }

    // takes a series of connected nodes (e.g. a way) and returns a sequence for removing them to arrive at a simple line segment
    function waySortRDPStyle(path, w) {
      if (path.length < 3) {
        return [];  // can't simplify only two points
      } else {
        generateRdpMetrics(path, 0, path.length - 1, '', 0, w);
        return path.slice(1,-1).sort(rdpNodeComparator); // remove the first node since it can't be simplified (the algorithm already removed the fixed last node)
      }
    }

    // from http://stackoverflow.com/questions/22512532/d3-js-how-to-simplify-a-complex-path-using-a-custom-algorithm
    function generateRdpMetrics(path, first, last, name, depth, w) {
      var ii = first, // ii is index of the candidate point for removal
      max = -1,
      circular = false,
      d,
      pf, pfx, pfy,
      pl, plx, ply,
      p, qx, qy,
      nn, nx, ny,
      i,
      p1, p2;

      if (first + 1  < last) {
        console.log(name+' f: '+first+' l: '+last);
      } else {
        // If we only have two points left, return them
        console.log(name+' f: '+first+' l: '+last+' returning');
        return [path[first]];
      }

      // get the first and last points
      pf = path[first].getCoordinates();
      pfx = pf[0];
      pfy = pf[1];
      pl = path[last].getCoordinates();
      plx = pl[0];
      ply = pl[1];

      if (path[first] === path[last]) {
        console.log('circular way: first and last points are identical');
        circular = true;
      } else {
        if (Math.sqrt((pfx*plx) + (pfy*ply)) < 0.00001) {
          console.log('circular way: first and last points are almost at the same location');
          circular = true;
        }
      }
      // if path is circular, just find the point furthest away from the start
      if (circular) {
        for (i = first + 1; i < last; i++) {
          p = path[i].getCoordinates();
          qx = p[0] - pfx;
          qy = p[1] - pfy;
          d = Math.sqrt((qx*qx) + (qy*qy));
          if (d > max) {
console.log('new distance max found: '+d+' (point '+ii+', '+path[ii].id+')');
            max = d;
            ii = i;
          }
        }
      } else {
        // calculate the normal {nx, ny} on the line vector {dx, dy} between the first and last point
        dx = plx - pfx;
        dy = ply - pfy;
        nn = Math.sqrt(dx*dx + dy*dy);
        nx = -dy / nn;
        ny = dx / nn;

        for (i = first + 1; i < last; i++) {
          p = path[i].getCoordinates();
          qx = p[0] - pfx;
          qy = p[1] - pfy;

          d = Math.abs(qx * nx + qy * ny);
          if (d > max) {
console.log('new max found: '+d+' (point '+ii+', '+path[ii].id+')');
            max = d;
            ii = i;
          }
        }
      }
      path[ii].rdpMetric = max; // store the metric in the point, now that we found the max
console.log('metric saved: '+max+' (point '+ii+', '+path[ii].id+', endpoint: '+path[ii].endpoint+', intersection: '+path[ii].intersection+')');

      p1 = generateRdpMetrics(path, first, ii, name+'left,', depth+1, w);
      p2 = generateRdpMetrics(path, ii, last, name+'right,', depth+1, w);
    }

    function mergeArrays (a1,a2,comparator) {
      var t;
      var len1 = a1.length;
      var len2 = a2.length;
      var counter1 = 0;
      var counter2 = 0;
      var a3 = [];
      while ((counter1 < len1) && (counter2 < len2)) {
        switch (comparator(a1[counter1],a2[counter2])) {
          case 0: // metrics are the same
          case 1: // first metric is bigger than second
            a3.push(a1[counter1]);
            counter1 += 1;
            break;
          default: // first metric is smaller than second
            a3.push(a2[counter2]);
            counter2 += 1;
            break;
        }
      };
      // append the rest of the remaining array
      if (counter1 == len1) {
if (a3.concat(a2.slice(counter2)).indexOf(undefined) !== -1) debugger; // make sure we don't have undefined values in our new array
        return a3.concat(a2.slice(counter2));
      }
      if (counter2 == len2) {
if (a3.concat(a1.slice(counter1)).indexOf(undefined) !== -1) debugger; // make sure we don't have undefined values in our new array
        return a3.concat(a1.slice(counter1));
      }
      debugger // we shouldn't get here
    }


    // from https://gist.github.com/rhyolight/2846020
    function findPerpendicularDistance(point, line) {
        var pointX = point[0],
            pointY = point[1],
            lineStart = {
                x: line[0][0],
                y: line[0][1]
            },
            lineEnd = {
                x: line[1][0],
                y: line[1][1]
            },
            slope = (lineEnd.y - lineStart.y) / (lineEnd.x - lineStart.x),
            intercept = lineStart.y - (slope * lineStart.x),
            result;
        result = Math.abs(slope * pointX - pointY + intercept) / Math.sqrt(Math.pow(slope, 2) + 1);
        return result;
    }
    function rdpBuild () {

    }

    function rdpNodeComparator (a,b) {
if ((a === undefined) || (b === undefined)) debugger
      if (a.rdpMetric < b.rdpMetric)
        return -1;
      if (a.rdpMetric > b.rdpMetric)
        return 1;
      return 0;
    }



  }






};
