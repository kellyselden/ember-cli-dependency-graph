define('ember-data-factory-guy/mocks/mock-update-request', ['exports', 'ember-data-factory-guy/factory-guy', 'ember-data-factory-guy/mocks/mock-request', 'ember-data-factory-guy/mocks/attribute-matcher', 'ember-data-factory-guy/mocks/maybe-id-url-match'], function (exports, _factoryGuy, _mockRequest, _attributeMatcher, _maybeIdUrlMatch) {
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

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        return get(parent, property, receiver);
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  };

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var MockUpdateRequest = function (_MaybeIdUrlMatch) {
    _inherits(MockUpdateRequest, _MaybeIdUrlMatch);

    function MockUpdateRequest(modelName) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          id = _ref.id,
          model = _ref.model;

      _classCallCheck(this, MockUpdateRequest);

      var _this = _possibleConstructorReturn(this, (MockUpdateRequest.__proto__ || Object.getPrototypeOf(MockUpdateRequest)).call(this, modelName, 'updateRecord'));

      _this.id = id;
      _this.model = model;
      _this.returnArgs = {};
      _this.matchArgs = {};
      _this.setupHandler();
      return _this;
    }

    _createClass(MockUpdateRequest, [{
      key: 'getType',
      value: function getType() {
        return _factoryGuy.default.updateHTTPMethod(this.modelName);
      }
    }, {
      key: 'makeFakeSnapshot',
      value: function makeFakeSnapshot() {
        var snapshot = _get(MockUpdateRequest.prototype.__proto__ || Object.getPrototypeOf(MockUpdateRequest.prototype), 'makeFakeSnapshot', this).call(this);
        if (this.id && !this.model) {
          snapshot.record = _factoryGuy.default.store.peekRecord(this.modelName, this.id);
        }
        return snapshot;
      }
    }, {
      key: 'returns',
      value: function returns(_returns) {
        this.validateReturnsOptions(_returns);

        if (!this.id) {
          Ember.assert('[ember-data-factory-guy] Can\'t use returns in \n      mockUpdate when update only has modelName and no id', this.id);
        }

        this.returnArgs = _returns.attrs;
        return this;
      }
    }, {
      key: 'getResponse',
      value: function getResponse() {
        this.responseJson = null;
        if (this.id) {
          var args = Object.assign({}, this.matchArgs, this.returnArgs),
              json = Object.assign({}, args, { id: this.id });
          this.responseJson = this.fixtureBuilder.convertForBuild(this.modelName, json);
        }
        return _get(MockUpdateRequest.prototype.__proto__ || Object.getPrototypeOf(MockUpdateRequest.prototype), 'getResponse', this).call(this);
      }
    }]);

    return MockUpdateRequest;
  }((0, _maybeIdUrlMatch.default)((0, _attributeMatcher.default)(_mockRequest.default)));

  exports.default = MockUpdateRequest;
});