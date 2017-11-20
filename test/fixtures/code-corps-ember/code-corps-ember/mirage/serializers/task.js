define('code-corps-ember/mirage/serializers/task', ['exports', 'code-corps-ember/mirage/serializers/application'], function (exports, _application) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _application.default.extend({
    include: ['comments', 'comment-user-mentions', 'task-user-mentions'],
    serialize: function serialize(modelOrCollection) {
      var _MirageApplicationSer;

      var response = (_MirageApplicationSer = _application.default.prototype.serialize).call.apply(_MirageApplicationSer, [this].concat(Array.prototype.slice.call(arguments)));

      // this is how we simulate the paging meta object
      if (modelOrCollection.meta) {
        response.meta = modelOrCollection.meta;
      }

      return response;
    }
  });
});