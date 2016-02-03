#!/usr/bin/env node
(function() {
  'use strict';

  var program = require('commander');

  program
      .version('0.2.1')
      .description('Description:\n\n    ' + 'Build & serve the application locally for different environments.\n\n    ' +
          'If [env] is not supplied, the environment will be assumed based on\n    ' + 'the active node environment.\n\n    ' +
          'If the $NODE_ENV environment variable does not exist,\n    ' + 'it will use `development` as the assumed environment.\n\n    ' +
          'Everything but `development` and `production` will be rejected.\n\n    ' +
          'There are also command-specific options. Use `help [command]` for details.')
      .command('install', 'install dependencies necessary to use lodocs')
      .command('build [env]', 'build the app for the correponding [env]')
      .command('serve [port]', 'serve the app locally on the corresponding [port]')
      .command('release', 'download releases, generate documentation, run test suite, deploy')
      .parse(process.argv);

  // @TODO is there a better way to do this?
  if (!program.runningCommand) {
    console.error('\n  error: unknown command: `' + process.argv[2] + '`\n');
    process.exit(1);
  }
})();

