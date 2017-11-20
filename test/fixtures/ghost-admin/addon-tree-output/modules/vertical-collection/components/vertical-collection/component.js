define('vertical-collection/components/vertical-collection/component', ['exports', 'vertical-collection/components/vertical-collection/template', 'vertical-collection/-private'], function (exports, _template, _private) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = Ember.computed,
      Component = Ember.Component,
      get = Ember.get,
      run = Ember.run;


  var VerticalCollection = Component.extend({
    layout: _template.default,

    tagName: 'vertical-collection',

    key: '@identity',

    // –––––––––––––– Required Settings

    estimateHeight: null,

    // usable via {{#vertical-collection <items-array>}}
    items: null,

    // –––––––––––––– Optional Settings
    staticHeight: false,

    shouldRecycle: true,

    /*
     * A selector string that will select the element from
     * which to calculate the viewable height and needed offsets.
     *
     * This element will also have the `scroll` event handler added to it.
     *
     * Usually this element will be the component's immediate parent element,
     * if so, you can leave this null.
     *
     * Set this to "body" to scroll the entire web page.
     */
    containerSelector: null,

    // –––––––––––––– Performance Tuning
    /*
     * how much extra room to keep visible and invisible on
     * either side of the viewport.
     */
    bufferSize: 1,

    // –––––––––––––– Initial Scroll State
    /*
     * If set, upon initialization the scroll
     * position will be set such that the item
     * with the provided id is at the top left
     * on screen.
     *
     * If the item cannot be found, scrollTop
     * is set to 0.
     */
    idForFirstItem: null,

    /*
     * If set, if scrollPosition is empty
     * at initialization, the component will
     * render starting at the bottom.
     */
    renderFromLast: false,

    /*
     * If set, the collection will render all of the items passed in
     */
    renderAll: false,

    isEmpty: computed.empty('items'),
    shouldYieldToInverse: computed.readOnly('isEmpty'),

    virtualComponents: computed('items.[]', 'renderAll', 'estimateHeight', 'bufferSize', function () {
      var _radar = this._radar,
          _prevItemsLength = this._prevItemsLength,
          _prevFirstKey = this._prevFirstKey,
          _prevLastKey = this._prevLastKey;


      _radar.estimateHeight = this.get('estimateHeight');
      _radar.renderAll = this.get('renderAll');
      _radar.bufferSize = this.get('bufferSize');

      var items = this.get('items');
      var itemsLength = get(items, 'length');

      if (items === null || items === undefined || itemsLength === 0) {
        _radar.items = [];
        _radar.reset();
        _radar.scheduleUpdate();

        this._prevItemsLength = this._prevFirstKey = this._prevLastKey = 0;

        return _radar.virtualComponents;
      }

      _radar.items = items;

      var key = this.get('key');
      var lenDiff = itemsLength - _prevItemsLength;

      this._prevItemsLength = itemsLength;
      this._prevFirstKey = (0, _private.keyForItem)((0, _private.objectAt)(items, 0), key, 0);
      this._prevLastKey = (0, _private.keyForItem)((0, _private.objectAt)(items, itemsLength - 1), key, itemsLength - 1);

      if (isPrepend(lenDiff, items, key, _prevFirstKey, _prevLastKey) === true) {
        _radar.prepend(lenDiff);
      } else if (isAppend(lenDiff, items, key, _prevFirstKey, _prevLastKey) === true) {
        _radar.append(lenDiff);
      } else {
        _radar.reset();
      }

      _radar.scheduleUpdate();

      return _radar.virtualComponents;
    }),

    schedule: function schedule(queueName, job) {
      return _private.scheduler.schedule(queueName, job, this.token);
    },
    _scheduleSendAction: function _scheduleSendAction(action, index) {
      var _this = this;

      this._scheduledActions.push([action, index]);

      if (this._nextSendActions === null) {
        this._nextSendActions = setTimeout(function () {
          _this._nextSendActions = null;

          run(function () {
            var items = _this.get('items');
            var keyPath = _this.get('key');

            _this._scheduledActions.forEach(function (_ref) {
              var action = _ref[0],
                  index = _ref[1];

              var item = (0, _private.objectAt)(items, index);
              var key = (0, _private.keyForItem)(item, keyPath, index);

              _this.sendAction(action, item, index, key);
            });
            _this._scheduledActions.length = 0;
          });
        });
      }
    },
    didInsertElement: function didInsertElement() {
      var _this2 = this;

      var containerSelector = this.get('containerSelector');

      if (containerSelector === 'body') {
        this._scrollContainer = _private.Container;
      } else {
        this._scrollContainer = containerSelector ? (0, _private.closestElement)(this.element.parentNode, containerSelector) : this.element.parentNode;
      }

      // Initialize the Radar and set the scroll state
      this._radar.itemContainer = this.element;
      this._radar.scrollContainer = this._scrollContainer;

      this.schedule('sync', function () {
        _this2._initializeEventHandlers();
        _this2._radar.start();
      });
    },
    _initializeEventHandlers: function _initializeEventHandlers() {
      var _this3 = this;

      this._scrollHandler = function (_ref2) {
        var top = _ref2.top;

        if (Math.abs(_this3._lastEarthquake - top) > _this3._radar._estimateHeight / 2) {
          _this3._radar.scheduleUpdate();
          _this3._lastEarthquake = top;
        }
      };

      this._resizeHandler = function () {
        _this3._radar.scheduleUpdate();
      };

      (0, _private.addScrollHandler)(this._scrollContainer, this._scrollHandler);
      _private.Container.addEventListener('resize', this._resizeHandler);
    },
    willDestroy: function willDestroy() {
      this.token.cancel();
      this._radar.destroy();
      clearTimeout(this._nextSendActions);

      (0, _private.removeScrollHandler)(this._scrollContainer, this._scrollHandler);
      _private.Container.removeEventListener('resize', this._resizeHandler);
    },
    init: function init() {
      var _this4 = this;

      this._super();

      this.token = new _private.Token();
      var RadarClass = this.staticHeight ? _private.StaticRadar : _private.DynamicRadar;

      var items = this.get('items') || [];

      var idForFirstItem = this.get('idForFirstItem');
      var initialRenderCount = this.get('initialRenderCount');
      var key = this.get('key');
      var renderFromLast = this.get('renderFromLast');
      var shouldRecycle = this.get('shouldRecycle');

      var startingIndex = calculateStartingIndex(items, idForFirstItem, key, renderFromLast);

      this._radar = new RadarClass(this.token, items, initialRenderCount, startingIndex, shouldRecycle);
      this._radar.renderFromLast = renderFromLast;

      this.supportsInverse = true;
      this._prevItemsLength = 0;
      this._prevFirstKey = null;
      this._prevLastKey = null;
      this._lastEarthquake = 0;
      this._scrollContainer = null;
      this._scrollHandler = null;
      this._resizeHandler = null;

      this._hasAction = null;
      this._scheduledActions = [];
      this._nextSendActions = null;

      var a = !!this.lastReached;
      var b = !!this.firstReached;
      var c = !!this.lastVisibleChanged;
      var d = !!this.firstVisibleChanged;
      var any = a || b || c || d;

      if (any) {
        this._hasAction = {
          lastReached: a,
          firstReached: b,
          lastVisibleChanged: c,
          firstVisibleChanged: d
        };

        this._radar.sendAction = function (action, index) {
          if (_this4._hasAction[action]) {
            _this4._scheduleSendAction(action, index);
          }
        };
      }
    }
  });

  VerticalCollection.reopenClass({
    positionalParams: ['items']
  });

  if (!true) {
    VerticalCollection.reopen({
      shouldYieldToInverse: false
    });
  }

  function calculateStartingIndex(items, idForFirstItem, key, renderFromLast) {
    var totalItems = get(items, 'length');

    var startingIndex = 0;

    if (idForFirstItem !== undefined && idForFirstItem !== null) {
      for (var i = 0; i < totalItems; i++) {
        if ((0, _private.keyForItem)((0, _private.objectAt)(items, i), key, i) === idForFirstItem) {
          startingIndex = i;
          break;
        }
      }
    } else if (renderFromLast === true) {
      // If no id was set and `renderFromLast` is true, start from the bottom
      startingIndex = totalItems - 1;
    }

    return startingIndex;
  }

  function isPrepend(lenDiff, newItems, key, oldFirstKey, oldLastKey) {
    var newItemsLength = get(newItems, 'length');

    if (lenDiff <= 0 || lenDiff >= newItemsLength || newItemsLength === 0) {
      return false;
    }

    var newFirstKey = (0, _private.keyForItem)((0, _private.objectAt)(newItems, lenDiff), key, lenDiff);
    var newLastKey = (0, _private.keyForItem)((0, _private.objectAt)(newItems, newItemsLength - 1), key, newItemsLength - 1);

    return oldFirstKey === newFirstKey && oldLastKey === newLastKey;
  }

  function isAppend(lenDiff, newItems, key, oldFirstKey, oldLastKey) {
    var newItemsLength = get(newItems, 'length');

    if (lenDiff <= 0 || lenDiff >= newItemsLength || newItemsLength === 0) {
      return false;
    }

    var newFirstKey = (0, _private.keyForItem)((0, _private.objectAt)(newItems, 0), key, 0);
    var newLastKey = (0, _private.keyForItem)((0, _private.objectAt)(newItems, newItemsLength - lenDiff - 1), key, newItemsLength - lenDiff - 1);

    return oldFirstKey === newFirstKey && oldLastKey === newLastKey;
  }

  exports.default = VerticalCollection;
});