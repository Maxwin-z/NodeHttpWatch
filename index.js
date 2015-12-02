var URL = require('url');
var http = require('http');
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

// handle
app.use(express.static('public'));

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('server start'.green, host + ':' + port);
});

