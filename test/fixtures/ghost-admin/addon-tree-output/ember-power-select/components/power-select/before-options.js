define('ember-power-select/components/power-select/before-options', ['exports', 'ember-power-select/templates/components/power-select/before-options'], function (exports, _beforeOptions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var scheduleOnce = Ember.run.scheduleOnce;
  exports.default = Component.extend({
    tagName: '',
    layout: _beforeOptions.default,
    autofocus: true,

    // Lifecycle hooks
    didInsertElement: function didInsertElement() {
      this._super.apply(this, arguments);

      if (this.get('autofocus')) {
        this.focusInput();
      }
    },
    willDestroyElement: function willDestroyElement() {
      this._super.apply(this, arguments);
      if (this.get('searchEnabled')) {
        scheduleOnce('actions', this, this.get('select').actions.search, '');
      }
    },


    // Actions
    actions: {
      onKeydown: function onKeydown(e) {
        var onKeydown = this.get('onKeydown');
        if (onKeydown(e) === false) {
          return false;
        }
        if (e.keyCode === 13) {
          var select = this.get('select');
          select.actions.close(e);
        }
      }
    },

    // Methods
    focusInput: function focusInput() {
      this.input = self.document.querySelector('.ember-power-select-search-input[aria-controls="' + this.get('listboxId') + '"]');
      if (this.input) {
        scheduleOnce('afterRender', this.input, 'focus');
      }
    }
  });
});