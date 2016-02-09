#!/usr/bin/env node
(function() {
  'use strict';

  var chalk = require('chalk');
  var program = require('commander');
  var build = require('../lib/build');

  program
      .option('-q, --quiet', 'output nothing (suppress STDOUT and STDERR)')
      .option('-v, --verbose [n]', 'boolean or number; output additional information.')
      .parse(process.argv);

  var options = {
    quiet: program.quiet,
    verbose: program.verbose
  };

  build(options)
      .then(function() {
        if (options.verbose || !options.quiet) {
          console.log('\n' + chalk.green('Done with everything.'));
        }

        process.exit();
      })
      .catch(function(err) {
        if (options.verbose || !options.quiet) {
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
