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

  // original illumap location, but not zoom
  // this.mapCenter = [6.166667,53.483333];
  // this.mapZoomLevel = 21;


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
  this.tileMarker = d3.select('body').append("div").attr('class','tilemarker'); // DOM container for raw elements
  // // Register the "custom" namespace prefix for our custom elements.
  // d3.ns.prefix.custom = "http://illumap.org/dom";

  this.width = Math.max(960, window.innerWidth) - 5;
  this.height = Math.max(500, window.innerHeight) - 5;
  this.prefix = prefixMatch(["webkit", "ms", "Moz", "O"]);

  function prefixMatch(p) {
    var i = -1, n = p.length, s = document.body.style;
    while (++i < n) if (p[i] + "Transform" in s) return "-" + p[i].toLowerCase() + "-";
    return "";
  }

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

  var container = d3.select('.container');

  var zoomBehavior = d3.behavior.zoom()
    .scale(this.d3projection.scale() * 2 * Math.PI)
    .scaleExtent([1 << 20, 1 << 23])
    .translate(this.d3projection(this.mapCenter).map(function(x) { return -x; }))
    .on("zoom", zoomed); // send events from the behavior to the zoomed handler

  var dragBehavior = d3.behavior.drag()
    .on('drag', dragged);


  // container.call(dragBehavior); // assign zooming behavior to the container
  container.on("mousemove", mousemoved); // set mousemovement listener on container

  function enableZoom() {
    container.on('.drag', null);
    container.call(zoomBehavior);
  }

  function enableDrag() {
    container.on('.zoom', null);
    container.call(dragBehavior);
  }

  // Set up control panel actions

  function toggleSlippy() {
    // debugger
    // var container = d3.select('.container');
    // if (d3.select('#repulsecheckbox').property('checked')) {
    if (d3.select('#'+this.id).property('checked')) {
      enableDrag();
    } else {
      enableZoom();
    }
  }
  // var repulseCheckbox = d3.select('#repulsecheckbox');
  // repulseCheckbox.on('change', toggleSlippy);
  // var repulseCheckbox = d3.select('#repulsecheckbox');
  d3.select('#repulsecheckbox').on('change', toggleSlippy);

  function toggleHighlights() {
    // debugger
    console.log('button ' + this.id + ' triggered a recalc of node visiblility');
    // var checked = d3.selectAll('.highlightCheckbox').property('checked');

    var checkedAllNodes = d3.select('#highlightAllNodes').property('checked');
    var checkedIntersections = d3.select('#highlightIntersections').property('checked');
    var checkedEndpoints = d3.select('#highlightEndpoints').property('checked');

    // build a function to feed all nodes into
    var checkerFunction = (function checkerFunction(checkedAllNodes, checkedIntersections, checkedEndpoints) {
      var all = checkedAllNodes;
      var intersections = checkedIntersections;
      var endpoints = checkedEndpoints;
      return function(node) {
        node.visible = all || (intersections && node.intersection) || (endpoints && node.intersection);
      }
    }(checkedAllNodes, checkedIntersections, checkedEndpoints));

    // run against all nodes (todo)
    // illumap.data.modifyNodes(checkerFunction);
  }
  d3.selectAll('.highlightCheckbox').on('change', toggleHighlights);

  function toggleFrozen() {
    // debugger
    console.log('button ' + this.id + ' triggered a recalc of node mobility');
    // var checked = d3.selectAll('.freezeCheckbox').property('checked');

    var checkedIntersections = d3.select('#freezeIntersections').property('checked');
    var checkedEndpoints = d3.select('#freezeEndpoints').property('checked');

    // build a function to feed all nodes into
    var checkerFunction = (function checkerFunction(checkedIntersections, checkedEndpoints) {
      var intersections = checkedIntersections;
      var endpoints = checkedEndpoints;
      return function(node) {
        node.frozen = (intersections && node.intersection) || (endpoints && node.intersection);
      }
    }(checkedIntersections, checkedEndpoints));

    // run against all nodes (todo)
    // illumap.data.modifyNodes(checkerFunction);
  }
  d3.selectAll('.freezeCheckbox').on('change', toggleFrozen);


