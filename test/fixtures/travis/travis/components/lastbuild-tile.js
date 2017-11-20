define('travis/components/lastbuild-tile', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend({

    tagName: 'li',
    classNameBindings: ['build.state']

  });
});