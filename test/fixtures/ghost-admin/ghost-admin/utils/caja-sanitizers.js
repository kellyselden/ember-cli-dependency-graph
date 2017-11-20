define('ghost-admin/utils/caja-sanitizers', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    /**
     * google-caja uses url() and id() to verify if the values are allowed.
     */
    /**
     * Check if URL is allowed
     * URLs are allowed if they start with http://, https://, or /.
     * NOTE: # urls are not allowed as clicking them will break the editor when clicked
     */
    var url = function url(_url) {
        _url = _url.toString().replace(/['"]+/g, '');
        if (/^https?:\/\//.test(_url) || /^\//.test(_url)) {
            return _url;
        }
    };

    /**
     * Check if ID is allowed
     * All ids are allowed at the moment.
     */
    var id = function id(_id) {
        return _id;
    };

    exports.default = {
        url: url,
        id: id
    };
});