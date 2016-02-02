#!/usr/bin/env node
(function() {
  'use strict';

  var _ = require('lodash');
  var chalk = require('chalk');
  var cjsErr = require('commander.js-error');
  var gulp = require('gulp');
  var path = require('path');
  var program = require('commander');
  var spork = require('spork');
  var margin = _.pad('', 19);
  var open = require('../lib/open');

  require('../gulpfile');

  program
      .option('-q, --quiet', 'output nothing (suppress STDOUT and STDERR)')
      .option('-v, --verbose', 'output additional information; takes precedence over `-q')
      .option('-s, --serve', 'serve the app locally on port 4000 when the build completes\n' + margin + '* enforces the `--watch` option\n' + margin +
          '* ignored unless [env] is `development`')
      .option('-o, --open <n>', 'launch the site in a browser `n` seconds after it begins being served\n' + margin +
          '* ignored unless `--serve` is set\n' + margin + '* ignored unless [env] is `development`')
      .option('-p, --port <n>', 'specify a port to to serve on, i.e. `serve [port]`\n' + margin +
          '* ignored unless `--serve` is set\n' + margin + '* ignored unless [env] is `development`')
      .option('-w, --watch', 'rebuild automatically when files change\n' + margin +
          '* assumed if `--serve` is set\n' + margin + '* ignored unless [env] is `development`')
      .parse(process.argv);

  var env = program.args[0] || process.env.NODE_ENV;
  env = env || 'development';
  var serve = program.serve && env === 'development';

  if (!_.includes(['development', 'production'], env)) {
    cjsErr('unknown [env]:', env);
    process.exit(1);
  }

  console.log();
  gulp.start('build');
  gulp.on('stop', jekyll);
  gulp.on('err', function(reason) {
    if (!program.quiet) {
      console.error(chalk.red(reason.err.message));
    }

    process.exit(1);
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

    prepareArgs(args);

    var port = program.port ? program.port : 4000;
    if (serve && program.open) {
      open(program.open, '', port);
    }

    spork(command, args, {env: {NODE_ENV: env}, exit: true});
  }

  function prepareArgs(args) {
    if (program.verbose && env === 'production') {
      _.each(['serve', 'port', 'watch'], function(option) {
        if (program[option]) {
          warnOptionIsIgnored(option, '[env] is `production`');
        }
      });
    }

    if (!serve && env === 'development') {
      warnIfOptionIsIgnored('port', 'serve', true);
    }

    if (program.watch) {
      if (serve) {
        warnIfOptionIsIgnored('watch', 'serve');
      } else {
        args.push('--watch');
      }
    }

    if (serve && program.port) {
      args.push(program.port);
    }

    if (program.verbose && !program.quiet) {
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
    if (program.verbose && program[option] && other) {
      var isViolated = (!flipCondition && program[other] || flipCondition && !program[other]);

      if (isViolated) {
        warnOptionIsIgnored(option, '`' + chalk.blue('--' + other) + '` is ' + (flipCondition ? 'not ' : '') + 'set');
      }
    }
  }

  function warnOptionIsIgnored(option, reason) {
    if (program.verbose && option && reason) {
      console.log(chalk.bold.yellow('[WARNING]:') + ' `' + chalk.blue('--' + option) + '` is ignored because ' + reason);
    }
  }
})();
