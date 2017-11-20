define('travis/mirage/models/commit', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Model.extend({
    build: (0, _emberCliMirage.belongsTo)('build', { inverseOf: 'commit' }),
    committer: (0, _emberCliMirage.belongsTo)('git-user'),
    author: (0, _emberCliMirage.belongsTo)('git-user'),
    job: (0, _emberCliMirage.belongsTo)('job')
  });
});