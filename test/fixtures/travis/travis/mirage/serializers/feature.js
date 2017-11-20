define('travis/mirage/serializers/feature', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Serializer.extend({
    serialize: function serialize(object) {
      if (Ember.isArray(object.models)) {
        return {
          '@type': 'features',
          '@href': '/features',
          '@representation': 'standard',
          features: object.models.map(function (feature) {
            return feature.attrs;
          })
        };
      } else {
        var metadata = {
          '@type': 'features',
          '@href': '/features',
          '@representation': 'standard'
        };
        return Ember.merge(metadata, object.attrs);
      }
    }
  });
});