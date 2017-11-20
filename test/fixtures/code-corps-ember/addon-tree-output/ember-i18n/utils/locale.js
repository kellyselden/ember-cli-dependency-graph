define('ember-i18n/utils/locale', ['exports', 'ember'], function (exports, _ember) {
  var assert = _ember['default'].assert;
  var typeOf = _ember['default'].typeOf;
  var warn = _ember['default'].warn;

  var assign = _ember['default'].assign || _ember['default'].merge;

  // @private
  //
  // This class is the work-horse of localization look-up.
  function Locale(id, owner) {
    // On Construction:
    //  1. look for translations in the locale (e.g. pt-BR) and all parent
    //     locales (e.g. pt), flatten any nested keys, and then merge them.
    //  2. walk through the configs from most specific to least specific
    //     and use the first value for `rtl` and `pluralForm`
    //  3. Default `rtl` to `false`
    //  4. Ensure `pluralForm` is defined
    this.id = id;
    this.owner = owner;
    this.rebuild();
  }

  Locale.prototype = {
    rebuild: function rebuild() {
      this.translations = getFlattenedTranslations(this.id, this.owner);
      this._setConfig();
    },

    _setConfig: function _setConfig() {
      var _this = this;

      walkConfigs(this.id, this.owner, function (config) {
        if (_this.rtl === undefined) {
          _this.rtl = config.rtl;
        }
        if (_this.pluralForm === undefined) {
          _this.pluralForm = config.pluralForm;
        }
      });

      // Exit early if we already have an RTL and pluralForm config set
      if (this.rtl !== undefined && this.pluralForm !== undefined) {
        return;
      }

      var defaultConfigFactory = this.owner.factoryFor('ember-i18n@config:zh');
      var defaultConfig = defaultConfigFactory ? defaultConfigFactory['class'] : null;

      if (this.rtl === undefined) {
        warn('ember-i18n: No RTL configuration found for ' + this.id + '.', false, { id: 'ember-i18n.no-rtl-configuration' });
        this.rtl = defaultConfig.rtl;
      }

      if (this.pluralForm === undefined) {
        warn('ember-i18n: No pluralForm configuration found for ' + this.id + '.', false, { id: 'ember-i18n.no-plural-form' });
        this.pluralForm = defaultConfig.pluralForm;
      }
    },

    getCompiledTemplate: function getCompiledTemplate(fallbackChain, count) {
      var translation = this.findTranslation(fallbackChain, count);
      var result = translation.result;

      if (typeOf(result) === 'string') {
        result = this._compileTemplate(translation.key, result);
      }

      if (result == null) {
        result = this._defineMissingTranslationTemplate(fallbackChain[0]);
      }

      assert('Template for ' + translation.key + ' in ' + this.id + ' is not a function', typeOf(result) === 'function');

      return result;
    },

    findTranslation: function findTranslation(fallbackChain, count) {
      if (this.translations === undefined) {
        this._init();
      }

      var result = undefined;
      var i = undefined;
      for (i = 0; i < fallbackChain.length; i++) {
        var key = fallbackChain[i];
        if (count != null) {
          var inflection = this.pluralForm(+count);
          result = this.translations[key + '.' + inflection];
        }

        if (result == null) {
          result = this.translations[key];
        }

        if (result) {
          break;
        }
      }

      return {
        key: fallbackChain[i],
        result: result
      };
    },

    _defineMissingTranslationTemplate: function _defineMissingTranslationTemplate(key) {
      var i18n = this.owner.lookup('service:i18n');
      var locale = this.id;
      var missingMessage = this.owner.factoryFor('util:i18n/missing-message')['class'];

      function missingTranslation(data) {
        return missingMessage.call(i18n, locale, key, data);
      }

      missingTranslation._isMissing = true;
      this.translations[key] = missingTranslation;
      return missingTranslation;
    },

    _compileTemplate: function _compileTemplate(key, string) {
      var compile = this.owner.factoryFor('util:i18n/compile-template')['class'];
      var template = compile(string, this.rtl);
      this.translations[key] = template;
      return template;
    }
  };

  function getFlattenedTranslations(id, owner) {
    var result = {};

    var parentId = parentLocale(id);
    if (parentId) {
      assign(result, getFlattenedTranslations(parentId, owner));
    }

    var factory = owner.factoryFor('locale:' + id + '/translations');
    var translations = factory && factory['class'];
    assign(result, withFlattenedKeys(translations || {}));

    return result;
  }

  // Walk up confiugration objects from most specific to least.
  function walkConfigs(id, owner, fn) {
    var maybeAppConfig = owner.factoryFor('locale:' + id + '/config');
    var appConfig = maybeAppConfig && maybeAppConfig['class'];
    if (appConfig) {
      fn(appConfig);
    }

    var maybeAddonConfig = owner.factoryFor('ember-i18n@config:' + id);
    var addonConfig = maybeAddonConfig && maybeAddonConfig['class'];
    if (addonConfig) {
      fn(addonConfig);
    }

    var parentId = parentLocale(id);
    if (parentId) {
      walkConfigs(parentId, owner, fn);
    }
  }

  function parentLocale(id) {
    var lastDash = id.lastIndexOf('-');
    return lastDash > 0 ? id.substr(0, lastDash) : null;
  }

  function withFlattenedKeys(object) {
    var result = {};

    Object.keys(object).forEach(function (key) {
      var value = object[key];

      if (typeOf(value) === 'object') {
        value = withFlattenedKeys(value);

        Object.keys(value).forEach(function (suffix) {
          result[key + '.' + suffix] = value[suffix];
        });
      } else {
        result[key] = value;
      }
    });

    return result;
  }

  exports['default'] = Locale;
});