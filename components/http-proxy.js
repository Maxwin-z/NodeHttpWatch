var http = require('http');
var net = require('net');

var Code = require('./code');
var MQ = require('./message-queue');

var getHostPortFromString = require("./utils").getHostPortFromString;

var recordId = 0;

var debugging = false;

function getUid(req) {
    return "test";
}

var listener = function httpUserRequest(userRequest, userResponse) {
    var id = ++recordId;
    var requestBuffer = new Buffer(0);
    var responseBuffer = new Buffer(0);

    console.log('  > request: %s', userRequest.url);

    var uid = getUid(userRequest);

    var hostport = getHostPortFromString(userRequest.headers.host, 80);

    // have to extract the path from the requested URL
    var path = userRequest.url;
    var result = /^[a-zA-Z]+:\/\/[^\/]+(\/.*)?$/.exec(userRequest.url);
    if (result) {
        if (result[1].length > 0) {
            path = result[1];
        } else {
            path = "/";
        }
    }

    var options = {
        'host': hostport[0],
        'port': hostport[1],
        'method': userRequest.method,
        'path': path,
        'agent': userRequest.agent,
        'auth': userRequest.auth,
        'headers': userRequest.headers
    };

    MQ.addMsg(uid, {
        id: id,
        code: Code.RequestStart,
        data: options
    });

    if (debugging) {
        console.log('  > options: %s', JSON.stringify(options, null, 2));
    }

    var proxyRequest = http.request(
        options,
        function(proxyResponse) {
            if (debugging) {
                console.log('  > request headers: %s', JSON.stringify(options.headers, null, 2));
            }

            if (debugging) {
                console.log('  < response %d headers: %s', proxyResponse.statusCode, JSON.stringify(proxyResponse.headers, null, 2));
            }

            userResponse.writeHead(
                proxyResponse.statusCode,
                proxyResponse.headers
            );

            MQ.addMsg(uid, {
                id: id,
                code: Code.ResponseStart,
                data: {
                    statusCode: proxyResponse.statusCode,
                    headers: proxyResponse.headers
                }
            })

            proxyResponse.on(
                'data',
                function(chunk) {
                    if (debugging) {
                        console.log('  < chunk = %d bytes', chunk.length);
                    }
                    userResponse.write(chunk);
                    responseBuffer = Buffer.concat([responseBuffer, chunk]);
                }
            );

            proxyResponse.on(
                'end',
                function() {
                    if (debugging) {
                        console.log('  < END');
                    }
                    userResponse.end();
                    MQ.addMsg(uid, {
                        id: id,
                        code: Code.ResponseEnd,
                        data: responseBuffer.toString('base64')
                    })
                }
            );
        }
    );

    proxyRequest.on(
        'error',
        function(error) {
            userResponse.writeHead(500);
            userResponse.write(
                "<h1>500 Error</h1>\r\n" +
                "<p>Error was <pre>" + error + "</pre></p>\r\n" +
                "</body></html>\r\n"
            );
            userResponse.end();
        }
    );

    userRequest.addListener(
        'data',
        function(chunk) {
            if (debugging) {
                console.log('  > chunk = %d bytes', chunk.length);
            }
            requestBuffer = Buffer.concat([requestBuffer, chunk]);
            proxyRequest.write(chunk);
        }
    );

    userRequest.addListener(
        'end',
        function() {
            proxyRequest.end();
            MQ.addMsg(uid, {
                id: id,
                code: Code.RequestEnd,
                data: requestBuffer.toString('base64')
            })
        }
    );
}

module.exports = listener;
