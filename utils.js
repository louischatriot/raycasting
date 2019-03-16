var PI = Math.PI, cos = Math.cos, sin = Math.sin, tan = Math.tan;
var floor = Math.floor, ceil = Math.ceil;

function normalize_angle(alpha) {
    while (alpha < 0) {
        alpha += 2 * PI;
    }
    while (alpha >= 2 * PI) {
        alpha -= 2 * PI;
    }
    return alpha;
}

function scalar_product(p1, p2, _x2, _y2) {
    if (_x2 === undefined) {
        var x1 = p1[0], y1 = p1[1], x2 = p2[0], y2 = p2[1];
    } else {
        var x1 = p1, y1 = p2, x2 = _x2, y2 = _y2;
    }

    return x1 * x2 + y1 * y2;
}


function vector_from_angle(alpha) {
    return [cos(alpha), sin(alpha)];
}

