define('ember-basic-dropdown/components/basic-dropdown/content', ['exports', 'ember-basic-dropdown/templates/components/basic-dropdown/content', 'ember-basic-dropdown/utils/computed-fallback-if-undefined', 'ember-basic-dropdown/utils/calculate-position'], function (exports, _content, _computedFallbackIfUndefined, _calculatePosition) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var Component = Ember.Component;
  var computed = Ember.computed;
  var join = Ember.run.join;
  var scheduleOnce = Ember.run.scheduleOnce;
  var getOwner = Ember.getOwner;
  var htmlSafe = Ember.String.htmlSafe;


  function closestContent(el) {
    while (el && (!el.classList || !el.classList.contains('ember-basic-dropdown-content'))) {
      el = el.parentElement;
    }
    return el;
  }

  function waitForAnimations(element, callback) {
    self.window.requestAnimationFrame(function () {
      var computedStyle = self.window.getComputedStyle(element);
      if (computedStyle.animationName !== 'none' && computedStyle.animationPlayState === 'running') {
        var eventCallback = function eventCallback() {
          element.removeEventListener('animationend', eventCallback);
          callback();
        };
        element.addEventListener('animationend', eventCallback);
      } else {
        callback();
      }
    });
  }

  /**
   * Evaluates if the given element is in a dropdown or any of its parent dropdowns.
   *
   * @param {HTMLElement} el
   * @param {String} dropdownId
   */
  function dropdownIsValidParent(el, dropdownId) {
    var closestDropdown = closestContent(el);
    if (closestDropdown) {
      var trigger = document.querySelector('[aria-owns=' + closestDropdown.attributes.id.value + ']');
      var parentDropdown = closestContent(trigger);
      return parentDropdown && parentDropdown.attributes.id.value === dropdownId || dropdownIsValidParent(parentDropdown, dropdownId);
    } else {
      return false;
    }
  }

  exports.default = Component.extend({
    layout: _content.default,
    tagName: '',
    isTouchDevice: !!self.window && 'ontouchstart' in self.window,
    hasMoved: false,
    animationClass: '',
    transitioningInClass: 'ember-basic-dropdown--transitioning-in',
    transitionedInClass: 'ember-basic-dropdown--transitioned-in',
    transitioningOutClass: 'ember-basic-dropdown--transitioning-out',

    // CPs
    _contentTagName: (0, _computedFallbackIfUndefined.default)('div'),
    animationEnabled: computed(function () {
      var config = getOwner(this).resolveRegistration('config:environment');
      return config.environment !== 'test';
    }),

    to: computed('destination', {
      get: function get() {
        return this.get('destination');
      },
      set: function set(_, v) {
        (true && !(false) && Ember.deprecate('Passing `to="id-of-elmnt"` to the {{#dropdown.content}} has been deprecated. Please pass `destination="id-of-elmnt"` to the {{#basic-dropdown}} component instead', false, { id: 'ember-basic-dropdown-to-in-content', until: '0.40' }));

        return v === undefined ? this.get('destination') : v;
      }
    }),

    style: computed('top', 'left', 'right', 'width', 'height', function () {
      var style = '';

      var _getProperties = this.getProperties('top', 'left', 'right', 'width', 'height'),
          top = _getProperties.top,
          left = _getProperties.left,
          right = _getProperties.right,
          width = _getProperties.width,
          height = _getProperties.height;

      if (top) {
        style += 'top: ' + top + ';';
      }
      if (left) {
        style += 'left: ' + left + ';';
      }
      if (right) {
        style += 'right: ' + right + ';';
      }
      if (width) {
        style += 'width: ' + width + ';';
      }
      if (height) {
        style += 'height: ' + height;
      }
      if (style.length > 0) {
        return htmlSafe(style);
      }
    }),

    // Lifecycle hooks
    init: function init() {
      this._super.apply(this, arguments);
      this.handleRootMouseDown = this.handleRootMouseDown.bind(this);
      this.touchStartHandler = this.touchStartHandler.bind(this);
      this.touchMoveHandler = this.touchMoveHandler.bind(this);
      var dropdown = this.get('dropdown');
      this.scrollableAncestors = [];
      this.dropdownId = 'ember-basic-dropdown-content-' + dropdown.uniqueId;
      if (this.get('animationEnabled')) {
        this.set('animationClass', this.get('transitioningInClass'));
      }
      this.runloopAwareReposition = function () {
        join(dropdown.actions.reposition);
      };
    },
    willDestroyElement: function willDestroyElement() {
      this._super.apply(this, arguments);
      this._teardown();
    },
    didReceiveAttrs: function didReceiveAttrs() {
      this._super.apply(this, arguments);
      var oldDropdown = this.get('oldDropdown') || {};
      var dropdown = this.get('dropdown');

      // The following condition checks whether we need to open the dropdown - either because it was
      // closed and is now open or because it was open and then it was closed and opened pretty much at
      // the same time, indicated by `top`, `left` and `right` being null.

      var _getProperties2 = this.getProperties('top', 'left', 'right', 'renderInPlace'),
          top = _getProperties2.top,
          left = _getProperties2.left,
          right = _getProperties2.right,
          renderInPlace = _getProperties2.renderInPlace;

      if ((!oldDropdown.isOpen || top === null && left === null && right === null && renderInPlace === false) && dropdown.isOpen) {
        scheduleOnce('afterRender', this, this.open);
      } else if (oldDropdown.isOpen && !dropdown.isOpen) {
        this.close();
      }
      this.set('oldDropdown', dropdown);
    },


    // Methods
    open: function open() {
      var dropdown = this.get('dropdown');
      this.triggerElement = this.triggerElement || document.querySelector('[data-ebd-id=' + dropdown.uniqueId + '-trigger]');
      this.dropdownElement = document.getElementById(this.dropdownId);
      self.document.addEventListener('mousedown', this.handleRootMouseDown, true);
      if (this.get('isTouchDevice')) {
        self.document.addEventListener('touchstart', this.touchStartHandler, true);
        self.document.addEventListener('touchend', this.handleRootMouseDown, true);
      }
      var onFocusIn = this.get('onFocusIn');
      if (onFocusIn) {
        this.dropdownElement.addEventListener('focusin', function (e) {
          return onFocusIn(dropdown, e);
        });
      }
      var onFocusOut = this.get('onFocusOut');
      if (onFocusOut) {
        this.dropdownElement.addEventListener('focusout', function (e) {
          return onFocusOut(dropdown, e);
        });
      }
      var onMouseEnter = this.get('onMouseEnter');
      if (onMouseEnter) {
        this.dropdownElement.addEventListener('mouseenter', function (e) {
          return onMouseEnter(dropdown, e);
        });
      }
      var onMouseLeave = this.get('onMouseLeave');
      if (onMouseLeave) {
        this.dropdownElement.addEventListener('mouseleave', function (e) {
          return onMouseLeave(dropdown, e);
        });
      }
      var changes = dropdown.actions.reposition();
      if (!this.get('renderInPlace')) {
        this.destinationElement = document.getElementById(this.get('destination'));
        this.scrollableAncestors = this.getScrollableAncestors();
        this.addGlobalEvents();
        this.startObservingDomMutations();
      } else if (changes.vPosition === 'above') {
        this.startObservingDomMutations();
      }

      if (this.get('animationEnabled')) {
        scheduleOnce('afterRender', this, this.animateIn);
      }
    },
    close: function close() {
      this._teardown();
      if (this.get('animationEnabled')) {
        this.animateOut(this.dropdownElement);
      }
      this.dropdownElement = null;
    },


    // Methods
    handleRootMouseDown: function handleRootMouseDown(e) {
      if (this.hasMoved || this.dropdownElement.contains(e.target) || this.triggerElement && this.triggerElement.contains(e.target)) {
        this.hasMoved = false;
        return;
      }

      if (dropdownIsValidParent(e.target, this.dropdownId)) {
        this.hasMoved = false;
        return;
      }

      this.get('dropdown').actions.close(e, true);
    },
    addGlobalEvents: function addGlobalEvents() {
      var _this = this;

      self.window.addEventListener('scroll', this.runloopAwareReposition);
      this.scrollableAncestors.forEach(function (el) {
        el.addEventListener('scroll', _this.runloopAwareReposition);
      });
      self.window.addEventListener('resize', this.runloopAwareReposition);
      self.window.addEventListener('orientationchange', this.runloopAwareReposition);
    },
    startObservingDomMutations: function startObservingDomMutations() {
      var _this2 = this;

      this.mutationObserver = new MutationObserver(function (mutations) {
        if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) {
          _this2.runloopAwareReposition();
        }
      });
      this.mutationObserver.observe(this.dropdownElement, { childList: true, subtree: true });
    },
    removeGlobalEvents: function removeGlobalEvents() {
      var _this3 = this;

      self.window.removeEventListener('scroll', this.runloopAwareReposition);
      this.scrollableAncestors.forEach(function (el) {
        el.removeEventListener('scroll', _this3.runloopAwareReposition);
      });
      self.window.removeEventListener('resize', this.runloopAwareReposition);
      self.window.removeEventListener('orientationchange', this.runloopAwareReposition);
    },
    stopObservingDomMutations: function stopObservingDomMutations() {
      if (this.mutationObserver) {
        this.mutationObserver.disconnect();
        this.mutationObserver = null;
      }
    },
    animateIn: function animateIn() {
      var _this4 = this;

      waitForAnimations(this.dropdownElement, function () {
        _this4.set('animationClass', _this4.get('transitionedInClass'));
      });
    },
    animateOut: function animateOut(dropdownElement) {
      var _clone$classList, _clone$classList2;

      var parentElement = this.get('renderInPlace') ? dropdownElement.parentElement.parentElement : dropdownElement.parentElement;
      var clone = dropdownElement.cloneNode(true);
      clone.id = clone.id + '--clone';
      var transitioningInClass = this.get('transitioningInClass');
      (_clone$classList = clone.classList).remove.apply(_clone$classList, _toConsumableArray(transitioningInClass.split(' ')));
      (_clone$classList2 = clone.classList).add.apply(_clone$classList2, _toConsumableArray(this.get('transitioningOutClass').split(' ')));
      parentElement.appendChild(clone);
      this.set('animationClass', transitioningInClass);
      waitForAnimations(clone, function () {
        parentElement.removeChild(clone);
      });
    },
    touchStartHandler: function touchStartHandler() {
      self.document.addEventListener('touchmove', this.touchMoveHandler, true);
    },
    touchMoveHandler: function touchMoveHandler() {
      this.hasMoved = true;
      self.document.removeEventListener('touchmove', this.touchMoveHandler, true);
    },


    // All ancestors with scroll (except the BODY, which is treated differently)
    getScrollableAncestors: function getScrollableAncestors() {
      var scrollableAncestors = [];
      if (this.triggerElement) {
        var nextScrollable = (0, _calculatePosition.getScrollParent)(this.triggerElement.parentNode);
        while (nextScrollable && nextScrollable.tagName.toUpperCase() !== 'BODY' && nextScrollable.tagName.toUpperCase() !== 'HTML') {
          scrollableAncestors.push(nextScrollable);
          nextScrollable = (0, _calculatePosition.getScrollParent)(nextScrollable.parentNode);
        }
      }
      return scrollableAncestors;
    },
    _teardown: function _teardown() {
      this.removeGlobalEvents();
      this.destinationElement = null;
      this.scrollableAncestors = [];
      this.stopObservingDomMutations();
      self.document.removeEventListener('mousedown', this.handleRootMouseDown, true);
      if (this.get('isTouchDevice')) {
        self.document.removeEventListener('touchstart', this.touchStartHandler, true);
        self.document.removeEventListener('touchend', this.handleRootMouseDown, true);
      }
    }
  });
});