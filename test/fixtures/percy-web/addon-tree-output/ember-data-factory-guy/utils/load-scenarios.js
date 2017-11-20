define('ember-data-factory-guy/utils/load-scenarios', ['exports', 'ember-data-factory-guy/utils/helper-functions'], function (exports, _helperFunctions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (owner) {
    var config = owner.resolveRegistration('config:environment') || {},
        factoryGuy = config.factoryGuy;


    if (factoryGuy && factoryGuy.useScenarios) {
      var _requireFiles = (0, _helperFunctions.requireFiles)(scenarioFileRegExp),
          _requireFiles2 = _slicedToArray(_requireFiles, 1),
          Scenario = _requireFiles2[0];

      Ember.assert('[ember-data-factory-guy] No app/scenarios/main.js file was found.\n      If you have factoryGuy set to true in config/environment.js file,\n      then you should setup a file app/scenarios/main.js to control what data will\n      be like in the application.', Scenario);
      new Scenario['default']().run();
    }
  };

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

  var scenarioFileRegExp = new RegExp('/scenarios/main$');
  /**
   * There is only one scenario file that is important here.
   * And that is: scenarios/main.js file.
   *
   * This file dictates what the scenario will be, since from
   * there you can include other scenarios, and compose whatever
   * grand scheme you have in mind
   *
   * @param container
   */
});