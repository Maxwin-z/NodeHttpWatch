module.exports = (function () {
	var cmd = 100;
	return {
		RequestStart: ++cmd,
		RequestData: ++cmd,
		RequestEnd: ++cmd,
		ResponseStart: ++cmd,
		ResponseData: ++cmd,
		ResponseEnd: ++cmd
	};
})();