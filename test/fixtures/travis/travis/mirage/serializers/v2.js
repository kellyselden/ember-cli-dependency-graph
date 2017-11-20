define('travis/mirage/serializers/v2', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.ActiveModelSerializer.extend({
    keyForModel: function keyForModel(modelName) {
      return Ember.String.underscore(modelName);
    },
    keyForCollection: function keyForCollection(modelName) {
      return Ember.String.pluralize(Ember.String.underscore(modelName));
    },


    /**
      * This overrides the Serializer implementation because the latter users
      * .serializerFor, which will never choose the V2 serialiser, since it
      * doesn’t have a request to examine.
      */
    _keyForModelOrCollection: function _keyForModelOrCollection(modelOrCollection) {
      if (this.isModel(modelOrCollection)) {
        return this.keyForModel(modelOrCollection.modelName);
      } else {
        return this.keyForCollection(modelOrCollection.modelName);
      }
    }
  });
});