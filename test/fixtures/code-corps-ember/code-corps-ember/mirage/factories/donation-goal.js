define('code-corps-ember/mirage/factories/donation-goal', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Factory.extend({
    amount: _emberCliMirage.faker.list.cycle(10000, 20000, 15020),
    current: true,
    description: _emberCliMirage.faker.lorem.paragraph
  });
});