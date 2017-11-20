define('travis/routes/owner/repositories', ['exports', 'travis/routes/basic', 'travis/config/environment'], function (exports, _basic, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var $ = Ember.$;
  exports.default = _basic.default.extend({
    needsAuth: false,

    titleToken: function titleToken(model) {
      var name = model.name || model.login;
      return name;
    },
    model: function model(params, transition) {
      var options = {
        headers: {
          'Travis-API-Version': '3'
        }
      };

      if (this.get('auth.signedIn')) {
        options.headers.Authorization = 'token ' + this.auth.token();
      }

      // eslint-disable-next-line
      var includes = '?include=owner.repositories,repository.default_branch,build.commit,repository.current_build';
      var owner = transition.params.owner.owner;

      var url = _environment.default.apiEndpoint + '/owner/' + owner + includes;
      return $.ajax(url, options);
    }
  });
});