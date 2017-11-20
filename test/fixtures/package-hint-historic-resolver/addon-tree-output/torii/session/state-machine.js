define('torii/session/state-machine', ['exports', 'torii/lib/state-machine'], function (exports, _stateMachine) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (session) {
    var sm = new _stateMachine.default({
      initialState: 'unauthenticated',

      states: {
        unauthenticated: {
          errorMessage: null,
          isAuthenticated: false,
          // Actions
          startOpen: transitionToClearing('opening', ['errorMessage']),
          startFetch: transitionToClearing('fetching', ['errorMessage'])
        },
        authenticated: {
          // Properties
          currentUser: null,
          isAuthenticated: true,
          startClose: transitionTo('closing')
        },
        opening: {
          isWorking: true,
          isOpening: true,
          // Actions
          finishOpen: function finishOpen(data) {
            copyProperties(data, this.states['authenticated']);
            this.transitionTo('authenticated');
          },
          failOpen: function failOpen(errorMessage) {
            this.states['unauthenticated'].errorMessage = errorMessage;
            this.transitionTo('unauthenticated');
          }
        },
        fetching: {
          isWorking: true,
          isFetching: true,
          // Actions
          finishFetch: function finishFetch(data) {
            copyProperties(data, this.states['authenticated']);
            this.transitionTo('authenticated');
          },
          failFetch: function failFetch(errorMessage) {
            this.states['unauthenticated'].errorMessage = errorMessage;
            this.transitionTo('unauthenticated');
          }
        },
        closing: {
          isWorking: true,
          isClosing: true,
          isAuthenticated: true,
          // Actions
          finishClose: function finishClose() {
            this.transitionTo('unauthenticated');
          },
          failClose: function failClose(errorMessage) {
            this.states['unauthenticated'].errorMessage = errorMessage;
            this.transitionTo('unauthenticated');
          }
        }
      }
    });
    sm.session = session;
    return sm;
  };

  var transitionTo = _stateMachine.default.transitionTo;

  function copyProperties(data, target) {
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        target[key] = data[key];
      }
    }
  }

  function transitionToClearing(target, propertiesToClear) {
    return function () {
      for (var i; i < propertiesToClear.length; i++) {
        this[propertiesToClear[i]] = null;
      }
      this.transitionTo(target);
    };
  }
});