define('ember-awesome-macros/math/floor', ['exports', 'ember-macro-helpers/curried-computed'], function (exports, _curriedComputed) {
        'use strict';

        Object.defineProperty(exports, "__esModule", {
                value: true
        });
        exports.default = (0, _curriedComputed.default)(Math.floor);
});