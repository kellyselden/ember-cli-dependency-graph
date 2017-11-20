define('ember-data-factory-guy/mocks/mock-query-request', ['exports', 'ember-data-factory-guy/mocks/mock-get-request'], function (exports, _mockGetRequest) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

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

  var MockQueryRequest = function (_MockGetRequest) {
    _inherits(MockQueryRequest, _MockGetRequest);

    /**
     * By default this query will return a payload of [] or empty array
     *
     * @param modelName
     * @param queryParams
     */
    function MockQueryRequest(modelName) {
      var queryParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, MockQueryRequest);

      var _this = _possibleConstructorReturn(this, (MockQueryRequest.__proto__ || Object.getPrototypeOf(MockQueryRequest)).call(this, modelName, 'query', []));

      _this.setValidReturnsKeys(['models', 'json', 'ids', 'headers']);
      _this.queryParams = queryParams;
      return _this;
    }

    return MockQueryRequest;
  }(_mockGetRequest.default);

  exports.default = MockQueryRequest;
});