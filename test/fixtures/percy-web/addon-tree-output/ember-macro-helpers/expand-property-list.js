define('ember-macro-helpers/expand-property-list', ['exports', 'ember-macro-helpers/expand-property'], function (exports, _expandProperty) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (propertyList) {
    return propertyList.reduce(function (newPropertyList, property) {
      return newPropertyList.concat((0, _expandProperty.default)(property));
    }, []);
  };
});