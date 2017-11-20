define('ember-cli-mirage/orm/associations/association', ['exports'], function (exports) {
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var Association = function Association(modelName, opts) {
    _classCallCheck(this, Association);

    if (typeof modelName === 'object') {
      // Received opts only
      this.modelName = undefined;
      this.opts = modelName;
    } else {
      // The modelName of the association
      this.modelName = modelName;
      this.opts = opts || {};
    }

    // The key pointing to the association
    this.key = '';

    // The modelName that owns this association
    this.ownerModelName = '';
  };

  exports['default'] = Association;
});