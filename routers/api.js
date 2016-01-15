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
	var decoder = req.body.decoder;
	res.end('parse');
});

module.exports = router;
