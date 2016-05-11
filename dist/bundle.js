/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!******************!*\
  !*** multi main ***!
  \******************/
/***/ function(module, exports, __webpack_require__) {

	(function webpackMissingModule() { throw new Error("Cannot find module \"./entry\""); }());
	__webpack_require__(/*! /home/rob/prog/lolcow/index.js */1);
	module.exports = __webpack_require__(/*! /home/rob/prog/lolcow/text-loader */8);


/***/ },
/* 1 */
/*!*******************!*\
  !*** ../index.js ***!
  \*******************/
/***/ function(module, exports, __webpack_require__) {

	var cowsay = __webpack_require__(/*! ./cowsay */ 2);
	
	console.log(cowsay.say({
	    text : "I'm a moooodule",
	    e : "oO",
	    T : "U "
	}));

/***/ },
/* 2 */
/*!**************************!*\
  !*** ../cowsay/index.js ***!
  \**************************/
/***/ function(module, exports, __webpack_require__) {

	var baloon = __webpack_require__(/*! ./lib/balloon */ 3);
	var cows = __webpack_require__(/*! ./lib/cows */ 4);
	var faces = __webpack_require__(/*! ./lib/faces */ 7);
	
	exports.say = function (options) {
		return doIt(options, true);
	};
	
	exports.think = function (options) {
		return doIt(options, false);
	};
	
	exports.list = cows.list;
	
	function doIt (options, sayAloud) {
		var cow = cows.get(options.f || "default");
		var face = faces(options);
		face.thoughts = sayAloud ? "\\" : "o";
	
		var action = sayAloud ? "say" : "think";
		return baloon[action](options.text || options._.join(" "), options.n ? null : options.W) + "\n" + cow(face);
	}


/***/ },
/* 3 */
/*!********************************!*\
  !*** ../cowsay/lib/balloon.js ***!
  \********************************/
/***/ function(module, exports) {

	exports.say = function (text, wrap) {
		delimiters = {
			first : ["/", "\\"],
			middle : ["|", "|"],
			last : ["\\", "/"],
			only : ["<", ">"]
		};
	
		return format(text, wrap, delimiters);
	}
	
	exports.think = function (text, wrap) {
		delimiters = {
			first : ["(", ")"],
			middle : ["(", ")"],
			last : ["(", ")"],
			only : ["(", ")"]
		};
	
		return format(text, wrap, delimiters);
	}
	
	function format (text, wrap, delimiters) {
		var lines = split(text, wrap);
		var maxLength = max(lines);
	
		var balloon;
		if (lines.length === 1) {
			balloon = [
				" " + top(maxLength), 
				delimiters.only[0] + " " + lines[0] + " " + delimiters.only[1],
				" " + bottom(maxLength)
			];
		} else {
			balloon = [" " + top(maxLength)];
	
			for (var i = 0, len = lines.length; i < len; i += 1) {
				var delimiter;
	
				if (i === 0) {
					delimiter = delimiters.first;
				} else if (i === len - 1) {
					delimiter = delimiters.last;
				} else {
					delimiter = delimiters.middle;
				}
	
				balloon.push(delimiter[0] + " " + pad(lines[i], maxLength) + " " + delimiter[1]);
			}
	
			balloon.push(" " + bottom(maxLength));
		}
	
		return balloon.join("\n"); //os.EOL
	}
	
	function split (text, wrap) {
		text = text.replace(/\r\n?|[\n\u2028\u2029]/g, "\n").replace(/^\uFEFF/, '').replace(/\t/g, '        ');
	
		var lines = [];
		if (!wrap) {
			lines = text.split("\n");
		} else {
			var start = 0;
			while (start < text.length) {
				var nextNewLine = text.indexOf("\n", start);
	
				var wrapAt = Math.min(start + wrap, nextNewLine === -1 ? text.length : nextNewLine);
	
				lines.push(text.substring(start, wrapAt));
				start = wrapAt;
	
				// Ignore next new line
				if (text.charAt(start) === "\n") {
					start += 1;
				}
			}
		}
	
		return lines;
	}
	
	function max (lines) {
		var max = 0;
		for (var i = 0, len = lines.length; i < len; i += 1) {
			if (lines[i].length > max) {
				max = lines[i].length;
			}
		}
	
		return max;
	}
	
	function pad (text, length) {
		return text + (new Array(length - text.length + 1)).join(" ");
	}
	
	function top (length) {
		return new Array(length + 3).join("_");
	}
	
	function bottom (length) {
		return new Array(length + 3).join("-");
	}


/***/ },
/* 4 */
/*!*****************************!*\
  !*** ../cowsay/lib/cows.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	var replacer = __webpack_require__(/*! ./replacer */ 5);
	var cows = {
		default: __webpack_require__(/*! text!../cows/doge.cow */ 6),
	};
	
	exports.get = function (cow) {
		var text = cows[cow];
	
		return function (options) {
			return replacer(text, options);
		};
	}
	
	exports.list = function (callback) {
		callback(null, cows.keys());
	}


