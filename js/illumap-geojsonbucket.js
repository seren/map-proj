// object for storing and working with geojson
var GeojsonBucket = function(uid) {
  this.uid = uid || 'mapdata'; // used when storing and retrieving locally
  this.json = {};
  this.length = 0;
  this.featuresToJoin = {};
  // this.self = this;

  // console.log('initing geojsonBucket');
  // console.log('done initing geojsonBucket');
};

GeojsonBucket.prototype.compareCoordinates = function(a,b) {
  return ((a[0] === b[0]) && (a[1] === b[1]));
};

// joins two arrays of coordinates, as long as one has a head that matches the other's tail
GeojsonBucket.prototype.joinCoordinateArrays = function(a,b,      j,d) {
  var joined;
// if (j.id == '6530058') {
//   debugger
// }

  if (this.compareCoordinates(a[0], b[b.length - 1]) === true) {
    joined = b.concat(a.slice(1));
console.log('id: '+j.id+' a: '+a+' b: '+b+' joined: ' + joined);
    return joined;
  } else if (this.compareCoordinates(b[0], a[a.length - 1]) === true) {
    joined = a.concat(b.slice(1));
console.log('id: '+j.id+' a: '+a+' b: '+b+' joined: ' + joined);
    return joined;
  } else {
console.log('id: '+j.id+' a: '+a+' b: '+b+" Couldn't join arrays");
    return false;
  }
};
GeojsonBucket.prototype.saveToDisk = function() {
  console.log('saving uid: ' + this.uid + ' json size: ' + this.length);
  localStorage.setObject(this.uid, this.json);
};
GeojsonBucket.prototype.loadFromDisk = function() {
  var tempJson;
  tempJson = localStorage.getObject(this.uid);
  if (tempJson === null) {
    console.log("Couldn't read data from local storage with key '" + this.uid +"'");
  } else {
    this.load(tempJson);
  }
  // should do some sanity checks on data returned
};
GeojsonBucket.prototype.load = function load(tempJson) {
  this.reset();
  this.json = tempJson;
  this.length = Object.keys(tempJson).length;
  console.log('loading uid: "' + this.uid + '", json size: ' + Object.keys(this.json).length);
};

