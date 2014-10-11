/**
 * Created by Marek on 10. 10. 2014.
 */


var Flyable = (function () {
    var MAX_SIZE = 2,
        MIN_SIZE = 0.1,
        SPEED = 0.003;

    var potatoTexture = PIXI.Texture.fromImage("/img/components/rajce.png");
    var potatoSmashedTextture = PIXI.Texture.fromImage("/img/components/rajce_end.png");
    var potatoSmudgeTexture = PIXI.Texture.fromImage("/img/components/rajce_end2.png");

    function Flyable(stage, renderer, $window, path, onAnimationEnd) {
        this.stage = stage;
        this.renderer = renderer;
        this.$window = $window;
        this.path = path;
        this.speed = SPEED;
        this.t = 0;
        this.state = 'ON_MY_WAY';

        this.potatoSprites = {
            normal: new PIXI.Sprite(potatoTexture),
            smashed: new PIXI.Sprite(potatoSmashedTextture),
            smudge: new PIXI.Sprite(potatoSmudgeTexture)
        }
        this.sprite = this.potatoSprites.normal;// create a new Sprite using the texture

        // center the sprites anchor point
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;

        // move the sprite t the center of the screen
        this.sprite.position.x = this.path.start.x;
        this.sprite.position.y = this.path.start.y;

        this.sprite.rotation = Math.random()*2*Math.PI - Math.PI;

        this.stage.addChild(this.sprite);
    }

    Flyable.prototype.changeSprite =  function (to){
        to.anchor.x = 0.5;
        to.anchor.y = 0.5;

        to.scale.x = MIN_SIZE;
        to.scale.y = MIN_SIZE;

        to.position.x = this.path.end.x;
        to.position.y = this.path.end.y;

        to.rotation = this.sprite.rotation;

        var i = this.stage.children.indexOf(this.sprite);
        this.stage.addChildAt(to, i);
        this.stage.removeChild(this.sprite);
        this.sprite = to;
    };

    Flyable.prototype.render = function (delta) {
        this.t += this.speed*delta;
        if (this.state === 'ON_MY_WAY' && this.t > 1) {
            this.state = 'smashed';
            this.changeSprite(this.potatoSprites.smashed)
            this.t = 3000;
            return;
        }
        if (this.state === 'smashed'){
            this.t -= delta;
            if(this.t < 0){
                this.state = 'smudge';
                this.changeSprite(this.potatoSprites.smudge);
            }
            return;
        }
        if(this.state === 'smudge'){
            return;
        }

        this.t = this.t > 1 ? 1 : this.t;

        this.sprite.rotation += 0.002*delta;

        var u = {
            x: this.path.end.x - this.path.start.x,
            y: this.path.end.y - this.path.start.y
        };

        var x = this.path.start.x + this.t*u.x,
            y = this.path.start.y + this.t*u.y;

        this.sprite.position.x = x;
        this.sprite.position.y = y;

        this.sprite.scale.x = (1-this.t)*MAX_SIZE + MIN_SIZE;
        this.sprite.scale.y = this.sprite.scale.x;

    };
    return Flyable;
})();


var Game = (function () {
    function Game($window) {
        var _this = this;

        this.$window = $window;

        // create an new instance of a pixi stage
        this.stage = new PIXI.Stage(0xecf0f1, true);

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
        this.flyablesContainer = new PIXI.DisplayObjectContainer();
        this.stage.addChild(this.flyablesContainer);

        this.flyablesMask = new PIXI.Graphics();
        this.flyablesMask.position.x = $window.innerWidth / 2;
        this.flyablesMask.position.y = $window.innerHeight / 2;
        this.flyablesMask.lineStyle(0);

        this.flyablesContainer.mask = this.flyablesMask;

        this.stage.addChild(this.flyablesMask);

        requestAnimFrame(animate);
    }

    Game.prototype.render = function (delta) {

        var _this = this;

        this.staticAssets.render(delta);

        this.flyables.forEach(function (flyable) {
            if(flyable && flyable.render)
                flyable.render(delta);

            _this.flyablesMask.clear();
            _this.flyablesMask.beginFill(0x8bc5ff, 0.4);
            _this.flyablesMask.moveTo(200, -400);
            _this.flyablesMask.lineTo(1200 , -400);
            _this.flyablesMask.lineTo(1200, 400) ;
            _this.flyablesMask.lineTo(-1200, 400) ;
            _this.flyablesMask.lineTo(-1200, -400);
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
                x: data.pageX || Math.random()*_this.$window.innerWidth,
                y: data.pageY || Math.random()*_this.$window.innerHeight
            }
        };

        this.flyables.push(new Flyable(this.flyablesContainer, this.renderer, this.$window, path), function (flyable) {
            _this.flyables.splice(_this.flyables.indexOf(flyable));
        });
    };

    return Game;
})();