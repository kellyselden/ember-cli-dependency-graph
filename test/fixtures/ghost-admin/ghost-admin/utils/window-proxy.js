define("ghost-admin/utils/window-proxy", ["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = {
        changeLocation: function changeLocation(url) {
            window.location = url;
        },
        replaceLocation: function replaceLocation(url) {
            window.location.replace(url);
        },
        replaceState: function replaceState(params, title, url) {
            window.history.replaceState(params, title, url);
        }
    };
});