define('torii/services/torii-session', ['exports', 'torii/session/state-machine', 'torii/lib/container-utils'], function (exports, _stateMachine, _containerUtils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var computed = Ember.computed;
  var on = Ember.on;

  function lookupAdapter(container, authenticationType) {
    var adapter = container.lookup('torii-adapter:' + authenticationType);
    if (!adapter) {
      adapter = container.lookup('torii-adapter:application');
    }
    return adapter;
  }

  exports.default = Ember.Service.extend(Ember._ProxyMixin, {
    state: null,

    stateMachine: computed(function () {
      return (0, _stateMachine.default)(this);
    }),

    setupStateProxy: on('init', function () {
      var sm = this.get('stateMachine'),
          proxy = this;
      sm.on('didTransition', function () {
        proxy.set('content', sm.state);
        proxy.set('currentStateName', sm.currentStateName);
      });
    }),

    // Make these properties one-way.
    setUnknownProperty: function setUnknownProperty() {},


    open: function open(provider, options) {
      var owner = (0, _containerUtils.getOwner)(this),
          torii = (0, _containerUtils.getOwner)(this).lookup('service:torii'),
          sm = this.get('stateMachine');

      return new Ember.RSVP.Promise(function (resolve) {
        sm.send('startOpen');
        resolve();
      }).then(function () {
        return torii.open(provider, options);
      }).then(function (authorization) {
        var adapter = lookupAdapter(owner, provider);

        return adapter.open(authorization);
      }).then(function (user) {
        sm.send('finishOpen', user);
        return user;
      }).catch(function (error) {
        sm.send('failOpen', error);
        return Ember.RSVP.reject(error);
      });
    },

    fetch: function fetch(provider, options) {
      var owner = (0, _containerUtils.getOwner)(this),
          sm = this.get('stateMachine');

      return new Ember.RSVP.Promise(function (resolve) {
        sm.send('startFetch');
        resolve();
      }).then(function () {
        var adapter = lookupAdapter(owner, provider);

        return adapter.fetch(options);
      }).then(function (data) {
        sm.send('finishFetch', data);
        return;
      }).catch(function (error) {
        sm.send('failFetch', error);
        return Ember.RSVP.reject(error);
      });
    },

    close: function close(provider, options) {
      var owner = (0, _containerUtils.getOwner)(this),
          sm = this.get('stateMachine');

      return new Ember.RSVP.Promise(function (resolve) {
        sm.send('startClose');
        resolve();
      }).then(function () {
        var adapter = lookupAdapter(owner, provider);
        return adapter.close(options);
      }).then(function () {
        sm.send('finishClose');
      }).catch(function (error) {
        sm.send('failClose', error);
        return Ember.RSVP.reject(error);
      });
    }
  });
});