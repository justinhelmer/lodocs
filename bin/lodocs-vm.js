#!/usr/bin/env node
(function() {
  'use strict';

  var _ = require('lodash');
  var program = require('commander');
  var unirest = require('unirest');

  program.parse(process.argv);

  unirest
      .get('https://api.github.com/repos/lodash/lodash/tags')
      .headers({
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'justinhelmer/lodocs.github.io'
      })
      .end(function(response) {
        console.log(_(response.body).filter(function(release) {
          return release.name.match(/^\d+[\.\d]+$/);
        }).map('tarball_gz').value());

        //_.each(response.body, prepare);
      });

  require('../lib/exit')();
})();

