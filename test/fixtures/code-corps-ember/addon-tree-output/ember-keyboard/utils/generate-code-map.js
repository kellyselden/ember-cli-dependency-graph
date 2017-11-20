define('ember-keyboard/utils/generate-code-map', ['exports', 'ember-keyboard/fixtures/code-maps/default', 'ember-keyboard/fixtures/code-maps/mac-safari-and-chrome', 'ember-keyboard/fixtures/code-maps/gecko', 'ember-keyboard/fixtures/code-maps/gecko/linux', 'ember-keyboard/fixtures/code-maps/gecko/mac', 'ember-keyboard/fixtures/code-maps/chromium/linux'], function (exports, _default, _macSafariAndChrome, _gecko, _linux, _mac, _linux2) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = generateCodeMap;
  var assign = Ember.assign;
  function generateCodeMap() {
    var platform = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var product = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    var isGecko = product.indexOf('Gecko') > -1;
    var isChromium = product.indexOf('Chromium') > -1;
    var isChrome = product.indexOf('Chrome') > -1;
    var isSafari = product.indexOf('Safari') > -1;
    var isLinux = platform.indexOf('Linux') > -1;
    var isMac = platform.indexOf('Mac') > -1;

    var codeMap = assign({}, _default.default);

    if (isGecko) {
      assign(codeMap, _gecko.default);

      if (isLinux) {
        assign(codeMap, _linux.default);
      } else if (isMac) {
        assign(codeMap, _mac.default);
      }
    } else if (isChromium && isLinux) {
      assign(codeMap, _linux2.default);
    } else if (isMac && (isSafari || isChrome)) {
      assign(codeMap, _macSafariAndChrome.default);
    }

    return codeMap;
  }
});