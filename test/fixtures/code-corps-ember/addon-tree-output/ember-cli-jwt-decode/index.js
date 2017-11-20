define('ember-cli-jwt-decode/index', ['exports', 'ember-cli-jwt-decode/-base64-url-decode'], function (exports, _emberCliJwtDecodeBase64UrlDecode) {
  exports.jwt_decode = jwt_decode;

  function jwt_decode(token) {
    if (typeof token !== 'string') {
      throw new Error('Invalid token specified');
    }

    var tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      throw new Error('Invalid token specified');
    }

    return JSON.parse((0, _emberCliJwtDecodeBase64UrlDecode.base64UrlDecode)(tokenParts[1]));
  }
});
//from: https://github.com/auth0/jwt-decode/blob/master/lib/index.js