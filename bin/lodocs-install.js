#!/usr/bin/env node
(function() {
  'use strict';

  require('../lib/fork')(require('path').resolve(__dirname, '../install.sh'), [], {exit: true});
})();

