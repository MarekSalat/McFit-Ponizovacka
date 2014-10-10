var underscore = angular.module('underscore', []);




underscore.factory('_', function() {
    return window._; // assumes underscore has already been loaded on the page
});

var gameModule = angular.module('Foo', ['underscore']);

var GameController = (function(){
    function GameController($scope, $timeout, $window, _) {
        var _this = this;

        this.$scope = $scope;
        this.$timeout = $timeout;
        this.$window = $window;
        this.connection = null;
        this._ = _;
        this.game = {};

        this.$scope.players = [];
        this.$scope.throws = 0;

        $window.addEventListener("load", function () {
            var connection = new WebSocket("ws://" + $window.location.hostname + ":8081");

            connection.onopen = _this.onopen.bind(_this);
            connection.onclose = _this.onclose.bind(_this);
            connection.onerror = _this.onerror.bind(_this);
            connection.onmessage = _this.onmessage.bind(_this);

            _this.connection = connection;

            _this.game = new Game(_this.$window);
        });

        this.messageTypeToFunction = {
            CONTROLLER_NEW: this.onNewController.bind(_this),
            CONTROLLER_CONNECTION_CLOSE: this.onControllerClose.bind(_this),
            CONTROLLER_THROW: this.onControllerThrow.bind(_this)
        };
    }

    GameController.prototype.onopen = function(){
        this.connection.send('I_AM_DISPLAY');
    };

    GameController.prototype.onclose = function () {
        console.log("Connection closed");
    };

    GameController.prototype.onerror = function () {
        console.error("Connection error");
    };

    GameController.prototype.onmessage = function (event) {
        var _this = this;
        this.$timeout(function() {
            if(!event.data)
                return;
            var data = JSON.parse(event.data);
            console.log('onmessage |> '+data);

            if(!data || !data.type || !_this.messageTypeToFunction[data.type])
                return;

            _this.messageTypeToFunction[data.type](data);
        });
    };

    GameController.prototype.onNewController = function (data) {
        var _this = this;
        console.log(data);
        this.$timeout(function () {
            _this.$scope.players.push(data);
        })
    };

    GameController.prototype.onControllerClose = function (data) {
        var _this = this;
        console.log(data);

        this.$timeout(function () {
            _this.$scope.players = _.without(_this.$scope.players, _.findWhere(_this.$scope.players, {key: data.key}));
        })
    };

    GameController.prototype.onControllerThrow = function(data) {
        var _this = this;
        console.log(data);

        if(!_.findWhere(_this.$scope.players, {key: data.key}))
            return;

        this.$timeout(function () {
            _this.$scope.throws++;
            _this.game.throw(data);
        })
    };

    return GameController;
})();

gameModule.controller('GameController', ['$scope', '$timeout', '$window', '_', GameController]);