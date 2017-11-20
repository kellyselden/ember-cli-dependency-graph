define('code-corps-ember/adapters/application', ['exports', 'ember-data', 'ember-simple-auth/mixins/data-adapter-mixin', 'code-corps-ember/config/environment'], function (exports, _emberData, _dataAdapterMixin, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var JSONAPIAdapter = _emberData.default.JSONAPIAdapter;
  exports.default = JSONAPIAdapter.extend(_dataAdapterMixin.default, {
    authorizer: 'authorizer:token',

    // TODO: Fix this once many-to-many lands in ember-cli-mirage
    // but as of right now there is no way to make this work for
    // all possible cases
    coalesceFindRequests: true,

    host: _environment.default.API_BASE_URL
  });
});