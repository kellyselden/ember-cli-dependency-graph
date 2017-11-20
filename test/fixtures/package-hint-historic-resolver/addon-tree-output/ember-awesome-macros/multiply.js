define('ember-awesome-macros/multiply', ['exports', 'ember-awesome-macros/product'], function (exports, _product) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _product.default;
    }
  });
});