define('code-corps-ember/components/payments/funds-recipient/identity-document-file-upload', ['exports', 'ember-uploader', 'code-corps-ember/config/environment'], function (exports, _emberUploader, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var getProperties = Ember.getProperties;
  var get = Ember.get;
  var computed = Ember.computed;
  var isEmpty = Ember.isEmpty;
  var Uploader = _emberUploader.default.Uploader;
  exports.default = _emberUploader.default.FileField.extend({
    classNames: ['identity-document-file-upload'],

    /**
     * Object containing additional properties to be passed
     * in as part of the form data being uploaded
     * @type {Object}
     */
    additionalUploadData: {
      // required to authorize the upload request
      key: _environment.default.stripe.publishableKey,
      purpose: 'identity_document'
    },

    maxFileSize: 1024 * 1024 * 8, // 8mb
    multiple: false,
    supportedFileTypes: ['image/jpeg', 'image/jpg', 'image/png'],
    url: 'https://uploads.stripe.com/v1/files',

    /**
     * A computed property containing settings for the ajax request
     * Used to set stripe account id in the request header
     * @return {Object}
     */
    ajaxSettings: computed('stripeConnectAccount', function () {
      var headers = {
        'Stripe-Account': get(this, 'stripeConnectAccount.idFromStripe')
      };

      return { headers: headers };
    }),

    /**
     * Triggers when the file selection for the rendered file input changes
     * @param {[File]} files An array of files selected by the user.
     *                        Since the `multiple` setting is set to false, only 1 file
     *                        is in the array.
     */
    filesDidChange: function filesDidChange(files) {
      if (!isEmpty(files) && this._validate(files[0])) {
        this._performUpload(files[0]);
      }
    },
    _validate: function _validate(_ref) {
      var size = _ref.size,
          type = _ref.type;

      var _getProperties = getProperties(this, 'maxFileSize', 'supportedFileTypes'),
          maxFileSize = _getProperties.maxFileSize,
          supportedFileTypes = _getProperties.supportedFileTypes;

      var isValid = size <= maxFileSize && supportedFileTypes.indexOf(type) >= 0;

      if (!isValid) {
        this.sendAction('validationError');
      }

      return isValid;
    },
    _performUpload: function _performUpload(file) {
      var _this = this;

      this.sendAction('uploadStarted');

      var params = getProperties(this, 'url', 'ajaxSettings');
      var uploader = Uploader.create(params);

      uploader.on('progress', function (event) {
        return _this._handleUploadProgress(event);
      });

      var additionalUploadData = get(this, 'additionalUploadData');

      uploader.upload(file, additionalUploadData).then(function (event) {
        return _this._handleUploadDone(event);
      }).catch(function (reason) {
        return _this._handleUploadError(reason);
      });
    },


    // error handlers

    _handleUploadDone: function _handleUploadDone(_ref2) {
      var id = _ref2.id;

      this.sendAction('uploadDone', id);
    },
    _handleUploadError: function _handleUploadError(reason) {
      this.sendAction('uploadError', reason);
    },
    _handleUploadProgress: function _handleUploadProgress(event) {
      this.sendAction('uploadProgress', event.percent);
    }
  });
});