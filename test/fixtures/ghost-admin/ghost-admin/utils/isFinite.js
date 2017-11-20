define("ghost-admin/utils/isFinite", ["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    exports.default = function (value) {
        return window.isFinite(value) && !window.isNaN(parseFloat(value));
    };
});