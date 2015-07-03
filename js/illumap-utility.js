// utility functions
var illumap = (function() {

  this.utility = {

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
    }

  };

  return this;
}).apply(illumap);
