(function () {
'use strict';

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

/* !
 * Chai - checkError utility
 * Copyright(c) 2012-2016 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### .checkError
 *
 * Checks that an error conforms to a given set of criteria and/or retrieves information about it.
 *
 * @api public
 */

/**
 * ### .compatibleInstance(thrown, errorLike)
 *
 * Checks if two instances are compatible (strict equal).
 * Returns false if errorLike is not an instance of Error, because instances
 * can only be compatible if they're both error instances.
 *
 * @name compatibleInstance
 * @param {Error} thrown error
 * @param {Error|ErrorConstructor} errorLike object to compare against
 * @namespace Utils
 * @api public
 */

function compatibleInstance(thrown, errorLike) {
  return errorLike instanceof Error && thrown === errorLike;
}

/**
 * ### .compatibleConstructor(thrown, errorLike)
 *
 * Checks if two constructors are compatible.
 * This function can receive either an error constructor or
 * an error instance as the `errorLike` argument.
 * Constructors are compatible if they're the same or if one is
 * an instance of another.
 *
 * @name compatibleConstructor
 * @param {Error} thrown error
 * @param {Error|ErrorConstructor} errorLike object to compare against
 * @namespace Utils
 * @api public
 */

function compatibleConstructor(thrown, errorLike) {
  if (errorLike instanceof Error) {
    // If `errorLike` is an instance of any error we compare their constructors
    return thrown.constructor === errorLike.constructor || thrown instanceof errorLike.constructor;
  } else if (errorLike.prototype instanceof Error || errorLike === Error) {
    // If `errorLike` is a constructor that inherits from Error, we compare `thrown` to `errorLike` directly
    return thrown.constructor === errorLike || thrown instanceof errorLike;
  }

  return false;
}

/**
 * ### .compatibleMessage(thrown, errMatcher)
 *
 * Checks if an error's message is compatible with a matcher (String or RegExp).
 * If the message contains the String or passes the RegExp test,
 * it is considered compatible.
 *
 * @name compatibleMessage
 * @param {Error} thrown error
 * @param {String|RegExp} errMatcher to look for into the message
 * @namespace Utils
 * @api public
 */

function compatibleMessage(thrown, errMatcher) {
  var comparisonString = typeof thrown === 'string' ? thrown : thrown.message;
  if (errMatcher instanceof RegExp) {
    return errMatcher.test(comparisonString);
  } else if (typeof errMatcher === 'string') {
    return comparisonString.indexOf(errMatcher) !== -1; // eslint-disable-line no-magic-numbers
  }

  return false;
}

/**
 * ### .getFunctionName(constructorFn)
 *
 * Returns the name of a function.
 * This also includes a polyfill function if `constructorFn.name` is not defined.
 *
 * @name getFunctionName
 * @param {Function} constructorFn
 * @namespace Utils
 * @api private
 */

var functionNameMatch = /\s*function(?:\s|\s*\/\*[^(?:*\/)]+\*\/\s*)*([^\(\/]+)/;
function getFunctionName(constructorFn) {
  var name = '';
  if (typeof constructorFn.name === 'undefined') {
    // Here we run a polyfill if constructorFn.name is not defined
    var match = String(constructorFn).match(functionNameMatch);
    if (match) {
      name = match[1];
    }
  } else {
    name = constructorFn.name;
  }

  return name;
}

/**
 * ### .getConstructorName(errorLike)
 *
 * Gets the constructor name for an Error instance or constructor itself.
 *
 * @name getConstructorName
 * @param {Error|ErrorConstructor} errorLike
 * @namespace Utils
 * @api public
 */

function getConstructorName(errorLike) {
  var constructorName = errorLike;
  if (errorLike instanceof Error) {
    constructorName = getFunctionName(errorLike.constructor);
  } else if (typeof errorLike === 'function') {
    // If `err` is not an instance of Error it is an error constructor itself or another function.
    // If we've got a common function we get its name, otherwise we may need to create a new instance
    // of the error just in case it's a poorly-constructed error. Please see chaijs/chai/issues/45 to know more.
    constructorName = getFunctionName(errorLike).trim() || getFunctionName(new errorLike()); // eslint-disable-line new-cap
  }

  return constructorName;
}

/**
 * ### .getMessage(errorLike)
 *
 * Gets the error message from an error.
 * If `err` is a String itself, we return it.
 * If the error has no message, we return an empty string.
 *
 * @name getMessage
 * @param {Error|String} errorLike
 * @namespace Utils
 * @api public
 */

function getMessage(errorLike) {
  var msg = '';
  if (errorLike && errorLike.message) {
    msg = errorLike.message;
  } else if (typeof errorLike === 'string') {
    msg = errorLike;
  }

  return msg;
}

var checkError = {
  compatibleInstance: compatibleInstance,
  compatibleConstructor: compatibleConstructor,
  compatibleMessage: compatibleMessage,
  getMessage: getMessage,
  getConstructorName: getConstructorName
};

var chaiAsPromised = createCommonjsModule(function (module) {
    "use strict";
    /* eslint-disable no-invalid-this */

    var checkError$$1 = checkError;

    module.exports = function (chai, utils) {
        var Assertion = chai.Assertion;
        var assert = chai.assert;
        var proxify = utils.proxify;

        // If we are using a version of Chai that has checkError on it,
        // we want to use that version to be consistent. Otherwise, we use
        // what was passed to the factory.
        if (utils.checkError) {
            checkError$$1 = utils.checkError;
        }

        function isLegacyJQueryPromise(thenable) {
            // jQuery promises are Promises/A+-compatible since 3.0.0. jQuery 3.0.0 is also the first version
            // to define the catch method.
            return typeof thenable.catch !== "function" && typeof thenable.always === "function" && typeof thenable.done === "function" && typeof thenable.fail === "function" && typeof thenable.pipe === "function" && typeof thenable.progress === "function" && typeof thenable.state === "function";
        }

        function assertIsAboutPromise(assertion) {
            if (typeof assertion._obj.then !== "function") {
                throw new TypeError(utils.inspect(assertion._obj) + " is not a thenable.");
            }
            if (isLegacyJQueryPromise(assertion._obj)) {
                throw new TypeError("Chai as Promised is incompatible with thenables of jQuery<3.0.0, sorry! Please " + "upgrade jQuery or use another Promises/A+ compatible library (see " + "http://promisesaplus.com/).");
            }
        }

        function proxifyIfSupported(assertion) {
            return proxify === undefined ? assertion : proxify(assertion);
        }

        function method(name, asserter) {
            utils.addMethod(Assertion.prototype, name, function () {
                assertIsAboutPromise(this);
                return asserter.apply(this, arguments);
            });
        }

        function property(name, asserter) {
            utils.addProperty(Assertion.prototype, name, function () {
                assertIsAboutPromise(this);
                return proxifyIfSupported(asserter.apply(this, arguments));
            });
        }

        function doNotify(promise, done) {
            promise.then(function () {
                return done();
            }, done);
        }

        // These are for clarity and to bypass Chai refusing to allow `undefined` as actual when used with `assert`.
        function assertIfNegated(assertion, message, extra) {
            assertion.assert(true, null, message, extra.expected, extra.actual);
        }

        function assertIfNotNegated(assertion, message, extra) {
            assertion.assert(false, message, null, extra.expected, extra.actual);
        }

        function getBasePromise(assertion) {
            // We need to chain subsequent asserters on top of ones in the chain already (consider
            // `eventually.have.property("foo").that.equals("bar")`), only running them after the existing ones pass.
            // So the first base-promise is `assertion._obj`, but after that we use the assertions themselves, i.e.
            // previously derived promises, to chain off of.
            return typeof assertion.then === "function" ? assertion : assertion._obj;
        }

        function getReasonName(reason) {
            return reason instanceof Error ? reason.toString() : checkError$$1.getConstructorName(reason);
        }

        // Grab these first, before we modify `Assertion.prototype`.

        var propertyNames = Object.getOwnPropertyNames(Assertion.prototype);

        var propertyDescs = {};
        for (var _iterator = propertyNames, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
            var _ref;

            if (_isArray) {
                if (_i >= _iterator.length) break;
                _ref = _iterator[_i++];
            } else {
                _i = _iterator.next();
                if (_i.done) break;
                _ref = _i.value;
            }

            var name = _ref;

            propertyDescs[name] = Object.getOwnPropertyDescriptor(Assertion.prototype, name);
        }

        property("fulfilled", function () {
            var _this = this;

            var derivedPromise = getBasePromise(this).then(function (value) {
                assertIfNegated(_this, "expected promise not to be fulfilled but it was fulfilled with #{act}", { actual: value });
                return value;
            }, function (reason) {
                assertIfNotNegated(_this, "expected promise to be fulfilled but it was rejected with #{act}", { actual: getReasonName(reason) });
                return reason;
            });

            module.exports.transferPromiseness(this, derivedPromise);
            return this;
        });

        property("rejected", function () {
            var _this2 = this;

            var derivedPromise = getBasePromise(this).then(function (value) {
                assertIfNotNegated(_this2, "expected promise to be rejected but it was fulfilled with #{act}", { actual: value });
                return value;
            }, function (reason) {
                assertIfNegated(_this2, "expected promise not to be rejected but it was rejected with #{act}", { actual: getReasonName(reason) });

                // Return the reason, transforming this into a fulfillment, to allow further assertions, e.g.
                // `promise.should.be.rejected.and.eventually.equal("reason")`.
                return reason;
            });

            module.exports.transferPromiseness(this, derivedPromise);
            return this;
        });

        method("rejectedWith", function (errorLike, errMsgMatcher, message) {
            var _this3 = this;

            var errorLikeName = null;
            var negate = utils.flag(this, "negate") || false;

            // rejectedWith with that is called without arguments is
            // the same as a plain ".rejected" use.
            if (errorLike === undefined && errMsgMatcher === undefined && message === undefined) {
                /* eslint-disable no-unused-expressions */
                return this.rejected;
                /* eslint-enable no-unused-expressions */
            }

            if (message !== undefined) {
                utils.flag(this, "message", message);
            }

            if (errorLike instanceof RegExp || typeof errorLike === "string") {
                errMsgMatcher = errorLike;
                errorLike = null;
            } else if (errorLike && errorLike instanceof Error) {
                errorLikeName = errorLike.toString();
            } else if (typeof errorLike === "function") {
                errorLikeName = checkError$$1.getConstructorName(errorLike);
            } else {
                errorLike = null;
            }
            var everyArgIsDefined = Boolean(errorLike && errMsgMatcher);

            var matcherRelation = "including";
            if (errMsgMatcher instanceof RegExp) {
                matcherRelation = "matching";
            }

            var derivedPromise = getBasePromise(this).then(function (value) {
                var assertionMessage = null;
                var expected = null;

                if (errorLike) {
                    assertionMessage = "expected promise to be rejected with #{exp} but it was fulfilled with #{act}";
                    expected = errorLikeName;
                } else if (errMsgMatcher) {
                    assertionMessage = 'expected promise to be rejected with an error ' + matcherRelation + ' #{exp} but ' + 'it was fulfilled with #{act}';
                    expected = errMsgMatcher;
                }

                assertIfNotNegated(_this3, assertionMessage, { expected: expected, actual: value });
                return value;
            }, function (reason) {
                var errorLikeCompatible = errorLike && (errorLike instanceof Error ? checkError$$1.compatibleInstance(reason, errorLike) : checkError$$1.compatibleConstructor(reason, errorLike));

                var errMsgMatcherCompatible = errMsgMatcher && checkError$$1.compatibleMessage(reason, errMsgMatcher);

                var reasonName = getReasonName(reason);

                if (negate && everyArgIsDefined) {
                    if (errorLikeCompatible && errMsgMatcherCompatible) {
                        _this3.assert(true, null, "expected promise not to be rejected with #{exp} but it was rejected " + "with #{act}", errorLikeName, reasonName);
                    }
                } else {
                    if (errorLike) {
                        _this3.assert(errorLikeCompatible, "expected promise to be rejected with #{exp} but it was rejected with #{act}", "expected promise not to be rejected with #{exp} but it was rejected " + "with #{act}", errorLikeName, reasonName);
                    }

                    if (errMsgMatcher) {
                        _this3.assert(errMsgMatcherCompatible, 'expected promise to be rejected with an error ' + matcherRelation + ' #{exp} but got ' + '#{act}', 'expected promise not to be rejected with an error ' + matcherRelation + ' #{exp}', errMsgMatcher, checkError$$1.getMessage(reason));
                    }
                }

                return reason;
            });

            module.exports.transferPromiseness(this, derivedPromise);
            return this;
        });

        property("eventually", function () {
            utils.flag(this, "eventually", true);
            return this;
        });

        method("notify", function (done) {
            doNotify(getBasePromise(this), done);
            return this;
        });

        method("become", function (value, message) {
            return this.eventually.deep.equal(value, message);
        });

        // ### `eventually`

        // We need to be careful not to trigger any getters, thus `Object.getOwnPropertyDescriptor` usage.
        var methodNames = propertyNames.filter(function (name) {
            return name !== "assert" && typeof propertyDescs[name].value === "function";
        });

        methodNames.forEach(function (methodName) {
            Assertion.overwriteMethod(methodName, function (originalMethod) {
                return function () {
                    return doAsserterAsyncAndAddThen(originalMethod, this, arguments);
                };
            });
        });

        var getterNames = propertyNames.filter(function (name) {
            return name !== "_obj" && typeof propertyDescs[name].get === "function";
        });

        getterNames.forEach(function (getterName) {
            // Chainable methods are things like `an`, which can work both for `.should.be.an.instanceOf` and as
            // `should.be.an("object")`. We need to handle those specially.
            var isChainableMethod = Assertion.prototype.__methods.hasOwnProperty(getterName);

            if (isChainableMethod) {
                Assertion.overwriteChainableMethod(getterName, function (originalMethod) {
                    return function () {
                        return doAsserterAsyncAndAddThen(originalMethod, this, arguments);
                    };
                }, function (originalGetter) {
                    return function () {
                        return doAsserterAsyncAndAddThen(originalGetter, this);
                    };
                });
            } else {
                Assertion.overwriteProperty(getterName, function (originalGetter) {
                    return function () {
                        return proxifyIfSupported(doAsserterAsyncAndAddThen(originalGetter, this));
                    };
                });
            }
        });

        function doAsserterAsyncAndAddThen(asserter, assertion, args) {
            // Since we're intercepting all methods/properties, we need to just pass through if they don't want
            // `eventually`, or if we've already fulfilled the promise (see below).
            if (!utils.flag(assertion, "eventually")) {
                asserter.apply(assertion, args);
                return assertion;
            }

            var derivedPromise = getBasePromise(assertion).then(function (value) {
                // Set up the environment for the asserter to actually run: `_obj` should be the fulfillment value, and
                // now that we have the value, we're no longer in "eventually" mode, so we won't run any of this code,
                // just the base Chai code that we get to via the short-circuit above.
                assertion._obj = value;
                utils.flag(assertion, "eventually", false);

                return args ? module.exports.transformAsserterArgs(args) : args;
            }).then(function (newArgs) {
                asserter.apply(assertion, newArgs);

                // Because asserters, for example `property`, can change the value of `_obj` (i.e. change the "object"
                // flag), we need to communicate this value change to subsequent chained asserters. Since we build a
                // promise chain paralleling the asserter chain, we can use it to communicate such changes.
                return assertion._obj;
            });

            module.exports.transferPromiseness(assertion, derivedPromise);
            return assertion;
        }

        // ### Now use the `Assertion` framework to build an `assert` interface.
        var originalAssertMethods = Object.getOwnPropertyNames(assert).filter(function (propName) {
            return typeof assert[propName] === "function";
        });

        assert.isFulfilled = function (promise, message) {
            return new Assertion(promise, message).to.be.fulfilled;
        };

        assert.isRejected = function (promise, errorLike, errMsgMatcher, message) {
            var assertion = new Assertion(promise, message);
            return assertion.to.be.rejectedWith(errorLike, errMsgMatcher, message);
        };

        assert.becomes = function (promise, value, message) {
            return assert.eventually.deepEqual(promise, value, message);
        };

        assert.doesNotBecome = function (promise, value, message) {
            return assert.eventually.notDeepEqual(promise, value, message);
        };

        assert.eventually = {};
        originalAssertMethods.forEach(function (assertMethodName) {
            assert.eventually[assertMethodName] = function (promise) {
                var otherArgs = Array.prototype.slice.call(arguments, 1);

                var customRejectionHandler = void 0;
                var message = arguments[assert[assertMethodName].length - 1];
                if (typeof message === "string") {
                    customRejectionHandler = function customRejectionHandler(reason) {
                        throw new chai.AssertionError(message + '\n\nOriginal reason: ' + utils.inspect(reason));
                    };
                }

                var returnedPromise = promise.then(function (fulfillmentValue) {
                    return assert[assertMethodName].apply(assert, [fulfillmentValue].concat(otherArgs));
                }, customRejectionHandler);

                returnedPromise.notify = function (done) {
                    doNotify(returnedPromise, done);
                };

                return returnedPromise;
            };
        });
    };

    module.exports.transferPromiseness = function (assertion, promise) {
        assertion.then = promise.then.bind(promise);
    };

    module.exports.transformAsserterArgs = function (values) {
        return values;
    };
});

window.chai.use(chaiAsPromised);

}());
