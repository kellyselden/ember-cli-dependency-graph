define('ember-data-factory-guy/mocks/mock-find-all-request', ['exports', 'ember-data-factory-guy/utils/helper-functions', 'ember-data-factory-guy/mocks/mock-get-request'], function (exports, _helperFunctions, _mockGetRequest) {
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

  var MockFindAllRequest = function (_MockGetRequest) {
    _inherits(MockFindAllRequest, _MockGetRequest);

    function MockFindAllRequest(modelName) {
      _classCallCheck(this, MockFindAllRequest);

      var _this = _possibleConstructorReturn(this, (MockFindAllRequest.__proto__ || Object.getPrototypeOf(MockFindAllRequest)).call(this, modelName, 'findAll', []));

      _this.setValidReturnsKeys(['models', 'json', 'ids', 'headers']);
      return _this;
    }

    /**
      findAll url is same as query url, so to make sure that the mockFindAll does
      not match a mockQuery ( with parameters ), declare that this is not a match
      if request params ( settings.data ) are present
       The issue arises when mockFindAll is setup before mockQuery
      @see https://github.com/danielspaniel/ember-data-factory-guy/issues/298
       @param settings ajax settings
      @returns {boolean}
     */


    _createClass(MockFindAllRequest, [{
      key: 'paramsMatch',
      value: function paramsMatch(settings) {
        return (0, _helperFunctions.isEmptyObject)(settings.data);
      }
    }]);

    return MockFindAllRequest;
  }(_mockGetRequest.default);

  exports.default = MockFindAllRequest;
});