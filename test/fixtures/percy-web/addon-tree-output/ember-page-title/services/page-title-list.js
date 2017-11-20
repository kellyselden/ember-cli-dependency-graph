define('ember-page-title/services/page-title-list', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var _get = Ember.get,
      set = Ember.set,
      copy = Ember.copy;
  exports.default = Ember.Service.extend({
    init: function init() {
      this._super();
      set(this, 'tokens', Ember.A());
      set(this, 'length', 0);
    },


    defaultSeparator: ' | ',
    defaultPrepend: null,
    defaultReplace: null,
    tokens: [],

    applyTokenDefaults: function applyTokenDefaults(token) {
      var defaultSeparator = _get(this, "defaultSeparator");
      var defaultPrepend = _get(this, "defaultPrepend");
      var defaultReplace = _get(this, "defaultReplace");

      if (token.separator == null) {
        token.separator = defaultSeparator;
      }

      if (token.prepend == null && defaultPrepend != null) {
        token.prepend = defaultPrepend;
      }

      if (token.replace == null && defaultReplace != null) {
        token.replace = defaultReplace;
      }
    },
    inheritFromPrevious: function inheritFromPrevious(token) {
      var previous = token.previous;
      if (previous) {
        if (token.separator == null) {
          token.separator = previous.separator;
        }

        if (token.prepend == null) {
          token.prepend = previous.prepend;
        }
      }
    },
    push: function push(token) {
      var tokenForId = this.tokens.findBy('id', token.id);
      if (tokenForId) {
        var index = this.tokens.indexOf(tokenForId);
        var _tokens = copy(this.tokens);
        var _previous = tokenForId.previous;
        token.previous = _previous;
        token.next = tokenForId.next;
        this.inheritFromPrevious(token);
        this.applyTokenDefaults(token);

        _tokens.splice(index, 1, token);
        set(this, 'tokens', Ember.A(_tokens));
        return;
      }

      var previous = this.tokens.slice(-1)[0];
      if (previous) {
        token.previous = previous;
        previous.next = token;
        this.inheritFromPrevious(token);
      }

      this.applyTokenDefaults(token);

      var tokens = copy(this.tokens);
      tokens.push(token);
      set(this, 'tokens', Ember.A(tokens));
      set(this, 'length', _get(this, 'length') + 1);
    },
    remove: function remove(id) {
      var token = this.tokens.findBy('id', id);
      var next = token.next;
      var previous = token.previous;
      if (next) {
        next.previous = previous;
      }

      if (previous) {
        previous.next = next;
      }

      token.previous = token.next = null;

      var tokens = Ember.A(copy(this.tokens));
      tokens.removeObject(token);
      set(this, 'tokens', Ember.A(tokens));
      set(this, 'length', _get(this, 'length') - 1);
    },


    visibleTokens: Ember.computed('tokens', {
      get: function get() {
        var tokens = _get(this, 'tokens');
        var i = tokens ? tokens.length : 0;
        var visible = [];
        while (i--) {
          var token = tokens[i];
          if (token.replace) {
            visible.unshift(token);
            break;
          } else {
            visible.unshift(token);
          }
        }
        return visible;
      }
    }),

    sortedTokens: Ember.computed('visibleTokens', {
      get: function get() {
        var visible = _get(this, 'visibleTokens');
        var appending = true;
        var group = [];
        var groups = Ember.A([group]);
        visible.forEach(function (token) {
          if (token.prepend) {
            if (appending) {
              appending = false;
              group = [];
              groups.push(group);
            }
            var lastToken = group[0];
            if (lastToken) {
              token = copy(token);
              token.separator = lastToken.separator;
            }
            group.unshift(token);
          } else {
            if (!appending) {
              appending = true;
              group = [];
              groups.push(group);
            }
            group.push(token);
          }
        });

        return groups.reduce(function (E, group) {
          return E.concat(group);
        }, []);
      }
    }),

    toString: function toString() {
      var tokens = _get(this, 'sortedTokens');
      var title = [];
      for (var i = 0, len = tokens.length; i < len; i++) {
        var token = tokens[i];
        if (token.title) {
          title.push(token.title);
          if (i + 1 < len) {
            title.push(token.separator);
          }
        }
      }
      return title.join('');
    }
  });
});