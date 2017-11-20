define('ember-macro-helpers/collapse-key', ['exports', 'ember-macro-helpers/expand-property', 'ember-macro-helpers/-constants'], function (exports, _expandProperty, _constants) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = collapseKey;


  function collapseAndPruneDuplicates(expandedProperties) {
    return expandedProperties.map(collapseKey).reduce(function (properties, collapsedProperties) {
      var uniqueProperties = collapsedProperties.filter(function (collapsedProperty) {
        return properties.indexOf(collapsedProperty) === -1;
      });
      return properties.concat(uniqueProperties);
    }, []);
  }

  function collapseKey(property) {
    if (typeof property !== 'string') {
      return [property];
    }

    var expandedProperties = (0, _expandProperty.default)(property);
    if (expandedProperties.length > 1) {
      return collapseAndPruneDuplicates(expandedProperties);
    }

    var arrayIndex = property.indexOf(_constants.ARRAY_EACH);
    if (arrayIndex === -1) {
      arrayIndex = property.indexOf(_constants.ARRAY_LENGTH);
    }

    if (arrayIndex === 0) {
      // empty string will be handled later by `getValue`
      // and will convert to `this`
      return [''];
    } else if (arrayIndex > 0) {
      return [property.slice(0, arrayIndex - 1)];
    }

    return (0, _expandProperty.default)(property);
  }
});