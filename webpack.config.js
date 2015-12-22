var webpack = require('webpack');
var path = require('path');

var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var babelPolyfillExtractTextPlugin = require("extract-text-webpack-plugin");

var providePlugin = new webpack.ProvidePlugin({
  $: "jquery",
  jQuery: "jquery",
  _: 'underscore'
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

    'polyfill': path.join(context, 'node_modules/babel-polyfill/dist/polyfill'),
    'index': [
      path.join(context, 'src/js/index.jsx')
      /* , 'webpack-hot-middleware/client'*/
    ]
  },
  output: {
    path: path.join(__dirname, 'public/js/'),
    publicPath: '/js/',
    filename: '[name].js'
  },
  module: {
    loaders: [{
      test: /polyfill.js$/,
      loader: babelPolyfillExtractTextPlugin.extract('raw-loader')
    }, {
      test: /\.jsx$/,
      loader: 'babel',
      query: {
        presets: ['react', 'es2015']
      }
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.(otf|eot|svg|ttf|woff|gif)/,
      loader: 'url-loader?limit=8192'
    }]
  },
  resolveLoader: {
    alias: {}
  },
  resolve: {
    root: [context, path.join(context, 'node_modules')],
    // modulesDirectories: ['js'],
    extensions: ["", ".js", ".jsx", ".html", "css"],
    alias: {
      'jquery': jqueryPath,
      'react': path.join(reactPrefix, '/react.js'),
      'react-dom': path.join(reactPrefix, '/react-dom.js'),
      'react-dom-server': path.join(reactPrefix, '/react-dom-server.js')
    }
  },
  plugins: [
    new CommonsChunkPlugin('vendor', "vendor.js"),
    providePlugin,
    new babelPolyfillExtractTextPlugin("polyfill.js")
    // ,new webpack.HotModuleReplacementPlugin()
  ]
};
