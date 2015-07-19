var illumap = (function() {
  // Module to draw svg based on data being passed in
  this.graphics = function graphics() {
    // Phase1: retrieve the tiles in the view, pass them to the data object
    // Phase1: draw the data from the data object
    // Phase2: add event handling for scrolling and zooming, retrieve new data (and pass it to the data module), and update the display area with modified data from the data module

    var svg;

    var svgClear = function svgClear() {
// debugger
      svg.selectAll("*").remove();
    };

    var svgDraw = function svgDraw(paths) {
      if (paths === undefined) {
        console.log('no data passed to draw.');
        debugger;
        fullstop();
      }
      console.log('drawing ' + paths.length + ' paths');
      svgClear();
      svg.selectAll("path")  // get all the svg paths from this svg grouping
          .data(paths)
        .enter().append("path")
          .attr("class", function(d) { return ((d && d.properties && d.properties.kind) || 'generic'); })
          .attr("wayid", function(d) { return d.id; })
          .attr("d", illumap.d3path)
          // .each(function(f) { // for each feature
          //   console.log('drawing path with ' + f.geometry.coordinates.length + ' nodes');
          // })
          ;
    };

    return {
      svgDraw: svgDraw,
      svgClear: svgClear,

      // init: store passed in svg element.
      // draw: take data and draw it, using module parameters
      init: function init() {
        var defaults = {
          width: Math.max(960, window.innerWidth),
          height: Math.max(500, window.innerHeight)
        };
        var opts = illumap.utility.merge(defaults, (arguments[0] || {}));
        this.width = opts.width;
        this.height = opts.height;

        console.log('graphics inited');
        // debugger
        if (svg === undefined) {
          svg = d3.select("body").append("svg")
              .attr("width", this.width)
              .attr("height", this.height);
          }
        return this.svg;
      },

      debug: function () {
        debugger;
      },

    }; // end return
  }(); // end graphics



  // // not sure how to reference this from everywhere, instead of having to repeat it in each sub-module
  // function merge() {
  //   var obj = {},
  //       i = 0,
  //       il = arguments.length,
  //       key;
  //   for (; i < il; i++) {
  //       for (key in arguments[i]) {
  //           if (arguments[i].hasOwnProperty(key)) {
  //               obj[key] = arguments[i][key];
  //           }
  //       }
  //   }
  //   return obj;
  // }


  return this;
}).apply(illumap);
