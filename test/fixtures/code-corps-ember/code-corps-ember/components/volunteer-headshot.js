define('code-corps-ember/components/volunteer-headshot', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var alias = Ember.computed.alias;
  var Component = Ember.Component;
  var get = Ember.get;
  var computed = Ember.computed;
  var isPresent = Ember.isPresent;
  exports.default = Component.extend({
    classNames: ['volunteer-headshot'],

    /**
      A computed alias of the volunteer's user roles.
       @property userRoles
      @type Ember.Array
     */
    userRoles: alias('volunteer.userRoles'),

    /**
      A randomly selected role from the `userRoles` property.
       @property userRole
      @type Ember.Model
     */
    userRole: computed('userRoles', function () {
      var userRoles = get(this, 'userRoles');

      if (isPresent(userRoles)) {
        var randomIndex = Math.floor(Math.random() * get(userRoles, 'length'));

        return userRoles.objectAt(randomIndex);
      }
    }),

    /**
     * Returns the volunteer's name. If the `name` property is not defined,
     * it returns the volunteer's username.
     *
     * @property volunteerName
     * @type String
     */
    volunteerName: computed('volunteer.{name,username}', function () {
      var name = get(this, 'volunteer.name');
      var username = get(this, 'volunteer.username');

      if (isPresent(name)) {
        return name;
      } else {
        return username;
      }
    })
  });
});