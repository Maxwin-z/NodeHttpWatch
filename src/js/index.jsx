require('bower_components/bootstrap/dist/css/bootstrap.css');
require('bower_components/bootstrap/dist/css/bootstrap-theme.css');
require('src/css/main.css');

require('babel-polyfill/dist/polyfill');

var React = require('react');
var ReactDOM = require('react-dom');

class CommentBox extends React.Component {
    displayName() {
        return 'hi';
    }

    render() {
        return (
            <div className="commentBox">
              {'Hello, world! I am a CommentBox.'} {this.displayName()}
            </div>  
        );
    }
};
ReactDOM.render(
    <CommentBox />,
    document.getElementById('right')
);

var [a, b] = [1, 2];
console.log(1, 2);
