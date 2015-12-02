var router = require('express').Router(); 

var MQ = require('../components/message-queue');

router.get('*', function (req, res, next) {
	var uid = req.cookies['uid'];

	res.on('finish', function () {
		MQ.removeRsp(uid);
	});

	MQ.addRsp(uid, res);
	setTimeout(function () {
		res.end('[]');
	}, 30000);
});

module.exports = router;
