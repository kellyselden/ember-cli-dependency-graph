define('liquid-wormhole/services/liquid-wormhole', ['exports', 'perf-primitives/hash-map'], function (exports, _hashMap) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var getOwner = Ember.getOwner;
  exports.default = Ember.Service.extend({
    init: function init() {
      this._super.apply(this, arguments);

      this.destination = new _hashMap.default();
    },
    appendWormhole: function appendWormhole(wormhole) {
      var destinationName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';

      var destination = this.destination.get(destinationName);

      if (destination === undefined) {
        if (destinationName === 'default') {
          destination = this.addDefaultDestination();
        } else {
          throw new Error('Liquid Wormhole destination does not exist');
        }
      }

      destination.appendWormhole(wormhole);
    },
    removeWormhole: function removeWormhole(wormhole) {
      var destinationName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';

      var destination = this.destination.get(destinationName);

      if (destination === undefined) {
        throw new Error('Liquid Wormhole destination does not exist');
      }

      destination.removeWormhole(wormhole);
    },
    registerDestination: function registerDestination(destinationName, destination) {
      if (this.destination.get(destinationName)) {
        throw new Error('Liquid Wormhole destination \'' + destinationName + '\' already created');
      }
      this.destination.set(destinationName, destination);
    },
    unregisterDestination: function unregisterDestination(destinationName) {
      this.destination.delete(destinationName);
    },
    willDestroy: function willDestroy() {
      this.removeDefaultDestination();
    },
    addDefaultDestination: function addDefaultDestination() {
      var instance = getOwner(this);
      var destination = instance.lookup('component:liquid-destination');
      destination.set('classNames', ['liquid-destination', 'default-liquid-destination']);

      if (instance.rootElement) {
        destination.appendTo(instance.rootElement);
      } else if (Ember.$('.ember-application').length > 0) {
        destination.appendTo(Ember.$('.ember-application')[0]);
      } else {
        destination.appendTo(document);
      }

      this.defaultDestination = destination;

      return destination;
    },
    removeDefaultDestination: function removeDefaultDestination() {
      if (this.defaultDestination) {
        this.defaultDestination.destroy();
      }
    }
  });
});