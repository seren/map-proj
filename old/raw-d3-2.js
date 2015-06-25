//var M = function M() {
//function M() {
// var M = {};

var M = function M() {
    if ( !(this instanceof M) ) {
       throw new Error('Constructor called as a function');
    }

    // start constructor logic

    // Extend local storage to save and retrieve objects
    Storage.prototype.setObject = function(key, value) {
        console.log('setting object:');
        console.log(value);
        this.setItem(key, JSON.stringify(value));
        alert('setting');
    };
    Storage.prototype.getObject = function(key) {
        var value = this.getItem(key);
        try {
            JSON.parse(value);
        }
        catch(e) {
            console.log('data stored locally in "mapdata" is invalid JSON:');
            console.log(value);
            return false;
        }
        return value && JSON.parse(value);
    };

    // debugging
    var self = this;
    self.ugh = 'a';

};

M.prototype.version= function version() {
    console.log(this);
    return '0.1';
};

M.prototype.test = function test () {
    console.log(self.ugh);
    return 'yup';
};

M.prototype.main = function main () {
    this.version();
    console.log('in main');
    console.log(self);
    console.log(M.Data.mapData());
    // console.log(self.mapData());
    console.log('end main');
};


M.prototype.Util = {
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

    stacktrace: function stackTrace() {
        var err = new Error();
        return err.stack;
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
    }
};

M.prototype.aaaa = {
    aa: function() {
        return 'aaa';
    }
};

M.prototype.Util.HttpClient = {
    get: function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() {
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
// console.log('-start-------------');
// console.log(anHttpRequest.responseText);
// console.log(typeof aCallback);
// console.log('-end--------');
                aCallback(anHttpRequest.responseText);
        };
        anHttpRequest.open( 'GET', aUrl, true );
        anHttpRequest.send( null );
    }
}; // var util





M.prototype.Data = {
    getOsmXml: function (dataProcessingFunc) {
        // if (typeof dataProcessingFunc !== 'function') {
        //     dataProcessingFunc = this.updateMapVectors;
        // }
        // Is this going to be a problem? Do I need to use a constructor? Is this going to use the same HttpClient for every use?
        console.log('retrieving');
console.log(self);
console.log(self.util);
        M.Util.HttpClient.get('http://api.openstreetmap.org/api/0.6/map?bbox=6.148,53.483,6.150,53.485', dataProcessingFunc);
        console.log('retrieved');
    },

    // function updateMapVectors(xmlResponse) {
    //     cacheMapData(xmlResponse);
    // };

    cacheMapData: function (data) {
        console.log('caching');
        localStorage.setObject('mapdata',data);
        console.log('cached');
        // self.util.stacktrace();
        M.Util.stacktrace();
    },

    // retrieves map data from cache or OSM
    mapData: function () {
        console.log(self);
        var d = localStorage.getObject('mapdata');
        if (typeof d !== 'string') {
            console.log('no local map data. getting new stuff.');
            M.Data.getOsmXml(M.Data.cacheMapData);

            // $.ajax({
            //     url: 'http://api.openstreetmap.org/api/0.6/map?bbox=6.148,53.483,6.150,53.485',
            //     cache: false,
            //     datatype: 'xml'
            // })
            // .done(function(xml) {
            //     console.log('ajax done');
            //     cacheMapData(xml);
            // })
            // .fail(function() {
            //     console.log('OSM data request failed.');
            // });


        }
        console.log('end mapData');
    }


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







