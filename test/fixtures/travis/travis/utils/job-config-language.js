define('travis/utils/job-config-language', ['exports', 'travis/utils/keys-map'], function (exports, _keysMap) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = jobConfigLanguage;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  function jobConfigLanguage(config) {
    var gemfile = void 0,
        key = void 0,
        languageName = void 0,
        output = void 0;
    output = [];

    var completedLanguageNames = [];
    if (config) {
      for (key in _keysMap.languageConfigKeys) {
        languageName = _keysMap.languageConfigKeys[key];
        var version = config[key];
        if (version) {
          // special case for Dart lang's Task key
          if ((typeof version === 'undefined' ? 'undefined' : _typeof(version)) === 'object' && version.test) {
            version = version.test;
          }
          output.push(languageName + ': ' + version);
          completedLanguageNames.push(languageName);
        }
      }
      gemfile = config.gemfile;
      if (gemfile && config.env) {
        output.push('Gemfile: ' + gemfile);
      }

      if (config.language) {
        languageName = _keysMap.languageConfigKeys[config.language];

        if (languageName && completedLanguageNames.indexOf(languageName) === -1) {
          output.push(_keysMap.languageConfigKeys[config.language]);
        }
      }
    }
    return output.join(' ');
  }
});