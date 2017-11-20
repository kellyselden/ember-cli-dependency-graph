define('percy-web/mirage/factories/project', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Factory.extend({
    isEnabled: true,
    name: function name(i) {
      return 'Project ' + i;
    },
    slug: function slug() {
      return this.name.underscore();
    },
    fullSlug: function fullSlug() {
      return this.organization.slug + '/' + this.slug;
    }
  });
});