define("ember-i18n/services/i18n", ["exports", "ember", "ember-i18n/utils/locale", "ember-i18n/utils/add-translations", "ember-i18n/utils/get-locales"], function (exports, _ember, _emberI18nUtilsLocale, _emberI18nUtilsAddTranslations, _emberI18nUtilsGetLocales) {
  var assert = _ember["default"].assert;
  var computed = _ember["default"].computed;
  var get = _ember["default"].get;
  var Evented = _ember["default"].Evented;
  var makeArray = _ember["default"].makeArray;
  var on = _ember["default"].on;
  var typeOf = _ember["default"].typeOf;
  var warn = _ember["default"].warn;
  var getOwner = _ember["default"].getOwner;

  var Parent = _ember["default"].Service || _ember["default"].Object;

  // @public
  exports["default"] = Parent.extend(Evented, {
    // @public
    // The user's locale.
    locale: null,

    // @public
    // A list of found locales.
    locales: computed(_emberI18nUtilsGetLocales["default"]),

    // @public
    //
    // Returns the translation `key` interpolated with `data`
    // in the current `locale`.
    t: function t(key) {
      var data = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      _ember["default"].deprecate('locale is a reserved attribute', data['locale'] === undefined, {
        id: 'ember-i18n.reserve-locale',
        until: '5.0.0'
      });

      _ember["default"].deprecate('htmlSafe is a reserved attribute', data['htmlSafe'] === undefined, {
        id: 'ember-i18n.reserve-htmlSafe',
        until: '5.0.0'
      });

      var locale = this.get('_locale');
      assert("I18n: Cannot translate when locale is null", locale);
      var count = get(data, 'count');

      var defaults = makeArray(get(data, 'default'));

      defaults.unshift(key);
      var template = locale.getCompiledTemplate(defaults, count);

      if (template._isMissing) {
        this.trigger('missing', this.get('locale'), key, data);
      }

      return template(data);
    },

    // @public
    exists: function exists(key) {
      var data = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var locale = this.get('_locale');
      assert("I18n: Cannot check existance when locale is null", locale);
      var count = get(data, 'count');

      var translation = locale.findTranslation(makeArray(key), count);
      return typeOf(translation.result) !== 'undefined' && !translation.result._isMissing;
    },

    // @public
    addTranslations: function addTranslations(locale, translations) {
      (0, _emberI18nUtilsAddTranslations["default"])(locale, translations, getOwner(this));
      this._addLocale(locale);

      if (this.get('locale').indexOf(locale) === 0) {
        this.get('_locale').rebuild();
      }
    },

    // @private
    _initDefaults: on('init', function () {
      var owner = getOwner(this);
      var ENV = owner.factoryFor('config:environment')["class"];

      if (this.get('locale') == null) {
        var defaultLocale = (ENV.i18n || {}).defaultLocale;
        if (defaultLocale == null) {
          warn('ember-i18n did not find a default locale; falling back to "en".', false, {
            id: 'ember-i18n.default-locale'
          });

          defaultLocale = 'en';
        }
        this.set('locale', defaultLocale);
      }
    }),

    // @private
    //
    // adds a runtime locale to the array of locales on disk
    _addLocale: function _addLocale(locale) {
      this.get('locales').addObject(locale);
    },

    _locale: computed('locale', function () {
      var locale = this.get('locale');

      return locale ? new _emberI18nUtilsLocale["default"](this.get('locale'), getOwner(this)) : null;
    })
  });
});