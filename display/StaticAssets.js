

var StaticAssets = (function () {

    var background = new PIXI.Sprite(PIXI.Texture.fromImage("/img/components/bg.png"), 0, 0);
    var pillary_bg = new PIXI.Sprite(PIXI.Texture.fromImage("/img/components/pillary_bg.jpg"), 0, 0);
    var pillary_line = new PIXI.Sprite(PIXI.Texture.fromImage("/img/components/pillary_line.png"), 0, 0);

    var castle = new PIXI.Sprite(PIXI.Texture.fromImage("/img/components/castle.png"));
    var pillary_holes = new PIXI.Sprite(PIXI.Texture.fromImage("/img/components/pillary_holes.png"));
    var sinner = new PIXI.Sprite(PIXI.Texture.fromImage("/img/components/sinner.png"));

    function StaticAssets(stage, renderer, $window) {
        this.stage = stage;
        this.renderer = renderer;
        this.$window = $window;

        this.pillary_graphics = new PIXI.DisplayObjectContainer();
        this.pillary_graphics.addChild(pillary_bg);
        this.pillary_graphics.addChild(pillary_line);
        this.pillary_graphics.addChild(pillary_holes);
        this.pillary_graphics.addChild(sinner);

        this.graphics = new PIXI.Graphics();
        this.graphics.addChild(background);
        this.graphics.addChild(castle);
        this.graphics.addChild(this.pillary_graphics);

        this.stage.addChild(this.graphics);
    }

    StaticAssets.prototype.render = function (delta) {

        var w = this.$window.innerWidth;
        var h = this.$window.innerHeight;

        background.width = w;
        background.height = h;

        castle.position.x = 100;
        castle.position.y = 50;

        sinner.scale = new PIXI.Point(0.8, 0.8);
        sinner.anchor = new PIXI.Point(0.5, 0.5);

        pillary_holes.scale = new PIXI.Point(0.8, 0.8);
        pillary_holes.anchor = new PIXI.Point(0.5, 0.5);

        pillary_bg.width = w;
        pillary_bg.height = 400;
        pillary_bg.anchor = new PIXI.Point(0.5, 0.5);

        pillary_line.width = w;
        pillary_line.height = 400 * 0.5;
        pillary_line.anchor = new PIXI.Point(0.5, 0.5);

        this.pillary_graphics.position = new PIXI.Point(w/2, h/2);
    };
    return StaticAssets;
})();