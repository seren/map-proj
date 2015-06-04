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


    var version = function version() {
        console.log(this);
        return '0.1';
    };

    var test = function test () {
        console.log(self.ugh);
        return 'yup';
    };

    var main = function main () {
        version();
        console.log('in main');
        console.log(self);
        console.log(M.Data.mapData());
        // console.log(self.mapData());
        console.log('end main');
    };

    self.version = version;
    self.test = test;
    self.main = main;

};

M.Util = {
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
    }
};

M.Aaaa = {
    aa: function() {
        return 'aaa';
    }
};

M.Util.HttpClient = {
    get: function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() {
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        };
        anHttpRequest.open( 'GET', aUrl, true );
        anHttpRequest.send( null );
    }
}; // var util





M.Data = {
    getOsmXml: function (dataProcessingFunc) {
        console.log('retrieving');
        M.Util.HttpClient.get('http://api.openstreetmap.org/api/0.6/map?bbox=6.148,53.483,6.150,53.485', dataProcessingFunc);
        console.log('retrieved');
    },

    cacheMapData: function (data) {
        console.log('caching1');
        console.log(data);
        console.log('caching2');
        localStorage.setObject('mapdata',data);
        console.log('cached');
        util.stacktrace();
    },

    // retrieves map data from cache or OSM
    mapData: function () {
        console.log(self);
        var d = localStorage.getObject('mapdata');
        if (typeof d !== 'string') {
            console.log('no local map data. getting new stuff.');
            M.Data.getOsmXml(M.Data.cacheMapData);
        }
        console.log('end mapData');
    }


};

