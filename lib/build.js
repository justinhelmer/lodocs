(function() {
  'use strict';

  var gulp = require('gulp');
  var grm = require('gh-release-manager');
  var Promise = require('bluebird');

  /**
   * Build the website.
   *
   * @name build
   * @param {object} [options] - The configuration options to modify the behavior of the build.
   */
  function build(options) {
    return buldGulp(options).then(buildGRM);
  }

  /**
   * Build operations using GitHub Release Manager. Download & parse releases, generate HTML from markdown, run test suite
   *
   * @name buildGRM
   * @param {object} [options] - The configuration options to modify the behavior of the build.
   */
  function buildGRM(options) {
    return grm('release', options).then(function() {
      return options;
    });
  }

  /**
   * Build operations using Gulp. Copy over vendor assets.
   *
   * @name buildGulp
   * @param {object} [options] - The configuration options to proxy thru the promise chain
   */
  function buldGulp(options) {
    return new Promise(function(resolve, reject) {
      var cwd = process.cwd();
      require('../gulpfile'); // this will change the CWD to the location of the gulpfile

      gulp.on('stop', function() {
        process.chdir(cwd);
        resolve(options);
      });

      gulp.on('err', function(reason) {
        process.chdir(cwd);
        reject(reason.err);
      });

      gulp.start('build');
    });
  }

  module.exports = build;
})();
