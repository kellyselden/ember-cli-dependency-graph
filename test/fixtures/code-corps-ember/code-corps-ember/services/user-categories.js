define('code-corps-ember/services/user-categories', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var empty = Ember.computed.empty;
  var alias = Ember.computed.alias;
  var computed = Ember.computed;
  var Service = Ember.Service;
  var service = Ember.inject.service;
  exports.default = Service.extend({
    currentUser: service(),
    store: service(),

    isEmpty: empty('userCategories'),
    user: alias('currentUser.user'),

    userCategories: computed('user.userCategories', 'user.userCategories.@each.category', 'user.userCategories.@each.user', function () {
      return this.get('user.userCategories');
    }),

    addCategory: function addCategory(category) {
      var user = this.get('user');
      var userCategory = this.get('store').createRecord('user-category', {
        user: user,
        category: category
      });
      return userCategory.save();
    },
    findUserCategory: function findUserCategory(category) {
      var _this = this;

      var userCategories = this.get('userCategories');
      if (userCategories) {
        var userCategory = userCategories.find(function (item) {
          var itemUserId = item.belongsTo('user').id();
          var itemCategoryId = item.belongsTo('category').id();
          var userId = _this.get('user.id');
          var categoryId = category.get('id');
          return itemUserId === userId && itemCategoryId === categoryId;
        });
        return userCategory;
      }
    },
    removeCategory: function removeCategory(category) {
      var userCategory = this.findUserCategory(category);
      return userCategory.destroyRecord();
    }
  });
});