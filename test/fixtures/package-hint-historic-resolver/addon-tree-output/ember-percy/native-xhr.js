define("ember-percy/native-xhr", ["exports"], function (exports) {
  exports.getNativeXhr = getNativeXhr;

  function getNativeXhr() {
    return new window._percyNativeXhr();
  }

  // When imported into test-body-footer, grab a reference to the native XHR object so we can avoid
  // common ajax hijackers like mirage/pretender.

  exports["default"] = function () {
    window._percyNativeXhr = window.XMLHttpRequest;
  };
});