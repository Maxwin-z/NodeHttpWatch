var gulp = require('gulp');
var gutil = require('gulp-util');
var watch = require('gulp-watch');
var webpack = require("webpack");

gulp.task('html', function() {
  var path = 'src/*.html';
  gulp.src(path)
    .pipe(watch(path))
    .pipe(gulp.dest('public/'));
});

gulp.task('webpack', function(callback) {
  var config = require('./webpack.config.js');

  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: true
    }
  }));

  webpack(require('./webpack.config.js'), function(err, stats) {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({}));
    callback();
  });
});

alert('done');

gulp.task('default', ['html']);
