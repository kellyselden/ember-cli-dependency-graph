define('code-corps-ember/components/related-skills', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var set = Ember.set;
  exports.default = Component.extend({
    classNames: ['related-skills'],

    isClickable: false,

    /**
     * Returns whether or not the overflowing skills on the project card
     * should be displayed.
     *
     * @property overflowHidden
     * @type Boolean
     * @default false
     */
    overflowHidden: false,

    /**
     * Returns whether or not the toggle for showing overflowing skills
     * should be visible or not.
     *
     * @property showToggle
     * @type Boolean
     * @default false
     */
    showToggle: false,

    actions: {

      /**
        Action that hides the overflowing skills.
         @method showLess
       */
      showLess: function showLess() {
        set(this, 'overflowHidden', true);
      },


      /**
        Action that shows the overflowing skills.
         @method showMore
       */
      showMore: function showMore() {
        set(this, 'overflowHidden', false);
      },


      /**
        Action that enables the overflow skills toggle. The skills self calculate
        if they are overflowing. If there is an overflow, this action is called
        and the toggle is shown; hiding the overflowing skills by default.
         @method skillItemHidden
       */
      skillItemHidden: function skillItemHidden() {
        set(this, 'showToggle', true);
      }
    }
  });
});