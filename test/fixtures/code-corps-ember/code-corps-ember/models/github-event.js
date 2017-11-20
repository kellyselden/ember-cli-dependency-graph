define('code-corps-ember/models/github-event', ['exports', 'ember-data/model', 'ember-data/attr'], function (exports, _model, _attr) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = Ember.computed;
  var get = Ember.get;
  exports.default = _model.default.extend({
    action: (0, _attr.default)(),
    error: (0, _attr.default)(),
    eventType: (0, _attr.default)(),
    failureReason: (0, _attr.default)(),
    githubDeliveryId: (0, _attr.default)(),
    insertedAt: (0, _attr.default)('date'),
    payload: (0, _attr.default)(),
    recordData: (0, _attr.default)(),
    status: (0, _attr.default)(),
    updatedAt: (0, _attr.default)('date'),

    retry: (0, _attr.default)(), // virtual attr

    prettyPayload: computed('payload', function () {
      var payload = get(this, 'payload');
      return JSON.stringify(payload, null, 2);
    })
  });
});