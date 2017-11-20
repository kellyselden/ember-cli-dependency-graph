define('liquid-fire/transitions/explode', ['exports', 'liquid-fire'], function (exports, _liquidFire) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = explode;
  var $ = Ember.$;
  var isArray = Ember.isArray;
  var A = Ember.A;
  var copy = Ember.copy;
  var guidFor = Ember.guidFor;


  // Explode is not, by itself, an animation. It exists to pull apart
  // other elements so that each of the pieces can be targeted by
  // animations.

  function explode() {
    var _this = this;

    var seenElements = {};
    var sawBackgroundPiece = false;

    for (var _len = arguments.length, pieces = Array(_len), _key = 0; _key < _len; _key++) {
      pieces[_key] = arguments[_key];
    }

    var promises = pieces.map(function (piece) {
      if (piece.matchBy) {
        return matchAndExplode(_this, piece, seenElements);
      } else if (piece.pick || piece.pickOld || piece.pickNew) {
        return explodePiece(_this, piece, seenElements);
      } else {
        sawBackgroundPiece = true;
        return runAnimation(_this, piece);
      }
    });
    if (!sawBackgroundPiece) {
      if (this.newElement) {
        this.newElement.css({ visibility: '' });
      }
      if (this.oldElement) {
        this.oldElement.css({ visibility: 'hidden' });
      }
    }
    return _liquidFire.Promise.all(promises);
  }

  function explodePiece(context, piece, seen) {
    var childContext = copy(context);
    var selectors = [piece.pickOld || piece.pick, piece.pickNew || piece.pick];
    var cleanupOld = void 0,
        cleanupNew = void 0;

    if (selectors[0] || selectors[1]) {
      cleanupOld = _explodePart(context, 'oldElement', childContext, selectors[0], seen);
      cleanupNew = _explodePart(context, 'newElement', childContext, selectors[1], seen);
      if (!cleanupOld && !cleanupNew) {
        return _liquidFire.Promise.resolve();
      }
    }

    return runAnimation(childContext, piece).finally(function () {
      if (cleanupOld) {
        cleanupOld();
      }
      if (cleanupNew) {
        cleanupNew();
      }
    });
  }

  function _explodePart(context, field, childContext, selector, seen) {
    var child = void 0,
        childOffset = void 0,
        width = void 0,
        height = void 0,
        newChild = void 0;
    var elt = context[field];

    childContext[field] = null;
    if (elt && selector) {
      child = elt.find(selector).filter(function () {
        var guid = guidFor(this);
        if (!seen[guid]) {
          seen[guid] = true;
          return true;
        }
      });
      if (child.length > 0) {
        childOffset = child.offset();
        width = child.outerWidth();
        height = child.outerHeight();
        newChild = child.clone();

        // Hide the original element
        child.css({ visibility: 'hidden' });

        // If the original element's parent was hidden, hide our clone
        // too.
        if (elt.css('visibility') === 'hidden') {
          newChild.css({ visibility: 'hidden' });
        }
        newChild.appendTo(elt.parent());
        newChild.outerWidth(width);
        newChild.outerHeight(height);
        var newParentOffset = newChild.offsetParent().offset();
        newChild.css({
          position: 'absolute',
          top: childOffset.top - newParentOffset.top,
          left: childOffset.left - newParentOffset.left,
          margin: 0
        });

        // Pass the clone to the next animation
        childContext[field] = newChild;
        return function cleanup() {
          newChild.remove();
          child.css({ visibility: '' });
        };
      }
    }
  }

  function animationFor(context, piece) {
    var name = void 0,
        args = void 0,
        func = void 0;
    if (!piece.use) {
      throw new Error("every argument to the 'explode' animation must include a followup animation to 'use'");
    }
    if (isArray(piece.use)) {
      name = piece.use[0];
      args = piece.use.slice(1);
    } else {
      name = piece.use;
      args = [];
    }
    if (typeof name === 'function') {
      func = name;
    } else {
      func = context.lookup(name);
    }
    return function () {
      return _liquidFire.Promise.resolve(func.apply(this, args));
    };
  }

  function runAnimation(context, piece) {
    return new _liquidFire.Promise(function (resolve, reject) {
      animationFor(context, piece).apply(context).then(resolve, reject);
    });
  }

  function matchAndExplode(context, piece, seen) {
    if (!context.oldElement || !context.newElement) {
      return _liquidFire.Promise.resolve();
    }

    // reduce the matchBy scope
    if (piece.pick) {
      context.oldElement = context.oldElement.find(piece.pick);
      context.newElement = context.newElement.find(piece.pick);
    }

    if (piece.pickOld) {
      context.oldElement = context.oldElement.find(piece.pickOld);
    }

    if (piece.pickNew) {
      context.newElement = context.newElement.find(piece.pickNew);
    }

    // use the fastest selector available
    var selector = void 0;

    if (piece.matchBy === 'id') {
      selector = function selector(attrValue) {
        return '#' + attrValue;
      };
    } else if (piece.matchBy === 'class') {
      selector = function selector(attrValue) {
        return '.' + attrValue;
      };
    } else {
      selector = function selector(attrValue) {
        var escapedAttrValue = attrValue.replace(/'/g, "\\'");
        return '[' + piece.matchBy + '=\'' + escapedAttrValue + '\']';
      };
    }

    var hits = A(context.oldElement.find('[' + piece.matchBy + ']').toArray());
    return _liquidFire.Promise.all(hits.map(function (elt) {
      var attrValue = $(elt).attr(piece.matchBy);

      // if there is no match for a particular item just skip it
      if (attrValue === "" || context.newElement.find(selector(attrValue)).length === 0) {
        return _liquidFire.Promise.resolve();
      }

      return explodePiece(context, {
        pick: selector(attrValue),
        use: piece.use
      }, seen);
    }));
  }
});