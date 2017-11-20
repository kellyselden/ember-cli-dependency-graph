define('code-corps-ember/components/code-theme-selector', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var get = Ember.get;
  var service = Ember.inject.service;
  var alias = Ember.computed.alias;
  exports.default = Component.extend({
    classNames: ['code-theme-selector'],
    classNameBindings: ['themeClass'],

    /**
     * @property codeTheme
     * @type Ember.Service
     */
    codeTheme: service(),

    /**
     * Returns the current code theme's class name.
     *
     * @property themeClass
     * @type String
     */
    themeClass: alias('codeTheme.className'),

    /**
     * Fires on click. Toggles the code theme.
     *
     * @method click
     */
    click: function click() {
      get(this, 'codeTheme').toggle();
    }
  });
});