define('code-corps-ember/components/categories-list', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var sort = Ember.computed.sort;
  var Component = Ember.Component;
  exports.default = Component.extend({
    classNames: ['start__interests'],

    /**
     * An array of properties used to sort the list of categories.
     *
     * @property sortByName
     * @type Array
     */
    sortByName: ['name'],

    /**
     * `sortedCategories` consumes the list of categories and sorts them based on
     * the `sortByName` property.
     *
     * @property sortedCategories
     * @type Array
     */
    sortedCategories: sort('categories', 'sortByName')
  });
});