define('code-corps-ember/components/user-menu', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var set = Ember.set;
  exports.default = Component.extend({
    classNames: ['user-menu', 'dropdown'],
    classNameBindings: ['hidden:menu-hidden:menu-visible'],
    hidden: true,

    actions: {
      /**
       * Action that sets the hidden attribute to true
       *
       * @method hide
       */
      hide: function hide() {
        set(this, 'hidden', true);
      },


      /**
       * Action that toggles the hidden property
       *
       * @method toggle
       */
      toggle: function toggle() {
        this.toggleProperty('hidden');
      }
    }
  });
});