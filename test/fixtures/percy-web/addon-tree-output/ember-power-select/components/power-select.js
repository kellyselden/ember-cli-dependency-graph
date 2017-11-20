define('ember-power-select/components/power-select', ['exports', 'ember-power-select/templates/components/power-select', 'ember-power-select/utils/computed-fallback-if-undefined', 'ember-power-select/utils/group-utils', 'ember-concurrency'], function (exports, _powerSelect, _computedFallbackIfUndefined, _groupUtils, _emberConcurrency) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

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
  var scheduleOnce = Ember.run.scheduleOnce;
  var getOwner = Ember.getOwner;
  var isEqual = Ember.isEqual;
  var get = Ember.get;
  var set = Ember.set;
  var isBlank = Ember.isBlank;
  var isEmberArray = Ember.isArray;
  var ArrayProxy = Ember.ArrayProxy;


  // Copied from Ember. It shouldn't be necessary in Ember 2.5+
  var assign = Object.assign || function EmberAssign(original) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    for (var i = 0; i < args.length; i++) {
      var arg = args[i];
      if (!arg) {
        continue;
      }

      var updates = Object.keys(arg);

      for (var _i = 0; _i < updates.length; _i++) {
        var prop = updates[_i];
        original[prop] = arg[prop];
      }
    }

    return original;
  };

  function concatWithProperty(strings, property) {
    if (property) {
      strings.push(property);
    }
    return strings.join(' ');
  }

  function toPlainArray(collection) {
    return collection.toArray ? collection.toArray() : collection;
  }

  var initialState = {
    options: [], // Contains the resolved collection of options
    results: [], // Contains the active set of results
    resultsCount: 0, // Contains the number of results incuding those nested/disabled
    selected: undefined, // Contains the resolved selected option
    highlighted: undefined, // Contains the currently highlighted option (if any)
    searchText: '', // Contains the text of the current search
    lastSearchedText: '', // Contains the text of the last finished search
    loading: false, // Truthy if there is a pending promise that will update the results
    isActive: false, // Truthy if the trigger is focused. Other subcomponents can mark it as active depending on other logic.
    // Private API (for now)
    _expirableSearchText: ''
  };

  exports.default = Component.extend({
    // HTML
    layout: _powerSelect.default,
    tagName: '',

    // Options
    searchEnabled: (0, _computedFallbackIfUndefined.default)(true),
    matchTriggerWidth: (0, _computedFallbackIfUndefined.default)(true),
    preventScroll: (0, _computedFallbackIfUndefined.default)(false),
    matcher: (0, _computedFallbackIfUndefined.default)(_groupUtils.defaultMatcher),
    loadingMessage: (0, _computedFallbackIfUndefined.default)('Loading options...'),
    noMatchesMessage: (0, _computedFallbackIfUndefined.default)('No results found'),
    searchMessage: (0, _computedFallbackIfUndefined.default)('Type to search'),
    closeOnSelect: (0, _computedFallbackIfUndefined.default)(true),
    defaultHighlighted: (0, _computedFallbackIfUndefined.default)(_groupUtils.defaultHighlighted),

    afterOptionsComponent: (0, _computedFallbackIfUndefined.default)(null),
    beforeOptionsComponent: (0, _computedFallbackIfUndefined.default)('power-select/before-options'),
    optionsComponent: (0, _computedFallbackIfUndefined.default)('power-select/options'),
    groupComponent: (0, _computedFallbackIfUndefined.default)('power-select/power-select-group'),
    selectedItemComponent: (0, _computedFallbackIfUndefined.default)(null),
    triggerComponent: (0, _computedFallbackIfUndefined.default)('power-select/trigger'),
    searchMessageComponent: (0, _computedFallbackIfUndefined.default)('power-select/search-message'),
    placeholderComponent: (0, _computedFallbackIfUndefined.default)('power-select/placeholder'),
    buildSelection: (0, _computedFallbackIfUndefined.default)(function buildSelection(option) {
      return option;
    }),

    _triggerTagName: (0, _computedFallbackIfUndefined.default)('div'),
    _contentTagName: (0, _computedFallbackIfUndefined.default)('div'),

    // Private state
    publicAPI: initialState,

    // Lifecycle hooks
    init: function init() {
      var _this = this;

      this._super.apply(this, arguments);
      this._publicAPIActions = {
        search: function search() {
          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          return _this.send.apply(_this, ['search'].concat(args));
        },
        highlight: function highlight() {
          for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
          }

          return _this.send.apply(_this, ['highlight'].concat(args));
        },
        select: function select() {
          for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
          }

          return _this.send.apply(_this, ['select'].concat(args));
        },
        choose: function choose() {
          for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
            args[_key5] = arguments[_key5];
          }

          return _this.send.apply(_this, ['choose'].concat(args));
        },
        scrollTo: function scrollTo() {
          for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
            args[_key6] = arguments[_key6];
          }

          return scheduleOnce.apply(undefined, ['afterRender', _this, _this.send, 'scrollTo'].concat(args));
        }
      };
      (true && !(this.get('onchange') && typeof this.get('onchange') === 'function') && Ember.assert('{{power-select}} requires an `onchange` function', this.get('onchange') && typeof this.get('onchange') === 'function'));
    },
    willDestroy: function willDestroy() {
      this._super.apply(this, arguments);
      this._removeObserversInOptions();
      this._removeObserversInSelected();
      var action = this.get('registerAPI');
      if (action) {
        action(null);
      }
    },


    // CPs
    inTesting: computed(function () {
      var config = getOwner(this).resolveRegistration('config:environment');
      return config.environment === 'test';
    }),

    selected: computed({
      get: function get() {
        return null;
      },
      set: function set(_, selected) {
        if (selected && selected.then) {
          this.get('_updateSelectedTask').perform(selected);
        } else {
          scheduleOnce('actions', this, this.updateSelection, selected);
        }
        return selected;
      }
    }),

    options: computed({
      get: function get() {
        return [];
      },
      set: function set(_, options, oldOptions) {
        if (options === oldOptions) {
          return options;
        }
        if (options && options.then) {
          this.get('_updateOptionsTask').perform(options);
        } else {
          scheduleOnce('actions', this, this.updateOptions, options);
        }
        return options;
      }
    }),

    optionMatcher: computed('searchField', 'matcher', function () {
      var _getProperties = this.getProperties('matcher', 'searchField'),
          matcher = _getProperties.matcher,
          searchField = _getProperties.searchField;

      if (searchField && matcher === _groupUtils.defaultMatcher) {
        return function (option, text) {
          return matcher(get(option, searchField), text);
        };
      } else {
        return function (option, text) {
          (true && !(matcher !== _groupUtils.defaultMatcher || typeof option === 'string') && Ember.assert('{{power-select}} If you want the default filtering to work on options that are not plain strings, you need to provide `searchField`', matcher !== _groupUtils.defaultMatcher || typeof option === 'string'));

          return matcher(option, text);
        };
      }
    }),

    concatenatedTriggerClasses: computed('triggerClass', 'publicAPI.isActive', function () {
      var classes = ['ember-power-select-trigger'];
      if (this.get('publicAPI.isActive')) {
        classes.push('ember-power-select-trigger--active');
      }
      return concatWithProperty(classes, this.get('triggerClass'));
    }),

    concatenatedDropdownClasses: computed('dropdownClass', 'publicAPI.isActive', function () {
      var classes = ['ember-power-select-dropdown'];
      if (this.get('publicAPI.isActive')) {
        classes.push('ember-power-select-dropdown--active');
      }
      return concatWithProperty(classes, this.get('dropdownClass'));
    }),

    mustShowSearchMessage: computed('publicAPI.{loading,searchText,resultsCount}', 'search', 'searchMessage', function () {
      var publicAPI = this.get('publicAPI');
      return !publicAPI.loading && publicAPI.searchText.length === 0 && !!this.get('search') && !!this.get('searchMessage') && publicAPI.resultsCount === 0;
    }),

    mustShowNoMessages: computed('search', 'publicAPI.{lastSearchedText,resultsCount,loading}', function () {
      var publicAPI = this.get('publicAPI');
      return !publicAPI.loading && publicAPI.resultsCount === 0 && (!this.get('search') || publicAPI.lastSearchedText.length > 0);
    }),

    // Actions
    actions: {
      registerAPI: function registerAPI(dropdown) {
        if (!dropdown) {
          return;
        }
        var publicAPI = assign({}, this.get('publicAPI'), dropdown);
        publicAPI.actions = assign({}, dropdown.actions, this._publicAPIActions);
        this.setProperties({
          publicAPI: publicAPI,
          optionsId: 'ember-power-select-options-' + publicAPI.uniqueId
        });
        var action = this.get('registerAPI');
        if (action) {
          action(publicAPI);
        }
      },
      onOpen: function onOpen(_, e) {
        var action = this.get('onopen');
        if (action && action(this.get('publicAPI'), e) === false) {
          return false;
        }
        if (e) {
          this.openingEvent = e;
          if (e.type === 'keydown' && (e.keyCode === 38 || e.keyCode === 40)) {
            e.preventDefault();
          }
        }
        this.resetHighlighted();
      },
      onClose: function onClose(_, e) {
        var action = this.get('onclose');
        if (action && action(this.get('publicAPI'), e) === false) {
          return false;
        }
        if (e) {
          this.openingEvent = null;
        }
        this.updateState({ highlighted: undefined });
      },
      onInput: function onInput(e) {
        var term = e.target.value;
        var action = this.get('oninput');
        var publicAPI = this.get('publicAPI');
        var correctedTerm = void 0;
        if (action) {
          correctedTerm = action(term, publicAPI, e);
          if (correctedTerm === false) {
            return;
          }
        }
        publicAPI.actions.search(typeof correctedTerm === 'string' ? correctedTerm : term);
      },
      highlight: function highlight(option /* , e */) {
        if (option && get(option, 'disabled')) {
          return;
        }
        this.updateState({ highlighted: option });
      },
      select: function select(selected, e) {
        var publicAPI = this.get('publicAPI');
        if (!isEqual(publicAPI.selected, selected)) {
          this.get('onchange')(selected, publicAPI, e);
        }
      },
      search: function search(term) {
        if (isBlank(term)) {
          this._resetSearch();
        } else if (this.get('search')) {
          this._performSearch(term);
        } else {
          this._performFilter(term);
        }
      },
      choose: function choose(selected, e) {
        if (!this.get('inTesting')) {
          if (e && e.clientY) {
            if (this.openingEvent && this.openingEvent.clientY) {
              if (Math.abs(this.openingEvent.clientY - e.clientY) < 2) {
                return;
              }
            }
          }
        }
        var publicAPI = this.get('publicAPI');
        publicAPI.actions.select(this.get('buildSelection')(selected, publicAPI), e);
        if (this.get('closeOnSelect')) {
          publicAPI.actions.close(e);
          return false;
        }
      },


      // keydowns handled by the trigger provided by ember-basic-dropdown
      onTriggerKeydown: function onTriggerKeydown(_, e) {
        var onkeydown = this.get('onkeydown');
        if (onkeydown && onkeydown(this.get('publicAPI'), e) === false) {
          return false;
        }
        if (e.ctrlKey || e.metaKey) {
          return false;
        }
        if (e.keyCode >= 48 && e.keyCode <= 90 || // Keys 0-9, a-z
        this._isNumpadKeyEvent(e)) {
          this.get('triggerTypingTask').perform(e);
        } else if (e.keyCode === 32) {
          // Space
          return this._handleKeySpace(e);
        } else {
          return this._routeKeydown(e);
        }
      },


      // keydowns handled by inputs inside the component
      onKeydown: function onKeydown(e) {
        var onkeydown = this.get('onkeydown');
        if (onkeydown && onkeydown(this.get('publicAPI'), e) === false) {
          return false;
        }
        return this._routeKeydown(e);
      },
      scrollTo: function scrollTo(option) {
        if (!self.document || !option) {
          return;
        }
        var publicAPI = this.get('publicAPI');
        var userDefinedScrollTo = this.get('scrollTo');
        if (userDefinedScrollTo) {
          for (var _len7 = arguments.length, rest = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
            rest[_key7 - 1] = arguments[_key7];
          }

          return userDefinedScrollTo.apply(undefined, [option, publicAPI].concat(_toConsumableArray(rest)));
        }
        var optionsList = self.document.getElementById('ember-power-select-options-' + publicAPI.uniqueId);
        if (!optionsList) {
          return;
        }
        var index = (0, _groupUtils.indexOfOption)(publicAPI.results, option);
        if (index === -1) {
          return;
        }
        var optionElement = optionsList.querySelectorAll('[data-option-index]').item(index);
        if (!optionElement) {
          return;
        }
        var optionTopScroll = optionElement.offsetTop - optionsList.offsetTop;
        var optionBottomScroll = optionTopScroll + optionElement.offsetHeight;
        if (optionBottomScroll > optionsList.offsetHeight + optionsList.scrollTop) {
          optionsList.scrollTop = optionBottomScroll - optionsList.offsetHeight;
        } else if (optionTopScroll < optionsList.scrollTop) {
          optionsList.scrollTop = optionTopScroll;
        }
      },
      onTriggerFocus: function onTriggerFocus(_, event) {
        this.send('activate');
        var action = this.get('onfocus');
        if (action) {
          action(this.get('publicAPI'), event);
        }
      },
      onFocus: function onFocus(event) {
        this.send('activate');
        var action = this.get('onfocus');
        if (action) {
          action(this.get('publicAPI'), event);
        }
      },
      onTriggerBlur: function onTriggerBlur(_, event) {
        this.send('deactivate');
        var action = this.get('onblur');
        if (action) {
          action(this.get('publicAPI'), event);
        }
      },
      onBlur: function onBlur(event) {
        this.send('deactivate');
        var action = this.get('onblur');
        if (action) {
          action(this.get('publicAPI'), event);
        }
      },
      activate: function activate() {
        scheduleOnce('actions', this, 'setIsActive', true);
      },
      deactivate: function deactivate() {
        scheduleOnce('actions', this, 'setIsActive', false);
      }
    },

    // Tasks
    triggerTypingTask: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee(e) {
      var publicAPI, charCode, term, matches, firstMatch;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              publicAPI = this.get('publicAPI');
              charCode = e.keyCode;

              if (this._isNumpadKeyEvent(e)) {
                charCode -= 48; // Adjust char code offset for Numpad key codes. Check here for numapd key code behavior: https://goo.gl/Qwc9u4
              }
              term = publicAPI._expirableSearchText + String.fromCharCode(charCode);

              this.updateState({ _expirableSearchText: term });
              matches = this.filter(publicAPI.options, term, true);

              if (get(matches, 'length') > 0) {
                firstMatch = (0, _groupUtils.optionAtIndex)(matches, 0);

                if (firstMatch !== undefined) {
                  if (publicAPI.isOpen) {
                    publicAPI.actions.highlight(firstMatch.option, e);
                    publicAPI.actions.scrollTo(firstMatch.option, e);
                  } else {
                    publicAPI.actions.select(firstMatch.option, e);
                  }
                }
              }
              _context.next = 9;
              return (0, _emberConcurrency.timeout)(1000);

            case 9:
              this.updateState({ _expirableSearchText: '' });

            case 10:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    })).restartable(),

    _updateSelectedTask: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(selectionPromise) {
      var selection;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return selectionPromise;

            case 2:
              selection = _context2.sent;

              this.updateSelection(selection);

            case 4:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    })).restartable(),

    _updateOptionsTask: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(optionsPromise) {
      var options;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (optionsPromise instanceof ArrayProxy) {
                this.updateOptions(optionsPromise.get('content'));
              }
              this.updateState({ loading: true });
              _context3.prev = 2;
              _context3.next = 5;
              return optionsPromise;

            case 5:
              options = _context3.sent;

              this.updateOptions(options);

            case 7:
              _context3.prev = 7;

              this.updateState({ loading: false });
              return _context3.finish(7);

            case 10:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this, [[2,, 7, 10]]);
    })).restartable(),

    handleAsyncSearchTask: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(term, searchThenable) {
      var results, resultsArray;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;

              this.updateState({ loading: true });
              _context4.next = 4;
              return searchThenable;

            case 4:
              results = _context4.sent;
              resultsArray = toPlainArray(results);

              this.updateState({
                results: resultsArray,
                _rawSearchResults: results,
                lastSearchedText: term,
                resultsCount: (0, _groupUtils.countOptions)(results),
                loading: false
              });
              this.resetHighlighted();
              _context4.next = 13;
              break;

            case 10:
              _context4.prev = 10;
              _context4.t0 = _context4['catch'](0);

              this.updateState({ lastSearchedText: term, loading: false });

            case 13:
              _context4.prev = 13;

              if (typeof searchThenable.cancel === 'function') {
                searchThenable.cancel();
              }
              return _context4.finish(13);

            case 16:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this, [[0, 10, 13, 16]]);
    })).restartable(),

    // Methods
    setIsActive: function setIsActive(isActive) {
      this.updateState({ isActive: isActive });
    },
    filter: function filter(options, term) {
      var skipDisabled = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      return (0, _groupUtils.filterOptions)(options || [], term, this.get('optionMatcher'), skipDisabled);
    },
    updateOptions: function updateOptions(options) {
      this._removeObserversInOptions();
      if (!options) {
        return;
      }
      if (true) {
        (function walk(collection) {
          for (var i = 0; i < get(collection, 'length'); i++) {
            var entry = collection.objectAt ? collection.objectAt(i) : collection[i];
            var subOptions = get(entry, 'options');
            var isGroup = !!get(entry, 'groupName') && !!subOptions;
            if (isGroup) {
              (true && !(!subOptions.then) && Ember.assert('ember-power-select doesn\'t support promises inside groups. Please, resolve those promises and turn them into arrays before passing them to ember-power-select', !subOptions.then));

              walk(subOptions);
            }
          }
        })(options);
      }
      if (options && options.addObserver) {
        options.addObserver('[]', this, this._updateOptionsAndResults);
        this._observedOptions = options;
      }
      this._updateOptionsAndResults(options);
    },
    updateSelection: function updateSelection(selection) {
      this._removeObserversInSelected();
      if (isEmberArray(selection)) {
        if (selection && selection.addObserver) {
          selection.addObserver('[]', this, this._updateSelectedArray);
          this._observedSelected = selection;
        }
        this._updateSelectedArray(selection);
      } else if (selection !== this.get('publicAPI').selected) {
        this.updateState({ selected: selection, highlighted: selection });
      }
    },
    resetHighlighted: function resetHighlighted() {
      var publicAPI = this.get('publicAPI');
      var defaultHightlighted = this.get('defaultHighlighted');
      var highlighted = void 0;
      if (typeof defaultHightlighted === 'function') {
        highlighted = defaultHightlighted(publicAPI);
      } else {
        highlighted = defaultHightlighted;
      }
      this.updateState({ highlighted: highlighted });
    },
    _updateOptionsAndResults: function _updateOptionsAndResults(opts) {
      if (get(this, 'isDestroyed')) {
        return;
      }
      var options = toPlainArray(opts);
      var publicAPI = void 0;
      if (this.get('search')) {
        // external search
        publicAPI = this.updateState({ options: options, results: options, resultsCount: (0, _groupUtils.countOptions)(options), loading: false });
      } else {
        // filter
        publicAPI = this.get('publicAPI');
        var results = isBlank(publicAPI.searchText) ? options : this.filter(options, publicAPI.searchText);
        publicAPI = this.updateState({ results: results, options: options, resultsCount: (0, _groupUtils.countOptions)(results), loading: false });
      }
      if (publicAPI.isOpen) {
        this.resetHighlighted();
      }
    },
    _updateSelectedArray: function _updateSelectedArray(selection) {
      if (get(this, 'isDestroyed')) {
        return;
      }
      this.updateState({ selected: toPlainArray(selection) });
    },
    _resetSearch: function _resetSearch() {
      var results = this.get('publicAPI').options;
      this.get('handleAsyncSearchTask').cancelAll();
      this.updateState({
        results: results,
        searchText: '',
        lastSearchedText: '',
        resultsCount: (0, _groupUtils.countOptions)(results),
        loading: false
      });
    },
    _performFilter: function _performFilter(term) {
      var results = this.filter(this.get('publicAPI').options, term);
      this.updateState({ results: results, searchText: term, lastSearchedText: term, resultsCount: (0, _groupUtils.countOptions)(results) });
      this.resetHighlighted();
    },
    _performSearch: function _performSearch(term) {
      var searchAction = this.get('search');
      var publicAPI = this.updateState({ searchText: term });
      var search = searchAction(term, publicAPI);
      if (!search) {
        publicAPI = this.updateState({ lastSearchedText: term });
      } else if (search.then) {
        this.get('handleAsyncSearchTask').perform(term, search);
      } else {
        var resultsArray = toPlainArray(search);
        this.updateState({ results: resultsArray, lastSearchedText: term, resultsCount: (0, _groupUtils.countOptions)(resultsArray) });
        this.resetHighlighted();
      }
    },
    _routeKeydown: function _routeKeydown(e) {
      if (e.keyCode === 38 || e.keyCode === 40) {
        // Up & Down
        return this._handleKeyUpDown(e);
      } else if (e.keyCode === 13) {
        // ENTER
        return this._handleKeyEnter(e);
      } else if (e.keyCode === 9) {
        // Tab
        return this._handleKeyTab(e);
      } else if (e.keyCode === 27) {
        // ESC
        return this._handleKeyESC(e);
      }
    },
    _handleKeyUpDown: function _handleKeyUpDown(e) {
      var publicAPI = this.get('publicAPI');
      if (publicAPI.isOpen) {
        e.preventDefault();
        e.stopPropagation();
        var step = e.keyCode === 40 ? 1 : -1;
        var newHighlighted = (0, _groupUtils.advanceSelectableOption)(publicAPI.results, publicAPI.highlighted, step);
        publicAPI.actions.highlight(newHighlighted, e);
        publicAPI.actions.scrollTo(newHighlighted);
      } else {
        publicAPI.actions.open(e);
      }
    },
    _handleKeyEnter: function _handleKeyEnter(e) {
      var publicAPI = this.get('publicAPI');
      if (publicAPI.isOpen && publicAPI.highlighted !== undefined) {
        publicAPI.actions.choose(publicAPI.highlighted, e);
        return false;
      }
    },
    _handleKeySpace: function _handleKeySpace(e) {
      var publicAPI = this.get('publicAPI');
      if (publicAPI.isOpen && publicAPI.highlighted !== undefined) {
        e.preventDefault(); // Prevents scrolling of the page.
        publicAPI.actions.choose(publicAPI.highlighted, e);
        return false;
      }
    },
    _handleKeyTab: function _handleKeyTab(e) {
      this.get('publicAPI').actions.close(e);
    },
    _handleKeyESC: function _handleKeyESC(e) {
      this.get('publicAPI').actions.close(e);
    },
    _removeObserversInOptions: function _removeObserversInOptions() {
      if (this._observedOptions) {
        this._observedOptions.removeObserver('[]', this, this._updateOptionsAndResults);
      }
    },
    _removeObserversInSelected: function _removeObserversInSelected() {
      if (this._observedSelected) {
        this._observedSelected.removeObserver('[]', this, this._updateSelectedArray);
      }
    },
    _isNumpadKeyEvent: function _isNumpadKeyEvent(e) {
      return e.keyCode >= 96 && e.keyCode <= 105;
    },
    updateState: function updateState(changes) {
      var newState = set(this, 'publicAPI', assign({}, this.get('publicAPI'), changes));
      var registerAPI = this.get('registerAPI');
      if (registerAPI) {
        registerAPI(newState);
      }
      return newState;
    }
  });
});