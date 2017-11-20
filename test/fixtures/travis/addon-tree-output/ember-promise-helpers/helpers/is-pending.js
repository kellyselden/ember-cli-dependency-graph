define('ember-promise-helpers/helpers/is-pending', ['exports', 'ember-promise-helpers/helpers/await'], function (exports, _emberPromiseHelpersHelpersAwait) {
  exports['default'] = _emberPromiseHelpersHelpersAwait['default'].extend({
    valueBeforeSettled: true,

    compute: function compute(params, hash) {
      var _this = this;

      var maybePromise = params[0];

      return this.ensureLatestPromise(maybePromise, function (promise) {
        promise['catch'](function () {})['finally'](function () {
          _this.setValue(false, maybePromise);
        });
      });
    }
  });
});