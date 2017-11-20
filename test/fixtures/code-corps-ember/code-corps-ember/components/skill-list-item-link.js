define('code-corps-ember/components/skill-list-item-link', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var service = Ember.inject.service;
  var set = Ember.set;
  var get = Ember.get;
  exports.default = Component.extend({
    classNames: 'skill-list-item-link',
    classNameBindings: ['justClicked', 'justRemoved', 'matched'],
    tagName: 'a',

    /**
     * Whether the user just clicked the skill. Resets to `false` on `mouseLeave`.
     * @type {Boolean}
     */
    justClicked: false,

    /**
     * Whether the user just removed the skill. Resets to `false` on `mouseLeave`.
     * @type {Boolean}
     */
    justRemoved: false,

    session: service(),

    /**
     * Toggles the `justClicked` and potentially the `justRemoved` states,
     * and also toggles the skill (add or remove the given skill for the user)
     *
     * Prevents the click from bubbling.
     *
     * @method click
     */
    click: function click(e) {
      e.stopPropagation();

      this._toggleClickState();

      var skill = get(this, 'skill');
      get(this, 'toggleSkill')(skill);
    },


    /**
     * Resets the `justClicked` and `justRemoved` states when the mouse leaves
     *
     * @method mouseLeave
     */
    mouseLeave: function mouseLeave() {
      this._resetClickState();
    },
    _resetClickState: function _resetClickState() {
      set(this, 'justClicked', false);
      set(this, 'justRemoved', false);
    },
    _toggleClickState: function _toggleClickState() {
      var userHadSkill = get(this, 'matched');
      if (userHadSkill) {
        set(this, 'justRemoved', true); // User just removed an existing skill
      } else {
        set(this, 'justRemoved', false); // User just added a new skill
      }
      set(this, 'justClicked', true);
    }
  });
});