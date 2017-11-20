define('ember-cli-jwt-decode/-base64-url-decode', ['exports', 'ember-cli-jwt-decode/-atob'], function (exports, _emberCliJwtDecodeAtob) {
  exports.base64UrlDecode = base64UrlDecode;

  function b64DecodeUnicode(str) {
    return decodeURIComponent((0, _emberCliJwtDecodeAtob.atob)(str).replace(/(.)/g, function (m, p) {
      var code = p.charCodeAt(0).toString(16).toUpperCase();
      if (code.length < 2) {
        code = '0' + code;
      }
      return '%' + code;
    }));
  }

  function base64UrlDecode(str) {
    var output = str.replace(/-/g, "+").replace(/_/g, "/");
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += "==";
        break;
      case 3:
        output += "=";
        break;
      default:
        throw "Illegal base64url string!";
    }

    try {
      return b64DecodeUnicode(output);
    } catch (err) {
      return (0, _emberCliJwtDecodeAtob.atob)(output);
    }
  }
});
//from: https://github.com/auth0/jwt-decode/blob/master/lib/base64_url_decode.js