function dragged(d) {
// debugger
  var x = d3.event.x;
  var y = d3.event.y;
  illumap.mutateRepulse(illumap.d3projection.invert([x,y]));
  illumap.drawMutated();
console.log('mouse was at '+x+','+y);
}


  function zoomed() {
    // get new scale and translation, and send it to data to load any new tiles and redo any mutations
    // if return value is truthy, redraw
    // either way, scale and translate the scene

    // from http://bl.ocks.org/mbostock/5593150
    function matrix3d(scale, translate) {
      var k = scale / 256, r = scale % 1 ? Number : Math.round;
      return "matrix3d(" + [k, 0, 0, 0, 0, k, 0, 0, 0, 0, k, 0, r(translate[0] * scale), r(translate[1] * scale), 0, 1 ] + ")";
    }

     var tiles = illumap.d3tiler
        .scale(zoomBehavior.scale())
        .translate(zoomBehavior.translate())
        ();

console.log('translation: '+illumap.d3projection.translate()+' -> '+zoomBehavior.translate() );
    illumap.d3projection
        .scale(zoomBehavior.scale() / 2 / Math.PI)
        .translate(zoomBehavior.translate());

    // scales the tiles before we get to the next zoom level and load new data
    // need to alter to scale the entire view since the tiles are merged before display
    var image = d3.select('.svg')
        .style(illumap.prefix + "transform", matrix3d(tiles.scale, tiles.translate));


    // keeps track of which tiles are in the current view. Used for selections
    var tileTracker = illumap.tileMarker
        .data(tiles, function(d) { return d; });

    tileTracker.exit()
        .each(function(d) {  })
        .remove();
// debugger
    tileTracker.enter().append('div')
      .attr('id', function(d) {
        return illumap.tileId(d);
      })
      .each(illumap.data.loadTileFromServer);
  }


  function mousemoved() {
    document.getElementById('location').value=(formatLocation(illumap.d3projection.invert(d3.mouse(this)), zoomBehavior.scale()));
  }

 // from http://bl.ocks.org/mbostock/5593150
  function formatLocation(p, k) {
    var format = d3.format("." + Math.floor(Math.log(k) / 2 - 2) + "f");
    return (p[1] < 0 ? format(-p[1]) + "°S" : format(p[1]) + "°N") + " "
         + (p[0] < 0 ? format(-p[0]) + "°W" : format(p[0]) + "°E");
  }

  this.setLocationFromBox = function setLocationFromBox() {
    var cardinalDir = {
      'w': ' ',
      'e': '-',
      'n': ' ',
      's': '-'
    };
    var location = document.getElementById('location').value;
    var coordReg = /\D*(\d+\.\d+).(\w) (\d+\.\d+).(\w).*/;
    var n = coordReg.exec(location);

    var lat = cardinalDir[n[4].toLowerCase()] + n[3];
    var lon = cardinalDir[n[2].toLowerCase()] + n[1];

    this.mapCenter = [parseFloat(lon), parseFloat(lat)];
    console.log('just set map center to ' + this.mapCenter);

    moveMap();
    illumap.data.loadGeojson();
    illumap.graphics.requestRedraw();
  };

  function moveMap () {
    illumap.d3projection
      .center(illumap.mapCenter)
      .scale((1 << illumap.mapZoomLevel) / 2 / Math.PI);
    console.log('d3projection updated');
  }

















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
    if (t.__data__) {
      return t.__data__.join('.');
    } else {
      return t.join('.');
    }
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
  Array.prototype.flatten = function() {
    return this.reduce( function(x,y) {
      return x.concat(y);
    });
  };

  // Add useful array function
  Array.prototype.unique = function() {
    return this.filter(function (value, index, self) {
        return self.indexOf(value) === index;
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

  this.buttonAction = function buttonAction() {
// debugger
    var action = this.attributes.action.value;
    var cases = {
      relax: illumap.mutateRelax,
      mondrianize: illumap.mutateMondrianize,
      progressivemesh: illumap.mutateProgressiveMesh,
      rdp: illumap.mutateRDP,
      undo: function() { illumap.undo(parseInt(this.attributes.steps.value)); },
      reset: illumap.reset,
      replay: illumap.replay,
      drawraw: illumap.svgDrawRaw,
      drawmutated: illumap.drawMutated,
      reload: illumap.reload,
      save: function() { illumap.save(parseInt(this.attributes.format.value)); },
      _default: function() {
        console.log("Action: "+action+" unknown. Button press ignored.");
      }
    };
    var func = cases[action] ? cases[action] : cases._default;
    func.call(this);
    // hide the button's parent container if requested
    if (this.attributes.hideparent && (this.attributes.hideparent.value === 'true')) {
      this.parentElement.style.display = 'none';
    }
  };

  this.svgDrawRaw = function svgDrawRaw() {
// debugger
    var paths = illumap.data.getRawData();
    console.log('drawing ' + paths.length + ' paths from raw data');
    illumap.graphics.requestRedraw(paths);
  };


  this.drawMutated = function drawMutated() {
// debugger
    var paths = illumap.data.getEdges();
    // var paths = illumap.data.getMutatedData();
    console.log('drawing ' + paths.length + ' paths from mutated data');
    illumap.graphics.requestRedraw(paths);
  };

  this.mutateRelax = function mutateRelax() {
    illumap.data.mutateGeneric({mutationType: 'relax'});
    illumap.drawMutated();
  };

  this.mutateRepulse = function mutateRepulse(origin) {
    illumap.data.mutateGeneric({
      mutationType: 'repulse',
      repulsionPoint: (origin || illumap.mapCenter)
    });
    illumap.drawMutated();
  };

  this.mutateMondrianize = function mutateMondrianize() {
    illumap.data.mutateGeneric({mutationType: 'mondrianize'});
    illumap.drawMutated();
  };

  this.mutateProgressiveMesh = function mutateProgressiveMesh() {
// debugger
    var stepSize = Math.round(Math.log(illumap.data.mapg.edgeCount()));
    for (var i=0; i < stepSize; i++) {
      illumap.data.mutateGeneric({mutationType: 'progressiveMesh'});
    }
    console.log('stepSize:'+stepSize);
    illumap.drawMutated();
  };

  this.replay = function replay() {
    illumap.data.replayMutations();
    illumap.drawMutated();
  };

  this.reset = function reset() {
    illumap.data.reset();
    illumap.drawMutated();
    // illumap.svgDrawRaw();
  };

  this.undo = function undo(count) {
    illumap.data.undo(count);
    illumap.drawMutated();
    // illumap.svgDrawRaw();
  };

  this.reload = function reload() {
    illumap.data.reload();
    illumap.drawMutated();
    // illumap.svgDrawRaw();
  };

  this.save = function save(format) {
    var formats = ["png","svg","link","text"];
    // todo: check if valid format
    // todo: save various forms
  }




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
      // source = ['local'];
      // source = ['server'];
      source = ['test','minimal'];
      source = ['test','orthotesting'];
      source = ['test','fullmutated'];
      // debugger;
      illumap.graphics.init( {width: illumap.width, height: illumap.height} );
      illumap.data.init({source: source});
      // illumap.graphics.draw(illumap.data.getRawData());
      // illumap.svgDrawRaw();
      // illumap.graphics.svgClear();
      // svgDrawRaw();

      d3.selectAll('.actionButton')
        .on('click', illumap.buttonAction);


      // d3.select('#location').on("keydown", illumap.setLocationFromBox);
      d3.select('#location').call(d3.keybinding()
                                    .on('return', illumap.setLocationFromBox));
      enableDrag();
// debugger
      // d3.select('.container')
      //   .call(zoomBehavior);

    //     .call(d3.keybinding()
    // .on('←', move(-2, 0))
    //   on("keydown", illumap.locationBox);

// m.relax(illumap.data.mapg)

      // illumap.data.mutateRelax();
      // illumap.svgDrawRaw();
      illumap.drawMutated();

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

