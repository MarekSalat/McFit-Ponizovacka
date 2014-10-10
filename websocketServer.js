
var ws = require("nodejs-websocket");

var I_AM_DISPLAY = 'I_AM_DISPLAY',
    DISPLAY_CONNECTION_CLOSED = 'DISPLAY_CONNECTION_CLOSED',
    CONTROLLER_CONNECTION_CLOSE = 'CONTROLLER_CONNECTION_CLOSE';

var displayConnection;

process.on('uncaughtException', function (err) {
    console.error(err.stack);
    console.log("Node NOT Exiting...");
});

var server = ws.createServer(function (connection) {
    connection.on('text', function (str) {
        // register display
        if(str === I_AM_DISPLAY){
            console.log('register display |> ' + str);

            displayConnection = connection;
            return;
        }

        // request from display, broadcast to all controllers
        if (connection === displayConnection){
            console.log('request from display, broadcast to all controllers |> ' + str);

            broadcast(connection, str);
            return;
        }

        // request from controller, pass it to display
        console.log('request from controller, pass it to display |> ' + str);
        var obj = JSON.parse(str);
        obj.key = connection.key;
        displayConnection.sendText(JSON.stringify(obj));
    });

    connection.on('close', function () {
        // display connection is closing
        if(connection === displayConnection){
            console.log('display is closing connection');
            broadcast(connection, DISPLAY_CONNECTION_CLOSED);
            return;
        }
        console.log('controller is closing connection' + connection.key)
        displayConnection.sendText(JSON.stringify({
            type: CONTROLLER_CONNECTION_CLOSE,
            key: connection.key
        }));
    });
});
server.listen(8081);

function broadcast(sender, str) {
    server.connections.forEach(function (connection) {
        if (connection === sender)
            return;

        console.log('broadcast to ' + connection.key + ' |> ' + str);
        connection.sendText(str);
    })
}