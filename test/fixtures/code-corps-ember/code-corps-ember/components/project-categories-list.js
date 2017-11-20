define('code-corps-ember/components/project-categories-list', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var sort = Ember.computed.sort;
  exports.default = Component.extend({
    classNames: ['categories'],
    sortByName: ['name'],
    tagName: 'ul',

    /**
      Returns the categories sorted by name.
       @property sortedCategories
      @type Ember.Array
     */
    sortedCategories: sort('categories', 'sortByName')
  });
});