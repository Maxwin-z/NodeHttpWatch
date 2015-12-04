require('bower_components/bootstrap/dist/css/bootstrap.css');
require('bower_components/bootstrap/dist/css/bootstrap-theme.css');
require('src/css/main.css');

require('babel-polyfill/dist/polyfill');

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

var obj = {
	name: 'obj',
	foo: function () {
		(() => {
			console.log(this.name);
		})();
	}
}

obj.foo();

var [a, ,b] = [1,2,3];

console.log(a, b);

function foo(a = 1) {
	console.log(a);
}

foo();

function g({name: x}) {
  console.log(x);
}
g({name: 5})

