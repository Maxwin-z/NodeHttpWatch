var URL = require('url');
var http = require('http');
var path = require('path');
var colors = require('colors');
var express = require('express');
var app = express();

var cookieParser = require('cookie-parser');

// app.get('/', function (req, res) {
//     res.sendFile(__dirname + '/public/index.html');
// });

// app.use(express.static('public'));

app.use(cookieParser());

app.all('*', function(request, response, next) {
    console.log(request.cookies);
    var cookies = request.cookies;
    if (cookies['uid'] == null) {
        response.cookie('uid', 'o' + Date.now() + Math.random());
    }
    next();
});

app.use('/loop', require('./routers/loop'));

// webpack
var webpackDevMiddleware = require("webpack-dev-middleware");
var webpack = require("webpack");

var config = require("./webpack.config.js");
var compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, {
    contentBase: path.join(__dirname, 'public'),
    hot: true,
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },
    stats: {
        colors: true
    },
    publicPath: '/js/',
    noInfo: false,
    quiet: false,
}));

app.use(express.static('public'));

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('server start'.green, host + ':' + port);
});

// create proxy server

var noneHttpProxy = require('./components/none-http-proxy');
var httpProxy = require('./components/http-proxy');

var proxyServer = http.createServer(httpProxy).listen(8888);
proxyServer.on('connect', noneHttpProxy);
