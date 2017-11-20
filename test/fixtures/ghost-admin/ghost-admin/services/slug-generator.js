define('ghost-admin/services/slug-generator', ['exports'], function (exports) {
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

    var RSVP = Ember.RSVP;
    var Service = Ember.Service;
    var service = Ember.inject.service;
    var resolve = RSVP.resolve;
    exports.default = Service.extend({
        ghostPaths: service(),
        ajax: service(),

        generateSlug: function generateSlug(slugType, textToSlugify) {
            var url = void 0;

            if (!textToSlugify) {
                return resolve('');
            }

            url = this.get('ghostPaths.url').api('slugs', slugType, encodeURIComponent(textToSlugify));

            return this.get('ajax').request(url).then(function (response) {
                var _response$slugs = _slicedToArray(response.slugs, 1),
                    firstSlug = _response$slugs[0];

                var slug = firstSlug.slug;


                return slug;
            });
        }
    });
});