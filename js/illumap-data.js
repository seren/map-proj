var illumap = (function() {
  // Module to store map data, a graph from it, and do all the manipulations
  this.data = function data() {

  var geojsonBucket = new GeojsonBucket('rawdata'),  // module that holds raw data
      // mutatedData = [],
      mutationSequence = [],  // list of changes performed on data
      mapg = new graphlib.Graph({ directed: false, multigraph: true }),
      graphStale = true;

    function nodeId(feature, coordinateIndex) {
// debugger
      var coordinate = feature.geometry.coordinates[coordinateIndex];
      return feature.id + ':' + coordinateIndex + ':' + coordinate[0] + ',' + coordinate[1];
    }

    function addNode(feature, coordinateIndex) {
      var featureId = feature.id;
      var id = nodeId(feature, coordinateIndex);
console.log(id);
      if (!mapg.hasNode(id)) {
        mapg.setNode(id, {feature: feature, coordinateIndex: coordinateIndex, coordinates: feature.geometry.coordinates[coordinateIndex]});
      }
    }

    // graph nodes: id:(lat-lon) val:(ref to feature coordinates and feature)
    // have to copy features, since we'll be modifying the contents and don't want to affect the original
    var buildGraph = function buildGraph() {
      if (graphStale === true) {
        console.log('graph is out of date. rebuilding from geojson');
      }
      // debugger
      var features = geojsonBucket.getFeaturesClone();
      features.forEach( function(feature) {
        var geometryType = feature.geometry.type;
        if (geometryType === 'LineString') {
          var coordinates = feature.geometry.coordinates;
          addNode(feature, 0);
          for (var i = 0, len = coordinates.length; i < len - 1 ; i++) {
            addNode(feature, i+1);
            mapg.setEdge(nodeId(feature, i), nodeId(feature, i+1), {way: feature.id, length: len});
            console.log('graph: added edge, featureId:index: ' + feature.id + ':' + i + ' c1: ' + nodeId(feature, i) + ' c2: ' + nodeId(feature, i+1));
          }
        } else {
          console.log("skipping feature " + feature.id + ". Can't handle geometry type: " + feature.geometry.type);
        }
      });
      // given an edge, return all the edges between endpoints
// find endpoint
//  if starting point is endpoint, pick the first neighbor
//  if starting point in midpoint, run in both directions, then reverse one and concat
// track all points in order until one is an endpoint

      function findWayFromNode(n) {
        var nodesInWay = [n]
        var pointsToFollow = [n];
        var endpoints = [];
        var neighbors, p;
        var enqueueNode = function(n) {
          (mapg.node(n).endpoint) ? pointsToFollow.push(n) : endpoints.push(n);
        }
        var addWayToNode = function(way, n) {
          mapg.node(n)[ways].push(way);
        }
        // if we start on an intersection, choose just one path
        var nbrs = mapg.neighbors(n);
        if (nbrs.length > 2) {
          console.log('findWayFromNode: we started on an intersection. just exploring the edge to '+nbrs[0]);
          pointsToFollow = [];  // remove so that we don't try to process all the connected points
          endpoints.push(n)
          enqueueNode(nbrs[0]);
        }
        while (pointsToFollow.length > 0) {
          p = pointsToFollow.pop;
          mapg.neighbors(n).forEach( function(nbr) {
            enqueueNode(nbr);
            nodesInWay.push(nbr);
          });
        }
        // sanity checks
        if (endpoints.length !== 2) {
          throw('WTF. Should have 2 endpoints when done searching connected edges');
        };
        if (pointsToFollow.length !== 0) {
          throw('WTF. We should have zero points left to follow');
        }

        // add way reference to all edges and nodes, and add nodes and edges to global registry
        var wayId = ways.length;
        ways[wayId] = {nodes: []};
        nodesInWay.forEach( function(n) {
          mapg.node(n).wayIds.push(wayId);
          ways[wayId].nodes.push(n);
        });

        return wayId;
      }




      // given an edge, return all the edges between endpoints
      function findConnectedEdges(e) {
        var pointsToFollow = [e.v,e.w];
        var edgesInWay = [[e.v,e.w]];
        var nodesInWay = []
        var endpoints = [];
        var neighbors, p;
        var enqueueNode = function(n) {
          (mapg.node(n).endpoint) ? pointsToFollow.push(n) : endpoints.push(n);
        }
        var addWayToEdge = function(way, v, w) {
          mapg.edge(v,w)[way]=way;
        }
        var addWayToNode = function(way, n) {
          mapg.node(n)[ways].push(way);
        }
        enqueueNode(e.v);
        enqueueNode(e.w);
        while (pointsToFollow.length > 0) {
          p = pointsToFollow.pop;
          mapg.neighbors(n).forEach( function(nbr) {
            enqueueNode(nbr);
            nodesInWay.push(nbr);
            edgesInWay.push([p,nbr]);
          });
        }
        // sanity checks
        if (endpoints.length !== 2) {
          throw('WTF. Should have 2 endpoints when done searching connected edges');
        };
        if (pointsToFollow.length !== 0) {
          throw('WTF. We should have zero points left to follow');
        }
        // check that the edges are all the same format
        console.log(edgesInWay);
        debugger;

        // add way reference to all edges and nodes, and add nodes and edges to global registry
        var wayId = ways.length;
        ways[wayId] = {edges: [], nodes: []};
        edgesInWay.forEach( function(e) {
          mapg.edge(e[0],e[1]) = {wayId: wayId, length: edgesInWay.length};
          ways[wayId].edges.push([e[0],e[1]]);
        });
        nodesInWay.forEach( function(n) {
          mapg.node(n).wayIds.push(wayId);
          ways[wayId].nodes.push(n);
        });

        return wayId;
      }


      // we can traverse each connect set of nodes and find the ways
      graphlib.alg.components(mapg).forEach( function(connectedNodes) {
        // run through the edges, labeling them with a way #
        var firstEdge = mapg.nodeEdges(connectedNodes[0]);
        var n;
        while (connectedNodes.length > 0) {
          n = connectedNodes[0]; // grab the first node
          // explore all the attached edges
          // We don't cover the edge case where there is a cycle of immediately connected intersection points. In this case, we will miss one of the edges
          var newWayId = findConnectedNodes(n);
          // Remove the nodes we've already found to be part of a way. If a node is part of multiple ways,
          //  we'll find it during traversal, so it's ok to remove it from the pending list.
          ways[newWayId].nodes.forEach(function(n) {
            connectedNodes
        connectedEdges.forEach( function(e) {


      for each connected component
        for each edge
          for each node
            if 1 node, no other edges to pull a way id from
            if 2 node,
          check adjacent edges




      graphStale = false;
    };

    var mutateGeneric = function mutateGeneric(mutationType) {
      if (mapg.nodeCount < 1) {
        buildGraph();
      }
      var m = new Mutators();
      mapg = m[mutationType](mapg);
    };

    var mutateRelax = function mutateRelax() {
      if (graphStale === true) { buildGraph(); }
      mutateGeneric('relax');
      mutationSequence.push('relax');
    };

    // loads tiles in current view and adds the geojson to our data store
    var loadGeojsonFromServer = function loadGeojsonFromServer() {
      geojsonBucket.reset();
      // debugger
      illumap.d3tiler    // Generates tile coordinates in current view
        .scale(illumap.d3projection.scale() * 2 * Math.PI)
        .translate(illumap.d3projection([0, 0]))()
        .forEach(function(t) {   // download and display each vector tile
          var tid = illumap.tileId(t);
          console.log('need to get tile ' + tid);
          var tileserver = "http://" + ["a", "b", "c"][(t[0] * 31 + t[1]) % 3] + ".tile.openstreetmap.us";
          var tileurlpath = "/vectiles-highroad/" + t[2] + "/" + t[0] + "/" + t[1] + ".json";
          d3.json( tileserver + tileurlpath , function(error, json) {  // this is asynchronous
            illumap.tileCache[tid] = json;
            localStorage.setObject('tileCache', illumap.tileCache);
            // 'json' is a FeatureCollection object containing an array of Feature objects
            json.features.sort(function(a, b) { return a.properties.sort_key - b.properties.sort_key; }) // sort it so our join-by-index is consistent
              .forEach(function(f) { // for each feature
                geojsonBucket.add(f);
                console.log('retrieved tile ' + tid + ', features: ' + json.features.length);
                graphStale = true;
              });
         });
        });
      buildGraph();
    };



    var loadGeojsonFromLocal = function loadGeojsonFromLocal() {
      illumap.loadTileCache();
      geojsonBucket.reset();
      geojsonBucket.loadFromDisk();
      buildGraph();
    };

    // returns a feature list (key-values: feature-id -> feature)
    var featureListFromGraph = function featureListFromGraph(g) {
      var features = {};
      var feature;
      mapg.nodes().forEach( function (n) {
// debugger
console.log(n);
        feature = mapg.node(n).feature;
        if (features[feature.id] === undefined) {
          features[feature.id] = feature;
        }
      });
      console.log('nodes: '+mapg.nodes().length+', unique feature-count: '+illumap.utility.objToArray(features).length);
      return features;
    };


    // 'data' return
    return {
      buildGraph: buildGraph,
      geojsonBucket: geojsonBucket,  // module that holds features in current view (should we directly modify contents, or feed into something else?)
      mutationSequence: mutationSequence,  // list of changes performed on data
      mapg: mapg,
      mutateRelax: mutateRelax,
      featureListFromGraph: featureListFromGraph,

      init: function init() {
        console.log('initing data');
        // var defaults = {source: 'local'};
        var defaults = {};
        var opts = illumap.utility.merge(defaults, (arguments[0] || {}));
        switch (opts.source) {
          case "server":
            loadGeojsonFromServer();
            break;
          case "local":
            loadGeojsonFromLocal();
            break;
          default:
            loadGeojsonFromLocal();
            if (geojsonBucket.length === 0) {
              console.log("Couldn't load data from disk. Loading from server");
              loadGeojsonFromServer();
            }
          }
        console.log("data inited. loaded from " + opts.source);
      },

      debug: function () {
        debugger;
      },

      // returns geojsonBucket as array
      getRawData: function getRawData() {
        return geojsonBucket.getFeatures();
      },

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
        // debugger;
        var p = mutatedData.pop();
        var action = {
          pruned: p
        };
        mutationSequence.concat(action);
        console.log('pruned ' + p);
        console.log('remaining ' + mutatedData);
      },

      reset: function reset() {
        mutationSequence = [];
        mapg = new graphlib.Graph({ directed: false, multigraph: true });
        graphStale = true;
        console.log('reset data');
      }

    };
  }();
  return this;

}).apply(illumap);
