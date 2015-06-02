var URL = require('url');
var http = require('http');
var colors = require('colors');
var express = require('express');
var app = express();

app.use(express.static('public'));

app.all('*', function(request, response) {
    console.log(request.connection.remoteAddress);
    var url = request.url;
    var opts = URL.parse(url);
    opts.headers = request.headers;
    delete opts.headers['proxy-connection'];
    opts.method = request.method;

    console.log('proxy:', request.method, url);
    // console.log(opts);
    var proxyRequest = http.request(opts, function(proxyResponse) {
        response.writeHead(proxyResponse.statusCode, proxyResponse.headers);
        proxyResponse.on('data', function(chunk) {
            response.write(chunk, 'binary');
        });
        proxyResponse.on('end', function(chunk) {
            response.end(chunk || null);
        });
    });

    proxyRequest.on('error', function() {
        console.log('proxyRequest.error', arguments);
    });

    request.on('data', function(chunk) {
        proxyRequest.write(chunk);
    });
    request.on('end', function(chunk) {
        proxyRequest.end(chunk || null);
    });
});

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('server start'.green, host + ':' + port);
});
