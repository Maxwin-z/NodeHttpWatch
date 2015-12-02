var _ = require('underscore');

/*
{
    uid: [messages]
}
*/
var msgMap = {};
var rspMap = {};

function fireResponse(uid) {
    var rsp = rspMap[uid];
    var msgs = msgMap[uid];

    if (_.isEmpty(rsp)) {
        console.log('rsp is empty');
        return;
    }

    if (_.isEmpty(msgs)) {
        console.log('msgs is empty');
        return;
    }

    rsp.end(JSON.stringify(msgs));
    // clear msgs
    msgMap[uid] = [];
}

module.exports = {
    addMsg: function(uid, msg) {
        console.log('add msg to uid', uid);
        var msgs = msgMap[uid] || [];
        msgs.push(msg);
        msgMap[uid] = msgs;
        fireResponse(uid);
    },

    addRsp: function(uid, rsp) {
        console.log('add uid:', uid);
        rspMap[uid] = rsp;
        fireResponse(uid);
    },

    removeRsp: function(uid) {
        console.log('remove uid', uid);
        delete rspMap[uid];
    }
}
