define('ember-data-factory-guy/mocks/mock-find-record-request', ['exports', 'ember-data-factory-guy', 'ember-data-factory-guy/mocks/mock-get-request'], function (exports, _emberDataFactoryGuy, _mockGetRequest) {
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

  var MockFindRecordRequest = function (_MockGetRequest) {
    _inherits(MockFindRecordRequest, _MockGetRequest);

    function MockFindRecordRequest(modelName) {
      _classCallCheck(this, MockFindRecordRequest);

      var _this = _possibleConstructorReturn(this, (MockFindRecordRequest.__proto__ || Object.getPrototypeOf(MockFindRecordRequest)).call(this, modelName, 'findRecord'));

      _this.setValidReturnsKeys(['model', 'json', 'id', 'headers']);
      return _this;
    }

    /**
     * When using returns({id: id}), this is flagged as an idSearch, so
     * that at the last moment when mockjax is handling the request,
     * we can check the store and see if a model with that id exists.
     *
     * If not, then this will be a 404 not found error
     *
     * @param settings
     * @returns {*}
     */


    _createClass(MockFindRecordRequest, [{
      key: 'extraRequestMatches',
      value: function extraRequestMatches(settings) {
        if (this.idSearch) {
          var model = _emberDataFactoryGuy.default.store.peekRecord(this.modelName, this.get('id'));
          if (!model) {
            // the match still succeeds but the response is failure
            this.fails({ status: 404 });
          }
        }
        return _get(MockFindRecordRequest.prototype.__proto__ || Object.getPrototypeOf(MockFindRecordRequest.prototype), 'extraRequestMatches', this).call(this, settings);
      }
    }]);

    return MockFindRecordRequest;
  }(_mockGetRequest.default);

  exports.default = MockFindRecordRequest;
});