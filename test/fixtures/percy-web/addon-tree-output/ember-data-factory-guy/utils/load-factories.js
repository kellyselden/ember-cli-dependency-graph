define('ember-data-factory-guy/utils/load-factories', ['exports', 'ember-data-factory-guy/utils/helper-functions'], function (exports, _helperFunctions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function () {
    (0, _helperFunctions.requireFiles)(factoryFileRegExp);
  };

  var factoryFileRegExp = new RegExp('/tests/factories');
});