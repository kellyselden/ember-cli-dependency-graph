define('ember-computed-decorators/utils/handle-descriptor', ['exports', 'ember-computed-decorators/utils/extract-value', 'ember-macro-helpers/computed'], function (exports, _emberComputedDecoratorsUtilsExtractValue, _emberMacroHelpersComputed) {
  exports['default'] = handleDescriptor;

  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

  function handleDescriptor(target, key, desc) {
    var params = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];

    return {
      enumerable: desc.enumerable,
      configurable: desc.configurable,
      writeable: desc.writeable,
      initializer: function initializer() {
        if (!desc.writable) {
          throw new Error('ember-computed-decorators does not support using getters and setters');
        }

        var value = (0, _emberComputedDecoratorsUtilsExtractValue['default'])(desc);
        return _emberMacroHelpersComputed['default'].apply(undefined, _toConsumableArray(params.concat(value)));
      }
    };
  }
});