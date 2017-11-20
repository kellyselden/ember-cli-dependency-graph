define('ember-data-factory-guy/mocks/attribute-matcher', ['exports', 'ember-data-factory-guy/factory-guy', 'ember-data-factory-guy/utils/helper-functions'], function (exports, _factoryGuy, _helperFunctions) {
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

  /**
   This is a mixin used by MockUpdate and MockCreateRequest
  
   Make sure you setup the constructor in the class that uses this mixin
   to set the matchArgs variable
  
   Example:
  
   ```
   constructor(modelName, id) {
     super(modelName);
     this.matchArgs = {};
   }
   ```
  
   @param superclass
   @constructor
   */
  var AttributeMatcher = function AttributeMatcher(superclass) {
    return function (_superclass) {
      _inherits(_class, _superclass);

      function _class() {
        _classCallCheck(this, _class);

        return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
      }

      _createClass(_class, [{
        key: 'match',
        value: function match(matches) {
          this.matchArgs = matches;
          return this;
        }
      }, {
        key: 'validateReturnsOptions',
        value: function validateReturnsOptions(options) {
          var responseKeys = Object.keys(options);
          var validKey = responseKeys.length === 1 && responseKeys[0] === 'attrs';

          Ember.assert('[ember-data-factory-guy] You passed an invalid key for \n      \'returns\' function. The only valid keys is \'attrs\'. You passed these \n      keys: ' + responseKeys, validKey);
        }
      }, {
        key: 'extraRequestMatches',
        value: function extraRequestMatches(request) {
          if (this.matchArgs) {
            var requestBody = JSON.parse(request.requestBody),
                requestData = requestBody[this.modelName];
            if (typeof this.matchArgs === 'function') {
              return this.matchArgs(requestData);
            } else {
              return this.attributesMatch(requestBody);
            }
          }
          return true;
        }
      }, {
        key: 'attributesMatch',
        value: function attributesMatch(requestData) {
          var _this2 = this;

          var matchArgs = this.matchArgs;
          if ((0, _helperFunctions.isEmptyObject)(matchArgs)) {
            return true;
          }

          var builder = _factoryGuy.default.fixtureBuilder(this.modelName);

          // transform they match keys
          var matchCheckKeys = Object.keys(matchArgs).map(function (key) {
            return builder.transformKey(_this2.modelName, key);
          });
          // build the match args into a JSONPayload class
          var buildOpts = { serializeMode: true, transformKeys: true };
          var expectedData = builder.convertForBuild(this.modelName, matchArgs, buildOpts);

          // wrap request data in a JSONPayload class
          builder.wrapPayload(this.modelName, requestData);

          // success if all values match
          return matchCheckKeys.every(function (key) {
            return (0, _helperFunctions.isEquivalent)(expectedData.get(key), requestData.get(key));
          });
        }
      }]);

      return _class;
    }(superclass);
  };

  exports.default = AttributeMatcher;
});