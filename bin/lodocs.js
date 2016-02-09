#!/usr/bin/env node
(function() {
  'use strict';

  var program = require('commander');

  program
      .version('0.5.0')
      .description('Description:\n\n    ' + 'Build, test & release the Lodash website.\n    ' +
          'Use `help [command]` for command-specific usage details.')
      .command('build', 'build the app for deployment')
      .command('serve', 'serve the app for debugging / development')
      .parse(process.argv);

  // @TODO is there a better way to do this?
  if (!program.runningCommand) {
    console.error('\n  error: unknown command: `' + process.argv[2] + '`\n');
    process.exit(1);
  }
})();

