define('code-corps-ember/components/payments/funds-recipient/verification-document', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var alias = Ember.computed.alias;
  var Component = Ember.Component;
  var set = Ember.set;
  var get = Ember.get;
  var computed = Ember.computed;


  var VALIDATION_ERROR = 'The file you selected is invalid. Only .jpg and .png images of up to 8mb in size are supported.';
  var UPLOAD_ERROR = 'There was a problem with uploading your file. Please try again.';

  exports.default = Component.extend({
    classNames: ['verification-document'],
    tagName: 'section',

    status: alias('stripeConnectAccount.verificationDocumentStatus'),

    progressPercentage: 0,
    progressMessage: computed('progressPercentage', function () {
      var percentage = get(this, 'progressPercentage');
      return 'Uploading... ' + percentage;
    }),

    onUploadStarted: function onUploadStarted() {
      set(this, 'isUploading', true);
      set(this, 'error', null);
    },
    onUploadProgress: function onUploadProgress(percentage) {
      set(this, 'progressPercentage', percentage);
    },
    onUploadDone: function onUploadDone(stripeFileUploadId) {
      set(this, 'isUploading', false);
      var onVerificationDocumentSubmitted = get(this, 'onVerificationDocumentSubmitted');
      onVerificationDocumentSubmitted(stripeFileUploadId);
    },
    onUploadError: function onUploadError() {
      set(this, 'isUploading', false);
      set(this, 'error', UPLOAD_ERROR);
    },
    onValidationError: function onValidationError() {
      set(this, 'error', VALIDATION_ERROR);
    }
  });
});