var router = require('express').Router(); 

var MQ = require('../components/message-queue');

router.get('/loop', function (req, res) {
	var uid = req.cookies.uid;

	res.on('finish', function () {
		MQ.removeRsp(uid);
	});

	MQ.addRsp(uid, res);
	setTimeout(function () {
		res.end('[]');
	}, 30000);
});

router.post('/parse', function (req, res) {
	var decode = req.body.decode;
	var record = req.body.record;
	var decoder = require('../decoder/' + decode);
	console.log(decoder);
	decoder.decode(record.requestHeaders.path, record.responseBody, function (err, data) {
		res.end(data || err);
	}, record.requestHeaders.headers, record.responseHeaders);
	// res.end('parse' + data);
});

module.exports = router;
