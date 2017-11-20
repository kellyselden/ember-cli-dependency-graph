define('ghost-admin/transforms/facebook-url-user', ['exports', 'ember-data/transform'], function (exports, _transform) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

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

    exports.default = _transform.default.extend({
        deserialize: function deserialize(serialized) {
            if (serialized) {
                var _serialized$match = serialized.match(/(\S+)/),
                    _serialized$match2 = _slicedToArray(_serialized$match, 2),
                    user = _serialized$match2[1];

                return 'https://www.facebook.com/' + user;
            }
            return serialized;
        },
        serialize: function serialize(deserialized) {
            if (deserialized) {
                var _deserialized$match = deserialized.match(/(?:https:\/\/)(?:www\.)(?:facebook\.com)\/(?:#!\/)?(\w+\/?\S+)/mi),
                    _deserialized$match2 = _slicedToArray(_deserialized$match, 2),
                    user = _deserialized$match2[1];

                return user;
            }
            return deserialized;
        }
    });
});