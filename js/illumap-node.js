var Node = function(args) {
  var self = this;
  this.id = (args.id === undefined) ? '0' : args.id;
  var n = this.id.split(',').reduce(
      function(prev,curr){ return prev + parseFloat(curr); },0); // add the lat and lon values and covert to int for a quasi-uid
  this.numericId = parseInt( n * Math.pow(10, illumap.utility.floatPrecision(n)) );
  this.features = (args.features === undefined) ? [] : args.features;
  this.endpoint = (args.endpoint === undefined) ? false : args.endpoint;
  this.intersection = (args.intersection === undefined) ? false : args.intersection;
  this.ways = (args.ways === undefined) ? [] : args.ways; // array of way objects
  this._edges = (args.edges === undefined) ? [] : args.edges;
  this._coordinates = (args.coordinates === undefined) ? [] : args.coordinates;
  this.graph = args.graph;
  this.rdpMetric = undefined;
  this.frozen = false;

  if (this.graph === undefined) debugger;

  // returns a hash of the id. much easier to read when debugging
  this.prettyId = function prettyId() {
    // from http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
    function hashCode(str){
      var hash = 0;
      if (str.length == 0) return hash;
      for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash).toString(16);
    }
    self._prettyId = self._prettyId || hashCode(self.id); // cache result if not already calculated
    return self._prettyId;
  }

  this.getEdges = function getEdges() {
    return self._edges;
  };

  this.addEdge = function addEdge(e) {
    self._edges.push(e);
    return self;
  };

  this.removeEdge = function removeEdge(e) {
    self._edges.removeByValue(e);
    // if the node has no more edges, remove it too
    console.log('edge ['+e.id+'] removed from node ['+self.id+']. '+self._edges.length+' edges remaining on node');
    if (self._edges.length === 0) {
      console.log('node '+self.id+' has no more edges. Destroying it');
      self.destroy();
      return self;
    }
    return self;
  };

  this.neighbors = function neighbors() {
    function isntMe (otherNode) {
      return (self !== otherNode);
    }
    return self._edges.map( function (e) {
      var otherNodes = e.getNodes().filter(isntMe);
      // Sanity check. Each edge should only have 2 nodes, so length should be 1 after filtering away one.
      if (otherNodes.length !== 1) { debugger; }
      return otherNodes[0];
    });
  };

  // i don't think nodes should track ways. they can derive them from their edges if necessary
  // OTH, we need to track ways so that when we're deleted, we can remove ourselves from the correct ways. sigh
  // to deprecate
  this.addWay = function addWay(way) {
    if (self.ways.indexOf(way) === -1) self.ways.push(way);
    return self;
  };

  this.deleteWay = function deleteWay(way) {
    if (self.ways.indexOf(way) === -1) debugger; // sanity check for to catch removing a non-member way
    self.ways.deleteByValue(way);
    return self;
  };

  // remove node from edges and master graph. ways don't track nodes, so don't need to deal with them
  this.destroy = function destroy() {
    // sanity check to prevent loops
    if (self.graph.xNodes[self.id] === undefined) {
      console.log('node ['+self.id+'] already destroyed (or currently being destroyed)');
    } else {
      // delete this node from the master list
      if (self.graph.xNodes[self.id] === undefined) {
        console.log("node '"+self.id+"' doesn't exist in graph's list");
        debugger;
      }
      console.log('deleting node ['+self.id+'] from graph master list');
      delete self.graph.xNodes[self.id];
      console.log('destroying '+self._edges.length+' edges for node ['+self.id+']: ['+self._edges.map(function(x) { return x.id; }).join('],[')+']');
      // delete edges that the node is a member of, since edges have to have 2 points
      // (can't use forEach since the e.delete alters the _edges array while we're using it)
      for (var i = self._edges.length - 1; i >= 0; i--) {
        self._edges[i].destroy();
      };
    }
    return true;
  };

  this.getCoordinates = function getCoordinates() {
    return self._coordinates.slice();
  };

  this.setCoordinates = function setCoordinates(newCoords) {
    self._coordinates = newCoords.slice();
    return self;
  };

// Node.prototype.neighbors = function() {
//   function isntMe (otherNode) {
//     return (self !== otherNode);
//   }
// // context problems. this is referring to the global object again.
// debugger
//   return self.edges.map( function (e) {
//     var a = e.nodes.filter(isntMe)[0];
//     // Sanity check. Each edge should only have 2 nodes, so length should be 1 after filtering away one.
//     if (a.length !== 1) { debugger; }
//     return a;
//   });
// };

  this.isNeighbor = function isNeighbor(n) {
    if (self.neighbors.indexOf(n) === -1) {
      return false;
    } else {
      return true;
    }
  };

  this.getEdgeWithNode = function getEdgeWithNode(otherNode) {
    function union(arr1, arr2) {
      return arr1.filter(function(n) {
          return (arr2.indexOf(n) != -1);
      });
    }
    // Find the edge that's common to both nodes
    var edge = union(self._edges, otherNode.getEdges());
    // Sanity check
    if (edge.length > 1) debugger;
    return edge[0];
  };


  this.rediscoverWaysFromEdges = function rediscoverWaysFromEdges() {
    self.ways.length = 0;
    self._edges.forEach( function(e) {
      self.addWay(e.way);
    });
  };

  this.updateGraphAttributes = function updateGraphAttributes() {
    switch (self._edges.length) {
      case 0:
        console.log('deleting orphan node ' + self.id);
        self.destroy();
        break;
      case 1:
        self.endpoint = true;
        self.intersection = false;
        break;
      case 2:
        self.endpoint = false;
        self.intersection = false;
        break;
      default:  // more than 2
        self.endpoint = true;
        self.intersection = true;
        break;
    }
    self.frozen = self.isFrozen();
  }

  this.isFrozen = function isFrozen() {
    function nodeTypeMatchesFrozenType(k) {
      if (self[k] === undefined) { throw("Our global frozen setting contain a setting that our node doesn't have: '"+k+"'"); }
      return (illumap.frozen[k] && self[k]);
    }
    return Object.keys(illumap.frozen).some(nodeTypeMatchesFrozenType);
  }

};
