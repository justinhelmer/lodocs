(function() {
  'use strict';

  var gulp = require('gulp');
  var path = require('path');

  // All task definitions
  gulp.task('build', ['copyCSS']);
  gulp.task('copyCSS', copyCSS);

  // Set up the src path relative to the working directory
  var srcPath = path.resolve('source');

  // Change working directory to the location of the gulpfile, else gulp will not work correctly
  process.chdir(path.resolve(__dirname));

  function copyCSS() {
    var files = [
      'node_modules/normalize-scss/sass/**',
      'node_modules/support-for/sass/_support-for.scss'
    ];

    return gulp.src(files).pipe(gulp.dest(srcPath + '/css'));
  }
})();
