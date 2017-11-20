define('code-corps-ember/models/category', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-data/relationships'], function (exports, _model, _attr, _relationships) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _model.default.extend({
    description: (0, _attr.default)('string'),
    name: (0, _attr.default)('string'),
    slug: (0, _attr.default)('string'),

    userCategories: (0, _relationships.hasMany)('user-category', { async: true }),
    projectCategories: (0, _relationships.hasMany)('project-category', { async: true })
  });
});