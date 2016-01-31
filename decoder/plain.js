var zlib = require('zlib');
var Util = require('../components/utils');

// buffer -> string
function decode(url, data, cb, requestHeaders, responseHeaders) {
    var buf = new Buffer(data, 'base64');

    var gzip = Util.getHeader(responseHeaders, 'content-encoding');
    if (gzip.toLowerCase() === 'gzip') {
        zlib.gunzip(buf, function(err, result) {
            cb(err, err ? null : result.toString());
        });
    } else {
        cb(null, buf.toString());
    }
}

// string -> buffer
function encode(url, data, cb, requestHeaders, responseHeaders) {
    var gzip = Util.getHeader(responseHeaders, 'content-encoding');
    if (gzip.toLowerCase() === 'gzip') {
        zlib.gzip(new Buffer(data), function(err, result) {
            cb(err, err ? null : result);
        });
    } else {
    	cb(null, new Buffer(data));
    }
}

module.exports = {
    decode: decode,
    encode: encode
}
