define('ember-cli-page-object/-private/properties/visitable', ['exports', 'ember', 'ember-cli-page-object/-private/helpers', 'ember-cli-page-object/-private/execution_context'], function (exports, _ember, _emberCliPageObjectPrivateHelpers, _emberCliPageObjectPrivateExecution_context) {
  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  exports.visitable = visitable;
  var $ = _ember['default'].$;

  function fillInDynamicSegments(path, params) {
    return path.split('/').map(function (segment) {
      var match = segment.match(/^:(.+)$/);

      if (match) {
        var _match = _slicedToArray(match, 2);

        var key = _match[1];

        var value = params[key];

        if (typeof value === 'undefined') {
          throw new Error('Missing parameter for \'' + key + '\'');
        }

        // Remove dynamic segment key from params
        delete params[key];

        return value;
      }

      return segment;
    }).join('/');
  }

  function appendQueryParams(path, queryParams) {
    if (Object.keys(queryParams).length) {
      path += '?' + $.param(queryParams);
    }

    return path;
  }

  /**
   * @public
   *
   * Loads a given route.
   *
   * The resulting descriptor can be called with dynamic segments and parameters.
   *
   * @example
   *
   * const page = PageObject.create({
   *   visit: PageObject.visitable('/users')
   * });
   *
   * // visits '/users'
   * page.visit();
   *
   * @example
   *
   * const page = PageObject.create({
   *   visit: PageObject.visitable('/users/:user_id')
   * });
   *
   * // visits '/users/10'
   * page.visit({ user_id: 10 });
   *
   * @example
   *
   * const page = PageObject.create({
   *   visit: PageObject.visitable('/users')
   * });
   *
   * // visits '/users?name=john'
   * page.visit({ name: 'john' });
   *
   * @example
   *
   * const page = PageObject.create({
   *   visit: PageObject.visitable('/users/:user_id')
   * });
   *
   * // visits '/users/1?name=john'
   * page.visit({ user_id: 1, name: 'john' });
   *
   * @param {string} path - Full path of the route to visit
   * @return {Descriptor}
   *
   * @throws Will throw an error if dynamic segments are not filled
   */

  function visitable(path) {
    return {
      isDescriptor: true,

      value: function value() {
        var dynamicSegmentsAndQueryParams = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        var executionContext = (0, _emberCliPageObjectPrivateExecution_context.getExecutionContext)(this);

        executionContext.run(function (context) {
          var params = (0, _emberCliPageObjectPrivateHelpers.assign)({}, dynamicSegmentsAndQueryParams);
          var fullPath = fillInDynamicSegments(path, params);

          fullPath = appendQueryParams(fullPath, params);

          context.visit(fullPath);
        });

        return this;
      }
    };
  }
});