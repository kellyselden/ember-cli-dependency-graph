define('travis/mirage/serializers/git-user', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.ActiveModelSerializer.extend({
    serializeSingle: function serializeSingle(user /* , request, options */) {
      var _user$attrs = user.attrs,
          avatar_url = _user$attrs.avatar_url,
          name = _user$attrs.name;

      return { avatar_url: avatar_url, name: name };
    }
  });
});