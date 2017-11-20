define('package-hint-historic-resolver/utils/parse-response-headers', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = parseResponseHeaders;
  function parseResponseHeaders(responseHeaders) {
    var headers = responseHeaders.trim().split('\n').filter(function (s) {
      return s;
    });
    headers = headers.reduce(function (previousValue, currentValue) {
      var split = currentValue.split(': ');
      previousValue[split[0]] = split[1];
      return previousValue;
    }, {});
    return headers;
  }
});