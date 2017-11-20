define('percy-web/models/invite', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({
    isExpired: _emberData.default.attr('boolean'),
    fromUser: _emberData.default.belongsTo('user', { async: false }),
    organization: _emberData.default.belongsTo('organization', { async: false }),

    // Only for creation:
    emails: _emberData.default.attr(),
    role: _emberData.default.attr()
  });
});