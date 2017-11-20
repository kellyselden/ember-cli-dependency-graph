define('code-corps-ember/serializers/stripe-connect-account', ['exports', 'code-corps-ember/serializers/application'], function (exports, _application) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _application.default.extend({
    attrs: {
      legalEntitySsnLast4: { key: 'legal-entity-ssn-last-4' },
      legalEntitySsnLast4Provided: { key: 'legal-entity-ssn-last-4-provided' }
    },

    /**
     * Overrides default serializeAttributes so it only serializes changed attributes,
     * instead of the default behavior, which is all of them.
     */
    serializeAttribute: function serializeAttribute(snapshot, json, key) {
      if (snapshot.changedAttributes()[key] || snapshot.record.get('isNew')) {
        this._super.apply(this, arguments);
      }
    }
  });
});