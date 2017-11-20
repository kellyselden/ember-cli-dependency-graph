define('code-corps-ember/mirage/serializers/github-event', ['exports', 'code-corps-ember/mirage/serializers/application'], function (exports, _application) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _application.default.extend({
    serialize: function serialize(modelOrCollection) {
      var _MirageApplicationSer;

      var response = (_MirageApplicationSer = _application.default.prototype.serialize).call.apply(_MirageApplicationSer, [this].concat(Array.prototype.slice.call(arguments)));

      // simulate the pagination links object
      if (modelOrCollection.meta) {
        response.links = modelOrCollection.meta;
      }

      return response;
    }
  });
});