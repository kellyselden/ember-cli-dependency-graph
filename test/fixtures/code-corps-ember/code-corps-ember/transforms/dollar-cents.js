define('code-corps-ember/transforms/dollar-cents', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Transform = _emberData.default.Transform;
  exports.default = Transform.extend({
    deserialize: function deserialize(serialized) {
      return serialized / 100;
    },
    serialize: function serialize(deserialized) {
      return Math.floor(deserialized * 100);
    }
  });
});