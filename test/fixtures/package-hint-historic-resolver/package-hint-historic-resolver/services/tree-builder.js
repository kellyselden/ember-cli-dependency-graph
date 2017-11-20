define('package-hint-historic-resolver/services/tree-builder', ['exports', 'ember-concurrency', 'ember-computed-decorators', 'ember-awesome-macros/promise', 'package-hint-historic-resolver/utils/normalize-dependencies', 'package-hint-historic-resolver/utils/merge-modules', 'package-hint-historic-resolver/utils/get-real-version'], function (exports, _emberConcurrency, _emberComputedDecorators, _promise, _normalizeDependencies, _mergeModules, _getRealVersion) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

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

  var Service = Ember.Service;
  var service = Ember.inject.service;
  var or = Ember.computed.or;
  var not = Ember.computed.not;
  var EmberObject = Ember.Object;
  var setProperties = Ember.setProperties;
  var set = Ember.set;
  var get = Ember.get;
  var merge = Ember.merge;


  var groups = [['Dependencies', 'dependencies'], ['Dev Dependencies', 'devDependencies'], ['Optional Dependencies', 'optionalDependencies']];

  exports.default = Service.extend({
    task: service(),

    getDependencyGroups: function getDependencyGroups(_ref) {
      var _this = this;

      var firstJson = _ref.firstJson,
          secondJson = _ref.secondJson,
          repoWorkingDate = _ref.repoWorkingDate,
          repoBrokenDate = _ref.repoBrokenDate;

      // we are creating new dependency objects
      // so cancel all the promises that set values on the old dependency objects
      this.cancelAll();

      var dependencyGroups = groups.map(function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
            title = _ref3[0],
            prop = _ref3[1];

        var firstDependencies = (0, _normalizeDependencies.default)(firstJson[prop]);
        var secondDependencies = (0, _normalizeDependencies.default)(secondJson[prop]);

        var dependencies = _this._getDependencies({
          firstDependencies: firstDependencies,
          secondDependencies: secondDependencies,
          repoWorkingDate: repoWorkingDate,
          repoBrokenDate: repoBrokenDate
        });

        var dependencyGroup = EmberObject.create({
          title: title,
          dependencies: dependencies
        });

        _this.setupComputeds(dependencyGroup, false);

        return dependencyGroup;
      }).filter(function (dependencyGroup) {
        return get(dependencyGroup, 'dependencies').length;
      });

      return dependencyGroups;
    },
    _getDependencies: function _getDependencies(_ref4) {
      var firstDependencies = _ref4.firstDependencies,
          secondDependencies = _ref4.secondDependencies,
          repoWorkingDate = _ref4.repoWorkingDate,
          repoBrokenDate = _ref4.repoBrokenDate;

      var dependencies = (0, _mergeModules.default)(firstDependencies, secondDependencies);

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = dependencies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var dependency = _step.value;

          this._setupVersions(dependency, repoWorkingDate, repoBrokenDate);

          setProperties(dependency, {
            dependencies: (0, _promise.array)('_nestedDependenciesPromiseCaught')
          });

          this.setupComputeds(dependency);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return dependencies;
    },
    _setupVersions: function _setupVersions(dependency, repoWorkingDate, repoBrokenDate) {
      var task = get(this, '_setupVersionsTask');
      setProperties(dependency, {
        versionsPromise: task.perform(dependency, repoWorkingDate, repoBrokenDate)
      });

      this._setupDependencies(dependency, repoWorkingDate, repoBrokenDate);
    },


    _setupVersionsTask: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dependency, repoWorkingDate, repoBrokenDate) {
      var module, firstVersionHint, secondVersionHint, versions, firstVersion, secondVersion;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              module = get(dependency, 'module');
              firstVersionHint = get(dependency, 'firstVersionHint');
              secondVersionHint = get(dependency, 'secondVersionHint');
              versions = void 0;
              _context.prev = 4;
              _context.next = 7;
              return get(this, 'task.getVersions').perform(module);

            case 7:
              versions = _context.sent;
              _context.next = 14;
              break;

            case 10:
              _context.prev = 10;
              _context.t0 = _context['catch'](4);

              set(dependency, 'versionsError', _context.t0.errorThrown);

              return _context.abrupt('return', true);

            case 14:
              firstVersion = (0, _getRealVersion.default)(firstVersionHint, versions, repoWorkingDate);
              secondVersion = (0, _getRealVersion.default)(secondVersionHint, versions, repoBrokenDate);


              setProperties(dependency, {
                firstVersion: firstVersion,
                secondVersion: secondVersion,
                isFirstVersionMissing: not('firstVersion'),
                isSecondVersionMissing: not('secondVersion'),
                isOneMissing: or('isFirstVersionMissing', 'isSecondVersionMissing')
              });

              this._checkForCircularReference(dependency, 'firstVersion', 'hasFirstCircularReference');
              this._checkForCircularReference(dependency, 'secondVersion', 'hasSecondCircularReference');

              return _context.abrupt('return', false);

            case 20:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[4, 10]]);
    })),

    _checkForCircularReference: function _checkForCircularReference(dependency, versionProp, hasCircularReferenceProp) {
      var module = get(dependency, 'module');
      var version = get(dependency, versionProp);
      var parent = get(dependency, 'parent');
      while (parent) {
        var parentModule = get(parent, 'module');
        var parentVersion = get(parent, versionProp);
        if (parentModule == module && parentVersion == version) {
          set(dependency, hasCircularReferenceProp, true);

          break;
        }

        parent = get(parent, 'parent');
      }
    },
    _setupDependencies: function _setupDependencies(dependency, repoWorkingDate, repoBrokenDate) {
      var task = get(this, '_setupDependenciesTask');
      var nestedDependenciesPromise = task.perform(dependency, repoWorkingDate, repoBrokenDate);

      setProperties(dependency, {
        nestedDependenciesPromise: nestedDependenciesPromise,
        _nestedDependenciesPromiseCaught: nestedDependenciesPromise.catch(function () {
          // catch means task was canceled, return empty array to continue
          return [];
        })
      });
    },


    _setupDependenciesTask: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(dependency, repoWorkingDate, repoBrokenDate) {
      var wasErrorThrown, task, firstDependencies, secondDependencies;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return get(dependency, 'versionsPromise');

            case 2:
              wasErrorThrown = _context2.sent;

              if (!wasErrorThrown) {
                _context2.next = 5;
                break;
              }

              return _context2.abrupt('return');

            case 5:
              task = get(this, 'getDependenciesTask');
              _context2.next = 8;
              return task.perform(dependency, 'firstVersion', 'firstDependenciesError', 'hasFirstCircularReference');

            case 8:
              firstDependencies = _context2.sent;
              _context2.next = 11;
              return task.perform(dependency, 'secondVersion', 'secondDependenciesError', 'hasSecondCircularReference');

            case 11:
              secondDependencies = _context2.sent;
              return _context2.abrupt('return', this._getNestedDependencies({
                firstDependencies: firstDependencies,
                secondDependencies: secondDependencies,
                repoWorkingDate: repoWorkingDate,
                repoBrokenDate: repoBrokenDate,
                parentDependency: dependency
              }));

            case 13:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    })),

    getDependenciesTask: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(dependency, versionProp, errorProp, hasCircularReferenceProp) {
      var dependencies, hasCircularReference, module, version;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              dependencies = void 0;
              hasCircularReference = get(dependency, hasCircularReferenceProp);

              if (!hasCircularReference) {
                _context3.next = 6;
                break;
              }

              dependencies = [];
              _context3.next = 21;
              break;

            case 6:
              module = get(dependency, 'module');
              version = get(dependency, versionProp);

              // missing from either side

              if (version) {
                _context3.next = 12;
                break;
              }

              dependencies = [];
              _context3.next = 21;
              break;

            case 12:
              _context3.prev = 12;
              _context3.next = 15;
              return get(this, 'task.getDependencies').perform(module, version);

            case 15:
              dependencies = _context3.sent;
              _context3.next = 21;
              break;

            case 18:
              _context3.prev = 18;
              _context3.t0 = _context3['catch'](12);

              set(dependency, errorProp, _context3.t0.errorThrown);

            case 21:
              return _context3.abrupt('return', dependencies);

            case 22:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this, [[12, 18]]);
    })),

    _getNestedDependencies: function _getNestedDependencies(_ref5) {
      var firstDependencies = _ref5.firstDependencies,
          secondDependencies = _ref5.secondDependencies,
          repoWorkingDate = _ref5.repoWorkingDate,
          repoBrokenDate = _ref5.repoBrokenDate,
          parentDependency = _ref5.parentDependency;

      // error or cancel
      if (!firstDependencies || !secondDependencies) {
        return [];
      }

      var dependencies = this._getDependencies({
        firstDependencies: firstDependencies,
        secondDependencies: secondDependencies,
        repoWorkingDate: repoWorkingDate,
        repoBrokenDate: repoBrokenDate
      });

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = dependencies[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var dependency = _step2.value;

          set(dependency, 'parent', parentDependency);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return dependencies;
    },
    setupComputeds: function setupComputeds(dependency) {
      var _dec, _dec2, _dec3, _desc, _value, _obj;

      var shouldSetupVersions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var props = (_dec = (0, _emberComputedDecorators.default)('firstVersion', 'secondVersion'), _dec2 = (0, _emberComputedDecorators.default)('isSomethingWrong', 'dependencies.@each.numberOfDifferences'), _dec3 = (0, _emberComputedDecorators.default)('dependencies.@each.isDoneCrawling'), (_obj = {
        areVersionsDifferent: function areVersionsDifferent(firstVersion, secondVersion) {
          if (!firstVersion || !secondVersion) {
            return false;
          }

          return firstVersion !== secondVersion;
        },
        numberOfDifferences: function numberOfDifferences(isSomethingWrong, dependencies) {
          var initialValue = isSomethingWrong ? 1 : 0;

          if (get(dependencies, 'promise') && !get(dependencies, 'isFulfilled')) {
            return initialValue;
          }

          var numberOfDifferences = dependencies.reduce(function (previousValue, currentValue) {
            return previousValue + get(currentValue, 'numberOfDifferences');
          }, initialValue);

          return numberOfDifferences;
        },
        isDoneCrawling: function isDoneCrawling(dependencies) {
          if (get(dependencies, 'promise') && !get(dependencies, 'isFulfilled')) {
            return false;
          }

          var areChildrenDoneCrawling = !dependencies.filterBy('isDoneCrawling', false).length;
          var stopCrawling = get(this, 'stopCrawling');

          return areChildrenDoneCrawling && !stopCrawling;
        }
      }, (_applyDecoratedDescriptor(_obj, 'areVersionsDifferent', [_dec], Object.getOwnPropertyDescriptor(_obj, 'areVersionsDifferent'), _obj), _applyDecoratedDescriptor(_obj, 'numberOfDifferences', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'numberOfDifferences'), _obj), _applyDecoratedDescriptor(_obj, 'isDoneCrawling', [_dec3], Object.getOwnPropertyDescriptor(_obj, 'isDoneCrawling'), _obj)), _obj));

      if (shouldSetupVersions) {
        merge(props, {
          isFirstVersionHintMissing: not('firstVersionHint'),
          isSecondVersionHintMissing: not('secondVersionHint'),
          isOneHintMissing: or('isFirstVersionHintMissing', 'isSecondVersionHintMissing'),
          isSomethingWrong: or('isOneMissing', 'areVersionsDifferent')
        });
      }

      setProperties(dependency, props);
    },
    cancelAll: function cancelAll() {
      get(this, '_setupVersionsTask').cancelAll();
      get(this, '_setupDependenciesTask').cancelAll();
    },
    restartAll: function restartAll(dependency, repoWorkingDate, repoBrokenDate) {
      var _this2 = this;

      var versionsPromise = get(dependency, 'versionsPromise');
      var nestedDependenciesPromise = get(dependency, 'nestedDependenciesPromise');

      if (versionsPromise && get(versionsPromise, 'isCanceled')) {
        this._setupVersions(dependency, repoWorkingDate, repoBrokenDate);
      } else if (nestedDependenciesPromise && get(nestedDependenciesPromise, 'isCanceled')) {
        this._setupDependencies(dependency, repoWorkingDate, repoBrokenDate);
      } else {
        get(dependency, 'dependencies').forEach(function (dependency) {
          _this2.restartAll.call(_this2, dependency, repoWorkingDate, repoBrokenDate);
        });
      }
    }
  });
});