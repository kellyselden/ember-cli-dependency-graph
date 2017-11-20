define('ember-basic-dropdown/components/basic-dropdown', ['exports', 'ember-basic-dropdown/templates/components/basic-dropdown', 'ember-basic-dropdown/utils/computed-fallback-if-undefined', 'ember-basic-dropdown/utils/calculate-position'], function (exports, _basicDropdown, _computedFallbackIfUndefined, _calculatePosition) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var set = Ember.set;
  var join = Ember.run.join;
  var computed = Ember.computed;
  var guidFor = Ember.guidFor;
  var getOwner = Ember.getOwner;


  var assign = Object.assign || function EmberAssign(original) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    for (var i = 0; i < args.length; i++) {
      var arg = args[i];
      if (!arg) {
        continue;
      }
      var updates = Object.keys(arg);

      for (var _i = 0; _i < updates.length; _i++) {
        var prop = updates[_i];
        original[prop] = arg[prop];
      }
    }

    return original;
  };

  exports.default = Component.extend({
    layout: _basicDropdown.default,
    tagName: '',
    renderInPlace: (0, _computedFallbackIfUndefined.default)(false),
    verticalPosition: (0, _computedFallbackIfUndefined.default)('auto'), // above | below
    horizontalPosition: (0, _computedFallbackIfUndefined.default)('auto'), // auto-right | right | center | left
    matchTriggerWidth: (0, _computedFallbackIfUndefined.default)(false),
    triggerComponent: (0, _computedFallbackIfUndefined.default)('basic-dropdown/trigger'),
    contentComponent: (0, _computedFallbackIfUndefined.default)('basic-dropdown/content'),
    calculatePosition: (0, _computedFallbackIfUndefined.default)(_calculatePosition.default),
    classNames: ['ember-basic-dropdown'],
    top: null,
    left: null,
    right: null,
    width: null,
    height: null,

    // Lifecycle hooks
    init: function init() {
      if (this.get('renderInPlace') && this.get('tagName') === '') {
        this.set('tagName', 'div');
      }
      this._super.apply(this, arguments);
      this.set('publicAPI', {});

      var publicAPI = this.updateState({
        uniqueId: guidFor(this),
        isOpen: this.get('initiallyOpened') || false,
        disabled: this.get('disabled') || false,
        actions: {
          open: this.open.bind(this),
          close: this.close.bind(this),
          toggle: this.toggle.bind(this),
          reposition: this.reposition.bind(this)
        }
      });

      this.dropdownId = this.dropdownId || 'ember-basic-dropdown-content-' + publicAPI.uniqueId;
      var onInit = this.get('onInit');
      if (onInit) {
        onInit(publicAPI);
      }
    },
    didReceiveAttrs: function didReceiveAttrs() {
      this._super.apply(this, arguments);
      var oldDisabled = !!this._oldDisabled;
      var newDisabled = !!this.get('disabled');
      this._oldDisabled = newDisabled;
      if (newDisabled && !oldDisabled) {
        join(this, this.disable);
      } else if (!newDisabled && oldDisabled) {
        join(this, this.enable);
      }
    },
    willDestroy: function willDestroy() {
      this._super.apply(this, arguments);
      var registerAPI = this.get('registerAPI');
      if (registerAPI) {
        registerAPI(null);
      }
    },


    // CPs
    destination: computed({
      get: function get() {
        return this._getDestinationId();
      },
      set: function set(_, v) {
        return v === undefined ? this._getDestinationId() : v;
      }
    }),

    // Actions
    actions: {
      handleFocus: function handleFocus(e) {
        var onFocus = this.get('onFocus');
        if (onFocus) {
          onFocus(this.get('publicAPI'), e);
        }
      }
    },

    // Methods
    open: function open(e) {
      if (this.get('isDestroyed')) {
        return;
      }
      var publicAPI = this.get('publicAPI');
      if (publicAPI.disabled || publicAPI.isOpen) {
        return;
      }
      var onOpen = this.get('onOpen');
      if (onOpen && onOpen(publicAPI, e) === false) {
        return;
      }
      this.updateState({ isOpen: true });
    },
    close: function close(e, skipFocus) {
      if (this.get('isDestroyed')) {
        return;
      }
      var publicAPI = this.get('publicAPI');
      if (publicAPI.disabled || !publicAPI.isOpen) {
        return;
      }
      var onClose = this.get('onClose');
      if (onClose && onClose(publicAPI, e) === false) {
        return;
      }
      if (this.get('isDestroyed')) {
        return;
      }
      this.setProperties({ hPosition: null, vPosition: null, top: null, left: null, right: null, width: null, height: null });
      this.previousVerticalPosition = this.previousHorizontalPosition = null;
      this.updateState({ isOpen: false });
      if (skipFocus) {
        return;
      }
      var trigger = document.querySelector('[data-ebd-id=' + publicAPI.uniqueId + '-trigger]');
      if (trigger && trigger.tabIndex > -1) {
        trigger.focus();
      }
    },
    toggle: function toggle(e) {
      if (this.get('publicAPI.isOpen')) {
        this.close(e);
      } else {
        this.open(e);
      }
    },
    reposition: function reposition() {
      var publicAPI = this.get('publicAPI');
      if (!publicAPI.isOpen) {
        return;
      }
      var dropdownElement = self.document.getElementById(this.dropdownId);
      var triggerElement = document.querySelector('[data-ebd-id=' + publicAPI.uniqueId + '-trigger]');
      if (!dropdownElement || !triggerElement) {
        return;
      }

      this.destinationElement = this.destinationElement || self.document.getElementById(this.get('destination'));
      var options = this.getProperties('horizontalPosition', 'verticalPosition', 'matchTriggerWidth', 'previousHorizontalPosition', 'previousVerticalPosition', 'renderInPlace');
      options.dropdown = this;
      var positionData = this.get('calculatePosition')(triggerElement, dropdownElement, this.destinationElement, options);
      return this.applyReposition(triggerElement, dropdownElement, positionData);
    },
    applyReposition: function applyReposition(trigger, dropdown, positions) {
      var changes = {
        hPosition: positions.horizontalPosition,
        vPosition: positions.verticalPosition
      };
      if (positions.style) {
        changes.top = positions.style.top + 'px';
        // The component can be aligned from the right or from the left, but not from both.
        if (positions.style.left !== undefined) {
          changes.left = positions.style.left + 'px';
          changes.right = null;
        } else if (positions.style.right !== undefined) {
          changes.right = positions.style.right + 'px';
          changes.left = null;
        }
        if (positions.style.width !== undefined) {
          changes.width = positions.style.width + 'px';
        }
        if (positions.style.height !== undefined) {
          changes.height = positions.style.height + 'px';
        }
        if (this.get('top') === null) {
          // Bypass Ember on the first reposition only to avoid flickering.
          var cssRules = [];
          for (var prop in positions.style) {
            if (typeof positions.style[prop] === 'number') {
              cssRules.push(prop + ': ' + positions.style[prop] + 'px');
            } else {
              cssRules.push(prop + ': ' + positions.style[prop]);
            }
          }
          dropdown.setAttribute('style', cssRules.join(';'));
        }
      }
      this.setProperties(changes);
      this.previousHorizontalPosition = positions.horizontalPosition;
      this.previousVerticalPosition = positions.verticalPosition;
      return changes;
    },
    disable: function disable() {
      var publicAPI = this.get('publicAPI');
      if (publicAPI.isOpen) {
        publicAPI.actions.close();
      }
      this.updateState({ disabled: true });
    },
    enable: function enable() {
      this.updateState({ disabled: false });
    },
    updateState: function updateState(changes) {
      var newState = set(this, 'publicAPI', assign({}, this.get('publicAPI'), changes));
      var registerAPI = this.get('registerAPI');
      if (registerAPI) {
        registerAPI(newState);
      }
      return newState;
    },
    _getDestinationId: function _getDestinationId() {
      var config = getOwner(this).resolveRegistration('config:environment');
      if (config.environment === 'test') {
        return 'ember-testing';
      }
      return config['ember-basic-dropdown'] && config['ember-basic-dropdown'].destination || 'ember-basic-dropdown-wormhole';
    }
  });
});