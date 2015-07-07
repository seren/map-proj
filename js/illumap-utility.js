// utility functions
var illumap = (function() {

  var objToArray = function objToArray(obj) {
    return Object.keys(obj).map(function (key) { return obj[key]; } );
  };

  // number of unique coordinates in a feature list (key-value obj with feature-id -> feature)
  //  and each feature with mulitple coordinatens
  var coordsInFeatureList = function(featureList) {
    var coordinates = {};
    var id,
        duplicates = 0,
        featureCount = 0;
    objToArray(featureList).forEach( function(f) {  // each feature with multiple coordinates
      featureCount += 1;
      f.geometry.coordinates.forEach( function(c) {
        id = c[0] + ',' + c[1];
        if (coordinates[id] === undefined) {
          coordinates[id] = c;
        } else {
          duplicates += 1;
        }
      });
    });
    var array = objToArray(coordinates);
    console.log('debug: coordinates in feature list ('+featureCount+' features). unique: '+array.length+' duplicates: '+duplicates);
    return array;
  };


  this.utility = {

    runningInDevelopment: function runningInDevelopment() {
      return (window.location.href.split(/[/:]+/)[1] === 'localhost');
    },

    clone: function clone(obj) {
      if(obj === null || typeof(obj) !== 'object' || 'isActiveClone' in obj)
          return obj;
      var temp = obj.constructor(); // changed
      for(var key in obj) {
          if(Object.prototype.hasOwnProperty.call(obj, key)) {
              obj.isActiveClone = null;
              temp[key] = clone(obj[key]);
              delete obj.isActiveClone;
          }
      }
      return temp;
    },

    //http://stackoverflow.com/a/4460624/1174506
    deepClone: function deepClone(item) {
        if (!item) { return item; } // null, undefined values check

        var types = [ Number, String, Boolean ],
            result;

        // normalizing primitives if someone did new String('aaa'), or new Number('444');
        types.forEach(function(type) {
            if (item instanceof type) {
                result = type( item );
            }
        });

        if (typeof result == "undefined") {
            if (Object.prototype.toString.call( item ) === "[object Array]") {
                result = [];
                item.forEach(function(child, index, array) {
                    result[index] = deepClone( child );
                });
            } else if (typeof item == "object") {
                // testing that this is DOM
                if (item.nodeType && typeof item.cloneNode == "function") {
                    var result = item.cloneNode( true );
                } else if (!item.prototype) { // check that this is a literal
                    if (item instanceof Date) {
                        result = new Date(item);
                    } else {
                        // it is an object literal
                        result = {};
                        for (var i in item) {
                            result[i] = deepClone( item[i] );
                        }
                    }
                } else {
                    // depending what you would like here,
                    // just keep the reference, or create new object
                    if (false && item.constructor) {
                        // would not advice to do that, reason? Read below
                        result = new item.constructor();
                    } else {
                        result = item;
                    }
                }
            } else {
                result = item;
            }
        }

        return result;
    },



    // object merge
    merge: function merge() {
      var obj = {},
          i = 0,
          il = arguments.length,
          key;
      for (; i < il; i++) {
          for (key in arguments[i]) {
              if (arguments[i].hasOwnProperty(key)) {
                  obj[key] = arguments[i][key];
              }
          }
      }
      return obj;
    },

    objToArray: objToArray,

    // unique coordinates in tiles
    coordsInTileCache: function() {
      var tileArray = objToArray(illumap.tileCache);
      var allFeatures = tileArray.reduce( function (prev, currFeatureCollection) {
        return prev.concat(currFeatureCollection.features);
      },[]);
      return coordsInFeatureList(allFeatures);
    },

    coordsInGeojsonBucket: function() {
      return coordsInFeatureList(illumap.data.geojsonBucket);
    },

    coordsInGraph: function() {
      return coordsInFeatureList(illumap.data.featureListFromGraph(illumap.data.mapg));
    }








  };

  return this;
}).apply(illumap);
