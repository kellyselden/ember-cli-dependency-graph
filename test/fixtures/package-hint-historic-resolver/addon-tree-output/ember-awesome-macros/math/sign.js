define('ember-awesome-macros/math/sign', ['exports', 'ember-macro-helpers/curried-computed'], function (exports, _curriedComputed) {
        'use strict';

        Object.defineProperty(exports, "__esModule", {
                value: true
        });
        exports.default = (0, _curriedComputed.default)(Math.sign);
});