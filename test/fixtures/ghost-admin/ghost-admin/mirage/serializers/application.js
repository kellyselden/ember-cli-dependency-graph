define('ghost-admin/mirage/serializers/application', ['exports', 'ember-cli-mirage', 'ember-cli-mirage/utils/inflector'], function (exports, _emberCliMirage, _inflector) {
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

    var underscore = Ember.String.underscore;
    exports.default = _emberCliMirage.RestSerializer.extend({
        keyForAttribute: function keyForAttribute(attr) {
            return underscore(attr);
        },
        serialize: function serialize(object, request) {
            // Ember expects pluralized responses for the post, user, and invite models,
            // and this shortcut will ensure that those models are pluralized
            if (this.isModel(object) && ['post', 'user', 'invite'].includes(object.modelName)) {
                object = new _emberCliMirage.Collection(object.modelName, [object]);
            }

            var json = _emberCliMirage.RestSerializer.prototype.serialize.call(this, object, request);

            if (this.isCollection(object) && object.meta) {
                json.meta = object.meta;
            }

            return json;
        },


        // POST and PUT request send data in pluralized attributes for all models,
        // so we extract it here - this allows #normalizedRequestAttrs to work
        // in route functions
        normalize: function normalize(body, modelName) {
            // sometimes mirage doesn't include a modelName, so we extrapolate it from
            // the first element of Object.keys
            modelName = (0, _inflector.pluralize)(modelName) || Object.keys(body)[0];

            var _ref = body[modelName] || [{}],
                _ref2 = _slicedToArray(_ref, 1),
                attributes = _ref2[0];

            return { data: { attributes: attributes } };
        }
    });
});