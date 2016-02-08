#!/usr/bin/env node
(function() {
  'use strict';

  var _ = require('lodash');
  var chalk = require('chalk');
  var cjsErr = require('commander.js-error');
  var program = require('commander');
  var margin = _.pad('', 19);
  var build = require('../lib/build');

  program
      .option('-o, --open <n>', 'launch the site in a browser `n` seconds after it begins being served\n' + margin +
          '* ignored unless `--serve` is set\n' + margin + '* ignored unless [env] is `development`')
      .option('-p, --port <n>', 'specify a port to to serve on, i.e. `serve [port]`\n' + margin +
          '* ignored unless `--serve` is set\n' + margin + '* ignored unless [env] is `development`')
      .option('-q, --quiet', 'output nothing (suppress STDOUT and STDERR)')
      .option('-s, --serve', 'serve the app locally on port 4000 when the build completes\n' + margin + '* enforces the `--watch` option\n' + margin +
          '* ignored unless [env] is `development`')
      .option('-v, --verbose [n]', 'boolean or number; output additional information.')
      .option('-w, --watch', 'rebuild automatically when files change\n' + margin +
          '* assumed if `--serve` is set\n' + margin + '* ignored unless [env] is `development`')
      .parse(process.argv);

  var options = {
    open: program.open,
    port: program.port,
    quiet: program.quiet,
    serve: program.serve,
    verbose: program.verbose,
    watch: program.watch
  };

  build(options)
      .then(function() {
        console.log('\n' + chalk.green('Done with everything.'));
        process.exit();
      })
      .catch(function(err) {
        if (!options.quiet) {
          if (options.verbose && err.stack) {
            console.error(chalk.red(err.stack));
          } else {
            console.error(chalk.red(err.message));
          }
        }

        process.exit(1);
      })
      .done();

  require('node-clean-exit')({quiet: options.quiet, verbose: options.verbose});
})();
