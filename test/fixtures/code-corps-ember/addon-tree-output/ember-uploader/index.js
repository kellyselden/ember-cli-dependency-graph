define('ember-uploader/index', ['exports', 'ember', 'ember-uploader/core', 'ember-uploader/uploaders', 'ember-uploader/components'], function (exports, _ember, _emberUploaderCore, _emberUploaderUploaders, _emberUploaderComponents) {

  if (_ember['default'].VERSION.match(/^1/)) {
    _ember['default'].Logger.warn('This version of Ember Uploader has not been tested on Ember 1.x. Use at your own risk.');
  }

  _emberUploaderCore['default'].Uploader = _emberUploaderUploaders.Uploader;
  _emberUploaderCore['default'].S3Uploader = _emberUploaderUploaders.S3Uploader;

  _emberUploaderCore['default'].FileField = _emberUploaderComponents.FileField;

  _ember['default'].lookup.EmberUploader = _emberUploaderCore['default'];

  exports['default'] = _emberUploaderCore['default'];
});

/**
  Ember Uploader
  @module ember-uploader
  @main ember-uploader
*/