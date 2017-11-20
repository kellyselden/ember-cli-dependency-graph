define('ember-data-factory-guy/mocks/mock-query-record-request', ['exports', 'ember-data-factory-guy/mocks/mock-get-request'], function (exports, _mockGetRequest) {
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

  var MockQueryRecordRequest = function (_MockGetRequest) {
    _inherits(MockQueryRecordRequest, _MockGetRequest);

    /**
     * By default this query will return a payload of 'null' or no result
     * 
     * @param modelName
     * @param queryParams
     */
    function MockQueryRecordRequest(modelName) {
      var queryParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, MockQueryRecordRequest);

      var _this = _possibleConstructorReturn(this, (MockQueryRecordRequest.__proto__ || Object.getPrototypeOf(MockQueryRecordRequest)).call(this, modelName, 'queryRecord', null));

      //    this.setResponseJson(this.fixtureBuilder.convertForBuild(modelName, null));
      _this.setValidReturnsKeys(['model', 'json', 'id', 'headers']);
      _this.queryParams = queryParams;
      return _this;
    }

    return MockQueryRecordRequest;
  }(_mockGetRequest.default);

  exports.default = MockQueryRecordRequest;
});