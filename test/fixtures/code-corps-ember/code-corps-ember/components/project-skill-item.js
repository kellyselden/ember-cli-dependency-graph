define('code-corps-ember/components/project-skill-item', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var getProperties = Ember.getProperties;
  exports.default = Component.extend({
    classNames: ['skill', 'has-spinner', 'default', 'small'],
    tagName: 'button',

    click: function click() {
      var _getProperties = getProperties(this, 'skill', 'onClicked'),
          skill = _getProperties.skill,
          onClicked = _getProperties.onClicked;

      onClicked(skill);
    }
  });
});