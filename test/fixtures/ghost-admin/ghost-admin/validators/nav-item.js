define('ghost-admin/validators/nav-item', ['exports', 'ghost-admin/validators/base'], function (exports, _base) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _base.default.create({
        properties: ['label', 'url'],

        label: function label(model) {
            var label = model.get('label');
            var hasValidated = model.get('hasValidated');

            if (validator.empty(label)) {
                model.get('errors').add('label', 'You must specify a label');
                this.invalidate();
            }

            hasValidated.addObject('label');
        },
        url: function url(model) {
            var url = model.get('url');
            var hasValidated = model.get('hasValidated');
            /* eslint-disable camelcase */
            var validatorOptions = { require_protocol: true };
            /* eslint-enable camelcase */
            var urlRegex = new RegExp(/^(\/|#|[a-zA-Z0-9-]+:)/);

            if (validator.empty(url)) {
                model.get('errors').add('url', 'You must specify a URL or relative path');
                this.invalidate();
            } else if (url.match(/\s/) || !validator.isURL(url, validatorOptions) && !url.match(urlRegex)) {
                model.get('errors').add('url', 'You must specify a valid URL or relative path');
                this.invalidate();
            }

            hasValidated.addObject('url');
        }
    });
});