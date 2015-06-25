simplifications


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








//http://en.wikipedia.org/wiki/Ramer-Douglas-Peucker_algorithm

function DouglasPeucker(PointList[], epsilon)
    // Find the point with the maximum distance
    dmax = 0
    index = 0
    end = length(PointList)
    for i = 2 to ( end - 1) {
        d = shortestDistanceToSegment(PointList[i], Line(PointList[1], PointList[end]))
        if ( d > dmax ) {
            index = i
            dmax = d
        }
    }
    // If max distance is greater than epsilon, recursively simplify
    if ( dmax > epsilon ) {
        // Recursive call
        recResults1[] = DouglasPeucker(PointList[1...index], epsilon)
        recResults2[] = DouglasPeucker(PointList[index...end], epsilon)

        // Build the result list
        ResultList[] = {recResults1[1...end-1] recResults2[1...end]}
    } else {
        ResultList[] = {PointList[1], PointList[end]}
    }
    // Return the result
    return ResultList[]
end
*/
















