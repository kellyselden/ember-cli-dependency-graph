define('code-corps-ember/components/image-drop', ['exports', 'ember-uploader', 'code-corps-ember/config/environment'], function (exports, _emberUploader, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var or = Ember.computed.or;
  var notEmpty = Ember.computed.notEmpty;
  var alias = Ember.computed.alias;
  var service = Ember.inject.service;
  var isEmpty = Ember.isEmpty;
  var run = Ember.run;
  var set = Ember.set;
  var getProperties = Ember.getProperties;
  var get = Ember.get;
  var computed = Ember.computed;
  var htmlSafe = Ember.String.htmlSafe;
  var Uploader = _emberUploader.default.Uploader;
  exports.default = Component.extend({
    active: false,
    additionalUploadData: {
      upload_preset: '' + _environment.default.cloudinary.uploadPreset
    },
    attributeBindings: ['style'],
    classNames: ['image-drop'],
    classNameBindings: ['active:image-drop--active', 'circle:image-drop--circle', 'isDraggingOnApp:image-drop--drag', 'hasImage', 'large:is-large'],
    droppedImage: null,
    files: null,
    helpText: 'Click to add your photo.',
    originalImage: null,
    multiple: false,
    url: 'https://api.cloudinary.com/v1_1/' + _environment.default.cloudinary.cloud + '/image/upload',

    appDragState: service('dragState'),

    hasDroppedImage: notEmpty('droppedImage'),
    hasImage: or('hasDroppedImage', 'hasOriginalImage'),
    hasOriginalImage: notEmpty('originalImage'),
    isDraggingOnApp: alias('appDragState.isDragging'),

    style: computed('droppedImage', 'originalImage', function () {
      var backgroundStyle = '';

      var _getProperties = getProperties(this, 'droppedImage', 'originalImage'),
          droppedImage = _getProperties.droppedImage,
          originalImage = _getProperties.originalImage;

      if (droppedImage) {
        backgroundStyle = 'background-image: url(' + droppedImage + ');';
      } else if (originalImage) {
        backgroundStyle = 'background-image: url(' + originalImage + ');';
      }

      return htmlSafe(backgroundStyle);
    }),

    dragEnded: function dragEnded() {
      this.dragLeave();
      get(this, 'appDragState').leaving();
    },
    dragLeave: function dragLeave() {
      set(this, 'active', false);
    },
    dragOver: function dragOver() {
      set(this, 'active', true);
    },
    drop: function drop(event) {
      var _this = this;

      event.preventDefault();
      var _event$dataTransfer = event.dataTransfer,
          files = _event$dataTransfer.files,
          getData = _event$dataTransfer.getData;

      if (files && files.length > 0) {
        return this._handleFileDrop(files[0]);
      }

      var imageUrl = getData('URL');
      if (!imageUrl) {
        return;
      }

      this._convertImgToBase64URL(imageUrl, function (base64) {
        set(_this, 'droppedImage', base64);
      });
    },


    /**
     * Triggers when the file selection for the rendered file input changes
     * @param {[File]} files An array of files selected by the user.
     * Since the `multiple` setting is set to false, only 1 file
     * is in the array.
     */
    filesDidChange: function filesDidChange(files) {
      if (!isEmpty(files)) {
        this._handleFileDrop(files[0]);
      }
    },
    _convertImgToBase64URL: function _convertImgToBase64URL(url, callback, outputFormat) {
      var img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function () {
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
        var dataURL = void 0;
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
        canvas = null;
      };
      img.src = url;
    },
    _handleFileDrop: function _handleFileDrop(file) {
      var _this2 = this;

      if (file == null) {
        return;
      }

      set(this, 'file', file);
      var reader = new FileReader();
      reader.onload = function (e) {
        var fileToUpload = e.target.result;
        run(function () {
          set(_this2, 'droppedImage', fileToUpload);
          _this2.dragEnded();
          _this2._performUpload(file);
        });
      };

      reader.readAsDataURL(file);
    },
    _handleUploadStarted: function _handleUploadStarted() {
      this.sendAction('onStart');
    },
    _handleUploadDone: function _handleUploadDone(_ref) {
      var public_id = _ref.public_id;

      this.sendAction('onDone', public_id);
    },
    _handleUploadError: function _handleUploadError(reason) {
      if (get(this, 'isDestroyed')) {
        return;
      }
      set(this, 'droppedImage', null);
      this.sendAction('onError', reason);
    },
    _performUpload: function _performUpload(file) {
      var _this3 = this;

      this._handleUploadStarted();

      var params = getProperties(this, 'url');
      var uploader = Uploader.create(params);

      var additionalUploadData = get(this, 'additionalUploadData');

      uploader.upload(file, additionalUploadData).then(function (event) {
        return _this3._handleUploadDone(event);
      }).catch(function (reason) {
        return _this3._handleUploadError(reason);
      });
    }
  });
});