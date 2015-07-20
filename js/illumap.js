// outstanding bugs: some lines don't get put into the graph...

function Illumap() {
  // Global vars

  // good crowded space
  this.mapZoomLevel = 23;
  this.mapCenter = [6.17,53.475];

  // good crowded space with missing bits
  // this.mapZoomLevel = 25;
  // this.mapCenter = [6.171,53.477];  // +=right,+=down

  // good minimal space (test data fits here)
  // this.mapCenter = [6.17,53.475];
  // this.mapZoomLevel = 26;

  // this.mapCenter = [6.148,53.483];
  // this.mapZoomLevel = 22;

  this.frozen = {
    wayEnd: false,
    intersection: false,
    endpoint: false
  };

  this.globalLoglevel = 'DEBUG';

  log = function log (str, msgLevel) {
    var gll = illumap.globalLoglevel;
    // loglevels
    lls = {
      DEBUG: 1,
      WARN: 2,
      INFO: 3,
      ERROR: 4,
      NONE: 10
    };
    if ((lls[msgLevel] || lls.DEBUG) >= gll) {
      console.log(str);
    }
  };


  this.newFeatures = false; // flag for testing whether we have to re-mutate our raw features
  this.rawDataContainer = d3.select('body').append("custom"); // DOM container for raw elements

  this.width = Math.max(960, window.innerWidth);
  this.height = Math.max(500, window.innerHeight);

  // Tool to determine what tiles are in the view based on scale, size, projection, and translation
  this.d3tiler = d3.geo.tile()
      .size([this.width, this.height]);

  this.d3projection = d3.geo.mercator()
      .center(this.mapCenter)
      .scale((1 << this.mapZoomLevel) / 2 / Math.PI)
      .translate([this.width / 2, this.height / 2]);

  // Given a geometry or feature object, d3.geo.path generates the path data string suitable for the "d" attribute of an SVG path element
  // Can also be used: this.d3path({coordinates: ['10','20','30'], type: "LineString"})
  this.d3path = d3.geo.path()
      .projection(this.d3projection);

  // var d3line = d3.svg.line();

  this.tileCache = {};
  this.loadTileCache = function() {
    var tc = localStorage.getObject('tileCache');
    if (tc !== null) {
      illumap.tileCache = tc;
    }
  };


  /////////////////////
  // Utility functions

  // produces a UID for tile coordinates
  this.tileId = function tileId(t) {
    return t.join('.');
  };


  // Extend localStorage
  Storage.prototype.setObject = function(key, value) {
      this.setItem(key, JSON.stringify(value));
  };

  Storage.prototype.getObject = function(key) {
      var value = this.getItem(key);
      try {
          JSON.parse(value);
      }
      catch(e) {
          console.log('data stored locally in "'+key+'" is invalid JSON:');
          console.log(value);
          return false;
      }
      return value && JSON.parse(value);
  };


  // Add useful array function
  Array.prototype.toInt = function() {
    return this.map( function(x) {
      return parseInt(x,10);
    });
  };

  // Add useful array function
  Array.prototype.removeByValue = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        ax = this.indexOf(what);
        if (ax !== -1) {
          this.splice(ax, 1);
        }
    }
    return this;
  };

  // Add useful array function
  Array.prototype.removeAllByValue = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
  };


  this.svgDrawRaw = function svgDrawRaw() {
// debugger
    var paths = illumap.data.getRawData();
    console.log('drawing ' + paths.length + ' paths from raw data');
    illumap.graphics.svgDraw(paths);
  };


  this.drawMutated = function drawMutated() {
// debugger
    var paths = illumap.data.getMutatedPaths();
    // var paths = illumap.data.getMutatedData();
    console.log('drawing ' + paths.length + ' paths from mutated data');
    illumap.graphics.svgDraw(paths);
  };

  this.mutateRelax = function mutateRelax() {
    illumap.data.mutateGeneric('relax');
    illumap.drawMutated();
  };

  this.mutateMondrianize = function mutateMondrianize() {
    illumap.data.mutateGeneric('mondrianize');
    illumap.drawMutated();
  };

  this.mutateProgressiveMesh = function mutateProgressiveMesh() {
    for (var i=0; i < 10; i++) {
      illumap.data.mutateGeneric('progressiveMesh');
    }
    illumap.drawMutated();
  };

  this.reset = function reset() {
    illumap.data.reset();
    illumap.svgDrawRaw();
  };

  this.reload = function reload() {
    illumap.data.reload();
    illumap.svgDrawRaw();
  };

  // Module to run tests
  this.test = function test() {
    // var tempdata = [[1,1],[2,2],[2,3],[3,3],[3,4]];

    // var tempmapdata =
    // .data(d3tiler
    //   .scale(d3projection.scale() * 2 * Math.PI)
    //   .translate(d3projection([0, 0])))

    // init: store passed in svg element.
    var init = function init() {
      var source = illumap.utility.runningInDevelopment() ? 'local' : 'server';
      source = 'server';
      // source = 'test';
      // debugger;
      illumap.graphics.init( {width: illumap.width, height: illumap.height} );
      illumap.data.init({source: source});
      // illumap.graphics.draw(illumap.data.getRawData());
      // illumap.svgDrawRaw();
      // illumap.graphics.svgClear();
      // svgDrawRaw();

// m.relax(illumap.data.mapg)

      // illumap.data.mutateRelax();
      // illumap.drawMutated();

// debugger;
    };

    return {
      init: init
    }; // end return
  }(); // end test

// debugger;
  window.addEventListener('load', this.test.init);

  this.debug = function() {
    debugger;
  };

}

var illumap = new Illumap();
