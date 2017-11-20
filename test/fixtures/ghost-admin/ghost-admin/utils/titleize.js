define('ghost-admin/utils/titleize', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    exports.default = function (input) {
        var words = input.split(' ').map(function (word, index) {
            if (index === 0 || lowerWords.indexOf(word) === -1) {
                word = capitalize(word);
            }

            return word;
        });

        return words.join(' ');
    };

    var capitalize = Ember.String.capitalize;

    var lowerWords = ['of', 'a', 'the', 'and', 'an', 'or', 'nor', 'but', 'is', 'if', 'then', 'else', 'when', 'at', 'from', 'by', 'on', 'off', 'for', 'in', 'out', 'over', 'to', 'into', 'with'];
});