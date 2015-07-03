var illumap = (function() {
  // Module to store map data, a graph from it, and do all the manipulations
  this.data = function data() {

    var rawData,
      geojsonBucket = new GeojsonBucket('rawdata'),  // module that holds raw data
      mutatedData = [],
      mutationSequence = [],  // list of changes performed on data
      mapg = new graphlib.Graph({ directed: false, multigraph: true });

    function nodeId(coordinate) {
      return coordinate[0] + ',' + coordinate[1];
    }

    function addNode(coordinate) {
      var id = nodeId(coordinate);
      if (!mapg.hasNode(id)) {
        mapg.setNode(id, coordinate);
      }
    }

    // do we need to label nodes and/or edges?
    var buildGraph = function buildGraph() {
      var features = geojsonBucket.getFeatures();
      features.forEach( function(feature) {
        var coordinates = feature.geometry.coordinates;
        addNode(coordinates[0]);
        for (var i = 0, len = coordinates.length; i < len - 1 ; i++) {
          addNode(coordinates[i+1]);
          mapg.setEdge(coordinates[i], coordinates[i+1], {way: feature.id, length: len});
          console.log('graph: added edge, wayid: ' + feature.id + ' c1: ' + coordinates[i] + ' c2: ' + coordinates[i+1]);
        }
      });
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
              // 'json' is a FeatureCollection object containing an array of Feature objects
              json.features.sort(function(a, b) { return a.properties.sort_key - b.properties.sort_key; }) // sort it so our join-by-index is consistent
                .forEach(function(f) { // for each feature
                  geojsonBucket.add(f);
                  console.log('retrieved tile ' + tid + ', features: ' + json.features.length);
                });
           });
          });
    };



    var loadGeojsonFromLocal = function loadGeojsonFromLocal() {
      geojsonBucket.reset();
      geojsonBucket.loadFromDisk();
    };


    // 'data' return
    return {
      buildGraph: buildGraph,
      rawData: rawData,
      geojsonBucket: geojsonBucket,  // module that holds features in current view (should we directly modify contents, or feed into something else?)
      mutatedData: mutatedData,
      mutationSequence: mutationSequence,  // list of changes performed on data
      mapg, mapg,

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

      loadRawData: function loadRawData(data) {
        rawData = illumap.utility.clone(data);
        mutatedData = illumap.utility.clone(data); // same object without clone! argh
        return rawData;
      },

      // returns geojsonBucket as array
      getRawData: function getRawData() {
        return geojsonBucket.getFeatures();
      },

      getMutatedData: function getMutatedData() {
        geojsonBucket.mutate();  // should actually load data from graph object
        return mutatedData;
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
        console.log('rawData ' + rawData);
      },

      reset: function reset() {
        mutationSequence = [];
        rawData = illumap.utility.clone(geojsonBucket.json);
        mutatedData = illumap.utility.clone(geojsonBucket.json);
        console.log('reset data to ' + rawData);
      }

    };
  }();
  return this;

}).apply(illumap);
