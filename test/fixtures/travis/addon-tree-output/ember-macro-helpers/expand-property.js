define('ember-macro-helpers/expand-property', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (property) {
    var newPropertyList = [];
    expandProperties(property, function (expandedProperties) {
      newPropertyList = newPropertyList.concat(expandedProperties);
    });
    return newPropertyList;
  };

  var expandProperties = Ember.expandProperties;
});