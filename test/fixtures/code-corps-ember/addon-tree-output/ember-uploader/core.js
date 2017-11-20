define('ember-uploader/core', ['exports', 'ember', 'ember-uploader/version'], function (exports, _ember, _emberUploaderVersion) {

  /**
   * @module ember-uploader
   */

  /**
   * All Ember Uploader methods and functions are defined inside of this namespace.
   *
   * @class EmberUploader
   * @static
   */

  /**
   * @property VERSION
   * @type string
   * @static
   */

  var EmberUploader = _ember['default'].Namespace.create({
    VERSION: _emberUploaderVersion['default']
  });

  if (_ember['default'].libraries) {
    _ember['default'].libraries.registerCoreLibrary('Ember Uploader', EmberUploader.VERSION);
  }

  exports['default'] = EmberUploader;
});