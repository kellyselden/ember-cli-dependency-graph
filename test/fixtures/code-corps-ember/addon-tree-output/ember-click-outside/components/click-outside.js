define('ember-click-outside/components/click-outside', ['exports', 'ember-click-outside/mixins/click-outside', 'ember-click-outside/templates/components/click-outside'], function (exports, _clickOutside, _clickOutside2) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var on = Ember.on;
  var next = Ember.run.next;
  var cancel = Ember.run.cancel;
  var $ = Ember.$;
  exports.default = Component.extend(_clickOutside.default, {
    layout: _clickOutside2.default,

    clickOutside: function clickOutside(e) {
      if (this.isDestroying || this.isDestroyed) {
        return;
      }

      var exceptSelector = this.get('except-selector');
      if (exceptSelector && $(e.target).closest(exceptSelector).length > 0) {
        return;
      }

      this.sendAction();
    },


    _attachClickOutsideHandler: on('didInsertElement', function () {
      this._cancelOutsideListenerSetup = next(this, this.addClickOutsideListener);
    }),

    _removeClickOutsideHandler: on('willDestroyElement', function () {
      cancel(this._cancelOutsideListerSetup);
      this.removeClickOutsideListener();
    })
  });
});