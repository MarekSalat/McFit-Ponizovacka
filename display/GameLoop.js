/**
 * Created by Marek on 10. 10. 2014.
 */


var Flyable = (function () {
    var MAX_SIZE = 150,
        MIN_SIZE = 10,
        SPEED = 0.003;

    function Flyable(stage, renderer, $window, path, onAnimationEnd) {
        this.stage = stage;
        this.renderer = renderer;
        this.$window = $window;
        this.path = path;
        this.onAnimationEnd = onAnimationEnd;
        this.position = {
            x: this.path.start.x,
            y: this.path.start.y-MAX_SIZE
        };
        this.speed = SPEED;
        this.t = 0;
        this.graphics = new PIXI.Graphics();

        this.stage.addChild(this.graphics);
    }

    Flyable.prototype.render = function (delta) {

        this.graphics.clear();

        this.t += this.speed*delta;
        this.t = this.t > 1 ? 1 : this.t;

        var u = {
            x: this.path.end.x - this.path.start.x,
            y: this.path.end.y - this.path.start.y
        };

        this.graphics.beginFill(0xf39c12, 0.5);
        var x = this.path.start.x + this.t*u.x,
            y = this.path.start.y + this.t*u.y;

        this.graphics.drawCircle(x, y , (1-this.t)*MAX_SIZE + MIN_SIZE);
    };
    return Flyable;
})();


var Game = (function () {
    function Game($window) {
        var _this = this;

        this.$window = $window;

        // create an new instance of a pixi stage
        this.stage = new PIXI.Stage(0xecf0f1, true);
        this.stage.setInteractive(false);

        // create a renderer instance
        // the 5the parameter is the anti aliasing
        this.renderer = PIXI.autoDetectRenderer($window.innerWidth, $window.innerHeight, null);

        // set the canvas width and height to fill the screen
        this.renderer.view.style.width = $window.innerWidth + "px";
        this.renderer.view.style.height = $window.innerHeight + "px";
        this.renderer.view.style.display = "block";

        // add render view to DOM
        $('#foo').append(this.renderer.view);

        this.prev = Date.now();
        function animate() {
            var current = Date.now();
            var delta = current - _this.prev;
            _this.prev = current;

            _this.render(delta);

            _this.renderer.render(_this.stage);
            requestAnimFrame( animate );
        }

        this.staticAssets = new StaticAssets(this.stage, this.renderer,this.$window);
        this.flyables = [];
        this.graphics = new PIXI.Graphics()

        requestAnimFrame(animate);
    }

    Game.prototype.render = function (delta) {
        this.graphics.beginFill(0xf39c12, 0.5);

        this.staticAssets.render(delta);

        this.flyables.forEach(function (flyable) {
            if(flyable && flyable.render)
                flyable.render(delta);
        })
    };

    Game.prototype.throw = function(data){
        var _this = this;
        var path = {
            start: {
                x: _this.$window.innerWidth/2,
                y: _this.$window.innerHeight
            },
            end: {
                x: Math.random()*_this.$window.innerWidth,
                y: Math.random()*_this.$window.innerHeight
            }
        };

        this.flyables.push(new Flyable(this.stage, this.renderer, this.$window, path), function (flyable) {
            _this.flyables.splice(_this.flyables.indexOf(flyable));
        });
    };

    return Game;
})();