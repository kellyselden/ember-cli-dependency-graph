define('code-corps-ember/mirage/factories/task', ['exports', 'ember-cli-mirage', 'moment'], function (exports, _emberCliMirage, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Factory.extend({
    body: function body() {
      return _emberCliMirage.faker.lorem.paragraph();
    },
    createdAt: function createdAt(i) {
      return (0, _moment.default)().subtract(i, 'days');
    },
    number: function number(i) {
      return i + 1;
    },
    order: function order() {
      return (this.position || 0) * 100;
    },
    position: function position(i) {
      return i + 1;
    },

    status: 'open',
    title: function title() {
      return _emberCliMirage.faker.lorem.sentence();
    }
  });
});