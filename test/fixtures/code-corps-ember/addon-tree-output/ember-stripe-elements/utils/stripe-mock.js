define("ember-stripe-elements/utils/stripe-mock", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var StripeMock = function StripeMock(publishableKey) {
    this.publishableKey = publishableKey;
  };

  StripeMock.prototype.elements = function () {
    return {
      create: function create() {
        return {
          mount: function mount() {},
          on: function on() {},
          unmount: function unmount() {}
        };
      }
    };
  };
  StripeMock.prototype.createToken = function () {};
  StripeMock.prototype.createSource = function () {};
  StripeMock.prototype.retrieveSource = function () {};
  StripeMock.prototype.paymentRequest = function () {};

  exports.default = StripeMock;
});