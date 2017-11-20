define('code-corps-ember/mirage/serializers/comment', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.JSONAPISerializer.extend({
    include: ['comment-user-mentions']
  });
});