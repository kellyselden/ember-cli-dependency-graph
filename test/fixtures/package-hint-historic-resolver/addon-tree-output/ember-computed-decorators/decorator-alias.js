define('ember-computed-decorators/decorator-alias', ['exports', 'ember-computed-decorators/utils/extract-value'], function (exports, _emberComputedDecoratorsUtilsExtractValue) {
  exports['default'] = decoratorAlias;

  function decoratorAlias(fn, errorMessage) {
    return function () {
      for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
        params[_key] = arguments[_key];
      }

      // determine if user called as @computed('blah', 'blah') or @computed
      if (params.length === 0) {
        throw new Error(errorMessage);
      } else {
        return function (target, key, desc) {
          return {
            enumerable: desc.enumerable,
            configurable: desc.configurable,
            writable: desc.writable,
            initializer: function initializer() {
              var value = (0, _emberComputedDecoratorsUtilsExtractValue['default'])(desc);
              return fn.apply(null, params.concat(value));
            }
          };
        };
      }
    };
  }
});