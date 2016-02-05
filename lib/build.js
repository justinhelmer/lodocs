(function() {
  'use strict';

  var _ = require('lodash');
  var chalk = require('chalk');
  var gulp = require('gulp');
  var path = require('path');
  var Promise = require('bluebird');
  var spork = require('spork');
  var grm = require('gh-release-manager');
  var open = require('../lib/open');

  /**
   * Build the website.
   *
   * @name build
   * @param {object} [options] - The configuration options to modify the behavior of the build.
   */
  function build(options) {
    return buldGulp(options).then(buildGRM).then(buildJekyll);
  }

  /**
   * Build operations using GitHub Release Manager. Download & parse releases.
   *
   * @name buildGRM
   * @param {object} [options] - The configuration options to modify the behavior of the build.
   * @param {boolean} [options.quiet] - Output nothing (suppress STDOUT and STDERR).
   * @param {mixed} [options.verbose] - Output additional information. `true` is an alias for '1'. The higher the nubmer, the higher the verbosity level.
   */
  function buildGRM(options) {
    return grm('release', options).then(function() {
      return options;
    });
  }

  /**
   * Build operations using Gulp. Copy over vendor assets, run linting.
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

  /**
   * Build operations using Jekyll. Generate HTML from markdown files, copy over assets into final site folder.
   *
   * Note this is NOT needed for deploying, because gh-pages uses Jekyll internally.
   * Therefore, all preparation must be done with the exception of Jekyll operations.
   *
   * However, this is still useful for building & serving the application locally.
   *
   * @name buildJekyll
   * @param {object} [options] - The configuration options to modify the behavior of the build.
   * @param {number} [options.open] - Launch the site in a browser `n` seconds after it begins being served. Ignored unless 'serve' option is set. Ignored for production.
   * @param {number} [options.port] - Specify a port to serve on, i.e. 'serve port [port]'. Ignored unless 'serve' option is set. Ignored for production.
   * @param {boolean} [options.quiet] - Output nothing (suppress STDOUT and STDERR).
   * @param {boolean} [options.serve] - Serve the app locally on port 4000 when the build completes. Assumes the 'watch' option if not set. Ignored for production.
   * @param {mixed} [options.verbose] - Output additional information. `true` is an alias for '1'. The higher the nubmer, the higher the verbosity level.
   * @param {boolean} [options.watch] - Rebuild automatically when files change. Assumed if 'serve' is set. Ignored for production.
   */
  function buildJekyll(options) {
    var verbose = _verbose(options.verbose);

    return new Promise(function(resolve, reject) {
      var args, command;

      if (options.serve) {
        command = 'node';
        args = [path.resolve(__dirname, './lodocs-serve.js')]; // `serve` handles the building as well
      } else {
        command = 'jekyll';
        args = ['build'];
      }

      prepareJekyllArgs(args);

      var port = options.port ? options.port : 4000;
      if (options.serve && options.open) {
        open(options.open, '', port);
      }

      if (!options.quiet) {
        console.log(chalk.blue('Building...'));
      }

      spork(command, args, {quiet: !verbose, exit: false})
          .on('exit', function(code) {
            if (code === 0) {
              reject(new Error('serve task failed'));
            } else {
              if (!options.quiet) {
                console.log(chalk.blue('Done'));
              }

              resolve();
            }
          });
    });

    function prepareJekyllArgs(args) {
      var verbose = _verbose(options.verbose);

      if (!options.serve) {
        warnIfOptionIsIgnored('port', 'serve', true);
      }

      if (options.watch) {
        if (options.serve) {
          warnIfOptionIsIgnored('watch', 'serve');
        } else {
          args.push('--watch');
        }
      }

      if (options.serve && options.port) {
        args.push(options.port);
      }

      if (verbose > 1 && !options.quiet) {
        args.push('--verbose');
      }

      /**
       * If an option requires another option to exist (or not exist), warn the user that the option is ignored.
       * Skipped unless in verbose mode.
       *
       * @param {string} option - The option that may or may not be ignored depending on the conditions.
       * @param {string} other - The other option to check for. If this option does not also exist, the first option is ignored.
       * @param {boolean} [flipCondition] - Invert the expectation. The other option must NOT exist, or the first option is ignored.
       */
      function warnIfOptionIsIgnored(option, other, flipCondition) {
        if (verbose && options[option] && other) {
          var isViolated = (!flipCondition && options[other] || flipCondition && !options[other]);

          if (isViolated) {
            warnOptionIsIgnored(option, '`' + chalk.blue('--' + other) + '` is ' + (flipCondition ? 'not ' : '') + 'set');
          }
        }
      }

      function warnOptionIsIgnored(option, reason) {
        if (verbose && option && reason) {
          console.log(chalk.bold.yellow('[WARNING]:') + ' `' + chalk.blue('--' + option) + '` is ignored because ' + reason);
        }
      }
    }
  }

  function _verbose(level) {
    if (level === true || level === false) {
      return level;
    }

    var verbosity = parseInt(level);
    if (_.isFinite(verbosity)) {
      return verbosity;
    }

    return false;
  }

  module.exports = build;
})();
