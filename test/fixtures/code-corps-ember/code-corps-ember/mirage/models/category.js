define('code-corps-ember/mirage/models/category', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Model.extend({
    projectCategories: (0, _emberCliMirage.hasMany)('project-category'),
    userCategories: (0, _emberCliMirage.hasMany)('user-category')
  });
});