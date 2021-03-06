require('bower_components/bootstrap/dist/css/bootstrap.css');
require('bower_components/bootstrap/dist/css/bootstrap-theme.css');
require('src/css/main.css');

var Code = require('components/code');
var Util = require('components/utils');
var RecordTpl = _.template($('#tpl-record').html().trim());
var recordTable = $('#records-table');
var records = {};
var currentRecord = null;

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

// entry
loop();

function loop() {
    $.getJSON('/api/loop')
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
    records[id] = record;
    record.status = message.code;

    switch (message.code) {
        case Code.RequestStart:
            record.requestHeaders = data;
            break;
        case Code.RequestEnd:
            record.requestBody = data;
            break;
        case Code.ResponseStart:
            record.statusCode = data.statusCode;
            record.responseHeaders = data.headers;
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
    if (dom.length === 0 && record.status === Code.RequestStart) {
        dom = initRecordDom(record);
    }

    if (record.status === Code.ResponseStart) {
        dom.find('.code').html(record.statusCode);
    }

    if (record.status === Code.ResponseEnd) {
        dom.find('.elapse').html('');
    }
}

function initRecordDom(record) {
    var method = record.requestHeaders.method;
    var host = record.requestHeaders.host;
    var port = record.requestHeaders.port;
    var path = record.requestHeaders.path;

    var dom = $(RecordTpl({
        id: record.id,
        method: method,
        hostname: host + (port === 80 ? '' : ':' + port),
        path: path,
        start: formatTime()
    }));
    var needScroll = shouldScrollToBottom();
    recordTable.append(dom);
    if (needScroll) {
        $('#left').scrollTop($('#left').get(0).scrollHeight);
    }

    dom.find('.elapse').append($('<span class="loading">'));
    dom.find('a').click(function () {
        detail(record.id);
    })
    return dom;
}

function shouldScrollToBottom() {
    var threshold = 50;
    var el = $('#left');
    var contentHeight = el.get(0).scrollHeight;
    return contentHeight - el.height() - el.scrollTop() < threshold;
}

function formatTime(date = new Date()) {
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();

    min = min > 9 ? min : '0' + min;
    sec = sec > 9 ? sec : '0' + sec;

    return [hour, min, sec].join(':');
}

function detail(id) {
    console.log(records[id]);
    var record = records[id];
    var host = record.requestHeaders.host;
    var port = record.requestHeaders.port;
    var path = record.requestHeaders.path;
    var url = 'http://' + host + (port === 80 ? '' : ':' + port) + path;

    currentRecord = record;
    autoSelectDecode(record);
    doParse();

    $('#text-url').val(url).fixheight();
    $('#text-request-headers').val(JSON.stringify(record.requestHeaders.headers, true, 4)).fixheight();
    $('#text-request-body').val(record.requestBody).fixheight();
    $('#text-response-headers').val(JSON.stringify(record.responseHeaders, true, 4)).fixheight();
    // $('#text-response-body').val(record.responseBody).fixheight();
}

function autoSelectDecode(record) {
    var type = Util.getHeader(record.responseHeaders, 'content-type');
    if (type.indexOf('image/') === 0) {
        $('#response-box a[href="#response-image"]').tab('show')
    } else {
        $('#response-box a[href="#response-plain"]').tab('show')
    }
}

$.fn.fixheight = function () {
    var el = $(this);
    el.height(0).height((el.get(0).scrollHeight));
    return el;
}


$('#response-box a[data-toggle="tab"]').on('show.bs.tab', function (e) {
    doParse($(e.target).parent().attr('data-decode'));
})

function doParse(decode) {
    decode = decode || $('#response-box > ul > li.active').attr('data-decode');
    console.log(decode);
    if (!currentRecord) return ;

    if (decode == 'image') {
        $('#response-' + decode + ' img').attr('src', 'data:image/png;base64,' + currentRecord.responseBody);
        return ;
    }

    $.post('/api/parse', {
        decode: decode,
        record: currentRecord
    }, function (data) {
        var textarea = $('#response-' + decode + ' textarea');
        textarea.val(data).fixheight();
    })
}


