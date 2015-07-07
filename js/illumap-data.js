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
      var wayid = feature.id;
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
            console.log('graph: added edge, wayid:index: ' + feature.id + ':' + i + ' c1: ' + nodeId(feature, i) + ' c2: ' + nodeId(feature, i+1));
          }
        } else {
          console.log("skipping feature " + feature.id + ". Can't handle geometry type: " + feature.geometry.type);
        }
      });
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
