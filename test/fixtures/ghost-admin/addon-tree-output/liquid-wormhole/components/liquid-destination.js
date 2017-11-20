define('liquid-wormhole/components/liquid-destination', ['exports', 'perf-primitives/hash-map', 'liquid-wormhole/templates/components/liquid-destination'], function (exports, _hashMap, _liquidDestination) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  var inject = Ember.inject,
      computed = Ember.computed,
      A = Ember.A;
  var gt = computed.gt;
  var service = inject.service;
  exports.default = Ember.Component.extend({
    layout: _liquidDestination.default,
    classNames: ['liquid-destination'],
    classNameBindings: ['hasWormholes'],

    name: 'default',
    liquidWormholeService: service('liquidWormhole'),
    matchContext: {
      helperName: 'liquid-wormhole'
    },

    hasWormholes: gt('stacks.length', 0),

    init: function init() {
      this._super.apply(this, arguments);

      this.stackMap = new _hashMap.default();
      this.set('stacks', A());

      this.wormholeQueue = A();

      var name = this.get('name');

      this.get('liquidWormholeService').registerDestination(name, this);
    },
    willDestroyElement: function willDestroyElement() {
      this._super.apply(this, arguments);

      var name = this.get('name');
      this.get('liquidWormholeService').unregisterDestination(name);
    },
    appendWormhole: function appendWormhole(wormhole) {
      // The order that wormholes are rendered in may be different from the order
      // that they appear in templates, because child components get rendered before
      // their parents. This logic inserts parent components *before* their children
      // so the ordering is correct.
      var appendIndex = this.wormholeQueue.get('length') - 1;

      for (; appendIndex >= 0; appendIndex--) {
        var lastWormholeElement = this.wormholeQueue.objectAt(appendIndex).element;

        if (!wormhole.element.contains(lastWormholeElement)) {
          break; // break when we find the first wormhole that isn't a parent
        }
      }

      this.wormholeQueue.insertAt(appendIndex + 1, wormhole);

      Ember.run.scheduleOnce('afterRender', this, this.flushWormholeQueue);
    },
    removeWormhole: function removeWormhole(wormhole) {
      var stackName = wormhole.get('stack');
      var stack = this.stackMap.get(stackName);
      var item = stack.find(function (item) {
        return item && item.wormhole === wormhole;
      });

      var newNodes = item.get('nodes').clone();
      item.set('nodes', newNodes);
      item.set('_replaceNodes', true);

      Ember.run.next(function () {
        return stack.removeObject(item);
      });
    },
    flushWormholeQueue: function flushWormholeQueue() {
      var _this = this;

      this.wormholeQueue.forEach(function (wormhole) {
        var stackName = wormhole.get('stack');
        var stack = _this.stackMap.get(stackName) || _this.createStack(wormhole);

        var nodes = wormhole.get('nodes');
        var value = wormhole.get('value');

        var item = Ember.Object.create({ nodes: nodes, wormhole: wormhole, value: value });

        // Reset visibility in case we made them visible, see below
        nodes.css({ visibility: 'hidden' });

        stack.pushObject(item);
      });

      this.wormholeQueue.clear();
    },
    createStack: function createStack(wormhole) {
      var stackName = wormhole.get('stack');

      var stack = A([null]);
      stack.set('name', stackName);

      this.stackMap.set(stackName, stack);
      this.stacks.pushObject(stack);

      return stack;
    },


    actions: {
      willTransition: function willTransition() {
        // Do nothing
      },
      afterChildInsertion: function afterChildInsertion() {
        // Do nothing
      },
      afterTransition: function afterTransition(_ref) {
        var _ref2 = _slicedToArray(_ref, 1),
            _ref2$ = _ref2[0],
            value = _ref2$.value,
            view = _ref2$.view;

        if (this.isDestroying || this.isDestroyed) {
          return;
        }
        // If wormholes were made w/o animations, they need to be made visible manually.
        this.$(view.element).find('.liquid-wormhole-element').css({ visibility: 'visible' });

        // Clean empty stacks
        if (value === null) {
          var stacks = this.get('stacks');
          var stackName = view.get('parentView.stackName');
          var stack = this.stackMap.get(stackName);

          stacks.removeObject(stack);
          this.stackMap.delete(stackName);
        }
      }
    }
  });
});