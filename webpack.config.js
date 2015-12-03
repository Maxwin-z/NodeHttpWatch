var webpack = require('webpack');
var path = require('path');

var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

var providePlugin = new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery",
    _: 'underscore',
});

var context = __dirname;

module.exports = {
    context: context,
    entry: {
        vendor: [
            './components/jquery',
            './lib/underscore',
            './lib/bootstrap',
        ],

        // 'index': './index.js',
        'add-user': './pages/add-user.js',
        'departments': './pages/departments.js',
        'groups': './pages/groups.js',
        'login': './pages/login.js',
        'relationship': './pages/relationship.js',
        'renlifang-index': './pages/renlifang-index.js',
        'renlifang-profile': './pages/renlifang-profile.js',
        'renlifang-search': './pages/renlifang-search.js',
        'role-manager': './pages/role-manager.js',
        'user-authority': './pages/user-authority.js',
    },
    output: {
        path:  path.join(__dirname, '_build/js/'),
        publicPath: '/js/',
        filename: '[name].js'
    },
    module: {
        loaders: [{
            test: /\.html?$/,
            loader: 'tpl-loader'
        }, {
            test: /jquery\.js$/,
            loader: 'expose?$!expose?jQuery'
        }]
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
            'jquery': context + 'lib/jquery',
            'underscore': context + 'lib/underscore',
            'bootstrap': context + 'lib/bootstrap',
        }
    },
    plugins: [
        new CommonsChunkPlugin('vendor', "vendor.js"),
        providePlugin,
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // })
    ]
};
