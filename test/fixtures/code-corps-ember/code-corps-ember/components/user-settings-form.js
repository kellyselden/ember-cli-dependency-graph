define('code-corps-ember/components/user-settings-form', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var service = Ember.inject.service;
  var set = Ember.set;
  var get = Ember.get;
  exports.default = Component.extend({
    classNames: ['user-settings-form', 'settings-form'],

    /**
      @property flashMessages
      @type Ember.Service
     */
    flashMessages: service(),
    loadingBar: service(),

    uploadDone: function uploadDone(cloudinaryPublicId) {
      var _this = this;

      var user = get(this, 'user');
      set(user, 'cloudinaryPublicId', cloudinaryPublicId);
      user.save().then(function () {
        _this._stopLoadingBar();
        get(_this, 'flashMessages').clearMessages().success('Photo uploaded successfully');
      });
    },
    uploadErrored: function uploadErrored() {
      this._stopLoadingBar();
      get(this, 'flashMessages').clearMessages().danger('Upload failed');
    },
    uploadStarted: function uploadStarted() {
      this._startLoadingBar();
    },


    actions: {
      /**
        Action to save the user's settings.
         @method save
       */
      save: function save() {
        var _this2 = this;

        get(this, 'user').save().then(function () {
          get(_this2, 'flashMessages').clearMessages().success('Profile updated successfully');
        });
      }
    },

    _startLoadingBar: function _startLoadingBar() {
      get(this, 'loadingBar').start();
    },
    _stopLoadingBar: function _stopLoadingBar() {
      get(this, 'loadingBar').stop();
    }
  });
});