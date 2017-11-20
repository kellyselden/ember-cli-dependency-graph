define('travis/mirage/serializers/commit', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.RestSerializer.extend({
    include: ['committer'],
    embed: true,
    root: false
  });
});