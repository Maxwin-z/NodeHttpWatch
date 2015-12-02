var http = require('http');

var noneHttpProxy = require('./components/none-http-proxy');
var httpProxy = require('./components/http-proxy');

var server = http.createServer(httpProxy).listen(8888);
server.on('connect', noneHttpProxy);
