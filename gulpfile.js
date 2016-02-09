(function() {
  'use strict';

  var gulp = require('gulp');
  var path = require('path');
  var srcPath = path.resolve('source');

  gulp.task('copyCSS', copyCSS);

  function copyCSS() {
    var files = [
      'node_modules/normalize-scss/sass/**',
      'node_modules/support-for/sass/_support-for.scss'
    ];

    return gulp.src(files).pipe(gulp.dest(srcPath + '/css'));
  }
})();
