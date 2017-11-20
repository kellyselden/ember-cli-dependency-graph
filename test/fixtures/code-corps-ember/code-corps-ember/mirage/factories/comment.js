define('code-corps-ember/mirage/factories/comment', ['exports', 'ember-cli-mirage', 'moment'], function (exports, _emberCliMirage, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Factory.extend({
    body: _emberCliMirage.faker.lorem.paragraph,
    createdAt: function createdAt(i) {
      return (0, _moment.default)().subtract(i, 'days');
    }
  });
});