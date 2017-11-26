/**
 * SimpleSlides
 * @version 1.0.0
 * @author Ignacio Revuelta
 * @license The MIT License (MIT)
 */
var SimpleSlides = (function() {
  var loop, hasEvent, triggerEvent, getEvents, exists, onError, onMouseOver, onMouseOut, onClickNavItem;
  var state = '';
  var eventListeners = {};
  var events = {
    start: 'start',
    stop: 'stop',
    pause: 'pause',
    resume: 'resume',
    loop: 'loop',
    change: 'change'
  };

  // Constructor
  function SimpleSlides(options) {
    this.options = $.extend({}, SimpleSlides.defaults, options);
    this.on(events.error, $.proxy(onError, this));

    this.nodePath = this.options.parentNode + ' ' + this.options.childrenNode;

    if (!exists(this.options.parentNode)) {
      triggerEvent(events.error, this, 'Parent node is undefined');
    }

    if (!exists(this.nodePath)) {
      triggerEvent(events.error, this, 'Children nodes do not exist');
    } else {
      this.options.slides = $(this.nodePath).length;
    }

    if (this.options.showNavigation) {
      this.navigationNodePath = this.options.parentNode + ' ' + this.options.navigationNode + ' ' + this.options.navigationNodeChildren;
      if (!exists(this.navigationNodePath)) {
        triggerEvent(events.error, this, 'Navigation node or navigation childs do not exists');
      }
      if ($(this.navigationNodePath).length !== this.options.slides) {
        triggerEvent(events.error, this, 'Navigation children count does not match slides length');
      }
    }

    if (this.options.slides <= 0) {
      triggerEvent(events.error, this, 'slides parameter is undefined.');
    }

    if (state !== 'error') {
      this.initialize();
      getEvents();
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
    activeClass: 'active'
  };

  // Public Methods
  SimpleSlides.prototype = {

    initialize: function() {
      this.state           = 'ready';
      this.timerId         = null;
      this.currentSlideEl  = null;
      this.previousSlideEl = null;
      this.currentSlide    = this.options.slide || 1;
      this.previousSlide   = (this.currentSlide - 1 === 0) ? this.options.slides : this.currentSlide - 1;

      $(this.nodePath).removeClass(this.options.activeClass).hide();

      if (this.options.showNavigation) {
        $(this.navigationNodePath).on('click', $.proxy(onClickNavItem, this));
      }

      if (this.options.pauseOnHover) {
        $(this.options.parentNode).on('mouseover', $.proxy(onMouseOver, this));
        $(this.options.parentNode).on('mouseout', $.proxy(onMouseOut, this));
      }
    },

    destroy: function() {
      this.on(events.error, $.proxy(onError, this));
      if (this.options.showNavigation) {
        $(this.navigationNodePath).off('mouseover', $.proxy(onClickNavItem, this));
      }
      if (this.options.pauseOnHover) {
        $(this.options.parentNode).off('mouseover', $.proxy(onMouseOver, this));
        $(this.options.parentNode).off('mouseout', $.proxy(onMouseOut, this));
      }
    },

    start: function() {
      if (this.state !== 'error') {
        triggerEvent(events.start);
        this.resume(1, 1);
      }
    },

    stop: function() {
      triggerEvent(events.stop);
      clearTimeout(this.timerId);
      this.destroy();
    },

    pause: function() {
      clearTimeout(this.timerId);
      triggerEvent(events.pause);
    },

    resume: function(time, transitionTime) {
      clearTimeout(this.timerId);
      this.timerId = setTimeout($.proxy(loop, this, transitionTime || this.options.transitionTime), time || this.options.timeout);
    },

    goToSlide: function(slideNumber) {
      if (slideNumber) {
        this.currentSlide = slideNumber;
        this.resume(1);
      }
    },

    goToPrevSlide: function() {
      this.currentSlide = (this.currentSlide - 1 > 0) ? --this.currentSlide : this.options.slides;
      this.resume(1);
    },

    goToNextSlide: function() {
      this.currentSlide = (this.currentSlide + 1 <= this.options.slides) ? ++this.currentSlide: 1;
      this.resume(1);
    },

    on: function(type, callback, scope) {
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
    },

    off: function(type, callback, scope) {
      if (typeof eventListeners[type] != 'undefined') {
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
  }

  // Private Methods
  loop = function(transitionTime) {
    this.currentSlideEl  = $(this.nodePath + ':nth-child(' + this.currentSlide + ')');
    this.previousSlideEl = $(this.nodePath + ':nth-child(' + this.previousSlide + ')');

    if (this.options.showNavigation) {
      $(this.navigationNodePath).removeClass(this.options.activeClass);
      $(this.navigationNodePath + ':nth-child(' + this.currentSlide + ')').addClass(this.options.activeClass);
    }

    this.currentSlide    = (this.currentSlide < this.options.slides) ? this.currentSlide + 1 : 1;
    this.previousSlide   = (this.currentSlide - 1 === 0) ? this.options.slides : this.currentSlide - 1;

    $(this.nodePath).removeClass(this.options.activeClass).hide();
    this.currentSlideEl.addClass(this.options.activeClass);

    this.previousSlideEl.show();
    this.currentSlideEl.fadeIn(transitionTime, this.options.transitionEasing, $.proxy(function() {
      triggerEvent(events.loop);
      if (this.options.autoplay) {
        this.resume();
      }
    }, this));
  }

  exists = function(htmlNode) {
    return !!$(htmlNode).length;
  }

  hasEvent = function(type, callback, scope) {
    if (typeof this.listeners[type] != 'undefined') {
      var numOfCallbacks = this.listeners[type].length;
      if (callback === undefined && scope === undefined) {
        return numOfCallbacks > 0;
      }
      for (var i = 0; i < numOfCallbacks; i++) {
        var listener = this.listeners[type][i];
        if ((scope ? listener.scope == scope : true) && listener.callback == callback) {
          return true;
        }
      }
    }
    return false;
  }

  triggerEvent = function(type, target) {
    var event = {
      type: type,
      target: target
    };
    var args      = [];
    var numOfArgs = arguments.length;
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

  getEvents = function() {
    var str = '';
    for (var type in this.listeners) {
      var numOfCallbacks = this.listeners[type].length;
      for (var i = 0; i < numOfCallbacks; i++) {
        var listener = this.listeners[type][i];
        str += listener.scope && listener.scope.className ? listener.scope.className : 'anonymous';
        str += " listen for '" + type + "'\n";
      }
    }
    return str;
  }

  onError = function(event, message) {
    state = 'error';
    console.error('SimpleSlides error: ' + message);
  }

  onMouseOver = function(event) {
    event.preventDefault();
    this.pause();
  }

  onMouseOut = function(event) {
    event.preventDefault();
    this.resume();
  }

  onClickNavItem = function(event) {
    event.preventDefault();
    triggerEvent(events.change);
    this.currentSlide = $(event.currentTarget).index() + 1;
    this.resume(1);
  }

  return SimpleSlides;

})();