/***/ },
/* 5 */
/*!*********************************!*\
  !*** ../cowsay/lib/replacer.js ***!
  \*********************************/
/***/ function(module, exports) {

	module.exports = function (cow, variables) {
		var eyes = escapeRe(variables.eyes);
		var tongue = escapeRe(variables.tongue);
	
		if (cow.indexOf("$the_cow") !== -1) {
			cow = extractTheCow(cow);
		}
	
		return cow
			.replace(/\$thoughts/g, variables.thoughts)
			.replace(/\$eyes/g, eyes)
			.replace(/\$tongue/g, tongue)
			.replace(/\$\{eyes\}/g, eyes)
			.replace(/\$\{tongue\}/g, tongue)
		;
	};
	
	/*
	 * "$" dollar signs must be doubled before being used in a regex replace
	 * This can occur in eyes or tongue.
	 * For example:
	 *
	 * cowsay -g Moo!
	 *
	 * cowsay -e "\$\$" Moo!
	 */
	function escapeRe (s) {
		if (s && s.replace) {
			return s.replace(/\$/g, "$$$$");
		}
		return s;
	}
	
	function extractTheCow (cow) {
		cow = cow.replace(/\r\n?|[\n\u2028\u2029]/g, "\n").replace(/^\uFEFF/, '');
		var match = /\$the_cow\s*=\s*<<"*EOC"*;*\n([\s\S]+)\nEOC\n/.exec(cow);
	
		if (!match) {
			console.error("Cannot parse cow file\n", cow);
			return cow;
		} else {
			return match[1].replace(/\\{2}/g, "\\").replace(/\\@/g, "@").replace(/\\\$/g, "$");
		}
	}

/***/ },
/* 6 */
/*!************************************************!*\
  !*** ../~/text-loader!../cowsay/cows/doge.cow ***!
  \************************************************/
/***/ function(module, exports) {

	module.exports = "##\n## Doge\n##\n$the_cow = <<EOC;\n   $thoughts\n    $thoughts\n\n           _                _\n          / /.           _-//\n         / ///         _-   /\n        //_-//=========     /\n      _///        //_ ||   ./\n    _|                 -__-||\n   |  __              - \\\\   \\\n  |  |#-       _-|_           |\n  |            |#|||       _   |  \n |  _==_                       ||\n- ==|.=.=|_ =                  |\n|  |-|-  ___                  |\n|    --__   _                /\n||     ===                  |\n |                     _. //\n  ||_         __-   _-  _|\n     \\_______/  ___/  _|\n                   --*\nEOC\n"

/***/ },
/* 7 */
/*!******************************!*\
  !*** ../cowsay/lib/faces.js ***!
  \******************************/
/***/ function(module, exports) {

	var modes = {
		"b" : {
			eyes : "==",
			tongue : "  "
		},
		"d" : {
			eyes : "xx",
			tongue : "U "
		},
		"g" : {
			eyes : "$$",
			tongue : "  "
		},
		"p" : {
			eyes : "@@",
			tongue : "  "
		},
		"s" : {
			eyes : "**",
			tongue : "U "
		},
		"t" : {
			eyes : "--",
			tongue : "  "
		},
		"w" : {
			eyes : "OO",
			tongue : "  "
		},
		"y" : {
			eyes : "..",
			tongue : "  "
		}
	};
	
	module.exports = function (options) {
		for (var mode in modes) {
			if (options[mode] === true) {
				return modes[mode];
			}
		}
	
		return {
			eyes : options.e || "oo",
			tongue : options.T || "  "
		};
	};


/***/ },
/* 8 */
/*!**********************!*\
  !*** ../text-loader ***!
  \**********************/
