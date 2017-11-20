define('percy-web/models/snapshot', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({
    comparisons: _emberData.default.hasMany('comparisons', {
      async: false,
      inverse: 'headSnapshot'
    }),
    name: _emberData.default.attr(),
    build: _emberData.default.belongsTo('build', { async: true }),
    screenshots: _emberData.default.hasMany('screenshot', { async: false }),
    createdAt: _emberData.default.attr('date'),
    updatedAt: _emberData.default.attr('date')
  });
});