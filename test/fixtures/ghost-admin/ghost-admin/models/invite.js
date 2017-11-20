define('ghost-admin/models/invite', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-data/relationships'], function (exports, _model, _attr, _relationships) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var service = Ember.inject.service;
    exports.default = _model.default.extend({
        token: (0, _attr.default)('string'),
        email: (0, _attr.default)('string'),
        expires: (0, _attr.default)('number'),
        createdAtUTC: (0, _attr.default)('moment-utc'),
        createdBy: (0, _attr.default)('number'),
        updatedAtUTC: (0, _attr.default)('moment-utc'),
        updatedBy: (0, _attr.default)('number'),
        status: (0, _attr.default)('string'),
        role: (0, _relationships.belongsTo)('role', { async: false }),

        ajax: service(),
        ghostPaths: service(),

        resend: function resend() {
            var fullInviteData = this.toJSON();

            var inviteData = {
                email: fullInviteData.email,
                role_id: fullInviteData.role
            };

            var inviteUrl = this.get('ghostPaths.url').api('invites');

            return this.get('ajax').post(inviteUrl, {
                data: JSON.stringify({ invites: [inviteData] }),
                contentType: 'application/json'
            });
        }
    });
});