require('./bower_components/bootstrap/dist/css/bootstrap.css');
require('./bower_components/bootstrap/dist/css/bootstrap-theme.css');
require('../css/main.css');

function* gen() {
	yield 1;
	yield 2;
	yield 3;
	yield 4;
}

var o = gen();
console.log(o.next());
console.log(o.next());
console.log(o.next());
console.log(o.next());
