var illumap = (function() {
  // Module to store map data, a graph from it, and do all the manipulations
  this.data = function data() {

  var geojsonBucket = new GeojsonBucket('rawdata'),  // module that holds raw data
      source = 'server',
      // mutatedData = [],
      mutationSequence = [],  // list of changes performed on data
      mutators,
      mgraph = new Graph(),
      graphStale = true,
      tangentsStale = true,  // used to trigger a pre-calculation of all tangents of edges (for decoration)
      mutatedFeatureList = {}, // we build our own geojson features list so that d3 can generate geo paths from it
      graphNodes = [],  // holds all nodes. node = {coordinates: [lat,lon], wayIds: [], features: [], endpoint}  //deprecated
      ways = [], // holds way objects: {edges: [], nodes: []}
      highestWayId = 0,
      nodesToExplore = []; // used to record visited nodes when building ways
    // function coordinatesSame(a, b) {
    //   return ((a[0] === b[0]) && (a[1] === b[1]));
    // }

    // creates node and way (if necessary)
    function addNode(feature, coordinateIndex) {
      var coordinates = feature.geometry.coordinates[coordinateIndex];

      // do ways and features map one-to-one? No. Determine Way later
      var nodeId = coordinates[0] + ',' + coordinates[1];
      var node = mgraph.node(nodeId);
      if (node === undefined) {
        console.log(nodeId);
        node = mgraph.addNode(nodeId);
        node.setCoordinates(coordinates);
        node.features = [feature];
        node.endpoint = false;
        node.intersection = false;
        node.wayEnd = false;
      } else {
        console.log('addNode id:'+nodeId);
        node.features.push(feature);
      }
      return node;
    }



    // Builds a graphlib graph from the geojson features
    // graph nodes: id:(lat-lon) val:(ref to feature coordinates and feature)
    // ignore feature/way ids; make our own ids. combine all overlapping points and create ways at junctions of degree >2
    var buildGraph = function buildGraph() {
      while (graphStale) {
        graphStale = false;
      // if (graphStale === true) {
      //   console.log('graph is out of date. rebuilding from geojson');
      // }

        mgraph.reset();

        // have to copy features, since we'll be modifying the contents and don't want to affect the original
        var features = geojsonBucket.getFeaturesClone();
        features.forEach( function(feature) {
          var geometryType = feature.geometry.type;
          if (geometryType === 'LineString') {
            var featureCoordinates = feature.geometry.coordinates;
              prevNode = addNode(feature, 0);
              for (var i = 0, len = featureCoordinates.length; i < len - 1 ; i++) {
                currNode = addNode(feature, i+1);
                mgraph.addEdge([prevNode, currNode]);
                console.log('graph: added edge from featureId:index: ' + feature.id + ':' + i + ' c1: ' + prevNode.id + ' c2: ' + currNode.id);
                prevNode = currNode;
              }
          } else {
              console.log("skipping feature " + feature.id + ". Can't handle geometry type: " + feature.geometry.type);
          }
        });

        // remove orphan nodes, and mark the intersection and endpoints
        console.log('marking endpoints and removing orphans');
        mgraph.nodes().forEach( function(n) {
          switch (n.getEdges().length) {
            case 0:
              console.log('deleting orphan node ' + n);
              n.destroy();
              break;
            case 1:
              n.endpoint = true;
              break;
            case 2:
              // skip
              break;
            default:
              n.endpoint = true;
              n.intersection = true;
              break;
          }
        });
  // debugger
        buildAllWays();
      }

    };


    function findWayNodesFromEdge(e) {
      // Return nodes, not including the starting node, between start and closest endpoint in one direction
      function getNodesUntilEndpoint(startNode, currNode, debugDirection) {
console.log(debugDirection +'about to traverse, startNode='+startNode+' currNode='+currNode);
        var path=[currNode];
        var prevNode = startNode;
        var nextNode;
        var direction;
        while ((currNode.endpoint === false) && (currNode.intersection === false)) {
          // get the 2 (because it's not an endpoint) neighbors, remove the visited-node, and get the remaining node
          nextNode = currNode.neighbors.filter( function (n) { return (prevNode !== n); } )[0];
console.log('traversing path ['+path+']. prevNode:'+prevNode.id+' currNode:'+currNode.id+' nextNode:'+nextNode.id+'(this is added to the path)');
          path.push(nextNode);
          prevNode = currNode;
          currNode = nextNode;
        }
console.log('returning path: ['+path.join(',')+']');
        return path;
      }

      var v,w = e.getNodes();
      var path=[v];
      var reversePath=[];
      var forwardPath=[];
      if (v.endpoint || v.intersection) {
        path = path.concat(getNodesUntilEndpoint(v, w,'from-end: '));
      } else {
        forwardPath = getNodesUntilEndpoint(v, v.neighbors[0],'forward: ');
        reversePath = getNodesUntilEndpoint(v, v.neighbors[1],'backward: ').reverse();
        path = reversePath.concat(path, forwardPath);
      }
console.log('full path: ['+path.join(',') +']');
      return path;
    }


    function findWayEdgesFromEdge(e) {
      // Return nodes, not including the starting node, between start and closest endpoint in one direction
      function getEdgesUntilEndpoint(startNode, startEdge, debugDirection) {
console.log(debugDirection +'about to traverse, startNode='+startNode+' currNode='+currNode);
        var pathEdges = [];
        var pathNodes = [];
        var prevNode = startNode;
        var nextNode;
        var direction;
        var currNode = startEdge.otherNode(startNode);
        pathNodes.push(currNode); // save the nodes for possible future use
        // start collecting pathEdges, starting with the next edge from the one we were given
        while ((currNode.endpoint === false) && (currNode.intersection === false)) {
          nextNode = currEdge.otherNode(currNode);
          nextEdge = currNode.getEdgeWithNode(nextNode);
          pathEdges.push(nextEdge);
          pathNodes.push(nextNode); // save the nodes for possible future use
          currEdge = nextEdge;
          currNode = nextNode;
console.log('traversing path ['+pathNodes+']. currNode:'+currNode.id+' nextNode:'+nextNode.id+'(this is added to the path)');
        }
        return pathEdges;
      }

      var n1 = e.getNodes()[0];
      var n2 = e.getNodes()[1];
      var pathEdges=[e];
      var reversePathEdges=[];
      var forwardPathEdges=[];
      if (n1.endpoint || n1.intersection) {
        pathEdges = pathEdges.concat(getEdgesUntilEndpoint(n1, e,'from-end: '));
      } else {
        forwardPath = getEdgesUntilEndpoint(n1, e,'forward: ');
        reversePath = getEdgesUntilEndpoint(n2, e,'backward: ').reverse();
        edgePath = reversePath.concat(pathEdges, forwardPath);
      }
console.log('full path: ['+pathEdges.join(',') +']');
      return pathEdges;
    }



    // take a node, find its ways by traversal, remove the points from the global list, repeat
    function buildAllWays() {
      // Do we need to build ways manually?
      // Yes. Assumption: Features are not like ways. Features may intersect other features, which leaves intersection nodes (such as a T-junction)
      //  in the middle. Ways never have intersections in the middle.
      // take a node
      // if it has two edges, for each edge traverse until hitting an intersection or endpoint. assign the same wayids to both traversals
      // if it has != two edges, for each edge traverse until hitting an intersection or endpoint. assign different wayids to each traversal

      // steps:
      // take an edge
      // follow it's neighboring edges in each direction if (and while) there is only one other edge attached in that direction

      mgraph.resetWays();

      var remainingNodes = mgraph.nodes();
      var remainingEdges = mgraph.edges();
      var n,e,w;
      // loop over all the edges, finding connected edges and saving them into ways
      while (remainingEdges.length > 0) {
        oldEdgeCount = remainingEdges.length;
        e = remainingEdges[0];
        wayEdges = findWayEdgesFromEdge(e);
        w = mgraph.addWay({edgeArray: wayEdges});
        wayEdges.forEach( function (e) {
          // remove the edge from the search list
          remainingEdges.removeByValue(e);
        });
        // sanity check to prevent an infinite loop
        if (oldEdgeCount === remainingEdges.length) {
          console.log('infinite loop detected');
          debugger;
        }
      }
      graphStale = false;
    }

    var replayMutations = function replayMutations() {
// debugger
      for (var i=0,  len=mutationSequence.length; i < len; i++) {
        console.log('applying mutation: '+mutationSequence[i].type);
        mutateGeneric({
          mutationType: mutationSequence[i].type,
          repulsionPoint: mutationSequence[i].repulsionPoint,
          addToReplay: false
        });
        // illumap.graphics.svgDraw();
        // illumap.graphics.requestRedraw();
      }
    };

    var mutateGeneric = function mutateGeneric(opts) {
      if (graphStale || (mgraph.nodes().length < 1)) {
        buildGraph();
      }
      if (mutators === undefined) {
        mutators = new Mutators();
      }
      if (mutators[opts.mutationType] === undefined) {
        throw('there is no mutation type: "'+opts.mutationType);
      }
      log('mutateGeneric: '+opts.mutationType);
      // mutate the graph
      mutators[opts.mutationType]({
        'g':mgraph,
        "repulsionPoint":opts.repulsionPoint
      });
      if (opts.addToReplay !== false) {
        mutationSequence.push({
          'type':opts.mutationType,
          'repulsionPoint':opts.repulsionPoint
          });
      }
    };

    // loads tiles in current view and adds the geojson to our data store
    var loadGeojsonFromServer = function loadGeojsonFromServer() {
      geojsonBucket.reset();
      illumap.d3tiler    // Generates tile coordinates in current view
        .scale(illumap.d3projection.scale() * 2 * Math.PI)
        .translate(illumap.d3projection([0, 0]))()
        .forEach(loadTileFromServer);
      buildGraph();
    };

    var loadTileFromServer = function loadTileFromServer (t) {
console.log("running loadTileFromServer");
// debugger
      var tid = illumap.tileId(t);
      console.log('need to get tile ' + tid);
      var tileserver = "http://" + ["a", "b", "c"][(t[0] * 31 + t[1]) % 3] + ".tile.openstreetmap.us";
      var tileurlpaths = ["/vectiles-highroad/" + t[2] + "/" + t[0] + "/" + t[1] + ".json",
                       "/vectiles-water-areas/" + t[2] + "/" + t[0] + "/" + t[1] + ".json"];
      tileurlpaths.forEach(function(tileurlpath) {
        // if (illumap.tileCache[tileurlpath]) {
        if (illumap.tileCache[tid]) {
          console.log('found tile '+tileurlpath+' in cache');
          updateBucket(illumap.tileCache[tileurlpath]);
        } else {

// // TODO: new work flow to handle asynchronous downloads and rebuilds
// increment counter
// async download:
  // if !failed
  //   add data to tempstore
//   decrement counter
//   if counter = 0
//     reset timesincelastrebuild
//     call Doit
//   if counter > 0
//     if timesincelastrebuild < 12?
//       increment timesincelastrebuild
//     else
//       reset timesincelastrebuild
//       Doit
//   if counter < 0
//     error

// Doit:
//   merge tempstore with datastore
//   trigger rebuild
//   trigger redraw


 console.log('openstreetmap vectices currently unavailable');
          // d3.json( tileserver + tileurlpath , function(error, json) {  // this is asynchronous
          //   if (json) {
          //     json.features.sort(function(a, b) { return a.properties.sort_key - b.properties.sort_key; }); // sort it so our join-by-index is consistent
          //     illumap.tileCache[tileurlpath] = json;
          //     localStorage.setObject('tileCache', illumap.tileCache);
          //     // 'json' is a FeatureCollection object containing an array of Feature objects
          //     updateBucket(json);
          //     console.log('retrieved tile ' + tid + ', features: ' + json.features.length);
          //   } else {
          //     console.log("Couldn't retrieve tile " + tid + ". Error: " + error.status + " " + error.text);
          //   }
          // });
        }
      });
    };

    function updateBucket (json) {
      json.forEach(function(f) { // for each feature
        geojsonBucket.add(f);
      });
      graphStale = true;
      illumap.graphics.requestRedraw();
    }

    var loadGeojsonFromLocal = function loadGeojsonFromLocal() {
      illumap.loadTileCache();
      geojsonBucket.reset();
      geojsonBucket.loadFromDisk();
      buildGraph();
    };

    // coordinates: [[1,2],[3,4],[5,6]]
    // produces a geojson-like feature from an array of coordinate arrays. used for d3 path generation.
    var featureFromNodes = function featureFromNodes(nodes, id) {
      id = (id === undefined) ? 0 : id;
      var coordinates = nodes.map( function(n) {
        return n.getCoordinates();
      });
      return {
        // type: "Feature",
        id: id,
        nodes: nodes,
        properties: {
          sort_key: -6
        },
        geometry: {
          coordinates: coordinates,
          type: "LineString",
          id: id
        }
      };
    };

    var loadTestGeojsonData = function loadTestGeojsonData(testType) {
      // pretty print: http://jsonformatter.curiousconcept.com/
      geojsonBucket.reset();
      geojsonBucket.load(JSON.parse(illumap.testdata[testType]));
      buildGraph();
    };

    var loadGeojson = function loadGeojson () {
      switch (source[0]) {
        case "server":
          loadGeojsonFromServer();
          break;
        case "local":
          loadGeojsonFromLocal();
          break;
        case "test":
          loadTestGeojsonData(source[1]);
          break;
        default:
          loadGeojsonFromLocal();
          if (geojsonBucket.length === 0) {
            console.log("Couldn't load data from disk. Loading from server");
            loadGeojsonFromServer();
          }
        }
      console.log("data inited. loaded from " + source);
    };



    // 'data' return
    return {
      buildGraph: buildGraph,
      geojsonBucket: geojsonBucket,  // module that holds features in current view (should we directly modify contents, or feed into something else?)
      mutationSequence: mutationSequence,  // list of changes performed on data
      loadTileFromServer: loadTileFromServer,
      mutateGeneric: mutateGeneric,
      replayMutations: replayMutations,
      graphNodes: graphNodes, //deprecated
      ways: ways,
      source: source,
      loadGeojson: loadGeojson,
      mgraph: mgraph,

      init: function init() {
        console.log('initing data');
        // var defaults = {source: 'local'};
        // var defaults = {};
        // var opts = illumap.utility.merge(defaults, (arguments[0] || {}));
        var opts = (arguments[0] || {});
        if (opts.source) {
          source = opts.source;
        }
        loadGeojson();
        buildGraph();
      },

      debug: function () {
        debugger;
      },

      // returns geojsonBucket as array
      getRawData: function getRawData() {
        return geojsonBucket.getFeatures();
      },

      // returns graph data in a collection of feature-geometry-style objects: {coordinates: ['10','20','30'], type: "LineString"}
      getEdges: function getEdges() {
        if (graphStale === true) { buildGraph(); }
        var featureFromEdge = function (e) {
          return featureFromNodes(e.getNodes(),e.numericId);
        };
        return mgraph.edges().map(featureFromEdge);
      },

      // used when restarting the mutation process. resets everything except tile caches and geojsonbucket
      reset: function reset() {
        mutators = new Mutators();
        // mutationSequence.length = 0;
        highestWayId = 0;
        ways.length = 0;
        graphNodes.length = 0;
        mgraph.reset();
        graphStale = true;
        console.log('reset data');
      },

      resetDataCaches: function resetDataCaches() {
        illumap.tileCache = {};
        geojsonbucket.reset();
        this.reset();
      },

      reload: function reload() {
        loadGeojsonFromServer();
        console.log('Reloading data from server');
      },

      undo: function undo(stepsToUndo) {
        console.log('Undoing '+stepsToUndo+' steps');
        mutationSequence.length = Math.max(0, mutationSequence.length - stepsToUndo);
        this.reset();
        replayMutations();
      },




    }; //  end return


  }();
  return this;

}).apply(illumap);
