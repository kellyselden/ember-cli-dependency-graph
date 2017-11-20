define('travis/helpers/format-message', ['exports', 'travis/config/environment'], function (exports, _environment) {
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

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var helper = Ember.Helper.helper;
  var htmlSafe = Ember.String.htmlSafe;
  var get = Ember.get;


  var emojiConvertor = new EmojiConvertor();

  emojiConvertor.img_sets.apple.path = _environment.default.emojiPrepend + '/images/emoji/';
  emojiConvertor.include_title = true;

  function formatMessage(message, options) {
    message = message || '';
    if (options.short) {
      message = message.split(/\n/)[0];
    }
    message = emojiConvertor.replace_colons(_escape(message));

    // TODO: Figure out more permanent fix for teal #1885
    if (options.repo) {
      var owner = get(options.repo, 'owner');
      if ((typeof owner === 'undefined' ? 'undefined' : _typeof(owner)) === 'object') {
        owner = owner.login;
      }
      message = githubify(message, owner, get(options.repo, 'name'));
    }
    if (options.pre) {
      message = message.replace(/\n/g, '<br/>');
    }
    if (options.eventType && options.eventType == 'cron') {
      message = htmlSafe('<span class=\'message-label badge\'>cron</span> ' + message);
    }
    return message;
  }

  var refRegexp = new RegExp('([\\w-]+)?\\/?([\\w-]+)?(?:#|gh-)(\\d+)', 'g');
  var userRegexp = new RegExp('\\B@([\\w-]+)', 'g');
  var commitRegexp = new RegExp('([\\w-]+)?\\/([\\w-]+)?@([0-9A-Fa-f]+)', 'g');

  function githubify(text, owner, repo) {
    text = text.replace(refRegexp, function (ref, matchedOwner, matchedRepo, matchedNumber) {
      var current = { owner: owner, repo: repo };
      var matched = {
        owner: matchedOwner,
        repo: matchedRepo,
        number: matchedNumber
      };
      return _githubReferenceLink(ref, current, matched);
    });

    text = text.replace(userRegexp, function (reference, username) {
      return _githubUserLink(reference, username);
    });

    text = text.replace(commitRegexp, function (reference, matchedOwner, matchedRepo, matchedSHA) {
      var current = { owner: owner, repo: repo };
      var matched = {
        owner: matchedOwner,
        repo: matchedRepo,
        sha: matchedSHA
      };
      return _githubCommitReferenceLink(reference, current, matched);
    });
    return text;
  }

  function _githubReferenceLink(reference, current, matched) {
    var owner = void 0,
        repo = void 0;
    owner = matched.owner || current.owner;
    repo = matched.repo || current.repo;

    var href = _environment.default.sourceEndpoint + '/' + owner + '/' + repo + '/issues/' + matched.number;
    return '<a href="' + href + '">' + reference + '</a>';
  }

  function _githubUserLink(reference, username) {
    return '<a href="' + _environment.default.sourceEndpoint + '/' + username + '">' + reference + '</a>';
  }

  function _githubCommitReferenceLink(reference, current, matched) {
    var owner = void 0,
        repo = void 0,
        url = void 0;
    owner = matched.owner || current.owner;
    repo = matched.repo || current.repo;
    var slug = owner + '/' + repo;
    // TODO: this duplicated the implementation of the githubCommit method
    // in the urls service, but I didn't want to try and rewrite this entire file
    url = _environment.default.sourceEndpoint + '/' + slug + '/commit/' + matched.sha;
    return '<a href="' + url + '">' + reference + '</a>';
  }

  function _escape(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  exports.default = helper(function (params, hash) {
    var _params = _slicedToArray(params, 1),
        message = _params[0];

    var formatted = formatMessage(message, hash);
    return new htmlSafe(formatted);
  });
});