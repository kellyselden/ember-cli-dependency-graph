define('code-corps-ember/controllers/start/hello', ['exports', 'code-corps-ember/mixins/onboarding-controller'], function (exports, _onboardingController) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var empty = Ember.computed.empty;
  var or = Ember.computed.or;
  var Controller = Ember.Controller;
  var service = Ember.inject.service;
  var set = Ember.set;
  var get = Ember.get;
  exports.default = Controller.extend(_onboardingController.default, {
    /**
     * disables continue button while uploading
     * @prop uploadingImage
     * @default false
     */
    uploadingImage: false,

    firstNameIsEmpty: empty('model.firstName'),
    lastNameIsEmpty: empty('model.lastName'),
    usersNameIsEmpty: or('firstNameIsEmpty', 'lastNameIsEmpty'),

    flashMessages: service(),
    loadingBar: service(),

    uploadDone: function uploadDone(cloudinaryPublicId) {
      var _this = this;

      var model = get(this, 'model');
      set(model, 'cloudinaryPublicId', cloudinaryPublicId);
      model.save().then(function () {
        _this._stopLoadingBar();
        get(_this, 'flashMessages').clearMessages().success('Photo uploaded successfully');
        set(_this, 'uploadingImage', false);
      });
    },
    uploadErrored: function uploadErrored() {
      set(this, 'uploadingImage', false);
      this._stopLoadingBar();
      get(this, 'flashMessages').clearMessages().danger('Upload failed');
    },
    uploadStarted: function uploadStarted() {
      set(this, 'uploadingImage', true);
      this._startLoadingBar();
    },


    actions: {
      /**
      * Action that transitions to next route when user hits `enter` key
      * if firstName and lastName fields are populated
      *
      * @method attemptToContinue
      */
      attemptToContinue: function attemptToContinue() {
        var usersNameIsEmpty = this.get('usersNameIsEmpty');
        if (!usersNameIsEmpty) {
          this.send('continue');
        }
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