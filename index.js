var screen_w = 640
  , screen_h = 480
  , container = document.getElementById("container")
  , canvas = document.createElement("canvas")
  ;

canvas.width = screen_w;
canvas.height = screen_h;
canvas.style.border = "solid black 1px";
container.appendChild(canvas);
var ctx = canvas.getContext('2d');
var GREEN = 'green', RED = 'red', BLACK = 'black';
var PI = Math.PI, cos = Math.cos, sin = Math.sin, tan = Math.tan;
var floor = Math.floor, ceil = Math.ceil;
var W = "west", N = "north", E = "east", S = "south";


// (x, y) is orthonormal and regular - (Ox, Oy) = PI / 2
function draw_pixel(x, y, color) {
    if (color === undefined) { color = BLACK; }
    ctx.fillStyle = color;
    ctx.fillRect(x, screen_h - y, 1, 1);
}


function Level(map) {
    this.map = map;
}

Level.prototype.get_square = function(x, y) {
    return self.map[self.map.length - y - 1][x];
};


// 0 means empty, 1 means full
var map = [
  [1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1],
]
var level = new Level(map);


function Player(x, y, dir) {
    this.x = x || 1.5;
    this.y = y || 1.5;
    this.dir = dir || PI / 4;
}

// Player direction always in [0; 2*PI[
Player.prototype.get_dir() {
    return normalize_angle(this.dir);
}

function normalize_angle(alpha) {
    while (alpha < 0) {
        alpha += 2 * PI;
    }
    while (alpha >= 2 * PI) {
        alpha -= 2 * PI;
    }
    return alpha;
}


/**
 * Game-specific variables
 */
// Field of view, defined as Lateral ("width") and height angles
var fov_w = PI / 2;
var fov_h = PI / 2;

player = new Player(1.5, 1.5, PI / 4);



// Casts ray from point [xp, yp] at angle alpha
// Returns [[x, y], dir] where [x, y] is the coordinate of the intercepting wall
// and dir is one of W, N, E, S
function cast_ray(xp, yp, alpha) {
    alpha = normalize_angle(alpha);

    if (alpha === 0) { return [[ceil(xp), yp], W]; }
    if (alpha === PI / 2) { return [[xp, ceil(yp)], N]; }
    if (alpha === PI) { return [[floor(xp), yp], E]; }
    if (alpha === 3 * PI / 2) { return [[xp, floor(yp)], S]; }


}








