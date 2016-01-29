(function() {
  'use strict';

  var gulp = require('gulp');
  var jscs = require('gulp-jscs');
  var jshint = require('gulp-jshint');
  var buildPath = '_site';

  gulp.task('build', ['lint', 'copy']);
  gulp.task('lint', lint);
  gulp.task('copy', ['lint'], copy);

  function copy() {
    var files = ['node_modules/normalize.css/normalize.css'];
    gulp.src(files).pipe(gulp.dest(buildPath + '/css'));
  }

  function lint() {
    var files = ['bin/*.js', 'lib/*.js', 'gulpfile.js'];

    return gulp
        .src(files)
        .pipe(jshint())
        .pipe(jscs())
        .pipe(require('gulp-jscs-stylish').combineWithHintResults())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
  }
})();
