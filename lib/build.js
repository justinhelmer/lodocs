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
  require('../gulpfile');

  /**
   * Build the website.
   *
   * @name build
   * @param {string} environment - The environmentironment to build. Can be 'development' or 'production'.
   * @param {object} [options] - The configuration options to modify the behavior of the build.
   * @param {number} [options.open] - Launch the site in a browser `n` seconds after it begins being served. Ignored unless 'serve' option is set. Ignored for production.
   * @param {number} [options.port] - Specify a port to serve on, i.e. 'serve port [port]'. Ignored unless 'serve' option is set. Ignored for production.
   * @param {boolean} [options.quiet] - Output nothing (suppress STDOUT and STDERR).
   * @param {boolean} [options.serve] - Serve the app locally on port 4000 when the build completes. Assumes the 'watch' option if not set. Ignored for production.
   * @param {mixed} [options.verbose] - Output additional information. `true` is an alias for '1'. The higher the nubmer, the higher the verbosity level.
   * @param {boolean} [options.watch] - Rebuild automatically when files change. Assumed if 'serve' is set. Ignored for production.
   */
  function build(environment, options) {
    return grm('release', options).then(buildSite);

    function buildSite() {
      return new Promise(function(resolve, reject) {
        options = options || {};
        var serve = options.serve && environment === 'development';
        var verbose = _verbose();

        if (!_.includes(['development', 'production'], environment)) {
          reject(new Error('unknown [environment]: ' + environment));
        }

        console.log();
        gulp.start('build');
        gulp.on('stop', jekyll);
        gulp.on('err', function(reason) {
          reject(reason.err);
        });

        function jekyll() {
          var args, command;

          if (serve) {
            command = 'node';
            args = [path.resolve(__dirname, './lodocs-serve.js')]; // `serve` handles the building as well
          } else {
            command = 'jekyll';
            args = ['build'];
          }

          prepareJekyllArgs(args);

          var port = options.port ? options.port : 4000;
          if (serve && options.open) {
            open(options.open, '', port);
          }

          if (!options.quiet) {
            console.log(chalk.blue('Building...'));
          }

          spork(command, args, {environment: {NODE_ENV: environment}, quiet: !verbose, exit: false})
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
        }

        function prepareJekyllArgs(args) {
          if (verbose && environment === 'production') {
            _.each(['serve', 'port', 'watch'], function(option) {
              if (options[option]) {
                warnOptionIsIgnored(option, '[environment] is `production`');
              }
            });
          }

          if (!serve && environment === 'development') {
            warnIfOptionIsIgnored('port', 'serve', true);
          }

          if (options.watch) {
            if (serve) {
              warnIfOptionIsIgnored('watch', 'serve');
            } else {
              args.push('--watch');
            }
          }

          if (serve && options.port) {
            args.push(options.port);
          }

          if (verbose > 1 && !options.quiet) {
            args.push('--verbose');
          }
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
      });
    }

    function _verbose() {
      if (options.verbose === true || options.verbose === false) {
        return options.verbose;
      }

      var verbose = parseInt(options.verbose);
      if (_.isFinite(verbose)) {
        return verbose;
      }

      return false;
    }
  }

  module.exports = build;
})();