// adds a new feature to the json, checking to see if it can be appended to an existing path
GeojsonBucket.prototype.add = function add(f) {
    var id = f.id;
    console.log('adding ' + id);
// if (id === '6530010') { debugger; };
// debugger;
    // if the new feature is a continuation of a feature we already have, join them
    if (this.json[id] === undefined) {
console.log('adding '+id+' for the first time');
      this.json[id] = f;
      length += 1;
    } else {
      if (this.featuresToJoin[id] === undefined) {
        this.featuresToJoin[id] = [f];
      } else {
        this.featuresToJoin[id].push(f);
      }
var pendingFeatures=this.featuresToJoin[id].length;
var pendingCoordinates=this.featuresToJoin[id].reduce(
  function(prev, curr) {
   return prev.concat(curr.geometry.coordinates);
 },[]).length;
var integratedCoordinates=this.json[id].geometry.coordinates.length;
  // need to join ways together that have been split over multiple tiles
      console.log('id already stored (coords ' + this.json[id].geometry.coordinates.length + '). additional coords: ' + f.geometry.coordinates.length + '. total arrays to join: ' + (1 + this.featuresToJoin[id].length));
      var arrayJoined = true;
      // we want to loop over our this.featuresToJoin repeatedly while joins are successful, because the last join may enable the next
      while ((this.featuresToJoin[id].length > 0) && (arrayJoined === true)) {
// console.log('in while, this.featuresToJoin[id].length = '+this.featuresToJoin[id].length);
        arrayJoined = false;
        for (var i=0,  potentialSegments=this.featuresToJoin[id].length; ((i < potentialSegments) && (arrayJoined === false)); i++) {
// console.log('in for, potentialSegments='+potentialSegments+' i='+i);
          var joined = this.joinCoordinateArrays(this.json[id].geometry.coordinates, this.featuresToJoin[id][i].geometry.coordinates,       this.json[id], f);
          if (joined.constructor === Array) { // if our join succeeded
// console.log('woohoo ' + joined + ' totallen = ' + this.json[id].geometry.coordinates.length);
            arrayJoined = true;
            this.json[id].geometry.coordinates = joined.slice(); // use slice copy the array, not just a reference
console.log('this.featuresToJoin[id] len: '+this.featuresToJoin[id].length+' before');

// debugger
            this.featuresToJoin[id] = this.featuresToJoin[id].splice(i,1); // remove original copy of the now-joined array

console.log('this.featuresToJoin[id] len: '+this.featuresToJoin[id].length+' after');
console.log('json entries: '+ Object.keys(this.json).length + ', length: '+this.length+' (numbers should match)');
// console.log('woohoo ' + joined + ' totallen = ' + this.json[id].geometry.coordinates.length);
          // } else {
  // debugger
}

        }
      }
var newPendingFeatures=this.featuresToJoin[id].length;
var newPendingCoordinates=this.featuresToJoin[id].reduce(
  function(prev, curr) {
   return prev.concat(curr.geometry.coordinates);
 },[]).length;
var newIntegratedCoordinates=this.json[id].geometry.coordinates.length;
console.log('old: pending features: '+pendingFeatures+', pending coords: ' + pendingCoordinates+', current coords: '+integratedCoordinates);
console.log('new: pending features: '+newPendingFeatures+', pending coords: ' + newPendingCoordinates+', current coords: '+newIntegratedCoordinates);
// if (x > 1) debugger
    }
    length += 1;
// debugger;
    this.saveToDisk();
};
GeojsonBucket.prototype.remove = function remove(d) {
  delete this.json[d.id];
  this.length -= 1;
};
GeojsonBucket.prototype.reset = function reset() {
  this.json = {};
  this.featuresToJoin = {};
  this.length = 0;
};
// mutate: function mutate() { // should return mutated data
//   console.log("not sure how to how to mutate raw json yet. for now renturning raw data.");
//   var a = this.get();
//   return this.get();
// },
// sorted array of features
GeojsonBucket.prototype.getFeatures = function() {
  var arr = Object.keys(this.json).map( function (key) {
    return this.json[key];
  }.bind(this));

  return arr.sort(function(a, b) { return a.properties.sort_key - b.properties.sort_key; });
};
// sorted array (features) of arrays (coordinates) of arrays (lat, long)
GeojsonBucket.prototype.getCoordinates = function() {
  var arr = Object.keys(this.json).map( function (featureId) {
debugger
    return this.json[featureId].geometry.coordinates;
  }.bind(this));
  return arr.sort(function(a, b) { return a.properties.sort_key - b.properties.sort_key; });
};
GeojsonBucket.prototype.debug = function() {
  debugger;
};
GeojsonBucket.prototype.getFeaturesClone = function() {
  return illumap.utility.deepClone(this.getFeatures());
};
GeojsonBucket.prototype.print = function() {
  var j = this.json;
  var k = Object.keys(j);
  var nodeCounter = 0;
  k.forEach(
    function (f) {
      console.log(
        'id:'+j[f].id+' kind:'+j[f].properties.kind+' ['+j[f].geometry.coordinates.map(
          function(c) {
            nodeCounter += 1;
            return c.toString();
          }
        ).join('] , [')+']'
      );
    }
  );
  console.log('json entries: ' + k.length);
  console.log('nodes: ' + nodeCounter);
};
GeojsonBucket.prototype.printPending = function() {
  var j = this.featuresToJoin;
  var uids = Object.keys(j);
  var fragCounter = 0;
  var coordCounter = 0;
  uids.forEach(
    function (uid) {
      j[uid].forEach(
        function (fragment) {
          var coords = fragment.geometry.coordinates;
// debugger
          fragCounter += 1;
          coordCounter += coords.length;
          console.log(
            'id:'+fragment.id+' kind:'+fragment.properties.kind+' ['+coords.map(
              function(c) {
                return c.toString();
              }
            ).join('] , [')+']'
          );
        }
      );
    }
  );
  console.log('unique feature ids: ' + uids.length);
  console.log('remaining feature fragments to join: '+fragCounter);
  console.log('total coordinates: ' + coordCounter);
};
