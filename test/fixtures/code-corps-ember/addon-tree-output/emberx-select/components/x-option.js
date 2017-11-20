define('emberx-select/components/x-option', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var isArray = Ember.isArray;
  exports.default = Ember.Component.extend({
    tagName: 'option',
    attributeBindings: ['selected', 'name', 'disabled', 'value', 'title'],
    classNameBindings: [':x-option'],

    /**
     * The value associated with this option. When this option is
     * selected, the `x-select` will fire its action with this
     * value.
     *
     * @property value
     * @type Object
     * @default null
     */
    value: null,

    /**
     * Property bound to the `selected` attribute of the native
     * `<option>` element. It is aware of the containing `x-select`'s
     * value and will mark itself if it is the same.
     *
     * @private
     * @property selected
     * @type Boolean
     */
    selected: Ember.computed('value', 'select.value', 'select.multiple', function () {
      if (this.get('select.multiple') && isArray(this.get('select.value'))) {
        var selectValue = Ember.A(this.get('select.value'));

        return selectValue.includes(this.get('value'));
      } else {
        return this.get('value') === this.get('select.value');
      }
    }),

    didReceiveAttrs: function didReceiveAttrs() {
      this._super.apply(this, arguments);

      var oldDisabled = this.get('_oldDisabled');

      if (oldDisabled !== undefined && !oldDisabled) {
        // Undefined means the first time

        if (this.get('disabled') !== oldDisabled) {
          this.sendAction('on-disable', this.get('value'), this.get('disabled'));
        }
      }

      this.set('_oldDisabled', this.get('disabled'));
    },


    /**
     * Register this x-option with the containing `x-select`
     *
     * @override
     */
    didInsertElement: function didInsertElement() {
      var _this = this;

      this._super.apply(this, arguments);

      Ember.run.scheduleOnce('afterRender', function () {
        _this.get('register')(_this);
      });
    },


    /**
     * Unregister this x-option with its containing x-select.
     *
     * @override
     */
    willDestroyElement: function willDestroyElement() {
      this.get('unregister')(this);
      this._super.apply(this, arguments);
    }
  });
});