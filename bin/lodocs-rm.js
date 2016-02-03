#!/usr/bin/env node
(function() {
  'use strict';

  var chalk = require('chalk');
  var cjsErr = require('commander.js-error');
  var grm = require('gh-release-manager');
  var path = require('path');
  var program = require('commander');
  var open = require('../lib/open');

  program
      .option('-q, --quiet', 'output nothing (suppress STDOUT and STDERR)')
      .option('-v, --verbose', 'output additional information; takes precedence over `-q')
      .parse(process.argv);

  var options = {
    paths: {
      docs: path.resolve(__dirname, '../docs'),
      jsdoc: path.resolve(__dirname, '../node_modules/.bin/jsdoc'),
      releases: path.resolve(__dirname, '../releases')
    },
    quiet: program.quiet,
    verbose: program.verbose
  };

  grm(program.args[0] || 'suite', options)
      .then(function() {
        console.log('\n' + chalk.green('Done with everything.'));
        process.exit();
      })
      .catch(function(err) {
        if (!program.quiet) {
          cjsErr(err.message);
        }

        if (program.verbose) {
          console.trace();
        }

        process.exit(1);
      })
      .done();

  require('node-clean-exit')({verbose: program.verbose});
})();

