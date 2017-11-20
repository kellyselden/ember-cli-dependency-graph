define('torii/providers/twitter-oauth1', ['exports', 'torii/providers/oauth1'], function (exports, _oauth) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _oauth.default.extend({
    name: 'twitter'
  });
});