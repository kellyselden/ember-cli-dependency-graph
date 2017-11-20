define('ember-computed-decorators/utils/extract-value', ['exports'], function (exports) {
  exports['default'] = extractValue;

  function extractValue(desc) {
    return desc.value || typeof desc.initializer === 'function' && desc.initializer();
  }
});