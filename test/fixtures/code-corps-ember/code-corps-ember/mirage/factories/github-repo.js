define('code-corps-ember/mirage/factories/github-repo', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Factory.extend({
    name: _emberCliMirage.faker.internet.domainWord
  });
});