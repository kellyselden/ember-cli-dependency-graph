define('ember-responsive/media', ['exports', 'ember-responsive/null-match-media'], function (exports, _nullMatchMedia) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var getOwner = Ember.getOwner;
  var _Ember$String = Ember.String,
      dasherize = _Ember$String.dasherize,
      classify = _Ember$String.classify;
  exports.default = Ember.Service.extend({

    /**
    * A set of matching matchers.
    *
    * @property  matches
    * @type      Ember.NativeArray
    * @default   Ember.NativeArray
    */
    matches: Ember.computed(function () {
      return Ember.A();
    }),

    /**
      * A hash of listeners indexed by their matcher's names
      *
      * @property
      * @type Object
      */
    listeners: {},

    /**
    * The matcher to use for testing media queries.
    *
    * @property  matcher
    * @type      matchMedia
    * @default   window.matchMedia
    * @private
    */
    mql: detectMatchMedia(),

    /**
     * Initialize the service based on the breakpoints config
     *
     * @method init
     *
     */
    init: function init() {
      var owner = getOwner(this);
      owner.registerOptionsForType('breakpoints', { instantiate: false });
      var breakpoints = this.get('breakpoints');
      if (breakpoints) {
        for (var name in breakpoints) {
          if (breakpoints.hasOwnProperty(name)) {
            this.match(name, breakpoints[name]);
          }
        }
      }
    },


    breakpoints: Ember.computed(function () {
      return getOwner(this).lookup('breakpoints:main');
    }),

    /**
    * A string composed of all the matching matchers' names, turned into
    * friendly, dasherized class-names that are prefixed with `media-`.
    *
    * @property  classNames
    * @type      string
    */
    classNames: Ember.computed('matches.[]', function () {
      return this.get('matches').map(function (name) {
        return 'media-' + dasherize(name);
      }).join(' ');
    }),

    /**
    * Adds a new matcher to the list.
    *
    * After this method is called, you will be able to access the result
    * of the matcher as a property on this object.
    *
    * **Adding a new matcher**
    *
    * ```javascript
    * media = Ember.Responsive.Media.create();
    * media.match('all', 'all');
    * media.get('all');
    *   // => instanceof window.matchMedia
    * media.get('all.matches');
    *   // => true
    * ```
    *
    * @param   string  name   The name of the matcher
    * @param   string  query  The media query to match against
    * @method  match
    */
    match: function match(name, query) {
      var _this = this;

      var matcher = (this.get('mql') || window.matchMedia)(query),
          isser = 'is' + classify(name);

      var listener = function listener(matcher) {
        if (_this.get('isDestroyed')) {
          return;
        }

        _this.set(name, matcher);
        _this.set(isser, matcher.matches);

        if (matcher.matches) {
          _this.get('matches').addObject(name);
        } else {
          _this.get('matches').removeObject(name);
        }
      };
      this.get('listeners')[name] = listener;

      if (matcher.addListener) {
        matcher.addListener(function (matcher) {
          Ember.run(null, listener, matcher);
        });
      }
      listener(matcher);
    }
  });


  function detectMatchMedia() {
    if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.matchMedia) {
      return window.matchMedia;
    }

    return _nullMatchMedia.default;
  }
});