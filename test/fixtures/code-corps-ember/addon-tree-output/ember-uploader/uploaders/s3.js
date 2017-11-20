define('ember-uploader/uploaders/s3', ['exports', 'ember', 'ember-uploader/uploaders/base'], function (exports, _ember, _emberUploaderUploadersBase) {
  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  var get = _ember['default'].get;
  var set = _ember['default'].set;
  var run = _ember['default'].run;
  exports['default'] = _emberUploaderUploadersBase['default'].extend({
    /**
     * Target url used to request a signed upload policy
     *
     * @property url
     */
    signingUrl: '/sign',

    /**
     * request method for signing
     *
     * @property method
     */
    signingMethod: 'GET',

    /**
     * Boolean property changed to true upon signing start and false upon
     * signing end
     *
     * @property isSigning
     */
    isSigning: false,

    /**
     * Request signed upload policy and upload file(s) and any extra data
     *
     * @param  {object|array} files  One file object or one array of files object
     * @param  {object} extra Extra data to be sent with the upload
     * @return {object} Returns a Ember.RSVP.Promise wrapping the signing
     * request object
     */
    upload: function upload(file) {
      var _this = this;

      var extra = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return this.sign(file, extra).then(function (json) {
        var url = undefined;

        set(_this, 'isUploading', true);

        if (json.endpoint) {
          url = json.endpoint;
          delete json.endpoint;
        } else if (json.region) {
          url = 'https://s3-' + json.region + '.amazonaws.com/' + json.bucket;
          delete json.region;
        } else {
          url = 'https://' + json.bucket + '.s3.amazonaws.com';
        }

        return _this.ajax(url, _this.createFormData(file, json));
      });
    },

    /**
     * Request signed upload policy
     *
     * @param  {object|array} files  One file object or one array of files object
     * @param  {object} extra Extra data to be sent with the upload
     * @return {object} Returns a Ember.RSVP.Promise wrapping the signing
     * request object
     */
    sign: function sign(file) {
      var _this2 = this;

      var extra = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var url = get(this, 'signingUrl');
      var method = get(this, 'signingMethod');
      var signingAjaxSettings = get(this, 'signingAjaxSettings');

      extra.name = file.name;
      extra.type = file.type;
      extra.size = file.size;

      var settings = _extends({}, signingAjaxSettings, {
        contentType: 'application/json',
        dataType: 'json',
        data: method.match(/get/i) ? extra : JSON.stringify(extra),
        method: method,
        url: url
      });

      set(this, 'isSigning', true);

      return new _ember['default'].RSVP.Promise(function (resolve, reject) {
        settings.success = function (json) {
          run(null, resolve, _this2.didSign(json));
        };

        settings.error = function (jqXHR, responseText, errorThrown) {
          run(null, reject, _this2.didErrorOnSign(jqXHR, responseText, errorThrown));
        };

        _ember['default'].$.ajax(settings);
      });
    },

    /**
     * Triggers didErrorOnSign event and sets isSigning to false
     *
     * @param {object} jqXHR jQuery XMLHttpRequest object
     * @param {string} textStatus The status code of the error
     * @param {object} errorThrown The error caused
     * @return {object} Returns the jQuery XMLHttpRequest
     */
    didErrorOnSign: function didErrorOnSign(jqXHR, textStatus, errorThrown) {
      set(this, 'isSigning', false);
      this.trigger('didErrorOnSign');
      this.didError(jqXHR, textStatus, errorThrown);
      return jqXHR;
    },

    /**
     * Triggers didSign event and returns the signing response
     *
     * @param {object} response The signing response
     * @return {object} The signing response
     */
    didSign: function didSign(response) {
      this.trigger('didSign', response);
      return response;
    }
  });
});