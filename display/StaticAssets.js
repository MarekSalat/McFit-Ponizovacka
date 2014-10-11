

var StaticAssets = (function () {

    var background = new PIXI.Sprite(PIXI.Texture.fromImage("img/components/bg.png"));
    var castle = new PIXI.Sprite(PIXI.Texture.fromImage("img/components/castle.png"));
    var pillary_bg = new PIXI.Sprite(PIXI.Texture.fromImage("img/components/pillary_bg.png"));
    var pillary_holes = new PIXI.Sprite(PIXI.Texture.fromImage("img/components/pillary_holes.png"));
    var pillary_line = new PIXI.Sprite(PIXI.Texture.fromImage("img/components/pillary_line.png"));
    var sinner = new PIXI.Sprite(PIXI.Texture.fromImage("img/components/sinner.png"));

    function StaticAssets(stage, renderer, $window) {
        this.stage = stage;
        this.renderer = renderer;
        this.$window = $window;

        this.pillary_graphics = new PIXI.Graphics();
        this.pillary_graphics.addChild(pillary_bg);
        this.pillary_graphics.addChild(pillary_holes);
        this.pillary_graphics.addChild(pillary_line);
        this.pillary_graphics.addChild(sinner);

        this.graphics = new PIXI.Graphics();
        this.graphics.addChild(background);
        this.graphics.addChild(castle);
        this.graphics.addChild(this.pillary_graphics);

        this.stage.addChild(this.graphics);
    }

    StaticAssets.prototype.render = function (delta) {

        //this.graphics.clear();
        //this.graphics.beginFill(0xf39c12, 0.5);
        //this.graphics.drawCircle(100, 100 , 10);
    };
    return StaticAssets;
})();