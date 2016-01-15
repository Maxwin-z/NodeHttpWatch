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

var data = 'H4sIAAAAAAAAA5VWbW8TRxD+3H+xXQlsC+7WzrsTn9PmhRYVmghSUT5Fe3tre8nd7XG3Z8ctlSiVotAgEBKhRaAiEJRUbROqpq1IG/przjaf+hc6d36JnYRK/eLz7c7MzvPMszNXmF51bFTlfiCka+CcnsWIu0xawi0bOFQlbQJPFwvvzi3MLl1enEcVBeaLn8ycOzuLsEbIpeFZQuaW5tCnHy6dP4dmaCAYyuk5QuY/xghXlPImCanVanptWJd+mSxdIKtxEM2MTfv/53K6pSxcLCRnQFpuYBwTIJfP59tuGIHRpE3jTJkbO3JqFQsOVxS51OEGrgpe86SvMGLSVdxVBq4JS1UMi1cF41rycjoMuK8FjNrUtLlR5wGE6gtCPc/mmiNNAY8aNzVY0Bj1Yuu+wG0/JZTNi42Xu41HW81nr6Nbe42bG41He82b6wXS3izYwl1BPrcNHKi6zYMK55ChqnuQseKrirAgwKji81IPv3BomQe6y2uBoyrwVMQ9I/3QIZ4dloUbkHZ+hIEvcfQkAikWSJsSU1r1YsESVSQsoMCnHvcBZLzAbBoAz7YsSxR4+G2pgymoQNOO9SnQwWyZz6niukNXqC4cskIuXLo4NraUHwWU1C9zKMOyCXVb6R43lI3ubkWvdps/Poj21qJnLxq7r6OdV//89WXj6/3o+f1o/SXQ2NrfgZXo5Vpz40bjp6etvx+2ntyCrWhvE9YLhALeOE9NG4DmcDdMoPXSJBhRxngQrPC6gbO4+Ob7+2+e/BZHuNa8t9VY/6Px+Hlr52k7XI83Z9mhItZZH2+BhwLOAEficHZu8qRrBt5UQbheqPpqihPmw2W1CqUOxGdQ6lwWk+Ix5maolHQxqlI7BLMPFkBk7SKZCpaly2zBVmIlu5as6bZkVMHl1RPBpEisZnI15H6dpE5ZkoWAX+lA+rzN478z9bNWOpVkksroySGQRxvqOwPQOGvTVpK+A4TFhxiYlCVGcDsqEpQEUYGOwKNuN8USkHn9ZmPjh9b2Vmt7D/RfIPF+sWD6CI45ykv7psa/GAyO4SMITUcAa2/hI849zrADoa9mHdaS+ru0Cpl2dfpfAjgwgsLGmAfEMoSL0fpaAgvEcmBbkZBhn6iGcbH51c+N21uJqA7sSrQq/QHLERDPvd9b39w5ZAlaswcMR4HaG9vN7V8OGUKfgIrTwfPHcPG9xvrdY0197tn1gdDjgOrhd0ftS77grkWkCy0LytOHbwI8nu9HdzYOnZCoL24m4WA+eUD569abe9fT5+kqKDcz6NeZEw617f4mN13ypWM4AyfDtTnSRZovduKqbK5Fj2/HgY+KoNffZi5f0JY4dQZUy6RX90W5Amo+Gf+f6oh2KJvL6uijmYtojlf/l1uuI+Su4voG4UATZ9CHmw/+jPY3o+1bjc3dZE7Q7jUImC+8/jZCrtAqba/iYpX6KEQGzLqqKFMlfT1m//0yXPIpUUqHOjQIvrpQSqfEYkW6PJVBRaTl0LVraGCPWp2dzOe9flHzheJp3BVunH4Ag1yo0IU5lIxEnUmHMJfAC+lg0oJKKDQnhCfXroZEWBPZsfGJ0aGR/LSjjInOdBELF6Ptbxv3X0XbT6HZNn/ciYuGM1NfAO8J5G4Fk35e6KzFeJdNq+Is+lJJJm3Ank4nnwjBJEaGgXrp95qi1zHNoGkEM7UDA6PJzhtggnN7fm3YMUYY8ID/xPBspwaBz4wURqcOZXAKvnEc3aTCChM+KvqV4MTwmTwbL41YeXOcZbPMHKUmHWJjw+NsbISO5EbHxlPt0ZBKxv1BTVMnhufhyA4J8IIzmalOn4c8pG0vyXT2dDYTC7RLVHu4k/irqfgv54Z/H88JAAA=';

module.exports = {
    decode: decode,
    encode: encode
}
