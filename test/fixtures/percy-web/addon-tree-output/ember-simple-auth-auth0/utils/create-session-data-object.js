define('ember-simple-auth-auth0/utils/create-session-data-object', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = createSessionDataObject;

  var assign = _ember['default'].assign || _ember['default'].merge;

  function createSessionDataObject(profile, tokenInfo) {
    return assign(tokenInfo, { profile: profile });
  }
});