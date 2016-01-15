var _ = require('underscore');

var regex_hostport = /^([^:]+)(:([0-9]+))?$/;

function getHostPortFromString(hostString, defaultPort) {
    var host = hostString;
    var port = defaultPort;

    var result = regex_hostport.exec(hostString);
    if (result != null) {
        host = result[1];
        if (result[2] != null) {
            port = result[3];
        }
    }

    return ([host, port]);
}

function getHeader(headers, key) {
    key = key.toLowerCase();
    var val = '';
    _.every(headers, function(v, k) {
        if (k.toLowerCase() === key) {
            val = v;
            return false;
        } else {
            return true;
        }
    });
    return val;
}

function setHeader(headers, key, val) {
    var tk = key.toLowerCase();
    var notset = _.every(headers, function(v, k) {
        if (k.toLowerCase() === tk) {
            headers[k] = val;
            return false;
        } else {
            return true;
        }
    });

    if (notset) {
        headers[key] = val;
    }
}

module.exports = {
    getHostPortFromString: getHostPortFromString,
    getHeader: getHeader,
    setHeader: setHeader
};


