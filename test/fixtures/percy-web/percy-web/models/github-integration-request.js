define('percy-web/models/github-integration-request', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({
    state: _emberData.default.attr(),
    createdBy: _emberData.default.belongsTo('user', { async: false }),
    createdAt: _emberData.default.attr('date'),
    updatedAt: _emberData.default.attr('date')
  });
});