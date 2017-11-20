define('ghost-admin/helpers/gh-count-words', ['exports', 'ghost-admin/utils/word-count'], function (exports, _wordCount) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var helper = Ember.Helper.helper;
    exports.default = helper(function (params) {
        if (!params || !params.length) {
            return;
        }

        var markdown = params[0] || '';

        if (/^\s*$/.test(markdown)) {
            return '0 words';
        }

        var count = (0, _wordCount.default)(markdown);

        return count + (count === 1 ? ' word' : ' words');
    });
});