/***/ function(module, exports) {

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
	/*!******************!*\
	  !*** ./index.js ***!
	  \******************/
	/***/ function(module, exports, __webpack_require__) {
	
		var cowsay = __webpack_require__(/*! ./cowsay */ 1);
	
		console.log(cowsay.say({
		    text : "I'm a moooodule",
		    e : "oO",
		    T : "U "
		}));
	
	/***/ },
	/* 1 */
	/*!*************************!*\
	  !*** ./cowsay/index.js ***!
	  \*************************/
	/***/ function(module, exports, __webpack_require__) {
	
		var baloon = __webpack_require__(/*! ./lib/balloon */ 2);
		var cows = __webpack_require__(/*! ./lib/cows */ 3);
		var faces = __webpack_require__(/*! ./lib/faces */ 6);
	
		exports.say = function (options) {
			return doIt(options, true);
		};
	
		exports.think = function (options) {
			return doIt(options, false);
		};
	
		exports.list = cows.list;
	
		function doIt (options, sayAloud) {
			var cow = cows.get(options.f || "default");
			var face = faces(options);
			face.thoughts = sayAloud ? "\\" : "o";
	
			var action = sayAloud ? "say" : "think";
			return baloon[action](options.text || options._.join(" "), options.n ? null : options.W) + "\n" + cow(face);
		}
	
	
	/***/ },
	/* 2 */
	/*!*******************************!*\
	  !*** ./cowsay/lib/balloon.js ***!
	  \*******************************/
	/***/ function(module, exports) {
	
		exports.say = function (text, wrap) {
			delimiters = {
				first : ["/", "\\"],
				middle : ["|", "|"],
				last : ["\\", "/"],
				only : ["<", ">"]
			};
	
			return format(text, wrap, delimiters);
		}
	
		exports.think = function (text, wrap) {
			delimiters = {
				first : ["(", ")"],
				middle : ["(", ")"],
				last : ["(", ")"],
				only : ["(", ")"]
			};
	
			return format(text, wrap, delimiters);
		}
	
		function format (text, wrap, delimiters) {
			var lines = split(text, wrap);
			var maxLength = max(lines);
	
			var balloon;
			if (lines.length === 1) {
				balloon = [
					" " + top(maxLength), 
					delimiters.only[0] + " " + lines[0] + " " + delimiters.only[1],
					" " + bottom(maxLength)
				];
			} else {
				balloon = [" " + top(maxLength)];
	
				for (var i = 0, len = lines.length; i < len; i += 1) {
					var delimiter;
	
					if (i === 0) {
						delimiter = delimiters.first;
					} else if (i === len - 1) {
						delimiter = delimiters.last;
					} else {
						delimiter = delimiters.middle;
					}
	
					balloon.push(delimiter[0] + " " + pad(lines[i], maxLength) + " " + delimiter[1]);
				}
	
				balloon.push(" " + bottom(maxLength));
			}
	
			return balloon.join("\n"); //os.EOL
		}
	
		function split (text, wrap) {
			text = text.replace(/\r\n?|[\n\u2028\u2029]/g, "\n").replace(/^\uFEFF/, '').replace(/\t/g, '        ');
	
			var lines = [];
			if (!wrap) {
				lines = text.split("\n");
			} else {
				var start = 0;
				while (start < text.length) {
					var nextNewLine = text.indexOf("\n", start);
	
					var wrapAt = Math.min(start + wrap, nextNewLine === -1 ? text.length : nextNewLine);
	
					lines.push(text.substring(start, wrapAt));
					start = wrapAt;
	
					// Ignore next new line
					if (text.charAt(start) === "\n") {
						start += 1;
					}
				}
			}
	
			return lines;
		}
	
		function max (lines) {
			var max = 0;
			for (var i = 0, len = lines.length; i < len; i += 1) {
				if (lines[i].length > max) {
					max = lines[i].length;
				}
			}
	
			return max;
		}
	
		function pad (text, length) {
			return text + (new Array(length - text.length + 1)).join(" ");
		}
	
		function top (length) {
			return new Array(length + 3).join("_");
		}
	
		function bottom (length) {
			return new Array(length + 3).join("-");
		}
	
	
	/***/ },
	/* 3 */
	/*!****************************!*\
	  !*** ./cowsay/lib/cows.js ***!
	  \****************************/
	/***/ function(module, exports, __webpack_require__) {
	
		var replacer = __webpack_require__(/*! ./replacer */ 4);
		var cows = {
			default: __webpack_require__(/*! text!../cows/doge.cow */ 5),
		};
	
		exports.get = function (cow) {
			var text = cows[cow];
	
			return function (options) {
				return replacer(text, options);
			};
		}
	
		exports.list = function (callback) {
			callback(null, cows.keys());
		}
	
	
	/***/ },
	/* 4 */
	/*!********************************!*\
	  !*** ./cowsay/lib/replacer.js ***!
	  \********************************/
	/***/ function(module, exports) {
	
		module.exports = function (cow, variables) {
			var eyes = escapeRe(variables.eyes);
			var tongue = escapeRe(variables.tongue);
	
			if (cow.indexOf("$the_cow") !== -1) {
				cow = extractTheCow(cow);
			}
	
			return cow
				.replace(/\$thoughts/g, variables.thoughts)
				.replace(/\$eyes/g, eyes)
				.replace(/\$tongue/g, tongue)
				.replace(/\$\{eyes\}/g, eyes)
				.replace(/\$\{tongue\}/g, tongue)
			;
		};
	
		/*
		 * "$" dollar signs must be doubled before being used in a regex replace
		 * This can occur in eyes or tongue.
		 * For example:
		 *
		 * cowsay -g Moo!
		 *
		 * cowsay -e "\$\$" Moo!
		 */
		function escapeRe (s) {
			if (s && s.replace) {
				return s.replace(/\$/g, "$$$$");
			}
			return s;
		}
	
		function extractTheCow (cow) {
			cow = cow.replace(/\r\n?|[\n\u2028\u2029]/g, "\n").replace(/^\uFEFF/, '');
			var match = /\$the_cow\s*=\s*<<"*EOC"*;*\n([\s\S]+)\nEOC\n/.exec(cow);
	
			if (!match) {
				console.error("Cannot parse cow file\n", cow);
				return cow;
			} else {
				return match[1].replace(/\\{2}/g, "\\").replace(/\\@/g, "@").replace(/\\\$/g, "$");
			}
		}
	
	/***/ },
	/* 5 */
	/*!**********************************************!*\
	  !*** ./~/text-loader!./cowsay/cows/doge.cow ***!
	  \**********************************************/
	/***/ function(module, exports) {
	
		module.exports = "##\n## Doge\n##\n$the_cow = <<EOC;\n   $thoughts\n    $thoughts\n\n           _                _\n          / /.           _-//\n         / ///         _-   /\n        //_-//=========     /\n      _///        //_ ||   ./\n    _|                 -__-||\n   |  __              - \\\\   \\\n  |  |#-       _-|_           |\n  |            |#|||       _   |  \n |  _==_                       ||\n- ==|.=.=|_ =                  |\n|  |-|-  ___                  |\n|    --__   _                /\n||     ===                  |\n |                     _. //\n  ||_         __-   _-  _|\n     \\_______/  ___/  _|\n                   --*\nEOC\n"
	
	/***/ },
	/* 6 */
	/*!*****************************!*\
	  !*** ./cowsay/lib/faces.js ***!
	  \*****************************/
	/***/ function(module, exports) {
	
		var modes = {
			"b" : {
				eyes : "==",
				tongue : "  "
			},
			"d" : {
				eyes : "xx",
				tongue : "U "
			},
			"g" : {
				eyes : "$$",
				tongue : "  "
			},
			"p" : {
				eyes : "@@",
				tongue : "  "
			},
			"s" : {
				eyes : "**",
				tongue : "U "
			},
			"t" : {
				eyes : "--",
				tongue : "  "
			},
			"w" : {
				eyes : "OO",
				tongue : "  "
			},
			"y" : {
				eyes : "..",
				tongue : "  "
			}
		};
	
		module.exports = function (options) {
			for (var mode in modes) {
				if (options[mode] === true) {
					return modes[mode];
				}
			}
	
			return {
				eyes : options.e || "oo",
				tongue : options.T || "  "
			};
		};
	
	
	/***/ }
	/******/ ]);

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map