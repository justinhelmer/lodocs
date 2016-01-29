(function() {
  'use strict';

  var _ = require('lodash');
  var chalk = require('chalk');
  var pluralize = require('pluralize');
  var program = require('commander');

  function exit(children) {
    process.stdin.resume();

    process.on('exit', exitHandler);
    process.on('SIGINT', _.partial(exitHandler, {exit: 2}));
    process.on('uncaughtException', _.partial(exitHandler, {exit: 99}));

    function exitHandler(options, err) {
      if (err && err.stack) {
        console.error(chalk.red(err));
        process.exit(1);
      }

      if (_.get(children, 'length')) {
        if (program.verbose) {
          console.log('Killing ' + chalk.bold.blue(children.length + '') + ' background ' + pluralize('process', children.length) + '...');
        }

        _.invoke(children, 'kill');
        children = [];
      }

      if (_.get(options, 'exit')) {
        process.exit(options.exit);
      }
    }
  }

  module.exports = exit;
})();
