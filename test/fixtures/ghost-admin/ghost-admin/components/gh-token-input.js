define('ghost-admin/components/gh-token-input', ['exports', 'ember-power-select/utils/group-utils', 'ember-concurrency'], function (exports, _groupUtils, _emberConcurrency) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var A = Ember.A;
    var computed = Ember.computed;
    var get = Ember.get;
    var htmlSafe = Ember.String.htmlSafe;
    var isBlank = Ember.isBlank;
    var Handlebars = Ember.Handlebars;


    var BACKSPACE = 8;
    var TAB = 9;

    exports.default = Component.extend({

        // public attrs
        closeOnSelect: false,
        labelField: 'name',
        matcher: _groupUtils.defaultMatcher,
        searchField: 'name',
        tagName: '',
        triggerComponent: 'gh-token-input/trigger',

        optionsWithoutSelected: computed('options.[]', 'selected.[]', function () {
            return this.get('optionsWithoutSelectedTask').perform();
        }),

        actions: {
            handleKeydown: function handleKeydown(select, event) {
                // On backspace with empty text, remove the last token but deviate
                // from default behaviour by not updating search to match last token
                if (event.keyCode === BACKSPACE && isBlank(event.target.value)) {
                    var lastSelection = select.selected[select.selected.length - 1];

                    if (lastSelection) {
                        this.get('onchange')(select.selected.slice(0, -1), select);
                        select.actions.search('');
                        select.actions.open(event);
                    }

                    // prevent default
                    return false;
                }

                // Tab should work the same as Enter if there's a highlighted option
                if (event.keyCode === TAB && !isBlank(event.target.value) && select.highlighted) {
                    if (!select.selected || select.selected.indexOf(select.highlighted) === -1) {
                        select.actions.choose(select.highlighted, event);
                        return false;
                    }
                }

                // fallback to default
                return true;
            },
            onfocus: function onfocus() {
                key.setScope('gh-token-input');

                if (this.get('onfocus')) {
                    this.get('onfocus').apply(undefined, arguments);
                }
            },
            onblur: function onblur() {
                key.setScope('default');

                if (this.get('onblur')) {
                    this.get('onblur').apply(undefined, arguments);
                }
            }
        },

        optionsWithoutSelectedTask: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var options, selected;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return this.get('options');

                        case 2:
                            options = _context.sent;
                            _context.next = 5;
                            return this.get('selected');

                        case 5:
                            selected = _context.sent;
                            return _context.abrupt('return', options.filter(function (o) {
                                return !selected.includes(o);
                            }));

                        case 7:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        })),

        shouldShowCreateOption: function shouldShowCreateOption(term, options) {
            if (this.get('showCreateWhen')) {
                return this.get('showCreateWhen')(term, options);
            } else {
                return this.hideCreateOptionOnSameTerm(term, options);
            }
        },
        hideCreateOptionOnSameTerm: function hideCreateOptionOnSameTerm(term, options) {
            var searchField = this.get('searchField');
            var existingOption = options.findBy(searchField, term);
            return !existingOption;
        },
        addCreateOption: function addCreateOption(term, options) {
            if (this.shouldShowCreateOption(term, options)) {
                options.unshift(this.buildSuggestionForTerm(term));
            }
        },
        searchAndSuggest: function searchAndSuggest(term, select) {
            return this.get('searchAndSuggestTask').perform(term, select);
        },


        searchAndSuggestTask: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(term, select) {
            var newOptions, searchAction, results;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return this.get('optionsWithoutSelected');

                        case 2:
                            newOptions = _context2.sent.toArray();

                            if (!(term.length === 0)) {
                                _context2.next = 5;
                                break;
                            }

                            return _context2.abrupt('return', newOptions);

                        case 5:
                            searchAction = this.get('search');

                            if (!searchAction) {
                                _context2.next = 13;
                                break;
                            }

                            _context2.next = 9;
                            return searchAction(term, select);

                        case 9:
                            results = _context2.sent;


                            if (results.toArray) {
                                results = results.toArray();
                            }

                            this.addCreateOption(term, results);
                            return _context2.abrupt('return', results);

                        case 13:

                            newOptions = this.filter(A(newOptions), term);
                            this.addCreateOption(term, newOptions);

                            return _context2.abrupt('return', newOptions);

                        case 16:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        })),

        selectOrCreate: function selectOrCreate(selection, select) {
            var suggestion = selection.find(function (option) {
                return option.__isSuggestion__;
            });

            if (suggestion) {
                this.get('oncreate')(suggestion.__value__, select);
            } else {
                this.get('onchange')(selection, select);
            }

            // clear select search
            select.actions.search('');
        },
        filter: function filter(options, searchText) {
            var _this = this;

            var matcher = void 0;
            if (this.get('searchField')) {
                matcher = function matcher(option, text) {
                    return _this.matcher(get(option, _this.get('searchField')), text);
                };
            } else {
                matcher = function matcher(option, text) {
                    return _this.matcher(option, text);
                };
            }
            return (0, _groupUtils.filterOptions)(options || [], searchText, matcher);
        },
        buildSuggestionForTerm: function buildSuggestionForTerm(term) {
            return {
                __isSuggestion__: true,
                __value__: term,
                text: this.buildSuggestionLabel(term)
            };
        },
        buildSuggestionLabel: function buildSuggestionLabel(term) {
            var buildSuggestion = this.get('buildSuggestion');
            if (buildSuggestion) {
                return buildSuggestion(term);
            }
            return htmlSafe('Add <strong>"' + Handlebars.Utils.escapeExpression(term) + '"...</strong>');
        },


        // always select the first item in the list that isn't the "Add x" option
        defaultHighlighted: function defaultHighlighted(select) {
            var results = select.results;

            var option = (0, _groupUtils.advanceSelectableOption)(results, undefined, 1);

            if (results.length > 1 && option.__isSuggestion__) {
                option = (0, _groupUtils.advanceSelectableOption)(results, option, 1);
            }

            return option;
        }
    });
});