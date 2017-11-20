define('ember-power-select/components/power-select-multiple/trigger', ['exports', 'ember-power-select/templates/components/power-select-multiple/trigger'], function (exports, _trigger) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var get = Ember.get;
  var computed = Ember.computed;
  var inject = Ember.inject.service;
  var scheduleOnce = Ember.run.scheduleOnce;
  var isBlank = Ember.isBlank;
  var htmlSafe = Ember.String.htmlSafe;


  var ua = self.window && self.window.navigator ? self.window.navigator.userAgent : '';
  var isIE = ua.indexOf('MSIE ') > -1 || ua.indexOf('Trident/') > -1;
  var isTouchDevice = !!self.window && 'ontouchstart' in self.window;

  exports.default = Component.extend({
    tagName: '',
    layout: _trigger.default,
    textMeasurer: inject(),
    _lastIsOpen: false,

    // Lifecycle hooks
    didInsertElement: function didInsertElement() {
      var _this = this;

      this._super.apply(this, arguments);
      var select = this.get('select');
      this.input = document.getElementById('ember-power-select-trigger-multiple-input-' + select.uniqueId);
      var inputStyle = this.input ? window.getComputedStyle(this.input) : null;
      this.inputFont = inputStyle ? inputStyle.fontStyle + ' ' + inputStyle.fontVariant + ' ' + inputStyle.fontWeight + ' ' + inputStyle.fontSize + '/' + inputStyle.lineHeight + ' ' + inputStyle.fontFamily : null;
      var optionsList = document.getElementById('ember-power-select-multiple-options-' + select.uniqueId);
      var chooseOption = function chooseOption(e) {
        var selectedIndex = e.target.getAttribute('data-selected-index');
        if (selectedIndex) {
          e.stopPropagation();
          e.preventDefault();

          var _select = _this.get('select');
          var object = _this.selectedObject(_select.selected, selectedIndex);
          _select.actions.choose(object);
        }
      };
      if (isTouchDevice) {
        optionsList.addEventListener('touchstart', chooseOption);
      }
      optionsList.addEventListener('mousedown', chooseOption);
    },
    didReceiveAttrs: function didReceiveAttrs() {
      var oldSelect = this.get('oldSelect') || {};
      var select = this.set('oldSelect', this.get('select'));
      if (oldSelect.isOpen && !select.isOpen) {
        scheduleOnce('actions', null, select.actions.search, '');
      }
    },


    // CPs
    triggerMultipleInputStyle: computed('select.searchText.length', 'select.selected.length', function () {
      var select = this.get('select');
      scheduleOnce('actions', select.actions.reposition);
      if (!select.selected || select.selected.length === 0) {
        return htmlSafe('width: 100%;');
      } else {
        var textWidth = 0;
        if (this.inputFont) {
          textWidth = this.get('textMeasurer').width(select.searchText, this.inputFont);
        }
        return htmlSafe('width: ' + (textWidth + 25) + 'px');
      }
    }),

    maybePlaceholder: computed('placeholder', 'select.selected.length', function () {
      if (isIE) {
        return null;
      }
      var select = this.get('select');
      return !select.selected || get(select.selected, 'length') === 0 ? this.get('placeholder') || '' : '';
    }),

    // Actions
    actions: {
      onInput: function onInput(e) {
        var action = this.get('onInput');
        if (action && action(e) === false) {
          return;
        }
        this.get('select').actions.open(e);
      },
      onKeydown: function onKeydown(e) {
        var _getProperties = this.getProperties('onKeydown', 'select'),
            onKeydown = _getProperties.onKeydown,
            select = _getProperties.select;

        if (onKeydown && onKeydown(e) === false) {
          e.stopPropagation();
          return false;
        }
        if (e.keyCode === 8) {
          e.stopPropagation();
          if (isBlank(e.target.value)) {
            var lastSelection = select.selected[select.selected.length - 1];
            if (lastSelection) {
              select.actions.select(this.get('buildSelection')(lastSelection, select), e);
              if (typeof lastSelection === 'string') {
                select.actions.search(lastSelection);
              } else {
                var searchField = this.get('searchField');
                (true && !(searchField) && Ember.assert('`{{power-select-multiple}}` requires a `searchField` when the options are not strings to remove options using backspace', searchField));

                select.actions.search(get(lastSelection, searchField));
              }
              select.actions.open(e);
            }
          }
        } else if (e.keyCode >= 48 && e.keyCode <= 90 || e.keyCode === 32) {
          // Keys 0-9, a-z or SPACE
          e.stopPropagation();
        }
      }
    },

    // Methods
    selectedObject: function selectedObject(list, index) {
      if (list.objectAt) {
        return list.objectAt(index);
      } else {
        return get(list, index);
      }
    }
  });
});