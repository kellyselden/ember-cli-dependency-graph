define('code-corps-ember/components/organization-settings-form', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var service = Ember.inject.service;
  var set = Ember.set;
  var get = Ember.get;
  exports.default = Component.extend({
    classNames: ['organization-settings-form', 'settings-form'],

    flashMessages: service(),
    loadingBar: service(),

    uploadDone: function uploadDone(cloudinaryPublicId) {
      var _this = this;

      var organization = get(this, 'organization');
      set(organization, 'cloudinaryPublicId', cloudinaryPublicId);
      organization.save().then(function () {
        _this._stopLoadingBar();
        get(_this, 'flashMessages').clearMessages().success('Organization icon uploaded successfully');
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
      save: function save() {
        var _this2 = this;

        get(this, 'organization').save().then(function () {
          get(_this2, 'flashMessages').clearMessages().success('Organization updated successfully');
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