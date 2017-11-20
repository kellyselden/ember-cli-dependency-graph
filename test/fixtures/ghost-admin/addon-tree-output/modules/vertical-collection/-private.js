define('vertical-collection/-private', ['exports'], function (exports) { 'use strict';

var guidFor = Ember.guidFor;


function identity(item) {
  var key = void 0;
  var type = typeof item;

  if (type === 'string' || type === 'number') {
    key = item;
  } else {
    key = guidFor(item);
  }

  return key;
}

var get = Ember.get;


function keyForItem(item, keyPath, index) {
  var key = void 0;

  switch (keyPath) {
    case '@index':
      // allow 0 index
      if (!index && index !== 0) {
        throw new Error('No index was supplied to keyForItem');
      }
      key = index;
      break;
    case '@identity':
      key = identity(item);
      break;
    default:
      // TODO add explicit test
      if (keyPath) {
        key = get(item, keyPath);
      } else {
        key = identity(item);
      }
  }

  if (typeof key === 'number') {
    key = String(key);
  }

  return key;
}

function estimateElementHeight(element, fallbackHeight) {
  (true && !(fallbackHeight) && Ember.assert('You called estimateElement height without a fallbackHeight', fallbackHeight));
  (true && !(element) && Ember.assert('You called estimateElementHeight without an element', element));


  if (fallbackHeight.indexOf('%') !== -1) {
    return Math.max(getPercentageHeight(element, fallbackHeight), 1);
  }

  if (fallbackHeight.indexOf('em') !== -1) {
    return Math.max(getEmHeight(element, fallbackHeight), 1);
  }

  // px or no units
  return Math.max(parseInt(fallbackHeight, 10), 1);
}

/**
 * Returns estimated max height of an element.
 */
function estimateElementMaxHeight(element) {
  var maxHeightString = window.getComputedStyle(element).maxHeight;
  if (maxHeightString.indexOf('%') !== -1) {
    return getPercentageHeight(element, maxHeightString);
  }

  if (maxHeightString.indexOf('em') !== -1) {
    return getEmHeight(element, maxHeightString);
  }

  // px or no units
  return parseInt(maxHeightString, 10);
}

function getPercentageHeight(element, fallbackHeight) {
  var parentHeight = element.getBoundingClientRect().height;
  var per = parseFloat(fallbackHeight);

  return per * parentHeight / 100.0;
}

function getEmHeight(element, fallbackHeight) {
  var fontSizeElement = fallbackHeight.indexOf('rem') !== -1 ? document.body : element;
  var fontSize = window.getComputedStyle(fontSizeElement).getPropertyValue('font-size');

  return parseFloat(fallbackHeight) * parseFloat(fontSize);
}

var VENDOR_MATCH_FNS = ['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'];
var ELEMENT_MATCH_FN = void 0;

function setElementMatchFn(el) {
  VENDOR_MATCH_FNS.forEach(function (fn) {
    if (ELEMENT_MATCH_FN === undefined && typeof el[fn] === 'function') {
      ELEMENT_MATCH_FN = fn;
    }
  });
}

function closest(el, selector) {
  if (ELEMENT_MATCH_FN === undefined) {
    setElementMatchFn(el);
  }
  while (el) {
    // TODO add explicit test
    if (el[ELEMENT_MATCH_FN](selector)) {
      return el;
    }
    el = el.parentElement;
  }

  return null;
}

var _createClass$2 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var run = Ember.run;


var Token = function () {
  function Token(parent) {
    this._parent = parent;
    this._cancelled = false;

    {
      Object.seal(this);
    }
  }

  Token.prototype.cancel = function cancel() {
    this._cancelled = true;
  };

  _createClass$2(Token, [{
    key: 'cancelled',
    get: function get() {
      return this._cancelled || (this._cancelled = this._parent ? this._parent.cancelled : false);
    }
  }]);

  return Token;
}();

function job(cb, token) {
  return function execJob() {
    if (token.cancelled === false) {
      cb();
    }
  };
}

var Scheduler = function () {
  function Scheduler() {
    this.sync = [];
    this.layout = [];
    this.measure = [];
    this.affect = [];
    this.jobs = 0;
    this._nextFlush = null;
    this.ticks = 0;

    {
      Object.seal(this);
    }
  }

  Scheduler.prototype.schedule = function schedule(queueName, cb, parent) {
    this.jobs++;
    var token = new Token(parent);

    this[queueName].push(job(cb, token));
    this._flush();

    return token;
  };

  Scheduler.prototype.forget = function forget(token) {
    // TODO add explicit test
    if (token) {
      token.cancel();
    }
  };

  Scheduler.prototype._flush = function _flush() {
    var _this = this;

    if (this._nextFlush !== null) {
      return;
    }

    this._nextFlush = requestAnimationFrame(function () {
      _this.flush();
    });
  };

  Scheduler.prototype.flush = function flush() {
    var i = void 0,
        q = void 0;
    this.jobs = 0;

    if (this.sync.length > 0) {
      run.begin();
      q = this.sync;
      this.sync = [];

      for (i = 0; i < q.length; i++) {
        q[i]();
      }
      run.end();
    }

    if (this.layout.length > 0) {
      q = this.layout;
      this.layout = [];

      for (i = 0; i < q.length; i++) {
        q[i]();
      }
    }

    if (this.measure.length > 0) {
      q = this.measure;
      this.measure = [];

      for (i = 0; i < q.length; i++) {
        q[i]();
      }
    }

    this._nextFlush = null;
    if (this.jobs > 0) {
      this._flush();
    }
  };

  return Scheduler;
}();

var scheduler = new Scheduler();

var _createClass$3 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var set$1 = Ember.set;


var VC_IDENTITY = 0;

var VirtualComponent = function () {
  function VirtualComponent() {
    var content = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    this.id = VC_IDENTITY++;

    this.content = content;
    this.index = index;

    this.upperBound = document.createTextNode('');
    this.lowerBound = document.createTextNode('');
    this.element = null;

    this.rendered = false;

    // In older versions of Ember/IE, binding anything on an object in the template
    // adds observers which creates __ember_meta__
    this.__ember_meta__ = null; // eslint-disable-line camelcase

    {
      Object.preventExtensions(this);
    }
  }

  VirtualComponent.prototype.getBoundingClientRect = function getBoundingClientRect() {
    var upperBound = this.upperBound,
        lowerBound = this.lowerBound;


    var top = Infinity;
    var bottom = -Infinity;

    while (upperBound !== lowerBound) {
      upperBound = upperBound.nextSibling;

      if (upperBound instanceof Element) {
        top = Math.min(top, upperBound.getBoundingClientRect().top);
        bottom = Math.max(bottom, upperBound.getBoundingClientRect().bottom);
      }

      {
        if (upperBound instanceof Element) {
          continue;
        }

        var text = upperBound.textContent;

        (true && !(text === '' || text.match(/^\s+$/)) && Ember.assert('All content inside of vertical-collection must be wrapped in an element. Detected a text node with content: ' + text, text === '' || text.match(/^\s+$/)));
      }
    }

    (true && !(top !== Infinity && bottom !== -Infinity) && Ember.assert('Items in a vertical collection require atleast one element in them', top !== Infinity && bottom !== -Infinity));


    var height = bottom - top;

    return { top: top, bottom: bottom, height: height };
  };

  VirtualComponent.prototype.recycle = function recycle(newContent, newIndex) {
    (true && !(newContent) && Ember.assert('You cannot set an item\'s content to undefined', newContent));


    if (this.index !== newIndex) {
      set$1(this, 'index', newIndex);
    }

    if (this.content !== newContent) {
      set$1(this, 'content', newContent);
    }
  };

  VirtualComponent.prototype.destroy = function destroy() {
    set$1(this, 'element', null);
    set$1(this, 'upperBound', null);
    set$1(this, 'lowerBound', null);
    set$1(this, 'content', null);
    set$1(this, 'index', null);
  };

  _createClass$3(VirtualComponent, [{
    key: 'realUpperBound',
    get: function get() {
      return this.upperBound;
    }
  }, {
    key: 'realLowerBound',
    get: function get() {
      return this.lowerBound;
    }
  }]);

  return VirtualComponent;
}();

function insertRangeBefore(element, firstNode, lastNode) {
  var parentNode = element.parentNode;

  var nextNode = void 0;

  while (firstNode) {
    nextNode = firstNode.nextSibling;
    parentNode.insertBefore(firstNode, element);

    if (firstNode === lastNode) {
      break;
    }

    firstNode = nextNode;
  }
}

function objectAt(arr, index) {
  (true && !(Array.isArray(arr) || typeof arr.objectAt === 'function') && Ember.assert('arr must be an instance of a Javascript Array or implement `objectAt`', Array.isArray(arr) || typeof arr.objectAt === 'function'));


  return arr.objectAt ? arr.objectAt(index) : arr[index];
}

function roundTo(number) {
  var decimal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

  var exp = Math.pow(10, decimal);
  return Math.round(number * exp) / exp;
}

var _createClass$1 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var A = Ember.A;
var _get = Ember.get;
var set = Ember.set;

var Radar = function () {
  function Radar(parentToken, initialItems, initialRenderCount, startingIndex, shouldRecycle) {
    this.token = new Token(parentToken);

    this.items = initialItems;
    this.estimateHeight = 0;
    this.bufferSize = 0;
    this.startingIndex = startingIndex;
    this.shouldRecycle = shouldRecycle;
    this.renderFromLast = false;
    this.renderAll = false;
    this.itemContainer = null;
    this.scrollContainer = null;

    this._scrollTop = 0;
    this._prependOffset = 0;
    this._estimateHeight = 0;
    this._scrollTopOffset = 0;
    this._scrollContainerHeight = 0;

    this._nextUpdate = null;
    this._nextLayout = null;
    this._started = false;
    this._didReset = true;

    this._prevFirstItemIndex = 0;
    this._prevLastItemIndex = 0;
    this._prevFirstVisibleIndex = 0;
    this._prevLastVisibleIndex = 0;

    this._firstReached = false;
    this._lastReached = false;

    this.sendAction = function () {};

    this._occludedContentBefore = new VirtualComponent();
    this._occludedContentAfter = new VirtualComponent();

    this._occludedContentBefore.element = document.createElement('occluded-content');
    this._occludedContentAfter.element = document.createElement('occluded-content');

    this._occludedContentBefore.element.addEventListener('click', this.pageUp.bind(this));
    this._occludedContentAfter.element.addEventListener('click', this.pageDown.bind(this));

    var virtualComponents = [this._occludedContentBefore];
    var orderedComponents = [];

    var lastIndex = Math.min(startingIndex + initialRenderCount, _get(initialItems, 'length'));
    var firstIndex = Math.max(0, lastIndex - initialRenderCount);

    for (var i = firstIndex; i < lastIndex; i++) {
      var component = new VirtualComponent();
      component.recycle(objectAt(initialItems, i), i);
      component.rendered = true;

      virtualComponents.push(component);
      orderedComponents.push(component);
    }

    virtualComponents.push(this._occludedContentAfter);

    this.virtualComponents = A(virtualComponents);
    this.orderedComponents = orderedComponents;
    this._componentPool = [];
    this._prependComponentPool = [];

    // In older versions of Ember/IE, binding anything on an object in the template
    // adds observers which creates __ember_meta__
    this.__ember_meta__ = null; // eslint-disable-line camelcase

    {
      this._debugDidUpdate = null;
    }
  }

  Radar.prototype.destroy = function destroy() {
    this.token.cancel();

    for (var i = 0; i < this.orderedComponents.length; i++) {
      this.orderedComponents[i].destroy();
    }

    this.orderedComponents = null;
    set(this, 'virtualComponents', null);
  };

  Radar.prototype.schedule = function schedule(queueName, job) {
    return scheduler.schedule(queueName, job, this.token);
  };

  Radar.prototype.start = function start() {
    var startingIndex = this.startingIndex;


    if (startingIndex !== 0) {
      this._updateConstants();

      var totalItems = this.totalItems,
          renderFromLast = this.renderFromLast,
          _estimateHeight = this._estimateHeight,
          _scrollTopOffset = this._scrollTopOffset,
          _scrollContainerHeight = this._scrollContainerHeight;


      var startingScrollTop = startingIndex * _estimateHeight;

      if (renderFromLast) {
        startingScrollTop -= _scrollContainerHeight - _estimateHeight;
      }

      // The container element needs to have some height in order for us to set the scroll position
      // on initialization, so we set this min-height property to radar's total
      this.itemContainer.style.minHeight = _estimateHeight * totalItems + 'px';
      this.scrollContainer.scrollTop = startingScrollTop + _scrollTopOffset;

      this._occludedContentBefore.element.style.height = startingIndex * _estimateHeight + 'px';
    }

    this._started = true;
    this.scheduleUpdate();
  };

  /*
   * Schedules an update for the next RAF
   *
   * This will first run _updateVirtualComponents in the sync phase, which figures out what
   * components need to be rerendered and updates the appropriate VCs and moves their associated
   * DOM. At the end of the `sync` phase the runloop is flushed and Glimmer renders the changes.
   *
   * By the `affect` phase the Radar should have had time to measure, meaning it has all of the
   * current info and we can send actions for any changes.
   *
   * @private
   */


  Radar.prototype.scheduleUpdate = function scheduleUpdate() {
    var _this = this;

    if (this._nextUpdate !== null || this._started === false) {
      return;
    }

    this._nextUpdate = this.schedule('sync', function () {
      _this._nextUpdate = null;

      _this._scrollTop = _this.scrollContainer.scrollTop;

      _this._updateConstants();
      _this._updateIndexes();
      _this._updateVirtualComponents();

      _this.schedule('measure', function () {
        // If there is a prependOffset of some kind _and_ the scrollTop has changed. Chrome will
        // automatically change the scrollTop for us in certain situations, which is why we need
        // to check the cache.
        if (_this._prependOffset !== 0 && _this._scrollTop === _this.scrollContainer.scrollTop) {
          _this.scrollContainer.scrollTop += _this._prependOffset;
        }

        _this._prependOffset = 0;

        if (_this.totalItems !== 0) {
          _this._sendActions();
        }

        // cache previous values
        _this._prevFirstItemIndex = _this.firstItemIndex;
        _this._prevLastItemIndex = _this.lastItemIndex;
        _this._prevFirstVisibleIndex = _this.firstVisibleIndex;
        _this._prevLastVisibleIndex = _this.lastVisibleIndex;

        // Clear the reset flag
        _this._didReset = false;

        if (true && _this._debugDidUpdate !== null) {
          // Hook to update the visual debugger
          _this._debugDidUpdate(_this);
        }
      });
    });
  };

  Radar.prototype._updateConstants = function _updateConstants() {
    var estimateHeight = this.estimateHeight,
        itemContainer = this.itemContainer,
        scrollContainer = this.scrollContainer;
    (true && !(estimateHeight !== null) && Ember.assert('Must provide a `estimateHeight` value to vertical-collection', estimateHeight !== null));
    (true && !(itemContainer !== null) && Ember.assert('itemContainer must be set on Radar before scheduling an update', itemContainer !== null));
    (true && !(scrollContainer !== null) && Ember.assert('scrollContainer must be set on Radar before scheduling an update', scrollContainer !== null));

    var _itemContainer$getBou = itemContainer.getBoundingClientRect(),
        itemContainerTop = _itemContainer$getBou.top;

    var _scrollContainer$getB = scrollContainer.getBoundingClientRect(),
        scrollContainerTop = _scrollContainer$getB.top,
        scrollContainerHeight = _scrollContainer$getB.height;

    var maxHeight = 0;
    if (scrollContainer instanceof Element) {
      maxHeight = estimateElementMaxHeight(scrollContainer);
    }

    maxHeight = isNaN(maxHeight) ? 0 : maxHeight;

    this._estimateHeight = typeof estimateHeight === 'string' ? estimateElementHeight(itemContainer, estimateHeight) : estimateHeight;
    this._scrollTopOffset = roundTo(this._scrollTop + itemContainerTop - scrollContainerTop);
    this._scrollContainerHeight = Math.max(roundTo(scrollContainerHeight), maxHeight);
  };

  /*
   * Updates virtualComponents, which is meant to be a static pool of components that we render to.
   * In order to decrease the time spent rendering and diffing, we pull the {{each}} out of the DOM
   * and only replace the content of _virtualComponents which are removed/added.
   *
   * For instance, if we start with the following and scroll down, items 2 and 3 do not need to be
   * rerendered, only item 1 needs to be removed and only item 4 needs to be added. So we replace
   * item 1 with item 4, and then manually move the DOM:
   *
   *   1                        4                         2
   *   2 -> replace 1 with 4 -> 2 -> manually move DOM -> 3
   *   3                        3                         4
   *
   * However, _virtualComponents is still out of order. Rather than keep track of the state of
   * things in _virtualComponents, we track the visually ordered components in the
   * _orderedComponents array. This is possible because all of our operations are relatively simple,
   * popping some number of components off one end and pushing them onto the other.
   *
   * @private
   */


  Radar.prototype._updateVirtualComponents = function _updateVirtualComponents() {
    var items = this.items,
        orderedComponents = this.orderedComponents,
        virtualComponents = this.virtualComponents,
        _componentPool = this._componentPool,
        shouldRecycle = this.shouldRecycle,
        _didReset = this._didReset,
        itemContainer = this.itemContainer,
        _occludedContentBefore = this._occludedContentBefore,
        _occludedContentAfter = this._occludedContentAfter,
        totalItems = this.totalItems,
        renderedFirstItemIndex = this.renderedFirstItemIndex,
        renderedLastItemIndex = this.renderedLastItemIndex,
        renderedTotalBefore = this.renderedTotalBefore,
        renderedTotalAfter = this.renderedTotalAfter,
        totalRendered = this.totalRendered;

    // Add components to be recycled to the pool

    while (orderedComponents.length > 0 && orderedComponents[0].index < renderedFirstItemIndex) {
      _componentPool.push(orderedComponents.shift());
    }

    while (orderedComponents.length > 0 && orderedComponents[orderedComponents.length - 1].index > renderedLastItemIndex) {
      _componentPool.unshift(orderedComponents.pop());
    }

    if (_didReset) {
      if (shouldRecycle === true) {
        for (var i = 0; i < orderedComponents.length; i++) {
          // If the underlying array has changed, the indexes could be the same but
          // the content may have changed, so recycle the remaining components
          var component = orderedComponents[i];
          component.recycle(objectAt(items, component.index), component.index);
        }
      } else {
        while (orderedComponents.length > 0) {
          // If recycling is disabled we need to delete all components and clear the array
          _componentPool.push(orderedComponents.shift());
        }
      }
    }

    var firstIndexInList = orderedComponents[0] ? orderedComponents[0].index : renderedFirstItemIndex;
    var lastIndexInList = orderedComponents[orderedComponents.length - 1] ? orderedComponents[orderedComponents.length - 1].index : renderedFirstItemIndex - 1;

    // Append as many items as needed to the rendered components
    while (orderedComponents.length < totalRendered && lastIndexInList < renderedLastItemIndex) {
      var _component = void 0;

      if (shouldRecycle === true) {
        _component = _componentPool.pop() || new VirtualComponent();
      } else {
        _component = new VirtualComponent();
      }

      var itemIndex = ++lastIndexInList;

      _component.recycle(objectAt(items, itemIndex), itemIndex);
      this._appendComponent(_component);

      orderedComponents.push(_component);
    }

    // Prepend as many items as needed to the rendered components
    while (orderedComponents.length < totalRendered && firstIndexInList > renderedFirstItemIndex) {
      var _component2 = void 0;

      if (shouldRecycle === true) {
        _component2 = _componentPool.pop() || new VirtualComponent();
      } else {
        _component2 = new VirtualComponent();
      }

      var _itemIndex = --firstIndexInList;

      _component2.recycle(objectAt(items, _itemIndex), _itemIndex);
      this._prependComponent(_component2);

      orderedComponents.unshift(_component2);
    }

    // If there are any items remaining in the pool, remove them
    if (_componentPool.length > 0) {
      virtualComponents.removeObjects(_componentPool);
      _componentPool.length = 0;
    }

    var totalItemsBefore = renderedFirstItemIndex;
    var totalItemsAfter = totalItems - renderedLastItemIndex - 1;

    var beforeItemsText = totalItemsBefore === 1 ? 'item' : 'items';
    var afterItemsText = totalItemsAfter === 1 ? 'item' : 'items';

    // Set padding element heights, unset itemContainer's minHeight
    _occludedContentBefore.element.style.height = Math.max(renderedTotalBefore, 0) + 'px';
    _occludedContentBefore.element.innerHTML = totalItemsBefore > 0 ? 'And ' + totalItemsBefore + ' ' + beforeItemsText + ' before' : '';

    _occludedContentAfter.element.style.height = Math.max(renderedTotalAfter, 0) + 'px';
    _occludedContentAfter.element.innerHTML = totalItemsAfter > 0 ? 'And ' + totalItemsAfter + ' ' + afterItemsText + ' after' : '';

    itemContainer.style.minHeight = '';
  };

  Radar.prototype._appendComponent = function _appendComponent(component) {
    var virtualComponents = this.virtualComponents,
        _occludedContentAfter = this._occludedContentAfter;


    if (component.rendered === true) {
      insertRangeBefore(_occludedContentAfter.realUpperBound, component.realUpperBound, component.realLowerBound);
    } else {
      virtualComponents.insertAt(virtualComponents.get('length') - 1, component);
      component.rendered = true;
    }
  };

  Radar.prototype._prependComponent = function _prependComponent(component) {
    var _this2 = this;

    var virtualComponents = this.virtualComponents,
        _occludedContentBefore = this._occludedContentBefore,
        _prependComponentPool = this._prependComponentPool;


    if (component.rendered === true) {
      insertRangeBefore(_occludedContentBefore.realLowerBound.nextSibling, component.realUpperBound, component.realLowerBound);
    } else {
      virtualComponents.insertAt(virtualComponents.get('length') - 1, component);
      component.rendered = true;

      // Components that are both new and prepended still need to be rendered at the end because Glimmer.
      // We have to move them _after_ they render, so we schedule that if they exist
      _prependComponentPool.unshift(component);

      if (this._nextLayout === null) {
        this._nextLayout = this.schedule('layout', function () {
          _this2._nextLayout = null;

          while (_prependComponentPool.length > 0) {
            var _component3 = _prependComponentPool.pop();

            insertRangeBefore(_occludedContentBefore.realLowerBound.nextSibling, _component3.realUpperBound, _component3.realLowerBound);
          }
        });
      }
    }
  };

  Radar.prototype._sendActions = function _sendActions() {
    var firstItemIndex = this.firstItemIndex,
        lastItemIndex = this.lastItemIndex,
        firstVisibleIndex = this.firstVisibleIndex,
        lastVisibleIndex = this.lastVisibleIndex,
        _prevFirstVisibleIndex = this._prevFirstVisibleIndex,
        _prevLastVisibleIndex = this._prevLastVisibleIndex,
        totalItems = this.totalItems,
        _firstReached = this._firstReached,
        _lastReached = this._lastReached,
        _didReset = this._didReset;


    if (_didReset || firstVisibleIndex !== _prevFirstVisibleIndex) {
      this.sendAction('firstVisibleChanged', firstVisibleIndex);
    }

    if (_didReset || lastVisibleIndex !== _prevLastVisibleIndex) {
      this.sendAction('lastVisibleChanged', lastVisibleIndex);
    }

    if (_firstReached === false && firstItemIndex === 0) {
      this.sendAction('firstReached', firstItemIndex);
      this._firstReached = true;
    }

    if (_lastReached === false && lastItemIndex === totalItems - 1) {
      this.sendAction('lastReached', lastItemIndex);
      this._lastReached = true;
    }
  };

  Radar.prototype.prepend = function prepend(numPrepended) {
    var _this3 = this;

    this._prevFirstItemIndex += numPrepended;
    this._prevLastItemIndex += numPrepended;

    this.schedule('sync', function () {
      _this3.orderedComponents.forEach(function (c) {
        return set(c, 'index', _get(c, 'index') + numPrepended);
      });
    });

    this._firstReached = false;

    this._prependOffset = numPrepended * this._estimateHeight;
  };

  Radar.prototype.append = function append() {
    this._lastReached = false;
  };

  Radar.prototype.reset = function reset() {
    this._firstReached = false;
    this._lastReached = false;
    this._didReset = true;
  };

  Radar.prototype.pageUp = function pageUp() {
    var bufferSize = this.bufferSize,
        renderedFirstItemIndex = this.renderedFirstItemIndex,
        totalRendered = this.totalRendered;


    if (renderedFirstItemIndex !== 0) {
      var newFirstItemIndex = Math.max(renderedFirstItemIndex - totalRendered + bufferSize, 0);
      var offset = this.getOffsetForIndex(newFirstItemIndex);

      this.scrollContainer.scrollTop = offset + this._scrollTopOffset;
    }
  };

  Radar.prototype.pageDown = function pageDown() {
    var bufferSize = this.bufferSize,
        renderedLastItemIndex = this.renderedLastItemIndex,
        totalRendered = this.totalRendered,
        totalItems = this.totalItems;


    if (renderedLastItemIndex !== totalItems - 1) {
      var newFirstItemIndex = Math.min(renderedLastItemIndex + bufferSize + 1, totalItems - totalRendered);
      var offset = this.getOffsetForIndex(newFirstItemIndex);

      this.scrollContainer.scrollTop = offset + this._scrollTopOffset;
    }
  };

  // If `renderAll` is true, render components for all items. We intercept this here because
  // for all other behavior (action sending) we want to maintain the "correct" item indexes


  _createClass$1(Radar, [{
    key: 'renderedFirstItemIndex',
    get: function get() {
      return this.renderAll === true ? 0 : this.firstItemIndex;
    }
  }, {
    key: 'renderedLastItemIndex',
    get: function get() {
      return this.renderAll === true ? this.totalItems - 1 : this.lastItemIndex;
    }
  }, {
    key: 'renderedTotalBefore',
    get: function get() {
      return this.renderAll === true ? 0 : this.totalBefore;
    }
  }, {
    key: 'renderedTotalAfter',
    get: function get() {
      return this.renderAll === true ? 0 : this.totalAfter;
    }
  }, {
    key: 'totalRendered',
    get: function get() {
      return this.renderAll === true ? this.totalItems : Math.min(this.totalItems, this.totalComponents);
    }
  }, {
    key: 'totalComponents',
    get: function get() {
      return Math.ceil(this._scrollContainerHeight / this._estimateHeight) + 2 * this.bufferSize;
    }

    /*
     * `prependOffset` exists because there are times when we need to do the following in this exact
     * order:
     *
     * 1. Prepend, which means we need to adjust the scroll position by `estimateHeight * numPrepended`
     * 2. Calculate the items that will be displayed after the prepend, and move VCs around as
     *    necessary (`scheduleUpdate`).
     * 3. Actually add the amount prepended to `scrollContainer.scrollTop`
     *
     * This is due to some strange behavior in Chrome where it will modify `scrollTop` on it's own
     * when prepending item elements. We seem to avoid this behavior by doing these things in a RAF
     * in this exact order.
     */

  }, {
    key: 'visibleTop',
    get: function get() {
      return Math.max(this._scrollTop - this._scrollTopOffset + this._prependOffset, 0);
    }
  }, {
    key: 'visibleMiddle',
    get: function get() {
      return this.visibleTop + this._scrollContainerHeight / 2;
    }
  }, {
    key: 'visibleBottom',
    get: function get() {
      // There is a case where the container of this vertical collection could have height 0 at
      // initial render step but will be updated later. We want to return visibleBottom to be 0 rather
      // than -1.
      return Math.max(this.visibleTop + this._scrollContainerHeight - 1, 0);
    }
  }, {
    key: 'totalItems',
    get: function get() {
      return this.items ? _get(this.items, 'length') : 0;
    }
  }]);

  return Radar;
}();

/*
 * `SkipList` is a data structure designed with two main uses in mind:
 *
 * - Given a target value, find the index i in the list such that
 * `sum(list[0]..list[i]) <= value < sum(list[0]..list[i + 1])`
 *
 * - Given the index i (the fulcrum point) from above, get `sum(list[0]..list[i])`
 *   and `sum(list[i + 1]..list[-1])`
 *
 * The idea is that given a list of arbitrary heights or widths in pixels, we want to find
 * the index of the item such that when all of the items before it are added together, it will
 * be as close to the target (scrollTop of our container) as possible.
 *
 * This data structure acts somewhat like a Binary Search Tree. Given a list of size n, the
 * retreival time for the index is O(log n) and the update time should any values change is
 * O(log n). The space complexity is O(n log n) in bytes (using Float32Arrays helps a lot
 * here), and the initialization time is O(n log n).
 *
 * It works by constructing layer arrays, each of which is setup such that
 * `layer[i] = prevLayer[i * 2] + prevLayer[(i * 2) + 1]`. This allows us to traverse the layers
 * downward using a binary search to arrive at the index we want. We also add the values up as we
 * traverse to get the total value before and after the final index.
 */

function fill(array, value) {
  var start = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var end = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : array.length;

  if (typeof array.fill === 'function') {
    array.fill(value, start, end);
  } else {
    for (; start < end; start++) {
      array[start] = value;
    }

    return array;
  }
}

function subarray(array, start, end) {
  if (typeof array.subarray === 'function') {
    return array.subarray(start, end);
  } else {
    return array.slice(start, end);
  }
}

var SkipList = function () {
  function SkipList(length, defaultValue) {
    var values = new Float32Array(new ArrayBuffer(length * 4));
    fill(values, defaultValue);

    this.length = length;
    this.defaultValue = defaultValue;

    this._initializeLayers(values, defaultValue);

    {
      Object.preventExtensions(this);
    }
  }

  SkipList.prototype._initializeLayers = function _initializeLayers(values, defaultValue) {
    var layers = [values];
    var i = void 0,
        length = void 0,
        layer = void 0,
        prevLayer = void 0,
        left = void 0,
        right = void 0;

    prevLayer = layer = values;
    length = values.length;

    while (length > 2) {
      length = Math.ceil(length / 2);

      layer = new Float32Array(new ArrayBuffer(length * 4));

      if (defaultValue !== undefined) {
        // If given a default value we assume that we can fill each
        // layer of the skip list with the previous layer's value * 2.
        // This allows us to use the `fill` method on Typed arrays, which
        // an order of magnitude faster than manually calculating each value.
        defaultValue = defaultValue * 2;
        fill(layer, defaultValue);

        left = prevLayer[(length - 1) * 2] || 0;
        right = prevLayer[(length - 1) * 2 + 1] || 0;

        // Layers are not powers of 2, and sometimes they may by odd sizes.
        // Only the last value of a layer will be different, so we calculate
        // its value manually.
        layer[length - 1] = left + right;
      } else {
        for (i = 0; i < length; i++) {
          left = prevLayer[i * 2];
          right = prevLayer[i * 2 + 1];
          layer[i] = right ? left + right : left;
        }
      }

      layers.unshift(layer);
      prevLayer = layer;
    }

    this.total = layer.length > 0 ? layer.length > 1 ? layer[0] + layer[1] : layer[0] : 0;

    (true && !(typeof this.total === 'number') && Ember.assert('total must be a number', typeof this.total === 'number'));


    this.layers = layers;
    this.values = values;
  };

  SkipList.prototype.find = function find(targetValue) {
    var layers = this.layers,
        total = this.total,
        length = this.length,
        values = this.values;

    var numLayers = layers.length;

    if (length === 0) {
      return { index: 0, totalBefore: 0, totalAfter: 0 };
    }

    var i = void 0,
        layer = void 0,
        left = void 0,
        leftIndex = void 0,
        rightIndex = void 0;
    var index = 0;
    var totalBefore = 0;
    var totalAfter = 0;

    targetValue = Math.min(total - 1, targetValue);

    (true && !(typeof targetValue === 'number') && Ember.assert('targetValue must be a number', typeof targetValue === 'number'));
    (true && !(targetValue >= 0) && Ember.assert('targetValue must be greater than or equal to 0', targetValue >= 0));
    (true && !(targetValue < total) && Ember.assert('targetValue must be no more than total', targetValue < total));


    for (i = 0; i < numLayers; i++) {
      layer = layers[i];

      leftIndex = index;
      rightIndex = index + 1;

      left = layer[leftIndex];

      if (targetValue >= totalBefore + left) {
        totalBefore = totalBefore + left;
        index = rightIndex * 2;
      } else {
        index = leftIndex * 2;
      }
    }

    index = index / 2;

    (true && !(typeof index === 'number') && Ember.assert('index must be a number', typeof index === 'number'));
    (true && !(index >= 0 && index < this.values.length) && Ember.assert('index must be within bounds', index >= 0 && index < this.values.length));


    totalAfter = total - (totalBefore + values[index]);

    return { index: index, totalBefore: totalBefore, totalAfter: totalAfter };
  };

  SkipList.prototype.getOffset = function getOffset(targetIndex) {
    var layers = this.layers,
        length = this.length,
        values = this.values;

    var numLayers = layers.length;

    if (length === 0) {
      return 0;
    }

    var index = 0;
    var offset = 0;

    for (var i = 0; i < numLayers - 1; i++) {
      var layer = layers[i];

      var leftIndex = index;
      var rightIndex = index + 1;

      if (targetIndex >= rightIndex * Math.pow(2, numLayers - i - 1)) {
        offset = offset + layer[leftIndex];
        index = rightIndex * 2;
      } else {
        index = leftIndex * 2;
      }
    }

    if (index + 1 === targetIndex) {
      offset += values[index];
    }

    return offset;
  };

  SkipList.prototype.set = function set(index, value) {
    (true && !(typeof value === 'number') && Ember.assert('value must be a number', typeof value === 'number'));
    (true && !(typeof index === 'number') && Ember.assert('index must be a number', typeof index === 'number'));
    (true && !(index >= 0 && index < this.values.length) && Ember.assert('index must be within bounds', index >= 0 && index < this.values.length));
    var layers = this.layers;

    var oldValue = layers[layers.length - 1][index];
    var delta = roundTo(value - oldValue);

    if (delta === 0) {
      return delta;
    }

    var i = void 0,
        layer = void 0;

    for (i = layers.length - 1; i >= 0; i--) {
      layer = layers[i];

      layer[index] += delta;

      index = Math.floor(index / 2);
    }

    this.total += delta;

    return delta;
  };

  SkipList.prototype.prepend = function prepend(numPrepended) {
    var oldValues = this.values,
        oldLength = this.length,
        defaultValue = this.defaultValue;


    var newLength = numPrepended + oldLength;

    var newValues = new Float32Array(new ArrayBuffer(newLength * 4));

    newValues.set(oldValues, numPrepended);
    fill(newValues, defaultValue, 0, numPrepended);

    this.length = newLength;
    this._initializeLayers(newValues);
  };

  SkipList.prototype.append = function append(numAppended) {
    var oldValues = this.values,
        oldLength = this.length,
        defaultValue = this.defaultValue;


    var newLength = numAppended + oldLength;

    var newValues = new Float32Array(new ArrayBuffer(newLength * 4));

    newValues.set(oldValues);
    fill(newValues, defaultValue, oldLength);

    this.length = newLength;
    this._initializeLayers(newValues);
  };

  SkipList.prototype.reset = function reset(newLength) {
    var oldValues = this.values,
        oldLength = this.length,
        defaultValue = this.defaultValue;


    if (oldLength === newLength) {
      return;
    }

    var newValues = new Float32Array(new ArrayBuffer(newLength * 4));

    if (oldLength < newLength) {
      newValues.set(oldValues);
      fill(newValues, defaultValue, oldLength);
    } else {
      newValues.set(subarray(oldValues, 0, newLength));
    }

    this.length = newLength;

    if (oldLength === 0) {
      this._initializeLayers(newValues, defaultValue);
    } else {
      this._initializeLayers(newValues);
    }
  };

  return SkipList;
}();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DynamicRadar = function (_Radar) {
  _inherits(DynamicRadar, _Radar);

  function DynamicRadar(parentToken, initialItems, initialRenderCount, startingIndex, shouldRecycle) {
    var _this = _possibleConstructorReturn(this, _Radar.call(this, parentToken, initialItems, initialRenderCount, startingIndex, shouldRecycle));

    _this._firstItemIndex = 0;
    _this._lastItemIndex = 0;

    _this._totalBefore = 0;
    _this._totalAfter = 0;

    _this.skipList = null;

    {
      Object.preventExtensions(_this);
    }
    return _this;
  }

  DynamicRadar.prototype.destroy = function destroy() {
    _Radar.prototype.destroy.call(this);

    this.skipList = null;
  };

  DynamicRadar.prototype._updateConstants = function _updateConstants() {
    _Radar.prototype._updateConstants.call(this);

    // Create the SkipList only after the estimateHeight has been calculated the first time
    if (this.skipList === null) {
      this.skipList = new SkipList(this.totalItems, this._estimateHeight);
    } else {
      this.skipList.defaultValue = this._estimateHeight;
    }
  };

  DynamicRadar.prototype._updateIndexes = function _updateIndexes() {
    var _this2 = this;

    var skipList = this.skipList,
        visibleMiddle = this.visibleMiddle,
        totalItems = this.totalItems,
        totalComponents = this.totalComponents,
        _prevFirstItemIndex = this._prevFirstItemIndex,
        _didReset = this._didReset;


    if (totalItems === 0) {
      this._firstItemIndex = 0;
      this._lastItemIndex = -1;
      this._totalBefore = 0;
      this._totalAfter = 0;

      return;
    }

    // Don't measure if the radar has just been instantiated or reset, as we are rendering with a
    // completely new set of items and won't get an accurate measurement until after they render the
    // first time.
    if (_didReset === false) {
      this._measure();
    }

    var values = skipList.values;

    var _skipList$find = this.skipList.find(visibleMiddle),
        totalBefore = _skipList$find.totalBefore,
        totalAfter = _skipList$find.totalAfter,
        middleItemIndex = _skipList$find.index;

    var maxIndex = totalItems - 1;

    var firstItemIndex = middleItemIndex - Math.floor(totalComponents / 2);
    var lastItemIndex = middleItemIndex + Math.ceil(totalComponents / 2) - 1;

    if (firstItemIndex < 0) {
      firstItemIndex = 0;
      lastItemIndex = Math.min(totalComponents - 1, maxIndex);
    }

    if (lastItemIndex > maxIndex) {
      lastItemIndex = maxIndex;
      firstItemIndex = Math.max(maxIndex - (totalComponents - 1), 0);
    }

    // Add buffers
    for (var i = middleItemIndex - 1; i >= firstItemIndex; i--) {
      totalBefore -= values[i];
    }

    for (var _i = middleItemIndex + 1; _i <= lastItemIndex; _i++) {
      totalAfter -= values[_i];
    }

    var itemDelta = _prevFirstItemIndex !== null ? firstItemIndex - _prevFirstItemIndex : lastItemIndex - firstItemIndex;

    if (itemDelta < 0 || itemDelta >= totalComponents) {
      this.schedule('measure', function () {
        // schedule a measurement for items that could affect scrollTop
        var staticVisibleIndex = _this2.renderFromLast ? _this2.lastVisibleIndex + 1 : _this2.firstVisibleIndex;
        var numBeforeStatic = staticVisibleIndex - firstItemIndex;

        var measureLimit = Math.min(Math.abs(itemDelta), numBeforeStatic);

        _this2._prependOffset += Math.round(_this2._measure(measureLimit));
      });
    }

    this._firstItemIndex = firstItemIndex;
    this._lastItemIndex = lastItemIndex;
    this._totalBefore = totalBefore;
    this._totalAfter = totalAfter;
  };

  DynamicRadar.prototype._measure = function _measure() {
    var measureLimit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var orderedComponents = this.orderedComponents,
        itemContainer = this.itemContainer,
        totalBefore = this.totalBefore,
        skipList = this.skipList;


    var numToMeasure = measureLimit !== null ? measureLimit : orderedComponents.length;

    var totalDelta = 0;

    for (var i = 0; i < numToMeasure; i++) {
      var currentItem = orderedComponents[i];
      var previousItem = orderedComponents[i - 1];
      var itemIndex = currentItem.index;

      var _currentItem$getBound = currentItem.getBoundingClientRect(),
          currentItemTop = _currentItem$getBound.top,
          currentItemHeight = _currentItem$getBound.height;

      var margin = void 0;

      if (previousItem !== undefined) {
        margin = currentItemTop - previousItem.getBoundingClientRect().bottom;
      } else {
        margin = currentItemTop - itemContainer.getBoundingClientRect().top - totalBefore;
      }

      var itemDelta = skipList.set(itemIndex, roundTo(currentItemHeight + margin));

      if (itemDelta !== 0) {
        totalDelta += itemDelta;
      }
    }

    return totalDelta;
  };

  DynamicRadar.prototype.prepend = function prepend(numPrepended) {
    _Radar.prototype.prepend.call(this, numPrepended);

    this.skipList.prepend(numPrepended);
  };

  DynamicRadar.prototype.append = function append(numAppended) {
    _Radar.prototype.append.call(this, numAppended);

    this.skipList.append(numAppended);
  };

  DynamicRadar.prototype.reset = function reset() {
    _Radar.prototype.reset.call(this);

    if (this.skipList !== null) {
      this.skipList.reset(this.totalItems);
    }
  };

  /*
   * Public API to query the skiplist for the offset of an item
   */


  DynamicRadar.prototype.getOffsetForIndex = function getOffsetForIndex(index) {
    this._measure();

    return this.skipList.getOffset(index);
  };

  _createClass(DynamicRadar, [{
    key: 'total',
    get: function get() {
      return this.skipList.total;
    }
  }, {
    key: 'totalBefore',
    get: function get() {
      return this._totalBefore;
    }
  }, {
    key: 'totalAfter',
    get: function get() {
      return this._totalAfter;
    }
  }, {
    key: 'firstItemIndex',
    get: function get() {
      return this._firstItemIndex;
    }
  }, {
    key: 'lastItemIndex',
    get: function get() {
      return this._lastItemIndex;
    }
  }, {
    key: 'firstVisibleIndex',
    get: function get() {
      var visibleTop = this.visibleTop;

      var _skipList$find2 = this.skipList.find(visibleTop),
          index = _skipList$find2.index;

      return index;
    }
  }, {
    key: 'lastVisibleIndex',
    get: function get() {
      var visibleBottom = this.visibleBottom,
          totalItems = this.totalItems;

      var _skipList$find3 = this.skipList.find(visibleBottom),
          index = _skipList$find3.index;

      return Math.min(index, totalItems - 1);
    }
  }]);

  return DynamicRadar;
}(Radar);

var _createClass$4 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn$1(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$1(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StaticRadar = function (_Radar) {
  _inherits$1(StaticRadar, _Radar);

  function StaticRadar(parentToken, initialItems, initialRenderCount, startingIndex, shouldRecycle) {
    var _this = _possibleConstructorReturn$1(this, _Radar.call(this, parentToken, initialItems, initialRenderCount, startingIndex, shouldRecycle));

    _this._firstItemIndex = 0;
    _this._lastItemIndex = 0;

    {
      Object.preventExtensions(_this);
    }
    return _this;
  }

  StaticRadar.prototype._updateIndexes = function _updateIndexes() {
    var totalItems = this.totalItems,
        totalComponents = this.totalComponents,
        visibleMiddle = this.visibleMiddle,
        _estimateHeight = this._estimateHeight;


    if (totalItems === 0) {
      this._firstItemIndex = 0;
      this._lastItemIndex = -1;

      return;
    }

    var maxIndex = totalItems - 1;

    var middleItemIndex = Math.floor(visibleMiddle / _estimateHeight);

    var firstItemIndex = middleItemIndex - Math.floor(totalComponents / 2);
    var lastItemIndex = middleItemIndex + Math.ceil(totalComponents / 2) - 1;

    if (firstItemIndex < 0) {
      firstItemIndex = 0;
      lastItemIndex = Math.min(totalComponents - 1, maxIndex);
    }

    if (lastItemIndex > maxIndex) {
      lastItemIndex = maxIndex;
      firstItemIndex = Math.max(maxIndex - (totalComponents - 1), 0);
    }

    this._firstItemIndex = firstItemIndex;
    this._lastItemIndex = lastItemIndex;
  };

  /*
   * Public API to query for the offset of an item
   */
  StaticRadar.prototype.getOffsetForIndex = function getOffsetForIndex(index) {
    return index * this._estimateHeight + 1;
  };

  _createClass$4(StaticRadar, [{
    key: 'total',
    get: function get() {
      return this.totalItems * this._estimateHeight;
    }
  }, {
    key: 'totalBefore',
    get: function get() {
      return this.firstItemIndex * this._estimateHeight;
    }
  }, {
    key: 'totalAfter',
    get: function get() {
      return this.total - (this.lastItemIndex + 1) * this._estimateHeight;
    }
  }, {
    key: 'firstItemIndex',
    get: function get() {
      return this._firstItemIndex;
    }
  }, {
    key: 'lastItemIndex',
    get: function get() {
      return this._lastItemIndex;
    }
  }, {
    key: 'firstVisibleIndex',
    get: function get() {
      return Math.ceil(this.visibleTop / this._estimateHeight);
    }
  }, {
    key: 'lastVisibleIndex',
    get: function get() {
      return Math.min(Math.ceil(this.visibleBottom / this._estimateHeight), this.totalItems) - 1;
    }
  }]);

  return StaticRadar;
}(Radar);

/*
 * There are significant differences between browsers
 * in how they implement "scroll" on document.body
 *
 * The only cross-browser listener for scroll on body
 * is to listen on window with capture.
 *
 * They also implement different standards for how to
 * access the scroll position.
 *
 * This singleton class provides a cross-browser way
 * to access and set the scrollTop and scrollLeft properties.
 *
 */
function Container() {

  // A bug occurs in Chrome when we reload the browser at a lower
  // scrollTop, window.scrollY becomes stuck on a single value.
  Object.defineProperty(this, 'scrollTop', {
    get: function get() {
      return document.body.scrollTop || document.documentElement.scrollTop;
    },
    set: function set(v) {
      return document.body.scrollTop = document.documentElement.scrollTop = v;
    }
  });

  Object.defineProperty(this, 'scrollLeft', {
    get: function get() {
      return window.scrollX || window.pageXOffset || document.body.scrollLeft || document.documentElement.scrollLeft;
    },
    set: function set(v) {
      return window.scrollX = window.pageXOffset = document.body.scrollLeft = document.documentElement.scrollLeft = v;
    }
  });

  Object.defineProperty(this, 'offsetHeight', {
    get: function get() {
      return window.innerHeight;
    }
  });
}

Container.prototype.addEventListener = function addEventListener(event, handler, options) {
  return window.addEventListener(event, handler, options);
};

Container.prototype.removeEventListener = function addEventListener(event, handler, options) {
  return window.removeEventListener(event, handler, options);
};

Container.prototype.getBoundingClientRect = function getBoundingClientRect() {
  return {
    height: window.innerHeight,
    width: window.innerWidth,
    top: 0,
    left: 0,
    right: window.innerWidth,
    bottom: window.innerHeight
  };
};

var container = new Container();

var supportsPassive = false;

try {
  var opts = Object.defineProperty({}, 'passive', {
    get: function get() {
      supportsPassive = true;
    }
  });

  window.addEventListener('test', null, opts);
} catch (e) {
  // do nothing
}

var SUPPORTS_PASSIVE = supportsPassive;

var run$1 = Ember.run;

var DEFAULT_ARRAY_SIZE = 10;
var UNDEFINED_VALUE = Object.create(null);

var ScrollHandler = function () {
  function ScrollHandler() {
    this.elements = new Array(DEFAULT_ARRAY_SIZE);
    this.maxLength = DEFAULT_ARRAY_SIZE;
    this.length = 0;
    this.handlers = new Array(DEFAULT_ARRAY_SIZE);
    this.isPolling = false;
    this.isUsingPassive = SUPPORTS_PASSIVE;
  }

  ScrollHandler.prototype.addScrollHandler = function addScrollHandler(element, handler) {
    var index = this.elements.indexOf(element);
    var handlers = void 0,
        cache = void 0;

    if (index === -1) {
      index = this.length++;

      if (index === this.maxLength) {
        this.maxLength *= 2;
        this.elements.length = this.maxLength;
        this.handlers.length = this.maxLength;
      }

      handlers = [handler];

      this.elements[index] = element;
      cache = this.handlers[index] = {
        top: element.scrollTop,
        left: element.scrollLeft,
        handlers: handlers
      };
      // TODO add explicit test
      if (SUPPORTS_PASSIVE) {
        cache.passiveHandler = function () {
          ScrollHandler.triggerElementHandlers(element, cache);
        };
      } else {
        cache.passiveHandler = UNDEFINED_VALUE;
      }
    } else {
      cache = this.handlers[index];
      handlers = cache.handlers;
      handlers.push(handler);
    }

    // TODO add explicit test
    if (this.isUsingPassive && handlers.length === 1) {
      element.addEventListener('scroll', cache.passiveHandler, { capture: true, passive: true });

      // TODO add explicit test
    } else if (!this.isPolling) {
      this.poll();
    }
  };

  ScrollHandler.prototype.removeScrollHandler = function removeScrollHandler(element, handler) {
    var index = this.elements.indexOf(element);
    var elementCache = this.handlers[index];
    // TODO add explicit test
    if (elementCache && elementCache.handlers) {
      var _index = elementCache.handlers.indexOf(handler);

      if (_index === -1) {
        throw new Error('Attempted to remove an unknown handler');
      }

      elementCache.handlers.splice(_index, 1);

      // cleanup element entirely if needed
      // TODO add explicit test
      if (!elementCache.handlers.length) {
        _index = this.elements.indexOf(element);
        this.handlers.splice(_index, 1);
        this.elements.splice(_index, 1);

        this.length--;
        this.maxLength--;

        if (this.length === 0) {
          this.isPolling = false;
        }

        // TODO add explicit test
        if (this.isUsingPassive) {
          element.removeEventListener('scroll', elementCache.passiveHandler, { capture: true, passive: true });
        }
      }
    } else {
      throw new Error('Attempted to remove a handler from an unknown element or an element with no handlers');
    }
  };

  ScrollHandler.triggerElementHandlers = function triggerElementHandlers(element, meta) {
    var cachedTop = element.scrollTop;
    var cachedLeft = element.scrollLeft;
    var topChanged = cachedTop !== meta.top;
    var leftChanged = cachedLeft !== meta.left;

    meta.top = cachedTop;
    meta.left = cachedLeft;

    var event = { top: cachedTop, left: cachedLeft };

    // TODO add explicit test
    if (topChanged || leftChanged) {
      run$1.begin();
      for (var j = 0; j < meta.handlers.length; j++) {
        meta.handlers[j](event);
      }
      run$1.end();
    }
  };

  ScrollHandler.prototype.poll = function poll() {
    var _this = this;

    this.isPolling = true;

    scheduler.schedule('sync', function () {
      // TODO add explicit test
      if (!_this.isPolling) {
        return;
      }

      for (var i = 0; i < _this.length; i++) {
        var element = _this.elements[i];
        var info = _this.handlers[i];

        ScrollHandler.triggerElementHandlers(element, info);
      }

      _this.isPolling = _this.length > 0;
      // TODO add explicit test
      if (_this.isPolling) {
        _this.poll();
      }
    });
  };

  return ScrollHandler;
}();

var instance = new ScrollHandler();

function addScrollHandler(element, handler) {
  instance.addScrollHandler(element, handler);
}

function removeScrollHandler(element, handler) {
  instance.removeScrollHandler(element, handler);
}

exports.keyForItem = keyForItem;
exports.estimateElementHeight = estimateElementHeight;
exports.closestElement = closest;
exports.DynamicRadar = DynamicRadar;
exports.StaticRadar = StaticRadar;
exports.Container = container;
exports.objectAt = objectAt;
exports.Token = Token;
exports.scheduler = scheduler;
exports.addScrollHandler = addScrollHandler;
exports.removeScrollHandler = removeScrollHandler;
exports.ScrollHandler = ScrollHandler;

Object.defineProperty(exports, '__esModule', { value: true });

});
