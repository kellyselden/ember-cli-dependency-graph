define('code-corps-ember/mirage/factories/github-event', ['exports', 'ember-cli-mirage', 'moment'], function (exports, _emberCliMirage, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Factory.extend({
    action: _emberCliMirage.faker.hacker.verb,
    eventType: _emberCliMirage.faker.hacker.noun,
    failureReason: _emberCliMirage.faker.hacker.phrase,
    insertedAt: _moment.default.utc(),
    status: _emberCliMirage.faker.hacker.ingverb
  });
});