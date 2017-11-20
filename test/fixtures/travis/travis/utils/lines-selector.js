define('travis/utils/lines-selector', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var $ = Ember.$;
  var scheduleOnce = Ember.run.scheduleOnce;
  var later = Ember.run.later;

  exports.default = function () {
    LinesSelector.prototype.Location = {
      getHash: function getHash() {
        return window.location.hash;
      },
      setHash: function setHash(hash) {
        var path = void 0;
        path = '' + window.location.pathname + hash;
        return window.history.pushState({
          path: path
        }, null, path);
      }
    };

    LinesSelector.prototype.element = null;

    LinesSelector.prototype.scroll = null;

    LinesSelector.prototype.location = null;

    LinesSelector.prototype.view = null;

    LinesSelector.prototype.last_selected_line = null;

    function LinesSelector(element1, scroll, folder, location) {
      this.element = element1;
      this.scroll = scroll;
      this.folder = folder;
      this.location = location || this.Location;
      scheduleOnce('afterRender', this, function () {
        var ref = void 0;
        this.last_selected_line = (ref = this.getSelectedLines()) != null ? ref.first : void 0;
        return this.highlightLines();
      });
      this.element.on('click', 'a', function (_this) {
        return function (event) {
          var element = void 0;
          element = $(event.target).parent('p');
          _this.loadLineNumbers(element, event.shiftKey);
          event.preventDefault();
          return false;
        };
      }(this));
    }

    LinesSelector.prototype.willDestroy = function () {
      return this.destroyed = true;
    };

    LinesSelector.prototype.loadLineNumbers = function (element, multiple) {
      this.setHashValueWithLine(element, multiple);
      return this.highlightLines();
    };

    LinesSelector.prototype.highlightLines = function (tries) {
      tries = tries || 0;
      this.removeAllHighlights();
      var lines = this.getSelectedLines();
      if (lines) {
        var elements = this.element.find('p:visible').slice(lines.first - 1, lines.last);
        if (elements.length) {
          elements.addClass('highlight');
        } else if (tries < 4) {
          later(this, function () {
            if (!this.destroyed) {
              return this.highlightLines(tries + 1);
            }
          }, 500);
          return;
        }
      }
      this.scroll.tryScroll();
      return this.unfoldLines();
    };

    LinesSelector.prototype.unfoldLines = function () {
      var index = void 0,
          l = void 0,
          line = void 0,
          results = void 0;
      var lines = this.getSelectedLines();
      if (lines) {
        results = [];
        for (index in lines) {
          l = lines[index];
          line = this.element.find('p:visible').slice(l - 1, l);
          results.push(this.folder.unfold(line));
        }
        return results;
      }
    };

    LinesSelector.prototype.setHashValueWithLine = function (line, multiple) {
      var hash = void 0,
          lineNumber = void 0,
          lines = void 0;
      lineNumber = this.getLineNumberFromElement(line);
      if (multiple && this.last_selected_line != null) {
        lines = [lineNumber, this.last_selected_line].sort(function (a, b) {
          return a - b;
        });
        hash = '#L' + lines[0] + '-L' + lines[1];
      } else {
        hash = '#L' + lineNumber;
      }
      this.last_selected_line = lineNumber;
      return this.location.setHash(hash);
    };

    LinesSelector.prototype.getLineNumberFromElement = function (element) {
      if (this && this.element) {
        return this.element.find('p:visible').index(element) + 1;
      }
    };

    LinesSelector.prototype.removeAllHighlights = function () {
      if (this && this.element) {
        return this.element.find('p.highlight').removeClass('highlight');
      }
    };

    LinesSelector.prototype.getSelectedLines = function () {
      var match = this.location.getHash().match(/#L(\d+)(-L(\d+))?$/);
      if (match) {
        var first = match[1];
        var last = match[3] || match[1];
        return {
          first: first,
          last: last
        };
      }
    };

    return LinesSelector;
  }();
});