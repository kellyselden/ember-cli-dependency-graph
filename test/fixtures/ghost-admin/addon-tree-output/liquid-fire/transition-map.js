define('liquid-fire/transition-map', ['exports', 'liquid-fire/running-transition', 'liquid-fire/dsl', 'liquid-fire/action', 'liquid-fire/constraints'], function (exports, _runningTransition, _dsl, _action, _constraints) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var EmberPromise = Ember.RSVP.Promise;
  var next = Ember.run.next;
  var getOwner = Ember.getOwner;
  var Service = Ember.Service;


  var TransitionMap = Service.extend({
    init: function init() {
      this._super.apply(this, arguments);

      this.activeCount = 0;
      this.constraints = new _constraints.default();
      var owner = getOwner(this);
      var config = void 0;
      if (owner.factoryFor) {
        var maybeConfig = owner.factoryFor('transitions:main');
        config = maybeConfig && maybeConfig.class;
      } else {
        config = owner._lookupFactory('transitions:main');
      }
      if (config) {
        this.map(config);
      }
    },
    runningTransitions: function runningTransitions() {
      return this.activeCount;
    },
    incrementRunningTransitions: function incrementRunningTransitions() {
      this.activeCount++;
    },
    decrementRunningTransitions: function decrementRunningTransitions() {
      var _this = this;

      this.activeCount--;
      next(function () {
        _this._maybeResolveIdle();
      });
    },
    waitUntilIdle: function waitUntilIdle() {
      var _this2 = this;

      if (this._waitingPromise) {
        return this._waitingPromise;
      }
      return this._waitingPromise = new EmberPromise(function (resolve) {
        _this2._resolveWaiting = resolve;
        next(function () {
          _this2._maybeResolveIdle();
        });
      });
    },
    _maybeResolveIdle: function _maybeResolveIdle() {
      if (this.activeCount === 0 && this._resolveWaiting) {
        var resolveWaiting = this._resolveWaiting;
        this._resolveWaiting = null;
        this._waitingPromise = null;
        resolveWaiting();
      }
    },
    lookup: function lookup(transitionName) {
      var owner = getOwner(this);
      var handler = void 0;
      if (owner.factoryFor) {
        var maybeHandler = owner.factoryFor('transition:' + transitionName);
        handler = maybeHandler && maybeHandler.class;
      } else {
        handler = owner._lookupFactory('transition:' + transitionName);
      }
      if (!handler) {
        throw new Error("unknown transition name: " + transitionName);
      }
      return handler;
    },
    defaultAction: function defaultAction() {
      if (!this._defaultAction) {
        this._defaultAction = new _action.default(this.lookup('default'));
      }
      return this._defaultAction;
    },
    constraintsFor: function constraintsFor(conditions) {
      if (conditions.rules) {
        var constraints = new _constraints.default();
        this.map(conditions.rules, constraints);
        return constraints;
      } else {
        return this.constraints;
      }
    },
    transitionFor: function transitionFor(conditions) {
      var action = void 0;
      if (conditions.use && conditions.firstTime !== 'yes') {
        action = new _action.default(conditions.use);
        action.validateHandler(this);
      } else {
        var rule = this.constraintsFor(conditions).bestMatch(conditions);
        if (rule) {
          action = rule.use;
        } else {
          action = this.defaultAction();
        }
      }
      return new _runningTransition.default(this, conditions.versions, action);
    },
    map: function map(handler, constraints) {
      if (handler) {
        handler.apply(new _dsl.default(this, constraints || this.constraints));
      }
      return this;
    }
  });

  if (true) {
    TransitionMap.reopen({
      init: function init() {
        var _this3 = this;

        this._super.apply(this, arguments);

        if (Ember.testing) {
          this._waiter = function () {
            return _this3.runningTransitions() === 0;
          };

          // The new module imports version of this function doesn't
          // work in some of the older ember versions we support
          // (because it depends on `this` context).
          Ember.Test.registerWaiter(this._waiter); // eslint-disable-line ember/new-module-imports
        }
      },
      willDestroy: function willDestroy() {
        if (this._waiter) {
          // The new module imports version of this function doesn't
          // work in some of the older ember versions we support
          // (because it depends on `this` context).
          Ember.Test.unregisterWaiter(this._waiter); // eslint-disable-line ember/new-module-imports
          this._waiter = null;
        }

        this._super.apply(this, arguments);
      }
    });
  }

  TransitionMap.reopenClass({
    map: function map(handler) {
      var t = TransitionMap.create();
      t.map(handler);
      return t;
    }
  });

  exports.default = TransitionMap;
});