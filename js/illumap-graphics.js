var illumap = (function() {
  // Module to draw svg based on data being passed in
  this.graphics = function graphics() {
    // Phase1: retrieve the tiles in the view, pass them to the data object
    // Phase1: draw the data from the data object
    // Phase2: add event handling for scrolling and zooming, retrieve new data (and pass it to the data module), and update the display area with modified data from the data module

    var redrawPending = true;

    var colors = new Colors();
    var numGradients = 200;
    var decorationStrokeLength = 20;

    var svg; // populated in init

    var d3line = d3.svg.line();
    var d3arcline = d3.svg.line()
        .interpolate(function(points) { return points.join("A 1,1 0 0 1 "); })
        .x(function(d) { return x(d.x); })
        .y(function(d) { return y(d.y); });

    var groupname = 'edges';

    var svgClear = function svgClear() {
// debugger
      svg.selectAll('.'+groupname).remove();
    };



    // Given a d3 selection, create a gradient perpendicular to the edge
    function decorate (edges) {
      // create a group for the way's segment's decoration, and create a decoration rect for each segment
      var gg = edges.append('g')
        .attr('class', 'decorationgroup')
      .selectAll("g")
        .data(function(d) {
          return pointPairs(d.geometry.coordinates).map(function(pp) {
            return {point: pp, id: d.id };
          });
        });

// //tangent lines
      // // create a group for the way's segment's tangents, and create a tangent path for each segment
      // edges.append('g')
      //   .attr('class', 'tangentgroup')
      // .selectAll("path")
      //   .data(function(feature) { return pointPairs(feature.geometry.coordinates); })
      // .enter().append('path')
      //   .attr('class', 'tan')
      //   .attr('d', function (d) {
      //     // this produces skewed tangents
      //     // return illumap.d3path(illumap.data.featureFromCoordinates(tangentFromMidpoint(d)).geometry);
      //     var screenCoord = [illumap.d3projection(d[0]), illumap.d3projection(d[1])];
      //     return d3line(tangentFromMidpoint(screenCoord));
      //   });

// //tangent box paths
      // // create a group for the way's segment's decoration, and create a decoration path for each segment
      // edges.append('g')
      //   .attr('class', 'decorationgroup')
      // .selectAll("path")
      //   .data(function(feature) { return pointPairs(feature.geometry.coordinates); })
      // .enter().append('path')
      //   .attr('class', 'decoration')
      //   .attr('d', function (d) {
      //     // this produces skewed tangents
      //     // return illumap.d3path(illumap.data.featureFromCoordinates(tangentFromMidpoint(d)).geometry);
      //     var screenCoord = [illumap.d3projection(d[0]), illumap.d3projection(d[1])];
      //     // return d3line(tangentFromMidpoint(screenCoord));
      //     return d3line(rectCoordFromEdge(screenCoord[0], screenCoord[1], 10)) + 'Z';
      //   });

      //
      gg.enter().append('rect')
        .attr("width", function(d) {
          var screenCoord = [illumap.d3projection(d.point[0]), illumap.d3projection(d.point[1])];
          d.rect = rectFromEdge(screenCoord[0], screenCoord[1], decorationStrokeLength);
          return d.rect.width;
        })
        .attr("height", function(d) { return d.rect.height;})
        .attr("rx", 1)
        .attr("ry", 1)
        .attr("x", 0)
        .attr("y", 0)
        .attr("transform", function(d) { return "translate(" + [d.rect.x,d.rect.y] +")rotate(" + d.rect.rotation + ")"; })
        // colors segments all the same
        // .style("fill", d3.scale.category20c());
        // colors way segments all the same
        // .style("fill", function(d, i) {return "url(#gradient"+ ((d.id + i) % numGradients) +")" });
        // colors way segments differently. not stable if the way has segments removed
        .style("fill", function(d) { return "url(#gradient"+ ((d.id) % numGradients) +")"; });

      // // add opposite-side decoration stroke
      // gg.enter().append('rect')
      //   .attr("width", function(d) {
      //     // var screenCoord = [illumap.d3projection(d.point[0]), illumap.d3projection(d.point[1])];
      //     // d.rect = rectFromEdge(screenCoord[0], screenCoord[1], decorationStrokeLength);
      //     return d.rect.width;
      //   })
      //   .attr("height", function(d) { return d.rect.height; })
      //   .attr("rx", 1)
      //   .attr("ry", 1)
      //   .attr('x', 0)
      //   // .attr('x', function(d) { return 1 * d.rect.width; })
      //   // .attr("y", 0)
      //   .attr('y', function(d) { return -1 * d.rect.height; })
      //   .attr("transform", function(d) { return "translate(" + [d.rect.x,d.rect.y] +")rotate(" + (d.rect.rotation + 180) + ")"; })
      //   // .style("fill", d3.scale.category20c());
      //   // colors way segments all the same
      //   // .style("fill", function(d, i) {return "url(#gradient"+ ((d.id + i) % numGradients) +")" });
      //   // colors way segments differently. not stable if the way has segments removed
      //   .style("fill", function(d, i) {return "url(#gradient"+ ((d.id + i) % numGradients) +")" });

console.log('finished drawing decorations');
console.log('mutation count: '+illumap.data.mutationSequence.length);
      // returns a tangent line starting from the mid-point of the original line
      function tangentFromMidpoint (line) {
        var p1 = line[0];
        var p2 = line[1];
        var midPoint = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
        var tv = tangentVectors(p1,p2)[0];
        return [midPoint, [tv[0] + midPoint[0], tv[1] + midPoint[1]]];
      }

      function tangentUnitVector (p1,p2) {
        var dx = p2[0] - p1[0];
        var dy = p2[1] - p1[1];
        return unitVector(dx,dy);
      }

      // perpendicular unit vector
      function unitVector (p1,p2) {
        var h = Math.sqrt(p1 * p1 + p2 * p2);
        return [p2 / h, p1 / h];
      }

      // Returns both tangent vectors (not unit-vector) for a line
      function tangentVectors (p1,p2) {
        // if we define dx=x2-x1 and dy=y2-y1, then the normals are (-dy, dx) and (dy, -dx)
        var dx = p2[0] - p1[0];
        var dy = p2[1] - p1[1];
        return [[-dy, dx], [dy, -dx]];
      }

      // Takes a series of coordinates, and returns the component edges (coordinate pairs)
      // ex: [1,2,3] -> [[1,2],[2,3]]
      function pointPairs (coordinates) {
      // debugger
        return d3.range(coordinates.length - 1).map(function(i) {
          return [coordinates[i], coordinates[i + 1]];
        });
      }
    }

    function drawLines (edges) {
      // add the edge path
      edges.append('g')
        .attr("class", function(d) { return 'edge ' + ((d && d.properties && d.properties.kind) || 'generic'); })
        .attr("id", function(d) { return 'edge' + d.id; })
      .append('path')
        .attr("d", function(d) {return illumap.d3path(d.geometry); } );
    }



    var svgDraw = function svgDraw(paths) {
      if (paths === undefined) {
        alert('ERROR: no data passed to draw!');
      }
// debugger
      console.log('in svgDraw, drawing ' + paths.length + ' paths');
      svgClear();

      // create groups for each edge and its decorations
      var edges = svg.selectAll('.'+groupname)
          .data(paths)
        .enter().append('g')
          .attr('class', groupname)
          .attr('uid', function(d) { return d.uid; });

      // we draw the decoration first so it doesn't cover up the edge lines
      decorate(edges);
      drawLines(edges);
      // labelLines(edges);
    };


    var rectFromEdge = function rectCoordFromEdge(p1, p2, height) {
      // get unit vect and scaling factor
      // create new points from original + unitvect * scaling
      var p0, p3, h;
      var dx = p1[1] - p2[1];
      var dy = p2[0] - p1[0];
      var length = Math.sqrt(dx * dx + dy * dy);
      if (height === undefined) {
        height = length;
      } else {
        height = Math.min(height, length);
      }
      var angle = Math.atan2(dy,dx) * 180 / Math.PI + 180;
      return {x:p1[0],
              y:p1[1],
              // height: height,
              // width: length,
              height: length,
              width: height,
              rotation: angle
            };
    };

    var rectCoordFromEdge = function rectCoordFromEdge(p1, p2, tangentLength) {
      // get unit vect and scaling factor
      // create new points from original + unitvect * scaling
      var p0, p3, h;
      var dx = p1[1] - p2[1];
      var dy = p2[0] - p1[0];
      if (tangentLength === undefined) {
        p0 = [p1[0] + dx, p1[1] + dy];
        p3 = [p2[0] + dx, p2[1] + dy];
      } else {
        h = Math.sqrt(dx * dx + dy * dy);
        scaleFactor = h / tangentLength;
        scaledUnitv = [dx / scaleFactor, dy / scaleFactor];
        p0 = [p1[0] + scaledUnitv[0], p1[1] + scaledUnitv[1]];
        p3 = [p2[0] + scaledUnitv[0], p2[1] + scaledUnitv[1]];
      }
// debugger
      // var h = Math.sqrt(dx * dx + dy * dy);
      // var unitv = [dx / h, dy / h];
      // var p0 = [p1[0] + unitv[0] * h, p1[1] + unitv[1] * h];
      // var p3 = [p2[0] + unitv[0] * h, p2[1] + unitv[1] * h];
      // console.log('h:'+h+' unitv:'+unitv);
      return [p0, p1, p2, p3];
    };


    var requestRedraw = function requestRedraw (paths) {
// debugger
      redrawPending = true;
      while (redrawPending) {
        redrawPending = false;
        svgDraw(paths);
        paths = undefined; // we don't want to keep redrawing the paths that were passed in after the first time
      }

    };

    return {
      svgDraw: svgDraw,
      svgClear: svgClear,
      redrawPending: redrawPending,
      requestRedraw: requestRedraw,


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
        if ((svg === undefined) || (d3.select('svg')[0][0] === null)) {
          svg = d3.select(".container").append("svg")
              .attr("width", this.width)
              .attr("height", this.height);
              // .attr('class', 'svg');
        }

        // create gradient definition tags
        d3.range(numGradients - 1).map(function(i) {
          appendNormalGradient('gradient'+i,colors.random(),colors.random());
        });

      // appends perpendicular gradients to svg
      function appendNormalGradient(id,color1,color2) {
        var gradient = svg.append("svg:defs")
          .append("svg:linearGradient")
            .attr("id", id)
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "0%")
            .attr("spreadMethod", "pad");

        gradient.append("svg:stop")
            .attr("offset", "0%")
            .attr("stop-color", "#"+color1)
            .attr("stop-opacity", 1);

        gradient.append("svg:stop")
            .attr("offset", "100%")
            .attr("stop-color", "#"+color2)
            // .attr("stop-color", "#FFF")
            .attr("stop-opacity", 0);
      }

        return svg;
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
