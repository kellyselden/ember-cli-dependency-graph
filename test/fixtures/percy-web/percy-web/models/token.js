define('percy-web/models/token', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({
    token: _emberData.default.attr(),
    role: _emberData.default.attr(),
    createdAt: _emberData.default.attr('date'),
    updatedAt: _emberData.default.attr('date'),

    project: _emberData.default.belongsTo('project', { inverse: 'tokens' })
  });
});