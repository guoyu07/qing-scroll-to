/**
 * qing-scroll-to v0.0.1
 * http://mycolorway.github.io/qing-scroll-to
 *
 * Copyright Mycolorway Design
 * Released under the MIT license
 * http://mycolorway.github.io/qing-scroll-to/license.html
 *
 * Date: 2016-12-3
 */
;(function(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('jquery'),require('qing-module'));
  } else {
    root.QingScrollTo = factory(root.jQuery,root.QingModule);
  }
}(this, function ($,QingModule) {
var define, module, exports;
var b = require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"qing-scroll-to":[function(require,module,exports){
var QingScrollTo,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

QingScrollTo = (function(superClass) {
  extend(QingScrollTo, superClass);

  function QingScrollTo() {
    return QingScrollTo.__super__.constructor.apply(this, arguments);
  }

  QingScrollTo.name = 'QingScrollTo';

  QingScrollTo.opts = {
    el: null,
    container: null,
    axis: 'y',
    offset: null,
    duration: 500,
    animation: true,
    cancelIfVisible: true,
    callback: $.noop
  };

  QingScrollTo.prototype._setOptions = function(opts) {
    QingScrollTo.__super__._setOptions.apply(this, arguments);
    return $.extend(this.opts, QingScrollTo.opts, opts);
  };

  QingScrollTo.prototype._init = function() {
    var base;
    QingScrollTo.__super__._init.apply(this, arguments);
    if (this.opts.el) {
      this.el = $(this.opts.el);
    }
    if (!this.el && this.opts.offset === null) {
      throw new Error("QingScrollTo: el or offset option is invalid");
    }
    this.container = this.opts.container ? $(this.opts.container) : $('body, html');
    (base = this.opts).offset || (base.offset = 0);
    this._calculateOffset();
    if (!this._shouldBeCancel()) {
      return this._scroll();
    }
  };

  QingScrollTo.prototype._calculateOffset = function() {
    var containerOffset, targetOffset;
    if (typeof this.opts.offset === 'object') {
      this.offset = $.extend({}, this.opts.offset);
    } else {
      this.offset = {
        x: this.opts.offset,
        y: this.opts.offset
      };
    }
    if (!this.el) {
      return this.offset;
    }
    targetOffset = this.el.offset();
    if (this.opts.container) {
      containerOffset = this.container.offset();
      targetOffset.top = Math.abs(targetOffset.top - containerOffset.top + this.container.scrollTop());
      targetOffset.left = Math.abs(targetOffset.left - containerOffset.left + this.container.scrollLeft());
    }
    return this.offset = {
      y: targetOffset.top - this.offset.y,
      x: targetOffset.left - this.offset.x
    };
  };

  QingScrollTo.prototype._shouldBeCancel = function() {
    var $doc, $win, scrollLeft, scrollTop, viewpartHeight, viewpartWidth;
    if (!this.opts.cancelIfVisible) {
      return false;
    }
    if (this.opts.container) {
      viewpartHeight = this.container.height();
      viewpartWidth = this.container.width();
      scrollTop = this.container.scrollTop();
      scrollLeft = this.container.scrollLeft();
    } else {
      viewpartHeight = ($win = $(window)).height();
      viewpartWidth = $win.width();
      scrollTop = ($doc = $(document)).scrollTop();
      scrollLeft = $doc.scrollLeft();
    }
    if ((this.offset.y >= scrollTop && this.offset.y < scrollTop + viewpartHeight) && (this.offset.x >= scrollLeft && this.offset.x < scrollLeft + viewpartWidth)) {
      return true;
    } else {
      return false;
    }
  };

  QingScrollTo.prototype._scroll = function() {
    var fakeCallBack, hasCalled, options;
    if (this.opts.animation) {
      options = {
        scrollTop: this.opts.axis !== 'x' ? this.offset.y : void 0,
        scrollLeft: this.opts.axis !== 'y' ? this.offset.x : void 0
      };
      hasCalled = false;
      fakeCallBack = (function(_this) {
        return function() {
          if (hasCalled) {
            return;
          }
          hasCalled = true;
          return _this.opts.callback();
        };
      })(this);
      this.container.animate(options, this.opts.duration, fakeCallBack);
      return null;
    } else {
      if (this.opts.axis !== 'x') {
        this.container.scrollTop(this.offset.y);
      }
      if (this.opts.axis !== 'y') {
        this.container.scrollLeft(this.offset.x);
      }
      this.opts.callback();
      return null;
    }
  };

  QingScrollTo.prototype.destroy = function() {};

  return QingScrollTo;

})(QingModule);

module.exports = QingScrollTo;

},{}]},{},[]);

return b('qing-scroll-to');
}));
