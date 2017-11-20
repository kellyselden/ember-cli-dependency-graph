define('ember-promise-helpers/helpers/is-rejected', ['exports', 'ember-promise-helpers/helpers/await'], function (exports, _emberPromiseHelpersHelpersAwait) {
  exports['default'] = _emberPromiseHelpersHelpersAwait['default'].extend({
    compute: function compute(params, hash) {
      var _this = this;

      var maybePromise = params[0];

      return this.ensureLatestPromise(maybePromise, function (promise) {
        promise.then(function () {
          _this.setValue(false, maybePromise);
        })['catch'](function () {
          _this.setValue(true, maybePromise);
        });
      });
    }
  });
});