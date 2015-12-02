var http = require('http');
var net = require('net');

var getHostPortFromString = require("./utils");

var debugging = true;

var listener = function(request, socketRequest, bodyhead) {
    console.log('request.url', request.url);
    console.log('socketRequest.remoteAddress()', socketRequest.remoteAddress);
    var url = request['url'];
    var httpVersion = request['httpVersion'];

    var hostport = getHostPortFromString(url, 443);

    if (debugging)
        console.log('  = will connect to %s:%s', hostport[0], hostport[1]);

    // set up TCP connection
    var proxySocket = new net.Socket();
    proxySocket.connect(
        parseInt(hostport[1]), hostport[0],
        function() {
            if (debugging)
                console.log('  < connected to %s/%s', hostport[0], hostport[1]);

            if (debugging)
                console.log('  > writing head of length %d', bodyhead.length);

            proxySocket.write(bodyhead);

            // tell the caller the connection was successfully established
            socketRequest.write("HTTP/" + httpVersion + " 200 Connection established\r\n\r\n");
        }
    );

    proxySocket.on(
        'data',
        function(chunk) {
            if (debugging)
                console.log('  < data length = %d', chunk.length);

            socketRequest.write(chunk);
        }
    );

    proxySocket.on(
        'end',
        function() {
            if (debugging)
                console.log('  < end');

            socketRequest.end();
        }
    );

    socketRequest.on(
        'data',
        function(chunk) {
            if (debugging) {

                console.log('  > data length = %d', chunk.length);
            }

            proxySocket.write(chunk);
        }
    );

    socketRequest.on(
        'end',
        function() {
            if (debugging)
                console.log('  > end');

            proxySocket.end();
        }
    );

    proxySocket.on(
        'error',
        function(err) {
            socketRequest.write("HTTP/" + httpVersion + " 500 Connection error\r\n\r\n");
            if (debugging) {
                console.log('  < ERR: %s', err);
            }
            socketRequest.end();
        }
    );

    socketRequest.on(
        'error',
        function(err) {
            if (debugging) {
                console.log('  > ERR: %s', err);
            }
            proxySocket.end();
        }
    );
}

module.exports = listener;
