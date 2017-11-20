define('ghost-admin/components/gh-psm-template-select', ['exports', 'ember-concurrency'], function (exports, _emberConcurrency) {
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

    function _toConsumableArray(arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
                arr2[i] = arr[i];
            }

            return arr2;
        } else {
            return Array.from(arr);
        }
    }

    var Component = Ember.Component;
    var computed = Ember.computed;
    var isEmpty = Ember.isEmpty;
    var service = Ember.inject.service;
    exports.default = Component.extend({

        store: service(),

        // public attributes
        tagName: '',
        post: null,

        // internal properties
        activeTheme: null,

        // closure actions
        onTemplateSelect: function onTemplateSelect() {},


        // computed properties
        customTemplates: computed('activeTheme.customTemplates.[]', function () {
            var templates = this.get('activeTheme.customTemplates') || [];
            var defaultTemplate = {
                filename: '',
                name: 'Default'
            };

            return isEmpty(templates) ? templates : [defaultTemplate].concat(_toConsumableArray(templates.sortBy('name')));
        }),

        matchedSlugTemplate: computed('post.{page,slug}', 'activeTheme.slugTemplates.[]', function () {
            var slug = this.get('post.slug');
            var type = this.get('post.page') ? 'page' : 'post';

            var _get$filter = this.get('activeTheme.slugTemplates').filter(function (template) {
                return template.for.includes(type) && template.slug === slug;
            }),
                _get$filter2 = _slicedToArray(_get$filter, 1),
                matchedTemplate = _get$filter2[0];

            return matchedTemplate;
        }),

        selectedTemplate: computed('post.customTemplate', 'customTemplates.[]', function () {
            var templates = this.get('customTemplates');
            var filename = this.get('post.customTemplate');

            return templates.findBy('filename', filename);
        }),

        // hooks
        didInsertElement: function didInsertElement() {
            this._super.apply(this, arguments);
            this.get('loadActiveTheme').perform();
        },


        // tasks
        loadActiveTheme: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var store, themes, activeTheme;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            store = this.get('store');
                            _context.next = 3;
                            return store.peekAll('theme');

                        case 3:
                            themes = _context.sent;

                            if (!isEmpty(themes)) {
                                _context.next = 8;
                                break;
                            }

                            _context.next = 7;
                            return store.findAll('theme');

                        case 7:
                            themes = _context.sent;

                        case 8:
                            activeTheme = themes.filterBy('active', true).get('firstObject');


                            this.set('activeTheme', activeTheme);

                        case 10:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        })),

        actions: {
            selectTemplate: function selectTemplate(template) {
                this.onTemplateSelect(template.filename);
            }
        }
    });
});