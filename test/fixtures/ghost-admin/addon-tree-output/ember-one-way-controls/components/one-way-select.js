define('ember-one-way-controls/components/one-way-select', ['exports', 'ember-one-way-controls/templates/components/one-way-select', 'ember-one-way-controls/-private/dynamic-attribute-bindings', 'ember-invoke-action'], function (exports, _oneWaySelect, _dynamicAttributeBindings, _emberInvokeAction) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var emberArray = Ember.A,
      Component = Ember.Component,
      computed = Ember.computed,
      _Ember$computed = Ember.computed,
      alias = _Ember$computed.alias,
      empty = _Ember$computed.empty,
      not = _Ember$computed.not,
      or = _Ember$computed.or,
      EmberObject = Ember.Object,
      get = Ember.get,
      isArray = Ember.isArray,
      isBlank = Ember.isBlank,
      isNone = Ember.isNone,
      isPresent = Ember.isPresent,
      set = Ember.set,
      w = Ember.String.w;


  var OneWaySelectComponent = Component.extend(_dynamicAttributeBindings.default, {
    layout: _oneWaySelect.default,
    tagName: 'select',

    NON_ATTRIBUTE_BOUND_PROPS: ['value', 'update', 'options', 'paramValue', 'prompt', 'promptIsSelectable', 'includeBlank', 'optionValuePath', 'optionLabelPath', 'optionComponent', 'groupLabelPath'],

    attributeBindings: ['multiple'],

    didReceiveAttrs: function didReceiveAttrs() {
      this._super.apply(this, arguments);

      var value = get(this, 'paramValue');
      if (value === undefined) {
        value = get(this, 'value');
      }

      set(this, 'selectedValue', value);

      var options = get(this, 'options');
      if (typeof options === 'string') {
        options = w(options);
      }

      var firstOption = get(emberArray(options), 'firstObject');
      if (firstOption && isPresent(get(firstOption, 'groupName')) && isArray(get(firstOption, 'options'))) {
        set(this, 'optionsArePreGrouped', true);
      }

      if (isBlank(get(this, 'promptIsSelectable'))) {
        set(this, 'promptIsSelectable', false);
      }

      set(this, 'options', emberArray(options));
    },


    nothingSelected: empty('selectedValue'),
    promptIsDisabled: not('promptIsSelectable'),
    hasGrouping: or('optionsArePreGrouped', 'groupLabelPath'),
    computedOptionValuePath: or('optionValuePath', 'optionTargetPath'),

    optionGroups: computed('options.[]', function () {
      var groupLabelPath = get(this, 'groupLabelPath');
      var options = get(this, 'options');
      var groups = emberArray();

      if (!groupLabelPath) {
        return options;
      }

      options.forEach(function (item) {
        var label = get(item, groupLabelPath);

        if (label) {
          var group = groups.findBy('groupName', label);

          if (group == null) {
            group = EmberObject.create({
              groupName: label,
              options: emberArray()
            });

            groups.pushObject(group);
          }

          get(group, 'options').pushObject(item);
        } else {
          groups.pushObject(item);
        }
      });

      return groups;
    }),

    change: function change() {
      var value = void 0;

      if (get(this, 'multiple') === true) {
        value = this._selectedMultiple();
      } else {
        value = this._selectedSingle();
      }

      (0, _emberInvokeAction.invokeAction)(this, 'update', value);
    },


    prompt: alias('includeBlank'),

    _selectedMultiple: function _selectedMultiple() {
      var _this = this;

      var options = this.element.options;
      var selectedValues = [];
      for (var i = 0; i < options.length; i++) {
        if (options[i].selected) {
          selectedValues.push(options[i].value);
        }
      }
      return selectedValues.map(function (selectedValue) {
        return _this._findOption(selectedValue);
      });
    },
    _selectedSingle: function _selectedSingle() {
      var selectedValue = this.element.value;
      return this._findOption(selectedValue);
    },
    _findOption: function _findOption(value) {
      var options = get(this, 'options');
      var optionValuePath = get(this, 'computedOptionValuePath');
      var optionTargetPath = get(this, 'optionTargetPath');
      var optionsArePreGrouped = get(this, 'optionsArePreGrouped');

      var findOption = function findOption(item) {
        if (optionValuePath) {
          return '' + get(item, optionValuePath) === value;
        } else {
          return '' + item === value;
        }
      };

      var foundOption = void 0;
      if (optionsArePreGrouped) {
        foundOption = options.reduce(function (found, group) {
          return found || get(group, 'options').find(findOption);
        }, undefined);
      } else {
        foundOption = options.find(findOption);
      }

      if (optionTargetPath && !isNone(foundOption)) {
        return get(foundOption, optionTargetPath);
      } else {
        return foundOption;
      }
    }
  });

  OneWaySelectComponent.reopenClass({
    positionalParams: ['paramValue']
  });

  exports.default = OneWaySelectComponent;
});