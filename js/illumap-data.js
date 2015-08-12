var illumap = (function() {
  // Module to store map data, a graph from it, and do all the manipulations
  this.data = function data() {

  var geojsonBucket = new GeojsonBucket('rawdata'),  // module that holds raw data
      source = 'server',
      // mutatedData = [],
      mutationSequence = [],  // list of changes performed on data
      mutators,
      mapg = new graphlib.Graph({ directed: false, multigraph: true }),
      graphStale = true,
      tangentsStale = true,  // used to trigger a pre-calculation of all tangents of edges (for decoration)
      mutatedFeatureList = {}, // we build our own geojson features list so that d3 can generate geo paths from it
      graphNodes = [],  // holds all nodes. node = {coordinates: [lat,lon], wayIds: [], features: [], coordinateIndices, endpoint}
      ways = [], // holds objects: {edges: [], nodes: []}
      highestWayId = 0,
      nodesToExplore = [], // used to record visited nodes when building ways
      coordinatesAdded = []; // temp variable for spotting duplicate coordinates
    // function coordinatesSame(a, b) {
    //   return ((a[0] === b[0]) && (a[1] === b[1]));
    // }
var featureNodes={}; //temp


    // id = coordinate array, value = custom hash with useful data
    function addNode(feature, coordinateIndex) {
      var coordinates = feature.geometry.coordinates[coordinateIndex];
      var coordUid = coordinates[0] + ',' + coordinates[1];
      var featureId = feature.id;
      var id = coordinatesAdded.indexOf(coordUid);
      if (id === -1) {
        id = graphNodes.length;
        coordinatesAdded.push(coordUid);
        console.log(coordUid);
        graphNodes[id] = new Node ({
          coordinates: coordinates.slice(),
          features: [feature],
          coordinateIndices: [coordinateIndex],
          endpoint: false,
          intersection: false,
          wayEnd: false,
          wayIds: [],
          tangentVector: [],
          tangentStale: true
        });
        mapg.setNode(id);
      } else {
console.log('addNode id:'+id);
        graphNodes[id].features.push(feature);
        graphNodes[id].coordinateIndices.push(coordinateIndex);
      }

// temp debugging
if (featureNodes[feature.id] === undefined) {
  featureNodes[feature.id] = [id];
} else {
  featureNodes[feature.id].push(id);
}
      return id;
    }  // end addNode



    // graph nodes: id:(lat-lon) val:(ref to feature coordinates and feature)
    // have to copy features, since we'll be modifying the contents and don't want to affect the original
    // ignore feature/way ids; make our own ids. combine all overlapping points and create ways at junctions of degree >2
    var buildGraph = function buildGraph() {
      while (graphStale) {
        graphStale = false;
      // if (graphStale === true) {
      //   console.log('graph is out of date. rebuilding from geojson');
      // }

        // is this scope correct? will ways and graphNodes ref global or function vars?
        ways.length = 0; // reset ways (lines of coordinates between endpoints or intersections)
        graphNodes.length = 0;
        coordinatesAdded.length = 0;

        var nodeId;
        var features = geojsonBucket.getFeaturesClone();
        features.forEach( function(feature) {
          var geometryType = feature.geometry.type;
          if (geometryType === 'LineString') {
            var featureCoordinates = feature.geometry.coordinates;
              prevNodeId = addNode(feature, 0);
              for (var i = 0, len = featureCoordinates.length; i < len - 1 ; i++) {
                currNodeId = addNode(feature, i+1);
                mapg.setEdge(prevNodeId, currNodeId, {}); // way-finding builds: {way: feature.id, length: len});
                console.log('graph: added edge from featureId:index: ' + feature.id + ':' + i + ' c1: ' + prevNodeId + ' c2: ' + currNodeId);
                prevNodeId = currNodeId;
              }
          } else {
              console.log("skipping feature " + feature.id + ". Can't handle geometry type: " + feature.geometry.type);
          }
        });

        // build way list and find the end-nodes, itersection nodes, etc

        var markEndpoint = function markEndpoint(n) {
          console.log('marking endpoint: ' + n);
  if (graphNodes[n] === undefined) { debugger; }
          graphNodes[n].endpoint = true;
          // mapg.node(n)['endpoint'] = true;
        };
        var markIntersection = function markIntersection(n) {
          console.log('marking intersection: ' + n);
          graphNodes[n].intersection = true;
          // mapg.node(n)['intersection'] = true;
        };

        // remove orphan nodes, and mark the intersection and endpoints
        console.log('marking endpoints and removing orphans');
        mapg.nodes().toInt().forEach( function(n) {
          switch (mapg.nodeEdges(n).length) {
            case 0:
              console.log('deleting orphan node ' + n);
              mapg.removeNode(n);
              break;
            case 1:
              markEndpoint(n);
              break;
            case 2:
              // skip
              break;
            default:
              markEndpoint(n);
              markIntersection(n);
              break;
          }
        });
  // debugger
        buildAllWays();
      }

    };

    function findWayFromEdge(e) {


      // Return nodes, not including the starting node, between start and closest endpoint in one direction
      function getNodesUntilEndpoint(startNode, currNode, debugDirection) {
console.log(debugDirection +'about to traverse, startNode='+startNode+' currNode='+currNode);
        var path=[currNode];
        var prevNode = startNode;
        var nextNode;
        var direction;
        while (graphNodes[currNode].endpoint === false) {
          // get the 2 (because it's not an endpoint) neighbors, remove the visited-node, and get the remaining node
          nextNode = mapg.neighbors(currNode).toInt().removeByValue(prevNode)[0];
console.log('traversing path ['+path+']. prevNode:'+prevNode+' currNode:'+currNode+' nextNode:'+nextNode+'(this is added to the path)');
          path.push(nextNode);
          prevNode = currNode;
          currNode = nextNode;
        }
console.log('returning path: ['+path.join(',')+']');
        return path;
      }

      var v = parseInt(e.v);
      var w = parseInt(e.w);
      var path=[v];
      var reversePath=[];
      var forwardPath=[];
      if (graphNodes[v].endpoint) {
        path = path.concat(getNodesUntilEndpoint(v, w,'from-end: '));
      } else {
        forwardPath = getNodesUntilEndpoint(v, parseInt(mapg.neighbors(v)[0]),'forward: ');
        reversePath = getNodesUntilEndpoint(v, parseInt(mapg.neighbors(v)[1]),'backward: ').reverse();
        path = reversePath.concat(path, forwardPath);
      }
console.log('full path: ['+path.join(',') +']');
      return path;
    }



    // take a node, get its ways, remove the points from the global list, repeat
    function buildAllWays() {
      var n, wayPath, newWayId, oldEdgeCount;
      // create temporary copy of graph for us to keep track of what edges we've visited
      var g = graphlib.json.read(graphlib.json.write(mapg));

oldEdgeCount = g.edgeCount();
      while (g.edgeCount() > 0) {
        newWayId = highestWayId;
        highestWayId += 1;
        e = g.edges()[0];
        wayPath = findWayFromEdge(e);
        ways[newWayId] = wayPath.slice();
// if ( newWayId === 218 ) { debugger; }
        // add the way id to each node, and remove the node from the search list
        wayPath.forEach( function wayPathAddAndNodePrune(n,i) {
          graphNodes[n].wayIds.push(newWayId);
          if (i > 0) {  // skip the first node since we have one fewer edges than nodes/way-points
            // record way in path
            mapg.setEdge(wayPath[i-1], n, {wayId: newWayId});

            console.log('removing edge: ['+[wayPath[i-1],n].join(',')+']');

            // debugging
            if (g.hasEdge(wayPath[i-1], n) === false) {
              console.log('no edge: ['+[wayPath[i-1], n].join(',')+']');
              debugger;
            }

            // we use toString because hasEdge doesn't handle integer IDs consistently. https://github.com/cpettitt/graphlib/issues/47
            // g.removeEdge(wayPath[i-1].toString(),n.toString());
            g.removeEdge(wayPath[i-1], n);
          }
        });
console.log('----');
// sanity check to prevent an infinite loop
if (oldEdgeCount === g.edgeCount()) {
  console.log('infinite loop detected');
  debugger;
}
oldEdgeCount = g.edgeCount();
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
        illumap.graphics.svgDraw();
        // illumap.graphics.requestRedraw();
      }
    };

    var mutateGeneric = function mutateGeneric(opts) {
      if (graphStale || (mapg.nodeCount < 1)) {
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
      mapg = mutators[opts.mutationType]({
        'g':mapg,
        "graphNodes":graphNodes,
        "ways":ways,
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

    function edgeNodesCoordinates(e) {
      return [graphNodes[e.v].getCoordinates(), graphNodes[e.w].getCoordinates()];
    }


    var pathsFromEdges = function pathsFromEdges() {
      var linestring = function(e) {
        return {
          coordinates: edgeNodesCoordinates(e),
          type: "LineString",
          id: mapg.edge(e).wayId
        };
      };
      return mapg.edges().map(linestring);
    };

    var loadGeojsonFromLocal = function loadGeojsonFromLocal() {
      illumap.loadTileCache();
      geojsonBucket.reset();
      geojsonBucket.loadFromDisk();
      buildGraph();
    };

    function geometryFromWay(w, i) {
      var coordinates = w.map( function(n) {
        return graphNodes[n].getCoordinates();
      });
      return {coordinates: coordinates, type: "LineString", id: i};
    };


// out-dated and wrong. shouldn't use features any more
    // returns a list of all unique features (key-values: feature-id -> feature)
    var featureListFromGraph = function featureListFromGraph(g) {
      var features = {};
      var feature;
      mapg.nodes().toInt().forEach( function (n) {
console.log(n);
        feature = graphNodes[n].features[0];
        // feature = mapg.node(n).feature;
        if (features[feature.id] === undefined) {
          features[feature.id] = feature;
        }
      });
      console.log('nodes: '+mapg.nodes().length+', unique feature-count: '+illumap.utility.objToArray(features).length);
      return features;
    };


    var loadTestGeojsonData = function loadTestGeojsonData() {
      // pretty print: http://jsonformatter.curiousconcept.com/
      geojsonBucket.reset();
      geojsonBucket.load(JSON.parse(illumap.testdata.fullraw));
      buildGraph();
    };

    var loadGeojson = function loadGeojson () {
      switch (source) {
        case "server":
          loadGeojsonFromServer();
          break;
        case "local":
          loadGeojsonFromLocal();
          break;
        case "test":
          loadTestGeojsonData();
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
      mapg: mapg,
      loadTileFromServer: loadTileFromServer,
      pathsFromEdges: pathsFromEdges,
      mutateGeneric: mutateGeneric,
      replayMutations: replayMutations,
      featureListFromGraph: featureListFromGraph,
      // graphNodes: function() { return graphNodes; },
      // ways: function() { return ways; },
      graphNodes: graphNodes,
      ways: ways,
      source: source,
      loadGeojson: loadGeojson,
featureNodes: function() { return featureNodes; },

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
      getMutatedPaths: function getMutatedPaths() {
        console.log('loading mutated paths from graph');
        if (graphStale === true) { buildGraph(); }
        var paths = [];
        //todo
        // fix ways
        //return paths
        return ways.map(geometryFromWay);
      },

// old and should be removed
      getMutatedData: function getMutatedData() {
        console.log('loading mutated data from graph');
        if (graphStale === true) { buildGraph(); }
        // unfortunately I don't know how to get d3.geo.path to use straight up coordinate arrays rather than json feature sets
        // just return an array of edges
        // return mapg.edges().map( function (e) {
        //   return [e.v.split(','),e.w.split(',')];
        // });
        // return an array of features in the graph
        return illumap.utility.objToArray(featureListFromGraph(mapg));
      },

      mutate: function mutate() {
        var arr = geojsonBucket.array();
        var randomNode = arr[getRandomInt(0, arr.length)];
        geojsonBucket.remove(randomNode);
        console.log('mutated by removing ' + del.id + '. ' + geojsonBucket.length() + ' paths remain');
      },

      prune: function prune() {
        var p = mutatedData.pop();
        var action = {
          pruned: p
        };
        mutationSequence.concat(action);
        console.log('pruned ' + p);
        console.log('remaining ' + mutatedData);
      },

      // used when restarting the mutation process. resets everything except tile caches and geojsonbucket
      reset: function reset() {
        mutators = new Mutators();
        // mutationSequence.length = 0;
        highestWayId = 0;
        ways.length = 0;
        graphNodes.length = 0;
        coordinatesAdded.length = 0;
        mapg.nodes().forEach(function (n) {mapg.removeNode(n); }); // reset graph without recreating
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

      geojsonFromWays: function geojsonFromWays (waysArray) {
        waysArray = (waysArray === undefined) ? [128, 127, 209, 61, 129] : waysArray; // use a sample array if need be
        json = waysArray.reduce(function(prev, w) {
          prev[w]={
            'geometry': geometryFromWay(illumap.data.ways[w], w),
            'type': 'Feature',
            'properties': {
              'sort_key': 1
            }
          };
          return prev;
        }, {});
        return JSON.stringify(json);
      }



    }; //  end return


  }();
  return this;

}).apply(illumap);
