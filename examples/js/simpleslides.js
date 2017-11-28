/**
 * SimpleSlides
 * @version 1.0.0
 * @author Ignacio Revuelta
 * @license The MIT License (MIT)
 */
var SimpleSlides = (function() {

  'use-strict';

  var loop, addEventListener, removeEventListener, dispatchEvent, exists, setState, onError, onMouseEnter, onMouseLeave, onClickNavItem;
  var timerId = null;
  var states = {
    error: 'error',
    started: 'started',
    stopped: 'stopped',
    destroyed: 'destroyed'
  };
  var state = states.idle;
  var eventListeners = {};
  var events = {
    start: 'start',
    stop: 'stop',
    pause: 'pause',
    resume: 'resume',
    change: 'change',
    destroy: 'destroy',
    error: 'error'
  };

  // Constructor
  function SimpleSlides(options) {
    this.options = $.extend({}, SimpleSlides.defaults, options);
    this.nodePath = this.options.parentNode + ' ' + this.options.childrenNode;

    addEventListener(events.error, $.proxy(onError, this));
    addEventListener(events.start, this.options.onStart);
    addEventListener(events.stop, this.options.onStop);
    addEventListener(events.pause, this.options.onPause);
    addEventListener(events.change, this.options.onChange);
    addEventListener(events.resume, this.options.onResume);
    addEventListener(events.destroy, this.options.onDestroy);

    if (!exists(this.options.parentNode)) {
      dispatchEvent(events.error, this, 'Parent node is undefined');
    }

    if (!exists(this.nodePath)) {
      dispatchEvent(events.error, this, 'Children nodes do not exist');
    } else {
      this.options.slides = $(this.nodePath).length;
    }

    if (this.options.showNavigation) {
      this.navigationNodePath = this.options.parentNode + ' ' + this.options.navigationNode + ' ' + this.options.navigationNodeChildren;
      if (!exists(this.navigationNodePath)) {
        dispatchEvent(events.error, this, 'Navigation node or navigation childs do not exists');
      }
      if ($(this.navigationNodePath).length !== this.options.slides) {
        dispatchEvent(events.error, this, 'Navigation children count does not match slides length');
      }
    }

    if (this.options.slides <= 0) {
      dispatchEvent(events.error, this, 'slides parameter is undefined.');
    }

    if (state !== states.error) {
      timerId              = null;
      this.currentSlideEl  = null;
      this.previousSlideEl = null;
      this.currentSlide    = this.options.slide || 1;
      this.previousSlide   = (this.currentSlide - 1 === 0) ? this.options.slides : this.currentSlide - 1;

      $(this.nodePath).removeClass(this.options.activeClass).hide();

      if (this.options.showNavigation) {
        $(this.navigationNodePath).on('click', $.proxy(onClickNavItem, this));
      }

      if (this.options.pauseOnHover) {
        $(this.options.parentNode).on('mouseenter', $.proxy(onMouseEnter, this));
        $(this.options.parentNode).on('mouseleave', $.proxy(onMouseLeave, this));
      }
    }
  }

  SimpleSlides.defaults = {
    parentNode: '.simpleslides',
    childrenNode: '.simpleslides-item',
    navigationNode: '.simpleslides-nav',
    navigationNodeChildren: '.simpleslides-nav-item',
    slides: 0,
    slide: 1,
    autoplay: true,
    timeout: 2000,
    transitionTime: 500,
    transitionEasing: 'linear',
    pauseOnHover: false,
    showNavigation: false,
    activeClass: 'active',
    onStart: function() {},
    onPause: function() {},
    onStop: function() {},
    onChange: function() {},
    onResume: function() {},
    onDestroy: function() {},
  };

  // Public Methods
  SimpleSlides.prototype = {
    start: function() {
      if (state !== states.error) {
        dispatchEvent(events.start);
        setState(states.started);
        this.play(1, 1);
      }
    },

    stop: function() {
      dispatchEvent(events.stop);
      clearTimeout(timerId);
      setState(states.stopped);
    },

    play: function(time, transitionTime) {
      clearTimeout(timerId);
      timerId = setTimeout($.proxy(loop, this, transitionTime || this.options.transitionTime), time || this.options.timeout);
    },

    pause: function() {
      clearTimeout(timerId);
      dispatchEvent(events.pause);
    },

    resume: function(time, transitionTime) {
      dispatchEvent(events.resume);
      this.play(time, transitionTime);
    },

    destroy: function() {
      dispatchEvent(events.destroy);

      removeEventListener(events.error, $.proxy(onError, this));
      removeEventListener(events.pause, this.options.onPause);
      removeEventListener(events.resume, this.options.onResume);
      removeEventListener(events.stop, this.options.onStop);
      removeEventListener(events.change, this.options.onChange);
      removeEventListener(events.destroy, this.options.onDestroy);

      if (this.options.showNavigation) {
        $(this.navigationNodePath).off('click', $.proxy(onClickNavItem, this));
      }
      if (this.options.pauseOnHover) {
        $(this.options.parentNode).off('mouseenter', $.proxy(onMouseEnter, this));
        $(this.options.parentNode).off('mouseleave', $.proxy(onMouseLeave, this));
      }

      clearTimeout(timerId);
      setState(states.destroyed);
    },

    goToSlide: function(slideNumber) {
      if (slideNumber) {
        this.currentSlide = slideNumber;
        this.resume(1);
      }
    },

    goToPreviousSlide: function() {
      this.currentSlide = this.getPreviousSlide();
      this.resume(1);
    },

    goToNextSlide: function() {
      this.currentSlide = this.getNextSlide();
      this.resume(1);
    },

    getCurrentSlide: function() {
      return this.currentSlide;
    },

    getNextSlide: function() {
      return this.currentSlide + 1 <= this.options.slides ? this.currentSlide + 1 : 1;
    },

    getPreviousSlide: function() {
      return this.currentSlide - 1 > 0 ? this.currentSlide - 1 : this.options.slides;
    }
  }

  // Private Methods
  loop = function(transitionTime) {
    this.currentSlideEl  = $(this.nodePath + ':nth-child(' + this.currentSlide + ')');
    this.previousSlideEl = $(this.nodePath + ':nth-child(' + this.previousSlide + ')');

    if (this.options.showNavigation) {
      $(this.navigationNodePath).removeClass(this.options.activeClass);
      $(this.navigationNodePath + ':nth-child(' + this.currentSlide + ')').addClass(this.options.activeClass);
    }

    this.currentSlide    = this.getNextSlide();
    this.previousSlide   = this.getPreviousSlide();

    $(this.nodePath).removeClass(this.options.activeClass).hide();
    this.currentSlideEl.addClass(this.options.activeClass);

    this.previousSlideEl.show();
    this.currentSlideEl.fadeIn(transitionTime, this.options.transitionEasing, $.proxy(function() {
      dispatchEvent(events.change);
      if (this.options.autoplay && state !== states.destroyed) {
        this.play();
      }
    }, this));
  }

  exists = function(htmlNode) {
    return !!$(htmlNode).length;
  }

  dispatchEvent = function(type, target) {
    if (type in events) {
      var args      = [];
      var numOfArgs = arguments.length;
      var event = {
        type: type,
        target: target
      };

      for (var i = 0; i < numOfArgs; i++) {
        args.push(arguments[i]);
      };
      args = args.length > 2 ? args.splice(2, args.length - 1) : [];
      args = [event].concat(args);

      if (typeof eventListeners[type] != 'undefined') {
        var listeners = eventListeners[type].slice();
        var numOfCallbacks = listeners.length;
        for (var i = 0; i < numOfCallbacks; i++) {
          var listener = listeners[i];
          if (listener && listener.callback) {
            var concatArgs = args.concat(listener.args);
            listener.callback.apply(listener.scope, concatArgs);
          }
        }
      }
    }
  }

  addEventListener = function(type, callback, scope) {
    if (type in events) {
      var args      = [];
      var numOfArgs = arguments.length;
      for (var i = 0; i < numOfArgs; i++) {
        args.push(arguments[i]);
      }
      args = args.length > 3 ? args.splice(3, args.length - 1) : [];
      if (typeof eventListeners[type] != 'undefined') {
        eventListeners[type].push({
          scope: scope,
          callback: callback,
          args: args
        });
      } else {
        eventListeners[type] = [{
          scope: scope,
          callback: callback,
          args: args
        }];
      }
    }
  }

  removeEventListener = function(type, callback, scope) {
    if (type in events && typeof eventListeners[type] != 'undefined') {
      var numOfCallbacks = eventListeners[type].length;
      var newArray = [];
      for (var i = 0; i < numOfCallbacks; i++) {
        var listener = eventListeners[type][i];
        if (listener.scope == scope && listener.callback == callback) {

        } else {
          newArray.push(listener);
        }
      }
      eventListeners[type] = newArray;
    }
  }

  setState = function(newState) {
    if (newState in states) {
      state = newState;
    }
  }

  onMouseEnter = function(event) {
    event.preventDefault();
    this.pause();
  }

  onMouseLeave = function(event) {
    event.preventDefault();
    this.play();
  }

  onClickNavItem = function(event) {
    event.preventDefault();
    dispatchEvent(events.change);
    this.currentSlide = $(event.currentTarget).index() + 1;
    this.play(1);
  }

  onError = function(event, message) {
    setState(states.error);
    console.error('SimpleSlides error: ' + message);
  }

  return SimpleSlides;

})();
