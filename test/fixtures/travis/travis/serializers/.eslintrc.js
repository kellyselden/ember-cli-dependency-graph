define('travis/serializers/.eslintrc', ['module'], function (module) {
  'use strict';

  module.exports = {
    rules: {
      // disable camelCase requirements as we interact with external API's
      'camelcase': 0
    }
  };
});