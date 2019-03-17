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
    var row = self.map[self.map.length - y - 1];
    if (row) {
        return self.map[self.map.length - y - 1][x];
    } else {
        return undefined;
    }
};

Level.prototype.is_wall = function (x, y) {
    return (this.get_square(floor(x), floor(y)) !== 0);
}


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
Player.prototype.get_dir = function() {
    return normalize_angle(this.dir);
}



/**
 * Game-specific variables
 */
// Field of view, defined as Lateral ("width") and height angles
var fov_w = PI / 2;
var fov_h = PI / 2;

var wall_h = 3 / 4;
var eye_h = wall_h * 2 / 3;

player = new Player(1.5, 1.5, PI / 4);



// Get next grid edge when casting ray from point [xp, yp] at angle alpha
// Returns [[x, y], dir] where [x, y] is the coordinate of the intercepting wall
// and dir is one of W, N, E, S
function next_edge(xp, yp, alpha) {
    alpha = normalize_angle(alpha);
    var xm = floor(xp), xM = xm + 1;
    var ym = floor(yp), yM = ym + 1;

    if (xp == xm && alpha > PI / 2 && alpha < 3 * PI / 2) {
        xm -= 1;
        xM -= 1;
    }

    if (yp == ym && alpha > PI) {
        ym -= 1;
        yM -= 1;
    }

    if (alpha === 0) { return [[xM, yp], E]; }
    if (alpha === PI / 2) { return [[xp, yM], N]; }
    if (alpha === PI) { return [[xm, yp], W]; }
    if (alpha === 3 * PI / 2) { return [[xp, ym], S]; }

    var touches = {};  // Is (xp, yp) already on one or two edges?
    touches[E] = (xp == xM);
    touches[W] = (xp == xm);
    touches[N] = (yp == yM);
    touches[S] = (yp == ym);

    var t = tan(alpha);
    var walls = {};
    walls[E] = [xM, yp + t * (xM - xp)];
    walls[N] = [xp + (yM - yp) / t, yM];
    walls[W] = [xm, yp + t * (xm - xp)];
    walls[S] = [xp + (ym - yp) / t, ym];

    dir_v = vector_from_angle(alpha);

    var candidates = Object.keys(walls)
    .map(x => [walls[x], x])
    .map(x => [[x[0][0] - xp, x[0][1] - yp], x[1]])
    .map(x => [scalar_product(x[0], dir_v), x[1]])
    .map(x => [x[0] < 0 ? Infinity : x[0], x[1]])
    .map(x => [touches[x[1]] ? Infinity : x[0], x[1]])

    var min = Infinity, res;
    for (var i = 0; i < candidates.length; i += 1) {
        if (min > candidates[i][0]) {
            res = candidates[i][1];
            min = candidates[i][0];
        }
    }

    return [walls[res], res];
}


// Assumes player is not in a wall
function cast_ray(xp, yp, alpha) {
    var res;

    while (true) {
      res = next_edge(xp, yp, alpha);
      xp = res[0][0];
      yp = res[0][1];
      if (level.is_wall(xp, yp)) { break; }
    }

    return res;
}


function display_frame(xp, yp) {
    var alpha, casted, d, alpha_b, alpha_t, alpha_fov_b, alpha_fov_t;

    for (var x = 0; x < screen_w; x += 1) {
      alpha = atan(((screen_w / 2 - x) / (screen_w / 2)) * tan(fov_w));
        casted = cast_ray(xp, yp, alpha);

        d = distance(xp, yp, casted[0][0], casted[0][1])

        alpha_b = atan(eye_h / d);
        alpha_t = atan((wall_h - eye_h) / d);

        if (alpha_b <= fov_h / 2) {
          alpha_fov_b = fov_h / 2 - alpha_b;
        } else {
          alpha_b = fov_h / 2;
          alpha_fov_b = 0;
        }

        if (alpha_t <= fov_h / 2) {
          alpha_fov_t = fov_h / 2 - alpha_t;
        } else {
          alpha_t = fov_h / 2;
          alpha_fov_b = 0;
        }

        for (var y = 0; y < screen_h; y += 1) {
          if (y / screen_h < alpha_fov_b / fov_h) {
                draw_pixel(x, y, BLACK);
          } else if (y / screen_h < (alpha_fov_b + alpha_b + alpha_t) / fov_h) {
                if (casted[1] === W) {
                  draw_pixel(x, y, 'lightgreen');
                } else {
                  draw_pixel(x, y, GREEN);
                }
          } else {
                draw_pixel(x, y, BLACK);
          }

        }


    }


}








