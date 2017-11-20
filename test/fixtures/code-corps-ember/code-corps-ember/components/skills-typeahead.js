define('code-corps-ember/components/skills-typeahead', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var notEmpty = Ember.computed.notEmpty;
  var not = Ember.computed.not;
  var and = Ember.computed.and;
  var alias = Ember.computed.alias;
  var service = Ember.inject.service;
  var isEmpty = Ember.isEmpty;
  var once = Ember.run.once;
  var set = Ember.set;
  var observer = Ember.observer;
  var getProperties = Ember.getProperties;
  var get = Ember.get;
  var computed = Ember.computed;
  exports.default = Component.extend({
    classNames: ['skills-typeahead'],
    classNameBindings: ['centered:skills-typeahead--centered'],
    cursorAt: 0,
    cursorWas: 0,
    hidden: true,
    lastQuery: null,
    limit: 5,
    results: [],

    currentUser: service(),
    store: service(),

    canShow: and('hasResults', 'notHidden'),
    hasResults: notEmpty('results'),
    notHidden: not('hidden'),
    numberOfResults: alias('results.length'),
    queryChanged: observer('query', function () {
      once(this, '_search');
    }),
    user: alias('currentUser.user'),

    _isNewQuery: not('_sameQuery'),
    _sameQuery: computed('query', 'lastQuery', function () {
      return get(this, 'query') === get(this, 'lastQuery');
    }),

    actions: {
      blur: function blur() {
        set(this, 'hidden', true);
      },
      focus: function focus() {
        set(this, 'hidden', false);
      },
      hoverSkill: function hoverSkill(skill) {
        var _this = this;

        get(this, 'results').forEach(function (item, index) {
          if (item === skill) {
            set(_this, 'cursorAt', index);
            set(item, 'selected', true);
          } else {
            set(item, 'selected', false);
          }
        });
      },
      getKeyDown: function getKeyDown(key) {
        var cursorAt = void 0;
        switch (key) {
          case 'ArrowDown':
            cursorAt = get(this, 'cursorAt');
            this._setPosition(++cursorAt);
            set(this, 'hidden', false);
            break;
          case 'ArrowUp':
            cursorAt = get(this, 'cursorAt');
            this._setPosition(--cursorAt);
            set(this, 'hidden', false);
            break;
          case 'Comma':
          case 'Enter':
            this._selectSkill();
            break;
          case 'Escape':
            this._reset();
            break;
          default:
            // Any other alphanumeric character
            if (/^Key\w(?!.)/.test(key)) {
              set(this, 'hidden', false);
            }
        }
      },
      selectSkill: function selectSkill(skill) {
        this._selectSkill(skill);
      }
    },

    _reset: function _reset() {
      set(this, 'results', []);
      set(this, 'query', '');
      set(this, 'hidden', true);
    },
    _search: function _search() {
      var _this2 = this;

      var limit = get(this, 'limit');
      var query = get(this, 'query');
      var store = get(this, 'store');

      if (isEmpty(query)) {
        this._reset();
      } else if (get(this, '_isNewQuery')) {
        set(this, 'lastQuery', query);
        store.query('skill', { query: query, limit: limit }).then(function (skills) {
          set(_this2, 'results', skills);
          set(_this2, 'cursorAt', 0);
          _this2._updateSelected();
        });
      }
    },
    _selectSkill: function _selectSkill() {
      if (get(this, 'hasResults')) {
        var _getProperties = getProperties(this, 'cursorAt', 'results'),
            cursorAt = _getProperties.cursorAt,
            results = _getProperties.results;

        var skill = results.objectAt(cursorAt);
        this._reset();
        get(this, 'selectSkill')(skill);
      }
    },
    _setPosition: function _setPosition(position) {
      var numberOfResults = get(this, 'numberOfResults');
      var numberOfResultsIndexed = numberOfResults - 1;

      set(this, 'cursorWas', get(this, 'cursorAt'));

      if (numberOfResults > 0) {
        if (position < 0) {
          set(this, 'cursorAt', numberOfResultsIndexed);
        } else if (position > numberOfResultsIndexed) {
          set(this, 'cursorAt', 0);
        } else {
          set(this, 'cursorAt', position);
        }
      }

      this._updateSelected();
    },
    _updateSelected: function _updateSelected() {
      var cursorAt = get(this, 'cursorAt');

      get(this, 'results').forEach(function (item, index) {
        if (index === cursorAt) {
          set(item, 'selected', true);
        } else {
          set(item, 'selected', false);
        }
      });
    }
  });
});