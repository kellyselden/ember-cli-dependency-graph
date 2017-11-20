define('code-corps-ember/components/demo-category-item', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var get = Ember.get;
  var computed = Ember.computed;
  exports.default = Component.extend({
    classNames: ['category-item'],

    iconClass: computed('category.slug', 'selected', function () {
      var slug = get(this, 'category.slug');
      if (get(this, 'selected')) {
        return 'category-item__icon--' + slug + '--selected';
      } else {
        return 'category-item__icon--' + slug;
      }
    })
  });
});