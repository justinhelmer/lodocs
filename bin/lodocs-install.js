#!/usr/bin/env node
(function() {
  'use strict';

  require('spork')(require('path').resolve(__dirname, '../install.sh'), [], {exit: true});
})();

