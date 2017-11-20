define('ghost-admin/helpers/gh-count-characters', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.countCharacters = countCharacters;
    var helper = Ember.Helper.helper;
    var htmlSafe = Ember.String.htmlSafe;
    function countCharacters(params) {
        if (!params || !params.length) {
            return;
        }

        var el = document.createElement('span');
        var content = params[0] || '';

        // convert to array so that we get accurate symbol counts for multibyte chars
        // this will still count emoji+modifer as two chars

        var _Array$from = Array.from(content),
            length = _Array$from.length;

        el.className = 'word-count';

        if (length > 180) {
            el.style.color = '#f05230';
        } else {
            el.style.color = '#738a94';
        }

        el.innerHTML = 200 - length;

        return htmlSafe(el.outerHTML);
    }

    exports.default = helper(function (params) {
        return countCharacters(params);
    });
});