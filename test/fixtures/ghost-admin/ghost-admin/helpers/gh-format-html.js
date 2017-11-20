define('ghost-admin/helpers/gh-format-html', ['exports', 'ghost-admin/utils/caja-sanitizers'], function (exports, _cajaSanitizers) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var helper = Ember.Helper.helper;
    var htmlSafe = Ember.String.htmlSafe;
    exports.default = helper(function (params) {
        if (!params || !params.length) {
            return;
        }

        var escapedhtml = params[0] || '';

        // replace script and iFrame
        escapedhtml = escapedhtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '<pre class="js-embed-placeholder">Embedded JavaScript</pre>');
        escapedhtml = escapedhtml.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '<pre class="iframe-embed-placeholder">Embedded iFrame</pre>');

        // sanitize HTML
        /* eslint-disable camelcase */
        escapedhtml = html_sanitize(escapedhtml, _cajaSanitizers.default.url, _cajaSanitizers.default.id);
        /* eslint-enable camelcase */

        return htmlSafe(escapedhtml);
    });
});