define('ember-awesome-macros/string/titleize', ['exports', 'ember-awesome-macros/string/-utils'], function (exports, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = (0, _utils.normalizeString)(function (value) {
    // borrowed from https://github.com/romulomachado/ember-cli-string-helpers/blob/master/addon/utils/titleize.js
    // also waiting on https://github.com/emberjs/rfcs/issues/224
    return value.toLowerCase().replace(/(?:^|\s|-|\/)\S/g, function (m) {
      return m.toUpperCase();
    });
  });
});