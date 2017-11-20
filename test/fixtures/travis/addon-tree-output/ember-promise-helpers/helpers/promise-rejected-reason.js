define('ember-promise-helpers/helpers/promise-rejected-reason', ['exports', 'ember-promise-helpers/helpers/await'], function (exports, _emberPromiseHelpersHelpersAwait) {
  exports['default'] = _emberPromiseHelpersHelpersAwait['default'].extend({
    compute: function compute(params, hash) {
      var _this = this;

      var maybePromise = params[0];
      return this.ensureLatestPromise(maybePromise, function (promise) {
        promise.then(function () {
          _this.setValue(null, maybePromise);
        })['catch'](function (reason) {
          _this.setValue(reason, maybePromise);
        });
      });
    }
  });
});