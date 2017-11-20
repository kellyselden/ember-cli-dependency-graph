define('travis/initializers/services', ['exports', 'travis/utils/tailing', 'travis/utils/to-top'], function (exports, _tailing, _toTop) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  var $ = Ember.$;
  function initialize(app) {
    app.tailing = new _tailing.default($(window), '#tail', '#log');
    app.toTop = new _toTop.default($(window), '.to-top', '#log-container');
  }

  exports.default = {
    name: 'services',
    initialize: initialize
  };
});