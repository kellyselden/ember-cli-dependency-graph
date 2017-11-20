define('ghost-admin/validators/slack-integration', ['exports', 'ghost-admin/validators/base'], function (exports, _base) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var isBlank = Ember.isBlank;
    exports.default = _base.default.create({
        properties: ['url'],

        url: function url(model) {
            var url = model.get('url');
            var hasValidated = model.get('hasValidated');

            // eslint-disable-next-line camelcase
            if (!isBlank(url) && !validator.isURL(url, { require_protocol: true })) {
                model.get('errors').add('url', 'The URL must be in a format like https://hooks.slack.com/services/<your personal key>');

                this.invalidate();
            }

            hasValidated.addObject('url');
        }
    });
});