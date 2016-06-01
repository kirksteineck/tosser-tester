/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(2)

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Tosser allows for easy frame to frame communication
	 */

	var Tosser = function () {
	  /**
	   * Creates a new Tosser class
	   */

	  function Tosser() {
	    var _this = this;

	    _classCallCheck(this, Tosser);

	    this.registeredMessages = {};
	    this.pendingMessages = {};
	    this.messageSendTimeout = {};
	    this.clientWindows = [];
	    this.onceRegisteredMessages = {};

	    window.$('iframe').each(function (index, frame) {
	      return _this.clientWindows.push({
	        window: frame.contentWindow,
	        element: window.$(frame)
	      });
	    });

	    window.$(window).on('message', function (evt) {
	      var e = evt.originalEvent;

	      if (!e.data) {
	        return;
	      }

	      // Parse out the data which should be a JSON string
	      try {
	        var data = JSON.parse(e.data);
	      } catch (e) {
	        // Its not valid JSON so obviously its not us talking :)
	        return;
	      }

	      // Set the default received from to have no element
	      var receivedFrom = {
	        element: null,
	        window: e.source
	      };

	      // Figure out who sent us this message so we can target them if we have an element to target
	      _this.clientWindows.forEach(function (clientWindow) {
	        if (clientWindow.window === e.source) {
	          receivedFrom.element = clientWindow.element;
	        }
	      });

	      if (data.ack) {
	        var message = _this.pendingMessages[data.ack];
	        delete _this.pendingMessages[data.ack];
	        return message.callback(true); // Send ACK
	      } else if (data.type) {
	          _this._sendMessage({ ack: data.id }, receivedFrom.window);
	          if (_this.onceRegisteredMessages[data.type]) {
	            _this.onceRegisteredMessages[data.type].forEach(function (callback) {
	              callback(data.body, receivedFrom.element);
	            });
	            delete _this.onceRegisteredMessages[data.type];
	          }

	          if (_this.registeredMessages[data.type]) {
	            _this.registeredMessages[data.type].forEach(function (callback) {
	              callback(data.body, receivedFrom.element);
	            });
	          }
	        }
	    });
	  }

	  _createClass(Tosser, [{
	    key: '_sendMessage',
	    value: function _sendMessage(body, targetWindow) {
	      // Make sure the message that we send out is a string and not an object.
	      // IE does not like sending objects across
	      body = JSON.stringify(body);
	      if (targetWindow.window) {
	        targetWindow.window.postMessage(body, '*');
	      } else {
	        var frames = this._getAllFramesEverywhere();
	        frames.forEach(function (clientWindow) {
	          if (clientWindow.window) {
	            clientWindow.window.postMessage(body, '*');
	          }
	        });
	      }
	      return this._checkMessagePool();
	    }
	  }, {
	    key: '_getAllFramesEverywhere',
	    value: function _getAllFramesEverywhere() {
	      var _getWindowsFrames = function _getWindowsFrames(window) {
	        var rtn = [];
	        window.frames.forEach(function (frame) {
	          rtn.push(frame);
	          rtn = rtn.concat(_getWindowsFrames(frame));
	        });
	        return rtn;
	      };

	      var rtn = _getWindowsFrames(window.top);
	      rtn.push(window.top);
	      return rtn;
	    }
	  }, {
	    key: '_checkMessagePool',
	    value: function _checkMessagePool() {
	      var _this2 = this;

	      clearTimeout(this.messageSendTimeout);
	      this.messageSendTimeout = setTimeout(function () {
	        _this2.pendingMessages.forEach(function (pendingMessage, index) {
	          pendingMessage.message.attempt++;
	          if (pendingMessage.message.attempt > 20) {
	            delete _this2.pendingMessages[index];
	            pendingMessage.callback(false); // send NACK
	          } else {
	              _this2._sendMessage(pendingMessage.message, pendingMessage.target);
	            }
	        });
	      }, 250);
	    }
	  }, {
	    key: '_prepMessage',
	    value: function _prepMessage(type) {
	      var content = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

	      var message = {
	        type: type,
	        body: content,
	        id: Math.random(),
	        attempt: 0
	      };
	      return message;
	    }

	    /**
	     * Trigger a message as if it was just received from a remote source
	     * @param type
	     * @param content
	     */

	  }, {
	    key: 'trigger',
	    value: function trigger(type) {
	      var content = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

	      if (this.registeredMessages[type]) {
	        this.registeredMessages[type].forEach(function (callback) {
	          callback(content);
	        });
	      }
	    }

	    /**
	     * Broadcast a message to every frame
	     * @param type
	     * @param content
	     * @param callback
	     * @returns {*}
	     */

	  }, {
	    key: 'broadcast',
	    value: function broadcast(type) {
	      var content = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
	      var callback = arguments.length <= 2 || arguments[2] === undefined ? function () {} : arguments[2];

	      var message = this._prepMessage(type, content, callback);
	      this.pendingMessages[message.id] = {
	        message: message,
	        callback: callback,
	        target: null
	      };
	      return this._sendMessage(message);
	    }

	    /**
	     * Send a message just to the parent frame
	     * @param type
	     * @param content
	     * @param callback
	     * @returns {*}
	     */

	  }, {
	    key: 'sendToParent',
	    value: function sendToParent(type) {
	      var content = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
	      var callback = arguments.length <= 2 || arguments[2] === undefined ? function () {} : arguments[2];

	      if (window.parent && window.parent !== window) {
	        var message = this._prepMessage(type, content, callback);
	        this.pendingMessages[message.id] = {
	          message: message,
	          callback: callback,
	          target: window.parent
	        };
	        return this._sendMessage(message, window.parent);
	      }
	    }

	    /**
	     * Send a message to direct children
	     * @param type
	     * @param content
	     * @param callback
	     */

	  }, {
	    key: 'sendToChildren',
	    value: function sendToChildren(type) {
	      var _this3 = this;

	      var content = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
	      var callback = arguments.length <= 2 || arguments[2] === undefined ? function () {} : arguments[2];

	      var message = this._prepMessage(type, content, callback);
	      this.clientWindows.forEach(function (targetWindow) {
	        _this3.pendingMessages[message.id] = {
	          message: message,
	          callback: callback,
	          target: targetWindow
	        };

	        return _this3._sendMessage(message, targetWindow);
	      });
	    }

	    /**
	     * Send a message to a target window
	     * @param type
	     * @param content
	     * @param targetWindow
	     * @param callback
	     * @returns {*}
	     */

	  }, {
	    key: 'sendToWindow',
	    value: function sendToWindow(type) {
	      var content = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
	      var targetWindow = arguments[2];
	      var callback = arguments.length <= 3 || arguments[3] === undefined ? function () {} : arguments[3];

	      var message = this._prepMessage(type, content, callback);

	      this.pendingMessages[message.id] = {
	        message: message,
	        callback: callback,
	        target: targetWindow
	      };

	      return this._sendMessage(message, targetWindow);
	    }

	    /**
	     * Listen for a single message to be sent to the current frame
	     * @param type
	     * @param callback
	     * @returns {Number}
	     */

	  }, {
	    key: 'once',
	    value: function once(type, callback) {
	      if (!this.onceRegisteredMessages[type]) {
	        this.onceRegisteredMessages[type] = [];
	      }
	      return this.onceRegisteredMessages[type].push(callback);
	    }

	    /**
	     * Listen for any messages sent to this frame
	     * @param type
	     * @param callback
	     * @returns {Number}
	     */

	  }, {
	    key: 'on',
	    value: function on(type, callback) {
	      if (!this.registeredMessages[type]) {
	        this.registeredMessages[type] = [];
	      }
	      return this.registeredMessages[type].push(callback);
	    }
	  }]);

	  return Tosser;
	}();

	module.exports = Tosser;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);

	$(document).ready(function(){
		Tosser  
	});



/***/ }
/******/ ]);