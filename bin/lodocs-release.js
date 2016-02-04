#!/usr/bin/env node
(function() {
  'use strict';

  var _ = require('lodash');
  var chalk = require('chalk');
  var cjsErr = require('commander.js-error');
  var grm = require('gh-release-manager');
  var path = require('path');
  var program = require('commander');
  var open = require('../lib/open');

  program
      .description('Description:\n\n    Download releases, generate documentation, build site, deploy.')
      .option('-o, --opts [path]', 'the path to a conf file; cli args take precedence')
      .option('-d, --docs [path]', 'the path to output documentation; defaults to ../docs')
      .option('-k, --keep [path]', 'the path to keep releases; else they are removed')
      .option('-p, --path [path]', 'release-relative path to the JSDoc file; assumes index.js')
      .option('-q, --quiet', 'output nothing (suppress STDOUT and STDERR)')
      .option('-r, --recent <n>', 'only parse documentation for the <n> most recent releases')
      .option('-v, --verbose [n]', 'true for more output; higher number (ie 2) for even more', false)
      .parse(process.argv);

  grm('release', _.pick(program, ['docs', 'keep', 'opts', 'path', 'quiet', 'recent', 'verbose']))
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

