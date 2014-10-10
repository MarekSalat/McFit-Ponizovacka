
var ws = require("nodejs-websocket");

var I_AM_DISPLAY = 'I_AM_DISPLAY';

var displayConnection;

var server = ws.createServer(function (connection) {
    console.log('Websocket server running.');
    connection.nickname = null;
    connection.on('text', function (str) {
        // hello message from display
        if(str === I_AM_DISPLAY){
            displayConnection = connection;
            return;
        }

        if (connection === displayConnection){
            // do job for server
            return;
        }
        // we have controller connection

        // is it new connection?
        if (connection.nickname === null) {
            console.log(str+' entered');
            connection.nickname = str;

            broadcast(connection, str+' entered');

            // send to display that we have new connection
            return;
        }

        broadcast(connection, '['+connection.nickname+'] '+str);
    });

    connection.on('close', function () {
        broadcast(connection.nickname+' left');
    });
});
server.listen(8081);

function broadcast(sender, str) {
    server.connections.forEach(function (connection) {
        //if (connection !== sender)
        console.log('['+connection.nickname+'] '+str);
        connection.sendText(str);
    })
}