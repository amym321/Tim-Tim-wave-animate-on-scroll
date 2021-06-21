(function(factory) {
    typeof define === 'function' && define.amd ? define(factory) : factory();
}((function() {
    'use strict';
    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, basedir, module) {
        return module = {
            path: basedir,
            exports: {},
            require: function(path, base) {
                return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
            }
        }, fn(module, module.exports), module.exports;
    }

    

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }

    function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        return Constructor;
    }
    var defaultInstanceSettings = {
        update: null,
        begin: null,
        loopBegin: null,
        changeBegin: null,
        change: null,
        changeComplete: null,
        loopComplete: null,
        complete: null,
        loop: 1,
        direction: 'normal',
        autoplay: true,
        timelineOffset: 0
    };
    var defaultTweenSettings = {
        duration: 1000,
        delay: 0,
        endDelay: 0,
        easing: 'easeOutElastic(1, .5)',
        round: 0
    };
    var validTransforms = ['translateX', 'translateY', 'translateZ', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scaleX', 'scaleY', 'scaleZ', 'skew', 'skewX', 'skewY', 'perspective', 'matrix', 'matrix3d'];
    var cache = {
        CSS: {},
        springs: {}
    };

    function minMax(val, min, max) {
        return Math.min(Math.max(val, min), max);
    }

    function stringContains(str, text) {
        return str.indexOf(text) > -1;
    }

    function applyArguments(func, args) {
        return func.apply(null, args);
    }
    var is = {
        arr: function(a) {
            return Array.isArray(a);
        },
        obj: function(a) {
            return stringContains(Object.prototype.toString.call(a), 'Object');
        },
        pth: function(a) {
            return is.obj(a) && a.hasOwnProperty('totalLength');
        },
        svg: function(a) {
            return a instanceof SVGElement;
        },
        inp: function(a) {
            return a instanceof HTMLInputElement;
        },
        dom: function(a) {
            return a.nodeType || is.svg(a);
        },
        str: function(a) {
            return typeof a === 'string';
        },
        fnc: function(a) {
            return typeof a === 'function';
        },
        und: function(a) {
            return typeof a === 'undefined';
        },
        hex: function(a) {
            return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a);
        },
        rgb: function(a) {
            return /^rgb/.test(a);
        },
        hsl: function(a) {
            return /^hsl/.test(a);
        },
        col: function(a) {
            return (is.hex(a) || is.rgb(a) || is.hsl(a));
        },
        key: function(a) {
            return !defaultInstanceSettings.hasOwnProperty(a) && !defaultTweenSettings.hasOwnProperty(a) && a !== 'targets' && a !== 'keyframes';
        }
    };




   

    var Parallaxer = function() {
        function Parallaxer() {
            var _this = this;
            var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
                selector: '[data-parallax]',
                scrollWatcher: window
            };
            _classCallCheck(this, Parallaxer);
            this.argSelector = args.selector ? args.selector : '[data-parallax]';
            this.easeFunction = 'easeOutSine';
            this.interactiveElements = [];
            this.refreshGlobals();
            this.setupAll();
            args.scrollWatcher.addEventListener('scroll', function(ev) {
                return _this.updateAll(ev);
            });
            args.scrollWatcher == window && window.addEventListener('resize', function(ev) {
                return _this.refreshGlobals(ev);
            });
        }
        _createClass(Parallaxer, [{
            key: "refreshGlobals",
            value: function refreshGlobals() {
                this.windowHeight = document.documentElement.clientHeight;
            }
        }, {
            key: "setupAll",
            value: function setupAll() {
                var _this2 = this;
                this.interactiveElements = document.querySelectorAll(this.argSelector);
                this.interactiveElements.forEach(function(interactiveEl) {
                    _this2.setupElement(interactiveEl);
                    _this2.updateElement(interactiveEl);
                });
            }
        }, {
            key: "setupElement",
            value: function setupElement(el) {
                el.timeLine = anime.timeline({
                    autoplay: false
                });
                el.dataParallax = el.getAttribute('data-parallax').split(/[,\s]+(?={)/);
                var setEasing = this.easeFunction;
                el.modoOut = el.getAttribute('data-parallax-out');
                el.dataParallax.forEach(function(parallaxAttr) {
                    var keyframe = JSON.parse(parallaxAttr);
                    keyframe.targets = el;
                    keyframe.easing = setEasing;
                    el.timeLine.add(keyframe);
                });
            }
        }, {
            key: "updateAll",
            value: function updateAll() {
                var _this3 = this;
                this.interactiveElements.forEach(function(interactiveEl) {
                    _this3.updateElement(interactiveEl);
                });
            }
        }, {
            key: "updateElement",
            value: function updateElement(el) {
                var bound = el.getBoundingClientRect();
                if (el.modoOut) {
                    if (bound.top <= 0 && bound.bottom > 0) el.timeLine.seek(el.timeLine.duration * ((0 - bound.top) / (0 + bound.height)).toFixed(3));
                    else if (bound.top >= 0) el.timeLine.seek(0);
                    else if (bound.bottom <= 0) el.timeLine.seek(el.timeLine.duration);
                } else {
                    if (bound.top < this.windowHeight && bound.bottom > 0) el.timeLine.seek(el.timeLine.duration * ((this.windowHeight - bound.top) / (this.windowHeight + bound.height)).toFixed(3));
                    else if (bound.top >= this.windowHeight) el.timeLine.seek(0);
                    else if (bound.bottom <= 0) el.timeLine.seek(el.timeLine.duration);
                }
            }
        }]);
        return Parallaxer;
    }();
   

 

    

    


  
  
})));