(function() {

    var shapeSelector = {
        init: function(){
            var that = this;

            var width = 500;
            var height = 400;

            // An array to hold the coordinates
            // of the line drawn on each svg.
            var  coords = []
            this.line = d3.svg.line();

            this.drag = this.getDragBehaviours()

            this.svg = d3.select("#canvas1").append("svg")
            .attr({
                width: width,
                height: height
            }).call(that.drag);

            this.bindEvents();
            this.buildMap();
        },
        buildMap: function(){
            var locations = [
                ['Some other Beach', -32.80010128657071, 150.28747820854187, 6],
                ['Bondi Beach', -33.890542, 151.274856, 4],
                ['Coogee Beach', -33.923036, 151.259052, 5],
                ['Cronulla Beach', -34.028249, 151.157507, 3],
                ['Manly Beach', -33.80010128657071, 151.28747820854187, 2],
                ['Maroubra Beach', -33.950198, 151.259302, 1]
                ];

                var map = new google.maps.Map(document.getElementById('map'), {
                  zoom: 6,
                  center: new google.maps.LatLng(-33.92, 151.25),
                  mapTypeId: google.maps.MapTypeId.ROADMAP
                });

                var infowindow = new google.maps.InfoWindow();

                var marker, i;

                for (i = 0; i < locations.length; i++) {
                  marker = new google.maps.Marker({
                    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                    map: map
                  });

                  google.maps.event.addListener(marker, 'click', (function(marker, i) {
                    return function() {
                      infowindow.setContent(locations[i][0]);
                      infowindow.open(map, marker);
                    }
                  })(marker, i));
                }
        },
        bindEvents: function(){





            $('.clear').click(function(e) {
                e.preventDefault();
                d3.selectAll("svg path").remove();
            });

           $('.edit').click(function(e) {
                e.preventDefault();
               /*
                 var width = 960,
                    height = 500;

                var points = d3.range(1, 5).map(function(i) {
                  return [i * width / 5, 50 + Math.random() * (height - 100)];
                });

                var dragged = null,
                    selected = points[0];

                var line = d3.svg.line();

                var svg = d3.select("body").append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("tabindex", 1);

                svg.append("rect")
                    .attr("width", width)
                    .attr("height", height)
                    .on("mousedown", mousedown);

                svg.append("path")
                    .datum(points)
                    .attr("class", "line")
                    .call(redraw);

                d3.select(window)
                    .on("mousemove", mousemove)
                    .on("mouseup", mouseup)
                    .on("keydown", keydown);

                d3.select("#interpolate")
                    .on("change", change)
                  .selectAll("option")
                    .data([
                      "linear",
                      "step-before",
                      "step-after",
                      "basis",
                      "basis-open",
                      "basis-closed",
                      "cardinal",
                      "cardinal-open",
                      "cardinal-closed",
                      "monotone"
                    ])
                  .enter().append("option")
                    .attr("value", function(d) { return d; })
                    .text(function(d) { return d; });

                svg.node().focus();

                function redraw() {
                  svg.select("path").attr("d", line);

                  var circle = svg.selectAll("circle")
                      .data(points, function(d) { return d; });

                  circle.enter().append("circle")
                      .attr("r", 1e-6)
                      .on("mousedown", function(d) { selected = dragged = d; redraw(); })
                    .transition()
                      .duration(750)
                      .ease("elastic")
                      .attr("r", 6.5);

                  circle
                      .classed("selected", function(d) { return d === selected; })
                      .attr("cx", function(d) { return d[0]; })
                      .attr("cy", function(d) { return d[1]; });

                  circle.exit().remove();

                  if (d3.event) {
                    d3.event.preventDefault();
                    d3.event.stopPropagation();
                  }
                }

                function change() {
                  line.interpolate(this.value);
                  redraw();
                }

                function mousedown() {
                  points.push(selected = dragged = d3.mouse(svg.node()));
                  redraw();
                }

                function mousemove() {
                  if (!dragged) return;
                  var m = d3.mouse(svg.node());
                  dragged[0] = Math.max(0, Math.min(width, m[0]));
                  dragged[1] = Math.max(0, Math.min(height, m[1]));
                  redraw();
                }

                function mouseup() {
                  if (!dragged) return;
                  mousemove();
                  dragged = null;
                }

                function keydown() {
                  if (!selected) return;
                  switch (d3.event.keyCode) {
                    case 8: // backspace
                    case 46: { // delete
                      var i = points.indexOf(selected);
                      points.splice(i, 1);
                      selected = points.length ? points[i > 0 ? i - 1 : 0] : null;
                      redraw();
                      break;
                    }
                  }
                }
               */
            });
        },
        getDragBehaviours: function(){
            var that = this;

            // Set the behavior for each part
            // of the drag.
            drag = d3.behavior.drag()
                .on("dragstart", function() {
                    // Empty the coords array.
                    coords = [];
                    svg = d3.select(this);

                    // If a selection line already exists,
                    // remove it.
                    svg.select(".selection").remove();

                    // Add a new selection line.
                    svg.append("path").attr({"class": "selection"});
                })
                .on("drag", function() {
                    // Store the mouse's current position
                    coords.push(d3.mouse(this));

                    svg = d3.select(this);

                    // Change the path of the selection line
                    // to represent the area where the mouse
                    // has been dragged.
                    svg.select(".selection").attr({
                        d: that.line(coords)
                    });

                })
                .on("dragend", function() {
                    svg = d3.select(this);
                    // If the user clicks without having
                    // drawn a path, remove any paths
                    // that were drawn previously.
                    if (coords.length === 0) {
                        d3.selectAll("svg path").remove();

                        return;
                    }

                    // Draw a path between the first point
                    // and the last point, to close the path.
                    /*
                    svg.append("path").attr({
                        "class": "terminator",
                        d: that.line([coords[0], coords[coords.length-1]])
                    });*/


                    var currentPath = d3.selectAll("svg path").attr("d");
                    var finalPath = currentPath + " " + that.line([coords[0], coords[coords.length-1]]);
                    d3.selectAll("svg path").attr("d", finalPath)


                    svg.select(".selection").attr("class", "selection selectioncomplete");
                    that.simplifyShape($(".selection"));
                });

            return drag;
        },



        simplifyShape: function(svg){
            console.log("simplifier");

            var points = svg.attr("d");

            var epsilon = 10;
            var path = path_from_svg(points);
            var simp = path_simplify(path, epsilon);

            var points1 = svg_to_path(simp);

           $(".selectioncomplete").attr("d", points1);


            function path_simplify_r(path, first, last, eps) {
                if (first >= last - 1) return [path[first]];

                var px = path[first][0];
                var py = path[first][1];

                var dx = path[last][0] - px;
                var dy = path[last][1] - py;

                var nn = Math.sqrt(dx*dx + dy*dy);
                var nx = -dy / nn;
                var ny = dx / nn;

                var ii = first;
                var max = -1;

                for (var i = first + 1; i < last; i++) {
                    var p = path[i];

                    var qx = p[0] - px;
                    var qy = p[1] - py;

                    var d = Math.abs(qx * nx + qy * ny);
                    if (d > max) {
                        max = d;
                        ii = i;
                    }
                }

                if (max < eps) return [path[first]];

                var p1 = path_simplify_r(path, first, ii, eps);
                var p2 = path_simplify_r(path, ii, last, eps);

                return p1.concat(p2);
            }

            function path_simplify(path, eps) {
                var p = path_simplify_r(path, 0, path.length - 1, eps);
                return p.concat([path[path.length - 1]]);
            }

            function path_draw(path, cx, color) {
                cx.strokeStyle = color;
                cx.beginPath();
                cx.moveTo(2*path[0][0], 2*path[0][1]);

                for (var i = 1; i < path.length; i++) {
                    var p = path[i];
                    cx.lineTo(2*p[0], 2*p[1]);
                }
                cx.stroke();
            }

            function path_from_svg(svg) {
                var pts = svg.split(/[ML]/);
                var path = [];

                console.log(pts.length);
                for (var i = 1; i < pts.length; i++) {
                    path.push(pts[i].split(","));
                }

                return path;
            }

            function svg_to_path(path) {
                return "M" + path.join("L");
            }



        }

    }





shapeSelector.init();



}());
