define('ghost-admin/components/gh-input', ['exports', 'ember-one-way-controls/components/one-way-input', 'ghost-admin/mixins/text-input'], function (exports, _oneWayInput, _textInput) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _oneWayInput.default.extend(_textInput.default, {
        classNames: 'gh-input'
    });
});