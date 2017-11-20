define('travis/routes/owner/running', ['exports', 'travis/routes/basic', 'travis/config/environment'], function (exports, _basic, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var $ = Ember.$;
  exports.default = _basic.default.extend({
    needsAuth: false,

    titleToken: function titleToken(model) {
      return model.name;
    },
    model: function model(params, transition) {
      var includes = '?include=user.repositories,organization.repositories,build.commit,repository.active';
      var owner = transition.params.owner.owner;

      return $.ajax({
        url: _environment.default.apiEndpoint + '/owner/' + owner + includes,
        headers: {
          'Travis-API-Version': '3'
        }
      });
    }
  });
});