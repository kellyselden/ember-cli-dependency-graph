define('ghost-admin/helpers/gh-count-down-characters', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.countDownCharacters = countDownCharacters;

    var _slicedToArray = function () {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;

            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);

                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }

            return _arr;
        }

        return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    }();

    var helper = Ember.Helper.helper;
    var htmlSafe = Ember.String.htmlSafe;
    function countDownCharacters(params) {
        if (!params || params.length < 2) {
            return;
        }

        var el = document.createElement('span');

        var _params = _slicedToArray(params, 2),
            content = _params[0],
            maxCharacters = _params[1];

        var _Array$from = Array.from(content || ''),
            length = _Array$from.length;

        el.className = 'word-count';

        if (length > maxCharacters) {
            el.style.color = '#E25440';
        } else {
            el.style.color = '#9FBB58';
        }

        el.innerHTML = length;

        return htmlSafe(el.outerHTML);
    }

    exports.default = helper(function (params) {
        return countDownCharacters(params);
    });
});