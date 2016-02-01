// config.jsx
require('bower_components/bootstrap/dist/css/bootstrap.css');
require('bower_components/bootstrap/dist/css/bootstrap-theme.css');
require('src/css/config.css');
require('bower_components/jsoneditor/dist/jsoneditor.css');

var JSONEditor = require('bower_components/jsoneditor/dist/jsoneditor.js');

console.log(JSONEditor);

var container = document.getElementById('jsoneditor');

var options = {
    mode: 'code',
    modes: ['code', 'form', 'text', 'tree', 'view'], // allowed modes
    onError: function(err) {
        alert(err.toString());
    },
    onModeChange: function(newMode, oldMode) {
        console.log('Mode switched from', oldMode, 'to', newMode);
    }
};

var json = {
    "array": [1, 2, 3],
    "boolean": true,
    "null": null,
    "number": 123,
    "object": {
        "a": "b",
        "c": "d"
    },
    "string": "Hello World"
};

var editor = new JSONEditor(container, options, json);
