var colors = require('colors');
var express = require('express');
var app = express();

app.use(express.static('public'));

app.all('*', function (req, res) {
	console.log(req.url);
	res.send('Hello world');
});

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('servre start'.green, host + ':' + port);
});



