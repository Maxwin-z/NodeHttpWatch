function loop() {
    $.getJSON('/loop', function(data) {
        var code = $('<code>');
        code.append(JSON.stringify(data, true, 4));
        $('#logs').append(code);
        setTimeout(loop, 1);
    });
}

loop();
