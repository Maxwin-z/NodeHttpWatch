require('bower_components/bootstrap/dist/css/bootstrap.css');
require('bower_components/bootstrap/dist/css/bootstrap-theme.css');
require('src/css/main.css');

var Code = require('components/code');
var RecordTpl = _.template($('#tpl-record').html().trim());
var recordTable = $('#records-table');
var records = {};

var Record = {
    id: 123,
    status: Code.RequestStart,
    start: new Date(),
    requestHeaders: {
        host: 'www.dianping.com',
        path: '/shop/123456?x=1'
    },
    requestBody: 'base64 data',
    responseHeaders: {
        // ...
    },
    responseBody: 'base64 data'
}

function loop() {
    $.getJSON('/loop')
        .done(messages => {
            _.each(messages, handleMessage);
            setTimeout(loop, 0);
        })
        .fail(err => {
            console.log(err);
            setTimeout(loop, 0);
        })
}

function handleMessage(message) {
    var id = message.id;
    var data = message.data;

    var record = records[id] || {
        id: id
    };
    record.status = message.code;

    switch (message.code) {
        case Code.RequestStart:
            record.requestHeaders = data;
            break;
        case Code.RequestEnd:
            record.requestBody = data;
            break;
        case Code.ResponseStart:
            record.responseHeaders = data;
            break;
        case Code.ResponseEnd:
            record.responseBody = data;
            break;
        default:
            break;
    }

    renderRecord(record);
}

function renderRecord(record) {
    var dom = $('#record-' + record.id);
    if (dom.length === 0) {
        var method = record.requestHeaders.method;
        var host = record.requestHeaders.host;
        var port = record.requestHeaders.port;
        var path = record.requestHeaders.path;

        dom = $(RecordTpl({
            id: record.id,
            method: method,
            hostname: host + (port === 80 ? '' : ':' + port),
            path: path,
            start: formatTime()
        }));
        recordTable.append(dom);

        dom.find('.elapse').append($('<div class="loading">'));
    }
}

function formatTime(date = new Date()) {
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();

    min = min > 9 ? min : '0' + min;
    sec = sec > 9 ? sec : '0' + sec;

    return [hour, min, sec].join(':');
}

loop();
