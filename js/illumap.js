function Illumap() {
  // Global vars
  // this.mapCenter = [6.17,53.475];
  // this.mapZoomLevel = 23;;
  this.mapCenter = [6.17,53.475];
  this.mapZoomLevel = 26;
  this.tileCache = {};
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
  this.d3path = d3.geo.path()
      .projection(this.d3projection);

  // var d3line = d3.svg.line();

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
          console.log('data stored locally in "mapdata" is invalid JSON:');
          console.log(value);
          return false;
      }
      return value && JSON.parse(value);
  };


  this.svgDrawRaw = function svgDrawRaw() {
    var paths = illumap.data.getRawData();
    console.log('drawing ' + paths.length + ' paths from raw data');
    illumap.graphics.svgDraw(paths);
  };


  this.svgDrawMutated = function svgDrawMutated() {
    var paths = illumap.data.getMutatedData();
    console.log('drawing ' + paths.length + ' paths from mutated data');
    illumap.graphics.svgDraw(paths);
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
      // debugger;
      // illumap.data.loadRawData();
      // illumap.updateTiles();
      illumap.graphics.init( {width: illumap.width, height: illumap.height} );
      // illumap.data.init({source: 'server'});
      illumap.data.init({source: 'local'});
      // illumap.graphics.draw(illumap.data.getRawData());
      illumap.svgDrawRaw();
      // illumap.graphics.svgClear();
      // svgDrawRaw();

illumap.data.buildGraph();
var m = new Mutators();
m.relax(illumap.data.mapg)
// debugger;
    };

    return {
      init: init
    }; // end return
  }(); // end test

// debugger;
  // window.addEventListener('load', test.init);

  this.debug = function() {
    debugger;
  };

}

var illumap = new Illumap();
