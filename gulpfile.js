(function() {
  'use strict';

  var gulp = require('gulp');
  var path = require('path');

  // All task definitions
  gulp.task('build', ['copyCSS']);
  gulp.task('copyCSS', copyCSS);

  // Set up the build path relative to the working directory
  var buildPath = path.resolve('_site');

  // Change working directory to the location of the gulpfile, else gulp will not work correctly
  process.chdir(path.resolve(__dirname));

  function copyCSS() {
    var files = [
      'node_modules/normalize.css/normalize.css'
    ];

    return gulp.src(files).pipe(gulp.dest(buildPath + '/css'));
  }
})();
