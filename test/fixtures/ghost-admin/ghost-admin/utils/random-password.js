define("ghost-admin/utils/random-password", ["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    exports.default = function () {
        var word = generatePassword(6);
        var randomN = Math.floor(Math.random() * 1000);

        return word + randomN;
    };
});