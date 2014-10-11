var underscore = angular.module('underscore', []);




underscore.factory('_', function() {
    return window._; // assumes underscore has already been loaded on the page
});



var GameController = (function(){
    function GameController($scope, $timeout, $window, _, $interval) {
        var _this = this;

        this.$scope = $scope;
        this.$timeout = $timeout;
        this.$window = $window;
        this.$interval = $interval
        this.connection = null;
        this._ = _;
        this.game = {};

        this.$scope.players = [];
        this.$scope.throws = 0;

        this.$scope.url = 'http://' + $window.location.hostname + ':8042/controller';
        this.$scope.time = 30;
        this.$scope.timerStatus = 'Remain';
        this.$scope.timerVisible = false;
        this.$scope.idleVisible = true;

        this.$scope.totalScore = function (){
            var score = 0;
            _this.$scope.players.forEach(function(player){
                if (player.score){
                    score += player.score;
                }
            });
            return score;
        }

        $window.addEventListener("load", function () {
            var connection = new WebSocket("ws://" + $window.location.hostname + ":8043");

            connection.onopen = _this.onopen.bind(_this);
            connection.onclose = _this.onclose.bind(_this);
            connection.onerror = _this.onerror.bind(_this);
            connection.onmessage = _this.onmessage.bind(_this);

            _this.connection = connection;

            _this.game = new Game(_this.$window);

            // fuuuuuuuuujky fujky
            $('#foo').click(function (e){
                _this.game.throw(e);
            });
        });

        function updateTime() {
            _this.$scope.time -= 1;
            _this.$scope.time = _this.$scope.time < 0 ? 30 : _this.$scope.time;
        }


        this.stopTime = $interval(updateTime, 1000);

        // listen on DOM destroy (removal) event, and cancel the next UI update
        // to prevent updating time after the DOM element was removed.
//        this.on('$destroy', function() {
//            $interval.cancel(_this.stopTime);
//        });

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

    GameController.prototype.resetGame = function () {
        this.$scope.players.forEach(function (player) {
            player.score = 0;
        });
    };

    GameController.prototype.onNewController = function (data) {
        var _this = this;
        console.log(data);
        this.$timeout(function () {
            _this.$scope.idleVisible = false;
            _this.$scope.timerVisible = true;
            _this.$scope.time = 30;

            data.score = 0;
            _this.$scope.players.push(data);
            _this.resetGame();
        })
    };

    GameController.prototype.onControllerClose = function (data) {
        var _this = this;
        console.log(data);

        this.$timeout(function () {
            _this.$scope.players = _.without(_this.$scope.players, _.findWhere(_this.$scope.players, {key: data.key}));

            if (_this.$scope.players.length <= 0){
                _this.$scope.idleVisible = true;
                _this.$scope.timerVisible = false;
            }
        })
    };

    GameController.prototype.onControllerThrow = function(data) {
        var _this = this;
        console.log(data);

        var player = _.findWhere(_this.$scope.players, {key: data.key});
        if(!player)
            return;

        this.$timeout(function () {
            _this.$scope.throws++;
            player.score += _this.game.throw(data);
        })
    };

    return GameController;
})();


var gameModule = angular.module('Foo', ['underscore', 'angular-gestures']);

gameModule.controller('GameController', ['$scope', '$timeout', '$window', '_', '$interval', GameController]);

var ControllerController = (function () {
    function ControllerController($scope, $timeout, $window, _) {
        var _this = this;

        this.$scope = $scope;
        this.$timeout = $timeout;
        this.$window = $window;
        this.connection = null;

        $window.addEventListener("load", function () {
            var nickname = 'Foo';//prompt("Choose a nickname");
            if (!nickname)
                return;

            _this.connection = new WebSocket("ws://" + $window.location.hostname + ":8043");
            _this.connection.onopen = function () {
                _this.connection.send(JSON.stringify({
                    type: 'CONTROLLER_NEW',
                    nickname: nickname
                }));
            };
            _this.connection.onclose = function () {
                console.log("Connection closed");
            };
            _this.connection.onerror = function () {
                console.error("Connection error");
            };
            _this.connection.onmessage = function (event) {
                console.log(event.data);
            };

        });


        this.$scope.isConnectionOpened = function () {
            return _this.connection && _this.connection.readyState === WebSocket.OPEN
        };

        this.$scope.throw = function ($event){
            if(!_this.$scope.isConnectionOpened()) {
                console.log('connection not opend yet');
                return;
            }

            var endX = $event.gesture.srcEvent.pageX || $event.gesture.srcEvent.targetTouches[0].pageX;
                endY = $event.gesture.srcEvent.pageY || $event.gesture.srcEvent.targetTouches[0].pageY;

            console.log($event);

            var e = {
                normX: endX/_this.$window.innerWidth,
                normY: endY/_this.$window.innerHeight
            };

            e.normX = e.normX < 0 ? 0 : e.normX;
            e.normY = e.normY < 0 ? 0 : e.normY;

            e.normX = e.normX > 1 ? 1 : e.normX;
            e.normY = e.normY > 1 ? 1 : e.normY;

            e.normY = 0.7*e.normY + 0.3;

            var request = {
                type: 'CONTROLLER_THROW',
                event: e
            };

            //console.log(request);
            _this.connection.send(JSON.stringify(request));
        };
    };

    return ControllerController;
})();

gameModule.controller('ControllerController', ['$scope', '$timeout', '$window', '_', ControllerController]);