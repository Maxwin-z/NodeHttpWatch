var webpack = require('webpack');
var path = require('path');

var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

var providePlugin = new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery",
    _: 'underscore',
});

var context = path.join(__dirname, '/');

var jqueryPath = path.join(context, '/bower_components/jquery/jquery-2.1.4/dist/jquery.js');
var underscorePath = path.join(context, '/bower_components/underscore/underscore-1.8.3/underscore.js');
var bootstrapPath = path.join(context, '/bower_components/bootstrap/dist/js/bootstrap.js');
var reactPrefix = path.join(context, '/bower_components/react/react-bower-0.14.3/');

module.exports = {
    context: context,
    entry: {
        vendor: [
            jqueryPath,
            underscorePath,
            bootstrapPath
        ],

        'index': './src/index.js',
    },
    output: {
        path:  path.join(__dirname, 'public/js/'),
        publicPath: '/js/',
        filename: '[name].js'
    },
    module: {
        loaders: []
    },
    resolveLoader: {
        alias: {
        }
    },
    resolve: {
        root: [context],
        // modulesDirectories: ['js'],
        extensions: ["", ".js", ".html"],
        alias: {
            'jquery': jqueryPath,
            'react': path.join(reactPrefix, '/react.js'),
            'react-dom': path.join(reactPrefix, '/react-dom.js')
        }
    },
    plugins: [
        new CommonsChunkPlugin('vendor', "vendor.js"),
        providePlugin,
    ]
};
