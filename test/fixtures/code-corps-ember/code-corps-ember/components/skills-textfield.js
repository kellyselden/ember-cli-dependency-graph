define('code-corps-ember/components/skills-textfield', ['exports', 'ember-keyboard'], function (exports, _emberKeyboard) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var set = Ember.set;
  var get = Ember.get;
  var TextField = Ember.TextField;
  exports.default = TextField.extend({
    tagname: 'input',

    init: function init() {
      this._super.apply(this, arguments);
      set(this, 'keyboardActivated', true);
    },
    keyDown: function keyDown(e) {
      var key = (0, _emberKeyboard.getCode)(e);
      switch (key) {
        case 'ArrowDown':
        case 'ArrowUp':
        case 'Comma':
        case 'Enter':
          e.preventDefault();
          break;
        default:
          this._super.apply(this, arguments);
      }
      get(this, 'getKeyDown')(key);
    }
  });
});