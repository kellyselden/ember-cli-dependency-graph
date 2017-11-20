define('ember-data-factory-guy/scenario', ['exports', 'ember-data-factory-guy'], function (exports, _emberDataFactoryGuy) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var proxyFx = ['make', 'makeNew', 'makeList', 'build', 'buildList', 'mockFind', 'mockFindRecord', 'mockFindAll', 'mockReload', 'mockQuery', 'mockQueryRecord', 'mockUpdate', 'mockCreate', 'mockDelete'];

  var _class = function () {
    function _class() {
      var _this = this;

      _classCallCheck(this, _class);

      proxyFx.forEach(function (fx) {
        return _this[fx] = _emberDataFactoryGuy[fx];
      });
      this.store = _emberDataFactoryGuy.default.store;
    }

    _createClass(_class, [{
      key: 'run',
      value: function run() {}
    }, {
      key: 'include',
      value: function include(scenarios) {
        (scenarios || []).forEach(function (Scenario) {
          return new Scenario().run();
        });
      }
    }], [{
      key: 'settings',
      value: function settings() {
        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _emberDataFactoryGuy.default.settings(opts);
      }
    }]);

    return _class;
  }();

  exports.default = _class;
});