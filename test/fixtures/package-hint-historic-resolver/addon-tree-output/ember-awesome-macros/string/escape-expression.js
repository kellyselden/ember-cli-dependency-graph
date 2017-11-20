define('ember-awesome-macros/string/escape-expression', ['exports', 'ember-macro-helpers/curried-computed'], function (exports, _curriedComputed) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = (0, _curriedComputed.default)(Ember.Handlebars.Utils.escapeExpression);
});