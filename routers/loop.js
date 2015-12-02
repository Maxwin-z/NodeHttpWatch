var router = require('express').Router(); 

router.get('*', function (req, res, next) {
	res.end('this is loop' + req.url);
});

module.exports = router;
