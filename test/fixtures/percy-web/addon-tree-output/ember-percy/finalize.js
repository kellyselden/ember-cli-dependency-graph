define('ember-percy/finalize', ['exports', 'ember', 'ember-percy/native-xhr', 'ember-percy/mockjax-wrapper'], function (exports, _ember, _emberPercyNativeXhr, _emberPercyMockjaxWrapper) {

  // Percy finalizer to be called at the very end of the test suite.
  // Note: it is important that this is called always, no matter if percySnapshot was used or not,
  // to support parallelized test runners with Percy's aggregation of parallel finalize calls.
  function finalizeBuildOnce(config, data, callback) {
    (0, _emberPercyMockjaxWrapper.maybeDisableMockjax)();
    var options = {
      xhr: _emberPercyNativeXhr.getNativeXhr,
      method: 'POST',
      // Use "async: false" to block the browser from shutting down until the finalize_build call
      // has fully returned. This prevents testem from shutting down the express server until
      // our middleware has finished uploading resources and resolving promises.
      async: false,
      timeout: 30000
    };
    _ember['default'].$.ajax('/_percy/finalize_build', options).done(function () {
      if (callback) {
        callback();
      }
    });
    (0, _emberPercyMockjaxWrapper.maybeResetMockjax)();
  }

  // When imported into test-body-footer, register Testem hook to know when all tests are finished.

  exports['default'] = function () {
    if (window.Testem.afterTests) {
      window.Testem.afterTests(finalizeBuildOnce);
    } else {
      // Testem < v1.6.0.
      window.Testem.on('all-test-results', finalizeBuildOnce);
    }
  };
});