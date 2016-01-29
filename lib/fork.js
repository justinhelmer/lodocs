(function() {
  'use strict';

  var _ = require('lodash');
  var chalk = require('chalk');
  var forever = require('forever-monitor');
  var program = require('commander');

  var STDIN = 0;
  var STDOUT = 1;
  var STDERR = 2;

  var children = [];

  function fork(command, args, options) {
    args = _.union([command], args || []);
    options = options || {};

    if (program.verbose) {
      console.log(chalk.bold.green('Launching child process:') + '\n\n    ' + chalk.white(args.join(' ')) + '\n');
    }

    var customOptions = ['exit', 'stdio'];
    var child = new (forever.Monitor)(args, _.extend({
      max: 1,
      silent: true,
      watch: false
    }, _.omit(options, customOptions)));

    if (!program.quiet) {
      var stdio = _.isArray(options.stdio) ? options.stdio : ['inherit', 'inherit', 'inherit'];

      if (stdio[STDIN] === 'inherit') {
        child.on('stdin', function(data) {
          console.log('asfasf');
          process.stdin.write(data);
        });
      }

      if (stdio[STDOUT] === 'inherit') {
        child.on('stdout', function(data) {
          process.stdout.write(data.toString('utf8'));
        });
      }

      if (stdio[STDERR] === 'inherit') {
        child.on('stderr', function(data) {
          process.stderr.write(data.toString('utf8'));
        });
      }
    }

    if (_.get(options, 'exit')) {
      child.on('exit:code', _.ary(process.exit, 1));
    }

    child.on('error:code', _.ary(process.exit, 1));
    child.start();

    children.push(child);
    return child;
  }

  require('../lib/exit')(children);

  module.exports = fork;
})();
