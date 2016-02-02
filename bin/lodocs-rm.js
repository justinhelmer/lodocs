#!/usr/bin/env node
(function() {
  'use strict';

  var path = require('path');
  var program = require('commander');
  var open = require('../lib/open');

  program
      .option('-q, --quiet', 'output nothing (suppress STDOUT and STDERR)')
      .option('-v, --verbose', 'output additional information; takes precedence over `-q')
      .parse(process.argv);

  require('gh-release-manager')(program.args[0] || 'suite', {
    paths: {
      docs: path.resolve(__dirname, '../docs'),
      jsdoc: path.resolve(__dirname, '../node_modules/.bin/jsdoc'),
      releases: path.resolve(__dirname, '../releases')
    },
    quiet: program.quiet,
    verbose: program.verbose
  });

  require('node-clean-exit')({verbose: program.verbose});
})();

