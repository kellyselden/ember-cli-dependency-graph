define('code-corps-ember/components/category-item', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var service = Ember.inject.service;
  var set = Ember.set;
  var get = Ember.get;
  var computed = Ember.computed;
  var notEmpty = Ember.computed.notEmpty;
  exports.default = Component.extend({
    classNames: ['category-item'],
    isLoading: false,

    /**
     * @property flashMessages
     * @type Ember.Service
     */
    flashMessages: service(),

    /**
     * @property userCategories
     * @type Ember.Service
     */
    userCategories: service(),

    /**
     * Returns the class name for the icon.
     *
     * @property iconClass
     * @type String
     */
    iconClass: computed('category.slug', 'selected', function () {
      var slug = get(this, 'category.slug');
      if (get(this, 'selected')) {
        return 'category-item__icon--' + slug + '--selected';
      } else {
        return 'category-item__icon--' + slug;
      }
    }),

    /**
     * Returns if the category has been selected by the user.
     *
     * @property selected
     * @type Boolean
     */
    selected: notEmpty('userCategory'),

    /**
     * Fetches the category using the `userCategories` service.
     *
     * @property userCategory
     * @type {Object} category
     */
    userCategory: computed('category', 'userCategories.userCategories', function () {
      var category = get(this, 'category');
      var userCategories = get(this, 'userCategories');

      return userCategories.findUserCategory(category);
    }),

    actions: {

      /**
       * Action that sets the `isLoading` property to `true` and saves the
       * category to the user's categories. If there is an error saving the
       * category, a flash message is displayed. The `isLoading` property is
       * reset after the save passes/fails.
       *
       * @method addCategory
       * @param {Object} category
       */
      addCategory: function addCategory(category) {
        var _this = this;

        set(this, 'isLoading', true);
        var userCategories = get(this, 'userCategories');

        return userCategories.addCategory(category).catch(function () {
          var message = 'An error occurred trying to add ' + get(category, 'name') + '.';
          _this._flashError(message);
        }).finally(function () {
          set(_this, 'isLoading', false);
        });
      },


      /**
       * Action that sets the `isLoading` property to `true` and removes the
       * category from the user's categories. If there is an error removing the
       * category, a flash message is displayed. The `isLoading` property is reset
       * after the removal passes/fails
       *
       * @method removeCategory
       * @param {Object} category
       */
      removeCategory: function removeCategory(category) {
        var _this2 = this;

        set(this, 'isLoading', true);
        var userCategories = get(this, 'userCategories');

        return userCategories.removeCategory(category).catch(function () {
          var message = 'An error occurred trying to remove ' + get(category, 'name') + '.';
          _this2._flashError(message);
        }).finally(function () {
          set(_this2, 'isLoading', false);
        });
      }
    },

    /**
     * Displays a flash message with the given message.
     *
     * @method flashError
     * @param {String} message
     * @private
     */
    _flashError: function _flashError(message) {
      var options = { fixed: true, sticky: false, timeout: 5000 };
      get(this, 'flashMessages').clearMessages().danger(message, options);
    }
  });
});