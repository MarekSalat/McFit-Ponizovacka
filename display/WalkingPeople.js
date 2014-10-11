/**
 * Created by vendy on 11.10.14.
 */

var WalkingPerson = (function () {

    var images = ["/img/components/person3.png", "/img/components/person4.png", "/img/components/person5.png", "/img/components/person8.png"];

    function WalkingPeople(stage, renderer, $window) {
        this.stage = stage;
        this.renderer = renderer;
        this.$window = $window;

        this.t = 0;
        this.speed = Math.random() + 1;
        this.start_y = this.$window.innerHeight + 100;
        this.direction = Math.random() - 0.5;

        var i = Math.floor(Math.random() * (images.length -1));
        this.person = new PIXI.Sprite(PIXI.Texture.fromImage(images[i]));

        this.person.scale = new PIXI.Point(0.8, 0.8);
        this.person.anchor = new PIXI.Point(0.5, 1);

        if(this.direction > 0) {
            this.start_x = -this.person.width;
        }
        else {
            this.start_x = this.$window.innerWidth + this.person.width;
        }

        this.person.position.x = this.start_x;
        this.person.position.y = this.start_y;

        this.graphics = new PIXI.Graphics();
        this.graphics.addChild(this.person);
        this.stage.addChild(this.graphics);
    }

    WalkingPeople.prototype.ishit = function (x,y) {

        var xx = x;
        var yy = y;

        var x = this.person.position.x;
        var y = this.person.position.y;
        var w = this.person.width;
        var h = this.person.height;

        var polygon = new PIXI.Rectangle(x - w/2,y - h,w,h);
        return polygon.contains(xx,yy);
    };

    WalkingPeople.prototype.render = function (delta) {
        this.t += this.speed*delta;

        var w = this.$window.innerWidth;
        var h = this.$window.innerHeight;

        if(this.direction > 0) {
            this.person.position.x = this.t * 0.5;
            this.person.position.y = this.start_y - Math.abs(Math.sin(this.person.position.x / 100)) * 100;
        }
        else {
            this.person.position.x = this.start_x - this.t * 0.5;
            this.person.position.y = this.start_y - Math.abs(Math.sin(this.person.position.x / 100)) * 100;
        }
    };

    return WalkingPeople;
})();