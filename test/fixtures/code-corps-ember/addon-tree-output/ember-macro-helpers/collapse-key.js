define('ember-macro-helpers/collapse-key', ['exports', 'ember-macro-helpers/expand-property'], function (exports, _expandProperty) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (property) {
    if (typeof property !== 'string') {
      return [property];
    }

    var atEachIndex = property.indexOf('.@each');
    if (atEachIndex !== -1) {
      return [property.slice(0, atEachIndex)];
    } else if (property.slice(-2) === '[]') {
      return [property.slice(0, -3)];
    }

    return (0, _expandProperty.default)(property);
  };
});