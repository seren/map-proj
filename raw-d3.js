var Illumap = function Illumap() {
    if ( !(this instanceof Illumap) ) {
       throw new Error("Constructor called as a function");
    }

    // constructor logic

    // Extend local storage to save and retrieve objects
    Storage.prototype.setObject = function(key, value) {
        this.setItem(key, JSON.stringify(value));
    };
    Storage.prototype.getObject = function(key) {
        var value = this.getItem(key);
        return value && JSON.parse(value);
    };

    var self = this;
    self.ugh = 'a';



    var Util = {
        // extend an object with properties of one or more other objects
        extend: function (dest) {
            var i, j, len, src;

            for (j = 1, len = arguments.length; j < len; j++) {
                src = arguments[j];
                for (i in src) {
                    dest[i] = src[i];
                }
            }
            return dest;
        },

        // create an object from a given prototype
        create: Object.create || (function () {
            function F() {}
            return function (proto) {
                F.prototype = proto;
                return new F();
            };
        })(),

        // bind a function to be called with a given context
        bind: function (fn, obj) {
            var slice = Array.prototype.slice;

            if (fn.bind) {
                return fn.bind.apply(fn, slice.call(arguments, 1));
            }

            var args = slice.call(arguments, 2);

            return function () {
                return fn.apply(obj, args.length ? args.concat(slice.call(arguments)) : arguments);
            };
        },

        HttpClient:  {
            get: function(aUrl, aCallback) {
                var anHttpRequest = new XMLHttpRequest();
                anHttpRequest.onreadystatechange = function() {
                    if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                        aCallback(anHttpRequest.responseText);
                }
                anHttpRequest.open( "GET", aUrl, true );
                anHttpRequest.send( null );
            }
        }
    }


    return  {
        version: '0.1',

        getXml: function (dataProcessingFunc) {
            if (typeof dataProcessingFunc !== 'function') {
                dataProcessingFunc = this.updateMapVectors;
            }
            // Is this going to be a problem? Do I need to use a constructor? Is this going to use the same HttpClient for every use?
            console.log('retrieving');
            this.Util.HttpClient.get('http://api.openstreetmap.org/api/0.6/map?bbox=6.148,53.483,6.150,53.485', dataProcessingFunc);
            console.log('retrieved');
        },

        updateMapVectors: function(xmlResponse) {
            saveMapData(xmlResponse);
        },

        saveMapData: function(data) {
            localStorage.setObject('mapdata',data);
        },

        getMapData: function() {
            var d = localStorage.getObject('mapdata');
            if (typeof d !== 'string') {
                console.log('no local map data. getting new stuff.')
                getXml(saveMapData(data));
            }
            console.log(d);
        },

        test: function() {
            console.log(self.ugh);
        },

        main: function() {
            console.log('in main');
            this.getMapData();
            console.log('end main');
        }

    };
};



// Load map via api
// url = 'http://api.openstreetmap.org/api/0.6/map?bbox=6.148,53.475,6.169,53.485';
// resp = $.get(url);
// geojson = osmtogeojson(resp.responseXML);



// // // why doesn't this work??? The inner code works... Maybe the async timing?
// osm_xml = (function () {
//  var xml = null;
//     $.get('http://api.openstreetmap.org/api/0.6/map?bbox=6.148,53.483,6.150,53.485',
//       function (data) { xml = data; }
//     );
//     return xml;
// })();

// var geojson = osmtogeojson(osm_xml);

// osm_json = (function () {
//   var json = null;
//   $.get('http://api.openstreetmap.org/api/0.6/map?bbox=6.148,53.483,6.150,53.485',
//       function (data) {
//         console.log(data);
//         json = osmtogeojson(data);
//         console.log(json);
//     }
//     );
//   return json;
// })();

// setTimeout(function(){
//     console.log('bob');
//     console.log(osm_json);
//     console.log('bob');
// }, 5000);










