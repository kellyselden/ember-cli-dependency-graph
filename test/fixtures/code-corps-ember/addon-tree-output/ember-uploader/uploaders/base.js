define('ember-uploader/uploaders/base', ['exports', 'ember'], function (exports, _ember) {
  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  var get = _ember['default'].get;
  var set = _ember['default'].set;
  var run = _ember['default'].run;
  exports['default'] = _ember['default'].Object.extend(_ember['default'].Evented, {
    /**
     * Target url to upload to
     *
     * @property url
     */
    url: null,

    /**
     * ajax request method, by default it will be POST
     *
     * @property method
     */
    method: 'POST',

    /**
     * Used to define a namespace for the file param and any extra data params
     * that may be sent
     *
     * @property paramNamespace
     */
    paramNamespace: null,

    /**
     * The parameter name for the file(s) to be uploaded
     *
     * @property paramName
     */
    paramName: 'file',

    /**
     * Boolean property changed to true upon upload start and false upon upload
     * end
     *
     * @property isUploading
     */
    isUploading: false,

    /**
     * The ajax settings used in all requests made from the uploader
     *
     * @property ajaxSettings
     */
    ajaxSettings: {},

    /**
     * Start upload of file(s) and any extra data
     *
     * @param  {object|array} files  One file object or one array of files object
     * @param  {object} extra Extra data to be sent with the upload
     * @return {object} Returns a Ember.RSVP.Promise wrapping the ajax request
     * object
     */
    upload: function upload(files) {
      var extra = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var data = this.createFormData(files, extra);
      var url = get(this, 'url');
      var method = get(this, 'method');

      set(this, 'isUploading', true);

      return this.ajax(url, data, method);
    },

    /**
     * Creates the FormData object with the file(s) and any extra data
     *
     * @param {object|array} files One file object or an array of file objects
     * @param {object} extra Extra data to be sent with the upload
     * @return {object} Returns a FormData object with the supplied file(s) and
     * extra data
     */
    createFormData: function createFormData(files) {
      var extra = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var formData = new FormData();

      for (var prop in extra) {
        if (extra.hasOwnProperty(prop)) {
          formData.append(this.toNamespacedParam(prop), extra[prop]);
        }
      }

      // if is a array of files ...
      if (files.constructor === FileList || files.constructor === Array) {
        var paramKey = this.toNamespacedParam(this.paramName) + '[]';

        for (var i = 0; i < files.length; i++) {
          // FormData expects the key for arrays to be postfixed with empty
          // brackets This same key is used each time a new item is added.
          formData.append(paramKey, files[i]);
        }
      } else {
        // if has only one file object ...
        formData.append(this.toNamespacedParam(this.paramName), files);
      }

      return formData;
    },

    /**
     * Returns the param name namespaced if a namespace exists
     *
     * @param {string} name The param name to namespace
     * @return {string} Returns the namespaced param
     */
    toNamespacedParam: function toNamespacedParam(name) {
      return this.paramNamespace ? this.paramNamespace + '[' + name + ']' : name;
    },

    /**
     * Triggers didUpload event with given params and sets isUploading to false
     *
     * @param {object} data Object of data supplied to the didUpload event
     * @return {object} Returns the given data
     */
    didUpload: function didUpload(data) {
      set(this, 'isUploading', false);
      this.trigger('didUpload', data);
      return data;
    },

    /**
     * Triggers didError event with given params and sets isUploading to false
     *
     * @param {object} jqXHR jQuery XMLHttpRequest object
     * @param {string} textStatus The status code of the error
     * @param {object} errorThrown The error caused
     * @return {object} Returns the jQuery XMLHttpRequest
     */
    didError: function didError(jqXHR, textStatus, errorThrown) {
      set(this, 'isUploading', false);

      // Borrowed from Ember Data
      var isObject = jqXHR !== null && typeof jqXHR === 'object';

      if (isObject) {
        jqXHR.then = null;
        if (!jqXHR.errorThrown) {
          if (typeof errorThrown === 'string') {
            jqXHR.errorThrown = new Error(errorThrown);
          } else {
            jqXHR.errorThrown = errorThrown;
          }
        }
      }

      this.trigger('didError', jqXHR, textStatus, errorThrown);

      return jqXHR;
    },

    /**
     * Triggers progress event supplying event with current percent
     *
     * @param {object} event Event from xhr onprogress
     */
    didProgress: function didProgress(event) {
      event.percent = event.loaded / event.total * 100;
      this.trigger('progress', event);
    },

    /**
     * Triggers isAborting event and sets isUploading to false
     */
    abort: function abort() {
      set(this, 'isUploading', false);
      this.trigger('isAborting');
    },

    /**
     * Starts a request to the given url sending the supplied data using the
     * supplied request method
     *
     * @param {string} url The target url for the request
     * @param {object} data The data to send with the request
     * @param {string} method The request method
     * @return {object} Returns a Ember.RSVP.Promise wrapping the ajax request
     * object
     */
    ajax: function ajax(url) {
      var _this = this;

      var data = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var method = arguments.length <= 2 || arguments[2] === undefined ? this.method : arguments[2];

      var ajaxSettings = get(this, 'ajaxSettings');

      return this.ajaxPromise(_extends({}, ajaxSettings, {
        contentType: false,
        processData: false,
        xhr: function xhr() {
          var xhr = _ember['default'].$.ajaxSettings.xhr();
          xhr.upload.onprogress = function (event) {
            _this.didProgress(event);
          };
          _this.one('isAborting', function () {
            return xhr.abort();
          });
          return xhr;
        },
        url: url,
        data: data,
        method: method
      }));
    },

    /**
     * Starts a request using the supplied settings returning a
     * Ember.RSVP.Promise wrapping the ajax request
     *
     * @param {object} settings The jQuery.ajax compatible settings object
     * @return {object} Returns a Ember.RSVP.Promise wrapping the ajax request
     */
    ajaxPromise: function ajaxPromise(settings) {
      var _this2 = this;

      return new _ember['default'].RSVP.Promise(function (resolve, reject) {
        settings.success = function (data) {
          run(null, resolve, _this2.didUpload(data));
        };

        settings.error = function (jqXHR, responseText, errorThrown) {
          run(null, reject, _this2.didError(jqXHR, responseText, errorThrown));
        };

        _ember['default'].$.ajax(settings);
      });
    }
  });
});