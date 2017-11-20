define('code-corps-ember/components/project-category-item', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var notEmpty = Ember.computed.notEmpty;
  var alias = Ember.computed.alias;
  var get = Ember.get;
  var computed = Ember.computed;
  var service = Ember.inject.service;
  exports.default = Component.extend({
    classNames: ['project-category-item'],
    tagName: ['li'],

    /**
     * Returns the class name for the icon.
     *
     * @property iconClass
     * @type String
     */
    iconClass: computed('category.slug', 'selected', function () {
      var slug = get(this, 'category.slug');
      if (get(this, 'selected')) {
        return 'category-item__icon--small--' + slug + '--selected';
      } else {
        return 'category-item__icon--small--' + slug;
      }
    }),

    /**
      Returns true if 'userCategory' is not empty
       @property selected
      @type Boolean
     */
    selected: notEmpty('userCategory'),

    /**
      A service that returns all userCategories.
       @property userCategories
      @type Ember.Service
     */
    userCategories: service(),

    /**
      The current user.
       @property user
      @type DS.Model
     */
    user: alias('currentUser.user'),

    /**
      Categories that the user belongs to.
       @property usersUserCategories
      @type Ember.Array
     */
    usersUserCategories: alias('user.userCategories'),

    /**
      Returns the category if it exists in the user's categories.
       @property userCategory
      @type Ember.Object
     */
    userCategory: computed('category', 'userCategories.userCategories.isFulfilled', function () {
      var category = this.get('category');
      var userCategories = this.get('userCategories');
      return userCategories.findUserCategory(category);
    })
  });
});