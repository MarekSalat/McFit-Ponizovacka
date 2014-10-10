/**
 * Created by Marek on 10. 10. 2014.
 */


var Flyable = (function () {
    function Flyable(stage, renderer, $window, path, onAnimationEnd) {
        this.stage = stage;
        this.renderer = renderer;
        this.$window = $window;
        this.path = path;
        this.onAnimationEnd = onAnimationEnd;
        this.state = 'ONMYWAY'
        this.position = {
            x: this.path.start.x,
            y: this.path.start.y
        };
        this.speed = 0.0001;
        this.t = 0;
        this.graphics = new PIXI.Graphics();

        this.stage.addChild(this.graphics);
    }

    Flyable.prototype.render = function (delta) {
        if(!this.state)
            return;

        this.graphics.clear();

        this.t += this.speed*delta;

        if (this.t > 1){
            this.stage.removeChild(this.graphics);
            this.state = '';
        }

        this.graphics.beginFill(0xf39c12, 0.5);
        var x = this.path.start.x + this.t*this.path.end.x,
            y = this.path.start.y + this.t*this.path.end.y;
        this.graphics.drawCircle(x, y , 10);
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

        this.flyables = [];
        this.graphics = new PIXI.Graphics()
        this.stage.addChild(this.graphics);

        requestAnimFrame(animate);
    }

    Game.prototype.render = function (delta) {
        this.graphics.beginFill(0xf39c12, 0.5);
        this.graphics.drawCircle(0, 0 , 10);
        this.graphics.drawCircle(this.$window.innerWidth, 0 , 10);

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
                x: _this.$window.innerWidth/2,
                y: _this.$window.innerHeight*0
            }
        };

        this.flyables.push(new Flyable(this.stage, this.renderer, this.$window, path), function (flyable) {
            _this.flyables.splice(_this.flyables.indexOf(flyable));
        });
    };

    return Game;
})();