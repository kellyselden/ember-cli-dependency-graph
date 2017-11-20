define('code-corps-ember/mirage/factories/category', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var String = Ember.String;
  exports.default = _emberCliMirage.Factory.extend({
    name: function name() {
      return _emberCliMirage.faker.name.jobArea();
    },
    slug: function slug() {
      if (this.name) {
        return String.dasherize(this.name.toLowerCase());
      }
    }
  });
});