define('travis/mirage/serializers/repository', ['exports', 'travis/mirage/serializers/v3'], function (exports, _v) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

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

  exports.default = _v.default.extend({
    serializeSingle: function serializeSingle(repository) {
      this.fixOwnerAndName(repository);

      if (!repository.defaultBranch && repository.branches) {
        var defaultBranch = repository.branches.models.find(function (branch) {
          return branch.default_branch;
        });
        repository.defaultBranch = defaultBranch;
      }

      if (!repository.currentBuild) {
        var builds = repository._schema.builds.where(function (build) {
          var repoId = repository.id;
          return build.repository_id === repoId || build.repositoryId == repoId;
        });

        if (builds.length) {
          repository.currentBuild = builds.models[0];
        }
      }

      return _v.default.prototype.serializeSingle.apply(this, arguments);
    },


    // In most tests we just set slug for the repo. This ensures that we return
    // also name and owner data to make the payload more similar to what we get in
    // production.
    fixOwnerAndName: function fixOwnerAndName(repository) {
      var owner = void 0,
          name = void 0,
          attrs = repository.attrs;

      if (attrs.slug) {
        var _attrs$slug$split = attrs.slug.split('/');

        var _attrs$slug$split2 = _slicedToArray(_attrs$slug$split, 2);

        owner = _attrs$slug$split2[0];
        name = _attrs$slug$split2[1];
      }

      attrs.owner = attrs.owner || {};

      if (owner && !attrs.owner.login) {
        attrs.owner.login = owner;
      }

      if (name && !attrs.name) {
        attrs.name = name;
      }
    }
  });
});