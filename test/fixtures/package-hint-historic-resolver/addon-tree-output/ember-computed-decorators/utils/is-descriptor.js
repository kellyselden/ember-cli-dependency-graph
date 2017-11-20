define('ember-computed-decorators/utils/is-descriptor', ['exports'], function (exports) {
  exports['default'] = isDescriptor;

  function isDescriptor(item) {
    return item && typeof item === 'object' && 'writable' in item && 'enumerable' in item && 'configurable' in item;
  }
});