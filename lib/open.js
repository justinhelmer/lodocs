(function() {
  'use strict';

  var opn = require('opn');
  var path = require('path');
  var YAML = require('yamljs');

  /**
   * Open the default browser after a specified delay.
   *
   * @param {number} [delay=2] - The number of seconds to wait before opening the browser.
   * @param {string} [url=''] - The relative URL to launch, without the leading slash.
   * @param {number} [port=4000] - The port number.
   */
  function open(delay, url, port) {
    var baseUrl = YAML.load(path.resolve(process.cwd(), './_config.yml')).baseurl + '/' || '/';

    delay = delay || 2;
    url = url || '';
    port = port || 4000;

    setTimeout(function() {
      opn('http://localhost:' + port + baseUrl);
    }, delay * 1000);
  }

  module.exports = open;
})();
