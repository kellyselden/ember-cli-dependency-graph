define('ghost-admin/mirage/serializers/user', ['exports', 'ghost-admin/mirage/serializers/application', 'ember-cli-mirage'], function (exports, _application, _emberCliMirage) {
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

    exports.default = _application.default.extend({
        serialize: function serialize(object, request) {
            if (this.isCollection(object)) {
                return _application.default.prototype.serialize.apply(this, arguments);
            }

            var _RestSerializer$proto = _emberCliMirage.RestSerializer.prototype.serialize.call(this, object, request),
                user = _RestSerializer$proto.user;

            if (object.postCount) {
                var posts = object.posts.models.length;

                user.count = { posts: posts };
            }

            var roles = _application.default.prototype.serialize.call(this, object.roles, request);

            var _roles$roles = _slicedToArray(roles.roles, 1),
                role = _roles$roles[0];

            if (role) {
                user.roles = [role];
            }

            return { users: [user] };
        }
    });
});