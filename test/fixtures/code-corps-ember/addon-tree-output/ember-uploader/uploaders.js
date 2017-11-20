define('ember-uploader/uploaders', ['exports', 'ember-uploader/uploaders/base', 'ember-uploader/uploaders/s3'], function (exports, _emberUploaderUploadersBase, _emberUploaderUploadersS3) {
  exports.Uploader = _emberUploaderUploadersBase['default'];
  exports.S3Uploader = _emberUploaderUploadersS3['default'];
});