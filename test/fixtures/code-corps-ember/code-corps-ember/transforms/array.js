define('code-corps-ember/transforms/array', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var typeOf = Ember.typeOf;
  var Transform = _emberData.default.Transform;
  exports.default = Transform.extend({
    deserialize: function deserialize(serialized) {
      var type = typeOf(serialized);
      return type === 'array' ? serialized : [];
    },
    serialize: function serialize(deserialized) {
      var type = typeOf(deserialized);
      if (type === 'array') {
        return deserialized;
      } else if (type === 'string') {
        return deserialized.split(',').map(function (item) {
          return item.trim();
        });
      } else {
        return [];
      }
    }
  });
});