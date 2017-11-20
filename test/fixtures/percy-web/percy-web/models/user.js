define('percy-web/models/user', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({
    userHash: _emberData.default.attr(),
    login: _emberData.default.attr(),
    name: _emberData.default.attr(),
    email: _emberData.default.attr(),
    avatarUrl: _emberData.default.attr(),
    githubId: _emberData.default.attr(),
    githubUrl: _emberData.default.attr(),
    lastSyncedAt: _emberData.default.attr('date'),
    lastPrivateSyncedAt: _emberData.default.attr('date'),

    // These endpoints are only available on the current user and should not be accessed otherwise.
    // Note: the {inverse: null} is important here to avoid the github-bot-user relation on
    // organizations from being auto filled-in by ember data.
    organizations: _emberData.default.hasMany('organizations', { inverse: null }),

    createdAt: _emberData.default.attr('date'),
    updatedAt: _emberData.default.attr('date')
  });
});