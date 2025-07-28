/*!
 * jQuery JavaScript Library v3.5.0
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2020-04-10T15:07Z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var flat = arr.flat ? function( array ) {
	return arr.flat.call( array );
} : function( array ) {
	return arr.concat.apply( [], array );
};


var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};

var isFunction = function isFunction( obj ) {

      // Support: Chrome <=57, Firefox <=52
      // In some browsers, typeof returns "function" for HTML <object> elements
      // (i.e., `typeof document.createElement( "object" ) === "function"`).
      // We don't want to classify *any* DOM node as a function.
      return typeof obj === "function" && typeof obj.nodeType !== "number";
  };


var isWindow = function isWindow( obj ) {
		return obj != null && obj === obj.window;
	};


var document = window.document;



	var preservedScriptAttributes = {
		type: true,
		src: true,
		nonce: true,
		noModule: true
	};

	function DOMEval( code, node, doc ) {
		doc = doc || document;

		var i, val,
			script = doc.createElement( "script" );

		script.text = code;
		if ( node ) {
			for ( i in preservedScriptAttributes ) {

				// Support: Firefox 64+, Edge 18+
				// Some browsers don't support the "nonce" property on scripts.
				// On the other hand, just using `getAttribute` is not enough as
				// the `nonce` attribute is reset to an empty string whenever it
				// becomes browsing-context connected.
				// See https://github.com/whatwg/html/issues/2369
				// See https://html.spec.whatwg.org/#nonce-attributes
				// The `node.getAttribute` check was added for the sake of
				// `jQuery.globalEval` so that it can fake a nonce-containing node
				// via an object.
				val = node[ i ] || node.getAttribute && node.getAttribute( i );
				if ( val ) {
					script.setAttribute( i, val );
				}
			}
		}
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}


function toType( obj ) {
	if ( obj == null ) {
		return obj + "";
	}

	// Support: Android <=2.3 only (functionish RegExp)
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ toString.call( obj ) ] || "object" :
		typeof obj;
}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.5.0",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	even: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return ( i + 1 ) % 2;
		} ) );
	},

	odd: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return i % 2;
		} ) );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				copy = options[ name ];

				// Prevent Object.prototype pollution
				// Prevent never-ending loop
				if ( name === "__proto__" || target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {
					src = target[ name ];

					// Ensure proper type for the source value
					if ( copyIsArray && !Array.isArray( src ) ) {
						clone = [];
					} else if ( !copyIsArray && !jQuery.isPlainObject( src ) ) {
						clone = {};
					} else {
						clone = src;
					}
					copyIsArray = false;

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	// Evaluates a script in a provided context; falls back to the global one
	// if not specified.
	globalEval: function( code, options, doc ) {
		DOMEval( code, { nonce: options && options.nonce }, doc );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return flat( ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( _i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = toType( obj );

	if ( isFunction( obj ) || isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.5
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://js.foundation/
 *
 * Date: 2020-03-14
 */
( function( window ) {
var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	nonnativeSelectorCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ( {} ).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	pushNative = arr.push,
	push = arr.push,
	slice = arr.slice,

	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[ i ] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|" +
		"ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
	identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace +
		"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +

		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +

		// "Attribute values must be CSS identifiers [capture 5]
		// or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" +
		whitespace + "*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +

		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +

		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +

		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" +
		whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace +
		"*" ),
	rdescend = new RegExp( whitespace + "|>" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
			whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" +
			whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),

		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace +
			"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
			"*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rhtml = /HTML$/i,
	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\([^\\r\\n\\f])", "g" ),
	funescape = function( escape, nonHex ) {
		var high = "0x" + escape.slice( 1 ) - 0x10000;

		return nonHex ?

			// Strip the backslash prefix from a non-hex escape sequence
			nonHex :

			// Replace a hexadecimal escape sequence with the encoded Unicode code point
			// Support: IE <=11+
			// For values outside the Basic Multilingual Plane (BMP), manually construct a
			// surrogate pair
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" +
				ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	inDisabledFieldset = addCombinator(
		function( elem ) {
			return elem.disabled === true && elem.nodeName.toLowerCase() === "fieldset";
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		( arr = slice.call( preferredDoc.childNodes ) ),
		preferredDoc.childNodes
	);

	// Support: Android<4.0
	// Detect silently failing push.apply
	// eslint-disable-next-line no-unused-expressions
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			pushNative.apply( target, slice.call( els ) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;

			// Can't trust NodeList.length
			while ( ( target[ j++ ] = els[ i++ ] ) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {
		setDocument( context );
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && ( match = rquickExpr.exec( selector ) ) ) {

				// ID selector
				if ( ( m = match[ 1 ] ) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( ( elem = context.getElementById( m ) ) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && ( elem = newContext.getElementById( m ) ) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[ 2 ] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( ( m = match[ 3 ] ) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!nonnativeSelectorCache[ selector + " " ] &&
				( !rbuggyQSA || !rbuggyQSA.test( selector ) ) &&

				// Support: IE 8 only
				// Exclude object elements
				( nodeType !== 1 || context.nodeName.toLowerCase() !== "object" ) ) {

				newSelector = selector;
				newContext = context;

				// qSA considers elements outside a scoping root when evaluating child or
				// descendant combinators, which is not what we want.
				// In such cases, we work around the behavior by prefixing every selector in the
				// list with an ID selector referencing the scope context.
				// The technique has to be used as well when a leading combinator is used
				// as such selectors are not recognized by querySelectorAll.
				// Thanks to Andrew Dupont for this technique.
				if ( nodeType === 1 &&
					( rdescend.test( selector ) || rcombinators.test( selector ) ) ) {

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;

					// We can use :scope instead of the ID hack if the browser
					// supports it & if we're not changing the context.
					if ( newContext !== context || !support.scope ) {

						// Capture the context ID, setting it first if necessary
						if ( ( nid = context.getAttribute( "id" ) ) ) {
							nid = nid.replace( rcssescape, fcssescape );
						} else {
							context.setAttribute( "id", ( nid = expando ) );
						}
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[ i ] = ( nid ? "#" + nid : ":scope" ) + " " +
							toSelector( groups[ i ] );
					}
					newSelector = groups.join( "," );
				}

				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch ( qsaError ) {
					nonnativeSelectorCache( selector, true );
				} finally {
					if ( nid === expando ) {
						context.removeAttribute( "id" );
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {

		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {

			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return ( cache[ key + " " ] = value );
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement( "fieldset" );

	try {
		return !!fn( el );
	} catch ( e ) {
		return false;
	} finally {

		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}

		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split( "|" ),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[ i ] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( ( cur = cur.nextSibling ) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return ( name === "input" || name === "button" ) && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
					inDisabledFieldset( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction( function( argument ) {
		argument = +argument;
		return markFunction( function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ ( j = matchIndexes[ i ] ) ] ) {
					seed[ j ] = !( matches[ j ] = seed[ j ] );
				}
			}
		} );
	} );
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	var namespace = elem.namespaceURI,
		docElem = ( elem.ownerDocument || elem ).documentElement;

	// Support: IE <=8
	// Assume HTML when documentElement doesn't yet exist, such as inside loading iframes
	// https://bugs.jquery.com/ticket/4833
	return !rhtml.test( namespace || docElem && docElem.nodeName || "HTML" );
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( doc == document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9 - 11+, Edge 12 - 18+
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( preferredDoc != document &&
		( subWindow = document.defaultView ) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	// Support: IE 8 - 11+, Edge 12 - 18+, Chrome <=16 - 25 only, Firefox <=3.6 - 31 only,
	// Safari 4 - 5 only, Opera <=11.6 - 12.x only
	// IE/Edge & older browsers don't support the :scope pseudo-class.
	// Support: Safari 6.0 only
	// Safari 6.0 supports :scope but it's an alias of :root there.
	support.scope = assert( function( el ) {
		docElem.appendChild( el ).appendChild( document.createElement( "div" ) );
		return typeof el.querySelectorAll !== "undefined" &&
			!el.querySelectorAll( ":scope fieldset div" ).length;
	} );

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert( function( el ) {
		el.className = "i";
		return !el.getAttribute( "className" );
	} );

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert( function( el ) {
		el.appendChild( document.createComment( "" ) );
		return !el.getElementsByTagName( "*" ).length;
	} );

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert( function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	} );

	// ID filter and find
	if ( support.getById ) {
		Expr.filter[ "ID" ] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute( "id" ) === attrId;
			};
		};
		Expr.find[ "ID" ] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter[ "ID" ] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode( "id" );
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find[ "ID" ] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode( "id" );
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( ( elem = elems[ i++ ] ) ) {
						node = elem.getAttributeNode( "id" );
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find[ "TAG" ] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,

				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( ( elem = results[ i++ ] ) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find[ "CLASS" ] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( ( support.qsa = rnative.test( document.querySelectorAll ) ) ) {

		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert( function( el ) {

			var input;

			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll( "[msallowcapture^='']" ).length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll( "[selected]" ).length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push( "~=" );
			}

			// Support: IE 11+, Edge 15 - 18+
			// IE 11/Edge don't find elements on a `[name='']` query in some cases.
			// Adding a temporary attribute to the document before the selection works
			// around the issue.
			// Interestingly, IE 10 & older don't seem to have the issue.
			input = document.createElement( "input" );
			input.setAttribute( "name", "" );
			el.appendChild( input );
			if ( !el.querySelectorAll( "[name='']" ).length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*name" + whitespace + "*=" +
					whitespace + "*(?:''|\"\")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll( ":checked" ).length ) {
				rbuggyQSA.push( ":checked" );
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push( ".#.+[+~]" );
			}

			// Support: Firefox <=3.6 - 5 only
			// Old Firefox doesn't throw on a badly-escaped identifier.
			el.querySelectorAll( "\\\f" );
			rbuggyQSA.push( "[\\r\\n\\f]" );
		} );

		assert( function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement( "input" );
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll( "[name=d]" ).length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll( ":enabled" ).length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll( ":disabled" ).length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: Opera 10 - 11 only
			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll( "*,:x" );
			rbuggyQSA.push( ",.*:" );
		} );
	}

	if ( ( support.matchesSelector = rnative.test( ( matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector ) ) ) ) {

		assert( function( el ) {

			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		} );
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join( "|" ) );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join( "|" ) );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			) );
		} :
		function( a, b ) {
			if ( b ) {
				while ( ( b = b.parentNode ) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		compare = ( a.ownerDocument || a ) == ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			( !support.sortDetached && b.compareDocumentPosition( a ) === compare ) ) {

			// Choose the first element that is related to our preferred document
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( a == document || a.ownerDocument == preferredDoc &&
				contains( preferredDoc, a ) ) {
				return -1;
			}

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( b == document || b.ownerDocument == preferredDoc &&
				contains( preferredDoc, b ) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			/* eslint-disable eqeqeq */
			return a == document ? -1 :
				b == document ? 1 :
				/* eslint-enable eqeqeq */
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( ( cur = cur.parentNode ) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( ( cur = cur.parentNode ) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[ i ] === bp[ i ] ) {
			i++;
		}

		return i ?

			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[ i ], bp[ i ] ) :

			// Otherwise nodes in our document sort first
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			/* eslint-disable eqeqeq */
			ap[ i ] == preferredDoc ? -1 :
			bp[ i ] == preferredDoc ? 1 :
			/* eslint-enable eqeqeq */
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	setDocument( elem );

	if ( support.matchesSelector && documentIsHTML &&
		!nonnativeSelectorCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||

				// As well, disconnected nodes are said to be in a document
				// fragment in IE 9
				elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch ( e ) {
			nonnativeSelectorCache( expr, true );
		}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( context.ownerDocument || context ) != document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( elem.ownerDocument || elem ) != document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],

		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			( val = elem.getAttributeNode( name ) ) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return ( sel + "" ).replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( ( elem = results[ i++ ] ) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {

		// If no nodeType, this is expected to be an array
		while ( ( node = elem[ i++ ] ) ) {

			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {

		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {

			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}

	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[ 1 ] = match[ 1 ].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[ 3 ] = ( match[ 3 ] || match[ 4 ] ||
				match[ 5 ] || "" ).replace( runescape, funescape );

			if ( match[ 2 ] === "~=" ) {
				match[ 3 ] = " " + match[ 3 ] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {

			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[ 1 ] = match[ 1 ].toLowerCase();

			if ( match[ 1 ].slice( 0, 3 ) === "nth" ) {

				// nth-* requires argument
				if ( !match[ 3 ] ) {
					Sizzle.error( match[ 0 ] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[ 4 ] = +( match[ 4 ] ?
					match[ 5 ] + ( match[ 6 ] || 1 ) :
					2 * ( match[ 3 ] === "even" || match[ 3 ] === "odd" ) );
				match[ 5 ] = +( ( match[ 7 ] + match[ 8 ] ) || match[ 3 ] === "odd" );

				// other types prohibit arguments
			} else if ( match[ 3 ] ) {
				Sizzle.error( match[ 0 ] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[ 6 ] && match[ 2 ];

			if ( matchExpr[ "CHILD" ].test( match[ 0 ] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[ 3 ] ) {
				match[ 2 ] = match[ 4 ] || match[ 5 ] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&

				// Get excess from tokenize (recursively)
				( excess = tokenize( unquoted, true ) ) &&

				// advance to the next closing parenthesis
				( excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length ) ) {

				// excess is a negative index
				match[ 0 ] = match[ 0 ].slice( 0, excess );
				match[ 2 ] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() {
					return true;
				} :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				( pattern = new RegExp( "(^|" + whitespace +
					")" + className + "(" + whitespace + "|$)" ) ) && classCache(
						className, function( elem ) {
							return pattern.test(
								typeof elem.className === "string" && elem.className ||
								typeof elem.getAttribute !== "undefined" &&
									elem.getAttribute( "class" ) ||
								""
							);
				} );
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				/* eslint-disable max-len */

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
				/* eslint-enable max-len */

			};
		},

		"CHILD": function( type, what, _argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, _context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( ( node = node[ dir ] ) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}

								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || ( node[ expando ] = {} );

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								( outerCache[ node.uniqueID ] = {} );

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( ( node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								( diff = nodeIndex = 0 ) || start.pop() ) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {

							// Use previously-cached element index if available
							if ( useCache ) {

								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || ( node[ expando ] = {} );

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									( outerCache[ node.uniqueID ] = {} );

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {

								// Use the same loop as above to seek `elem` from the start
								while ( ( node = ++nodeIndex && node && node[ dir ] ||
									( diff = nodeIndex = 0 ) || start.pop() ) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] ||
												( node[ expando ] = {} );

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												( outerCache[ node.uniqueID ] = {} );

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {

			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction( function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[ i ] );
							seed[ idx ] = !( matches[ idx ] = matched[ i ] );
						}
					} ) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {

		// Potentially complex pseudos
		"not": markFunction( function( selector ) {

			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction( function( seed, matches, _context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( ( elem = unmatched[ i ] ) ) {
							seed[ i ] = !( matches[ i ] = elem );
						}
					}
				} ) :
				function( elem, _context, xml ) {
					input[ 0 ] = elem;
					matcher( input, null, xml, results );

					// Don't keep the element (issue #299)
					input[ 0 ] = null;
					return !results.pop();
				};
		} ),

		"has": markFunction( function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		} ),

		"contains": markFunction( function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || getText( elem ) ).indexOf( text ) > -1;
			};
		} ),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {

			// lang value must be a valid identifier
			if ( !ridentifier.test( lang || "" ) ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( ( elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute( "xml:lang" ) || elem.getAttribute( "lang" ) ) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( ( elem = elem.parentNode ) && elem.nodeType === 1 );
				return false;
			};
		} ),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement &&
				( !document.hasFocus || document.hasFocus() ) &&
				!!( elem.type || elem.href || ~elem.tabIndex );
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {

			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return ( nodeName === "input" && !!elem.checked ) ||
				( nodeName === "option" && !!elem.selected );
		},

		"selected": function( elem ) {

			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				// eslint-disable-next-line no-unused-expressions
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {

			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos[ "empty" ]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( ( attr = elem.getAttribute( "type" ) ) == null ||
					attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo( function() {
			return [ 0 ];
		} ),

		"last": createPositionalPseudo( function( _matchIndexes, length ) {
			return [ length - 1 ];
		} ),

		"eq": createPositionalPseudo( function( _matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		} ),

		"even": createPositionalPseudo( function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"odd": createPositionalPseudo( function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"lt": createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ?
				argument + length :
				argument > length ?
					length :
					argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"gt": createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} )
	}
};

Expr.pseudos[ "nth" ] = Expr.pseudos[ "eq" ];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || ( match = rcomma.exec( soFar ) ) ) {
			if ( match ) {

				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[ 0 ].length ) || soFar;
			}
			groups.push( ( tokens = [] ) );
		}

		matched = false;

		// Combinators
		if ( ( match = rcombinators.exec( soFar ) ) ) {
			matched = match.shift();
			tokens.push( {
				value: matched,

				// Cast descendant combinators to space
				type: match[ 0 ].replace( rtrim, " " )
			} );
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( ( match = matchExpr[ type ].exec( soFar ) ) && ( !preFilters[ type ] ||
				( match = preFilters[ type ]( match ) ) ) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :

			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[ i ].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?

		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( ( elem = elem[ dir ] ) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || ( elem[ expando ] = {} );

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] ||
							( outerCache[ elem.uniqueID ] = {} );

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( ( oldCache = uniqueCache[ key ] ) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return ( newCache[ 2 ] = oldCache[ 2 ] );
						} else {

							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( ( newCache[ 2 ] = matcher( elem, context, xml ) ) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[ i ]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[ 0 ];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[ i ], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( ( elem = unmatched[ i ] ) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction( function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts(
				selector || "*",
				context.nodeType ? [ context ] : context,
				[]
			),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?

				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( ( elem = temp[ i ] ) ) {
					matcherOut[ postMap[ i ] ] = !( matcherIn[ postMap[ i ] ] = elem );
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {

					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( ( elem = matcherOut[ i ] ) ) {

							// Restore matcherIn since elem is not yet a final match
							temp.push( ( matcherIn[ i ] = elem ) );
						}
					}
					postFinder( null, ( matcherOut = [] ), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( ( elem = matcherOut[ i ] ) &&
						( temp = postFinder ? indexOf( seed, elem ) : preMap[ i ] ) > -1 ) {

						seed[ temp ] = !( results[ temp ] = elem );
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	} );
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[ 0 ].type ],
		implicitRelative = leadingRelative || Expr.relative[ " " ],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				( checkContext = context ).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );

			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( ( matcher = Expr.relative[ tokens[ i ].type ] ) ) {
			matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
		} else {
			matcher = Expr.filter[ tokens[ i ].type ].apply( null, tokens[ i ].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {

				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[ j ].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(

					// If the preceding token was a descendant combinator, insert an implicit any-element `*`
					tokens
						.slice( 0, i - 1 )
						.concat( { value: tokens[ i - 2 ].type === " " ? "*" : "" } )
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( ( tokens = tokens.slice( j ) ) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,

				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find[ "TAG" ]( "*", outermost ),

				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = ( dirruns += contextBackup == null ? 1 : Math.random() || 0.1 ),
				len = elems.length;

			if ( outermost ) {

				// Support: IE 11+, Edge 17 - 18+
				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
				// two documents; shallow comparisons work.
				// eslint-disable-next-line eqeqeq
				outermostContext = context == document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && ( elem = elems[ i ] ) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;

					// Support: IE 11+, Edge 17 - 18+
					// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
					// two documents; shallow comparisons work.
					// eslint-disable-next-line eqeqeq
					if ( !context && elem.ownerDocument != document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( ( matcher = elementMatchers[ j++ ] ) ) {
						if ( matcher( elem, context || document, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {

					// They will have gone through all possible matchers
					if ( ( elem = !matcher && elem ) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( ( matcher = setMatchers[ j++ ] ) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {

					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !( unmatched[ i ] || setMatched[ i ] ) ) {
								setMatched[ i ] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {

		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[ i ] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache(
			selector,
			matcherFromGroupMatchers( elementMatchers, setMatchers )
		);

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( ( selector = compiled.selector || selector ) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[ 0 ] = match[ 0 ].slice( 0 );
		if ( tokens.length > 2 && ( token = tokens[ 0 ] ).type === "ID" &&
			context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[ 1 ].type ] ) {

			context = ( Expr.find[ "ID" ]( token.matches[ 0 ]
				.replace( runescape, funescape ), context ) || [] )[ 0 ];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr[ "needsContext" ].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[ i ];

			// Abort if we hit a combinator
			if ( Expr.relative[ ( type = token.type ) ] ) {
				break;
			}
			if ( ( find = Expr.find[ type ] ) ) {

				// Search, expanding context for leading sibling combinators
				if ( ( seed = find(
					token.matches[ 0 ].replace( runescape, funescape ),
					rsibling.test( tokens[ 0 ].type ) && testContext( context.parentNode ) ||
						context
				) ) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split( "" ).sort( sortOrder ).join( "" ) === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert( function( el ) {

	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement( "fieldset" ) ) & 1;
} );

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert( function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute( "href" ) === "#";
} ) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	} );
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert( function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
} ) ) {
	addHandle( "value", function( elem, _name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	} );
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert( function( el ) {
	return el.getAttribute( "disabled" ) == null;
} ) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
				( val = elem.getAttributeNode( name ) ) && val.specified ?
					val.value :
					null;
		}
	} );
}

return Sizzle;

} )( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;



function nodeName( elem, name ) {

  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

};
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Filtered directly for both simple and complex selectors
	return jQuery.filter( qualifier, elements, not );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, _i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, _i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, _i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		if ( elem.contentDocument != null &&

			// Support: IE 11+
			// <object> elements with no `data` attribute has an object
			// `contentDocument` with a `null` prototype.
			getProto( elem.contentDocument ) ) {

			return elem.contentDocument;
		}

		// Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
		// Treat the template element as a regular one in browsers that
		// don't support it.
		if ( nodeName( elem, "template" ) ) {
			elem = elem.content || elem;
		}

		return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && toType( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( _i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// rejected_handlers.disable
					// fulfilled_handlers.disable
					tuples[ 3 - i ][ 3 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock,

					// progress_handlers.lock
					tuples[ 0 ][ 3 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the master Deferred
			master = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						master.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( master.state() === "pending" ||
				isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return master.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
		}

		return master.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( toType( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, _key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};


// Matches dashed string for camelizing
var rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g;

// Used by camelCase as callback to replace()
function fcamelCase( _all, letter ) {
	return letter.toUpperCase();
}

// Convert dashed to camelCase; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (#9572)
function camelCase( string ) {
	return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
}
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = Object.create( null );

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( camelCase );
			} else {
				key = camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var documentElement = document.documentElement;



	var isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem );
		},
		composed = { composed: true };

	// Support: IE 9 - 11+, Edge 12 - 18+, iOS 10.0 - 10.2 only
	// Check attachment across shadow DOM boundaries when possible (gh-3504)
	// Support: iOS 10.0-10.2 only
	// Early iOS 10 versions support `attachShadow` but not `getRootNode`,
	// leading to errors. We need to check for `getRootNode`.
	if ( documentElement.getRootNode ) {
		isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem ) ||
				elem.getRootNode( composed ) === elem.ownerDocument;
		};
	}
var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			isAttached( elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};



function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted, scale,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = elem.nodeType &&
			( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Support: Firefox <=54
		// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
		initial = initial / 2;

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		while ( maxIterations-- ) {

			// Evaluate and update our best guess (doubling guesses that zero out).
			// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
			jQuery.style( elem, prop, initialInUnit + unit );
			if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
				maxIterations = 0;
			}
			initialInUnit = initialInUnit / scale;

		}

		initialInUnit = initialInUnit * 2;
		jQuery.style( elem, prop, initialInUnit + unit );

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]*)/i );

var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );



( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

	// Support: IE <=9 only
	// IE <=9 replaces <option> tags with their contents when inserted outside of
	// the select element.
	div.innerHTML = "<option></option>";
	support.option = !!div.lastChild;
} )();


// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// Support: IE <=9 only
if ( !support.option ) {
	wrapMap.optgroup = wrapMap.option = [ 1, "<select multiple='multiple'>", "</select>" ];
}


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, attached, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( toType( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		attached = isAttached( elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( attached ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 - 11+
// focus() and blur() are asynchronous, except when they are no-op.
// So expect focus to be synchronous when the element is already active,
// and blur to be synchronous when the element is not already active.
// (focus and blur are always synchronous in other supported browsers,
// this just defines when we can count on it).
function expectSync( elem, type ) {
	return ( elem === safeActiveElement() ) === ( type === "focus" );
}

// Support: IE <=9 only
// Accessing document.activeElement can throw unexpectedly
// https://bugs.jquery.com/ticket/13393
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Only attach events to objects that accept data
		if ( !acceptData( elem ) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = Object.create( null );
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),

			// Make a writable jQuery.Event from the native event object
			event = jQuery.event.fix( nativeEvent ),

			handlers = (
					dataPriv.get( this, "events" ) || Object.create( null )
				)[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// If the event is namespaced, then each handler is only invoked if it is
				// specially universal or its namespaces are a superset of the event's.
				if ( !event.rnamespace || handleObj.namespace === false ||
					event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
							return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
							return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		click: {

			// Utilize native event to ensure correct state for checkable inputs
			setup: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Claim the first handler
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					// dataPriv.set( el, "click", ... )
					leverageNative( el, "click", returnTrue );
				}

				// Return false to allow normal processing in the caller
				return false;
			},
			trigger: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Force setup before triggering a click
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					leverageNative( el, "click" );
				}

				// Return non-false to allow normal event-path propagation
				return true;
			},

			// For cross-browser consistency, suppress native .click() on links
			// Also prevent it if we're currently inside a leveraged native-event stack
			_default: function( event ) {
				var target = event.target;
				return rcheckableType.test( target.type ) &&
					target.click && nodeName( target, "input" ) &&
					dataPriv.get( target, "click" ) ||
					nodeName( target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

// Ensure the presence of an event listener that handles manually-triggered
// synthetic events by interrupting progress until reinvoked in response to
// *native* events that it fires directly, ensuring that state changes have
// already occurred before other listeners are invoked.
function leverageNative( el, type, expectSync ) {

	// Missing expectSync indicates a trigger call, which must force setup through jQuery.event.add
	if ( !expectSync ) {
		if ( dataPriv.get( el, type ) === undefined ) {
			jQuery.event.add( el, type, returnTrue );
		}
		return;
	}

	// Register the controller as a special universal handler for all event namespaces
	dataPriv.set( el, type, false );
	jQuery.event.add( el, type, {
		namespace: false,
		handler: function( event ) {
			var notAsync, result,
				saved = dataPriv.get( this, type );

			if ( ( event.isTrigger & 1 ) && this[ type ] ) {

				// Interrupt processing of the outer synthetic .trigger()ed event
				// Saved data should be false in such cases, but might be a leftover capture object
				// from an async native handler (gh-4350)
				if ( !saved.length ) {

					// Store arguments for use when handling the inner native event
					// There will always be at least one argument (an event object), so this array
					// will not be confused with a leftover capture object.
					saved = slice.call( arguments );
					dataPriv.set( this, type, saved );

					// Trigger the native event and capture its result
					// Support: IE <=9 - 11+
					// focus() and blur() are asynchronous
					notAsync = expectSync( this, type );
					this[ type ]();
					result = dataPriv.get( this, type );
					if ( saved !== result || notAsync ) {
						dataPriv.set( this, type, false );
					} else {
						result = {};
					}
					if ( saved !== result ) {

						// Cancel the outer synthetic event
						event.stopImmediatePropagation();
						event.preventDefault();
						return result.value;
					}

				// If this is an inner synthetic event for an event with a bubbling surrogate
				// (focus or blur), assume that the surrogate already propagated from triggering the
				// native event and prevent that from happening again here.
				// This technically gets the ordering wrong w.r.t. to `.trigger()` (in which the
				// bubbling surrogate propagates *after* the non-bubbling base), but that seems
				// less bad than duplication.
				} else if ( ( jQuery.event.special[ type ] || {} ).delegateType ) {
					event.stopPropagation();
				}

			// If this is a native event triggered above, everything is now in order
			// Fire an inner synthetic event with the original arguments
			} else if ( saved.length ) {

				// ...and capture the result
				dataPriv.set( this, type, {
					value: jQuery.event.trigger(

						// Support: IE <=9 - 11+
						// Extend with the prototype to reset the above stopImmediatePropagation()
						jQuery.extend( saved[ 0 ], jQuery.Event.prototype ),
						saved.slice( 1 ),
						this
					)
				} );

				// Abort handling of the native event
				event.stopImmediatePropagation();
			}
		}
	} );
}

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || Date.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	code: true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,

	which: function( event ) {
		var button = event.button;

		// Add which for key events
		if ( event.which == null && rkeyEvent.test( event.type ) ) {
			return event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
			if ( button & 1 ) {
				return 1;
			}

			if ( button & 2 ) {
				return 3;
			}

			if ( button & 4 ) {
				return 2;
			}

			return 0;
		}

		return event.which;
	}
}, jQuery.event.addProp );

jQuery.each( { focus: "focusin", blur: "focusout" }, function( type, delegateType ) {
	jQuery.event.special[ type ] = {

		// Utilize native event if possible so blur/focus sequence is correct
		setup: function() {

			// Claim the first handler
			// dataPriv.set( this, "focus", ... )
			// dataPriv.set( this, "blur", ... )
			leverageNative( this, type, expectSync );

			// Return false to allow normal processing in the caller
			return false;
		},
		trigger: function() {

			// Force setup before trigger
			leverageNative( this, type );

			// Return non-false to allow normal event-path propagation
			return true;
		},

		delegateType: delegateType
	};
} );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	// Support: IE <=10 - 11, Edge 12 - 13 only
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
		elem.type = elem.type.slice( 5 );
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.get( src );
		events = pdataOld.events;

		if ( events ) {
			dataPriv.remove( dest, "handle events" );

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = flat( args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		valueIsFunction = isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( valueIsFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( valueIsFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl && !node.noModule ) {
								jQuery._evalUrl( node.src, {
									nonce: node.nonce || node.getAttribute( "nonce" )
								}, doc );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), node, doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && isAttached( node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html;
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = isAttached( elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

var swap = function( elem, options, callback ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.call( elem );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var rboxStyle = new RegExp( cssExpand.join( "|" ), "i" );



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
			"margin-top:1px;padding:0;border:0";
		div.style.cssText =
			"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
			"margin:auto;border:1px;padding:1px;" +
			"width:60%;top:1%";
		documentElement.appendChild( container ).appendChild( div );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

		// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
		// Some styles come back with percentage values, even though they shouldn't
		div.style.right = "60%";
		pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

		// Support: IE 9 - 11 only
		// Detect misreporting of content dimensions for box-sizing:border-box elements
		boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

		// Support: IE 9 only
		// Detect overflow:scroll screwiness (gh-3699)
		// Support: Chrome <=64
		// Don't get tricked when zoom affects offsetWidth (gh-4029)
		div.style.position = "absolute";
		scrollboxSizeVal = roundPixelMeasures( div.offsetWidth / 3 ) === 12;

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	function roundPixelMeasures( measure ) {
		return Math.round( parseFloat( measure ) );
	}

	var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
		reliableTrDimensionsVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	jQuery.extend( support, {
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelBoxStyles: function() {
			computeStyleTests();
			return pixelBoxStylesVal;
		},
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		},
		scrollboxSize: function() {
			computeStyleTests();
			return scrollboxSizeVal;
		},

		// Support: IE 9 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Behavior in IE 9 is more subtle than in newer versions & it passes
		// some versions of this test; make sure not to make it pass there!
		reliableTrDimensions: function() {
			var table, tr, trChild, trStyle;
			if ( reliableTrDimensionsVal == null ) {
				table = document.createElement( "table" );
				tr = document.createElement( "tr" );
				trChild = document.createElement( "div" );

				table.style.cssText = "position:absolute;left:-11111px";
				tr.style.height = "1px";
				trChild.style.height = "9px";

				documentElement
					.appendChild( table )
					.appendChild( tr )
					.appendChild( trChild );

				trStyle = window.getComputedStyle( tr );
				reliableTrDimensionsVal = parseInt( trStyle.height ) > 3;

				documentElement.removeChild( table );
			}
			return reliableTrDimensionsVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, #12537)
	//   .css('--customProperty) (#3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !isAttached( elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style,
	vendorProps = {};

// Return a vendor-prefixed property or undefined
function vendorPropName( name ) {

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a potentially-mapped jQuery.cssProps or vendor prefixed property
function finalPropName( name ) {
	var final = jQuery.cssProps[ name ] || vendorProps[ name ];

	if ( final ) {
		return final;
	}
	if ( name in emptyStyle ) {
		return name;
	}
	return vendorProps[ name ] = vendorPropName( name ) || name;
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rcustomProp = /^--/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	};

function setPositiveNumber( _elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
	var i = dimension === "width" ? 1 : 0,
		extra = 0,
		delta = 0;

	// Adjustment may not be necessary
	if ( box === ( isBorderBox ? "border" : "content" ) ) {
		return 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin
		if ( box === "margin" ) {
			delta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
		}

		// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
		if ( !isBorderBox ) {

			// Add padding
			delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// For "border" or "margin", add border
			if ( box !== "padding" ) {
				delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

			// But still keep track of it otherwise
			} else {
				extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}

		// If we get here with a border-box (content + padding + border), we're seeking "content" or
		// "padding" or "margin"
		} else {

			// For "content", subtract padding
			if ( box === "content" ) {
				delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// For "content" or "padding", subtract border
			if ( box !== "margin" ) {
				delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	// Account for positive content-box scroll gutter when requested by providing computedVal
	if ( !isBorderBox && computedVal >= 0 ) {

		// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
		// Assuming integer scroll gutter, subtract the rest and round down
		delta += Math.max( 0, Math.ceil(
			elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
			computedVal -
			delta -
			extra -
			0.5

		// If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
		// Use an explicit zero to avoid NaN (gh-3964)
		) ) || 0;
	}

	return delta;
}

function getWidthOrHeight( elem, dimension, extra ) {

	// Start with computed style
	var styles = getStyles( elem ),

		// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-4322).
		// Fake content-box until we know it's needed to know the true value.
		boxSizingNeeded = !support.boxSizingReliable() || extra,
		isBorderBox = boxSizingNeeded &&
			jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
		valueIsBorderBox = isBorderBox,

		val = curCSS( elem, dimension, styles ),
		offsetProp = "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 );

	// Support: Firefox <=54
	// Return a confounding non-pixel value or feign ignorance, as appropriate.
	if ( rnumnonpx.test( val ) ) {
		if ( !extra ) {
			return val;
		}
		val = "auto";
	}


	// Support: IE 9 - 11 only
	// Use offsetWidth/offsetHeight for when box sizing is unreliable.
	// In those cases, the computed value can be trusted to be border-box.
	if ( ( !support.boxSizingReliable() && isBorderBox ||

		// Support: IE 10 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Interestingly, in some cases IE 9 doesn't suffer from this issue.
		!support.reliableTrDimensions() && nodeName( elem, "tr" ) ||

		// Fall back to offsetWidth/offsetHeight when value is "auto"
		// This happens for inline elements with no explicit setting (gh-3571)
		val === "auto" ||

		// Support: Android <=4.1 - 4.3 only
		// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
		!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) &&

		// Make sure the element is visible & connected
		elem.getClientRects().length ) {

		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

		// Where available, offsetWidth/offsetHeight approximate border box dimensions.
		// Where not available (e.g., SVG), assume unreliable box-sizing and interpret the
		// retrieved value as a content box dimension.
		valueIsBorderBox = offsetProp in elem;
		if ( valueIsBorderBox ) {
			val = elem[ offsetProp ];
		}
	}

	// Normalize "" and auto
	val = parseFloat( val ) || 0;

	// Adjust for the element's box model
	return ( val +
		boxModelAdjustment(
			elem,
			dimension,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles,

			// Provide the current computed size to request scroll gutter calculation (gh-3589)
			val
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"gridArea": true,
		"gridColumn": true,
		"gridColumnEnd": true,
		"gridColumnStart": true,
		"gridRow": true,
		"gridRowEnd": true,
		"gridRowStart": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			// The isCustomProp check can be removed in jQuery 4.0 when we only auto-append
			// "px" to a few hardcoded values.
			if ( type === "number" && !isCustomProp ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( _i, dimension ) {
	jQuery.cssHooks[ dimension ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, dimension, extra );
						} ) :
						getWidthOrHeight( elem, dimension, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = getStyles( elem ),

				// Only read styles.position if the test has a chance to fail
				// to avoid forcing a reflow.
				scrollboxSizeBuggy = !support.scrollboxSize() &&
					styles.position === "absolute",

				// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-3991)
				boxSizingNeeded = scrollboxSizeBuggy || extra,
				isBorderBox = boxSizingNeeded &&
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
				subtract = extra ?
					boxModelAdjustment(
						elem,
						dimension,
						extra,
						isBorderBox,
						styles
					) :
					0;

			// Account for unreliable border-box dimensions by comparing offset* to computed and
			// faking a content-box to get border and padding (gh-3699)
			if ( isBorderBox && scrollboxSizeBuggy ) {
				subtract -= Math.ceil(
					elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
					parseFloat( styles[ dimension ] ) -
					boxModelAdjustment( elem, dimension, "border", false, styles ) -
					0.5
				);
			}

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ dimension ] = value;
				value = jQuery.css( elem, dimension );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( prefix !== "margin" ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 && (
					jQuery.cssHooks[ tween.prop ] ||
					tween.elem.style[ finalPropName( tween.prop ) ] != null ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = Date.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 15
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY and Edge just mirrors
		// the overflowX value there.
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

			/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					result.stop.bind( result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( _i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = Date.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( _i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

function classesToArray( value ) {
	if ( Array.isArray( value ) ) {
		return value;
	}
	if ( typeof value === "string" ) {
		return value.match( rnothtmlwhite ) || [];
	}
	return [];
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isValidValue = type === "string" || Array.isArray( value );

		if ( typeof stateVal === "boolean" && isValidValue ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( isValidValue ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = classesToArray( value );

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
					return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, valueIsFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		valueIsFunction = isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( valueIsFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


support.focusin = "onfocusin" in window;


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	stopPropagationCallback = function( e ) {
		e.stopPropagation();
	};

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = lastElement = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
			lastElement = cur;
			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = (
					dataPriv.get( cur, "events" ) || Object.create( null )
				)[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;

					if ( event.isPropagationStopped() ) {
						lastElement.addEventListener( type, stopPropagationCallback );
					}

					elem[ type ]();

					if ( event.isPropagationStopped() ) {
						lastElement.removeEventListener( type, stopPropagationCallback );
					}

					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {

				// Handle: regular nodes (via `this.ownerDocument`), window
				// (via `this.document`) & document (via `this`).
				var doc = this.ownerDocument || this.document || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this.document || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = { guid: Date.now() };

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && toType( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	if ( a == null ) {
		return "";
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( _i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );
	originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() + " " ] =
									( responseHeaders[ match[ 1 ].toLowerCase() + " " ] || [] )
										.concat( match[ 2 ] );
							}
						}
						match = responseHeaders[ key.toLowerCase() + " " ];
					}
					return match == null ? null : match.join( ", " );
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 15
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available and should be processed, append data to url
			if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce.guid++ ) +
					uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Use a noop converter for missing script
			if ( !isSuccess && jQuery.inArray( "script", s.dataTypes ) > -1 ) {
				s.converters[ "text script" ] = function() {};
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( _i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );

jQuery.ajaxPrefilter( function( s ) {
	var i;
	for ( i in s.headers ) {
		if ( i.toLowerCase() === "content-type" ) {
			s.contentType = s.headers[ i ] || "";
		}
	}
} );


jQuery._evalUrl = function( url, options, doc ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,

		// Only evaluate the response if it is successful (gh-4126)
		// dataFilter is not invoked for failure responses, so using it instead
		// of the default converter is kludgy but it works.
		converters: {
			"text script": function() {}
		},
		dataFilter: function( response ) {
			jQuery.globalEval( response, options, doc );
		}
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var htmlIsFunction = isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.ontimeout =
									xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain or forced-by-attrs requests
	if ( s.crossDomain || s.scriptAttrs ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" )
					.attr( s.scriptAttrs || {} )
					.prop( { charset: s.scriptCharset, src: s.url } )
					.on( "load error", callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					} );

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce.guid++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			if ( typeof props.top === "number" ) {
				props.top += "px";
			}
			if ( typeof props.left === "number" ) {
				props.left += "px";
			}
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {

	// offset() relates an element's border box to the document origin
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		// Get document-relative position by adding viewport scroll to viewport-relative gBCR
		rect = elem.getBoundingClientRect();
		win = elem.ownerDocument.defaultView;
		return {
			top: rect.top + win.pageYOffset,
			left: rect.left + win.pageXOffset
		};
	},

	// position() relates an element's margin box to its offset parent's padding box
	// This corresponds to the behavior of CSS absolute positioning
	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset, doc,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// position:fixed elements are offset from the viewport, which itself always has zero offset
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume position:fixed implies availability of getBoundingClientRect
			offset = elem.getBoundingClientRect();

		} else {
			offset = this.offset();

			// Account for the *real* offset parent, which can be the document or its root element
			// when a statically positioned element is identified
			doc = elem.ownerDocument;
			offsetParent = elem.offsetParent || doc.documentElement;
			while ( offsetParent &&
				( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) {

				offsetParent = offsetParent.parentNode;
			}
			if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

				// Incorporate borders into its offset, since they are outside its content origin
				parentOffset = jQuery( offsetParent ).offset();
				parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
			}
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( _i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( _i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );

jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( _i, name ) {

		// Handle event binding
		jQuery.fn[ name ] = function( data, fn ) {
			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};
	} );




// Support: Android <=4.0 only
// Make sure we trim BOM and NBSP
var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

// Bind a function to a context, optionally partially applying any
// arguments.
// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
// However, it is not slated for removal any time soon
jQuery.proxy = function( fn, context ) {
	var tmp, args, proxy;

	if ( typeof context === "string" ) {
		tmp = fn[ context ];
		context = fn;
		fn = tmp;
	}

	// Quick check to determine if target is callable, in the spec
	// this throws a TypeError, but we will just return undefined.
	if ( !isFunction( fn ) ) {
		return undefined;
	}

	// Simulated bind
	args = slice.call( arguments, 2 );
	proxy = function() {
		return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
	};

	// Set the guid of unique handler to the same of original handler, so it can be removed
	proxy.guid = fn.guid = fn.guid || jQuery.guid++;

	return proxy;
};

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;
jQuery.isFunction = isFunction;
jQuery.isWindow = isWindow;
jQuery.camelCase = camelCase;
jQuery.type = toType;

jQuery.now = Date.now;

jQuery.isNumeric = function( obj ) {

	// As of jQuery 3.0, isNumeric is limited to
	// strings and numbers (primitives or objects)
	// that can be coerced to finite numbers (gh-2662)
	var type = jQuery.type( obj );
	return ( type === "number" || type === "string" ) &&

		// parseFloat NaNs numeric-cast false positives ("")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		!isNaN( obj - parseFloat( obj ) );
};

jQuery.trim = function( text ) {
	return text == null ?
		"" :
		( text + "" ).replace( rtrim, "" );
};



// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( typeof noGlobal === "undefined" ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );

var globalPowerbi = powerbi;
var taskboard7A11309AC21042A28A78716F6638A2B0=function(t){var n={};function e(r){if(n[r])return n[r].exports;var i=n[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,e),i.l=!0,i.exports}return e.m=t,e.c=n,e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:r})},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,n){if(1&n&&(t=e(t)),8&n)return t;if(4&n&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(e.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&n&&"string"!=typeof t)for(var i in t)e.d(r,i,function(n){return t[n]}.bind(null,i));return r},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},e.p="assets",e(e.s=322)}([function(t,n,e){"use strict";e.d(n,"c",(function(){return i})),e.d(n,"a",(function(){return f}));var r={},i=null;"undefined"!=typeof document&&("onmouseenter"in document.documentElement||(r={mouseenter:"mouseover",mouseleave:"mouseout"}));function o(t,n,e){return t=u(t,n,e),function(n){var e=n.relatedTarget;e&&(e===this||8&e.compareDocumentPosition(this))||t.call(this,n)}}function u(t,n,e){return function(r){var o=i;i=r;try{t.call(this,this.__data__,n,e)}finally{i=o}}}function a(t){return t.trim().split(/^|\s+/).map((function(t){var n="",e=t.indexOf(".");return e>=0&&(n=t.slice(e+1),t=t.slice(0,e)),{type:t,name:n}}))}function c(t){return function(){var n=this.__on;if(n){for(var e,r=0,i=-1,o=n.length;r<o;++r)e=n[r],t.type&&e.type!==t.type||e.name!==t.name?n[++i]=e:this.removeEventListener(e.type,e.listener,e.capture);++i?n.length=i:delete this.__on}}}function s(t,n,e){var i=r.hasOwnProperty(t.type)?o:u;return function(r,o,u){var a,c=this.__on,s=i(n,o,u);if(c)for(var f=0,l=c.length;f<l;++f)if((a=c[f]).type===t.type&&a.name===t.name)return this.removeEventListener(a.type,a.listener,a.capture),this.addEventListener(a.type,a.listener=s,a.capture=e),void(a.value=n);this.addEventListener(t.type,s,e),a={type:t.type,name:t.name,value:n,listener:s,capture:e},c?c.push(a):this.__on=[a]}}function f(t,n,e,r){var o=i;t.sourceEvent=i,i=t;try{return n.apply(e,r)}finally{i=o}}n.b=function(t,n,e){var r,i,o=a(t+""),u=o.length;if(!(arguments.length<2)){for(f=n?s:c,null==e&&(e=!1),r=0;r<u;++r)this.each(f(o[r],n,e));return this}var f=this.node().__on;if(f)for(var l,h=0,d=f.length;h<d;++h)for(r=0,l=f[h];r<u;++r)if((i=o[r]).type===l.type&&i.name===l.name)return l.value}},function(t,n,e){"use strict";e.d(n,"f",(function(){return h})),e.d(n,"g",(function(){return d})),e.d(n,"a",(function(){return r})),e.d(n,"b",(function(){return i})),e.d(n,"c",(function(){return o})),e.d(n,"e",(function(){return u})),e.d(n,"d",(function(){return p}));var r,i,o,u,a=e(142),c=e(69),s=e(18),f=e(17),l=e(40),h=1e-6,d=1e-12;function v(t,n){return n[1]-t[1]||n[0]-t[0]}function p(t,n){var e,h,d,p=t.sort(v).pop();for(u=[],i=new Array(t.length),r=new l.b,o=new l.b;;)if(d=s.c,p&&(!d||p[1]<d.y||p[1]===d.y&&p[0]<d.x))p[0]===e&&p[1]===h||(Object(a.a)(p),e=p[0],h=p[1]),p=t.pop();else{if(!d)break;Object(a.b)(d.arc)}if(Object(c.d)(),n){var g=+n[0][0],y=+n[0][1],b=+n[1][0],m=+n[1][1];Object(f.a)(g,y,b,m),Object(c.b)(g,y,b,m)}this.edges=u,this.cells=i,r=o=u=i=null}p.prototype={constructor:p,polygons:function(){var t=this.edges;return this.cells.map((function(n){var e=n.halfedges.map((function(e){return Object(c.a)(n,t[e])}));return e.data=n.site.data,e}))},triangles:function(){var t=[],n=this.edges;return this.cells.forEach((function(e,r){if(o=(i=e.halfedges).length)for(var i,o,u,a,c,s,f=e.site,l=-1,h=n[i[o-1]],d=h.left===f?h.right:h.left;++l<o;)u=d,d=(h=n[i[l]]).left===f?h.right:h.left,u&&d&&r<u.index&&r<d.index&&(c=u,s=d,((a=f)[0]-s[0])*(c[1]-a[1])-(a[0]-c[0])*(s[1]-a[1])<0)&&t.push([f.data,u.data,d.data])})),t},links:function(){return this.edges.filter((function(t){return t.right})).map((function(t){return{source:t.left.data,target:t.right.data}}))},find:function(t,n,e){for(var r,i,o=this,u=o._found||0,a=o.cells.length;!(i=o.cells[u]);)if(++u>=a)return null;var c=t-i.site[0],s=n-i.site[1],f=c*c+s*s;do{i=o.cells[r=u],u=null,i.halfedges.forEach((function(e){var r=o.edges[e],a=r.left;if(a!==i.site&&a||(a=r.right)){var c=t-a[0],s=n-a[1],l=c*c+s*s;l<f&&(f=l,u=a.index)}}))}while(null!==u);return o._found=r,null==e||f<=e*e?i.site:null}}},function(t,n,e){"use strict";var r=e(59);e.d(n,"b",(function(){return r.a}));var i=e(25);e.d(n,"a",(function(){return i.a}));var o=e(95);e.d(n,"c",(function(){return o.a}));e(151),e(152),e(97);var u=e(99);e.d(n,"d",(function(){return u.a}));e(153),e(154),e(155);var a=e(101);e.d(n,"h",(function(){return a.a}));var c=e(156);e.d(n,"e",(function(){return c.a}));e(157),e(158),e(159),e(102),e(96),e(160);var s=e(53);e.d(n,"f",(function(){return s.a}));var f=e(100);e.d(n,"g",(function(){return f.a}));e(161),e(162),e(163);var l=e(60);e.d(n,"k",(function(){return l.a})),e.d(n,"i",(function(){return l.b})),e.d(n,"j",(function(){return l.c}));e(103),e(98),e(164)},function(t,n,e){"use strict";e.d(n,"c",(function(){return c})),e.d(n,"d",(function(){return s})),e.d(n,"b",(function(){return f})),e.d(n,"a",(function(){return l})),e.d(n,"g",(function(){return h})),e.d(n,"h",(function(){return d})),e.d(n,"f",(function(){return v}));var r=e(90),i=e(70),o=e(293),u=Object(r.a)("start","end","cancel","interrupt"),a=[],c=1,s=2,f=5,l=6;function h(t,n){var e=v(t,n);if(e.state>0)throw new Error("too late; already scheduled");return e}function d(t,n){var e=v(t,n);if(e.state>3)throw new Error("too late; already running");return e}function v(t,n){var e=t.__transition;if(!e||!(e=e[n]))throw new Error("transition not found");return e}n.e=function(t,n,e,r,h,d){var v=t.__transition;if(v){if(e in v)return}else t.__transition={};!function(t,n,e){var r,u=t.__transition;function a(i){var f,v,p,g;if(e.state!==c)return d();for(f in u)if((g=u[f]).name===e.name){if(3===g.state)return Object(o.a)(a);4===g.state?(g.state=l,g.timer.stop(),g.on.call("interrupt",t,t.__data__,g.index,g.group),delete u[f]):+f<n&&(g.state=l,g.timer.stop(),g.on.call("cancel",t,t.__data__,g.index,g.group),delete u[f])}if(Object(o.a)((function(){3===e.state&&(e.state=4,e.timer.restart(h,e.delay,e.time),h(i))})),e.state=s,e.on.call("start",t,t.__data__,e.index,e.group),e.state===s){for(e.state=3,r=new Array(p=e.tween.length),f=0,v=-1;f<p;++f)(g=e.tween[f].value.call(t,t.__data__,e.index,e.group))&&(r[++v]=g);r.length=v+1}}function h(n){for(var i=n<e.duration?e.ease.call(null,n/e.duration):(e.timer.restart(d),e.state=f,1),o=-1,u=r.length;++o<u;)r[o].call(t,i);e.state===f&&(e.on.call("end",t,t.__data__,e.index,e.group),d())}function d(){for(var r in e.state=l,e.timer.stop(),delete u[n],u)return;delete t.__transition}u[n]=e,e.timer=Object(i.c)((function(t){e.state=c,e.timer.restart(a,e.delay,e.time),e.delay<=t&&a(t-e.delay)}),0,e.time)}(t,e,{name:n,index:r,group:h,on:u,tween:a,time:d.time,delay:d.delay,duration:d.duration,ease:d.ease,timer:null,state:0})}},function(t,n,e){"use strict";function r(t,n){switch(arguments.length){case 0:break;case 1:this.range(t);break;default:this.range(n).domain(t)}return this}function i(t,n){switch(arguments.length){case 0:break;case 1:this.interpolator(t);break;default:this.interpolator(n).domain(t)}return this}e.d(n,"b",(function(){return r})),e.d(n,"a",(function(){return i}))},function(t,n,e){"use strict";e(150),e(2),e(165),e(166),e(168),e(35),e(176);var r=e(94);e.d(n,"a",(function(){return r.a}));e(179),e(187),e(192);var i=e(11);e.d(n,"b",(function(){return i.event})),e.d(n,"c",(function(){return i.select})),e.d(n,"d",(function(){return i.selectAll}));e(36),e(202),e(204)},function(t,n,e){"use strict";e.d(n,"a",(function(){return o}));var r=new Date,i=new Date;function o(t,n,e,u){function a(n){return t(n=0===arguments.length?new Date:new Date(+n)),n}return a.floor=function(n){return t(n=new Date(+n)),n},a.ceil=function(e){return t(e=new Date(e-1)),n(e,1),t(e),e},a.round=function(t){var n=a(t),e=a.ceil(t);return t-n<e-t?n:e},a.offset=function(t,e){return n(t=new Date(+t),null==e?1:Math.floor(e)),t},a.range=function(e,r,i){var o,u=[];if(e=a.ceil(e),i=null==i?1:Math.floor(i),!(e<r&&i>0))return u;do{u.push(o=new Date(+e)),n(e,i),t(e)}while(o<e&&e<r);return u},a.filter=function(e){return o((function(n){if(n>=n)for(;t(n),!e(n);)n.setTime(n-1)}),(function(t,r){if(t>=t)if(r<0)for(;++r<=0;)for(;n(t,-1),!e(t););else for(;--r>=0;)for(;n(t,1),!e(t););}))},e&&(a.count=function(n,o){return r.setTime(+n),i.setTime(+o),t(r),t(i),Math.floor(e(r,i))},a.every=function(t){return t=Math.floor(t),isFinite(t)&&t>0?t>1?a.filter(u?function(n){return u(n)%t==0}:function(n){return a.count(0,n)%t==0}):a:null}),a}},function(t,n,e){"use strict";e.d(n,"c",(function(){return E})),e.d(n,"a",(function(){return L}));var r=e(228),i=e(229),o=e(230),u=e(231),a=e(83),c=e(233),s=e(234),f=e(235),l=e(236),h=e(237),d=e(238),v=e(239),p=e(240),g=e(241),y=e(242),b=e(243),m=e(244),_=e(39),w=e(245),x=e(246),M=e(247),j=e(248),k=e(249),O=e(250),S=e(251),C=e(252),A=e(253),T=e(254),I=e(255),N=e(0),P=e(256),E=[null];function L(t,n){this._groups=t,this._parents=n}function F(){return new L([[document.documentElement]],E)}L.prototype=F.prototype={constructor:L,select:r.a,selectAll:i.a,filter:o.a,data:u.a,enter:a.b,exit:c.a,join:s.a,merge:f.a,order:l.a,sort:h.a,call:d.a,nodes:v.a,node:p.a,size:g.a,empty:y.a,each:b.a,attr:m.a,style:_.a,property:w.a,classed:x.a,text:M.a,html:j.a,raise:k.a,lower:O.a,append:S.a,insert:C.a,remove:A.a,clone:T.a,datum:I.a,on:N.b,dispatch:P.a},n.b=F},function(t,n,e){"use strict";e.d(n,"c",(function(){return l})),e.d(n,"a",(function(){return g})),e.d(n,"d",(function(){return y})),e.d(n,"b",(function(){return b}));var r=e(2),i=e(67),o=e(21),u=e(330),a=e(15),c=e(280),s=e(84),f=[0,1];function l(t){return t}function h(t,n){return(n-=t=+t)?function(e){return(e-t)/n}:Object(c.a)(isNaN(n)?NaN:.5)}function d(t){var n,e=t[0],r=t[t.length-1];return e>r&&(n=e,e=r,r=n),function(t){return Math.max(e,Math.min(r,t))}}function v(t,n,e){var r=t[0],i=t[1],o=n[0],u=n[1];return i<r?(r=h(i,r),o=e(u,o)):(r=h(r,i),o=e(o,u)),function(t){return o(r(t))}}function p(t,n,e){var i=Math.min(t.length,n.length)-1,o=new Array(i),u=new Array(i),a=-1;for(t[i]<t[0]&&(t=t.slice().reverse(),n=n.slice().reverse());++a<i;)o[a]=h(t[a],t[a+1]),u[a]=e(n[a],n[a+1]);return function(n){var e=Object(r.b)(t,n,1,i)-1;return u[e](o[e](n))}}function g(t,n){return n.domain(t.domain()).range(t.range()).interpolate(t.interpolate()).clamp(t.clamp()).unknown(t.unknown())}function y(){var t,n,e,r,c,h,g=f,y=f,b=i.a,m=l;function _(){return r=Math.min(g.length,y.length)>2?p:v,c=h=null,w}function w(n){return isNaN(n=+n)?e:(c||(c=r(g.map(t),y,b)))(t(m(n)))}return w.invert=function(e){return m(n((h||(h=r(y,g.map(t),o.a)))(e)))},w.domain=function(t){return arguments.length?(g=a.a.call(t,s.a),m===l||(m=d(g)),_()):g.slice()},w.range=function(t){return arguments.length?(y=a.b.call(t),_()):y.slice()},w.rangeRound=function(t){return y=a.b.call(t),b=u.a,_()},w.clamp=function(t){return arguments.length?(m=t?d(g):l,w):m!==l},w.interpolate=function(t){return arguments.length?(b=t,_()):b},w.unknown=function(t){return arguments.length?(e=t,w):e},function(e,r){return t=e,n=r,_()}}function b(t,n){return y()(t,n)}},function(t,n,e){"use strict";e.d(n,"d",(function(){return r})),e.d(n,"c",(function(){return i})),e.d(n,"b",(function(){return o})),e.d(n,"a",(function(){return u})),e.d(n,"e",(function(){return a}));var r=1e3,i=6e4,o=36e5,u=864e5,a=6048e5},function(t,n,e){"use strict";n.a=function(t){return function(){return t}}},function(t,n,e){"use strict";e.r(n);var r=e(199);e.d(n,"create",(function(){return r.a}));var i=e(42);e.d(n,"creator",(function(){return i.a}));var o=e(200);e.d(n,"local",(function(){return o.a}));var u=e(80);e.d(n,"matcher",(function(){return u.a}));var a=e(49);e.d(n,"mouse",(function(){return a.a}));var c=e(46);e.d(n,"namespace",(function(){return c.a}));var s=e(47);e.d(n,"namespaces",(function(){return s.a}));var f=e(43);e.d(n,"clientPoint",(function(){return f.a}));var l=e(12);e.d(n,"select",(function(){return l.a}));var h=e(201);e.d(n,"selectAll",(function(){return h.a}));var d=e(7);e.d(n,"selection",(function(){return d.b}));var v=e(54);e.d(n,"selector",(function(){return v.a}));var p=e(81);e.d(n,"selectorAll",(function(){return p.a}));var g=e(39);e.d(n,"style",(function(){return g.b}));var y=e(66);e.d(n,"touch",(function(){return y.a}));var b=e(127);e.d(n,"touches",(function(){return b.a}));var m=e(61);e.d(n,"window",(function(){return m.a}));var _=e(0);e.d(n,"event",(function(){return _.c})),e.d(n,"customEvent",(function(){return _.a}))},function(t,n,e){"use strict";var r=e(7);n.a=function(t){return"string"==typeof t?new r.a([[document.querySelector(t)]],[document.documentElement]):new r.a([[t]],r.c)}},function(t,n,e){(function(t,e,r){function i(t){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}
/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */(function(){var o="Expected a function",u="__lodash_placeholder__",a=[["ary",128],["bind",1],["bindKey",2],["curry",8],["curryRight",16],["flip",512],["partial",32],["partialRight",64],["rearg",256]],c="[object Arguments]",s="[object Array]",f="[object Boolean]",l="[object Date]",h="[object Error]",d="[object Function]",v="[object GeneratorFunction]",p="[object Map]",g="[object Number]",y="[object Object]",b="[object RegExp]",m="[object Set]",_="[object String]",w="[object Symbol]",x="[object WeakMap]",M="[object ArrayBuffer]",j="[object DataView]",k="[object Float32Array]",O="[object Float64Array]",S="[object Int8Array]",C="[object Int16Array]",A="[object Int32Array]",T="[object Uint8Array]",I="[object Uint16Array]",N="[object Uint32Array]",P=/\b__p \+= '';/g,E=/\b(__p \+=) '' \+/g,L=/(__e\(.*?\)|\b__t\)) \+\n'';/g,F=/&(?:amp|lt|gt|quot|#39);/g,D=/[&<>"']/g,R=RegExp(F.source),U=RegExp(D.source),z=/<%-([\s\S]+?)%>/g,q=/<%([\s\S]+?)%>/g,B=/<%=([\s\S]+?)%>/g,H=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,$=/^\w*$/,V=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,W=/[\\^$.*+?()[\]{}|]/g,Z=RegExp(W.source),Y=/^\s+|\s+$/g,X=/^\s+/,G=/\s+$/,Q=/\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,J=/\{\n\/\* \[wrapped with (.+)\] \*/,K=/,? & /,tt=/[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,nt=/\\(\\)?/g,et=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,rt=/\w*$/,it=/^[-+]0x[0-9a-f]+$/i,ot=/^0b[01]+$/i,ut=/^\[object .+?Constructor\]$/,at=/^0o[0-7]+$/i,ct=/^(?:0|[1-9]\d*)$/,st=/[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,ft=/($^)/,lt=/['\n\r\u2028\u2029\\]/g,ht="\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff",dt="\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",vt="[\\ud800-\\udfff]",pt="["+dt+"]",gt="["+ht+"]",yt="\\d+",bt="[\\u2700-\\u27bf]",mt="[a-z\\xdf-\\xf6\\xf8-\\xff]",_t="[^\\ud800-\\udfff"+dt+yt+"\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde]",wt="\\ud83c[\\udffb-\\udfff]",xt="[^\\ud800-\\udfff]",Mt="(?:\\ud83c[\\udde6-\\uddff]){2}",jt="[\\ud800-\\udbff][\\udc00-\\udfff]",kt="[A-Z\\xc0-\\xd6\\xd8-\\xde]",Ot="(?:"+mt+"|"+_t+")",St="(?:"+kt+"|"+_t+")",Ct="(?:"+gt+"|"+wt+")"+"?",At="[\\ufe0e\\ufe0f]?"+Ct+("(?:\\u200d(?:"+[xt,Mt,jt].join("|")+")[\\ufe0e\\ufe0f]?"+Ct+")*"),Tt="(?:"+[bt,Mt,jt].join("|")+")"+At,It="(?:"+[xt+gt+"?",gt,Mt,jt,vt].join("|")+")",Nt=RegExp("['’]","g"),Pt=RegExp(gt,"g"),Et=RegExp(wt+"(?="+wt+")|"+It+At,"g"),Lt=RegExp([kt+"?"+mt+"+(?:['’](?:d|ll|m|re|s|t|ve))?(?="+[pt,kt,"$"].join("|")+")",St+"+(?:['’](?:D|LL|M|RE|S|T|VE))?(?="+[pt,kt+Ot,"$"].join("|")+")",kt+"?"+Ot+"+(?:['’](?:d|ll|m|re|s|t|ve))?",kt+"+(?:['’](?:D|LL|M|RE|S|T|VE))?","\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])","\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])",yt,Tt].join("|"),"g"),Ft=RegExp("[\\u200d\\ud800-\\udfff"+ht+"\\ufe0e\\ufe0f]"),Dt=/[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,Rt=["Array","Buffer","DataView","Date","Error","Float32Array","Float64Array","Function","Int8Array","Int16Array","Int32Array","Map","Math","Object","Promise","RegExp","Set","String","Symbol","TypeError","Uint8Array","Uint8ClampedArray","Uint16Array","Uint32Array","WeakMap","_","clearTimeout","isFinite","parseInt","setTimeout"],Ut=-1,zt={};zt[k]=zt[O]=zt[S]=zt[C]=zt[A]=zt[T]=zt["[object Uint8ClampedArray]"]=zt[I]=zt[N]=!0,zt[c]=zt[s]=zt[M]=zt[f]=zt[j]=zt[l]=zt[h]=zt[d]=zt[p]=zt[g]=zt[y]=zt[b]=zt[m]=zt[_]=zt[x]=!1;var qt={};qt[c]=qt[s]=qt[M]=qt[j]=qt[f]=qt[l]=qt[k]=qt[O]=qt[S]=qt[C]=qt[A]=qt[p]=qt[g]=qt[y]=qt[b]=qt[m]=qt[_]=qt[w]=qt[T]=qt["[object Uint8ClampedArray]"]=qt[I]=qt[N]=!0,qt[h]=qt[d]=qt[x]=!1;var Bt={"\\":"\\","'":"'","\n":"n","\r":"r","\u2028":"u2028","\u2029":"u2029"},Ht=parseFloat,$t=parseInt,Vt="object"==(void 0===t?"undefined":i(t))&&t&&t.Object===Object&&t,Wt="object"==("undefined"==typeof self?"undefined":i(self))&&self&&self.Object===Object&&self,Zt=Vt||Wt||Function("return this")(),Yt="object"==i(n)&&n&&!n.nodeType&&n,Xt=Yt&&"object"==i(e)&&e&&!e.nodeType&&e,Gt=Xt&&Xt.exports===Yt,Qt=Gt&&Vt.process,Jt=function(){try{var t=Xt&&Xt.require&&Xt.require("util").types;return t||Qt&&Qt.binding&&Qt.binding("util")}catch(t){}}(),Kt=Jt&&Jt.isArrayBuffer,tn=Jt&&Jt.isDate,nn=Jt&&Jt.isMap,en=Jt&&Jt.isRegExp,rn=Jt&&Jt.isSet,on=Jt&&Jt.isTypedArray;function un(t,n,e){switch(e.length){case 0:return t.call(n);case 1:return t.call(n,e[0]);case 2:return t.call(n,e[0],e[1]);case 3:return t.call(n,e[0],e[1],e[2])}return t.apply(n,e)}function an(t,n,e,r){for(var i=-1,o=null==t?0:t.length;++i<o;){var u=t[i];n(r,u,e(u),t)}return r}function cn(t,n){for(var e=-1,r=null==t?0:t.length;++e<r&&!1!==n(t[e],e,t););return t}function sn(t,n){for(var e=null==t?0:t.length;e--&&!1!==n(t[e],e,t););return t}function fn(t,n){for(var e=-1,r=null==t?0:t.length;++e<r;)if(!n(t[e],e,t))return!1;return!0}function ln(t,n){for(var e=-1,r=null==t?0:t.length,i=0,o=[];++e<r;){var u=t[e];n(u,e,t)&&(o[i++]=u)}return o}function hn(t,n){return!!(null==t?0:t.length)&&xn(t,n,0)>-1}function dn(t,n,e){for(var r=-1,i=null==t?0:t.length;++r<i;)if(e(n,t[r]))return!0;return!1}function vn(t,n){for(var e=-1,r=null==t?0:t.length,i=Array(r);++e<r;)i[e]=n(t[e],e,t);return i}function pn(t,n){for(var e=-1,r=n.length,i=t.length;++e<r;)t[i+e]=n[e];return t}function gn(t,n,e,r){var i=-1,o=null==t?0:t.length;for(r&&o&&(e=t[++i]);++i<o;)e=n(e,t[i],i,t);return e}function yn(t,n,e,r){var i=null==t?0:t.length;for(r&&i&&(e=t[--i]);i--;)e=n(e,t[i],i,t);return e}function bn(t,n){for(var e=-1,r=null==t?0:t.length;++e<r;)if(n(t[e],e,t))return!0;return!1}var mn=On("length");function _n(t,n,e){var r;return e(t,(function(t,e,i){if(n(t,e,i))return r=e,!1})),r}function wn(t,n,e,r){for(var i=t.length,o=e+(r?1:-1);r?o--:++o<i;)if(n(t[o],o,t))return o;return-1}function xn(t,n,e){return n==n?function(t,n,e){var r=e-1,i=t.length;for(;++r<i;)if(t[r]===n)return r;return-1}(t,n,e):wn(t,jn,e)}function Mn(t,n,e,r){for(var i=e-1,o=t.length;++i<o;)if(r(t[i],n))return i;return-1}function jn(t){return t!=t}function kn(t,n){var e=null==t?0:t.length;return e?An(t,n)/e:NaN}function On(t){return function(n){return null==n?void 0:n[t]}}function Sn(t){return function(n){return null==t?void 0:t[n]}}function Cn(t,n,e,r,i){return i(t,(function(t,i,o){e=r?(r=!1,t):n(e,t,i,o)})),e}function An(t,n){for(var e,r=-1,i=t.length;++r<i;){var o=n(t[r]);void 0!==o&&(e=void 0===e?o:e+o)}return e}function Tn(t,n){for(var e=-1,r=Array(t);++e<t;)r[e]=n(e);return r}function In(t){return function(n){return t(n)}}function Nn(t,n){return vn(n,(function(n){return t[n]}))}function Pn(t,n){return t.has(n)}function En(t,n){for(var e=-1,r=t.length;++e<r&&xn(n,t[e],0)>-1;);return e}function Ln(t,n){for(var e=t.length;e--&&xn(n,t[e],0)>-1;);return e}function Fn(t,n){for(var e=t.length,r=0;e--;)t[e]===n&&++r;return r}var Dn=Sn({"À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","Ç":"C","ç":"c","Ð":"D","ð":"d","È":"E","É":"E","Ê":"E","Ë":"E","è":"e","é":"e","ê":"e","ë":"e","Ì":"I","Í":"I","Î":"I","Ï":"I","ì":"i","í":"i","î":"i","ï":"i","Ñ":"N","ñ":"n","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ø":"O","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","Ù":"U","Ú":"U","Û":"U","Ü":"U","ù":"u","ú":"u","û":"u","ü":"u","Ý":"Y","ý":"y","ÿ":"y","Æ":"Ae","æ":"ae","Þ":"Th","þ":"th","ß":"ss","Ā":"A","Ă":"A","Ą":"A","ā":"a","ă":"a","ą":"a","Ć":"C","Ĉ":"C","Ċ":"C","Č":"C","ć":"c","ĉ":"c","ċ":"c","č":"c","Ď":"D","Đ":"D","ď":"d","đ":"d","Ē":"E","Ĕ":"E","Ė":"E","Ę":"E","Ě":"E","ē":"e","ĕ":"e","ė":"e","ę":"e","ě":"e","Ĝ":"G","Ğ":"G","Ġ":"G","Ģ":"G","ĝ":"g","ğ":"g","ġ":"g","ģ":"g","Ĥ":"H","Ħ":"H","ĥ":"h","ħ":"h","Ĩ":"I","Ī":"I","Ĭ":"I","Į":"I","İ":"I","ĩ":"i","ī":"i","ĭ":"i","į":"i","ı":"i","Ĵ":"J","ĵ":"j","Ķ":"K","ķ":"k","ĸ":"k","Ĺ":"L","Ļ":"L","Ľ":"L","Ŀ":"L","Ł":"L","ĺ":"l","ļ":"l","ľ":"l","ŀ":"l","ł":"l","Ń":"N","Ņ":"N","Ň":"N","Ŋ":"N","ń":"n","ņ":"n","ň":"n","ŋ":"n","Ō":"O","Ŏ":"O","Ő":"O","ō":"o","ŏ":"o","ő":"o","Ŕ":"R","Ŗ":"R","Ř":"R","ŕ":"r","ŗ":"r","ř":"r","Ś":"S","Ŝ":"S","Ş":"S","Š":"S","ś":"s","ŝ":"s","ş":"s","š":"s","Ţ":"T","Ť":"T","Ŧ":"T","ţ":"t","ť":"t","ŧ":"t","Ũ":"U","Ū":"U","Ŭ":"U","Ů":"U","Ű":"U","Ų":"U","ũ":"u","ū":"u","ŭ":"u","ů":"u","ű":"u","ų":"u","Ŵ":"W","ŵ":"w","Ŷ":"Y","ŷ":"y","Ÿ":"Y","Ź":"Z","Ż":"Z","Ž":"Z","ź":"z","ż":"z","ž":"z","Ĳ":"IJ","ĳ":"ij","Œ":"Oe","œ":"oe","ŉ":"'n","ſ":"s"}),Rn=Sn({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"});function Un(t){return"\\"+Bt[t]}function zn(t){return Ft.test(t)}function qn(t){var n=-1,e=Array(t.size);return t.forEach((function(t,r){e[++n]=[r,t]})),e}function Bn(t,n){return function(e){return t(n(e))}}function Hn(t,n){for(var e=-1,r=t.length,i=0,o=[];++e<r;){var a=t[e];a!==n&&a!==u||(t[e]=u,o[i++]=e)}return o}function $n(t){var n=-1,e=Array(t.size);return t.forEach((function(t){e[++n]=t})),e}function Vn(t){var n=-1,e=Array(t.size);return t.forEach((function(t){e[++n]=[t,t]})),e}function Wn(t){return zn(t)?function(t){var n=Et.lastIndex=0;for(;Et.test(t);)++n;return n}(t):mn(t)}function Zn(t){return zn(t)?function(t){return t.match(Et)||[]}(t):function(t){return t.split("")}(t)}var Yn=Sn({"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'"});var Xn=function t(n){var e,r=(n=null==n?Zt:Xn.defaults(Zt.Object(),n,Xn.pick(Zt,Rt))).Array,ht=n.Date,dt=n.Error,vt=n.Function,pt=n.Math,gt=n.Object,yt=n.RegExp,bt=n.String,mt=n.TypeError,_t=r.prototype,wt=vt.prototype,xt=gt.prototype,Mt=n["__core-js_shared__"],jt=wt.toString,kt=xt.hasOwnProperty,Ot=0,St=(e=/[^.]+$/.exec(Mt&&Mt.keys&&Mt.keys.IE_PROTO||""))?"Symbol(src)_1."+e:"",Ct=xt.toString,At=jt.call(gt),Tt=Zt._,It=yt("^"+jt.call(kt).replace(W,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),Et=Gt?n.Buffer:void 0,Ft=n.Symbol,Bt=n.Uint8Array,Vt=Et?Et.allocUnsafe:void 0,Wt=Bn(gt.getPrototypeOf,gt),Yt=gt.create,Xt=xt.propertyIsEnumerable,Qt=_t.splice,Jt=Ft?Ft.isConcatSpreadable:void 0,mn=Ft?Ft.iterator:void 0,Sn=Ft?Ft.toStringTag:void 0,Gn=function(){try{var t=to(gt,"defineProperty");return t({},"",{}),t}catch(t){}}(),Qn=n.clearTimeout!==Zt.clearTimeout&&n.clearTimeout,Jn=ht&&ht.now!==Zt.Date.now&&ht.now,Kn=n.setTimeout!==Zt.setTimeout&&n.setTimeout,te=pt.ceil,ne=pt.floor,ee=gt.getOwnPropertySymbols,re=Et?Et.isBuffer:void 0,ie=n.isFinite,oe=_t.join,ue=Bn(gt.keys,gt),ae=pt.max,ce=pt.min,se=ht.now,fe=n.parseInt,le=pt.random,he=_t.reverse,de=to(n,"DataView"),ve=to(n,"Map"),pe=to(n,"Promise"),ge=to(n,"Set"),ye=to(n,"WeakMap"),be=to(gt,"create"),me=ye&&new ye,_e={},we=Co(de),xe=Co(ve),Me=Co(pe),je=Co(ge),ke=Co(ye),Oe=Ft?Ft.prototype:void 0,Se=Oe?Oe.valueOf:void 0,Ce=Oe?Oe.toString:void 0;function Ae(t){if(Vu(t)&&!Eu(t)&&!(t instanceof Pe)){if(t instanceof Ne)return t;if(kt.call(t,"__wrapped__"))return Ao(t)}return new Ne(t)}var Te=function(){function t(){}return function(n){if(!$u(n))return{};if(Yt)return Yt(n);t.prototype=n;var e=new t;return t.prototype=void 0,e}}();function Ie(){}function Ne(t,n){this.__wrapped__=t,this.__actions__=[],this.__chain__=!!n,this.__index__=0,this.__values__=void 0}function Pe(t){this.__wrapped__=t,this.__actions__=[],this.__dir__=1,this.__filtered__=!1,this.__iteratees__=[],this.__takeCount__=4294967295,this.__views__=[]}function Ee(t){var n=-1,e=null==t?0:t.length;for(this.clear();++n<e;){var r=t[n];this.set(r[0],r[1])}}function Le(t){var n=-1,e=null==t?0:t.length;for(this.clear();++n<e;){var r=t[n];this.set(r[0],r[1])}}function Fe(t){var n=-1,e=null==t?0:t.length;for(this.clear();++n<e;){var r=t[n];this.set(r[0],r[1])}}function De(t){var n=-1,e=null==t?0:t.length;for(this.__data__=new Fe;++n<e;)this.add(t[n])}function Re(t){var n=this.__data__=new Le(t);this.size=n.size}function Ue(t,n){var e=Eu(t),r=!e&&Pu(t),i=!e&&!r&&Ru(t),o=!e&&!r&&!i&&Ku(t),u=e||r||i||o,a=u?Tn(t.length,bt):[],c=a.length;for(var s in t)!n&&!kt.call(t,s)||u&&("length"==s||i&&("offset"==s||"parent"==s)||o&&("buffer"==s||"byteLength"==s||"byteOffset"==s)||ao(s,c))||a.push(s);return a}function ze(t){var n=t.length;return n?t[Dr(0,n-1)]:void 0}function qe(t,n){return ko(bi(t),Ge(n,0,t.length))}function Be(t){return ko(bi(t))}function He(t,n,e){(void 0!==e&&!Tu(t[n],e)||void 0===e&&!(n in t))&&Ye(t,n,e)}function $e(t,n,e){var r=t[n];kt.call(t,n)&&Tu(r,e)&&(void 0!==e||n in t)||Ye(t,n,e)}function Ve(t,n){for(var e=t.length;e--;)if(Tu(t[e][0],n))return e;return-1}function We(t,n,e,r){return nr(t,(function(t,i,o){n(r,t,e(t),o)})),r}function Ze(t,n){return t&&mi(n,wa(n),t)}function Ye(t,n,e){"__proto__"==n&&Gn?Gn(t,n,{configurable:!0,enumerable:!0,value:e,writable:!0}):t[n]=e}function Xe(t,n){for(var e=-1,i=n.length,o=r(i),u=null==t;++e<i;)o[e]=u?void 0:ga(t,n[e]);return o}function Ge(t,n,e){return t==t&&(void 0!==e&&(t=t<=e?t:e),void 0!==n&&(t=t>=n?t:n)),t}function Qe(t,n,e,r,i,o){var u,a=1&n,s=2&n,h=4&n;if(e&&(u=i?e(t,r,i,o):e(t)),void 0!==u)return u;if(!$u(t))return t;var x=Eu(t);if(x){if(u=function(t){var n=t.length,e=new t.constructor(n);n&&"string"==typeof t[0]&&kt.call(t,"index")&&(e.index=t.index,e.input=t.input);return e}(t),!a)return bi(t,u)}else{var P=ro(t),E=P==d||P==v;if(Ru(t))return hi(t,a);if(P==y||P==c||E&&!i){if(u=s||E?{}:oo(t),!a)return s?function(t,n){return mi(t,eo(t),n)}(t,function(t,n){return t&&mi(n,xa(n),t)}(u,t)):function(t,n){return mi(t,no(t),n)}(t,Ze(u,t))}else{if(!qt[P])return i?t:{};u=function(t,n,e){var r=t.constructor;switch(n){case M:return di(t);case f:case l:return new r(+t);case j:return function(t,n){var e=n?di(t.buffer):t.buffer;return new t.constructor(e,t.byteOffset,t.byteLength)}(t,e);case k:case O:case S:case C:case A:case T:case"[object Uint8ClampedArray]":case I:case N:return vi(t,e);case p:return new r;case g:case _:return new r(t);case b:return function(t){var n=new t.constructor(t.source,rt.exec(t));return n.lastIndex=t.lastIndex,n}(t);case m:return new r;case w:return i=t,Se?gt(Se.call(i)):{}}var i}(t,P,a)}}o||(o=new Re);var L=o.get(t);if(L)return L;o.set(t,u),Gu(t)?t.forEach((function(r){u.add(Qe(r,n,e,r,t,o))})):Wu(t)&&t.forEach((function(r,i){u.set(i,Qe(r,n,e,i,t,o))}));var F=x?void 0:(h?s?Zi:Wi:s?xa:wa)(t);return cn(F||t,(function(r,i){F&&(r=t[i=r]),$e(u,i,Qe(r,n,e,i,t,o))})),u}function Je(t,n,e){var r=e.length;if(null==t)return!r;for(t=gt(t);r--;){var i=e[r],o=n[i],u=t[i];if(void 0===u&&!(i in t)||!o(u))return!1}return!0}function Ke(t,n,e){if("function"!=typeof t)throw new mt(o);return wo((function(){t.apply(void 0,e)}),n)}function tr(t,n,e,r){var i=-1,o=hn,u=!0,a=t.length,c=[],s=n.length;if(!a)return c;e&&(n=vn(n,In(e))),r?(o=dn,u=!1):n.length>=200&&(o=Pn,u=!1,n=new De(n));t:for(;++i<a;){var f=t[i],l=null==e?f:e(f);if(f=r||0!==f?f:0,u&&l==l){for(var h=s;h--;)if(n[h]===l)continue t;c.push(f)}else o(n,l,r)||c.push(f)}return c}Ae.templateSettings={escape:z,evaluate:q,interpolate:B,variable:"",imports:{_:Ae}},Ae.prototype=Ie.prototype,Ae.prototype.constructor=Ae,Ne.prototype=Te(Ie.prototype),Ne.prototype.constructor=Ne,Pe.prototype=Te(Ie.prototype),Pe.prototype.constructor=Pe,Ee.prototype.clear=function(){this.__data__=be?be(null):{},this.size=0},Ee.prototype.delete=function(t){var n=this.has(t)&&delete this.__data__[t];return this.size-=n?1:0,n},Ee.prototype.get=function(t){var n=this.__data__;if(be){var e=n[t];return"__lodash_hash_undefined__"===e?void 0:e}return kt.call(n,t)?n[t]:void 0},Ee.prototype.has=function(t){var n=this.__data__;return be?void 0!==n[t]:kt.call(n,t)},Ee.prototype.set=function(t,n){var e=this.__data__;return this.size+=this.has(t)?0:1,e[t]=be&&void 0===n?"__lodash_hash_undefined__":n,this},Le.prototype.clear=function(){this.__data__=[],this.size=0},Le.prototype.delete=function(t){var n=this.__data__,e=Ve(n,t);return!(e<0)&&(e==n.length-1?n.pop():Qt.call(n,e,1),--this.size,!0)},Le.prototype.get=function(t){var n=this.__data__,e=Ve(n,t);return e<0?void 0:n[e][1]},Le.prototype.has=function(t){return Ve(this.__data__,t)>-1},Le.prototype.set=function(t,n){var e=this.__data__,r=Ve(e,t);return r<0?(++this.size,e.push([t,n])):e[r][1]=n,this},Fe.prototype.clear=function(){this.size=0,this.__data__={hash:new Ee,map:new(ve||Le),string:new Ee}},Fe.prototype.delete=function(t){var n=Ji(this,t).delete(t);return this.size-=n?1:0,n},Fe.prototype.get=function(t){return Ji(this,t).get(t)},Fe.prototype.has=function(t){return Ji(this,t).has(t)},Fe.prototype.set=function(t,n){var e=Ji(this,t),r=e.size;return e.set(t,n),this.size+=e.size==r?0:1,this},De.prototype.add=De.prototype.push=function(t){return this.__data__.set(t,"__lodash_hash_undefined__"),this},De.prototype.has=function(t){return this.__data__.has(t)},Re.prototype.clear=function(){this.__data__=new Le,this.size=0},Re.prototype.delete=function(t){var n=this.__data__,e=n.delete(t);return this.size=n.size,e},Re.prototype.get=function(t){return this.__data__.get(t)},Re.prototype.has=function(t){return this.__data__.has(t)},Re.prototype.set=function(t,n){var e=this.__data__;if(e instanceof Le){var r=e.__data__;if(!ve||r.length<199)return r.push([t,n]),this.size=++e.size,this;e=this.__data__=new Fe(r)}return e.set(t,n),this.size=e.size,this};var nr=xi(sr),er=xi(fr,!0);function rr(t,n){var e=!0;return nr(t,(function(t,r,i){return e=!!n(t,r,i)})),e}function ir(t,n,e){for(var r=-1,i=t.length;++r<i;){var o=t[r],u=n(o);if(null!=u&&(void 0===a?u==u&&!Ju(u):e(u,a)))var a=u,c=o}return c}function or(t,n){var e=[];return nr(t,(function(t,r,i){n(t,r,i)&&e.push(t)})),e}function ur(t,n,e,r,i){var o=-1,u=t.length;for(e||(e=uo),i||(i=[]);++o<u;){var a=t[o];n>0&&e(a)?n>1?ur(a,n-1,e,r,i):pn(i,a):r||(i[i.length]=a)}return i}var ar=Mi(),cr=Mi(!0);function sr(t,n){return t&&ar(t,n,wa)}function fr(t,n){return t&&cr(t,n,wa)}function lr(t,n){return ln(n,(function(n){return qu(t[n])}))}function hr(t,n){for(var e=0,r=(n=ci(n,t)).length;null!=t&&e<r;)t=t[So(n[e++])];return e&&e==r?t:void 0}function dr(t,n,e){var r=n(t);return Eu(t)?r:pn(r,e(t))}function vr(t){return null==t?void 0===t?"[object Undefined]":"[object Null]":Sn&&Sn in gt(t)?function(t){var n=kt.call(t,Sn),e=t[Sn];try{t[Sn]=void 0;var r=!0}catch(t){}var i=Ct.call(t);r&&(n?t[Sn]=e:delete t[Sn]);return i}(t):function(t){return Ct.call(t)}(t)}function pr(t,n){return t>n}function gr(t,n){return null!=t&&kt.call(t,n)}function yr(t,n){return null!=t&&n in gt(t)}function br(t,n,e){for(var i=e?dn:hn,o=t[0].length,u=t.length,a=u,c=r(u),s=1/0,f=[];a--;){var l=t[a];a&&n&&(l=vn(l,In(n))),s=ce(l.length,s),c[a]=!e&&(n||o>=120&&l.length>=120)?new De(a&&l):void 0}l=t[0];var h=-1,d=c[0];t:for(;++h<o&&f.length<s;){var v=l[h],p=n?n(v):v;if(v=e||0!==v?v:0,!(d?Pn(d,p):i(f,p,e))){for(a=u;--a;){var g=c[a];if(!(g?Pn(g,p):i(t[a],p,e)))continue t}d&&d.push(p),f.push(v)}}return f}function mr(t,n,e){var r=null==(t=yo(t,n=ci(n,t)))?t:t[So(zo(n))];return null==r?void 0:un(r,t,e)}function _r(t){return Vu(t)&&vr(t)==c}function wr(t,n,e,r,i){return t===n||(null==t||null==n||!Vu(t)&&!Vu(n)?t!=t&&n!=n:function(t,n,e,r,i,o){var u=Eu(t),a=Eu(n),d=u?s:ro(t),v=a?s:ro(n),x=(d=d==c?y:d)==y,k=(v=v==c?y:v)==y,O=d==v;if(O&&Ru(t)){if(!Ru(n))return!1;u=!0,x=!1}if(O&&!x)return o||(o=new Re),u||Ku(t)?$i(t,n,e,r,i,o):function(t,n,e,r,i,o,u){switch(e){case j:if(t.byteLength!=n.byteLength||t.byteOffset!=n.byteOffset)return!1;t=t.buffer,n=n.buffer;case M:return!(t.byteLength!=n.byteLength||!o(new Bt(t),new Bt(n)));case f:case l:case g:return Tu(+t,+n);case h:return t.name==n.name&&t.message==n.message;case b:case _:return t==n+"";case p:var a=qn;case m:var c=1&r;if(a||(a=$n),t.size!=n.size&&!c)return!1;var s=u.get(t);if(s)return s==n;r|=2,u.set(t,n);var d=$i(a(t),a(n),r,i,o,u);return u.delete(t),d;case w:if(Se)return Se.call(t)==Se.call(n)}return!1}(t,n,d,e,r,i,o);if(!(1&e)){var S=x&&kt.call(t,"__wrapped__"),C=k&&kt.call(n,"__wrapped__");if(S||C){var A=S?t.value():t,T=C?n.value():n;return o||(o=new Re),i(A,T,e,r,o)}}if(!O)return!1;return o||(o=new Re),function(t,n,e,r,i,o){var u=1&e,a=Wi(t),c=a.length,s=Wi(n).length;if(c!=s&&!u)return!1;var f=c;for(;f--;){var l=a[f];if(!(u?l in n:kt.call(n,l)))return!1}var h=o.get(t),d=o.get(n);if(h&&d)return h==n&&d==t;var v=!0;o.set(t,n),o.set(n,t);var p=u;for(;++f<c;){l=a[f];var g=t[l],y=n[l];if(r)var b=u?r(y,g,l,n,t,o):r(g,y,l,t,n,o);if(!(void 0===b?g===y||i(g,y,e,r,o):b)){v=!1;break}p||(p="constructor"==l)}if(v&&!p){var m=t.constructor,_=n.constructor;m==_||!("constructor"in t)||!("constructor"in n)||"function"==typeof m&&m instanceof m&&"function"==typeof _&&_ instanceof _||(v=!1)}return o.delete(t),o.delete(n),v}(t,n,e,r,i,o)}(t,n,e,r,wr,i))}function xr(t,n,e,r){var i=e.length,o=i,u=!r;if(null==t)return!o;for(t=gt(t);i--;){var a=e[i];if(u&&a[2]?a[1]!==t[a[0]]:!(a[0]in t))return!1}for(;++i<o;){var c=(a=e[i])[0],s=t[c],f=a[1];if(u&&a[2]){if(void 0===s&&!(c in t))return!1}else{var l=new Re;if(r)var h=r(s,f,c,t,n,l);if(!(void 0===h?wr(f,s,3,r,l):h))return!1}}return!0}function Mr(t){return!(!$u(t)||(n=t,St&&St in n))&&(qu(t)?It:ut).test(Co(t));var n}function jr(t){return"function"==typeof t?t:null==t?Za:"object"==i(t)?Eu(t)?Tr(t[0],t[1]):Ar(t):ec(t)}function kr(t){if(!ho(t))return ue(t);var n=[];for(var e in gt(t))kt.call(t,e)&&"constructor"!=e&&n.push(e);return n}function Or(t){if(!$u(t))return function(t){var n=[];if(null!=t)for(var e in gt(t))n.push(e);return n}(t);var n=ho(t),e=[];for(var r in t)("constructor"!=r||!n&&kt.call(t,r))&&e.push(r);return e}function Sr(t,n){return t<n}function Cr(t,n){var e=-1,i=Fu(t)?r(t.length):[];return nr(t,(function(t,r,o){i[++e]=n(t,r,o)})),i}function Ar(t){var n=Ki(t);return 1==n.length&&n[0][2]?po(n[0][0],n[0][1]):function(e){return e===t||xr(e,t,n)}}function Tr(t,n){return so(t)&&vo(n)?po(So(t),n):function(e){var r=ga(e,t);return void 0===r&&r===n?ya(e,t):wr(n,r,3)}}function Ir(t,n,e,r,i){t!==n&&ar(n,(function(o,u){if(i||(i=new Re),$u(o))!function(t,n,e,r,i,o,u){var a=mo(t,e),c=mo(n,e),s=u.get(c);if(s)return void He(t,e,s);var f=o?o(a,c,e+"",t,n,u):void 0,l=void 0===f;if(l){var h=Eu(c),d=!h&&Ru(c),v=!h&&!d&&Ku(c);f=c,h||d||v?Eu(a)?f=a:Du(a)?f=bi(a):d?(l=!1,f=hi(c,!0)):v?(l=!1,f=vi(c,!0)):f=[]:Yu(c)||Pu(c)?(f=a,Pu(a)?f=aa(a):$u(a)&&!qu(a)||(f=oo(c))):l=!1}l&&(u.set(c,f),i(f,c,r,o,u),u.delete(c));He(t,e,f)}(t,n,u,e,Ir,r,i);else{var a=r?r(mo(t,u),o,u+"",t,n,i):void 0;void 0===a&&(a=o),He(t,u,a)}}),xa)}function Nr(t,n){var e=t.length;if(e)return ao(n+=n<0?e:0,e)?t[n]:void 0}function Pr(t,n,e){n=n.length?vn(n,(function(t){return Eu(t)?function(n){return hr(n,1===t.length?t[0]:t)}:t})):[Za];var r=-1;return n=vn(n,In(Qi())),function(t,n){var e=t.length;for(t.sort(n);e--;)t[e]=t[e].value;return t}(Cr(t,(function(t,e,i){return{criteria:vn(n,(function(n){return n(t)})),index:++r,value:t}})),(function(t,n){return function(t,n,e){var r=-1,i=t.criteria,o=n.criteria,u=i.length,a=e.length;for(;++r<u;){var c=pi(i[r],o[r]);if(c){if(r>=a)return c;var s=e[r];return c*("desc"==s?-1:1)}}return t.index-n.index}(t,n,e)}))}function Er(t,n,e){for(var r=-1,i=n.length,o={};++r<i;){var u=n[r],a=hr(t,u);e(a,u)&&Br(o,ci(u,t),a)}return o}function Lr(t,n,e,r){var i=r?Mn:xn,o=-1,u=n.length,a=t;for(t===n&&(n=bi(n)),e&&(a=vn(t,In(e)));++o<u;)for(var c=0,s=n[o],f=e?e(s):s;(c=i(a,f,c,r))>-1;)a!==t&&Qt.call(a,c,1),Qt.call(t,c,1);return t}function Fr(t,n){for(var e=t?n.length:0,r=e-1;e--;){var i=n[e];if(e==r||i!==o){var o=i;ao(i)?Qt.call(t,i,1):ti(t,i)}}return t}function Dr(t,n){return t+ne(le()*(n-t+1))}function Rr(t,n){var e="";if(!t||n<1||n>9007199254740991)return e;do{n%2&&(e+=t),(n=ne(n/2))&&(t+=t)}while(n);return e}function Ur(t,n){return xo(go(t,n,Za),t+"")}function zr(t){return ze(Ta(t))}function qr(t,n){var e=Ta(t);return ko(e,Ge(n,0,e.length))}function Br(t,n,e,r){if(!$u(t))return t;for(var i=-1,o=(n=ci(n,t)).length,u=o-1,a=t;null!=a&&++i<o;){var c=So(n[i]),s=e;if("__proto__"===c||"constructor"===c||"prototype"===c)return t;if(i!=u){var f=a[c];void 0===(s=r?r(f,c,a):void 0)&&(s=$u(f)?f:ao(n[i+1])?[]:{})}$e(a,c,s),a=a[c]}return t}var Hr=me?function(t,n){return me.set(t,n),t}:Za,$r=Gn?function(t,n){return Gn(t,"toString",{configurable:!0,enumerable:!1,value:$a(n),writable:!0})}:Za;function Vr(t){return ko(Ta(t))}function Wr(t,n,e){var i=-1,o=t.length;n<0&&(n=-n>o?0:o+n),(e=e>o?o:e)<0&&(e+=o),o=n>e?0:e-n>>>0,n>>>=0;for(var u=r(o);++i<o;)u[i]=t[i+n];return u}function Zr(t,n){var e;return nr(t,(function(t,r,i){return!(e=n(t,r,i))})),!!e}function Yr(t,n,e){var r=0,i=null==t?r:t.length;if("number"==typeof n&&n==n&&i<=2147483647){for(;r<i;){var o=r+i>>>1,u=t[o];null!==u&&!Ju(u)&&(e?u<=n:u<n)?r=o+1:i=o}return i}return Xr(t,n,Za,e)}function Xr(t,n,e,r){var i=0,o=null==t?0:t.length;if(0===o)return 0;for(var u=(n=e(n))!=n,a=null===n,c=Ju(n),s=void 0===n;i<o;){var f=ne((i+o)/2),l=e(t[f]),h=void 0!==l,d=null===l,v=l==l,p=Ju(l);if(u)var g=r||v;else g=s?v&&(r||h):a?v&&h&&(r||!d):c?v&&h&&!d&&(r||!p):!d&&!p&&(r?l<=n:l<n);g?i=f+1:o=f}return ce(o,4294967294)}function Gr(t,n){for(var e=-1,r=t.length,i=0,o=[];++e<r;){var u=t[e],a=n?n(u):u;if(!e||!Tu(a,c)){var c=a;o[i++]=0===u?0:u}}return o}function Qr(t){return"number"==typeof t?t:Ju(t)?NaN:+t}function Jr(t){if("string"==typeof t)return t;if(Eu(t))return vn(t,Jr)+"";if(Ju(t))return Ce?Ce.call(t):"";var n=t+"";return"0"==n&&1/t==-1/0?"-0":n}function Kr(t,n,e){var r=-1,i=hn,o=t.length,u=!0,a=[],c=a;if(e)u=!1,i=dn;else if(o>=200){var s=n?null:Ri(t);if(s)return $n(s);u=!1,i=Pn,c=new De}else c=n?[]:a;t:for(;++r<o;){var f=t[r],l=n?n(f):f;if(f=e||0!==f?f:0,u&&l==l){for(var h=c.length;h--;)if(c[h]===l)continue t;n&&c.push(l),a.push(f)}else i(c,l,e)||(c!==a&&c.push(l),a.push(f))}return a}function ti(t,n){return null==(t=yo(t,n=ci(n,t)))||delete t[So(zo(n))]}function ni(t,n,e,r){return Br(t,n,e(hr(t,n)),r)}function ei(t,n,e,r){for(var i=t.length,o=r?i:-1;(r?o--:++o<i)&&n(t[o],o,t););return e?Wr(t,r?0:o,r?o+1:i):Wr(t,r?o+1:0,r?i:o)}function ri(t,n){var e=t;return e instanceof Pe&&(e=e.value()),gn(n,(function(t,n){return n.func.apply(n.thisArg,pn([t],n.args))}),e)}function ii(t,n,e){var i=t.length;if(i<2)return i?Kr(t[0]):[];for(var o=-1,u=r(i);++o<i;)for(var a=t[o],c=-1;++c<i;)c!=o&&(u[o]=tr(u[o]||a,t[c],n,e));return Kr(ur(u,1),n,e)}function oi(t,n,e){for(var r=-1,i=t.length,o=n.length,u={};++r<i;){var a=r<o?n[r]:void 0;e(u,t[r],a)}return u}function ui(t){return Du(t)?t:[]}function ai(t){return"function"==typeof t?t:Za}function ci(t,n){return Eu(t)?t:so(t,n)?[t]:Oo(ca(t))}var si=Ur;function fi(t,n,e){var r=t.length;return e=void 0===e?r:e,!n&&e>=r?t:Wr(t,n,e)}var li=Qn||function(t){return Zt.clearTimeout(t)};function hi(t,n){if(n)return t.slice();var e=t.length,r=Vt?Vt(e):new t.constructor(e);return t.copy(r),r}function di(t){var n=new t.constructor(t.byteLength);return new Bt(n).set(new Bt(t)),n}function vi(t,n){var e=n?di(t.buffer):t.buffer;return new t.constructor(e,t.byteOffset,t.length)}function pi(t,n){if(t!==n){var e=void 0!==t,r=null===t,i=t==t,o=Ju(t),u=void 0!==n,a=null===n,c=n==n,s=Ju(n);if(!a&&!s&&!o&&t>n||o&&u&&c&&!a&&!s||r&&u&&c||!e&&c||!i)return 1;if(!r&&!o&&!s&&t<n||s&&e&&i&&!r&&!o||a&&e&&i||!u&&i||!c)return-1}return 0}function gi(t,n,e,i){for(var o=-1,u=t.length,a=e.length,c=-1,s=n.length,f=ae(u-a,0),l=r(s+f),h=!i;++c<s;)l[c]=n[c];for(;++o<a;)(h||o<u)&&(l[e[o]]=t[o]);for(;f--;)l[c++]=t[o++];return l}function yi(t,n,e,i){for(var o=-1,u=t.length,a=-1,c=e.length,s=-1,f=n.length,l=ae(u-c,0),h=r(l+f),d=!i;++o<l;)h[o]=t[o];for(var v=o;++s<f;)h[v+s]=n[s];for(;++a<c;)(d||o<u)&&(h[v+e[a]]=t[o++]);return h}function bi(t,n){var e=-1,i=t.length;for(n||(n=r(i));++e<i;)n[e]=t[e];return n}function mi(t,n,e,r){var i=!e;e||(e={});for(var o=-1,u=n.length;++o<u;){var a=n[o],c=r?r(e[a],t[a],a,e,t):void 0;void 0===c&&(c=t[a]),i?Ye(e,a,c):$e(e,a,c)}return e}function _i(t,n){return function(e,r){var i=Eu(e)?an:We,o=n?n():{};return i(e,t,Qi(r,2),o)}}function wi(t){return Ur((function(n,e){var r=-1,i=e.length,o=i>1?e[i-1]:void 0,u=i>2?e[2]:void 0;for(o=t.length>3&&"function"==typeof o?(i--,o):void 0,u&&co(e[0],e[1],u)&&(o=i<3?void 0:o,i=1),n=gt(n);++r<i;){var a=e[r];a&&t(n,a,r,o)}return n}))}function xi(t,n){return function(e,r){if(null==e)return e;if(!Fu(e))return t(e,r);for(var i=e.length,o=n?i:-1,u=gt(e);(n?o--:++o<i)&&!1!==r(u[o],o,u););return e}}function Mi(t){return function(n,e,r){for(var i=-1,o=gt(n),u=r(n),a=u.length;a--;){var c=u[t?a:++i];if(!1===e(o[c],c,o))break}return n}}function ji(t){return function(n){var e=zn(n=ca(n))?Zn(n):void 0,r=e?e[0]:n.charAt(0),i=e?fi(e,1).join(""):n.slice(1);return r[t]()+i}}function ki(t){return function(n){return gn(qa(Pa(n).replace(Nt,"")),t,"")}}function Oi(t){return function(){var n=arguments;switch(n.length){case 0:return new t;case 1:return new t(n[0]);case 2:return new t(n[0],n[1]);case 3:return new t(n[0],n[1],n[2]);case 4:return new t(n[0],n[1],n[2],n[3]);case 5:return new t(n[0],n[1],n[2],n[3],n[4]);case 6:return new t(n[0],n[1],n[2],n[3],n[4],n[5]);case 7:return new t(n[0],n[1],n[2],n[3],n[4],n[5],n[6])}var e=Te(t.prototype),r=t.apply(e,n);return $u(r)?r:e}}function Si(t){return function(n,e,r){var i=gt(n);if(!Fu(n)){var o=Qi(e,3);n=wa(n),e=function(t){return o(i[t],t,i)}}var u=t(n,e,r);return u>-1?i[o?n[u]:u]:void 0}}function Ci(t){return Vi((function(n){var e=n.length,r=e,i=Ne.prototype.thru;for(t&&n.reverse();r--;){var u=n[r];if("function"!=typeof u)throw new mt(o);if(i&&!a&&"wrapper"==Xi(u))var a=new Ne([],!0)}for(r=a?r:e;++r<e;){var c=Xi(u=n[r]),s="wrapper"==c?Yi(u):void 0;a=s&&fo(s[0])&&424==s[1]&&!s[4].length&&1==s[9]?a[Xi(s[0])].apply(a,s[3]):1==u.length&&fo(u)?a[c]():a.thru(u)}return function(){var t=arguments,r=t[0];if(a&&1==t.length&&Eu(r))return a.plant(r).value();for(var i=0,o=e?n[i].apply(this,t):r;++i<e;)o=n[i].call(this,o);return o}}))}function Ai(t,n,e,i,o,u,a,c,s,f){var l=128&n,h=1&n,d=2&n,v=24&n,p=512&n,g=d?void 0:Oi(t);return function y(){for(var b=arguments.length,m=r(b),_=b;_--;)m[_]=arguments[_];if(v)var w=Gi(y),x=Fn(m,w);if(i&&(m=gi(m,i,o,v)),u&&(m=yi(m,u,a,v)),b-=x,v&&b<f){var M=Hn(m,w);return Fi(t,n,Ai,y.placeholder,e,m,M,c,s,f-b)}var j=h?e:this,k=d?j[t]:t;return b=m.length,c?m=bo(m,c):p&&b>1&&m.reverse(),l&&s<b&&(m.length=s),this&&this!==Zt&&this instanceof y&&(k=g||Oi(k)),k.apply(j,m)}}function Ti(t,n){return function(e,r){return function(t,n,e,r){return sr(t,(function(t,i,o){n(r,e(t),i,o)})),r}(e,t,n(r),{})}}function Ii(t,n){return function(e,r){var i;if(void 0===e&&void 0===r)return n;if(void 0!==e&&(i=e),void 0!==r){if(void 0===i)return r;"string"==typeof e||"string"==typeof r?(e=Jr(e),r=Jr(r)):(e=Qr(e),r=Qr(r)),i=t(e,r)}return i}}function Ni(t){return Vi((function(n){return n=vn(n,In(Qi())),Ur((function(e){var r=this;return t(n,(function(t){return un(t,r,e)}))}))}))}function Pi(t,n){var e=(n=void 0===n?" ":Jr(n)).length;if(e<2)return e?Rr(n,t):n;var r=Rr(n,te(t/Wn(n)));return zn(n)?fi(Zn(r),0,t).join(""):r.slice(0,t)}function Ei(t){return function(n,e,i){return i&&"number"!=typeof i&&co(n,e,i)&&(e=i=void 0),n=ra(n),void 0===e?(e=n,n=0):e=ra(e),function(t,n,e,i){for(var o=-1,u=ae(te((n-t)/(e||1)),0),a=r(u);u--;)a[i?u:++o]=t,t+=e;return a}(n,e,i=void 0===i?n<e?1:-1:ra(i),t)}}function Li(t){return function(n,e){return"string"==typeof n&&"string"==typeof e||(n=ua(n),e=ua(e)),t(n,e)}}function Fi(t,n,e,r,i,o,u,a,c,s){var f=8&n;n|=f?32:64,4&(n&=~(f?64:32))||(n&=-4);var l=[t,n,i,f?o:void 0,f?u:void 0,f?void 0:o,f?void 0:u,a,c,s],h=e.apply(void 0,l);return fo(t)&&_o(h,l),h.placeholder=r,Mo(h,t,n)}function Di(t){var n=pt[t];return function(t,e){if(t=ua(t),(e=null==e?0:ce(ia(e),292))&&ie(t)){var r=(ca(t)+"e").split("e");return+((r=(ca(n(r[0]+"e"+(+r[1]+e)))+"e").split("e"))[0]+"e"+(+r[1]-e))}return n(t)}}var Ri=ge&&1/$n(new ge([,-0]))[1]==1/0?function(t){return new ge(t)}:Ja;function Ui(t){return function(n){var e=ro(n);return e==p?qn(n):e==m?Vn(n):function(t,n){return vn(n,(function(n){return[n,t[n]]}))}(n,t(n))}}function zi(t,n,e,i,a,c,s,f){var l=2&n;if(!l&&"function"!=typeof t)throw new mt(o);var h=i?i.length:0;if(h||(n&=-97,i=a=void 0),s=void 0===s?s:ae(ia(s),0),f=void 0===f?f:ia(f),h-=a?a.length:0,64&n){var d=i,v=a;i=a=void 0}var p=l?void 0:Yi(t),g=[t,n,e,i,a,d,v,c,s,f];if(p&&function(t,n){var e=t[1],r=n[1],i=e|r,o=i<131,a=128==r&&8==e||128==r&&256==e&&t[7].length<=n[8]||384==r&&n[7].length<=n[8]&&8==e;if(!o&&!a)return t;1&r&&(t[2]=n[2],i|=1&e?0:4);var c=n[3];if(c){var s=t[3];t[3]=s?gi(s,c,n[4]):c,t[4]=s?Hn(t[3],u):n[4]}(c=n[5])&&(s=t[5],t[5]=s?yi(s,c,n[6]):c,t[6]=s?Hn(t[5],u):n[6]);(c=n[7])&&(t[7]=c);128&r&&(t[8]=null==t[8]?n[8]:ce(t[8],n[8]));null==t[9]&&(t[9]=n[9]);t[0]=n[0],t[1]=i}(g,p),t=g[0],n=g[1],e=g[2],i=g[3],a=g[4],!(f=g[9]=void 0===g[9]?l?0:t.length:ae(g[9]-h,0))&&24&n&&(n&=-25),n&&1!=n)y=8==n||16==n?function(t,n,e){var i=Oi(t);return function o(){for(var u=arguments.length,a=r(u),c=u,s=Gi(o);c--;)a[c]=arguments[c];var f=u<3&&a[0]!==s&&a[u-1]!==s?[]:Hn(a,s);if((u-=f.length)<e)return Fi(t,n,Ai,o.placeholder,void 0,a,f,void 0,void 0,e-u);var l=this&&this!==Zt&&this instanceof o?i:t;return un(l,this,a)}}(t,n,f):32!=n&&33!=n||a.length?Ai.apply(void 0,g):function(t,n,e,i){var o=1&n,u=Oi(t);return function n(){for(var a=-1,c=arguments.length,s=-1,f=i.length,l=r(f+c),h=this&&this!==Zt&&this instanceof n?u:t;++s<f;)l[s]=i[s];for(;c--;)l[s++]=arguments[++a];return un(h,o?e:this,l)}}(t,n,e,i);else var y=function(t,n,e){var r=1&n,i=Oi(t);return function n(){var o=this&&this!==Zt&&this instanceof n?i:t;return o.apply(r?e:this,arguments)}}(t,n,e);return Mo((p?Hr:_o)(y,g),t,n)}function qi(t,n,e,r){return void 0===t||Tu(t,xt[e])&&!kt.call(r,e)?n:t}function Bi(t,n,e,r,i,o){return $u(t)&&$u(n)&&(o.set(n,t),Ir(t,n,void 0,Bi,o),o.delete(n)),t}function Hi(t){return Yu(t)?void 0:t}function $i(t,n,e,r,i,o){var u=1&e,a=t.length,c=n.length;if(a!=c&&!(u&&c>a))return!1;var s=o.get(t),f=o.get(n);if(s&&f)return s==n&&f==t;var l=-1,h=!0,d=2&e?new De:void 0;for(o.set(t,n),o.set(n,t);++l<a;){var v=t[l],p=n[l];if(r)var g=u?r(p,v,l,n,t,o):r(v,p,l,t,n,o);if(void 0!==g){if(g)continue;h=!1;break}if(d){if(!bn(n,(function(t,n){if(!Pn(d,n)&&(v===t||i(v,t,e,r,o)))return d.push(n)}))){h=!1;break}}else if(v!==p&&!i(v,p,e,r,o)){h=!1;break}}return o.delete(t),o.delete(n),h}function Vi(t){return xo(go(t,void 0,Lo),t+"")}function Wi(t){return dr(t,wa,no)}function Zi(t){return dr(t,xa,eo)}var Yi=me?function(t){return me.get(t)}:Ja;function Xi(t){for(var n=t.name+"",e=_e[n],r=kt.call(_e,n)?e.length:0;r--;){var i=e[r],o=i.func;if(null==o||o==t)return i.name}return n}function Gi(t){return(kt.call(Ae,"placeholder")?Ae:t).placeholder}function Qi(){var t=Ae.iteratee||Ya;return t=t===Ya?jr:t,arguments.length?t(arguments[0],arguments[1]):t}function Ji(t,n){var e,r,o=t.__data__;return("string"==(r=i(e=n))||"number"==r||"symbol"==r||"boolean"==r?"__proto__"!==e:null===e)?o["string"==typeof n?"string":"hash"]:o.map}function Ki(t){for(var n=wa(t),e=n.length;e--;){var r=n[e],i=t[r];n[e]=[r,i,vo(i)]}return n}function to(t,n){var e=function(t,n){return null==t?void 0:t[n]}(t,n);return Mr(e)?e:void 0}var no=ee?function(t){return null==t?[]:(t=gt(t),ln(ee(t),(function(n){return Xt.call(t,n)})))}:oc,eo=ee?function(t){for(var n=[];t;)pn(n,no(t)),t=Wt(t);return n}:oc,ro=vr;function io(t,n,e){for(var r=-1,i=(n=ci(n,t)).length,o=!1;++r<i;){var u=So(n[r]);if(!(o=null!=t&&e(t,u)))break;t=t[u]}return o||++r!=i?o:!!(i=null==t?0:t.length)&&Hu(i)&&ao(u,i)&&(Eu(t)||Pu(t))}function oo(t){return"function"!=typeof t.constructor||ho(t)?{}:Te(Wt(t))}function uo(t){return Eu(t)||Pu(t)||!!(Jt&&t&&t[Jt])}function ao(t,n){var e=i(t);return!!(n=null==n?9007199254740991:n)&&("number"==e||"symbol"!=e&&ct.test(t))&&t>-1&&t%1==0&&t<n}function co(t,n,e){if(!$u(e))return!1;var r=i(n);return!!("number"==r?Fu(e)&&ao(n,e.length):"string"==r&&n in e)&&Tu(e[n],t)}function so(t,n){if(Eu(t))return!1;var e=i(t);return!("number"!=e&&"symbol"!=e&&"boolean"!=e&&null!=t&&!Ju(t))||($.test(t)||!H.test(t)||null!=n&&t in gt(n))}function fo(t){var n=Xi(t),e=Ae[n];if("function"!=typeof e||!(n in Pe.prototype))return!1;if(t===e)return!0;var r=Yi(e);return!!r&&t===r[0]}(de&&ro(new de(new ArrayBuffer(1)))!=j||ve&&ro(new ve)!=p||pe&&"[object Promise]"!=ro(pe.resolve())||ge&&ro(new ge)!=m||ye&&ro(new ye)!=x)&&(ro=function(t){var n=vr(t),e=n==y?t.constructor:void 0,r=e?Co(e):"";if(r)switch(r){case we:return j;case xe:return p;case Me:return"[object Promise]";case je:return m;case ke:return x}return n});var lo=Mt?qu:uc;function ho(t){var n=t&&t.constructor;return t===("function"==typeof n&&n.prototype||xt)}function vo(t){return t==t&&!$u(t)}function po(t,n){return function(e){return null!=e&&(e[t]===n&&(void 0!==n||t in gt(e)))}}function go(t,n,e){return n=ae(void 0===n?t.length-1:n,0),function(){for(var i=arguments,o=-1,u=ae(i.length-n,0),a=r(u);++o<u;)a[o]=i[n+o];o=-1;for(var c=r(n+1);++o<n;)c[o]=i[o];return c[n]=e(a),un(t,this,c)}}function yo(t,n){return n.length<2?t:hr(t,Wr(n,0,-1))}function bo(t,n){for(var e=t.length,r=ce(n.length,e),i=bi(t);r--;){var o=n[r];t[r]=ao(o,e)?i[o]:void 0}return t}function mo(t,n){if(("constructor"!==n||"function"!=typeof t[n])&&"__proto__"!=n)return t[n]}var _o=jo(Hr),wo=Kn||function(t,n){return Zt.setTimeout(t,n)},xo=jo($r);function Mo(t,n,e){var r=n+"";return xo(t,function(t,n){var e=n.length;if(!e)return t;var r=e-1;return n[r]=(e>1?"& ":"")+n[r],n=n.join(e>2?", ":" "),t.replace(Q,"{\n/* [wrapped with "+n+"] */\n")}(r,function(t,n){return cn(a,(function(e){var r="_."+e[0];n&e[1]&&!hn(t,r)&&t.push(r)})),t.sort()}(function(t){var n=t.match(J);return n?n[1].split(K):[]}(r),e)))}function jo(t){var n=0,e=0;return function(){var r=se(),i=16-(r-e);if(e=r,i>0){if(++n>=800)return arguments[0]}else n=0;return t.apply(void 0,arguments)}}function ko(t,n){var e=-1,r=t.length,i=r-1;for(n=void 0===n?r:n;++e<n;){var o=Dr(e,i),u=t[o];t[o]=t[e],t[e]=u}return t.length=n,t}var Oo=function(t){var n=ju(t,(function(t){return 500===e.size&&e.clear(),t})),e=n.cache;return n}((function(t){var n=[];return 46===t.charCodeAt(0)&&n.push(""),t.replace(V,(function(t,e,r,i){n.push(r?i.replace(nt,"$1"):e||t)})),n}));function So(t){if("string"==typeof t||Ju(t))return t;var n=t+"";return"0"==n&&1/t==-1/0?"-0":n}function Co(t){if(null!=t){try{return jt.call(t)}catch(t){}try{return t+""}catch(t){}}return""}function Ao(t){if(t instanceof Pe)return t.clone();var n=new Ne(t.__wrapped__,t.__chain__);return n.__actions__=bi(t.__actions__),n.__index__=t.__index__,n.__values__=t.__values__,n}var To=Ur((function(t,n){return Du(t)?tr(t,ur(n,1,Du,!0)):[]})),Io=Ur((function(t,n){var e=zo(n);return Du(e)&&(e=void 0),Du(t)?tr(t,ur(n,1,Du,!0),Qi(e,2)):[]})),No=Ur((function(t,n){var e=zo(n);return Du(e)&&(e=void 0),Du(t)?tr(t,ur(n,1,Du,!0),void 0,e):[]}));function Po(t,n,e){var r=null==t?0:t.length;if(!r)return-1;var i=null==e?0:ia(e);return i<0&&(i=ae(r+i,0)),wn(t,Qi(n,3),i)}function Eo(t,n,e){var r=null==t?0:t.length;if(!r)return-1;var i=r-1;return void 0!==e&&(i=ia(e),i=e<0?ae(r+i,0):ce(i,r-1)),wn(t,Qi(n,3),i,!0)}function Lo(t){return(null==t?0:t.length)?ur(t,1):[]}function Fo(t){return t&&t.length?t[0]:void 0}var Do=Ur((function(t){var n=vn(t,ui);return n.length&&n[0]===t[0]?br(n):[]})),Ro=Ur((function(t){var n=zo(t),e=vn(t,ui);return n===zo(e)?n=void 0:e.pop(),e.length&&e[0]===t[0]?br(e,Qi(n,2)):[]})),Uo=Ur((function(t){var n=zo(t),e=vn(t,ui);return(n="function"==typeof n?n:void 0)&&e.pop(),e.length&&e[0]===t[0]?br(e,void 0,n):[]}));function zo(t){var n=null==t?0:t.length;return n?t[n-1]:void 0}var qo=Ur(Bo);function Bo(t,n){return t&&t.length&&n&&n.length?Lr(t,n):t}var Ho=Vi((function(t,n){var e=null==t?0:t.length,r=Xe(t,n);return Fr(t,vn(n,(function(t){return ao(t,e)?+t:t})).sort(pi)),r}));function $o(t){return null==t?t:he.call(t)}var Vo=Ur((function(t){return Kr(ur(t,1,Du,!0))})),Wo=Ur((function(t){var n=zo(t);return Du(n)&&(n=void 0),Kr(ur(t,1,Du,!0),Qi(n,2))})),Zo=Ur((function(t){var n=zo(t);return n="function"==typeof n?n:void 0,Kr(ur(t,1,Du,!0),void 0,n)}));function Yo(t){if(!t||!t.length)return[];var n=0;return t=ln(t,(function(t){if(Du(t))return n=ae(t.length,n),!0})),Tn(n,(function(n){return vn(t,On(n))}))}function Xo(t,n){if(!t||!t.length)return[];var e=Yo(t);return null==n?e:vn(e,(function(t){return un(n,void 0,t)}))}var Go=Ur((function(t,n){return Du(t)?tr(t,n):[]})),Qo=Ur((function(t){return ii(ln(t,Du))})),Jo=Ur((function(t){var n=zo(t);return Du(n)&&(n=void 0),ii(ln(t,Du),Qi(n,2))})),Ko=Ur((function(t){var n=zo(t);return n="function"==typeof n?n:void 0,ii(ln(t,Du),void 0,n)})),tu=Ur(Yo);var nu=Ur((function(t){var n=t.length,e=n>1?t[n-1]:void 0;return e="function"==typeof e?(t.pop(),e):void 0,Xo(t,e)}));function eu(t){var n=Ae(t);return n.__chain__=!0,n}function ru(t,n){return n(t)}var iu=Vi((function(t){var n=t.length,e=n?t[0]:0,r=this.__wrapped__,i=function(n){return Xe(n,t)};return!(n>1||this.__actions__.length)&&r instanceof Pe&&ao(e)?((r=r.slice(e,+e+(n?1:0))).__actions__.push({func:ru,args:[i],thisArg:void 0}),new Ne(r,this.__chain__).thru((function(t){return n&&!t.length&&t.push(void 0),t}))):this.thru(i)}));var ou=_i((function(t,n,e){kt.call(t,e)?++t[e]:Ye(t,e,1)}));var uu=Si(Po),au=Si(Eo);function cu(t,n){return(Eu(t)?cn:nr)(t,Qi(n,3))}function su(t,n){return(Eu(t)?sn:er)(t,Qi(n,3))}var fu=_i((function(t,n,e){kt.call(t,e)?t[e].push(n):Ye(t,e,[n])}));var lu=Ur((function(t,n,e){var i=-1,o="function"==typeof n,u=Fu(t)?r(t.length):[];return nr(t,(function(t){u[++i]=o?un(n,t,e):mr(t,n,e)})),u})),hu=_i((function(t,n,e){Ye(t,e,n)}));function du(t,n){return(Eu(t)?vn:Cr)(t,Qi(n,3))}var vu=_i((function(t,n,e){t[e?0:1].push(n)}),(function(){return[[],[]]}));var pu=Ur((function(t,n){if(null==t)return[];var e=n.length;return e>1&&co(t,n[0],n[1])?n=[]:e>2&&co(n[0],n[1],n[2])&&(n=[n[0]]),Pr(t,ur(n,1),[])})),gu=Jn||function(){return Zt.Date.now()};function yu(t,n,e){return n=e?void 0:n,zi(t,128,void 0,void 0,void 0,void 0,n=t&&null==n?t.length:n)}function bu(t,n){var e;if("function"!=typeof n)throw new mt(o);return t=ia(t),function(){return--t>0&&(e=n.apply(this,arguments)),t<=1&&(n=void 0),e}}var mu=Ur((function(t,n,e){var r=1;if(e.length){var i=Hn(e,Gi(mu));r|=32}return zi(t,r,n,e,i)})),_u=Ur((function(t,n,e){var r=3;if(e.length){var i=Hn(e,Gi(_u));r|=32}return zi(n,r,t,e,i)}));function wu(t,n,e){var r,i,u,a,c,s,f=0,l=!1,h=!1,d=!0;if("function"!=typeof t)throw new mt(o);function v(n){var e=r,o=i;return r=i=void 0,f=n,a=t.apply(o,e)}function p(t){return f=t,c=wo(y,n),l?v(t):a}function g(t){var e=t-s;return void 0===s||e>=n||e<0||h&&t-f>=u}function y(){var t=gu();if(g(t))return b(t);c=wo(y,function(t){var e=n-(t-s);return h?ce(e,u-(t-f)):e}(t))}function b(t){return c=void 0,d&&r?v(t):(r=i=void 0,a)}function m(){var t=gu(),e=g(t);if(r=arguments,i=this,s=t,e){if(void 0===c)return p(s);if(h)return li(c),c=wo(y,n),v(s)}return void 0===c&&(c=wo(y,n)),a}return n=ua(n)||0,$u(e)&&(l=!!e.leading,u=(h="maxWait"in e)?ae(ua(e.maxWait)||0,n):u,d="trailing"in e?!!e.trailing:d),m.cancel=function(){void 0!==c&&li(c),f=0,r=s=i=c=void 0},m.flush=function(){return void 0===c?a:b(gu())},m}var xu=Ur((function(t,n){return Ke(t,1,n)})),Mu=Ur((function(t,n,e){return Ke(t,ua(n)||0,e)}));function ju(t,n){if("function"!=typeof t||null!=n&&"function"!=typeof n)throw new mt(o);var e=function e(){var r=arguments,i=n?n.apply(this,r):r[0],o=e.cache;if(o.has(i))return o.get(i);var u=t.apply(this,r);return e.cache=o.set(i,u)||o,u};return e.cache=new(ju.Cache||Fe),e}function ku(t){if("function"!=typeof t)throw new mt(o);return function(){var n=arguments;switch(n.length){case 0:return!t.call(this);case 1:return!t.call(this,n[0]);case 2:return!t.call(this,n[0],n[1]);case 3:return!t.call(this,n[0],n[1],n[2])}return!t.apply(this,n)}}ju.Cache=Fe;var Ou=si((function(t,n){var e=(n=1==n.length&&Eu(n[0])?vn(n[0],In(Qi())):vn(ur(n,1),In(Qi()))).length;return Ur((function(r){for(var i=-1,o=ce(r.length,e);++i<o;)r[i]=n[i].call(this,r[i]);return un(t,this,r)}))})),Su=Ur((function(t,n){return zi(t,32,void 0,n,Hn(n,Gi(Su)))})),Cu=Ur((function(t,n){return zi(t,64,void 0,n,Hn(n,Gi(Cu)))})),Au=Vi((function(t,n){return zi(t,256,void 0,void 0,void 0,n)}));function Tu(t,n){return t===n||t!=t&&n!=n}var Iu=Li(pr),Nu=Li((function(t,n){return t>=n})),Pu=_r(function(){return arguments}())?_r:function(t){return Vu(t)&&kt.call(t,"callee")&&!Xt.call(t,"callee")},Eu=r.isArray,Lu=Kt?In(Kt):function(t){return Vu(t)&&vr(t)==M};function Fu(t){return null!=t&&Hu(t.length)&&!qu(t)}function Du(t){return Vu(t)&&Fu(t)}var Ru=re||uc,Uu=tn?In(tn):function(t){return Vu(t)&&vr(t)==l};function zu(t){if(!Vu(t))return!1;var n=vr(t);return n==h||"[object DOMException]"==n||"string"==typeof t.message&&"string"==typeof t.name&&!Yu(t)}function qu(t){if(!$u(t))return!1;var n=vr(t);return n==d||n==v||"[object AsyncFunction]"==n||"[object Proxy]"==n}function Bu(t){return"number"==typeof t&&t==ia(t)}function Hu(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=9007199254740991}function $u(t){var n=i(t);return null!=t&&("object"==n||"function"==n)}function Vu(t){return null!=t&&"object"==i(t)}var Wu=nn?In(nn):function(t){return Vu(t)&&ro(t)==p};function Zu(t){return"number"==typeof t||Vu(t)&&vr(t)==g}function Yu(t){if(!Vu(t)||vr(t)!=y)return!1;var n=Wt(t);if(null===n)return!0;var e=kt.call(n,"constructor")&&n.constructor;return"function"==typeof e&&e instanceof e&&jt.call(e)==At}var Xu=en?In(en):function(t){return Vu(t)&&vr(t)==b};var Gu=rn?In(rn):function(t){return Vu(t)&&ro(t)==m};function Qu(t){return"string"==typeof t||!Eu(t)&&Vu(t)&&vr(t)==_}function Ju(t){return"symbol"==i(t)||Vu(t)&&vr(t)==w}var Ku=on?In(on):function(t){return Vu(t)&&Hu(t.length)&&!!zt[vr(t)]};var ta=Li(Sr),na=Li((function(t,n){return t<=n}));function ea(t){if(!t)return[];if(Fu(t))return Qu(t)?Zn(t):bi(t);if(mn&&t[mn])return function(t){for(var n,e=[];!(n=t.next()).done;)e.push(n.value);return e}(t[mn]());var n=ro(t);return(n==p?qn:n==m?$n:Ta)(t)}function ra(t){return t?(t=ua(t))===1/0||t===-1/0?17976931348623157e292*(t<0?-1:1):t==t?t:0:0===t?t:0}function ia(t){var n=ra(t),e=n%1;return n==n?e?n-e:n:0}function oa(t){return t?Ge(ia(t),0,4294967295):0}function ua(t){if("number"==typeof t)return t;if(Ju(t))return NaN;if($u(t)){var n="function"==typeof t.valueOf?t.valueOf():t;t=$u(n)?n+"":n}if("string"!=typeof t)return 0===t?t:+t;t=t.replace(Y,"");var e=ot.test(t);return e||at.test(t)?$t(t.slice(2),e?2:8):it.test(t)?NaN:+t}function aa(t){return mi(t,xa(t))}function ca(t){return null==t?"":Jr(t)}var sa=wi((function(t,n){if(ho(n)||Fu(n))mi(n,wa(n),t);else for(var e in n)kt.call(n,e)&&$e(t,e,n[e])})),fa=wi((function(t,n){mi(n,xa(n),t)})),la=wi((function(t,n,e,r){mi(n,xa(n),t,r)})),ha=wi((function(t,n,e,r){mi(n,wa(n),t,r)})),da=Vi(Xe);var va=Ur((function(t,n){t=gt(t);var e=-1,r=n.length,i=r>2?n[2]:void 0;for(i&&co(n[0],n[1],i)&&(r=1);++e<r;)for(var o=n[e],u=xa(o),a=-1,c=u.length;++a<c;){var s=u[a],f=t[s];(void 0===f||Tu(f,xt[s])&&!kt.call(t,s))&&(t[s]=o[s])}return t})),pa=Ur((function(t){return t.push(void 0,Bi),un(ja,void 0,t)}));function ga(t,n,e){var r=null==t?void 0:hr(t,n);return void 0===r?e:r}function ya(t,n){return null!=t&&io(t,n,yr)}var ba=Ti((function(t,n,e){null!=n&&"function"!=typeof n.toString&&(n=Ct.call(n)),t[n]=e}),$a(Za)),ma=Ti((function(t,n,e){null!=n&&"function"!=typeof n.toString&&(n=Ct.call(n)),kt.call(t,n)?t[n].push(e):t[n]=[e]}),Qi),_a=Ur(mr);function wa(t){return Fu(t)?Ue(t):kr(t)}function xa(t){return Fu(t)?Ue(t,!0):Or(t)}var Ma=wi((function(t,n,e){Ir(t,n,e)})),ja=wi((function(t,n,e,r){Ir(t,n,e,r)})),ka=Vi((function(t,n){var e={};if(null==t)return e;var r=!1;n=vn(n,(function(n){return n=ci(n,t),r||(r=n.length>1),n})),mi(t,Zi(t),e),r&&(e=Qe(e,7,Hi));for(var i=n.length;i--;)ti(e,n[i]);return e}));var Oa=Vi((function(t,n){return null==t?{}:function(t,n){return Er(t,n,(function(n,e){return ya(t,e)}))}(t,n)}));function Sa(t,n){if(null==t)return{};var e=vn(Zi(t),(function(t){return[t]}));return n=Qi(n),Er(t,e,(function(t,e){return n(t,e[0])}))}var Ca=Ui(wa),Aa=Ui(xa);function Ta(t){return null==t?[]:Nn(t,wa(t))}var Ia=ki((function(t,n,e){return n=n.toLowerCase(),t+(e?Na(n):n)}));function Na(t){return za(ca(t).toLowerCase())}function Pa(t){return(t=ca(t))&&t.replace(st,Dn).replace(Pt,"")}var Ea=ki((function(t,n,e){return t+(e?"-":"")+n.toLowerCase()})),La=ki((function(t,n,e){return t+(e?" ":"")+n.toLowerCase()})),Fa=ji("toLowerCase");var Da=ki((function(t,n,e){return t+(e?"_":"")+n.toLowerCase()}));var Ra=ki((function(t,n,e){return t+(e?" ":"")+za(n)}));var Ua=ki((function(t,n,e){return t+(e?" ":"")+n.toUpperCase()})),za=ji("toUpperCase");function qa(t,n,e){return t=ca(t),void 0===(n=e?void 0:n)?function(t){return Dt.test(t)}(t)?function(t){return t.match(Lt)||[]}(t):function(t){return t.match(tt)||[]}(t):t.match(n)||[]}var Ba=Ur((function(t,n){try{return un(t,void 0,n)}catch(t){return zu(t)?t:new dt(t)}})),Ha=Vi((function(t,n){return cn(n,(function(n){n=So(n),Ye(t,n,mu(t[n],t))})),t}));function $a(t){return function(){return t}}var Va=Ci(),Wa=Ci(!0);function Za(t){return t}function Ya(t){return jr("function"==typeof t?t:Qe(t,1))}var Xa=Ur((function(t,n){return function(e){return mr(e,t,n)}})),Ga=Ur((function(t,n){return function(e){return mr(t,e,n)}}));function Qa(t,n,e){var r=wa(n),i=lr(n,r);null!=e||$u(n)&&(i.length||!r.length)||(e=n,n=t,t=this,i=lr(n,wa(n)));var o=!($u(e)&&"chain"in e&&!e.chain),u=qu(t);return cn(i,(function(e){var r=n[e];t[e]=r,u&&(t.prototype[e]=function(){var n=this.__chain__;if(o||n){var e=t(this.__wrapped__),i=e.__actions__=bi(this.__actions__);return i.push({func:r,args:arguments,thisArg:t}),e.__chain__=n,e}return r.apply(t,pn([this.value()],arguments))})})),t}function Ja(){}var Ka=Ni(vn),tc=Ni(fn),nc=Ni(bn);function ec(t){return so(t)?On(So(t)):function(t){return function(n){return hr(n,t)}}(t)}var rc=Ei(),ic=Ei(!0);function oc(){return[]}function uc(){return!1}var ac=Ii((function(t,n){return t+n}),0),cc=Di("ceil"),sc=Ii((function(t,n){return t/n}),1),fc=Di("floor");var lc,hc=Ii((function(t,n){return t*n}),1),dc=Di("round"),vc=Ii((function(t,n){return t-n}),0);return Ae.after=function(t,n){if("function"!=typeof n)throw new mt(o);return t=ia(t),function(){if(--t<1)return n.apply(this,arguments)}},Ae.ary=yu,Ae.assign=sa,Ae.assignIn=fa,Ae.assignInWith=la,Ae.assignWith=ha,Ae.at=da,Ae.before=bu,Ae.bind=mu,Ae.bindAll=Ha,Ae.bindKey=_u,Ae.castArray=function(){if(!arguments.length)return[];var t=arguments[0];return Eu(t)?t:[t]},Ae.chain=eu,Ae.chunk=function(t,n,e){n=(e?co(t,n,e):void 0===n)?1:ae(ia(n),0);var i=null==t?0:t.length;if(!i||n<1)return[];for(var o=0,u=0,a=r(te(i/n));o<i;)a[u++]=Wr(t,o,o+=n);return a},Ae.compact=function(t){for(var n=-1,e=null==t?0:t.length,r=0,i=[];++n<e;){var o=t[n];o&&(i[r++]=o)}return i},Ae.concat=function(){var t=arguments.length;if(!t)return[];for(var n=r(t-1),e=arguments[0],i=t;i--;)n[i-1]=arguments[i];return pn(Eu(e)?bi(e):[e],ur(n,1))},Ae.cond=function(t){var n=null==t?0:t.length,e=Qi();return t=n?vn(t,(function(t){if("function"!=typeof t[1])throw new mt(o);return[e(t[0]),t[1]]})):[],Ur((function(e){for(var r=-1;++r<n;){var i=t[r];if(un(i[0],this,e))return un(i[1],this,e)}}))},Ae.conforms=function(t){return function(t){var n=wa(t);return function(e){return Je(e,t,n)}}(Qe(t,1))},Ae.constant=$a,Ae.countBy=ou,Ae.create=function(t,n){var e=Te(t);return null==n?e:Ze(e,n)},Ae.curry=function t(n,e,r){var i=zi(n,8,void 0,void 0,void 0,void 0,void 0,e=r?void 0:e);return i.placeholder=t.placeholder,i},Ae.curryRight=function t(n,e,r){var i=zi(n,16,void 0,void 0,void 0,void 0,void 0,e=r?void 0:e);return i.placeholder=t.placeholder,i},Ae.debounce=wu,Ae.defaults=va,Ae.defaultsDeep=pa,Ae.defer=xu,Ae.delay=Mu,Ae.difference=To,Ae.differenceBy=Io,Ae.differenceWith=No,Ae.drop=function(t,n,e){var r=null==t?0:t.length;return r?Wr(t,(n=e||void 0===n?1:ia(n))<0?0:n,r):[]},Ae.dropRight=function(t,n,e){var r=null==t?0:t.length;return r?Wr(t,0,(n=r-(n=e||void 0===n?1:ia(n)))<0?0:n):[]},Ae.dropRightWhile=function(t,n){return t&&t.length?ei(t,Qi(n,3),!0,!0):[]},Ae.dropWhile=function(t,n){return t&&t.length?ei(t,Qi(n,3),!0):[]},Ae.fill=function(t,n,e,r){var i=null==t?0:t.length;return i?(e&&"number"!=typeof e&&co(t,n,e)&&(e=0,r=i),function(t,n,e,r){var i=t.length;for((e=ia(e))<0&&(e=-e>i?0:i+e),(r=void 0===r||r>i?i:ia(r))<0&&(r+=i),r=e>r?0:oa(r);e<r;)t[e++]=n;return t}(t,n,e,r)):[]},Ae.filter=function(t,n){return(Eu(t)?ln:or)(t,Qi(n,3))},Ae.flatMap=function(t,n){return ur(du(t,n),1)},Ae.flatMapDeep=function(t,n){return ur(du(t,n),1/0)},Ae.flatMapDepth=function(t,n,e){return e=void 0===e?1:ia(e),ur(du(t,n),e)},Ae.flatten=Lo,Ae.flattenDeep=function(t){return(null==t?0:t.length)?ur(t,1/0):[]},Ae.flattenDepth=function(t,n){return(null==t?0:t.length)?ur(t,n=void 0===n?1:ia(n)):[]},Ae.flip=function(t){return zi(t,512)},Ae.flow=Va,Ae.flowRight=Wa,Ae.fromPairs=function(t){for(var n=-1,e=null==t?0:t.length,r={};++n<e;){var i=t[n];r[i[0]]=i[1]}return r},Ae.functions=function(t){return null==t?[]:lr(t,wa(t))},Ae.functionsIn=function(t){return null==t?[]:lr(t,xa(t))},Ae.groupBy=fu,Ae.initial=function(t){return(null==t?0:t.length)?Wr(t,0,-1):[]},Ae.intersection=Do,Ae.intersectionBy=Ro,Ae.intersectionWith=Uo,Ae.invert=ba,Ae.invertBy=ma,Ae.invokeMap=lu,Ae.iteratee=Ya,Ae.keyBy=hu,Ae.keys=wa,Ae.keysIn=xa,Ae.map=du,Ae.mapKeys=function(t,n){var e={};return n=Qi(n,3),sr(t,(function(t,r,i){Ye(e,n(t,r,i),t)})),e},Ae.mapValues=function(t,n){var e={};return n=Qi(n,3),sr(t,(function(t,r,i){Ye(e,r,n(t,r,i))})),e},Ae.matches=function(t){return Ar(Qe(t,1))},Ae.matchesProperty=function(t,n){return Tr(t,Qe(n,1))},Ae.memoize=ju,Ae.merge=Ma,Ae.mergeWith=ja,Ae.method=Xa,Ae.methodOf=Ga,Ae.mixin=Qa,Ae.negate=ku,Ae.nthArg=function(t){return t=ia(t),Ur((function(n){return Nr(n,t)}))},Ae.omit=ka,Ae.omitBy=function(t,n){return Sa(t,ku(Qi(n)))},Ae.once=function(t){return bu(2,t)},Ae.orderBy=function(t,n,e,r){return null==t?[]:(Eu(n)||(n=null==n?[]:[n]),Eu(e=r?void 0:e)||(e=null==e?[]:[e]),Pr(t,n,e))},Ae.over=Ka,Ae.overArgs=Ou,Ae.overEvery=tc,Ae.overSome=nc,Ae.partial=Su,Ae.partialRight=Cu,Ae.partition=vu,Ae.pick=Oa,Ae.pickBy=Sa,Ae.property=ec,Ae.propertyOf=function(t){return function(n){return null==t?void 0:hr(t,n)}},Ae.pull=qo,Ae.pullAll=Bo,Ae.pullAllBy=function(t,n,e){return t&&t.length&&n&&n.length?Lr(t,n,Qi(e,2)):t},Ae.pullAllWith=function(t,n,e){return t&&t.length&&n&&n.length?Lr(t,n,void 0,e):t},Ae.pullAt=Ho,Ae.range=rc,Ae.rangeRight=ic,Ae.rearg=Au,Ae.reject=function(t,n){return(Eu(t)?ln:or)(t,ku(Qi(n,3)))},Ae.remove=function(t,n){var e=[];if(!t||!t.length)return e;var r=-1,i=[],o=t.length;for(n=Qi(n,3);++r<o;){var u=t[r];n(u,r,t)&&(e.push(u),i.push(r))}return Fr(t,i),e},Ae.rest=function(t,n){if("function"!=typeof t)throw new mt(o);return Ur(t,n=void 0===n?n:ia(n))},Ae.reverse=$o,Ae.sampleSize=function(t,n,e){return n=(e?co(t,n,e):void 0===n)?1:ia(n),(Eu(t)?qe:qr)(t,n)},Ae.set=function(t,n,e){return null==t?t:Br(t,n,e)},Ae.setWith=function(t,n,e,r){return r="function"==typeof r?r:void 0,null==t?t:Br(t,n,e,r)},Ae.shuffle=function(t){return(Eu(t)?Be:Vr)(t)},Ae.slice=function(t,n,e){var r=null==t?0:t.length;return r?(e&&"number"!=typeof e&&co(t,n,e)?(n=0,e=r):(n=null==n?0:ia(n),e=void 0===e?r:ia(e)),Wr(t,n,e)):[]},Ae.sortBy=pu,Ae.sortedUniq=function(t){return t&&t.length?Gr(t):[]},Ae.sortedUniqBy=function(t,n){return t&&t.length?Gr(t,Qi(n,2)):[]},Ae.split=function(t,n,e){return e&&"number"!=typeof e&&co(t,n,e)&&(n=e=void 0),(e=void 0===e?4294967295:e>>>0)?(t=ca(t))&&("string"==typeof n||null!=n&&!Xu(n))&&!(n=Jr(n))&&zn(t)?fi(Zn(t),0,e):t.split(n,e):[]},Ae.spread=function(t,n){if("function"!=typeof t)throw new mt(o);return n=null==n?0:ae(ia(n),0),Ur((function(e){var r=e[n],i=fi(e,0,n);return r&&pn(i,r),un(t,this,i)}))},Ae.tail=function(t){var n=null==t?0:t.length;return n?Wr(t,1,n):[]},Ae.take=function(t,n,e){return t&&t.length?Wr(t,0,(n=e||void 0===n?1:ia(n))<0?0:n):[]},Ae.takeRight=function(t,n,e){var r=null==t?0:t.length;return r?Wr(t,(n=r-(n=e||void 0===n?1:ia(n)))<0?0:n,r):[]},Ae.takeRightWhile=function(t,n){return t&&t.length?ei(t,Qi(n,3),!1,!0):[]},Ae.takeWhile=function(t,n){return t&&t.length?ei(t,Qi(n,3)):[]},Ae.tap=function(t,n){return n(t),t},Ae.throttle=function(t,n,e){var r=!0,i=!0;if("function"!=typeof t)throw new mt(o);return $u(e)&&(r="leading"in e?!!e.leading:r,i="trailing"in e?!!e.trailing:i),wu(t,n,{leading:r,maxWait:n,trailing:i})},Ae.thru=ru,Ae.toArray=ea,Ae.toPairs=Ca,Ae.toPairsIn=Aa,Ae.toPath=function(t){return Eu(t)?vn(t,So):Ju(t)?[t]:bi(Oo(ca(t)))},Ae.toPlainObject=aa,Ae.transform=function(t,n,e){var r=Eu(t),i=r||Ru(t)||Ku(t);if(n=Qi(n,4),null==e){var o=t&&t.constructor;e=i?r?new o:[]:$u(t)&&qu(o)?Te(Wt(t)):{}}return(i?cn:sr)(t,(function(t,r,i){return n(e,t,r,i)})),e},Ae.unary=function(t){return yu(t,1)},Ae.union=Vo,Ae.unionBy=Wo,Ae.unionWith=Zo,Ae.uniq=function(t){return t&&t.length?Kr(t):[]},Ae.uniqBy=function(t,n){return t&&t.length?Kr(t,Qi(n,2)):[]},Ae.uniqWith=function(t,n){return n="function"==typeof n?n:void 0,t&&t.length?Kr(t,void 0,n):[]},Ae.unset=function(t,n){return null==t||ti(t,n)},Ae.unzip=Yo,Ae.unzipWith=Xo,Ae.update=function(t,n,e){return null==t?t:ni(t,n,ai(e))},Ae.updateWith=function(t,n,e,r){return r="function"==typeof r?r:void 0,null==t?t:ni(t,n,ai(e),r)},Ae.values=Ta,Ae.valuesIn=function(t){return null==t?[]:Nn(t,xa(t))},Ae.without=Go,Ae.words=qa,Ae.wrap=function(t,n){return Su(ai(n),t)},Ae.xor=Qo,Ae.xorBy=Jo,Ae.xorWith=Ko,Ae.zip=tu,Ae.zipObject=function(t,n){return oi(t||[],n||[],$e)},Ae.zipObjectDeep=function(t,n){return oi(t||[],n||[],Br)},Ae.zipWith=nu,Ae.entries=Ca,Ae.entriesIn=Aa,Ae.extend=fa,Ae.extendWith=la,Qa(Ae,Ae),Ae.add=ac,Ae.attempt=Ba,Ae.camelCase=Ia,Ae.capitalize=Na,Ae.ceil=cc,Ae.clamp=function(t,n,e){return void 0===e&&(e=n,n=void 0),void 0!==e&&(e=(e=ua(e))==e?e:0),void 0!==n&&(n=(n=ua(n))==n?n:0),Ge(ua(t),n,e)},Ae.clone=function(t){return Qe(t,4)},Ae.cloneDeep=function(t){return Qe(t,5)},Ae.cloneDeepWith=function(t,n){return Qe(t,5,n="function"==typeof n?n:void 0)},Ae.cloneWith=function(t,n){return Qe(t,4,n="function"==typeof n?n:void 0)},Ae.conformsTo=function(t,n){return null==n||Je(t,n,wa(n))},Ae.deburr=Pa,Ae.defaultTo=function(t,n){return null==t||t!=t?n:t},Ae.divide=sc,Ae.endsWith=function(t,n,e){t=ca(t),n=Jr(n);var r=t.length,i=e=void 0===e?r:Ge(ia(e),0,r);return(e-=n.length)>=0&&t.slice(e,i)==n},Ae.eq=Tu,Ae.escape=function(t){return(t=ca(t))&&U.test(t)?t.replace(D,Rn):t},Ae.escapeRegExp=function(t){return(t=ca(t))&&Z.test(t)?t.replace(W,"\\$&"):t},Ae.every=function(t,n,e){var r=Eu(t)?fn:rr;return e&&co(t,n,e)&&(n=void 0),r(t,Qi(n,3))},Ae.find=uu,Ae.findIndex=Po,Ae.findKey=function(t,n){return _n(t,Qi(n,3),sr)},Ae.findLast=au,Ae.findLastIndex=Eo,Ae.findLastKey=function(t,n){return _n(t,Qi(n,3),fr)},Ae.floor=fc,Ae.forEach=cu,Ae.forEachRight=su,Ae.forIn=function(t,n){return null==t?t:ar(t,Qi(n,3),xa)},Ae.forInRight=function(t,n){return null==t?t:cr(t,Qi(n,3),xa)},Ae.forOwn=function(t,n){return t&&sr(t,Qi(n,3))},Ae.forOwnRight=function(t,n){return t&&fr(t,Qi(n,3))},Ae.get=ga,Ae.gt=Iu,Ae.gte=Nu,Ae.has=function(t,n){return null!=t&&io(t,n,gr)},Ae.hasIn=ya,Ae.head=Fo,Ae.identity=Za,Ae.includes=function(t,n,e,r){t=Fu(t)?t:Ta(t),e=e&&!r?ia(e):0;var i=t.length;return e<0&&(e=ae(i+e,0)),Qu(t)?e<=i&&t.indexOf(n,e)>-1:!!i&&xn(t,n,e)>-1},Ae.indexOf=function(t,n,e){var r=null==t?0:t.length;if(!r)return-1;var i=null==e?0:ia(e);return i<0&&(i=ae(r+i,0)),xn(t,n,i)},Ae.inRange=function(t,n,e){return n=ra(n),void 0===e?(e=n,n=0):e=ra(e),function(t,n,e){return t>=ce(n,e)&&t<ae(n,e)}(t=ua(t),n,e)},Ae.invoke=_a,Ae.isArguments=Pu,Ae.isArray=Eu,Ae.isArrayBuffer=Lu,Ae.isArrayLike=Fu,Ae.isArrayLikeObject=Du,Ae.isBoolean=function(t){return!0===t||!1===t||Vu(t)&&vr(t)==f},Ae.isBuffer=Ru,Ae.isDate=Uu,Ae.isElement=function(t){return Vu(t)&&1===t.nodeType&&!Yu(t)},Ae.isEmpty=function(t){if(null==t)return!0;if(Fu(t)&&(Eu(t)||"string"==typeof t||"function"==typeof t.splice||Ru(t)||Ku(t)||Pu(t)))return!t.length;var n=ro(t);if(n==p||n==m)return!t.size;if(ho(t))return!kr(t).length;for(var e in t)if(kt.call(t,e))return!1;return!0},Ae.isEqual=function(t,n){return wr(t,n)},Ae.isEqualWith=function(t,n,e){var r=(e="function"==typeof e?e:void 0)?e(t,n):void 0;return void 0===r?wr(t,n,void 0,e):!!r},Ae.isError=zu,Ae.isFinite=function(t){return"number"==typeof t&&ie(t)},Ae.isFunction=qu,Ae.isInteger=Bu,Ae.isLength=Hu,Ae.isMap=Wu,Ae.isMatch=function(t,n){return t===n||xr(t,n,Ki(n))},Ae.isMatchWith=function(t,n,e){return e="function"==typeof e?e:void 0,xr(t,n,Ki(n),e)},Ae.isNaN=function(t){return Zu(t)&&t!=+t},Ae.isNative=function(t){if(lo(t))throw new dt("Unsupported core-js use. Try https://npms.io/search?q=ponyfill.");return Mr(t)},Ae.isNil=function(t){return null==t},Ae.isNull=function(t){return null===t},Ae.isNumber=Zu,Ae.isObject=$u,Ae.isObjectLike=Vu,Ae.isPlainObject=Yu,Ae.isRegExp=Xu,Ae.isSafeInteger=function(t){return Bu(t)&&t>=-9007199254740991&&t<=9007199254740991},Ae.isSet=Gu,Ae.isString=Qu,Ae.isSymbol=Ju,Ae.isTypedArray=Ku,Ae.isUndefined=function(t){return void 0===t},Ae.isWeakMap=function(t){return Vu(t)&&ro(t)==x},Ae.isWeakSet=function(t){return Vu(t)&&"[object WeakSet]"==vr(t)},Ae.join=function(t,n){return null==t?"":oe.call(t,n)},Ae.kebabCase=Ea,Ae.last=zo,Ae.lastIndexOf=function(t,n,e){var r=null==t?0:t.length;if(!r)return-1;var i=r;return void 0!==e&&(i=(i=ia(e))<0?ae(r+i,0):ce(i,r-1)),n==n?function(t,n,e){for(var r=e+1;r--;)if(t[r]===n)return r;return r}(t,n,i):wn(t,jn,i,!0)},Ae.lowerCase=La,Ae.lowerFirst=Fa,Ae.lt=ta,Ae.lte=na,Ae.max=function(t){return t&&t.length?ir(t,Za,pr):void 0},Ae.maxBy=function(t,n){return t&&t.length?ir(t,Qi(n,2),pr):void 0},Ae.mean=function(t){return kn(t,Za)},Ae.meanBy=function(t,n){return kn(t,Qi(n,2))},Ae.min=function(t){return t&&t.length?ir(t,Za,Sr):void 0},Ae.minBy=function(t,n){return t&&t.length?ir(t,Qi(n,2),Sr):void 0},Ae.stubArray=oc,Ae.stubFalse=uc,Ae.stubObject=function(){return{}},Ae.stubString=function(){return""},Ae.stubTrue=function(){return!0},Ae.multiply=hc,Ae.nth=function(t,n){return t&&t.length?Nr(t,ia(n)):void 0},Ae.noConflict=function(){return Zt._===this&&(Zt._=Tt),this},Ae.noop=Ja,Ae.now=gu,Ae.pad=function(t,n,e){t=ca(t);var r=(n=ia(n))?Wn(t):0;if(!n||r>=n)return t;var i=(n-r)/2;return Pi(ne(i),e)+t+Pi(te(i),e)},Ae.padEnd=function(t,n,e){t=ca(t);var r=(n=ia(n))?Wn(t):0;return n&&r<n?t+Pi(n-r,e):t},Ae.padStart=function(t,n,e){t=ca(t);var r=(n=ia(n))?Wn(t):0;return n&&r<n?Pi(n-r,e)+t:t},Ae.parseInt=function(t,n,e){return e||null==n?n=0:n&&(n=+n),fe(ca(t).replace(X,""),n||0)},Ae.random=function(t,n,e){if(e&&"boolean"!=typeof e&&co(t,n,e)&&(n=e=void 0),void 0===e&&("boolean"==typeof n?(e=n,n=void 0):"boolean"==typeof t&&(e=t,t=void 0)),void 0===t&&void 0===n?(t=0,n=1):(t=ra(t),void 0===n?(n=t,t=0):n=ra(n)),t>n){var r=t;t=n,n=r}if(e||t%1||n%1){var i=le();return ce(t+i*(n-t+Ht("1e-"+((i+"").length-1))),n)}return Dr(t,n)},Ae.reduce=function(t,n,e){var r=Eu(t)?gn:Cn,i=arguments.length<3;return r(t,Qi(n,4),e,i,nr)},Ae.reduceRight=function(t,n,e){var r=Eu(t)?yn:Cn,i=arguments.length<3;return r(t,Qi(n,4),e,i,er)},Ae.repeat=function(t,n,e){return n=(e?co(t,n,e):void 0===n)?1:ia(n),Rr(ca(t),n)},Ae.replace=function(){var t=arguments,n=ca(t[0]);return t.length<3?n:n.replace(t[1],t[2])},Ae.result=function(t,n,e){var r=-1,i=(n=ci(n,t)).length;for(i||(i=1,t=void 0);++r<i;){var o=null==t?void 0:t[So(n[r])];void 0===o&&(r=i,o=e),t=qu(o)?o.call(t):o}return t},Ae.round=dc,Ae.runInContext=t,Ae.sample=function(t){return(Eu(t)?ze:zr)(t)},Ae.size=function(t){if(null==t)return 0;if(Fu(t))return Qu(t)?Wn(t):t.length;var n=ro(t);return n==p||n==m?t.size:kr(t).length},Ae.snakeCase=Da,Ae.some=function(t,n,e){var r=Eu(t)?bn:Zr;return e&&co(t,n,e)&&(n=void 0),r(t,Qi(n,3))},Ae.sortedIndex=function(t,n){return Yr(t,n)},Ae.sortedIndexBy=function(t,n,e){return Xr(t,n,Qi(e,2))},Ae.sortedIndexOf=function(t,n){var e=null==t?0:t.length;if(e){var r=Yr(t,n);if(r<e&&Tu(t[r],n))return r}return-1},Ae.sortedLastIndex=function(t,n){return Yr(t,n,!0)},Ae.sortedLastIndexBy=function(t,n,e){return Xr(t,n,Qi(e,2),!0)},Ae.sortedLastIndexOf=function(t,n){if(null==t?0:t.length){var e=Yr(t,n,!0)-1;if(Tu(t[e],n))return e}return-1},Ae.startCase=Ra,Ae.startsWith=function(t,n,e){return t=ca(t),e=null==e?0:Ge(ia(e),0,t.length),n=Jr(n),t.slice(e,e+n.length)==n},Ae.subtract=vc,Ae.sum=function(t){return t&&t.length?An(t,Za):0},Ae.sumBy=function(t,n){return t&&t.length?An(t,Qi(n,2)):0},Ae.template=function(t,n,e){var r=Ae.templateSettings;e&&co(t,n,e)&&(n=void 0),t=ca(t),n=la({},n,r,qi);var i,o,u=la({},n.imports,r.imports,qi),a=wa(u),c=Nn(u,a),s=0,f=n.interpolate||ft,l="__p += '",h=yt((n.escape||ft).source+"|"+f.source+"|"+(f===B?et:ft).source+"|"+(n.evaluate||ft).source+"|$","g"),d="//# sourceURL="+(kt.call(n,"sourceURL")?(n.sourceURL+"").replace(/\s/g," "):"lodash.templateSources["+ ++Ut+"]")+"\n";t.replace(h,(function(n,e,r,u,a,c){return r||(r=u),l+=t.slice(s,c).replace(lt,Un),e&&(i=!0,l+="' +\n__e("+e+") +\n'"),a&&(o=!0,l+="';\n"+a+";\n__p += '"),r&&(l+="' +\n((__t = ("+r+")) == null ? '' : __t) +\n'"),s=c+n.length,n})),l+="';\n";var v=kt.call(n,"variable")&&n.variable;v||(l="with (obj) {\n"+l+"\n}\n"),l=(o?l.replace(P,""):l).replace(E,"$1").replace(L,"$1;"),l="function("+(v||"obj")+") {\n"+(v?"":"obj || (obj = {});\n")+"var __t, __p = ''"+(i?", __e = _.escape":"")+(o?", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n":";\n")+l+"return __p\n}";var p=Ba((function(){return vt(a,d+"return "+l).apply(void 0,c)}));if(p.source=l,zu(p))throw p;return p},Ae.times=function(t,n){if((t=ia(t))<1||t>9007199254740991)return[];var e=4294967295,r=ce(t,4294967295);t-=4294967295;for(var i=Tn(r,n=Qi(n));++e<t;)n(e);return i},Ae.toFinite=ra,Ae.toInteger=ia,Ae.toLength=oa,Ae.toLower=function(t){return ca(t).toLowerCase()},Ae.toNumber=ua,Ae.toSafeInteger=function(t){return t?Ge(ia(t),-9007199254740991,9007199254740991):0===t?t:0},Ae.toString=ca,Ae.toUpper=function(t){return ca(t).toUpperCase()},Ae.trim=function(t,n,e){if((t=ca(t))&&(e||void 0===n))return t.replace(Y,"");if(!t||!(n=Jr(n)))return t;var r=Zn(t),i=Zn(n);return fi(r,En(r,i),Ln(r,i)+1).join("")},Ae.trimEnd=function(t,n,e){if((t=ca(t))&&(e||void 0===n))return t.replace(G,"");if(!t||!(n=Jr(n)))return t;var r=Zn(t);return fi(r,0,Ln(r,Zn(n))+1).join("")},Ae.trimStart=function(t,n,e){if((t=ca(t))&&(e||void 0===n))return t.replace(X,"");if(!t||!(n=Jr(n)))return t;var r=Zn(t);return fi(r,En(r,Zn(n))).join("")},Ae.truncate=function(t,n){var e=30,r="...";if($u(n)){var i="separator"in n?n.separator:i;e="length"in n?ia(n.length):e,r="omission"in n?Jr(n.omission):r}var o=(t=ca(t)).length;if(zn(t)){var u=Zn(t);o=u.length}if(e>=o)return t;var a=e-Wn(r);if(a<1)return r;var c=u?fi(u,0,a).join(""):t.slice(0,a);if(void 0===i)return c+r;if(u&&(a+=c.length-a),Xu(i)){if(t.slice(a).search(i)){var s,f=c;for(i.global||(i=yt(i.source,ca(rt.exec(i))+"g")),i.lastIndex=0;s=i.exec(f);)var l=s.index;c=c.slice(0,void 0===l?a:l)}}else if(t.indexOf(Jr(i),a)!=a){var h=c.lastIndexOf(i);h>-1&&(c=c.slice(0,h))}return c+r},Ae.unescape=function(t){return(t=ca(t))&&R.test(t)?t.replace(F,Yn):t},Ae.uniqueId=function(t){var n=++Ot;return ca(t)+n},Ae.upperCase=Ua,Ae.upperFirst=za,Ae.each=cu,Ae.eachRight=su,Ae.first=Fo,Qa(Ae,(lc={},sr(Ae,(function(t,n){kt.call(Ae.prototype,n)||(lc[n]=t)})),lc),{chain:!1}),Ae.VERSION="4.17.19",cn(["bind","bindKey","curry","curryRight","partial","partialRight"],(function(t){Ae[t].placeholder=Ae})),cn(["drop","take"],(function(t,n){Pe.prototype[t]=function(e){e=void 0===e?1:ae(ia(e),0);var r=this.__filtered__&&!n?new Pe(this):this.clone();return r.__filtered__?r.__takeCount__=ce(e,r.__takeCount__):r.__views__.push({size:ce(e,4294967295),type:t+(r.__dir__<0?"Right":"")}),r},Pe.prototype[t+"Right"]=function(n){return this.reverse()[t](n).reverse()}})),cn(["filter","map","takeWhile"],(function(t,n){var e=n+1,r=1==e||3==e;Pe.prototype[t]=function(t){var n=this.clone();return n.__iteratees__.push({iteratee:Qi(t,3),type:e}),n.__filtered__=n.__filtered__||r,n}})),cn(["head","last"],(function(t,n){var e="take"+(n?"Right":"");Pe.prototype[t]=function(){return this[e](1).value()[0]}})),cn(["initial","tail"],(function(t,n){var e="drop"+(n?"":"Right");Pe.prototype[t]=function(){return this.__filtered__?new Pe(this):this[e](1)}})),Pe.prototype.compact=function(){return this.filter(Za)},Pe.prototype.find=function(t){return this.filter(t).head()},Pe.prototype.findLast=function(t){return this.reverse().find(t)},Pe.prototype.invokeMap=Ur((function(t,n){return"function"==typeof t?new Pe(this):this.map((function(e){return mr(e,t,n)}))})),Pe.prototype.reject=function(t){return this.filter(ku(Qi(t)))},Pe.prototype.slice=function(t,n){t=ia(t);var e=this;return e.__filtered__&&(t>0||n<0)?new Pe(e):(t<0?e=e.takeRight(-t):t&&(e=e.drop(t)),void 0!==n&&(e=(n=ia(n))<0?e.dropRight(-n):e.take(n-t)),e)},Pe.prototype.takeRightWhile=function(t){return this.reverse().takeWhile(t).reverse()},Pe.prototype.toArray=function(){return this.take(4294967295)},sr(Pe.prototype,(function(t,n){var e=/^(?:filter|find|map|reject)|While$/.test(n),r=/^(?:head|last)$/.test(n),i=Ae[r?"take"+("last"==n?"Right":""):n],o=r||/^find/.test(n);i&&(Ae.prototype[n]=function(){var n=this.__wrapped__,u=r?[1]:arguments,a=n instanceof Pe,c=u[0],s=a||Eu(n),f=function(t){var n=i.apply(Ae,pn([t],u));return r&&l?n[0]:n};s&&e&&"function"==typeof c&&1!=c.length&&(a=s=!1);var l=this.__chain__,h=!!this.__actions__.length,d=o&&!l,v=a&&!h;if(!o&&s){n=v?n:new Pe(this);var p=t.apply(n,u);return p.__actions__.push({func:ru,args:[f],thisArg:void 0}),new Ne(p,l)}return d&&v?t.apply(this,u):(p=this.thru(f),d?r?p.value()[0]:p.value():p)})})),cn(["pop","push","shift","sort","splice","unshift"],(function(t){var n=_t[t],e=/^(?:push|sort|unshift)$/.test(t)?"tap":"thru",r=/^(?:pop|shift)$/.test(t);Ae.prototype[t]=function(){var t=arguments;if(r&&!this.__chain__){var i=this.value();return n.apply(Eu(i)?i:[],t)}return this[e]((function(e){return n.apply(Eu(e)?e:[],t)}))}})),sr(Pe.prototype,(function(t,n){var e=Ae[n];if(e){var r=e.name+"";kt.call(_e,r)||(_e[r]=[]),_e[r].push({name:n,func:e})}})),_e[Ai(void 0,2).name]=[{name:"wrapper",func:void 0}],Pe.prototype.clone=function(){var t=new Pe(this.__wrapped__);return t.__actions__=bi(this.__actions__),t.__dir__=this.__dir__,t.__filtered__=this.__filtered__,t.__iteratees__=bi(this.__iteratees__),t.__takeCount__=this.__takeCount__,t.__views__=bi(this.__views__),t},Pe.prototype.reverse=function(){if(this.__filtered__){var t=new Pe(this);t.__dir__=-1,t.__filtered__=!0}else(t=this.clone()).__dir__*=-1;return t},Pe.prototype.value=function(){var t=this.__wrapped__.value(),n=this.__dir__,e=Eu(t),r=n<0,i=e?t.length:0,o=function(t,n,e){var r=-1,i=e.length;for(;++r<i;){var o=e[r],u=o.size;switch(o.type){case"drop":t+=u;break;case"dropRight":n-=u;break;case"take":n=ce(n,t+u);break;case"takeRight":t=ae(t,n-u)}}return{start:t,end:n}}(0,i,this.__views__),u=o.start,a=o.end,c=a-u,s=r?a:u-1,f=this.__iteratees__,l=f.length,h=0,d=ce(c,this.__takeCount__);if(!e||!r&&i==c&&d==c)return ri(t,this.__actions__);var v=[];t:for(;c--&&h<d;){for(var p=-1,g=t[s+=n];++p<l;){var y=f[p],b=y.iteratee,m=y.type,_=b(g);if(2==m)g=_;else if(!_){if(1==m)continue t;break t}}v[h++]=g}return v},Ae.prototype.at=iu,Ae.prototype.chain=function(){return eu(this)},Ae.prototype.commit=function(){return new Ne(this.value(),this.__chain__)},Ae.prototype.next=function(){void 0===this.__values__&&(this.__values__=ea(this.value()));var t=this.__index__>=this.__values__.length;return{done:t,value:t?void 0:this.__values__[this.__index__++]}},Ae.prototype.plant=function(t){for(var n,e=this;e instanceof Ie;){var r=Ao(e);r.__index__=0,r.__values__=void 0,n?i.__wrapped__=r:n=r;var i=r;e=e.__wrapped__}return i.__wrapped__=t,n},Ae.prototype.reverse=function(){var t=this.__wrapped__;if(t instanceof Pe){var n=t;return this.__actions__.length&&(n=new Pe(this)),(n=n.reverse()).__actions__.push({func:ru,args:[$o],thisArg:void 0}),new Ne(n,this.__chain__)}return this.thru($o)},Ae.prototype.toJSON=Ae.prototype.valueOf=Ae.prototype.value=function(){return ri(this.__wrapped__,this.__actions__)},Ae.prototype.first=Ae.prototype.head,mn&&(Ae.prototype[mn]=function(){return this}),Ae}();"function"==typeof r&&"object"==i(r.amd)&&r.amd?(Zt._=Xn,r((function(){return Xn}))):Xt?((Xt.exports=Xn)._=Xn,Yt._=Xn):Zt._=Xn}).call(this)}).call(this,e(325),e(326)(t),e(327))},function(t,n,e){"use strict";e.d(n,"a",(function(){return j})),e.d(n,"b",(function(){return k}));var r=e(7),i=e(215),o=e(217),u=e(218),a=e(219),c=e(220),s=e(221),f=e(222),l=e(223),h=e(224),d=e(225),v=e(226),p=e(227),g=e(257),y=e(258),b=e(259),m=e(260),_=e(261),w=e(45),x=e(262),M=0;function j(t,n,e,r){this._groups=t,this._parents=n,this._name=e,this._id=r}function k(){return++M}var O=r.b.prototype;j.prototype=function(t){return Object(r.b)().transition(t)}.prototype={constructor:j,select:d.a,selectAll:v.a,filter:s.a,merge:f.a,selection:p.a,transition:_.a,call:O.call,nodes:O.nodes,node:O.node,size:O.size,empty:O.empty,each:O.each,on:l.a,attr:i.a,attrTween:o.a,style:g.a,styleTween:y.a,text:b.a,textTween:m.a,remove:h.a,tween:w.a,delay:u.a,duration:a.a,ease:c.a,end:x.a}},function(t,n,e){"use strict";e.d(n,"a",(function(){return i})),e.d(n,"b",(function(){return o}));var r=Array.prototype,i=r.map,o=r.slice},function(t,n,e){"use strict";n.a=function(t,n,e,r,i){this.node=t,this.x0=n,this.y0=e,this.x1=r,this.y1=i}},function(t,n,e){"use strict";e.d(n,"c",(function(){return i})),e.d(n,"b",(function(){return o})),e.d(n,"d",(function(){return u})),e.d(n,"a",(function(){return s}));var r=e(1);function i(t,n,e,i){var o=[null,null],a=r.e.push(o)-1;return o.left=t,o.right=n,e&&u(o,t,n,e),i&&u(o,n,t,i),r.b[t.index].halfedges.push(a),r.b[n.index].halfedges.push(a),o}function o(t,n,e){var r=[n,e];return r.left=t,r}function u(t,n,e,r){t[0]||t[1]?t.left===e?t[1]=r:t[0]=r:(t[0]=r,t.left=n,t.right=e)}function a(t,n,e,r,i){var o,u=t[0],a=t[1],c=u[0],s=u[1],f=0,l=1,h=a[0]-c,d=a[1]-s;if(o=n-c,h||!(o>0)){if(o/=h,h<0){if(o<f)return;o<l&&(l=o)}else if(h>0){if(o>l)return;o>f&&(f=o)}if(o=r-c,h||!(o<0)){if(o/=h,h<0){if(o>l)return;o>f&&(f=o)}else if(h>0){if(o<f)return;o<l&&(l=o)}if(o=e-s,d||!(o>0)){if(o/=d,d<0){if(o<f)return;o<l&&(l=o)}else if(d>0){if(o>l)return;o>f&&(f=o)}if(o=i-s,d||!(o<0)){if(o/=d,d<0){if(o>l)return;o>f&&(f=o)}else if(d>0){if(o<f)return;o<l&&(l=o)}return!(f>0||l<1)||(f>0&&(t[0]=[c+f*h,s+f*d]),l<1&&(t[1]=[c+l*h,s+l*d]),!0)}}}}}function c(t,n,e,r,i){var o=t[1];if(o)return!0;var u,a,c=t[0],s=t.left,f=t.right,l=s[0],h=s[1],d=f[0],v=f[1],p=(l+d)/2,g=(h+v)/2;if(v===h){if(p<n||p>=r)return;if(l>d){if(c){if(c[1]>=i)return}else c=[p,e];o=[p,i]}else{if(c){if(c[1]<e)return}else c=[p,i];o=[p,e]}}else if(a=g-(u=(l-d)/(v-h))*p,u<-1||u>1)if(l>d){if(c){if(c[1]>=i)return}else c=[(e-a)/u,e];o=[(i-a)/u,i]}else{if(c){if(c[1]<e)return}else c=[(i-a)/u,i];o=[(e-a)/u,e]}else if(h<v){if(c){if(c[0]>=r)return}else c=[n,u*n+a];o=[r,u*r+a]}else{if(c){if(c[0]<n)return}else c=[r,u*r+a];o=[n,u*n+a]}return t[0]=c,t[1]=o,!0}function s(t,n,e,i){for(var o,u=r.e.length;u--;)c(o=r.e[u],t,n,e,i)&&a(o,t,n,e,i)&&(Math.abs(o[0][0]-o[1][0])>r.f||Math.abs(o[0][1]-o[1][1])>r.f)||delete r.e[u]}},function(t,n,e){"use strict";e.d(n,"c",(function(){return r})),e.d(n,"a",(function(){return c})),e.d(n,"b",(function(){return s}));var r,i=e(40),o=e(1),u=[];function a(){Object(i.a)(this),this.x=this.y=this.arc=this.site=this.cy=null}function c(t){var n=t.P,e=t.N;if(n&&e){var i=n.site,c=t.site,s=e.site;if(i!==s){var f=c[0],l=c[1],h=i[0]-f,d=i[1]-l,v=s[0]-f,p=s[1]-l,g=2*(h*p-d*v);if(!(g>=-o.g)){var y=h*h+d*d,b=v*v+p*p,m=(p*y-d*b)/g,_=(h*b-v*y)/g,w=u.pop()||new a;w.arc=t,w.site=c,w.x=m+f,w.y=(w.cy=_+l)+Math.sqrt(m*m+_*_),t.circle=w;for(var x=null,M=o.c._;M;)if(w.y<M.y||w.y===M.y&&w.x<=M.x){if(!M.L){x=M.P;break}M=M.L}else{if(!M.R){x=M;break}M=M.R}o.c.insert(x,w),x||(r=w)}}}}function s(t){var n=t.circle;n&&(n.P||(r=n.N),o.c.remove(n),u.push(n),Object(i.a)(n),t.circle=null)}},function(t,n,e){"use strict";e.d(n,"a",(function(){return s})),e.d(n,"b",(function(){return f}));var r=e(13),i=(e(210),e(289)),o=e(89),u=e(290),a={},c={},s={};function f(t,n){var e=t.dataViews,f={dataPoints:[],settings:{},legendColors:[],taskIcons:[],status:[],taskIconDisplayName:"",hasTaskNumber:!1};if(!(e&&e[0]&&e[0].categorical&&e[0].categorical.categories&&e[0].categorical.categories[0].source))return f;var l,h,d,v,p,g,y,b,m=e[0].categorical,_=[];if(m.categories.forEach((function(t){t.source.roles.taskNumber&&(l=t),t.source.roles.task&&(h=t),t.source.roles.assignTo&&(d=t),t.source.roles.discription&&(g=t),t.source.roles.status&&(y=t),t.source.roles.priority&&(v=t),t.source.roles.taskIcon&&(p=t),t.source.roles.sortBy&&(b=t),t.source.roles.tooltip&&_.push(t)})),_=Object(r.uniqBy)(_,(function(t){return t.source.displayName})),!l)return f;var w=[],x=e[0].metadata.objects,M=Object(o.a)(x),j=e[0];Object(r.isObject)(j.metadata.objects)&&Object(r.isObject)(j.metadata.objects.legend)&&Object(r.isString)(j.metadata.objects.legend.storeValues)&&(a=JSON.parse("".concat(j.metadata.objects.legend.storeValues)));var k=function(t,n){var e=Object(r.uniq)(n.values),i=[],u=t.colorPalette;return e.forEach((function(e,r){var c=u.getColor("".concat(e)).value;a[e]&&(c=a[e]);var s={solid:{color:c}},f=Object(o.b)(n,r,"colorSelector","fill",s).solid.color,l=t.createSelectionIdBuilder().withCategory(n,r).createSelectionId();a[e]=f,i.push({value:e,color:f,selectionId:l})})),i}(n,v);!function(t,n){if(!Object(r.isObject)(t.metadata.objects)||!Object(r.isObject)(t.metadata.objects.legend)||!Object(r.isString)(t.metadata.objects.legend.storeValues)){var e={objectName:"legend",selector:void 0,properties:{storeValues:JSON.stringify(a)}};return void n.persistProperties({merge:[e]})}if(JSON.stringify(a)!==t.metadata.objects.legend.storeValues){var i={objectName:"legend",selector:void 0,properties:{storeValues:JSON.stringify(a)}};n.persistProperties({merge:[i]})}}(j,n),Object(r.isObject)(j.metadata.objects)&&Object(r.isObject)(j.metadata.objects.taskIcons)&&Object(r.isString)(j.metadata.objects.taskIcons.storeValues)&&(c=JSON.parse("".concat(j.metadata.objects.taskIcons.storeValues)));var O=void 0!==p?function(t,n){var e=Object(r.uniq)(n.values),u=[],a=t.colorPalette;return e.forEach((function(e,r){var s=a.getColor("".concat(e)).value,f=i.a.Diamond;c[e]&&(s=c[e][1],f=c[e][0]);var l={solid:{color:s}},h=Object(o.b)(n,r,"taskIcons","fill",l).solid.color,d=Object(o.b)(n,r,"taskIcons","shape",f),v=t.createSelectionIdBuilder().withCategory(n,r).createSelectionId();c[e]=[d,h],u.push({value:e,color:h,shape:d,selectionId:v})})),u}(n,p):[];!function(t,n){if(!Object(r.isObject)(t.metadata.objects)||!Object(r.isObject)(t.metadata.objects.taskIcons)||!Object(r.isString)(t.metadata.objects.taskIcons.storeValues)){var e={objectName:"taskIcons",selector:void 0,properties:{storeValues:JSON.stringify(c)}};return void n.persistProperties({merge:[e]})}if(JSON.stringify(c)!==t.metadata.objects.taskIcons.storeValues){var i={objectName:"taskIcons",selector:void 0,properties:{storeValues:JSON.stringify(c)}};n.persistProperties({merge:[i]})}}(j,n);for(var S=10*M.taskIcons.size,C=function(t,e){var r=[],i=k.find((function(n){return v.values[t]===n.value})).color,o=O.length>0?O.find((function(n){if(null!==n)return p.values[t]===n.value})).color:"",a="",c="";if(O.length>0){var s=O.find((function(n){return p.values[t]===n.value}));c=s.value?s.shape.toString().toLowerCase():"",a=Object(u.a)(S,c)}_.forEach((function(n){r.push({displayName:n.source.displayName,value:"".concat(n.source.type.dateTime?new Date("".concat(n.values[t])).toDateString():n.values[t])})})),w.push({category:l.values[t]+"",status:y&&y.values[t]?y.values[t]+"":"",taskNumber:l?l.values[t]+"":"",task:h?h.values[t]+"":"",taskSort:0,taskDescription:g?g.values[t]+"":"",assignTo:d?d.values[t]+"":"",Priority:v?v.values[t]+"":"",color:i,selectionId:n.createSelectionIdBuilder().withCategory(l,t).createSelectionId(),taskIconValue:p?p.values[t]+"":"",taskIconPath:a,taskIconColor:o,taskIconShape:c,sortBy:b?b.values[t]+"":"",tooltips:r})},A=0,T=l.values.length;A<T;A++)C(A);var I=[];w.forEach((function(t,n){-1===I.indexOf(t.status)&&I.push(t.status)})),Object(r.isObject)(j.metadata.objects)&&Object(r.isObject)(j.metadata.objects.sortBy)&&Object(r.isString)(j.metadata.objects.sortBy.storeValues)&&(s=JSON.parse("".concat(j.metadata.objects.sortBy.storeValues))),I.forEach((function(t,n){t in s||(s[t]=Object.keys(s).length)}));var N=[];Object.keys(s).forEach((function(t){N.push([t,s[t]])})),N.sort((function(t,n){return t[1]-n[1]}));var P=[];N.forEach((function(t){-1!==I.indexOf(t[0])&&P.push(t[0])})),M.bucketSetting.customSort||(P=I),void 0!==b&&(M.card.ascending?w.sort((function(t,n){return t.sortBy>n.sortBy?1:t.sortBy<n.sortBy?-1:0})):w.sort((function(t,n){return t.sortBy<n.sortBy?1:t.sortBy>n.sortBy?-1:0})));var E=-1!==w.findIndex((function(t){return t.taskNumber.split(".").length>2}));return M.card.taskNumberSorting&&function(t){var n=0;t.forEach((function(t){var e=t.taskNumber.split(".").length;e>n&&(n=e)})),t.forEach((function(t,e){var r=t.taskNumber,i=0,o=n-1;r.split(".").forEach((function(t,n){var e=Math.pow(10,o--),r=parseInt(t);i+=r*e})),t.taskSort=i})),t.sort((function(t,n){return t.taskSort>n.taskSort?1:t.taskSort<n.taskSort?-1:0}))}(w),{dataPoints:w,settings:M,legendColors:k,taskIconDisplayName:p?p.source.displayName+"":"",taskIcons:O,status:P,hasTaskNumber:E}}},function(t,n,e){"use strict";e.d(n,"a",(function(){return o}));var r=e(2),i=(e(8),e(4),e(108));function o(t){var n=t.domain;return t.ticks=function(t){var e=n();return Object(r.k)(e[0],e[e.length-1],null==t?10:t)},t.tickFormat=function(t,e){var r=n();return Object(i.a)(r[0],r[r.length-1],null==t?10:t,e)},t.nice=function(e){null==e&&(e=10);var i,o=n(),u=0,a=o.length-1,c=o[u],s=o[a];return s<c&&(i=c,c=s,s=i,i=u,u=a,a=i),(i=Object(r.i)(c,s,e))>0?(c=Math.floor(c/i)*i,s=Math.ceil(s/i)*i,i=Object(r.i)(c,s,e)):i<0&&(c=Math.ceil(c*i)/i,s=Math.floor(s*i)/i,i=Object(r.i)(c,s,e)),i>0?(o[u]=Math.floor(c/i)*i,o[a]=Math.ceil(s/i)*i,n(o)):i<0&&(o[u]=Math.ceil(c*i)/i,o[a]=Math.floor(s*i)/i,n(o)),t},t}},function(t,n,e){"use strict";n.a=function(t,n){return t=+t,n=+n,function(e){return t*(1-e)+n*e}}},function(t,n,e){"use strict";e.d(n,"a",(function(){return r})),e.d(n,"d",(function(){return i})),e.d(n,"b",(function(){return u})),e.d(n,"e",(function(){return a})),e.d(n,"c",(function(){return c}));var r=Math.cos,i=Math.sin,o=Math.PI,u=o/2,a=2*o,c=Math.max},function(t,n,e){"use strict";e.d(n,"g",(function(){return i})),e.d(n,"l",(function(){return o})),e.d(n,"h",(function(){return u})),e.d(n,"i",(function(){return a})),e.d(n,"d",(function(){return f})),e.d(n,"k",(function(){return l})),e.d(n,"f",(function(){return h})),e.d(n,"e",(function(){return d})),e.d(n,"j",(function(){return v})),e.d(n,"b",(function(){return p})),e.d(n,"a",(function(){return g})),e.d(n,"c",(function(){return b})),e.d(n,"m",(function(){return m}));var r=e(50);function i(t,n){t=t.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,(function(t,n,e,r){return n+n+e+e+r+r}));var e=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t),r=e?{r:parseInt(e[1],16),g:parseInt(e[2],16),b:parseInt(e[3],16)}:null;return null===r?"":n||0===n?"rgba("+r.r+","+r.g+","+r.b+","+n+")":"rgb("+r.r+","+r.g+","+r.b+")"}function o(t,n){return 0===n?t:h(s(function(t,n){var e=t.H+n;return{H:e>1?e-1:e,S:t.S,V:t.V}}(c(a(t)),n)))}function u(t){return h(a(t))}function a(t){if(t.indexOf("#")>=0){if(7===t.length){var n=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);if(null==n||n.length<4)return;return{R:parseInt(n[1],16),G:parseInt(n[2],16),B:parseInt(n[3],16)}}if(4===t.length){var e=/^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(t);if(null==e||e.length<4)return;return{R:parseInt(e[1]+e[1],16),G:parseInt(e[2]+e[2],16),B:parseInt(e[3]+e[3],16)}}}else{if(t.indexOf("rgb(")>=0){var r=/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(t);if(null==r||r.length<4)return;return{R:parseInt(r[1],10),G:parseInt(r[2],10),B:parseInt(r[3],10)}}if(t.indexOf("rgba(")>=0){var i=/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d*(?:\.\d+)?)\)$/.exec(t);if(null==i||i.length<5)return;return{R:parseInt(i[1],10),G:parseInt(i[2],10),B:parseInt(i[3],10),A:parseFloat(i[4])}}}}function c(t){var n,e,r=t.R/255,i=t.G/255,o=t.B/255,u=Math.min(r,Math.min(i,o)),a=Math.max(r,Math.max(i,o)),c=a-u;return 0===a||0===c?(n=0,e=0):(n=c/a,e=r===a?(i-o)/c:i===a?2+(o-r)/c:4+(r-i)/c),(e/=6)<0&&(e+=1),{H:e,S:n,V:a}}function s(t){var n,e,r,i,o,u,a,c,s,f=t.H,l=t.S,h=t.V;if(0===l)n=h,e=h,r=h;else switch(i=h*(1-l),o=h*(1-l*(a=(s=6*f)-(c=Math.floor(s)))),u=h*(1-l*(1-a)),c){case 0:n=h,e=u,r=i;break;case 1:n=o,e=h,r=i;break;case 2:n=i,e=h,r=u;break;case 3:n=i,e=o,r=h;break;case 4:n=u,e=i,r=h;break;case 5:n=h,e=i,r=o}return{R:Math.floor(255*n),G:Math.floor(255*e),B:Math.floor(255*r)}}function f(t,n){var e=Math.floor(n);return{R:Math.max(0,t.R-e),G:Math.max(0,t.G-e),B:Math.max(0,t.B-e)}}function l(t){return null==t.A?"rgb("+t.R+","+t.G+","+t.B+")":"rgba("+t.R+","+t.G+","+t.B+","+t.A+")"}function h(t){return"#"+y(t.R)+y(t.G)+y(t.B)}function d(t,n,e){return h(v(a(t),n,a(e)))}function v(t,n,e){return n=r.b.ensureInRange(n,0,1),{R:p(t.R,n,e.R),G:p(t.G,n,e.G),B:p(t.B,n,e.B)}}function p(t,n,e){return n=r.b.ensureInRange(n,0,1),t=r.b.ensureInRange(t,0,255),e=r.b.ensureInRange(e,0,255),Math.round(n*t+(1-n)*e)}function g(t,n,e){var r=c(t);return(n+e>1||n<=0||e<=0)&&(n=.8,e=.2),r.V<n?r.V=r.V+e:r.V=r.V-e,h(s(r))}function y(t){var n=r.b.ensureInRange(t,0,255).toString(16).toUpperCase();return 1===n.length?"0"+n:n}function b(t,n,e){var r=n.map((function(t){return a(t)}));return function(i){if(null==i&&(i=0),!isNaN(i)){if(e){if(i>=t[t.length-1])return n[n.length-1];if(i<=t[0])return n[0]}for(var o,u,a,c,s=1,f=t.length;s<f;s++){if(o=t[s-1],(u=t[s])===i)return n[s];if(i>=o&&i<=u){a=r[s-1],c=r[s];break}}return h({R:Math.round((i-o)*(c.R-a.R)/(u-o)+a.R),G:Math.round((i-o)*(c.G-a.G)/(u-o)+a.G),B:Math.round((i-o)*(c.B-a.B)/(u-o)+a.B)})}}}function m(t,n){var e=parseInt(t.slice(1),16),r=n<0?0:255,i=n<0?-1*n:n,o=e>>16,u=e>>8&255,a=255&e;return"#"+(16777216+65536*(Math.round((r-o)*i)+o)+256*(Math.round((r-u)*i)+u)+(Math.round((r-a)*i)+a)).toString(16).slice(1)}},function(t,n,e){"use strict";n.a=function(t){return null===t?NaN:+t}},function(t,n,e){"use strict";n.a=function(t,n){return t<n?-1:t>n?1:t>=n?0:NaN}},function(t,n,e){"use strict";n.a=function(){return Math.random()}},function(t,n,e){"use strict";e.d(n,"a",(function(){return r}));e(8),e(4),e(20),e(62),e(63),e(52);function r(t,n){return n.domain(t.domain()).interpolator(t.interpolator()).clamp(t.clamp()).unknown(t.unknown())}},function(t,n,e){"use strict";n.a=function(){return 1e-6*(Math.random()-.5)}},function(t,n,e){"use strict";e.d(n,"b",(function(){return i}));var r=e(0);function i(){r.c.stopImmediatePropagation()}n.a=function(){r.c.preventDefault(),r.c.stopImmediatePropagation()}},function(t,n,e){"use strict";e.d(n,"b",(function(){return o}));var r=e(12),i=e(29);function o(t,n){var e=t.document.documentElement,o=Object(r.a)(t).on("dragstart.drag",null);n&&(o.on("click.drag",i.a,!0),setTimeout((function(){o.on("click.drag",null)}),0)),"onselectstart"in e?o.on("selectstart.drag",null):(e.style.MozUserSelect=e.__noselect,delete e.__noselect)}n.a=function(t){var n=t.document.documentElement,e=Object(r.a)(t).on("dragstart.drag",i.a,!0);"onselectstart"in n?e.on("selectstart.drag",i.a,!0):(n.__noselect=n.style.MozUserSelect,n.style.MozUserSelect="none")}},function(t,n,e){"use strict";var r=e(37);n.a=function(t){return(t=Object(r.b)(Math.abs(t)))?t[1]:NaN}},function(t,n,e){"use strict";n.a=function(t){return function(){return t}}},function(t,n,e){"use strict";e.d(n,"b",(function(){return u})),e.d(n,"a",(function(){return a})),e.d(n,"c",(function(){return f}));var r=e(6),i=e(9);function o(t){return Object(r.a)((function(n){n.setDate(n.getDate()-(n.getDay()+7-t)%7),n.setHours(0,0,0,0)}),(function(t,n){t.setDate(t.getDate()+7*n)}),(function(t,n){return(n-t-(n.getTimezoneOffset()-t.getTimezoneOffset())*i.c)/i.e}))}var u=o(0),a=o(1),c=o(2),s=o(3),f=o(4),l=o(5),h=o(6);u.range,a.range,c.range,s.range,f.range,l.range,h.range},function(t,n,e){"use strict";e.d(n,"b",(function(){return u})),e.d(n,"a",(function(){return a})),e.d(n,"c",(function(){return f}));var r=e(6),i=e(9);function o(t){return Object(r.a)((function(n){n.setUTCDate(n.getUTCDate()-(n.getUTCDay()+7-t)%7),n.setUTCHours(0,0,0,0)}),(function(t,n){t.setUTCDate(t.getUTCDate()+7*n)}),(function(t,n){return(n-t)/i.e}))}var u=o(0),a=o(1),c=o(2),s=o(3),f=o(4),l=o(5),h=o(6);u.range,a.range,c.range,s.range,f.range,l.range,h.range},function(t,n,e){"use strict";e(171),e(172);var r=e(48);e.d(n,"a",(function(){return r.a}));e(173),e(174),e(175)},function(t,n,e){"use strict";e(324),e(14),e(167);var r=e(104);e.d(n,"a",(function(){return r.a}))},function(t,n,e){"use strict";function r(t,n){if((e=(t=n?t.toExponential(n-1):t.toExponential()).indexOf("e"))<0)return null;var e,r=t.slice(0,e);return[r.length>1?r[0]+r.slice(2):r,+t.slice(e+1)]}e.d(n,"b",(function(){return r})),n.a=function(t){return Math.abs(t=Math.round(t))>=1e21?t.toLocaleString("en").replace(/,/g,""):t.toString(10)}},function(t,n,e){"use strict";function r(t,n,e){this.k=t,this.x=n,this.y=e}e.d(n,"a",(function(){return r})),e.d(n,"b",(function(){return i})),r.prototype={constructor:r,scale:function(t){return 1===t?this:new r(this.k*t,this.x,this.y)},translate:function(t,n){return 0===t&0===n?this:new r(this.k,this.x+this.k*t,this.y+this.k*n)},apply:function(t){return[t[0]*this.k+this.x,t[1]*this.k+this.y]},applyX:function(t){return t*this.k+this.x},applyY:function(t){return t*this.k+this.y},invert:function(t){return[(t[0]-this.x)/this.k,(t[1]-this.y)/this.k]},invertX:function(t){return(t-this.x)/this.k},invertY:function(t){return(t-this.y)/this.k},rescaleX:function(t){return t.copy().domain(t.range().map(this.invertX,this).map(t.invert,t))},rescaleY:function(t){return t.copy().domain(t.range().map(this.invertY,this).map(t.invert,t))},toString:function(){return"translate("+this.x+","+this.y+") scale("+this.k+")"}};var i=new r(1,0,0);r.prototype},function(t,n,e){"use strict";e.d(n,"b",(function(){return a}));var r=e(61);function i(t){return function(){this.style.removeProperty(t)}}function o(t,n,e){return function(){this.style.setProperty(t,n,e)}}function u(t,n,e){return function(){var r=n.apply(this,arguments);null==r?this.style.removeProperty(t):this.style.setProperty(t,r,e)}}function a(t,n){return t.style.getPropertyValue(n)||Object(r.a)(t).getComputedStyle(t,null).getPropertyValue(n)}n.a=function(t,n,e){return arguments.length>1?this.each((null==n?i:"function"==typeof n?u:o)(t,n,null==e?"":e)):a(this.node(),t)}},function(t,n,e){"use strict";function r(){this._=null}function i(t){t.U=t.C=t.L=t.R=t.P=t.N=null}function o(t,n){var e=n,r=n.R,i=e.U;i?i.L===e?i.L=r:i.R=r:t._=r,r.U=i,e.U=r,e.R=r.L,e.R&&(e.R.U=e),r.L=e}function u(t,n){var e=n,r=n.L,i=e.U;i?i.L===e?i.L=r:i.R=r:t._=r,r.U=i,e.U=r,e.L=r.R,e.L&&(e.L.U=e),r.R=e}function a(t){for(;t.L;)t=t.L;return t}e.d(n,"a",(function(){return i})),r.prototype={constructor:r,insert:function(t,n){var e,r,i;if(t){if(n.P=t,n.N=t.N,t.N&&(t.N.P=n),t.N=n,t.R){for(t=t.R;t.L;)t=t.L;t.L=n}else t.R=n;e=t}else this._?(t=a(this._),n.P=null,n.N=t,t.P=t.L=n,e=t):(n.P=n.N=null,this._=n,e=null);for(n.L=n.R=null,n.U=e,n.C=!0,t=n;e&&e.C;)e===(r=e.U).L?(i=r.R)&&i.C?(e.C=i.C=!1,r.C=!0,t=r):(t===e.R&&(o(this,e),e=(t=e).U),e.C=!1,r.C=!0,u(this,r)):(i=r.L)&&i.C?(e.C=i.C=!1,r.C=!0,t=r):(t===e.L&&(u(this,e),e=(t=e).U),e.C=!1,r.C=!0,o(this,r)),e=t.U;this._.C=!1},remove:function(t){t.N&&(t.N.P=t.P),t.P&&(t.P.N=t.N),t.N=t.P=null;var n,e,r,i=t.U,c=t.L,s=t.R;if(e=c?s?a(s):c:s,i?i.L===t?i.L=e:i.R=e:this._=e,c&&s?(r=e.C,e.C=t.C,e.L=c,c.U=e,e!==s?(i=e.U,e.U=t.U,t=e.R,i.L=t,e.R=s,s.U=e):(e.U=i,i=e,t=e.R)):(r=t.C,t=e),t&&(t.U=i),!r)if(t&&t.C)t.C=!1;else{do{if(t===this._)break;if(t===i.L){if((n=i.R).C&&(n.C=!1,i.C=!0,o(this,i),n=i.R),n.L&&n.L.C||n.R&&n.R.C){n.R&&n.R.C||(n.L.C=!1,n.C=!0,u(this,n),n=i.R),n.C=i.C,i.C=n.R.C=!1,o(this,i),t=this._;break}}else if((n=i.L).C&&(n.C=!1,i.C=!0,u(this,i),n=i.L),n.L&&n.L.C||n.R&&n.R.C){n.L&&n.L.C||(n.R.C=!1,n.C=!0,o(this,n),n=i.L),n.C=i.C,i.C=n.L.C=!1,u(this,i),t=this._;break}n.C=!0,t=i,i=i.U}while(!t.C);t&&(t.C=!1)}}},n.b=r},function(t,n,e){"use strict";e.d(n,"b",(function(){return i}));var r=e(0);function i(){r.c.stopImmediatePropagation()}n.a=function(){r.c.preventDefault(),r.c.stopImmediatePropagation()}},function(t,n,e){"use strict";var r=e(46),i=e(47);function o(t){return function(){var n=this.ownerDocument,e=this.namespaceURI;return e===i.b&&n.documentElement.namespaceURI===i.b?n.createElement(t):n.createElementNS(e,t)}}function u(t){return function(){return this.ownerDocument.createElementNS(t.space,t.local)}}n.a=function(t){var n=Object(r.a)(t);return(n.local?u:o)(n)}},function(t,n,e){"use strict";n.a=function(t,n){var e=t.ownerSVGElement||t;if(e.createSVGPoint){var r=e.createSVGPoint();return r.x=n.clientX,r.y=n.clientY,[(r=r.matrixTransform(t.getScreenCTM().inverse())).x,r.y]}var i=t.getBoundingClientRect();return[n.clientX-i.left-t.clientLeft,n.clientY-i.top-t.clientTop]}},function(t,n,e){"use strict";(function(t){function r(){var n="touchstart";return t.PointerEvent&&(n="pointerdown"),n}function i(){var n="touchend";return t.PointerEvent&&(n="pointerup"),n}function o(){var t=r();return"pointerdown"===t||"MSPointerDown"===t}e.d(n,"b",(function(){return r})),e.d(n,"a",(function(){return i})),e.d(n,"c",(function(){return o}))}).call(this,e(76))},function(t,n,e){"use strict";e.d(n,"b",(function(){return u}));var r=e(3);function i(t,n){var e,i;return function(){var o=Object(r.h)(this,t),u=o.tween;if(u!==e)for(var a=0,c=(i=e=u).length;a<c;++a)if(i[a].name===n){(i=i.slice()).splice(a,1);break}o.tween=i}}function o(t,n,e){var i,o;if("function"!=typeof e)throw new Error;return function(){var u=Object(r.h)(this,t),a=u.tween;if(a!==i){o=(i=a).slice();for(var c={name:n,value:e},s=0,f=o.length;s<f;++s)if(o[s].name===n){o[s]=c;break}s===f&&o.push(c)}u.tween=o}}function u(t,n,e){var i=t._id;return t.each((function(){var t=Object(r.h)(this,i);(t.value||(t.value={}))[n]=e.apply(this,arguments)})),function(t){return Object(r.f)(t,i).value[n]}}n.a=function(t,n){var e=this._id;if(t+="",arguments.length<2){for(var u,a=Object(r.f)(this.node(),e).tween,c=0,s=a.length;c<s;++c)if((u=a[c]).name===t)return u.value;return null}return this.each((null==n?i:o)(e,t,n))}},function(t,n,e){"use strict";var r=e(47);n.a=function(t){var n=t+="",e=n.indexOf(":");return e>=0&&"xmlns"!==(n=t.slice(0,e))&&(t=t.slice(e+1)),r.a.hasOwnProperty(n)?{space:r.a[n],local:t}:t}},function(t,n,e){"use strict";e.d(n,"b",(function(){return r}));var r="http://www.w3.org/1999/xhtml";n.a={svg:"http://www.w3.org/2000/svg",xhtml:r,xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"}},function(t,n,e){"use strict";e.d(n,"b",(function(){return r}));var r="$";function i(){}function o(t,n){var e=new i;if(t instanceof i)t.each((function(t,n){e.set(n,t)}));else if(Array.isArray(t)){var r,o=-1,u=t.length;if(null==n)for(;++o<u;)e.set(o,t[o]);else for(;++o<u;)e.set(n(r=t[o],o,t),r)}else if(t)for(var a in t)e.set(a,t[a]);return e}i.prototype=o.prototype={constructor:i,has:function(t){return r+t in this},get:function(t){return this[r+t]},set:function(t,n){return this[r+t]=n,this},remove:function(t){var n=r+t;return n in this&&delete this[n]},clear:function(){for(var t in this)t[0]===r&&delete this[t]},keys:function(){var t=[];for(var n in this)n[0]===r&&t.push(n.slice(1));return t},values:function(){var t=[];for(var n in this)n[0]===r&&t.push(this[n]);return t},entries:function(){var t=[];for(var n in this)n[0]===r&&t.push({key:n.slice(1),value:this[n]});return t},size:function(){var t=0;for(var n in this)n[0]===r&&++t;return t},empty:function(){for(var t in this)if(t[0]===r)return!1;return!0},each:function(t){for(var n in this)n[0]===r&&t(this[n],n.slice(1),this)}},n.a=o},function(t,n,e){"use strict";var r=e(64),i=e(43);n.a=function(t){var n=Object(r.a)();return n.changedTouches&&(n=n.changedTouches[0]),Object(i.a)(t,n)}},function(t,n,e){"use strict";var r=e(208);e.d(n,"a",(function(){return r}));var i=e(209);e.d(n,"b",(function(){return i}))},,function(t,n,e){"use strict";e.d(n,"a",(function(){return c}));var r=e(20),i=e(8);e(4);function o(t){return function(n){return n<0?-Math.pow(-n,t):Math.pow(n,t)}}function u(t){return t<0?-Math.sqrt(-t):Math.sqrt(t)}function a(t){return t<0?-t*t:t*t}function c(t){var n=t(i.c,i.c),e=1;function c(){return 1===e?t(i.c,i.c):.5===e?t(u,a):t(o(e),o(1/e))}return n.exponent=function(t){return arguments.length?(e=+t,c()):e},Object(r.a)(n)}},function(t,n,e){"use strict";var r=e(24);n.a=function(t,n,e){if(null==e&&(e=r.a),i=t.length){if((n=+n)<=0||i<2)return+e(t[0],0,t);if(n>=1)return+e(t[i-1],i-1,t);var i,o=(i-1)*n,u=Math.floor(o),a=+e(t[u],u,t);return a+(+e(t[u+1],u+1,t)-a)*(o-u)}}},function(t,n,e){"use strict";function r(){}n.a=function(t){return null==t?r:function(){return this.querySelector(t)}}},function(t,n,e){"use strict";function r(t,n,e){for(var r=t.width,i=t.height,o=1+(e<<1),u=0;u<i;++u)for(var a=0,c=0;a<r+e;++a)a<r&&(c+=t.data[a+u*r]),a>=e&&(a>=o&&(c-=t.data[a-o+u*r]),n.data[a-e+u*r]=c/Math.min(a+1,r-1+o-a,o))}function i(t,n,e){for(var r=t.width,i=t.height,o=1+(e<<1),u=0;u<r;++u)for(var a=0,c=0;a<i+e;++a)a<i&&(c+=t.data[u+a*r]),a>=e&&(a>=o&&(c-=t.data[u+(a-o)*r]),n.data[u+(a-e)*r]=c/Math.min(a+1,i-1+o-a,o))}e.d(n,"a",(function(){return r})),e.d(n,"b",(function(){return i}))},function(t,n,e){"use strict";e.d(n,"a",(function(){return b})),e.d(n,"b",(function(){return x}));var r=e(71);function i(){}var o="\\s*([+-]?\\d+)\\s*",u="\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",a="\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",c=/^#([0-9a-f]{3,8})$/,s=new RegExp("^rgb\\("+[o,o,o]+"\\)$"),f=new RegExp("^rgb\\("+[a,a,a]+"\\)$"),l=new RegExp("^rgba\\("+[o,o,o,u]+"\\)$"),h=new RegExp("^rgba\\("+[a,a,a,u]+"\\)$"),d=new RegExp("^hsl\\("+[u,a,a]+"\\)$"),v=new RegExp("^hsla\\("+[u,a,a,u]+"\\)$"),p={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074};function g(){return this.rgb().formatHex()}function y(){return this.rgb().formatRgb()}function b(t){var n,e;return t=(t+"").trim().toLowerCase(),(n=c.exec(t))?(e=n[1].length,n=parseInt(n[1],16),6===e?m(n):3===e?new M(n>>8&15|n>>4&240,n>>4&15|240&n,(15&n)<<4|15&n,1):8===e?_(n>>24&255,n>>16&255,n>>8&255,(255&n)/255):4===e?_(n>>12&15|n>>8&240,n>>8&15|n>>4&240,n>>4&15|240&n,((15&n)<<4|15&n)/255):null):(n=s.exec(t))?new M(n[1],n[2],n[3],1):(n=f.exec(t))?new M(255*n[1]/100,255*n[2]/100,255*n[3]/100,1):(n=l.exec(t))?_(n[1],n[2],n[3],n[4]):(n=h.exec(t))?_(255*n[1]/100,255*n[2]/100,255*n[3]/100,n[4]):(n=d.exec(t))?S(n[1],n[2]/100,n[3]/100,1):(n=v.exec(t))?S(n[1],n[2]/100,n[3]/100,n[4]):p.hasOwnProperty(t)?m(p[t]):"transparent"===t?new M(NaN,NaN,NaN,0):null}function m(t){return new M(t>>16&255,t>>8&255,255&t,1)}function _(t,n,e,r){return r<=0&&(t=n=e=NaN),new M(t,n,e,r)}function w(t){return t instanceof i||(t=b(t)),t?new M((t=t.rgb()).r,t.g,t.b,t.opacity):new M}function x(t,n,e,r){return 1===arguments.length?w(t):new M(t,n,e,null==r?1:r)}function M(t,n,e,r){this.r=+t,this.g=+n,this.b=+e,this.opacity=+r}function j(){return"#"+O(this.r)+O(this.g)+O(this.b)}function k(){var t=this.opacity;return(1===(t=isNaN(t)?1:Math.max(0,Math.min(1,t)))?"rgb(":"rgba(")+Math.max(0,Math.min(255,Math.round(this.r)||0))+", "+Math.max(0,Math.min(255,Math.round(this.g)||0))+", "+Math.max(0,Math.min(255,Math.round(this.b)||0))+(1===t?")":", "+t+")")}function O(t){return((t=Math.max(0,Math.min(255,Math.round(t)||0)))<16?"0":"")+t.toString(16)}function S(t,n,e,r){return r<=0?t=n=e=NaN:e<=0||e>=1?t=n=NaN:n<=0&&(t=NaN),new A(t,n,e,r)}function C(t){if(t instanceof A)return new A(t.h,t.s,t.l,t.opacity);if(t instanceof i||(t=b(t)),!t)return new A;if(t instanceof A)return t;var n=(t=t.rgb()).r/255,e=t.g/255,r=t.b/255,o=Math.min(n,e,r),u=Math.max(n,e,r),a=NaN,c=u-o,s=(u+o)/2;return c?(a=n===u?(e-r)/c+6*(e<r):e===u?(r-n)/c+2:(n-e)/c+4,c/=s<.5?u+o:2-u-o,a*=60):c=s>0&&s<1?0:a,new A(a,c,s,t.opacity)}function A(t,n,e,r){this.h=+t,this.s=+n,this.l=+e,this.opacity=+r}function T(t,n,e){return 255*(t<60?n+(e-n)*t/60:t<180?e:t<240?n+(e-n)*(240-t)/60:n)}Object(r.a)(i,b,{copy:function(t){return Object.assign(new this.constructor,this,t)},displayable:function(){return this.rgb().displayable()},hex:g,formatHex:g,formatHsl:function(){return C(this).formatHsl()},formatRgb:y,toString:y}),Object(r.a)(M,x,Object(r.b)(i,{brighter:function(t){return t=null==t?1/.7:Math.pow(1/.7,t),new M(this.r*t,this.g*t,this.b*t,this.opacity)},darker:function(t){return t=null==t?.7:Math.pow(.7,t),new M(this.r*t,this.g*t,this.b*t,this.opacity)},rgb:function(){return this},displayable:function(){return-.5<=this.r&&this.r<255.5&&-.5<=this.g&&this.g<255.5&&-.5<=this.b&&this.b<255.5&&0<=this.opacity&&this.opacity<=1},hex:j,formatHex:j,formatRgb:k,toString:k})),Object(r.a)(A,(function(t,n,e,r){return 1===arguments.length?C(t):new A(t,n,e,null==r?1:r)}),Object(r.b)(i,{brighter:function(t){return t=null==t?1/.7:Math.pow(1/.7,t),new A(this.h,this.s,this.l*t,this.opacity)},darker:function(t){return t=null==t?.7:Math.pow(.7,t),new A(this.h,this.s,this.l*t,this.opacity)},rgb:function(){var t=this.h%360+360*(this.h<0),n=isNaN(t)||isNaN(this.s)?0:this.s,e=this.l,r=e+(e<.5?e:1-e)*n,i=2*e-r;return new M(T(t>=240?t-240:t+120,i,r),T(t,i,r),T(t<120?t+240:t-120,i,r),this.opacity)},displayable:function(){return(0<=this.s&&this.s<=1||isNaN(this.s))&&0<=this.l&&this.l<=1&&0<=this.opacity&&this.opacity<=1},formatHsl:function(){var t=this.opacity;return(1===(t=isNaN(t)?1:Math.max(0,Math.min(1,t)))?"hsl(":"hsla(")+(this.h||0)+", "+100*(this.s||0)+"%, "+100*(this.l||0)+"%"+(1===t?")":", "+t+")")}}))},,function(t,n,e){"use strict";e(8),e(4),e(20),e(62),e(27),e(63),e(52)},function(t,n,e){"use strict";var r=e(25),i=e(95),o=Object(i.a)(r.a),u=o.right;o.left;n.a=u},function(t,n,e){"use strict";e.d(n,"b",(function(){return u})),e.d(n,"c",(function(){return a}));var r=Math.sqrt(50),i=Math.sqrt(10),o=Math.sqrt(2);function u(t,n,e){var u=(n-t)/Math.max(0,e),a=Math.floor(Math.log(u)/Math.LN10),c=u/Math.pow(10,a);return a>=0?(c>=r?10:c>=i?5:c>=o?2:1)*Math.pow(10,a):-Math.pow(10,-a)/(c>=r?10:c>=i?5:c>=o?2:1)}function a(t,n,e){var u=Math.abs(n-t)/Math.max(0,e),a=Math.pow(10,Math.floor(Math.log(u)/Math.LN10)),c=u/a;return c>=r?a*=10:c>=i?a*=5:c>=o&&(a*=2),n<t?-a:a}n.a=function(t,n,e){var r,i,o,a,c=-1;if(e=+e,(t=+t)===(n=+n)&&e>0)return[t];if((r=n<t)&&(i=t,t=n,n=i),0===(a=u(t,n,e))||!isFinite(a))return[];if(a>0)for(t=Math.ceil(t/a),n=Math.floor(n/a),o=new Array(i=Math.ceil(n-t+1));++c<i;)o[c]=(t+c)*a;else for(t=Math.floor(t*a),n=Math.ceil(n*a),o=new Array(i=Math.ceil(t-n+1));++c<i;)o[c]=(t-c)/a;return r&&o.reverse(),o}},function(t,n,e){"use strict";n.a=function(t){return t.ownerDocument&&t.ownerDocument.defaultView||t.document&&t||t.defaultView}},function(t,n,e){"use strict";e.d(n,"a",(function(){return h}));var r=e(2),i=e(145),o=e(117);e(8),e(4);function u(t){return Math.log(t)}function a(t){return Math.exp(t)}function c(t){return-Math.log(-t)}function s(t){return-Math.exp(-t)}function f(t){return isFinite(t)?+("1e"+t):t<0?0:t}function l(t){return function(n){return-t(-n)}}function h(t){var n,e,h=t(u,a),d=h.domain,v=10;function p(){return n=function(t){return t===Math.E?Math.log:10===t&&Math.log10||2===t&&Math.log2||(t=Math.log(t),function(n){return Math.log(n)/t})}(v),e=function(t){return 10===t?f:t===Math.E?Math.exp:function(n){return Math.pow(t,n)}}(v),d()[0]<0?(n=l(n),e=l(e),t(c,s)):t(u,a),h}return h.base=function(t){return arguments.length?(v=+t,p()):v},h.domain=function(t){return arguments.length?(d(t),p()):d()},h.ticks=function(t){var i,o=d(),u=o[0],a=o[o.length-1];(i=a<u)&&(l=u,u=a,a=l);var c,s,f,l=n(u),h=n(a),p=null==t?10:+t,g=[];if(!(v%1)&&h-l<p){if(l=Math.round(l)-1,h=Math.round(h)+1,u>0){for(;l<h;++l)for(s=1,c=e(l);s<v;++s)if(!((f=c*s)<u)){if(f>a)break;g.push(f)}}else for(;l<h;++l)for(s=v-1,c=e(l);s>=1;--s)if(!((f=c*s)<u)){if(f>a)break;g.push(f)}}else g=Object(r.k)(l,h,Math.min(h-l,p)).map(e);return i?g.reverse():g},h.tickFormat=function(t,r){if(null==r&&(r=10===v?".0e":","),"function"!=typeof r&&(r=Object(i.a)(r)),t===1/0)return r;null==t&&(t=10);var o=Math.max(1,v*t/h.ticks().length);return function(t){var i=t/e(Math.round(n(t)));return i*v<v-.5&&(i*=v),i<=o?r(t):""}},h.nice=function(){return d(Object(o.a)(d(),{floor:function(t){return e(Math.floor(n(t)))},ceil:function(t){return e(Math.ceil(n(t)))}}))},h}},function(t,n,e){"use strict";e.d(n,"a",(function(){return u}));var r=e(20);e(8),e(4);function i(t){return function(n){return Math.sign(n)*Math.log1p(Math.abs(n/t))}}function o(t){return function(n){return Math.sign(n)*Math.expm1(Math.abs(n))*t}}function u(t){var n=1,e=t(i(n),o(n));return e.constant=function(e){return arguments.length?t(i(n=+e),o(n)):n},Object(r.a)(e)}},function(t,n,e){"use strict";var r=e(0);n.a=function(){for(var t,n=r.c;t=n.sourceEvent;)n=t;return n}},function(t,n,e){"use strict";n.a=function(t){return function(){return t}}},function(t,n,e){"use strict";var r=e(64),i=e(43);n.a=function(t,n,e){arguments.length<3&&(e=n,n=Object(r.a)().changedTouches);for(var o,u=0,a=n?n.length:0;u<a;++u)if((o=n[u]).identifier===e)return Object(i.a)(t,o);return null}},function(t,n,e){"use strict";var r=e(56),i=e(86),o=e(265),u=e(264),a=e(21),c=e(266),s=e(130),f=e(65),l=e(68);function h(t){return(h="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}n.a=function(t,n){var e,d=h(n);return null==n||"boolean"===d?Object(f.a)(n):("number"===d?a.a:"string"===d?(e=Object(r.a)(n))?(n=e,i.a):s.a:n instanceof r.a?i.a:n instanceof Date?u.a:Object(l.b)(n)?l.a:Array.isArray(n)?o.a:"function"!=typeof n.valueOf&&"function"!=typeof n.toString||isNaN(n)?c.a:a.a)(t,n)}},function(t,n,e){"use strict";function r(t){return ArrayBuffer.isView(t)&&!(t instanceof DataView)}e.d(n,"b",(function(){return r})),n.a=function(t,n){n||(n=[]);var e,r=t?Math.min(n.length,t.length):0,i=n.slice();return function(o){for(e=0;e<r;++e)i[e]=t[e]*(1-o)+n[e]*o;return i}}},function(t,n,e){"use strict";e.d(n,"c",(function(){return o})),e.d(n,"a",(function(){return a})),e.d(n,"d",(function(){return s})),e.d(n,"b",(function(){return f}));var r=e(17),i=e(1);function o(t){return i.b[t.index]={site:t,halfedges:[]}}function u(t,n){var e=t.site,r=n.left,i=n.right;return e===i&&(i=r,r=e),i?Math.atan2(i[1]-r[1],i[0]-r[0]):(e===r?(r=n[1],i=n[0]):(r=n[0],i=n[1]),Math.atan2(r[0]-i[0],i[1]-r[1]))}function a(t,n){return n[+(n.left!==t.site)]}function c(t,n){return n[+(n.left===t.site)]}function s(){for(var t,n,e,r,o=0,a=i.b.length;o<a;++o)if((t=i.b[o])&&(r=(n=t.halfedges).length)){var c=new Array(r),s=new Array(r);for(e=0;e<r;++e)c[e]=e,s[e]=u(t,i.e[n[e]]);for(c.sort((function(t,n){return s[n]-s[t]})),e=0;e<r;++e)s[e]=n[c[e]];for(e=0;e<r;++e)n[e]=s[e]}}function f(t,n,e,o){var u,s,f,l,h,d,v,p,g,y,b,m,_=i.b.length,w=!0;for(u=0;u<_;++u)if(s=i.b[u]){for(f=s.site,l=(h=s.halfedges).length;l--;)i.e[h[l]]||h.splice(l,1);for(l=0,d=h.length;l<d;)b=(y=c(s,i.e[h[l]]))[0],m=y[1],p=(v=a(s,i.e[h[++l%d]]))[0],g=v[1],(Math.abs(b-p)>i.f||Math.abs(m-g)>i.f)&&(h.splice(l,0,i.e.push(Object(r.b)(f,y,Math.abs(b-t)<i.f&&o-m>i.f?[t,Math.abs(p-t)<i.f?g:o]:Math.abs(m-o)<i.f&&e-b>i.f?[Math.abs(g-o)<i.f?p:e,o]:Math.abs(b-e)<i.f&&m-n>i.f?[e,Math.abs(p-e)<i.f?g:n]:Math.abs(m-n)<i.f&&b-t>i.f?[Math.abs(g-n)<i.f?p:t,n]:null))-1),++d);d&&(w=!1)}if(w){var x,M,j,k=1/0;for(u=0,w=null;u<_;++u)(s=i.b[u])&&(j=(x=(f=s.site)[0]-t)*x+(M=f[1]-n)*M)<k&&(k=j,w=s);if(w){var O=[t,n],S=[t,o],C=[e,o],A=[e,n];w.halfedges.push(i.e.push(Object(r.b)(f=w.site,O,S))-1,i.e.push(Object(r.b)(f,S,C))-1,i.e.push(Object(r.b)(f,C,A))-1,i.e.push(Object(r.b)(f,A,O))-1)}}for(u=0;u<_;++u)(s=i.b[u])&&(s.halfedges.length||delete i.b[u])}},function(t,n,e){"use strict";(function(t){function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}e.d(n,"b",(function(){return v})),e.d(n,"a",(function(){return g})),e.d(n,"c",(function(){return y}));var i,o,u=0,a=0,c=0,s=0,f=0,l=0,h="object"===("undefined"==typeof performance?"undefined":r(performance))&&performance.now?performance:Date,d="object"===(void 0===t?"undefined":r(t))&&t.requestAnimationFrame?t.requestAnimationFrame.bind(t):function(t){setTimeout(t,17)};function v(){return f||(d(p),f=h.now()+l)}function p(){f=0}function g(){this._call=this._time=this._next=null}function y(t,n,e){var r=new g;return r.restart(t,n,e),r}function b(){f=(s=h.now())+l,u=a=0;try{!function(){v(),++u;for(var t,n=i;n;)(t=f-n._time)>=0&&n._call.call(null,t),n=n._next;--u}()}finally{u=0,function(){var t,n,e=i,r=1/0;for(;e;)e._call?(r>e._time&&(r=e._time),t=e,e=e._next):(n=e._next,e._next=null,e=t?t._next=n:i=n);o=t,_(r)}(),f=0}}function m(){var t=h.now(),n=t-s;n>1e3&&(l-=n,s=t)}function _(t){u||(a&&(a=clearTimeout(a)),t-f>24?(t<1/0&&(a=setTimeout(b,t-h.now()-l)),c&&(c=clearInterval(c))):(c||(s=h.now(),c=setInterval(m,1e3)),u=1,d(b)))}g.prototype=y.prototype={constructor:g,restart:function(t,n,e){if("function"!=typeof t)throw new TypeError("callback is not a function");e=(null==e?v():+e)+(null==n?0:+n),this._next||o===this||(o?o._next=this:i=this,o=this),this._call=t,this._time=e,_()},stop:function(){this._call&&(this._call=null,this._time=1/0,_())}}}).call(this,e(76))},function(t,n,e){"use strict";function r(t,n){var e=Object.create(t.prototype);for(var r in n)e[r]=n[r];return e}e.d(n,"b",(function(){return r})),n.a=function(t,n,e){t.prototype=n.prototype=e,e.constructor=t}},function(t,n,e){"use strict";e.d(n,"b",(function(){return i}));var r=180/Math.PI,i={translateX:0,translateY:0,rotate:0,skewX:0,scaleX:1,scaleY:1};n.a=function(t,n,e,i,o,u){var a,c,s;return(a=Math.sqrt(t*t+n*n))&&(t/=a,n/=a),(s=t*e+n*i)&&(e-=t*s,i-=n*s),(c=Math.sqrt(e*e+i*i))&&(e/=c,i/=c,s/=c),t*i<n*e&&(t=-t,n=-n,s=-s,a=-a),{translateX:o,translateY:u,rotate:Math.atan2(n,t)*r,skewX:Math.atan(s)*r,scaleX:a,scaleY:c}}},function(t,n,e){"use strict";e.d(n,"b",(function(){return i}));var r=e(0);function i(){r.c.stopImmediatePropagation()}n.a=function(){r.c.preventDefault(),r.c.stopImmediatePropagation()}},function(t,n,e){"use strict";var r=e(6),i=Object(r.a)((function(t){t.setMonth(0,1),t.setHours(0,0,0,0)}),(function(t,n){t.setFullYear(t.getFullYear()+n)}),(function(t,n){return n.getFullYear()-t.getFullYear()}),(function(t){return t.getFullYear()}));i.every=function(t){return isFinite(t=Math.floor(t))&&t>0?Object(r.a)((function(n){n.setFullYear(Math.floor(n.getFullYear()/t)*t),n.setMonth(0,1),n.setHours(0,0,0,0)}),(function(n,e){n.setFullYear(n.getFullYear()+e*t)})):null},n.a=i;i.range},function(t,n,e){"use strict";var r=e(6),i=Object(r.a)((function(t){t.setUTCMonth(0,1),t.setUTCHours(0,0,0,0)}),(function(t,n){t.setUTCFullYear(t.getUTCFullYear()+n)}),(function(t,n){return n.getUTCFullYear()-t.getUTCFullYear()}),(function(t){return t.getUTCFullYear()}));i.every=function(t){return isFinite(t=Math.floor(t))&&t>0?Object(r.a)((function(n){n.setUTCFullYear(Math.floor(n.getUTCFullYear()/t)*t),n.setUTCMonth(0,1),n.setUTCHours(0,0,0,0)}),(function(n,e){n.setUTCFullYear(n.getUTCFullYear()+e*t)})):null},n.a=i;i.range},function(t,n){t.exports=Function("return this")()},function(t,n,e){"use strict";e(118),e(212)},function(t,n,e){"use strict";e(90),e(30),e(67),e(66),e(0),e(12),e(49),e(36),e(119),e(263),e(73);function r(t){return[+t[0],+t[1]]}function i(t){return[r(t[0]),r(t[1])]}["w","e"].map(o),["n","s"].map(o),["n","w","e","s","nw","ne","sw","se"].map(o);function o(t){return{type:t}}},function(t,n,e){"use strict";e.d(n,"a",(function(){return a}));var r=e(35),i=e(15),o=e(4),u={name:"implicit"};function a(){var t=Object(r.a)(),n=[],e=[],c=u;function s(r){var i=r+"",o=t.get(i);if(!o){if(c!==u)return c;t.set(i,o=n.push(r))}return e[(o-1)%e.length]}return s.domain=function(e){if(!arguments.length)return n.slice();n=[],t=Object(r.a)();for(var i,o,u=-1,a=e.length;++u<a;)t.has(o=(i=e[u])+"")||t.set(o,n.push(i));return s},s.range=function(t){return arguments.length?(e=i.b.call(t),s):e.slice()},s.unknown=function(t){return arguments.length?(c=t,s):c},s.copy=function(){return a(n,e).unknown(c)},o.b.apply(s,arguments),s}},function(t,n,e){"use strict";n.a=function(t){return function(){return this.matches(t)}}},function(t,n,e){"use strict";function r(){return[]}n.a=function(t){return null==t?r:function(){return this.querySelectorAll(t)}}},function(t,n,e){"use strict";e.d(n,"a",(function(){return r})),e.d(n,"b",(function(){return i}));e(90),e(35),e(70);function r(t){return t.x}function i(t){return t.y}Math.PI,Math.sqrt(5)},function(t,n,e){"use strict";e.d(n,"a",(function(){return o}));var r=e(114),i=e(7);function o(t,n){this.ownerDocument=t.ownerDocument,this.namespaceURI=t.namespaceURI,this._next=null,this._parent=t,this.__data__=n}n.b=function(){return new i.a(this._enter||this._groups.map(r.a),this._parents)},o.prototype={constructor:o,appendChild:function(t){return this._parent.insertBefore(t,this._next)},insertBefore:function(t,n){return this._parent.insertBefore(t,n)},querySelector:function(t){return this._parent.querySelector(t)},querySelectorAll:function(t){return this._parent.querySelectorAll(t)}}},function(t,n,e){"use strict";n.a=function(t){return+t}},function(t,n,e){"use strict";n.a=function(t){return function(){return t}}},function(t,n,e){"use strict";var r=e(56),i=e(113),o=e(216),u=e(129);function a(t){return function(n){var e,i,o=n.length,u=new Array(o),a=new Array(o),c=new Array(o);for(e=0;e<o;++e)i=Object(r.b)(n[e]),u[e]=i.r||0,a[e]=i.g||0,c[e]=i.b||0;return u=t(u),a=t(a),c=t(c),i.opacity=1,function(t){return i.r=u(t),i.g=a(t),i.b=c(t),i+""}}}n.a=function t(n){var e=Object(u.b)(n);function i(t,n){var i=e((t=Object(r.b)(t)).r,(n=Object(r.b)(n)).r),o=e(t.g,n.g),a=e(t.b,n.b),c=Object(u.a)(t.opacity,n.opacity);return function(n){return t.r=i(n),t.g=o(n),t.b=a(n),t.opacity=c(n),t+""}}return i.gamma=t,i}(1);a(i.b),a(o.a)},function(t,n,e){"use strict";n.a=function(t){return function(){return t}}},function(t,n,e){"use strict";n.a=function(t){return function(){return t}}},function(t,n,e){"use strict";function r(t,n,e,r){if(t){var i=t[n];if(i){var o=i[e];if(void 0!==o)return o}}return r}function i(t,n,e,r,i){var o=t.objects;if(o){var u=o[n];if(u){var a=u[e];if(a){var c=a[r];if(void 0!==c)return c}}}return i}e.d(n,"b",(function(){return i})),e.d(n,"a",(function(){return f}));var o={show:!0,showTitle:!0,titleText:"",labelColor:"#000",fontSize:12},u={taskNumberSorting:!1,cardCol:2,height:25,headerHeight:20,cardColor:"#fff",ascending:!1},a={size:12},c={statusFontSize:15,statusFontColor:"#000",taskNumberFontSize:13,taskNumberFontColor:"#000",taskFontSize:13,taskFontColor:"#000",descriptionFontSize:13,descriptionFontColor:"#000",resourceFontSize:13,resourceFontColor:"#000"},s={showFixedWidth:!1,width:300,customSort:!1};function f(t){var n={solid:{color:"#000"}},e={solid:{color:u.cardColor}};return{card:{taskNumberSorting:r(t,"card","taskNumberSorting",u.taskNumberSorting),cardCol:r(t,"card","cardCol",u.cardCol),height:r(t,"card","height",u.height),headerHeight:r(t,"card","headerHeight",u.headerHeight),cardColor:r(t,"card","cardColor",e).solid.color,ascending:r(t,"card","ascending",u.ascending)},taskIcons:{size:r(t,"taskIcons","size",a.size)},font:{statusFontSize:r(t,"font","statusFontSize",c.statusFontSize),statusFontColor:r(t,"font","statusFontColor",n).solid.color,taskNumberFontSize:r(t,"font","taskNumberFontSize",c.taskNumberFontSize),taskNumberFontColor:r(t,"font","taskNumberFontColor",e).solid.color,taskFontSize:r(t,"font","taskFontSize",c.taskFontSize),taskFontColor:r(t,"font","taskFontColor",n).solid.color,descriptionFontSize:r(t,"font","descriptionFontSize",c.descriptionFontSize),descriptionFontColor:r(t,"font","descriptionFontColor",n).solid.color,resourceFontSize:r(t,"font","resourceFontSize",c.resourceFontSize),resourceFontColor:r(t,"font","resourceFontColor",n).solid.color},legend:{show:r(t,"legend","show",o.show),showTitle:r(t,"legend","showTitle",o.showTitle),titleText:r(t,"legend","titleText",o.titleText),labelColor:r(t,"legend","labelColor",n).solid.color,fontSize:r(t,"legend","fontSize",o.fontSize)},bucketSetting:{showFixedWidth:r(t,"bucketSetting","showFixedWidth",s.showFixedWidth),width:r(t,"bucketSetting","width",s.width),customSort:r(t,"bucketSetting","customSort",s.customSort)}}}},function(t,n,e){"use strict";var r={value:function(){}};function i(){for(var t,n=0,e=arguments.length,r={};n<e;++n){if(!(t=arguments[n]+"")||t in r||/[\s.]/.test(t))throw new Error("illegal type: "+t);r[t]=[]}return new o(r)}function o(t){this._=t}function u(t,n){return t.trim().split(/^|\s+/).map((function(t){var e="",r=t.indexOf(".");if(r>=0&&(e=t.slice(r+1),t=t.slice(0,r)),t&&!n.hasOwnProperty(t))throw new Error("unknown type: "+t);return{type:t,name:e}}))}function a(t,n){for(var e,r=0,i=t.length;r<i;++r)if((e=t[r]).name===n)return e.value}function c(t,n,e){for(var i=0,o=t.length;i<o;++i)if(t[i].name===n){t[i]=r,t=t.slice(0,i).concat(t.slice(i+1));break}return null!=e&&t.push({name:n,value:e}),t}o.prototype=i.prototype={constructor:o,on:function(t,n){var e,r=this._,i=u(t+"",r),o=-1,s=i.length;if(!(arguments.length<2)){if(null!=n&&"function"!=typeof n)throw new Error("invalid callback: "+n);for(;++o<s;)if(e=(t=i[o]).type)r[e]=c(r[e],t.name,n);else if(null==n)for(e in r)r[e]=c(r[e],t.name,null);return this}for(;++o<s;)if((e=(t=i[o]).type)&&(e=a(r[e],t.name)))return e},copy:function(){var t={},n=this._;for(var e in n)t[e]=n[e].slice();return new o(t)},call:function(t,n){if((e=arguments.length-2)>0)for(var e,r,i=new Array(e),o=0;o<e;++o)i[o]=arguments[o+2];if(!this._.hasOwnProperty(t))throw new Error("unknown type: "+t);for(o=0,e=(r=this._[t]).length;o<e;++o)r[o].value.apply(n,i)},apply:function(t,n,e){if(!this._.hasOwnProperty(t))throw new Error("unknown type: "+t);for(var r=this._[t],i=0,o=r.length;i<o;++i)r[i].value.apply(n,e)}},n.a=i},,,,function(t,n,e){"use strict";var r=e(178);e.d(n,"a",(function(){return r.a}))},function(t,n,e){"use strict";var r=e(25);n.a=function(t){var n;return 1===t.length&&(n=t,t=function(t,e){return Object(r.a)(n(t),e)}),{left:function(n,e,r,i){for(null==r&&(r=0),null==i&&(i=n.length);r<i;){var o=r+i>>>1;t(n[o],e)<0?r=o+1:i=o}return r},right:function(n,e,r,i){for(null==r&&(r=0),null==i&&(i=n.length);r<i;){var o=r+i>>>1;t(n[o],e)>0?i=o:r=o+1}return r}}}},function(t,n,e){"use strict";e.d(n,"a",(function(){return r}));function r(t,n){return[t,n]}},function(t,n,e){"use strict";var r=e(98);n.a=function(t,n){var e=Object(r.a)(t,n);return e?Math.sqrt(e):e}},function(t,n,e){"use strict";var r=e(24);n.a=function(t,n){var e,i,o=t.length,u=0,a=-1,c=0,s=0;if(null==n)for(;++a<o;)isNaN(e=Object(r.a)(t[a]))||(s+=(i=e-c)*(e-(c+=i/++u)));else for(;++a<o;)isNaN(e=Object(r.a)(n(t[a],a,t)))||(s+=(i=e-c)*(e-(c+=i/++u)));if(u>1)return s/(u-1)}},function(t,n,e){"use strict";n.a=function(t,n){var e,r,i,o=t.length,u=-1;if(null==n){for(;++u<o;)if(null!=(e=t[u])&&e>=e)for(r=i=e;++u<o;)null!=(e=t[u])&&(r>e&&(r=e),i<e&&(i=e))}else for(;++u<o;)if(null!=(e=n(t[u],u,t))&&e>=e)for(r=i=e;++u<o;)null!=(e=n(t[u],u,t))&&(r>e&&(r=e),i<e&&(i=e));return[r,i]}},function(t,n,e){"use strict";n.a=function(t,n,e){t=+t,n=+n,e=(i=arguments.length)<2?(n=t,t=0,1):i<3?1:+e;for(var r=-1,i=0|Math.max(0,Math.ceil((n-t)/e)),o=new Array(i);++r<i;)o[r]=t+r*e;return o}},function(t,n,e){"use strict";n.a=function(t){return Math.ceil(Math.log(t.length)/Math.LN2)+1}},function(t,n,e){"use strict";n.a=function(t,n){var e,r,i=t.length,o=-1;if(null==n){for(;++o<i;)if(null!=(e=t[o])&&e>=e)for(r=e;++o<i;)null!=(e=t[o])&&r>e&&(r=e)}else for(;++o<i;)if(null!=(e=n(t[o],o,t))&&e>=e)for(r=e;++o<i;)null!=(e=n(t[o],o,t))&&r>e&&(r=e);return r}},function(t,n,e){"use strict";var r=e(102);function i(t){return t.length}n.a=function(t){if(!(u=t.length))return[];for(var n=-1,e=Object(r.a)(t,i),o=new Array(e);++n<e;)for(var u,a=-1,c=o[n]=new Array(u);++a<u;)c[a]=t[a][n];return o}},function(t,n,e){"use strict";var r=e(3);n.a=function(t,n){var e,i,o,u=t.__transition,a=!0;if(u){for(o in n=null==n?null:n+"",u)(e=u[o]).name===n?(i=e.state>r.d&&e.state<r.b,e.state=r.a,e.timer.stop(),e.on.call(i?"interrupt":"cancel",t,t.__data__,e.index,e.group),delete u[o]):a=!1;a&&delete t.__transition}}},function(t,n,e){"use strict";var r=e(2),i=e(115),o=e(268),u=e(269),a=e(32),c=e(270),s=e(271),f=[[],[[[1,1.5],[.5,1]]],[[[1.5,1],[1,1.5]]],[[[1.5,1],[.5,1]]],[[[1,.5],[1.5,1]]],[[[1,1.5],[.5,1]],[[1,.5],[1.5,1]]],[[[1,.5],[1,1.5]]],[[[1,.5],[.5,1]]],[[[.5,1],[1,.5]]],[[[1,1.5],[1,.5]]],[[[.5,1],[1,.5]],[[1.5,1],[1,1.5]]],[[[1.5,1],[1,.5]]],[[[.5,1],[1.5,1]]],[[[1,1.5],[1.5,1]]],[[[.5,1],[1,1.5]]],[]];n.a=function(){var t=1,n=1,e=r.h,l=p;function h(t){var n=e(t);if(Array.isArray(n))n=n.slice().sort(o.a);else{var i=Object(r.d)(t),u=i[0],a=i[1];n=Object(r.j)(u,a,n),n=Object(r.g)(Math.floor(u/n)*n,Math.floor(a/n)*n,n)}return n.map((function(n){return d(t,n)}))}function d(e,r){var i=[],o=[];return function(e,r,i){var o,u,a,c,s,l,h=new Array,d=new Array;o=u=-1,c=e[0]>=r,f[c<<1].forEach(p);for(;++o<t-1;)a=c,c=e[o+1]>=r,f[a|c<<1].forEach(p);f[c<<0].forEach(p);for(;++u<n-1;){for(o=-1,c=e[u*t+t]>=r,s=e[u*t]>=r,f[c<<1|s<<2].forEach(p);++o<t-1;)a=c,c=e[u*t+t+o+1]>=r,l=s,s=e[u*t+o+1]>=r,f[a|c<<1|s<<2|l<<3].forEach(p);f[c|s<<3].forEach(p)}o=-1,s=e[u*t]>=r,f[s<<2].forEach(p);for(;++o<t-1;)l=s,s=e[u*t+o+1]>=r,f[s<<2|l<<3].forEach(p);function p(t){var n,e,r=[t[0][0]+o,t[0][1]+u],a=[t[1][0]+o,t[1][1]+u],c=v(r),s=v(a);(n=d[c])?(e=h[s])?(delete d[n.end],delete h[e.start],n===e?(n.ring.push(a),i(n.ring)):h[n.start]=d[e.end]={start:n.start,end:e.end,ring:n.ring.concat(e.ring)}):(delete d[n.end],n.ring.push(a),d[n.end=s]=n):(n=h[s])?(e=d[c])?(delete h[n.start],delete d[e.end],n===e?(n.ring.push(a),i(n.ring)):h[e.start]=d[n.end]={start:e.start,end:n.end,ring:e.ring.concat(n.ring)}):(delete h[n.start],n.ring.unshift(r),h[n.start=c]=n):h[c]=d[s]={start:c,end:s,ring:[r,a]}}f[s<<3].forEach(p)}(e,r,(function(t){l(t,e,r),Object(u.a)(t)>0?i.push([t]):o.push(t)})),o.forEach((function(t){for(var n,e=0,r=i.length;e<r;++e)if(-1!==Object(c.a)((n=i[e])[0],t))return void n.push(t)})),{type:"MultiPolygon",value:r,coordinates:i}}function v(n){return 2*n[0]+n[1]*(t+1)*4}function p(e,r,i){e.forEach((function(e){var o,u=e[0],a=e[1],c=0|u,s=0|a,f=r[s*t+c];u>0&&u<t&&c===u&&(o=r[s*t+c-1],e[0]=u+(i-o)/(f-o)-.5),a>0&&a<n&&s===a&&(o=r[(s-1)*t+c],e[1]=a+(i-o)/(f-o)-.5)}))}return h.contour=d,h.size=function(e){if(!arguments.length)return[t,n];var r=Math.ceil(e[0]),i=Math.ceil(e[1]);if(!(r>0&&i>0))throw new Error("invalid size");return t=r,n=i,h},h.thresholds=function(t){return arguments.length?(e="function"==typeof t?t:Array.isArray(t)?Object(a.a)(i.a.call(t)):Object(a.a)(t),h):e},h.smooth=function(t){return arguments.length?(l=t?p:s.a,h):l===p},h}},function(t,n,e){"use strict";var r=e(26);n.a=function t(n){function e(t,e){var r,i;return t=null==t?0:+t,e=null==e?1:+e,function(){var o;if(null!=r)o=r,r=null;else do{r=2*n()-1,o=2*n()-1,i=r*r+o*o}while(!i||i>1);return t+e*o*Math.sqrt(-2*Math.log(i)/i)}}return e.source=t,e}(r.a)},function(t,n,e){"use strict";var r=e(26);n.a=function t(n){function e(t){return function(){for(var e=0,r=0;r<t;++r)e+=n();return e}}return e.source=t,e}(r.a)},function(t,n,e){"use strict";var r=e(2),i=e(121),o=e(331),u=e(145),a=e(332),c=e(333);n.a=function(t,n,e,s){var f,l=Object(r.j)(t,n,e);switch((s=Object(i.a)(null==s?",f":s)).type){case"s":var h=Math.max(Math.abs(t),Math.abs(n));return null!=s.precision||isNaN(f=Object(o.a)(l,h))||(s.precision=f),Object(u.b)(s,h);case"":case"e":case"g":case"p":case"r":null!=s.precision||isNaN(f=Object(a.a)(l,Math.max(Math.abs(t),Math.abs(n))))||(s.precision=f-("e"===s.type));break;case"f":case"%":null!=s.precision||isNaN(f=Object(c.a)(l))||(s.precision=f-2*("%"===s.type))}return Object(u.a)(s)}},function(t,n,e){"use strict";e.d(n,"a",(function(){return s}));var r=e(2),i=(e(74),e(334),e(33),e(146),e(335),e(336),e(296),e(297),e(298),e(15)),o=e(8),u=(e(4),e(117));function a(t){return new Date(t)}function c(t){return t instanceof Date?+t:+new Date(+t)}function s(t,n,e,f,l,h,d,v,p){var g=Object(o.b)(o.c,o.c),y=g.invert,b=g.domain,m=p(".%L"),_=p(":%S"),w=p("%I:%M"),x=p("%I %p"),M=p("%a %d"),j=p("%b %d"),k=p("%B"),O=p("%Y"),S=[[d,1,1e3],[d,5,5e3],[d,15,15e3],[d,30,3e4],[h,1,6e4],[h,5,3e5],[h,15,9e5],[h,30,18e5],[l,1,36e5],[l,3,108e5],[l,6,216e5],[l,12,432e5],[f,1,864e5],[f,2,1728e5],[e,1,6048e5],[n,1,2592e6],[n,3,7776e6],[t,1,31536e6]];function C(r){return(d(r)<r?m:h(r)<r?_:l(r)<r?w:f(r)<r?x:n(r)<r?e(r)<r?M:j:t(r)<r?k:O)(r)}function A(n,e,i,o){if(null==n&&(n=10),"number"==typeof n){var u=Math.abs(i-e)/n,a=Object(r.c)((function(t){return t[2]})).right(S,u);a===S.length?(o=Object(r.j)(e/31536e6,i/31536e6,n),n=t):a?(o=(a=S[u/S[a-1][2]<S[a][2]/u?a-1:a])[1],n=a[0]):(o=Math.max(Object(r.j)(e,i,n),1),n=v)}return null==o?n:n.every(o)}return g.invert=function(t){return new Date(y(t))},g.domain=function(t){return arguments.length?b(i.a.call(t,c)):b().map(a)},g.ticks=function(t,n){var e,r=b(),i=r[0],o=r[r.length-1],u=o<i;return u&&(e=i,i=o,o=e),e=(e=A(t,i,o,n))?e.range(i,o+1):[],u?e.reverse():e},g.tickFormat=function(t,n){return null==n?C:p(n)},g.nice=function(t,n){var e=b();return(t=A(t,e[0],e[e.length-1],n))?b(Object(u.a)(e,t)):g},g.copy=function(){return Object(o.a)(g,s(t,n,e,f,l,h,d,v,p))},g}},function(t,n,e){"use strict";function r(t,n,e){if(!t)return e;var r=t[n];return void 0===r?e:r}e.d(n,"a",(function(){return r}))},function(t,n,e){"use strict";e.d(n,"b",(function(){return i})),e.d(n,"a",(function(){return o}));var r=Array.prototype,i=r.slice,o=r.map},function(t,n,e){"use strict";var r=e(56),i=e(21),o=e(86),u=e(130);n.a=function(t,n){var e;return("number"==typeof n?i.a:n instanceof r.a?o.a:(e=Object(r.a)(n))?(n=e,o.a):u.a)(t,n)}},function(t,n,e){"use strict";function r(t,n,e,r,i){var o=t*t,u=o*t;return((1-3*t+3*o-u)*n+(4-6*o+3*u)*e+(1+3*t+3*o-3*u)*r+u*i)/6}e.d(n,"a",(function(){return r})),n.b=function(t){var n=t.length-1;return function(e){var i=e<=0?e=0:e>=1?(e=1,n-1):Math.floor(e*n),o=t[i],u=t[i+1],a=i>0?t[i-1]:2*o-u,c=i<n-1?t[i+2]:2*u-o;return r((e-i/n)*n,a,o,u,c)}}},function(t,n,e){"use strict";n.a=function(t){return new Array(t.length)}},function(t,n,e){"use strict";e.d(n,"a",(function(){return r}));var r=Array.prototype.slice},function(t,n,e){"use strict";e.d(n,"b",(function(){return r}));var r,i=e(37);n.a=function(t,n){var e=Object(i.b)(t,n);if(!e)return t+"";var o=e[0],u=e[1],a=u-(r=3*Math.max(-8,Math.min(8,Math.floor(u/3))))+1,c=o.length;return a===c?o:a>c?o+new Array(a-c+1).join("0"):a>0?o.slice(0,a)+"."+o.slice(a):"0."+new Array(1-a).join("0")+Object(i.b)(t,Math.max(0,n+a-1))[0]}},function(t,n,e){"use strict";n.a=function(t,n){var e,r=0,i=(t=t.slice()).length-1,o=t[r],u=t[i];return u<o&&(e=r,r=i,i=e,e=o,o=u,u=e),t[r]=n.floor(o),t[i]=n.ceil(u),t}},function(t,n,e){"use strict";e.d(n,"a",(function(){return r}));var r=Array.prototype.slice},function(t,n,e){"use strict";n.a=function(t){return function(){return t}}},function(t,n,e){"use strict";n.a=function(t){return function(){return t}}},function(t,n,e){"use strict";e.d(n,"a",(function(){return i}));var r=/^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;function i(t){if(!(n=r.exec(t)))throw new Error("invalid format: "+t);var n;return new o({fill:n[1],align:n[2],sign:n[3],symbol:n[4],zero:n[5],width:n[6],comma:n[7],precision:n[8]&&n[8].slice(1),trim:n[9],type:n[10]})}function o(t){this.fill=void 0===t.fill?" ":t.fill+"",this.align=void 0===t.align?">":t.align+"",this.sign=void 0===t.sign?"-":t.sign+"",this.symbol=void 0===t.symbol?"":t.symbol+"",this.zero=!!t.zero,this.width=void 0===t.width?void 0:+t.width,this.comma=!!t.comma,this.precision=void 0===t.precision?void 0:+t.precision,this.trim=!!t.trim,this.type=void 0===t.type?"":t.type+""}i.prototype=o.prototype,o.prototype.toString=function(){return this.fill+this.align+this.sign+this.symbol+(this.zero?"0":"")+(void 0===this.width?"":Math.max(1,0|this.width))+(this.comma?",":"")+(void 0===this.precision?"":"."+Math.max(0,0|this.precision))+(this.trim?"~":"")+this.type}},,,,function(t,n,e){"use strict";e(2),e(4),e(79)},function(t,n,e){"use strict";(function(t){e.d(n,"a",(function(){return c}));var r=e(12),i=e(127),o=e(44);function u(t,n){for(var e=0;e<n.length;e++){var r=n[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var a=function(){return e(11).event};function c(t,n){var e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1e3,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:a;return new s({tooltipService:t,rootElement:n,handleTouchDelay:e,getEventMethod:r})}var s=function(){function n(t){!function(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}(this,n),this.visualHostTooltipService=t.tooltipService,this.rootElement=t.rootElement,this.handleTouchDelay=t.handleTouchDelay,this.getEvent=t.getEventMethod||a}var e,c,s;return e=n,(c=[{key:"addTooltip",value:function(n,e,r,i){var u=this;if(n&&this.visualHostTooltipService.enabled()){var a=this.rootElement;n.on("mouseover.tooltip",(function(){if(u.canDisplayTooltip()){var t=u.makeTooltipEventArgs(a,!0,!1);if(t){var n=e(t);if(null!=n){var i=u.getSelectionIds(t,r);u.visualHostTooltipService.show({coordinates:t.coordinates,isTouchEvent:!1,dataItems:n,identities:i})}}}})),n.on("mouseout.tooltip",(function(){u.visualHostTooltipService.hide({isTouchEvent:!1,immediately:!1})})),n.on("mousemove.tooltip",(function(){if(u.canDisplayTooltip()){var t,n=u.makeTooltipEventArgs(a,!0,!1);if(n&&(!i||null!=(t=e(n)))){var o=u.getSelectionIds(n,r);u.visualHostTooltipService.move({coordinates:n.coordinates,isTouchEvent:!1,dataItems:t,identities:o})}}}));var c=o.b(),s=o.a(),f=o.c();n.on(c+".tooltip",(function(){u.visualHostTooltipService.hide({isTouchEvent:!0,immediately:!0});var t=u.makeTooltipEventArgs(a,f,!0);if(t){var n=e(t),i=u.getSelectionIds(t,r);u.visualHostTooltipService.show({coordinates:t.coordinates,isTouchEvent:!0,dataItems:n,identities:i})}})),n.on(s+".tooltip",(function(){u.handleTouchTimeoutId&&clearTimeout(u.handleTouchTimeoutId),u.handleTouchTimeoutId=t.setTimeout((function(){u.handleTouchTimeoutId=void 0}),u.handleTouchDelay)}))}}},{key:"getSelectionIds",value:function(t,n){var e=n?n(t):null;return e?[e]:[]}},{key:"hide",value:function(){this.visualHostTooltipService.hide({immediately:!0,isTouchEvent:!1})}},{key:"makeTooltipEventArgs",value:function(t,n,e){var i=this.getEvent().target;return{data:Object(r.a)(i).datum(),coordinates:this.getCoordinates(t,n),elementCoordinates:this.getCoordinates(i,n),context:i,isTouchEvent:e}}},{key:"canDisplayTooltip",value:function(){var t=!0,n=this.getEvent();return void 0!==n.buttons&&(t=!(0!==n.buttons)),t=t&&null==this.handleTouchTimeoutId}},{key:"getCoordinates",value:function(t,n){var e;if(n){for(var r,o=event;r=o.sourceEvent;)o=r;var u=t.getBoundingClientRect();e=[o.clientX-u.left-t.clientLeft,o.clientY-u.top-t.clientTop]}else{var a=Object(i.a)(t);a&&a.length>0&&(e=a[0])}return e}}])&&u(e.prototype,c),s&&u(e,s),n}()}).call(this,e(76))},function(t,n,e){"use strict";var r=e(64),i=e(43);n.a=function(t,n){null==n&&(n=Object(r.a)().touches);for(var e=0,o=n?n.length:0,u=new Array(o);e<o;++e)u[e]=Object(i.a)(t,n[e]);return u}},function(t,n,e){"use strict";e.d(n,"a",(function(){return h}));var r=e(5),i=e(12),o=e(13),u=e(287),a=e(288),c=e(291),s=e(144),f=(e(210),e(19));function l(t,n){for(var e=0;e<n.length;e++){var r=n[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var h=function(){function t(n){!function(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}(this,t),this.iscompanylogo=!0,this.isPro=!0,this.target=n.element,this.host=n.host,Object(i.a)(n.element).classed("body",!0),this.selectionManager=n.host.createSelectionManager(),this.tooltipServiceWrapper=Object(u.a)(this.host.tooltipService,n.element),this.interactivityService=Object(c.a)(this.host),this.colors=n.host.colorPalette,this.colorHelper=new a.a(this.colors)}var n,e,h;return n=t,h=[{key:"isCorrectSettings",value:function(){var t=r.c(".stratada-logo").style("content").replace('url("',"").replace('")',"").split(","),n=t[0],e=t[1];function i(t){var n,e=0;if(0===t.length)return e;for(n=0;n<t.length;n++)e=(e<<5)-e+t.charCodeAt(n),e|=0;return e}function o(t){var n=r.c(t),e=n.style("opacity"),i=n.style("visibility"),o=n.style("opacity");return parseInt(e)>.7&&"hidden"!=i&&"collapse"!=i&&"none"!=o}return o(".stratada-logo-div")&&o("[title='Stratada']")&&o(".stratada-logo")&&-1810417147===i(n)&&-938241749===i(e)}}],(e=[{key:"update",value:function(n){var e=this,o=this.viewModel=Object(f.b)(n,this.host);this.settings=o.settings,this.dataPoints=o.dataPoints,this.legendColors=o.legendColors,this.options=n,this.taskIcons=o.taskIcons;var u=[],a=n.viewport.width,c=o.status,l=[];o.dataPoints.forEach((function(t){-1===l.indexOf(t.Priority)&&l.push(t.Priority)}));var h="";this.target.innerHTML="";var v=$("<div/>",{class:"main-container"}).appendTo(this.target);this.handleContextMenu(v,this.selectionManager);var p=1,g=this.settings.legend.show,y=$("<div/>",{width:"100%",style:"background : white;"+(g||this.iscompanylogo?"min-height:45px!important;":"height:5px!important;")}).appendTo(v);if($("<div/>",{class:"legend-div",width:"calc(100% - 80px)"}).appendTo(y),this.iscompanylogo){var b=$("<div/>",{class:"stratada-logo-div",width:40,height:40}).attr("title","Stratada").appendTo(y),m=this;$("<a/>",{class:"stratada-logo ui-widget-content",id:"draggable",click:function(){m.host.launchUrl("https://www.stratada.com/")}}).appendTo(b)}if(t.isCorrectSettings()){if(g){var _=[],w=[];this.dataPoints.forEach((function(t){0===_.filter((function(n){return n.Priority===t.Priority})).length&&(_.push(t),w.push(t))}));var x="Priority : ";this.settings.legend.showTitle&&""!==this.settings.legend.titleText&&(x="".concat(this.settings.legend.titleText,":")),this.settings.legend.showTitle&&r.c(".legend-div").append("text").attr("class","legend-title").attr("style","padding-right:2px").text(x).style("color",this.settings.legend.labelColor).style("font-size","".concat(this.settings.legend.fontSize,"px")).style("transform","translate(0px,-".concat(this.settings.legend.fontSize<15?0:this.settings.legend.fontSize/3,"px)"));var M=0,j=1;a>0&&(j=Math.floor(a/180)),0!==_.length&&(M=20*Math.ceil(_.length/j)),_.sort((function(t,n){return t.Priority>n.Priority?1:t.Priority<n.Priority?-1:0}));var k=0;p=0;var O=r.c(".legend-div").append("svg").attr("class","legend").attr("width","92%").attr("height",M).selectAll("g").data(_).enter().append("g").attr("class","legend-text").attr("transform",(function(t,n){return k===j&&(p+=25,k=0),"translate("+100*k+++","+p+")"}));O.append("rect").attr("width",18).attr("height",18).style("fill",(function(t,n){return t.color}));var S=0;O.append("text").attr("x",24).attr("y",9).attr("width",100).attr("dy",".35em").attr("title",(function(t,n){return t.Priority})).text((function(t){return t.Priority})).attr("font-size",this.settings.legend.fontSize).attr("fill",this.settings.legend.labelColor).each((function(t,n){Object(i.a)(Object(r.d)(".legend-text").nodes()[n]).attr("transform","translate(".concat(S,",0)")),S+=this.getComputedTextLength()+33})),O.on("click",(function(n){if(z){var e=n.Priority;U.select(n.selectionId).then((function(n){O.attr("fill-opacity",n.length>0?t.Config.transparentOpacity:t.Config.solidOpacity),$("div.task-body-container").each((function(){$(this).attr("data-Priority")!==e&&$(this).find("*").css({opacity:n.length>0?t.Config.transparentOpacity:t.Config.solidOpacity})}))})),r.b.stopPropagation()}}))}var C=$("<div/>",{class:"child-container"}).appendTo(v),A=2*this.settings.taskIcons.size,T=Math.sqrt(90*A/Math.PI),I=Math.sqrt(5*A/Math.sqrt(3))*Math.sqrt(3)/3*2,N=this.settings.taskIcons.size/2.5,P="".concat(100/c.length-.5,"%"),E=this.settings.bucketSetting.showFixedWidth?this.settings.bucketSetting.width:P,L=this.settings.bucketSetting.showFixedWidth?"width:".concat(P,"; flex: 0 0 ").concat(E,"px"):P;c.forEach((function(t,n){u=o.dataPoints.filter((function(n){return n.status===t}));var e=0,r=$("<div/>",{class:"laneExpanded-container status-panel",click:function(t){if(!$(t.target).hasClass("fa-minus")){var n=$(this);$(n).removeClass("laneCollapsed-container").addClass("laneExpanded-container"),$(n).find("div.laneCollapsed").addClass("hide"),$(n).find("div.lane-expanded").removeClass("hide"),$(n).find("div.lane-expanded").removeClass("hide"),$(n).css("flex","0 0 ".concat(E,"px")),$(n).css("width",P)}},style:"width:".concat(L)}).appendTo(C),i=$("<div/>",{class:"lane-expanded"}).appendTo(r),a=$("<div/>",{class:"laneHeader",style:"display:flex"}).appendTo(i);!function(t,n,e,r){var i=$("<div/>",{class:"laneCollapsed hide"}).appendTo(n),o=$("<div/>",{style:"height:100%"}).appendTo(i),u=$("<div/>").appendTo(o);$("<span/>",{class:"laneCollapsed-cardCount",style:"text-shadow: 0 0 black;width:20px",text:t.length}).appendTo(o),$("<span/>",{class:"rotate-90 collapsed-panel-body",text:e}).appendTo(o),$("<span/>",{class:"fa fa-plus icon-plus"}).appendTo(u),$("<span/>",{class:"fa fa-minus icon-minus",style:"vertical-align:middle",click:function(t){var n=$(this).parents("div.status-panel");$(n).addClass("laneCollapsed-container").removeClass("laneExpanded-container"),$(n).find("div.laneCollapsed").removeClass("hide"),$(n).find("div.lane-expanded").addClass("hide"),$(n).css("width","2%"),$(n).css("display","inline-block"),$(n).css("flex","")}}).appendTo(r)}(u,r,t,a),$("<div/>",{class:"status-header",style:"margin:4px;font-weight:bold;display:inline-block;width:90%;text-overflow:ellipsis;overflow:hidden;height:25px",text:t}).appendTo(a),h="",u.forEach((function(t){var r='<div class="task-body-container span-2 taskBodyContainer'.concat(n,'" data-Priority="')+t.Priority+'" style="background-color:light'+t.color+';">'+'<div class="task-header taskHeader'.concat(n,'" style="background-color:')+t.color+'">'+'<span class="task-header-font taskHeaderFont'.concat(n,'">#')+t.taskNumber+"</span>"+'<div style="width: '.concat(30,'px; float: right; margin-right:2px; margin-top:1px;">\n          <svg width="100%" height="100%">\n          <path class="task-icon taskIcon',n,'" d="').concat(t.taskIconPath," ").concat("push-pin"===t.taskIconShape?"M"+-T/40+","+T/20+" L 0,"+T/2+" "+T/40+","+T/20:"",'" fill="').concat(t.taskIconColor,'" stroke="').concat("star"===t.taskIconShape?"":"black",'"  style="transform: translate(').concat("heart"===t.taskIconShape?25:"crown"===t.taskIconShape?15:20,"px,",12,"px)  rotate(").concat("cross-x"===t.taskIconShape?45:"flag"===t.taskIconShape?-30:"push-pin"===t.taskIconShape?30:0,'deg);"/>\n          <circle stroke="black" fill="none" r="').concat(t.taskIconShape.includes("in-circle")?I:0,'" cx="20" cy="').concat(t.taskIconShape.includes("arrow")?12:14,'"></circle>\n          <circle stroke="black" fill="black" r="').concat(t.taskIconShape.includes("face")?N/10:0,'"\n           cx="').concat(20+3*Math.pow(-1,0)*N/8,'" cy="').concat(12-N/4,'"></circle>\n           <circle stroke="black" fill="black" r="').concat(t.taskIconShape.includes("face")?N/10:0,'"\n           cx="').concat(20+3*Math.pow(-1,1)*N/8,'" cy="').concat(12-N/4,'"></circle>\n          </svg>\n          </div>')+"</div>"+'<div class="task-panel-body taskPanelBody'.concat(n,'">')+'<h6 class="task-body-header taskBodyHeader'.concat(n,'">')+t.task+"</h6>"+'<span class="task-body-font taskBodyFont'.concat(n,'">')+t.taskDescription+"</span>"+'<span class="task-body-font-assign taskBodyFontAssign'.concat(n,'">')+t.assignTo+"</span></div></div>";h+=r,e=5===e?0:e})),$("<div/>",{class:"laneBody",html:h}).appendTo(i),d(u,".taskBodyContainer".concat(n)),d(u,".taskHeader".concat(n)),d(u,".taskHeaderFont".concat(n)),d(u,".taskPanelBody".concat(n)),d(u,".taskBodyHeader".concat(n)),d(u,".taskBodyFont".concat(n)),d(u,".taskBodyFontAssign".concat(n)),d(u,".taskIcon".concat(n))}));var F=(100-this.settings.card.cardCol)/this.settings.card.cardCol,D=c.length/this.settings.card.cardCol;r.d(".task-body-container").style("width","calc(".concat(F,"% - ").concat(D,"px)")),r.d(".task-body-container").style("height","".concat(this.settings.card.height,"%")),r.d(".task-body-container").style("background-color",this.settings.card.cardColor),r.d(".task-header").style("height","".concat(this.settings.card.headerHeight,"%")),r.d(".status-header").style("font-size","".concat(this.settings.font.statusFontSize,"px")),r.d(".task-header-font").style("font-size","".concat(this.settings.font.taskNumberFontSize,"px")),r.d(".task-body-header").style("font-size","".concat(this.settings.font.taskFontSize,"px")),r.d(".task-body-font").style("font-size","".concat(this.settings.font.descriptionFontSize,"px")),r.d(".task-body-font-assign").style("font-size","".concat(this.settings.font.resourceFontSize,"px")),r.d(".status-header").style("color",this.settings.font.statusFontColor),r.d(".task-header-font").style("color",this.settings.font.taskNumberFontColor),r.d(".task-body-header").style("color",this.settings.font.taskFontColor),r.d(".task-body-font").style("color",this.settings.font.descriptionFontColor),r.d(".task-body-font-assign").style("color",this.settings.font.resourceFontColor);var R=0;$("div.status-panel").each((function(){$(this).height()>R&&(R=$(this).height())})),$("div.status-panel").height(R+p+60),$(".child-container").scroll((function(){$(".child-container").offset.length>=R?$(".laneHeader").add("sticky"):$(".laneHeader").remove("sticky")}));var U=this.selectionManager,z=this.host.allowInteractions,q=0;this.settings.bucketSetting.customSort&&Object(r.d)(".status-header").call(Object(r.a)().on("start",(function(t,n){q=event.x})).on("drag",(function(t,n){var e=event.x;Object(i.a)(Object(r.d)(".lane-expanded").nodes()[n]).attr("style","transform: translate(".concat(e-q,"px,",0,"px)"))})).on("end",(function(t,n){var r=event.x,i=a/c.length,o=Math.floor(r/i);c.forEach((function(t,n){n<o&&f.a[t]}));var u=c[n],s=c[o],l=n<o;n===o&&e.update(e.options),function(t,n,e,r){var i=[],o=[];Object.keys(f.a).forEach((function(t){o.push([t,f.a[t]])})),o.sort((function(t,n){return t[1]-n[1]})),o.forEach((function(r,o){var u=r[0];e?f.a[u]<f.a[n]?u!==t&&i.push(u):f.a[u]===f.a[n]?(i.push(n),i.push(t)):i.push(u):f.a[u]<f.a[n]?i.push(u):f.a[u]===f.a[n]?(i.push(t),i.push(n)):u!==t&&i.push(u)})),i.forEach((function(t,n){f.a[t]=n}));var u={objectName:"sortBy",selector:void 0,properties:{storeValues:JSON.stringify(f.a)}};r.host.persistProperties({merge:[u]}),r.update(r.options)}(u,s,l,e)})));var B=!1;c.forEach((function(t){o.dataPoints.filter((function(n){return n.status===t})).length>10&&(B=!0)})),c.length>3?Object(s.a)(this,n,"The Stratada Task Board Visual Standard version does not support more than three Buckets. Use filters to reduce your buckets to three or less.","To display more buckets along with many additional features, get the Stratada Task Board Visual Professional version."):B?Object(s.a)(this,n,"The Stratada Task Board Visual Standard version does not support more than ten cards per bucket.  Use filters to reduce your cards to ten or less per bucket.","To display more tasks along with many additional features, get the Stratada Task Board Visual Professional version."):(this.renderTooltip(Object(r.d)(".task-panel-body"),2),this.renderTooltip(Object(r.d)(".task-icon"),1))}}},{key:"renderTooltip",value:function(t,n){var e=this,r=[];this.tooltipServiceWrapper.addTooltip(t,(function(t){if(r=[],1===n)return r.push({displayName:e.viewModel.taskIconDisplayName,value:t.data.taskIconValue}),r;if(2===n&&t.data){if(0===t.data.tooltips.length)return;return t.data.tooltips.forEach((function(t){r.push({displayName:t.displayName,value:t.value})})),r}}))}},{key:"handleContextMenu",value:function(t,n){t.on("contextmenu",(function(){var t=event,e=t.target,r=Object(i.a)(e).datum();n.showContextMenu(Object(o.isObject)(r)?r.selectionId:{},{x:t.clientX,y:t.clientY}),t.preventDefault()}))}},{key:"enumerateObjectInstances",value:function(t){var n=t.objectName,e=[];switch(n){case"card":this.viewModel.hasTaskNumber&&e.push({objectName:n,properties:{taskNumberSorting:this.settings.card.taskNumberSorting},selector:null}),e.push({objectName:n,properties:{cardCol:this.settings.card.cardCol,height:this.settings.card.height,headerHeight:this.settings.card.headerHeight,cardColor:this.settings.card.cardColor,ascending:this.settings.card.ascending},validValues:{cardCol:{numberRange:{min:1,max:5}},height:{numberRange:{min:0,max:500}},headerHeight:{numberRange:{min:0,max:100}}},selector:null});break;case"font":e.push(function(t,n){return{objectName:t,properties:{statusFontSize:n.font.statusFontSize,statusFontColor:n.font.statusFontColor,taskNumberFontSize:n.font.taskNumberFontSize,taskNumberFontColor:n.font.taskNumberFontColor,taskFontSize:n.font.taskFontSize,taskFontColor:n.font.taskFontColor,descriptionFontSize:n.font.descriptionFontSize,descriptionFontColor:n.font.descriptionFontColor,resourceFontSize:n.font.resourceFontSize,resourceFontColor:n.font.resourceFontColor},validValues:{statusFontSize:{numberRange:{min:0,max:100}},taskNumberFontSize:{numberRange:{min:0,max:100}},taskFontSize:{numberRange:{min:0,max:100}},descriptionFontSize:{numberRange:{min:0,max:100}},resourceFontSize:{numberRange:{min:0,max:100}}},selector:null}}(n,this.settings));break;case"colorSelector":this.legendColors.sort((function(t,n){return t.value>n.value?1:t.value<n.value?-1:0})),this.legendColors.forEach((function(t){e.push({objectName:n,displayName:t.value,properties:{fill:{solid:{color:t.color}}},selector:t.selectionId.getSelector()})}));break;case"legend":e.push({objectName:n,displayName:"Legend",properties:{show:this.settings.legend.show,showTitle:this.settings.legend.showTitle,titleText:this.settings.legend.titleText,labelColor:this.settings.legend.labelColor,fontSize:this.settings.legend.fontSize},validValues:{fontSize:{numberRange:{min:1,max:25}}},selector:null});break;case"taskIcons":e.push({objectName:n,properties:{size:this.settings.taskIcons.size},validValues:{size:{numberRange:{min:1,max:1e3}}},selector:null}),this.taskIcons.length>0&&(this.taskIcons.sort((function(t,n){return t.value>n.value?1:t.value<n.value?-1:0})),this.taskIcons.forEach((function(t){null!==t.value&&e.push({objectName:n,displayName:t.value,properties:{fill:{solid:{color:t.color}},shape:t.shape},selector:t.selectionId.getSelector()})})));break;case"bucketSetting":e.push({objectName:n,properties:{showFixedWidth:this.settings.bucketSetting.showFixedWidth},validValues:{width:{numberRange:{min:0,max:1e4}}},selector:null}),this.settings.bucketSetting.showFixedWidth&&e.push({objectName:n,properties:{width:this.settings.bucketSetting.width},validValues:{width:{numberRange:{min:0,max:1e4}}},selector:null})}return e}}])&&l(n.prototype,e),h&&l(n,h),t}();function d(t,n){r.d(n).nodes().forEach((function(n,e){t.forEach((function(i,o){if(e===o){var u=[];u.push(t[o]),r.c(n).data(u)}}))}))}h.Config={xScalePadding:.1,solidOpacity:1,transparentOpacity:.5,margins:{top:0,right:0,bottom:25,left:30},xAxisFontMultiplier:.04}},function(t,n,e){"use strict";e.d(n,"b",(function(){return o})),e.d(n,"a",(function(){return u}));var r=e(65);function i(t,n){return function(e){return t+e*n}}function o(t){return 1==(t=+t)?u:function(n,e){return e-n?function(t,n,e){return t=Math.pow(t,e),n=Math.pow(n,e)-t,e=1/e,function(r){return Math.pow(t+r*n,e)}}(n,e,t):Object(r.a)(isNaN(n)?e:n)}}function u(t,n){var e=n-t;return e?i(t,e):Object(r.a)(isNaN(t)?n:t)}},function(t,n,e){"use strict";var r=e(21),i=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,o=new RegExp(i.source,"g");n.a=function(t,n){var e,u,a,c=i.lastIndex=o.lastIndex=0,s=-1,f=[],l=[];for(t+="",n+="";(e=i.exec(t))&&(u=o.exec(n));)(a=u.index)>c&&(a=n.slice(c,a),f[s]?f[s]+=a:f[++s]=a),(e=e[0])===(u=u[0])?f[s]?f[s]+=u:f[++s]=u:(f[++s]=null,l.push({i:s,x:Object(r.a)(e,u)})),c=o.lastIndex;return c<n.length&&(a=n.slice(c),f[s]?f[s]+=a:f[++s]=a),f.length<2?l[0]?function(t){return function(n){return t(n)+""}}(l[0].x):function(t){return function(){return t}}(n):(n=l.length,function(t){for(var e,r=0;r<n;++r)f[(e=l[r]).i]=e.x(t);return f.join("")})}},function(t,n,e){"use strict";e.d(n,"a",(function(){return c})),e.d(n,"b",(function(){return s}));var r,i,o,u,a=e(72);function c(t){return"none"===t?a.b:(r||(r=document.createElement("DIV"),i=document.documentElement,o=document.defaultView),r.style.transform=t,t=o.getComputedStyle(i.appendChild(r),null).getPropertyValue("transform"),i.removeChild(r),t=t.slice(7,-1).split(","),Object(a.a)(+t[0],+t[1],+t[2],+t[3],+t[4],+t[5]))}function s(t){return null==t?a.b:(u||(u=document.createElementNS("http://www.w3.org/2000/svg","g")),u.setAttribute("transform",t),(t=u.transform.baseVal.consolidate())?(t=t.matrix,Object(a.a)(t.a,t.b,t.c,t.d,t.e,t.f)):a.b)}},function(t,n,e){"use strict";function r(t,n,e,r,i,o,u,a,c,s){this.target=t,this.type=n,this.subject=e,this.identifier=r,this.active=i,this.x=o,this.y=u,this.dx=a,this.dy=c,this._=s}e.d(n,"a",(function(){return r})),r.prototype.on=function(){var t=this._.on.apply(this._,arguments);return t===this._?this:t}},function(t,n,e){"use strict";function r(t){return t[0]}e.d(n,"b",(function(){return r})),n.a=function(t){return arguments.length?(this._x=t,this):this._x}},function(t,n,e){"use strict";function r(t){return t[1]}e.d(n,"b",(function(){return r})),n.a=function(t){return arguments.length?(this._y=t,this):this._y}},function(t,n,e){"use strict";function r(t,n,e,r){if(isNaN(n)||isNaN(e))return t;var i,o,u,a,c,s,f,l,h,d=t._root,v={data:r},p=t._x0,g=t._y0,y=t._x1,b=t._y1;if(!d)return t._root=v,t;for(;d.length;)if((s=n>=(o=(p+y)/2))?p=o:y=o,(f=e>=(u=(g+b)/2))?g=u:b=u,i=d,!(d=d[l=f<<1|s]))return i[l]=v,t;if(a=+t._x.call(null,d.data),c=+t._y.call(null,d.data),n===a&&e===c)return v.next=d,i?i[l]=v:t._root=v,t;do{i=i?i[l]=new Array(4):t._root=new Array(4),(s=n>=(o=(p+y)/2))?p=o:y=o,(f=e>=(u=(g+b)/2))?g=u:b=u}while((l=f<<1|s)==(h=(c>=u)<<1|a>=o));return i[h]=d,i[l]=v,t}function i(t){var n,e,i,o,u=t.length,a=new Array(u),c=new Array(u),s=1/0,f=1/0,l=-1/0,h=-1/0;for(e=0;e<u;++e)isNaN(i=+this._x.call(null,n=t[e]))||isNaN(o=+this._y.call(null,n))||(a[e]=i,c[e]=o,i<s&&(s=i),i>l&&(l=i),o<f&&(f=o),o>h&&(h=o));if(s>l||f>h)return this;for(this.cover(s,f).cover(l,h),e=0;e<u;++e)r(this,a[e],c[e],t[e]);return this}e.d(n,"a",(function(){return i})),n.b=function(t){var n=+this._x.call(null,t),e=+this._y.call(null,t);return r(this.cover(n,e),n,e,t)}},function(t,n,e){"use strict";function r(t){for(var n=0,e=t.length;n<e;++n)this.remove(t[n]);return this}e.d(n,"b",(function(){return r})),n.a=function(t){if(isNaN(o=+this._x.call(null,t))||isNaN(u=+this._y.call(null,t)))return this;var n,e,r,i,o,u,a,c,s,f,l,h,d=this._root,v=this._x0,p=this._y0,g=this._x1,y=this._y1;if(!d)return this;if(d.length)for(;;){if((s=o>=(a=(v+g)/2))?v=a:g=a,(f=u>=(c=(p+y)/2))?p=c:y=c,n=d,!(d=d[l=f<<1|s]))return this;if(!d.length)break;(n[l+1&3]||n[l+2&3]||n[l+3&3])&&(e=n,h=l)}for(;d.data!==t;)if(r=d,!(d=d.next))return this;return(i=d.next)&&delete d.next,r?(i?r.next=i:delete r.next,this):n?(i?n[l]=i:delete n[l],(d=n[0]||n[1]||n[2]||n[3])&&d===(n[3]||n[2]||n[1]||n[0])&&!d.length&&(e?e[h]=d:this._root=d),this):(this._root=i,this)}},function(t,n,e){"use strict";n.a=function(t){return t}},function(t,n,e){"use strict";var r=e(37),i=e(116),o=e(139);n.a={"%":function(t,n){return(100*t).toFixed(n)},b:function(t){return Math.round(t).toString(2)},c:function(t){return t+""},d:r.a,e:function(t,n){return t.toExponential(n)},f:function(t,n){return t.toFixed(n)},g:function(t,n){return t.toPrecision(n)},o:function(t){return Math.round(t).toString(8)},p:function(t,n){return Object(o.a)(100*t,n)},r:o.a,s:i.a,X:function(t){return Math.round(t).toString(16).toUpperCase()},x:function(t){return Math.round(t).toString(16)}}},function(t,n,e){"use strict";var r=e(37);n.a=function(t,n){var e=Object(r.b)(t,n);if(!e)return t+"";var i=e[0],o=e[1];return o<0?"0."+new Array(-o).join("0")+i:i.length>o+1?i.slice(0,o+1)+"."+i.slice(o+1):i+new Array(o-i.length+2).join("0")}},function(t,n,e){"use strict";n.a=function(t){return function(){return t}}},function(t,n,e){"use strict";function r(t){return t[0]}function i(t){return t[1]}e.d(n,"a",(function(){return r})),e.d(n,"b",(function(){return i}))},function(t,n,e){"use strict";e.d(n,"b",(function(){return h})),e.d(n,"a",(function(){return d}));var r=e(40),i=e(69),o=e(18),u=e(17),a=e(1),c=[];function s(){Object(r.a)(this),this.edge=this.site=this.circle=null}function f(t){var n=c.pop()||new s;return n.site=t,n}function l(t){Object(o.b)(t),a.a.remove(t),c.push(t),Object(r.a)(t)}function h(t){var n=t.circle,e=n.x,r=n.cy,i=[e,r],c=t.P,s=t.N,f=[t];l(t);for(var h=c;h.circle&&Math.abs(e-h.circle.x)<a.f&&Math.abs(r-h.circle.cy)<a.f;)c=h.P,f.unshift(h),l(h),h=c;f.unshift(h),Object(o.b)(h);for(var d=s;d.circle&&Math.abs(e-d.circle.x)<a.f&&Math.abs(r-d.circle.cy)<a.f;)s=d.N,f.push(d),l(d),d=s;f.push(d),Object(o.b)(d);var v,p=f.length;for(v=1;v<p;++v)d=f[v],h=f[v-1],Object(u.d)(d.edge,h.site,d.site,i);h=f[0],(d=f[p-1]).edge=Object(u.c)(h.site,d.site,null,i),Object(o.a)(h),Object(o.a)(d)}function d(t){for(var n,e,r,c,s=t[0],l=t[1],h=a.a._;h;)if((r=v(h,l)-s)>a.f)h=h.L;else{if(!((c=s-p(h,l))>a.f)){r>-a.f?(n=h.P,e=h):c>-a.f?(n=h,e=h.N):n=e=h;break}if(!h.R){n=h;break}h=h.R}Object(i.c)(t);var d=f(t);if(a.a.insert(n,d),n||e){if(n===e)return Object(o.b)(n),e=f(n.site),a.a.insert(d,e),d.edge=e.edge=Object(u.c)(n.site,d.site),Object(o.a)(n),void Object(o.a)(e);if(e){Object(o.b)(n),Object(o.b)(e);var g=n.site,y=g[0],b=g[1],m=t[0]-y,_=t[1]-b,w=e.site,x=w[0]-y,M=w[1]-b,j=2*(m*M-_*x),k=m*m+_*_,O=x*x+M*M,S=[(M*k-_*O)/j+y,(m*O-x*k)/j+b];Object(u.d)(e.edge,g,w,S),d.edge=Object(u.c)(g,t,null,S),e.edge=Object(u.c)(t,w,null,S),Object(o.a)(n),Object(o.a)(e)}else d.edge=Object(u.c)(n.site,d.site)}}function v(t,n){var e=t.site,r=e[0],i=e[1],o=i-n;if(!o)return r;var u=t.P;if(!u)return-1/0;var a=(e=u.site)[0],c=e[1],s=c-n;if(!s)return a;var f=a-r,l=1/o-1/s,h=f/s;return l?(-h+Math.sqrt(h*h-2*l*(f*f/(-2*s)-c+s/2+i-o/2)))/l+r:(r+a)/2}function p(t,n){var e=t.N;if(e)return v(e,n);var r=t.site;return r[1]===n?r[0]:1/0}},function(t,n,e){"use strict";var r=e(207);e.d(n,"a",(function(){return r}))},function(t,n,e){"use strict";e.d(n,"a",(function(){return i}));var r=e(5);function i(t,n,e,i){if(null!=t&&null!=n){var o=document.createElement("div");o.setAttribute("class","popupDiv"),o.style.backgroundColor="#ffffff";o.style.width="".concat(550,"px"),o.style.height="".concat(450,"px");var u=n.viewport.width>550?.5*(n.viewport.width-550):0;o.style.left="".concat(u,"px");var a=n.viewport.height>450?.5*(n.viewport.height-450):0;o.style.top="".concat(a,"px"),o.style.position="absolute",o.style.zIndex="9",o.style.boxShadow="5px 7px 20px 7px #aaaaaa";var c=document.createElement("div");c.setAttribute("class","logo-div");var s=document.createElement("div");s.setAttribute("class","stratada-popup-logo"),s.style.width="".concat(50,"px"),s.style.height="".concat(50,"px"),s.style.left="15px",s.style.top="5px",s.style.position="relative",c.appendChild(s),c.style.width="100%";var f=document.createElement("p");f.style.fontSize="".concat(16,"px"),f.style.float="right",f.style.paddingRight="15px",f.style.fontFamily="Segoe UI",f.style.fontWeight="700",f.style.verticalAlign="middle",f.style.position="absolute",f.style.top="0px",f.style.right="0px",f.style.color="#777",f.textContent="Stratada Taskboard Visual",c.appendChild(f),o.appendChild(c),o.appendChild(document.createElement("hr"));var l=document.createElement("div");l.setAttribute("class","textDiv"),l.style.paddingLeft="15px",l.style.paddingRight="15px";var h=document.createElement("p");h.style.fontSize="".concat(16,"px"),h.style.fontFamily="Segoe UI",h.textContent=e;var d=document.createElement("p");d.style.fontSize="".concat(16,"px"),d.style.fontFamily="Segoe UI",d.textContent=i,l.appendChild(h),l.appendChild(d),Object(r.c)(l).append("text").text("learn more here").style("font-size","".concat(16,"px")).style("color","Blue").style("position","absolute").style("bottom","20px").style("text-decoration","underline").on("click",(function(){t.host.launchUrl("https://www.stratada.com/stratada-task-board/")})),o.appendChild(l),Object(r.c)(".body").node().appendChild(o)}}},function(t,n,e){"use strict";e.d(n,"a",(function(){return i})),e.d(n,"b",(function(){return o}));var r,i,o,u,a=e(281);u={decimal:".",thousands:",",grouping:[3],currency:["$",""],minus:"-"},r=Object(a.a)(u),i=r.format,o=r.formatPrefix},function(t,n,e){"use strict";var r=e(6),i=e(9),o=Object(r.a)((function(t){t.setHours(0,0,0,0)}),(function(t,n){t.setDate(t.getDate()+n)}),(function(t,n){return(n-t-(n.getTimezoneOffset()-t.getTimezoneOffset())*i.c)/i.a}),(function(t){return t.getDate()-1}));n.a=o;o.range},function(t,n,e){"use strict";var r=e(6),i=e(9),o=Object(r.a)((function(t){t.setUTCHours(0,0,0,0)}),(function(t,n){t.setUTCDate(t.getUTCDate()+n)}),(function(t,n){return(n-t)/i.a}),(function(t){return t.getUTCDate()-1}));n.a=o;o.range},,,function(t,n,e){"use strict"},function(t,n,e){"use strict";e(96)},function(t,n,e){"use strict"},function(t,n,e){"use strict";e(111),e(59),e(85),e(99),e(211),e(100),e(60),e(101)},function(t,n,e){"use strict";e(111),e(25),e(24),e(53)},function(t,n,e){"use strict";e(97)},function(t,n,e){"use strict";n.a=function(t,n){var e,r,i=t.length,o=-1;if(null==n){for(;++o<i;)if(null!=(e=t[o])&&e>=e)for(r=e;++o<i;)null!=(e=t[o])&&e>r&&(r=e)}else for(;++o<i;)if(null!=(e=n(t[o],o,t))&&e>=e)for(r=e;++o<i;)null!=(e=n(t[o],o,t))&&e>r&&(r=e);return r}},function(t,n,e){"use strict";e(24)},function(t,n,e){"use strict";e(25),e(24),e(53)},function(t,n,e){"use strict"},function(t,n,e){"use strict"},function(t,n,e){"use strict";e(25)},function(t,n,e){"use strict"},function(t,n,e){"use strict"},function(t,n,e){"use strict";e(103)},function(t,n,e){"use strict";e(77)},function(t,n,e){"use strict";e(78)},function(t,n,e){"use strict";e(14),e(3)},function(t,n,e){"use strict";e(169),e(170)},function(t,n,e){"use strict";e(2),e(22)},function(t,n,e){"use strict";e(267),e(120),e(22),e(329)},function(t,n,e){"use strict";e(48)},function(t,n,e){"use strict";var r=e(48);function i(){}var o=r.a.prototype;function u(t,n){var e=new i;if(t instanceof i)t.each((function(t){e.add(t)}));else if(t){var r=-1,o=t.length;if(null==n)for(;++r<o;)e.add(t[r]);else for(;++r<o;)e.add(n(t[r],r,t))}return e}i.prototype=u.prototype={constructor:i,has:o.has,add:function(t){return t+="",this[r.b+t]=t,this},remove:o.remove,clear:o.clear,values:o.keys,size:o.size,empty:o.empty,each:o.each}},function(t,n,e){"use strict"},function(t,n,e){"use strict"},function(t,n,e){"use strict"},function(t,n,e){"use strict";e(105),e(177)},function(t,n,e){"use strict";e(2),e(115),e(55),e(32),e(105)},function(t,n,e){"use strict";var r=e(90),i=e(0),o=e(49),u=e(12),a=e(66),c=e(30),s=e(29),f=e(87),l=e(132);function h(){return!i.c.ctrlKey&&!i.c.button}function d(){return this.parentNode}function v(t){return null==t?{x:i.c.x,y:i.c.y}:t}function p(){return navigator.maxTouchPoints||"ontouchstart"in this}n.a=function(){var t,n,e,g,y=h,b=d,m=v,_=p,w={},x=Object(r.a)("start","drag","end"),M=0,j=0;function k(t){t.on("mousedown.drag",O).filter(_).on("touchstart.drag",A).on("touchmove.drag",T).on("touchend.drag touchcancel.drag",I).style("touch-action","none").style("-webkit-tap-highlight-color","rgba(0,0,0,0)")}function O(){if(!g&&y.apply(this,arguments)){var r=N("mouse",b.apply(this,arguments),o.a,this,arguments);r&&(Object(u.a)(i.c.view).on("mousemove.drag",S,!0).on("mouseup.drag",C,!0),Object(c.a)(i.c.view),Object(s.b)(),e=!1,t=i.c.clientX,n=i.c.clientY,r("start"))}}function S(){if(Object(s.a)(),!e){var r=i.c.clientX-t,o=i.c.clientY-n;e=r*r+o*o>j}w.mouse("drag")}function C(){Object(u.a)(i.c.view).on("mousemove.drag mouseup.drag",null),Object(c.b)(i.c.view,e),Object(s.a)(),w.mouse("end")}function A(){if(y.apply(this,arguments)){var t,n,e=i.c.changedTouches,r=b.apply(this,arguments),o=e.length;for(t=0;t<o;++t)(n=N(e[t].identifier,r,a.a,this,arguments))&&(Object(s.b)(),n("start"))}}function T(){var t,n,e=i.c.changedTouches,r=e.length;for(t=0;t<r;++t)(n=w[e[t].identifier])&&(Object(s.a)(),n("drag"))}function I(){var t,n,e=i.c.changedTouches,r=e.length;for(g&&clearTimeout(g),g=setTimeout((function(){g=null}),500),t=0;t<r;++t)(n=w[e[t].identifier])&&(Object(s.b)(),n("end"))}function N(t,n,e,r,o){var u,a,c,s=e(n,t),f=x.copy();if(Object(i.a)(new l.a(k,"beforestart",u,t,M,s[0],s[1],0,0,f),(function(){return null!=(i.c.subject=u=m.apply(r,o))&&(a=u.x-s[0]||0,c=u.y-s[1]||0,!0)})))return function h(d){var v,p=s;switch(d){case"start":w[t]=h,v=M++;break;case"end":delete w[t],--M;case"drag":s=e(n,t),v=M}Object(i.a)(new l.a(k,d,u,t,v,s[0]+a,s[1]+c,s[0]-p[0],s[1]-p[1],f),f.apply,f,[d,r,o])}}return k.filter=function(t){return arguments.length?(y="function"==typeof t?t:Object(f.a)(!!t),k):y},k.container=function(t){return arguments.length?(b="function"==typeof t?t:Object(f.a)(t),k):b},k.subject=function(t){return arguments.length?(m="function"==typeof t?t:Object(f.a)(t),k):m},k.touchable=function(t){return arguments.length?(_="function"==typeof t?t:Object(f.a)(!!t),k):_},k.on=function(){var t=x.on.apply(x,arguments);return t===x?k:t},k.clickDistance=function(t){return arguments.length?(j=(t=+t)*t,k):Math.sqrt(j)},k}},function(t,n,e){"use strict";e(180),e(181),e(182),e(183),e(184),e(82),e(185),e(186)},function(t,n,e){"use strict"},function(t,n,e){"use strict";e(10),e(28),e(295)},function(t,n,e){"use strict";e(10),e(28),e(35)},function(t,n,e){"use strict";e(10),e(28),e(295),e(82)},function(t,n,e){"use strict";e(10)},function(t,n,e){"use strict";e(10)},function(t,n,e){"use strict";e(10)},function(t,n,e){"use strict";e(188),e(106),e(189),e(190),e(107),e(191)},function(t,n,e){"use strict";(function t(n){function e(t,e){return t=null==t?0:+t,e=null==e?1:+e,1===arguments.length?(e=t,t=0):e-=t,function(){return n()*e+t}}return e.source=t,e})(e(26).a)},function(t,n,e){"use strict";var r=e(26),i=e(106);(function t(n){function e(){var t=i.a.source(n).apply(this,arguments);return function(){return Math.exp(t())}}return e.source=t,e})(r.a)},function(t,n,e){"use strict";var r=e(26),i=e(107);(function t(n){function e(t){var e=i.a.source(n)(t);return function(){return e()/t}}return e.source=t,e})(r.a)},function(t,n,e){"use strict";(function t(n){function e(t){return function(){return-Math.log(1-n())/t}}return e.source=t,e})(e(26).a)},function(t,n,e){"use strict";e(125),e(193),e(20),e(62),e(63),e(79),e(52),e(194),e(195),e(196),e(109),e(197),e(27),e(198),e(58),e(108)},function(t,n,e){"use strict";e(15),e(20),e(84)},function(t,n,e){"use strict";e(2),e(15),e(4)},function(t,n,e){"use strict";e(2),e(15),e(20),e(4)},function(t,n,e){"use strict";e(2),e(15),e(4)},function(t,n,e){"use strict";e(109),e(298),e(75),e(337),e(34),e(147),e(338),e(339),e(296),e(297),e(4)},function(t,n,e){"use strict";e(2),e(8),e(4)},function(t,n,e){"use strict";var r=e(42),i=e(12);n.a=function(t){return Object(i.a)(Object(r.a)(t).call(document.documentElement))}},function(t,n,e){"use strict";e.d(n,"a",(function(){return i}));var r=0;function i(){return new o}function o(){this._="@"+(++r).toString(36)}o.prototype=i.prototype={constructor:o,get:function(t){for(var n=this._;!(n in t);)if(!(t=t.parentNode))return;return t[n]},set:function(t,n){return t[this._]=n},remove:function(t){return this._ in t&&delete t[this._]},toString:function(){return this._}}},function(t,n,e){"use strict";var r=e(7);n.a=function(t){return"string"==typeof t?new r.a([document.querySelectorAll(t)],[document.documentElement]):new r.a([null==t?[]:t],r.c)}},function(t,n,e){"use strict";e(203)},function(t,n,e){"use strict";e(140),e(141),e(1)},function(t,n,e){"use strict";e(205),e(38)},function(t,n,e){"use strict";e(90),e(30),e(340),e(0),e(49),e(12),e(66),e(36),e(88),e(286),e(38),e(41)},function(t,n,e){"use strict";e.d(n,"a",(function(){return o}));var r=e(143);function i(t,n){for(var e=0;e<n.length;e++){var r=n[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var o=function(){function t(n,e,r){!function(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}(this,t),this.colorPalette=n,this.fillProp=e,this.defaultDataPointColor=r}var n,e,o;return n=t,o=[{key:"normalizeSelector",value:function(t,n){return t&&(n||t.data)?{data:t.data}:t}}],(e=[{key:"getColorForSeriesValue",value:function(t,n,e){return this.isHighContrast?this.getThemeColor(e):this.fillProp&&r.a.getFillColor(t,this.fillProp)||this.defaultDataPointColor||this.colorPalette.getColor(String(n)).value}},{key:"getColorForMeasure",value:function(t,n,e){if(this.isHighContrast)return this.getThemeColor(e);var i=this.colorPalette.getColor(n).value;return this.fillProp&&r.a.getFillColor(t,this.fillProp)||this.defaultDataPointColor||i}},{key:"isHighContrast",get:function(){return!(!this.colorPalette||!this.colorPalette.isHighContrast)}},{key:"getThemeColor",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"background";return this.colorPalette&&this.colorPalette[t]&&this.colorPalette[t].value}},{key:"getHighContrastColor",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"background",n=arguments.length>1?arguments[1]:void 0;return this.isHighContrast?this.getThemeColor(t):n}}])&&i(n.prototype,e),o&&i(n,o),t}()},function(t,n,e){"use strict";e.r(n),e.d(n,"getValue",(function(){return o})),e.d(n,"getObject",(function(){return u})),e.d(n,"getFillColor",(function(){return a})),e.d(n,"getCommonValue",(function(){return c}));var r=e(110);function i(t){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,n,e){return t?r.a(t[n.objectName],n.propertyName,e):e}function u(t,n,e){return t&&t[n]?t[n]:e}function a(t,n,e){var r=o(t,n);return r&&r.solid?r.solid.color:e}function c(t,n,e){var r=o(t,n,e);return r&&r.solid?r.solid.color:null==r||"object"===i(r)&&!r.solid?e:r}},function(t,n,e){"use strict";var r;e.r(n),e.d(n,"ArrayExtensions",(function(){return r})),function(t){function n(t,n){t.indexOf(n)<0&&t.push(n)}function e(t,n){for(var e=[],r=0;r<n;++r)e.push(t[r]);return e}function r(t){var n=t;return n.withId=i,n}function i(n){return t.findWithId(this,n)}function o(t){var n=t;return n.withName=c,n}function u(t,n){var e=a(t,n);if(e>=0)return t[e]}function a(t,n){for(var e=0,r=t.length;e<r;e++){if(t[e].name===n)return e}return-1}function c(t){return u(this,t)}function s(t,n){var e=t.length;if(e>=2)for(var r=1;r<e;r++)if(n(t[r-1],t[r])>0)return!1;return!0}t.intersect=function(t,n){for(var e=[],r=t.length-1;r>=0;--r)-1!==n.indexOf(t[r])&&e.push(t[r]);return e},t.diff=function(t,n){for(var e=[],r=t.length-1;r>=0;--r){var i=t[r];-1===n.indexOf(i)&&e.push(i)}return e},t.distinct=function(t){for(var n=[],e=0,r=t.length;e<r;e++){var i=t[e];-1===n.indexOf(i)&&n.push(i)}return n},t.union=function(t,e){for(var r=0,i=e.length;r<i;++r)n(t,e[r])},t.unionSingle=n,t.range=function(t,n,e){for(var r=[],i=n;i<=e;++i)r.push(t[i]);return r},t.take=e,t.copy=function(t){return e(t,t.length)},t.sequenceEqual=function(t,n,e){if(t||(t=null),n||(n=null),t===n)return!0;if(!!t!=!!n)return!1;var r=t.length;if(r!==n.length)return!1;for(var i=0;i<r&&e(t[i],n[i]);)++i;return i===r},t.emptyToNull=function(t){return t&&0===t.length?null:t},t.indexOf=function(t,n){for(var e=0,r=t.length;e<r;++e)if(n(t[e]))return e;return-1},t.rotate=function(t,n){if(0===n)return t.slice();var e=t.slice(n);return Array.prototype.push.apply(e,t.slice(0,n)),e},t.createWithId=function(){return r([])},t.extendWithId=r,t.findWithId=function(t,n){for(var e=0,r=t.length;e<r;e++){var i=t[e];if(i.id===n)return i}},t.createWithName=function(){return o([])},t.extendWithName=o,t.findItemWithName=u,t.indexWithName=a,t.insertSorted=function(t,n){for(var e=t.length-1;e>=0;e--){var r=t[e]-n;if(0===r)return!1;if(!(r>0))return t.splice(e+1,0,n),!0}return t.unshift(n),!0},t.removeFirst=function(t,n){var e=t.indexOf(n);return!(e<0)&&(t.splice(e,1),!0)},t.clear=function(t){if(t)for(;t.length>0;)t.pop()},t.isUndefinedOrEmpty=function(t){return!t||0===t.length},t.swap=function(t,n,e){var r=t[n];t[n]=t[e],t[e]=r},t.isInArray=function(t,n,e){return t.some((function(t){return e(t,n)}))},t.isArrayOrInheritedArray=function(t){for(var n=t;null!=n;){if(Array.isArray(n))return!0;n=Object.getPrototypeOf(n)}return!1},t.isSorted=s,t.isSortedNumeric=function(t,n){return s(t,n?function(t,n){return n-t}:function(t,n){return t-n})},t.ensureArray=function(t){return Array.isArray(t)?t:[t]}}(r||(r={}))},function(t,n,e){"use strict";e.r(n),e.d(n,"MIN_VALUE",(function(){return r})),e.d(n,"MAX_VALUE",(function(){return i})),e.d(n,"MIN_EXP",(function(){return o})),e.d(n,"MAX_EXP",(function(){return u})),e.d(n,"EPSILON",(function(){return a})),e.d(n,"DEFAULT_PRECISION",(function(){return c})),e.d(n,"DEFAULT_PRECISION_IN_DECIMAL_DIGITS",(function(){return s})),e.d(n,"LOG_E_10",(function(){return f})),e.d(n,"POSITIVE_POWERS",(function(){return l})),e.d(n,"NEGATIVE_POWERS",(function(){return h})),e.d(n,"pow10",(function(){return d})),e.d(n,"log10",(function(){return v})),e.d(n,"getPrecision",(function(){return p})),e.d(n,"equalWithPrecision",(function(){return g})),e.d(n,"lessWithPrecision",(function(){return y})),e.d(n,"lessOrEqualWithPrecision",(function(){return b})),e.d(n,"greaterWithPrecision",(function(){return m})),e.d(n,"greaterOrEqualWithPrecision",(function(){return _})),e.d(n,"floorWithPrecision",(function(){return w})),e.d(n,"ceilWithPrecision",(function(){return x})),e.d(n,"floorToPrecision",(function(){return M})),e.d(n,"ceilToPrecision",(function(){return j})),e.d(n,"roundToPrecision",(function(){return k})),e.d(n,"ensureInRange",(function(){return O})),e.d(n,"round",(function(){return S})),e.d(n,"project",(function(){return C})),e.d(n,"removeDecimalNoise",(function(){return A})),e.d(n,"isInteger",(function(){return T})),e.d(n,"toIncrement",(function(){return I})),e.d(n,"detectPrecision",(function(){return N}));var r=-Number.MAX_VALUE,i=Number.MAX_VALUE,o=-308,u=308,a=1e-323,c=1e-4,s=12,f=Math.log(10),l=[1,10,100,1e3,1e4,1e5,1e6,1e7,1e8,1e9,1e10,1e11,1e12,1e13,1e14,1e15,1e16,1e17,1e18,1e19,1e20,1e21,1e22,1e23,1e24,1e25,1e26,1e27,1e28,1e29,1e30,1e31,1e32,1e33,1e34,1e35,1e36,1e37,1e38,1e39,1e40,1e41,1e42,1e43,1e44,1e45,1e46,1e47,1e48,1e49,1e50,1e51,1e52,1e53,1e54,1e55,1e56,1e57,1e58,1e59,1e60,1e61,1e62,1e63,1e64,1e65,1e66,1e67,1e68,1e69,1e70,1e71,1e72,1e73,1e74,1e75,1e76,1e77,1e78,1e79,1e80,1e81,1e82,1e83,1e84,1e85,1e86,1e87,1e88,1e89,1e90,1e91,1e92,1e93,1e94,1e95,1e96,1e97,1e98,1e99,1e100,1e101,1e102,1e103,1e104,1e105,1e106,1e107,1e108,1e109,1e110,1e111,1e112,1e113,1e114,1e115,1e116,1e117,1e118,1e119,1e120,1e121,1e122,1e123,1e124,1e125,1e126,1e127,1e128,1e129,1e130,1e131,1e132,1e133,1e134,1e135,1e136,1e137,1e138,1e139,1e140,1e141,1e142,1e143,1e144,1e145,1e146,1e147,1e148,1e149,1e150,1e151,1e152,1e153,1e154,1e155,1e156,1e157,1e158,1e159,1e160,1e161,1e162,1e163,1e164,1e165,1e166,1e167,1e168,1e169,1e170,1e171,1e172,1e173,1e174,1e175,1e176,1e177,1e178,1e179,1e180,1e181,1e182,1e183,1e184,1e185,1e186,1e187,1e188,1e189,1e190,1e191,1e192,1e193,1e194,1e195,1e196,1e197,1e198,1e199,1e200,1e201,1e202,1e203,1e204,1e205,1e206,1e207,1e208,1e209,1e210,1e211,1e212,1e213,1e214,1e215,1e216,1e217,1e218,1e219,1e220,1e221,1e222,1e223,1e224,1e225,1e226,1e227,1e228,1e229,1e230,1e231,1e232,1e233,1e234,1e235,1e236,1e237,1e238,1e239,1e240,1e241,1e242,1e243,1e244,1e245,1e246,1e247,1e248,1e249,1e250,1e251,1e252,1e253,1e254,1e255,1e256,1e257,1e258,1e259,1e260,1e261,1e262,1e263,1e264,1e265,1e266,1e267,1e268,1e269,1e270,1e271,1e272,1e273,1e274,1e275,1e276,1e277,1e278,1e279,1e280,1e281,1e282,1e283,1e284,1e285,1e286,1e287,1e288,1e289,1e290,1e291,1e292,1e293,1e294,1e295,1e296,1e297,1e298,1e299,1e300,1e301,1e302,1e303,1e304,1e305,1e306,1e307,1e308],h=[1,.1,.01,.001,1e-4,1e-5,1e-6,1e-7,1e-8,1e-9,1e-10,1e-11,1e-12,1e-13,1e-14,1e-15,1e-16,1e-17,1e-18,1e-19,1e-20,1e-21,1e-22,1e-23,1e-24,1e-25,1e-26,1e-27,1e-28,1e-29,1e-30,1e-31,1e-32,1e-33,1e-34,1e-35,1e-36,1e-37,1e-38,1e-39,1e-40,1e-41,1e-42,1e-43,1e-44,1e-45,1e-46,1e-47,1e-48,1e-49,1e-50,1e-51,1e-52,1e-53,1e-54,1e-55,1e-56,1e-57,1e-58,1e-59,1e-60,1e-61,1e-62,1e-63,1e-64,1e-65,1e-66,1e-67,1e-68,1e-69,1e-70,1e-71,1e-72,1e-73,1e-74,1e-75,1e-76,1e-77,1e-78,1e-79,1e-80,1e-81,1e-82,1e-83,1e-84,1e-85,1e-86,1e-87,1e-88,1e-89,1e-90,1e-91,1e-92,1e-93,1e-94,1e-95,1e-96,1e-97,1e-98,1e-99,1e-100,1e-101,1e-102,1e-103,1e-104,1e-105,1e-106,1e-107,1e-108,1e-109,1e-110,1e-111,1e-112,1e-113,1e-114,1e-115,1e-116,1e-117,1e-118,1e-119,1e-120,1e-121,1e-122,1e-123,1e-124,1e-125,1e-126,1e-127,1e-128,1e-129,1e-130,1e-131,1e-132,1e-133,1e-134,1e-135,1e-136,1e-137,1e-138,1e-139,1e-140,1e-141,1e-142,1e-143,1e-144,1e-145,1e-146,1e-147,1e-148,1e-149,1e-150,1e-151,1e-152,1e-153,1e-154,1e-155,1e-156,1e-157,1e-158,1e-159,1e-160,1e-161,1e-162,1e-163,1e-164,1e-165,1e-166,1e-167,1e-168,1e-169,1e-170,1e-171,1e-172,1e-173,1e-174,1e-175,1e-176,1e-177,1e-178,1e-179,1e-180,1e-181,1e-182,1e-183,1e-184,1e-185,1e-186,1e-187,1e-188,1e-189,1e-190,1e-191,1e-192,1e-193,1e-194,1e-195,1e-196,1e-197,1e-198,1e-199,1e-200,1e-201,1e-202,1e-203,1e-204,1e-205,1e-206,1e-207,1e-208,1e-209,1e-210,1e-211,1e-212,1e-213,1e-214,1e-215,1e-216,1e-217,1e-218,1e-219,1e-220,1e-221,1e-222,1e-223,1e-224,1e-225,1e-226,1e-227,1e-228,1e-229,1e-230,1e-231,1e-232,1e-233,1e-234,1e-235,1e-236,1e-237,1e-238,1e-239,1e-240,1e-241,1e-242,1e-243,1e-244,1e-245,1e-246,1e-247,1e-248,1e-249,1e-250,1e-251,1e-252,1e-253,1e-254,1e-255,1e-256,1e-257,1e-258,1e-259,1e-260,1e-261,1e-262,1e-263,1e-264,1e-265,1e-266,1e-267,1e-268,1e-269,1e-270,1e-271,1e-272,1e-273,1e-274,1e-275,1e-276,1e-277,1e-278,1e-279,1e-280,1e-281,1e-282,1e-283,1e-284,1e-285,1e-286,1e-287,1e-288,1e-289,1e-290,1e-291,1e-292,1e-293,1e-294,1e-295,1e-296,1e-297,1e-298,1e-299,1e-300,1e-301,1e-302,1e-303,1e-304,1e-305,1e-306,1e-307,1e-308,1e-309,1e-310,1e-311,1e-312,1e-313,1e-314,1e-315,1e-316,1e-317,1e-318,1e-319,1e-320,1e-321,1e-322,1e-323,0];function d(t){return t>=0?t<l.length?l[t]:1/0:(t=-t)>0&&t<h.length?h[t]:0}function v(t){return t>1&&t<1e16?t<1e8?t<1e4?t<100?t<10?0:1:t<1e3?2:3:t<1e6?t<1e5?4:5:t<1e7?6:7:t<1e12?t<1e10?t<1e9?8:9:t<1e11?10:11:t<1e14?t<1e13?12:13:t<1e15?14:15:t>1e-16&&t<1?t<1e-8?t<1e-12?t<1e-14?t<1e-15?-16:-15:t<1e-13?-14:-13:t<1e-10?t<1e-11?-12:-11:t<1e-9?-10:-9:t<1e-4?t<1e-6?t<1e-7?-8:-7:t<1e-5?-6:-5:t<.01?t<.001?-4:-3:t<.1?-2:-1:w(Math.log(t)/f)}function p(t,n){if(void 0===n&&(n=s),t&&isFinite(t)){var e=v(Math.abs(t));return e<o?0:d(Math.max(e-n,1-h.length))}}function g(t,n,e){return e=N(e,t,n),t===n||Math.abs(t-n)<e}function y(t,n,e){return e=N(e,t,n),t<n&&Math.abs(t-n)>e}function b(t,n,e){return e=N(e,t,n),t<n||Math.abs(t-n)<e}function m(t,n,e){return e=N(e,t,n),t>n&&Math.abs(t-n)>e}function _(t,n,e){return e=N(e,t,n),t>n||Math.abs(t-n)<e}function w(t,n){n=null!=n?n:c;var e=Math.round(t);return Math.abs(t-e)<n?e:Math.floor(t)}function x(t,n){n=N(n,c);var e=Math.round(t);return Math.abs(t-e)<n?e:Math.ceil(t)}function M(t,n){return 0===(n=N(n,c))||0===t?t:Math.floor(t/n)*n}function j(t,n){return 0===(n=N(n,c))||0===t?t:Math.ceil(t/n)*n}function k(t,n){if(0===(n=N(n,c))||0===t)return t;var e=Math.round(t/n)*n,r=Math.round(v(Math.abs(t))-v(n))+1;return r>0&&r<16&&(e=parseFloat(e.toPrecision(r))),e}function O(t,n,e){return null==t?t:t<n?n:t>e?e:t}function S(t){return.5+t<<0}function C(t,n,e,r,i){return 0===e||0===i?n<=t&&t<=n+e?r:NaN:r+(t-n)/e*i}function A(t){return k(t,p(t))}function T(t){return null!==t&&t%1==0}function I(t,n){return Math.round(t/n)*n}function N(t,n,e){return void 0!==t?t:p(e?n?Math.min(Math.abs(n),Math.abs(e)):e:n)||c}},function(t,n,e){},function(t,n,e){"use strict";n.a=function(t){return t}},function(t,n,e){"use strict";n.a=function(t){return t}},function(t,n,e){"use strict";var r=e(104);n.a=function(t){return this.each((function(){Object(r.a)(this,t)}))}},function(t,n,e){"use strict";var r=e(14),i=e(3),o=e(328),u=e(70),a={time:null,delay:0,duration:250,ease:o.a};function c(t,n){for(var e;!(e=t.__transition)||!(e=e[n]);)if(!(t=t.parentNode))return a.time=Object(u.b)(),a;return e}n.a=function(t){var n,e;t instanceof r.a?(n=t._id,t=t._name):(n=Object(r.b)(),(e=a).time=Object(u.b)(),t=null==t?null:t+"");for(var o=this._groups,s=o.length,f=0;f<s;++f)for(var l,h=o[f],d=h.length,v=0;v<d;++v)(l=h[v])&&Object(i.e)(l,t,n,v,h,e||c(l,n));return new r.a(o,this._parents,t,n)}},function(t,n,e){"use strict";var r=e(294),i=e(46),o=e(45),u=e(112);function a(t){return function(){this.removeAttribute(t)}}function c(t){return function(){this.removeAttributeNS(t.space,t.local)}}function s(t,n,e){var r,i,o=e+"";return function(){var u=this.getAttribute(t);return u===o?null:u===r?i:i=n(r=u,e)}}function f(t,n,e){var r,i,o=e+"";return function(){var u=this.getAttributeNS(t.space,t.local);return u===o?null:u===r?i:i=n(r=u,e)}}function l(t,n,e){var r,i,o;return function(){var u,a,c=e(this);if(null!=c)return(u=this.getAttribute(t))===(a=c+"")?null:u===r&&a===i?o:(i=a,o=n(r=u,c));this.removeAttribute(t)}}function h(t,n,e){var r,i,o;return function(){var u,a,c=e(this);if(null!=c)return(u=this.getAttributeNS(t.space,t.local))===(a=c+"")?null:u===r&&a===i?o:(i=a,o=n(r=u,c));this.removeAttributeNS(t.space,t.local)}}n.a=function(t,n){var e=Object(i.a)(t),d="transform"===e?r.b:u.a;return this.attrTween(t,"function"==typeof n?(e.local?h:l)(e,d,Object(o.b)(this,"attr."+t,n)):null==n?(e.local?c:a)(e):(e.local?f:s)(e,d,n))}},function(t,n,e){"use strict";var r=e(113);n.a=function(t){var n=t.length;return function(e){var i=Math.floor(((e%=1)<0?++e:e)*n),o=t[(i+n-1)%n],u=t[i%n],a=t[(i+1)%n],c=t[(i+2)%n];return Object(r.a)((e-i/n)*n,o,u,a,c)}}},function(t,n,e){"use strict";var r=e(46);function i(t,n){return function(e){this.setAttribute(t,n.call(this,e))}}function o(t,n){return function(e){this.setAttributeNS(t.space,t.local,n.call(this,e))}}function u(t,n){var e,r;function i(){var i=n.apply(this,arguments);return i!==r&&(e=(r=i)&&o(t,i)),e}return i._value=n,i}function a(t,n){var e,r;function o(){var o=n.apply(this,arguments);return o!==r&&(e=(r=o)&&i(t,o)),e}return o._value=n,o}n.a=function(t,n){var e="attr."+t;if(arguments.length<2)return(e=this.tween(e))&&e._value;if(null==n)return this.tween(e,null);if("function"!=typeof n)throw new Error;var i=Object(r.a)(t);return this.tween(e,(i.local?u:a)(i,n))}},function(t,n,e){"use strict";var r=e(3);function i(t,n){return function(){Object(r.g)(this,t).delay=+n.apply(this,arguments)}}function o(t,n){return n=+n,function(){Object(r.g)(this,t).delay=n}}n.a=function(t){var n=this._id;return arguments.length?this.each(("function"==typeof t?i:o)(n,t)):Object(r.f)(this.node(),n).delay}},function(t,n,e){"use strict";var r=e(3);function i(t,n){return function(){Object(r.h)(this,t).duration=+n.apply(this,arguments)}}function o(t,n){return n=+n,function(){Object(r.h)(this,t).duration=n}}n.a=function(t){var n=this._id;return arguments.length?this.each(("function"==typeof t?i:o)(n,t)):Object(r.f)(this.node(),n).duration}},function(t,n,e){"use strict";var r=e(3);function i(t,n){if("function"!=typeof n)throw new Error;return function(){Object(r.h)(this,t).ease=n}}n.a=function(t){var n=this._id;return arguments.length?this.each(i(n,t)):Object(r.f)(this.node(),n).ease}},function(t,n,e){"use strict";var r=e(80),i=e(14);n.a=function(t){"function"!=typeof t&&(t=Object(r.a)(t));for(var n=this._groups,e=n.length,o=new Array(e),u=0;u<e;++u)for(var a,c=n[u],s=c.length,f=o[u]=[],l=0;l<s;++l)(a=c[l])&&t.call(a,a.__data__,l,c)&&f.push(a);return new i.a(o,this._parents,this._name,this._id)}},function(t,n,e){"use strict";var r=e(14);n.a=function(t){if(t._id!==this._id)throw new Error;for(var n=this._groups,e=t._groups,i=n.length,o=e.length,u=Math.min(i,o),a=new Array(i),c=0;c<u;++c)for(var s,f=n[c],l=e[c],h=f.length,d=a[c]=new Array(h),v=0;v<h;++v)(s=f[v]||l[v])&&(d[v]=s);for(;c<i;++c)a[c]=n[c];return new r.a(a,this._parents,this._name,this._id)}},function(t,n,e){"use strict";var r=e(3);function i(t,n,e){var i,o,u=function(t){return(t+"").trim().split(/^|\s+/).every((function(t){var n=t.indexOf(".");return n>=0&&(t=t.slice(0,n)),!t||"start"===t}))}(n)?r.g:r.h;return function(){var r=u(this,t),a=r.on;a!==i&&(o=(i=a).copy()).on(n,e),r.on=o}}n.a=function(t,n){var e=this._id;return arguments.length<2?Object(r.f)(this.node(),e).on.on(t):this.each(i(e,t,n))}},function(t,n,e){"use strict";n.a=function(){return this.on("end.remove",(t=this._id,function(){var n=this.parentNode;for(var e in this.__transition)if(+e!==t)return;n&&n.removeChild(this)}));var t}},function(t,n,e){"use strict";var r=e(54),i=e(14),o=e(3);n.a=function(t){var n=this._name,e=this._id;"function"!=typeof t&&(t=Object(r.a)(t));for(var u=this._groups,a=u.length,c=new Array(a),s=0;s<a;++s)for(var f,l,h=u[s],d=h.length,v=c[s]=new Array(d),p=0;p<d;++p)(f=h[p])&&(l=t.call(f,f.__data__,p,h))&&("__data__"in f&&(l.__data__=f.__data__),v[p]=l,Object(o.e)(v[p],n,e,p,v,Object(o.f)(f,e)));return new i.a(c,this._parents,n,e)}},function(t,n,e){"use strict";var r=e(81),i=e(14),o=e(3);n.a=function(t){var n=this._name,e=this._id;"function"!=typeof t&&(t=Object(r.a)(t));for(var u=this._groups,a=u.length,c=[],s=[],f=0;f<a;++f)for(var l,h=u[f],d=h.length,v=0;v<d;++v)if(l=h[v]){for(var p,g=t.call(l,l.__data__,v,h),y=Object(o.f)(l,e),b=0,m=g.length;b<m;++b)(p=g[b])&&Object(o.e)(p,n,e,b,g,y);c.push(g),s.push(l)}return new i.a(c,s,n,e)}},function(t,n,e){"use strict";var r=e(7).b.prototype.constructor;n.a=function(){return new r(this._groups,this._parents)}},function(t,n,e){"use strict";var r=e(7),i=e(54);n.a=function(t){"function"!=typeof t&&(t=Object(i.a)(t));for(var n=this._groups,e=n.length,o=new Array(e),u=0;u<e;++u)for(var a,c,s=n[u],f=s.length,l=o[u]=new Array(f),h=0;h<f;++h)(a=s[h])&&(c=t.call(a,a.__data__,h,s))&&("__data__"in a&&(c.__data__=a.__data__),l[h]=c);return new r.a(o,this._parents)}},function(t,n,e){"use strict";var r=e(7),i=e(81);n.a=function(t){"function"!=typeof t&&(t=Object(i.a)(t));for(var n=this._groups,e=n.length,o=[],u=[],a=0;a<e;++a)for(var c,s=n[a],f=s.length,l=0;l<f;++l)(c=s[l])&&(o.push(t.call(c,c.__data__,l,s)),u.push(c));return new r.a(o,u)}},function(t,n,e){"use strict";var r=e(7),i=e(80);n.a=function(t){"function"!=typeof t&&(t=Object(i.a)(t));for(var n=this._groups,e=n.length,o=new Array(e),u=0;u<e;++u)for(var a,c=n[u],s=c.length,f=o[u]=[],l=0;l<s;++l)(a=c[l])&&t.call(a,a.__data__,l,c)&&f.push(a);return new r.a(o,this._parents)}},function(t,n,e){"use strict";var r=e(7),i=e(83),o=e(232);function u(t,n,e,r,o,u){for(var a,c=0,s=n.length,f=u.length;c<f;++c)(a=n[c])?(a.__data__=u[c],r[c]=a):e[c]=new i.a(t,u[c]);for(;c<s;++c)(a=n[c])&&(o[c]=a)}function a(t,n,e,r,o,u,a){var c,s,f,l={},h=n.length,d=u.length,v=new Array(h);for(c=0;c<h;++c)(s=n[c])&&(v[c]=f="$"+a.call(s,s.__data__,c,n),f in l?o[c]=s:l[f]=s);for(c=0;c<d;++c)(s=l[f="$"+a.call(t,u[c],c,u)])?(r[c]=s,s.__data__=u[c],l[f]=null):e[c]=new i.a(t,u[c]);for(c=0;c<h;++c)(s=n[c])&&l[v[c]]===s&&(o[c]=s)}n.a=function(t,n){if(!t)return y=new Array(this.size()),d=-1,this.each((function(t){y[++d]=t})),y;var e=n?a:u,i=this._parents,c=this._groups;"function"!=typeof t&&(t=Object(o.a)(t));for(var s=c.length,f=new Array(s),l=new Array(s),h=new Array(s),d=0;d<s;++d){var v=i[d],p=c[d],g=p.length,y=t.call(v,v&&v.__data__,d,i),b=y.length,m=l[d]=new Array(b),_=f[d]=new Array(b);e(v,p,m,_,h[d]=new Array(g),y,n);for(var w,x,M=0,j=0;M<b;++M)if(w=m[M]){for(M>=j&&(j=M+1);!(x=_[j])&&++j<b;);w._next=x||null}}return(f=new r.a(f,i))._enter=l,f._exit=h,f}},function(t,n,e){"use strict";n.a=function(t){return function(){return t}}},function(t,n,e){"use strict";var r=e(114),i=e(7);n.a=function(){return new i.a(this._exit||this._groups.map(r.a),this._parents)}},function(t,n,e){"use strict";n.a=function(t,n,e){var r=this.enter(),i=this,o=this.exit();return r="function"==typeof t?t(r):r.append(t+""),null!=n&&(i=n(i)),null==e?o.remove():e(o),r&&i?r.merge(i).order():i}},function(t,n,e){"use strict";var r=e(7);n.a=function(t){for(var n=this._groups,e=t._groups,i=n.length,o=e.length,u=Math.min(i,o),a=new Array(i),c=0;c<u;++c)for(var s,f=n[c],l=e[c],h=f.length,d=a[c]=new Array(h),v=0;v<h;++v)(s=f[v]||l[v])&&(d[v]=s);for(;c<i;++c)a[c]=n[c];return new r.a(a,this._parents)}},function(t,n,e){"use strict";n.a=function(){for(var t=this._groups,n=-1,e=t.length;++n<e;)for(var r,i=t[n],o=i.length-1,u=i[o];--o>=0;)(r=i[o])&&(u&&4^r.compareDocumentPosition(u)&&u.parentNode.insertBefore(r,u),u=r);return this}},function(t,n,e){"use strict";var r=e(7);function i(t,n){return t<n?-1:t>n?1:t>=n?0:NaN}n.a=function(t){function n(n,e){return n&&e?t(n.__data__,e.__data__):!n-!e}t||(t=i);for(var e=this._groups,o=e.length,u=new Array(o),a=0;a<o;++a){for(var c,s=e[a],f=s.length,l=u[a]=new Array(f),h=0;h<f;++h)(c=s[h])&&(l[h]=c);l.sort(n)}return new r.a(u,this._parents).order()}},function(t,n,e){"use strict";n.a=function(){var t=arguments[0];return arguments[0]=this,t.apply(null,arguments),this}},function(t,n,e){"use strict";n.a=function(){var t=new Array(this.size()),n=-1;return this.each((function(){t[++n]=this})),t}},function(t,n,e){"use strict";n.a=function(){for(var t=this._groups,n=0,e=t.length;n<e;++n)for(var r=t[n],i=0,o=r.length;i<o;++i){var u=r[i];if(u)return u}return null}},function(t,n,e){"use strict";n.a=function(){var t=0;return this.each((function(){++t})),t}},function(t,n,e){"use strict";n.a=function(){return!this.node()}},function(t,n,e){"use strict";n.a=function(t){for(var n=this._groups,e=0,r=n.length;e<r;++e)for(var i,o=n[e],u=0,a=o.length;u<a;++u)(i=o[u])&&t.call(i,i.__data__,u,o);return this}},function(t,n,e){"use strict";var r=e(46);function i(t){return function(){this.removeAttribute(t)}}function o(t){return function(){this.removeAttributeNS(t.space,t.local)}}function u(t,n){return function(){this.setAttribute(t,n)}}function a(t,n){return function(){this.setAttributeNS(t.space,t.local,n)}}function c(t,n){return function(){var e=n.apply(this,arguments);null==e?this.removeAttribute(t):this.setAttribute(t,e)}}function s(t,n){return function(){var e=n.apply(this,arguments);null==e?this.removeAttributeNS(t.space,t.local):this.setAttributeNS(t.space,t.local,e)}}n.a=function(t,n){var e=Object(r.a)(t);if(arguments.length<2){var f=this.node();return e.local?f.getAttributeNS(e.space,e.local):f.getAttribute(e)}return this.each((null==n?e.local?o:i:"function"==typeof n?e.local?s:c:e.local?a:u)(e,n))}},function(t,n,e){"use strict";function r(t){return function(){delete this[t]}}function i(t,n){return function(){this[t]=n}}function o(t,n){return function(){var e=n.apply(this,arguments);null==e?delete this[t]:this[t]=e}}n.a=function(t,n){return arguments.length>1?this.each((null==n?r:"function"==typeof n?o:i)(t,n)):this.node()[t]}},function(t,n,e){"use strict";function r(t){return t.trim().split(/^|\s+/)}function i(t){return t.classList||new o(t)}function o(t){this._node=t,this._names=r(t.getAttribute("class")||"")}function u(t,n){for(var e=i(t),r=-1,o=n.length;++r<o;)e.add(n[r])}function a(t,n){for(var e=i(t),r=-1,o=n.length;++r<o;)e.remove(n[r])}function c(t){return function(){u(this,t)}}function s(t){return function(){a(this,t)}}function f(t,n){return function(){(n.apply(this,arguments)?u:a)(this,t)}}o.prototype={add:function(t){this._names.indexOf(t)<0&&(this._names.push(t),this._node.setAttribute("class",this._names.join(" ")))},remove:function(t){var n=this._names.indexOf(t);n>=0&&(this._names.splice(n,1),this._node.setAttribute("class",this._names.join(" ")))},contains:function(t){return this._names.indexOf(t)>=0}},n.a=function(t,n){var e=r(t+"");if(arguments.length<2){for(var o=i(this.node()),u=-1,a=e.length;++u<a;)if(!o.contains(e[u]))return!1;return!0}return this.each(("function"==typeof n?f:n?c:s)(e,n))}},function(t,n,e){"use strict";function r(){this.textContent=""}function i(t){return function(){this.textContent=t}}function o(t){return function(){var n=t.apply(this,arguments);this.textContent=null==n?"":n}}n.a=function(t){return arguments.length?this.each(null==t?r:("function"==typeof t?o:i)(t)):this.node().textContent}},function(t,n,e){"use strict";function r(){this.innerHTML=""}function i(t){return function(){this.innerHTML=t}}function o(t){return function(){var n=t.apply(this,arguments);this.innerHTML=null==n?"":n}}n.a=function(t){return arguments.length?this.each(null==t?r:("function"==typeof t?o:i)(t)):this.node().innerHTML}},function(t,n,e){"use strict";function r(){this.nextSibling&&this.parentNode.appendChild(this)}n.a=function(){return this.each(r)}},function(t,n,e){"use strict";function r(){this.previousSibling&&this.parentNode.insertBefore(this,this.parentNode.firstChild)}n.a=function(){return this.each(r)}},function(t,n,e){"use strict";var r=e(42);n.a=function(t){var n="function"==typeof t?t:Object(r.a)(t);return this.select((function(){return this.appendChild(n.apply(this,arguments))}))}},function(t,n,e){"use strict";var r=e(42),i=e(54);function o(){return null}n.a=function(t,n){var e="function"==typeof t?t:Object(r.a)(t),u=null==n?o:"function"==typeof n?n:Object(i.a)(n);return this.select((function(){return this.insertBefore(e.apply(this,arguments),u.apply(this,arguments)||null)}))}},function(t,n,e){"use strict";function r(){var t=this.parentNode;t&&t.removeChild(this)}n.a=function(){return this.each(r)}},function(t,n,e){"use strict";function r(){var t=this.cloneNode(!1),n=this.parentNode;return n?n.insertBefore(t,this.nextSibling):t}function i(){var t=this.cloneNode(!0),n=this.parentNode;return n?n.insertBefore(t,this.nextSibling):t}n.a=function(t){return this.select(t?i:r)}},function(t,n,e){"use strict";n.a=function(t){return arguments.length?this.property("__data__",t):this.node().__data__}},function(t,n,e){"use strict";var r=e(61);function i(t,n,e){var i=Object(r.a)(t),o=i.CustomEvent;"function"==typeof o?o=new o(n,e):(o=i.document.createEvent("Event"),e?(o.initEvent(n,e.bubbles,e.cancelable),o.detail=e.detail):o.initEvent(n,!1,!1)),t.dispatchEvent(o)}function o(t,n){return function(){return i(this,t,n)}}function u(t,n){return function(){return i(this,t,n.apply(this,arguments))}}n.a=function(t,n){return this.each(("function"==typeof n?u:o)(t,n))}},function(t,n,e){"use strict";var r=e(294),i=e(39),o=e(3),u=e(45),a=e(112);function c(t){return function(){this.style.removeProperty(t)}}n.a=function(t,n,e){var s="transform"==(t+="")?r.a:a.a;return null==n?this.styleTween(t,function(t,n){var e,r,o;return function(){var u=Object(i.b)(this,t),a=(this.style.removeProperty(t),Object(i.b)(this,t));return u===a?null:u===e&&a===r?o:o=n(e=u,r=a)}}(t,s)).on("end.style."+t,c(t)):"function"==typeof n?this.styleTween(t,function(t,n,e){var r,o,u;return function(){var a=Object(i.b)(this,t),c=e(this),s=c+"";return null==c&&(this.style.removeProperty(t),s=c=Object(i.b)(this,t)),a===s?null:a===r&&s===o?u:(o=s,u=n(r=a,c))}}(t,s,Object(u.b)(this,"style."+t,n))).each(function(t,n){var e,r,i,u,a="style."+n,s="end."+a;return function(){var f=Object(o.h)(this,t),l=f.on,h=null==f.value[a]?u||(u=c(n)):void 0;l===e&&i===h||(r=(e=l).copy()).on(s,i=h),f.on=r}}(this._id,t)):this.styleTween(t,function(t,n,e){var r,o,u=e+"";return function(){var a=Object(i.b)(this,t);return a===u?null:a===r?o:o=n(r=a,e)}}(t,s,n),e).on("end.style."+t,null)}},function(t,n,e){"use strict";function r(t,n,e){return function(r){this.style.setProperty(t,n.call(this,r),e)}}function i(t,n,e){var i,o;function u(){var u=n.apply(this,arguments);return u!==o&&(i=(o=u)&&r(t,u,e)),i}return u._value=n,u}n.a=function(t,n,e){var r="style."+(t+="");if(arguments.length<2)return(r=this.tween(r))&&r._value;if(null==n)return this.tween(r,null);if("function"!=typeof n)throw new Error;return this.tween(r,i(t,n,null==e?"":e))}},function(t,n,e){"use strict";var r=e(45);n.a=function(t){return this.tween("text","function"==typeof t?function(t){return function(){var n=t(this);this.textContent=null==n?"":n}}(Object(r.b)(this,"text",t)):function(t){return function(){this.textContent=t}}(null==t?"":t+""))}},function(t,n,e){"use strict";function r(t){return function(n){this.textContent=t.call(this,n)}}function i(t){var n,e;function i(){var i=t.apply(this,arguments);return i!==e&&(n=(e=i)&&r(i)),n}return i._value=t,i}n.a=function(t){var n="text";if(arguments.length<1)return(n=this.tween(n))&&n._value;if(null==t)return this.tween(n,null);if("function"!=typeof t)throw new Error;return this.tween(n,i(t))}},function(t,n,e){"use strict";var r=e(14),i=e(3);n.a=function(){for(var t=this._name,n=this._id,e=Object(r.b)(),o=this._groups,u=o.length,a=0;a<u;++a)for(var c,s=o[a],f=s.length,l=0;l<f;++l)if(c=s[l]){var h=Object(i.f)(c,n);Object(i.e)(c,t,e,l,s,{time:h.time+h.delay+h.duration,delay:0,duration:h.duration,ease:h.ease})}return new r.a(o,this._parents,t,e)}},function(t,n,e){"use strict";var r=e(3);n.a=function(){var t,n,e=this,i=e._id,o=e.size();return new Promise((function(u,a){var c={value:a},s={value:function(){0==--o&&u()}};e.each((function(){var e=Object(r.h)(this,i),o=e.on;o!==t&&((n=(t=o).copy())._.cancel.push(c),n._.interrupt.push(c),n._.end.push(s)),e.on=n}))}))}},function(t,n,e){"use strict";n.a=function(t,n,e){this.target=t,this.type=n,this.selection=e}},function(t,n,e){"use strict";n.a=function(t,n){var e=new Date;return t=+t,n=+n,function(r){return e.setTime(t*(1-r)+n*r),e}}},function(t,n,e){"use strict";e.d(n,"a",(function(){return i}));var r=e(67);e(68);function i(t,n){var e,i=n?n.length:0,o=t?Math.min(i,t.length):0,u=new Array(o),a=new Array(i);for(e=0;e<o;++e)u[e]=Object(r.a)(t[e],n[e]);for(;e<i;++e)a[e]=n[e];return function(t){for(e=0;e<o;++e)a[e]=u[e](t);return a}}},function(t,n,e){"use strict";var r=e(67);function i(t){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}n.a=function(t,n){var e,o={},u={};for(e in null!==t&&"object"===i(t)||(t={}),null!==n&&"object"===i(n)||(n={}),n)e in t?o[e]=Object(r.a)(t[e],n[e]):u[e]=n[e];return function(t){for(e in o)u[e]=o[e](t);return u}}},function(t,n,e){"use strict";e.d(n,"a",(function(){return r}));var r=Array.prototype.slice},function(t,n,e){"use strict";n.a=function(t,n){return t-n}},function(t,n,e){"use strict";n.a=function(t){for(var n=0,e=t.length,r=t[e-1][1]*t[0][0]-t[e-1][0]*t[0][1];++n<e;)r+=t[n-1][1]*t[n][0]-t[n-1][0]*t[n][1];return r}},function(t,n,e){"use strict";function r(t,n){for(var e=n[0],r=n[1],o=-1,u=0,a=t.length,c=a-1;u<a;c=u++){var s=t[u],f=s[0],l=s[1],h=t[c],d=h[0],v=h[1];if(i(s,h,n))return 0;l>r!=v>r&&e<(d-f)*(r-l)/(v-l)+f&&(o=-o)}return o}function i(t,n,e){var r,i,o,u;return function(t,n,e){return(n[0]-t[0])*(e[1]-t[1])==(e[0]-t[0])*(n[1]-t[1])}(t,n,e)&&(i=t[r=+(t[0]===n[0])],o=e[r],u=n[r],i<=o&&o<=u||u<=o&&o<=i)}n.a=function(t,n){for(var e,i=-1,o=n.length;++i<o;)if(e=r(t,n[i]))return e;return 0}},function(t,n,e){"use strict";n.a=function(){}},function(t,n,e){"use strict";n.a=function(t,n){if(isNaN(t=+t)||isNaN(n=+n))return this;var e=this._x0,r=this._y0,i=this._x1,o=this._y1;if(isNaN(e))i=(e=Math.floor(t))+1,o=(r=Math.floor(n))+1;else{for(var u,a,c=i-e,s=this._root;e>t||t>=i||r>n||n>=o;)switch(a=(n<r)<<1|t<e,(u=new Array(4))[a]=s,s=u,c*=2,a){case 0:i=e+c,o=r+c;break;case 1:e=i-c,o=r+c;break;case 2:i=e+c,r=o-c;break;case 3:e=i-c,r=o-c}this._root&&this._root.length&&(this._root=s)}return this._x0=e,this._y0=r,this._x1=i,this._y1=o,this}},function(t,n,e){"use strict";n.a=function(){var t=[];return this.visit((function(n){if(!n.length)do{t.push(n.data)}while(n=n.next)})),t}},function(t,n,e){"use strict";n.a=function(t){return arguments.length?this.cover(+t[0][0],+t[0][1]).cover(+t[1][0],+t[1][1]):isNaN(this._x0)?void 0:[[this._x0,this._y0],[this._x1,this._y1]]}},function(t,n,e){"use strict";var r=e(16);n.a=function(t,n,e){var i,o,u,a,c,s,f,l=this._x0,h=this._y0,d=this._x1,v=this._y1,p=[],g=this._root;for(g&&p.push(new r.a(g,l,h,d,v)),null==e?e=1/0:(l=t-e,h=n-e,d=t+e,v=n+e,e*=e);s=p.pop();)if(!(!(g=s.node)||(o=s.x0)>d||(u=s.y0)>v||(a=s.x1)<l||(c=s.y1)<h))if(g.length){var y=(o+a)/2,b=(u+c)/2;p.push(new r.a(g[3],y,b,a,c),new r.a(g[2],o,b,y,c),new r.a(g[1],y,u,a,b),new r.a(g[0],o,u,y,b)),(f=(n>=b)<<1|t>=y)&&(s=p[p.length-1],p[p.length-1]=p[p.length-1-f],p[p.length-1-f]=s)}else{var m=t-+this._x.call(null,g.data),_=n-+this._y.call(null,g.data),w=m*m+_*_;if(w<e){var x=Math.sqrt(e=w);l=t-x,h=n-x,d=t+x,v=n+x,i=g.data}}return i}},function(t,n,e){"use strict";n.a=function(){return this._root}},function(t,n,e){"use strict";n.a=function(){var t=0;return this.visit((function(n){if(!n.length)do{++t}while(n=n.next)})),t}},function(t,n,e){"use strict";var r=e(16);n.a=function(t){var n,e,i,o,u,a,c=[],s=this._root;for(s&&c.push(new r.a(s,this._x0,this._y0,this._x1,this._y1));n=c.pop();)if(!t(s=n.node,i=n.x0,o=n.y0,u=n.x1,a=n.y1)&&s.length){var f=(i+u)/2,l=(o+a)/2;(e=s[3])&&c.push(new r.a(e,f,l,u,a)),(e=s[2])&&c.push(new r.a(e,i,l,f,a)),(e=s[1])&&c.push(new r.a(e,f,o,u,l)),(e=s[0])&&c.push(new r.a(e,i,o,f,l))}return this}},function(t,n,e){"use strict";var r=e(16);n.a=function(t){var n,e=[],i=[];for(this._root&&e.push(new r.a(this._root,this._x0,this._y0,this._x1,this._y1));n=e.pop();){var o=n.node;if(o.length){var u,a=n.x0,c=n.y0,s=n.x1,f=n.y1,l=(a+s)/2,h=(c+f)/2;(u=o[0])&&e.push(new r.a(u,a,c,l,h)),(u=o[1])&&e.push(new r.a(u,l,c,s,h)),(u=o[2])&&e.push(new r.a(u,a,h,l,f)),(u=o[3])&&e.push(new r.a(u,l,h,s,f))}i.push(n)}for(;n=i.pop();)t(n.node,n.x0,n.y0,n.x1,n.y1);return this}},function(t,n,e){"use strict";n.a=function(t){return function(){return t}}},function(t,n,e){"use strict";var r=e(31),i=e(282),o=e(283),u=e(121),a=e(284),c=e(138),s=e(116),f=e(137),l=Array.prototype.map,h=["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];n.a=function(t){var n=void 0===t.grouping||void 0===t.thousands?f.a:Object(i.a)(l.call(t.grouping,Number),t.thousands+""),e=void 0===t.currency?"":t.currency[0]+"",d=void 0===t.currency?"":t.currency[1]+"",v=void 0===t.decimal?".":t.decimal+"",p=void 0===t.numerals?f.a:Object(o.a)(l.call(t.numerals,String)),g=void 0===t.percent?"%":t.percent+"",y=void 0===t.minus?"-":t.minus+"",b=void 0===t.nan?"NaN":t.nan+"";function m(t){var r=(t=Object(u.a)(t)).fill,i=t.align,o=t.sign,f=t.symbol,l=t.zero,m=t.width,_=t.comma,w=t.precision,x=t.trim,M=t.type;"n"===M?(_=!0,M="g"):c.a[M]||(void 0===w&&(w=12),x=!0,M="g"),(l||"0"===r&&"="===i)&&(l=!0,r="0",i="=");var j="$"===f?e:"#"===f&&/[boxX]/.test(M)?"0"+M.toLowerCase():"",k="$"===f?d:/[%p]/.test(M)?g:"",O=c.a[M],S=/[defgprs%]/.test(M);function C(t){var e,u,c,f=j,d=k;if("c"===M)d=O(t)+d,t="";else{var g=(t=+t)<0||1/t<0;if(t=isNaN(t)?b:O(Math.abs(t),w),x&&(t=Object(a.a)(t)),g&&0==+t&&"+"!==o&&(g=!1),f=(g?"("===o?o:y:"-"===o||"("===o?"":o)+f,d=("s"===M?h[8+s.b/3]:"")+d+(g&&"("===o?")":""),S)for(e=-1,u=t.length;++e<u;)if(48>(c=t.charCodeAt(e))||c>57){d=(46===c?v+t.slice(e+1):t.slice(e))+d,t=t.slice(0,e);break}}_&&!l&&(t=n(t,1/0));var C=f.length+t.length+d.length,A=C<m?new Array(m-C+1).join(r):"";switch(_&&l&&(t=n(A+t,A.length?m-d.length:1/0),A=""),i){case"<":t=f+t+d+A;break;case"=":t=f+A+t+d;break;case"^":t=A.slice(0,C=A.length>>1)+f+t+d+A.slice(C);break;default:t=A+f+t+d}return p(t)}return w=void 0===w?6:/[gprs]/.test(M)?Math.max(1,Math.min(21,w)):Math.max(0,Math.min(20,w)),C.toString=function(){return t+""},C}return{format:m,formatPrefix:function(t,n){var e=m(((t=Object(u.a)(t)).type="f",t)),i=3*Math.max(-8,Math.min(8,Math.floor(Object(r.a)(n)/3))),o=Math.pow(10,-i),a=h[8+i/3];return function(t){return e(o*t)+a}}}}},function(t,n,e){"use strict";n.a=function(t,n){return function(e,r){for(var i=e.length,o=[],u=0,a=t[0],c=0;i>0&&a>0&&(c+a+1>r&&(a=Math.max(1,r-c)),o.push(e.substring(i-=a,i+a)),!((c+=a+1)>r));)a=t[u=(u+1)%t.length];return o.reverse().join(n)}}},function(t,n,e){"use strict";n.a=function(t){return function(n){return n.replace(/[0-9]/g,(function(n){return t[+n]}))}}},function(t,n,e){"use strict";n.a=function(t){t:for(var n,e=t.length,r=1,i=-1;r<e;++r)switch(t[r]){case".":i=n=r;break;case"0":0===i&&(i=r),n=r;break;default:if(!+t[r])break t;i>0&&(i=0)}return i>0?t.slice(0,i)+t.slice(n+1):t}},function(t,n,e){"use strict";e.d(n,"a",(function(){return h}));var r=e(34),i=e(147),o=e(33),u=e(146),a=e(74),c=e(75);function s(t){if(0<=t.y&&t.y<100){var n=new Date(-1,t.m,t.d,t.H,t.M,t.S,t.L);return n.setFullYear(t.y),n}return new Date(t.y,t.m,t.d,t.H,t.M,t.S,t.L)}function f(t){if(0<=t.y&&t.y<100){var n=new Date(Date.UTC(-1,t.m,t.d,t.H,t.M,t.S,t.L));return n.setUTCFullYear(t.y),n}return new Date(Date.UTC(t.y,t.m,t.d,t.H,t.M,t.S,t.L))}function l(t,n,e){return{y:t,m:n,d:e,H:0,M:0,S:0,L:0}}function h(t){var n=t.dateTime,e=t.date,a=t.time,c=t.periods,h=t.days,v=t.shortDays,p=t.months,g=t.shortMonths,y=m(c),b=_(c),J=m(h),bt=_(h),Tt=m(v),It=_(v),Nt=m(p),Pt=_(p),Et=m(g),Lt=_(g),Ft={a:function(t){return v[t.getDay()]},A:function(t){return h[t.getDay()]},b:function(t){return g[t.getMonth()]},B:function(t){return p[t.getMonth()]},c:null,d:q,e:q,f:W,g:rt,G:ot,H:B,I:H,j:$,L:V,m:Z,M:Y,p:function(t){return c[+(t.getHours()>=12)]},q:function(t){return 1+~~(t.getMonth()/3)},Q:Ct,s:At,S:X,u:G,U:Q,V:K,w:tt,W:nt,x:null,X:null,y:et,Y:it,Z:ut,"%":St},Dt={a:function(t){return v[t.getUTCDay()]},A:function(t){return h[t.getUTCDay()]},b:function(t){return g[t.getUTCMonth()]},B:function(t){return p[t.getUTCMonth()]},c:null,d:at,e:at,f:ht,g:Mt,G:kt,H:ct,I:st,j:ft,L:lt,m:dt,M:vt,p:function(t){return c[+(t.getUTCHours()>=12)]},q:function(t){return 1+~~(t.getUTCMonth()/3)},Q:Ct,s:At,S:pt,u:gt,U:yt,V:mt,w:_t,W:wt,x:null,X:null,y:xt,Y:jt,Z:Ot,"%":St},Rt={a:function(t,n,e){var r=Tt.exec(n.slice(e));return r?(t.w=It[r[0].toLowerCase()],e+r[0].length):-1},A:function(t,n,e){var r=J.exec(n.slice(e));return r?(t.w=bt[r[0].toLowerCase()],e+r[0].length):-1},b:function(t,n,e){var r=Et.exec(n.slice(e));return r?(t.m=Lt[r[0].toLowerCase()],e+r[0].length):-1},B:function(t,n,e){var r=Nt.exec(n.slice(e));return r?(t.m=Pt[r[0].toLowerCase()],e+r[0].length):-1},c:function(t,e,r){return qt(t,n,e,r)},d:I,e:I,f:D,g:S,G:O,H:P,I:P,j:N,L:F,m:T,M:E,p:function(t,n,e){var r=y.exec(n.slice(e));return r?(t.p=b[r[0].toLowerCase()],e+r[0].length):-1},q:A,Q:U,s:z,S:L,u:x,U:M,V:j,w:w,W:k,x:function(t,n,r){return qt(t,e,n,r)},X:function(t,n,e){return qt(t,a,n,e)},y:S,Y:O,Z:C,"%":R};function Ut(t,n){return function(e){var r,i,o,u=[],a=-1,c=0,s=t.length;for(e instanceof Date||(e=new Date(+e));++a<s;)37===t.charCodeAt(a)&&(u.push(t.slice(c,a)),null!=(i=d[r=t.charAt(++a)])?r=t.charAt(++a):i="e"===r?" ":"0",(o=n[r])&&(r=o(e,i)),u.push(r),c=a+1);return u.push(t.slice(c,a)),u.join("")}}function zt(t,n){return function(e){var a,c,h=l(1900,void 0,1);if(qt(h,t,e+="",0)!=e.length)return null;if("Q"in h)return new Date(h.Q);if("s"in h)return new Date(1e3*h.s+("L"in h?h.L:0));if(n&&!("Z"in h)&&(h.Z=0),"p"in h&&(h.H=h.H%12+12*h.p),void 0===h.m&&(h.m="q"in h?h.q:0),"V"in h){if(h.V<1||h.V>53)return null;"w"in h||(h.w=1),"Z"in h?(c=(a=f(l(h.y,0,1))).getUTCDay(),a=c>4||0===c?r.a.ceil(a):Object(r.a)(a),a=i.a.offset(a,7*(h.V-1)),h.y=a.getUTCFullYear(),h.m=a.getUTCMonth(),h.d=a.getUTCDate()+(h.w+6)%7):(c=(a=s(l(h.y,0,1))).getDay(),a=c>4||0===c?o.a.ceil(a):Object(o.a)(a),a=u.a.offset(a,7*(h.V-1)),h.y=a.getFullYear(),h.m=a.getMonth(),h.d=a.getDate()+(h.w+6)%7)}else("W"in h||"U"in h)&&("w"in h||(h.w="u"in h?h.u%7:"W"in h?1:0),c="Z"in h?f(l(h.y,0,1)).getUTCDay():s(l(h.y,0,1)).getDay(),h.m=0,h.d="W"in h?(h.w+6)%7+7*h.W-(c+5)%7:h.w+7*h.U-(c+6)%7);return"Z"in h?(h.H+=h.Z/100|0,h.M+=h.Z%100,f(h)):s(h)}}function qt(t,n,e,r){for(var i,o,u=0,a=n.length,c=e.length;u<a;){if(r>=c)return-1;if(37===(i=n.charCodeAt(u++))){if(i=n.charAt(u++),!(o=Rt[i in d?n.charAt(u++):i])||(r=o(t,e,r))<0)return-1}else if(i!=e.charCodeAt(r++))return-1}return r}return Ft.x=Ut(e,Ft),Ft.X=Ut(a,Ft),Ft.c=Ut(n,Ft),Dt.x=Ut(e,Dt),Dt.X=Ut(a,Dt),Dt.c=Ut(n,Dt),{format:function(t){var n=Ut(t+="",Ft);return n.toString=function(){return t},n},parse:function(t){var n=zt(t+="",!1);return n.toString=function(){return t},n},utcFormat:function(t){var n=Ut(t+="",Dt);return n.toString=function(){return t},n},utcParse:function(t){var n=zt(t+="",!0);return n.toString=function(){return t},n}}}var d={"-":"",_:" ",0:"0"},v=/^\s*\d+/,p=/^%/,g=/[\\^$*+?|[\]().{}]/g;function y(t,n,e){var r=t<0?"-":"",i=(r?-t:t)+"",o=i.length;return r+(o<e?new Array(e-o+1).join(n)+i:i)}function b(t){return t.replace(g,"\\$&")}function m(t){return new RegExp("^(?:"+t.map(b).join("|")+")","i")}function _(t){for(var n={},e=-1,r=t.length;++e<r;)n[t[e].toLowerCase()]=e;return n}function w(t,n,e){var r=v.exec(n.slice(e,e+1));return r?(t.w=+r[0],e+r[0].length):-1}function x(t,n,e){var r=v.exec(n.slice(e,e+1));return r?(t.u=+r[0],e+r[0].length):-1}function M(t,n,e){var r=v.exec(n.slice(e,e+2));return r?(t.U=+r[0],e+r[0].length):-1}function j(t,n,e){var r=v.exec(n.slice(e,e+2));return r?(t.V=+r[0],e+r[0].length):-1}function k(t,n,e){var r=v.exec(n.slice(e,e+2));return r?(t.W=+r[0],e+r[0].length):-1}function O(t,n,e){var r=v.exec(n.slice(e,e+4));return r?(t.y=+r[0],e+r[0].length):-1}function S(t,n,e){var r=v.exec(n.slice(e,e+2));return r?(t.y=+r[0]+(+r[0]>68?1900:2e3),e+r[0].length):-1}function C(t,n,e){var r=/^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(n.slice(e,e+6));return r?(t.Z=r[1]?0:-(r[2]+(r[3]||"00")),e+r[0].length):-1}function A(t,n,e){var r=v.exec(n.slice(e,e+1));return r?(t.q=3*r[0]-3,e+r[0].length):-1}function T(t,n,e){var r=v.exec(n.slice(e,e+2));return r?(t.m=r[0]-1,e+r[0].length):-1}function I(t,n,e){var r=v.exec(n.slice(e,e+2));return r?(t.d=+r[0],e+r[0].length):-1}function N(t,n,e){var r=v.exec(n.slice(e,e+3));return r?(t.m=0,t.d=+r[0],e+r[0].length):-1}function P(t,n,e){var r=v.exec(n.slice(e,e+2));return r?(t.H=+r[0],e+r[0].length):-1}function E(t,n,e){var r=v.exec(n.slice(e,e+2));return r?(t.M=+r[0],e+r[0].length):-1}function L(t,n,e){var r=v.exec(n.slice(e,e+2));return r?(t.S=+r[0],e+r[0].length):-1}function F(t,n,e){var r=v.exec(n.slice(e,e+3));return r?(t.L=+r[0],e+r[0].length):-1}function D(t,n,e){var r=v.exec(n.slice(e,e+6));return r?(t.L=Math.floor(r[0]/1e3),e+r[0].length):-1}function R(t,n,e){var r=p.exec(n.slice(e,e+1));return r?e+r[0].length:-1}function U(t,n,e){var r=v.exec(n.slice(e));return r?(t.Q=+r[0],e+r[0].length):-1}function z(t,n,e){var r=v.exec(n.slice(e));return r?(t.s=+r[0],e+r[0].length):-1}function q(t,n){return y(t.getDate(),n,2)}function B(t,n){return y(t.getHours(),n,2)}function H(t,n){return y(t.getHours()%12||12,n,2)}function $(t,n){return y(1+u.a.count(Object(a.a)(t),t),n,3)}function V(t,n){return y(t.getMilliseconds(),n,3)}function W(t,n){return V(t,n)+"000"}function Z(t,n){return y(t.getMonth()+1,n,2)}function Y(t,n){return y(t.getMinutes(),n,2)}function X(t,n){return y(t.getSeconds(),n,2)}function G(t){var n=t.getDay();return 0===n?7:n}function Q(t,n){return y(o.b.count(Object(a.a)(t)-1,t),n,2)}function J(t){var n=t.getDay();return n>=4||0===n?Object(o.c)(t):o.c.ceil(t)}function K(t,n){return t=J(t),y(o.c.count(Object(a.a)(t),t)+(4===Object(a.a)(t).getDay()),n,2)}function tt(t){return t.getDay()}function nt(t,n){return y(o.a.count(Object(a.a)(t)-1,t),n,2)}function et(t,n){return y(t.getFullYear()%100,n,2)}function rt(t,n){return y((t=J(t)).getFullYear()%100,n,2)}function it(t,n){return y(t.getFullYear()%1e4,n,4)}function ot(t,n){var e=t.getDay();return y((t=e>=4||0===e?Object(o.c)(t):o.c.ceil(t)).getFullYear()%1e4,n,4)}function ut(t){var n=t.getTimezoneOffset();return(n>0?"-":(n*=-1,"+"))+y(n/60|0,"0",2)+y(n%60,"0",2)}function at(t,n){return y(t.getUTCDate(),n,2)}function ct(t,n){return y(t.getUTCHours(),n,2)}function st(t,n){return y(t.getUTCHours()%12||12,n,2)}function ft(t,n){return y(1+i.a.count(Object(c.a)(t),t),n,3)}function lt(t,n){return y(t.getUTCMilliseconds(),n,3)}function ht(t,n){return lt(t,n)+"000"}function dt(t,n){return y(t.getUTCMonth()+1,n,2)}function vt(t,n){return y(t.getUTCMinutes(),n,2)}function pt(t,n){return y(t.getUTCSeconds(),n,2)}function gt(t){var n=t.getUTCDay();return 0===n?7:n}function yt(t,n){return y(r.b.count(Object(c.a)(t)-1,t),n,2)}function bt(t){var n=t.getUTCDay();return n>=4||0===n?Object(r.c)(t):r.c.ceil(t)}function mt(t,n){return t=bt(t),y(r.c.count(Object(c.a)(t),t)+(4===Object(c.a)(t).getUTCDay()),n,2)}function _t(t){return t.getUTCDay()}function wt(t,n){return y(r.a.count(Object(c.a)(t)-1,t),n,2)}function xt(t,n){return y(t.getUTCFullYear()%100,n,2)}function Mt(t,n){return y((t=bt(t)).getUTCFullYear()%100,n,2)}function jt(t,n){return y(t.getUTCFullYear()%1e4,n,4)}function kt(t,n){var e=t.getUTCDay();return y((t=e>=4||0===e?Object(r.c)(t):r.c.ceil(t)).getUTCFullYear()%1e4,n,4)}function Ot(){return"+0000"}function St(){return"%"}function Ct(t){return+t}function At(t){return Math.floor(+t/1e3)}},function(t,n,e){"use strict";function r(t,n,e){this.target=t,this.type=n,this.transform=e}e.d(n,"a",(function(){return r}))},function(t,n,e){"use strict";var r=e(126);e.d(n,"a",(function(){return r.a}));e(44)},function(t,n,e){"use strict";var r=e(206);e.d(n,"a",(function(){return r.a}));var i=e(23);i.a,i.b,i.c,i.d,i.e,i.f,i.g,i.h,i.i,i.j,i.k,i.l,i.m},function(t,n,e){"use strict";var r;e.d(n,"a",(function(){return r})),function(t){t[t.Diamond="Diamond"]="Diamond"}(r||(r={}))},function(t,n,e){"use strict";function r(t,n){var e="",r=Math.sqrt(3),i=Math.tan(30*Math.PI/180);switch(n){case"circle":var o=Math.sqrt(t/Math.PI);e="M0,"+o+"A"+o+","+o+" 0 1,1 0,"+-o+"A"+o+","+o+" 0 1,1 0,"+o+"Z";break;case"cross":var u=Math.sqrt(t/5)/2;e="M"+-3*u+","+-u+"H"+-u+"V"+-3*u+"H"+u+"V"+-u+"H"+3*u+"V"+u+"H"+u+"V"+3*u+"H"+-u+"V"+u+"H"+-3*u+"Z";break;case"diamond":var a=Math.sqrt(t/(2*i)),c=a*i;e="M0,"+-a+"L"+c+",0 0,"+a+" "+-c+",0Z";break;case"square":var s=Math.sqrt(t)/2;e="M"+-s+","+-s+"L"+s+","+-s+" "+s+","+s+" "+-s+","+s+"Z";break;case"triangle-down":var f=Math.sqrt(t/r),l=f*r/2;e="M0,"+l+"L"+f+","+-l+" "+-f+","+-l+"Z";break;case"triangle-up":var h=Math.sqrt(t/r),d=h*r/2;e="M0,"+-d+"L"+h+","+d+" "+-h+","+d+"Z";break;case"triangle-left":var v=Math.sqrt(t/r);e="M"+-v+", 0L"+1*v/2+","+v*r/2+" "+1*v/2+","+v*r/2*-1+"Z";break;case"triangle-right":var p=Math.sqrt(t/r);e="M"+p+", 0L"+-.5*p+","+p*r/2+" "+-.5*p+","+p*r/2*-1+"Z";break;case"pentagon":var g=Math.sqrt(t/r);e="M0, "+-g+"L";for(var y=1;y<5;y++)e+=" "+g*Math.cos(Math.PI/2+2*Math.PI/5*y)+","+-g*Math.sin(Math.PI/2+2*Math.PI/5*y);e+="Z";break;case"hexagon":var b=Math.sqrt(t/r);e="M"+b+", 0 L";for(var m=1;m<6;m++)e+=" "+b*Math.cos(2*Math.PI/6*m)+","+-b*Math.sin(2*Math.PI/6*m);e+="Z";break;case"heart":var _=Math.sqrt(t/Math.PI/2);e="M"+-_+", "+-_+" A"+_+" "+1.7*_+" -50 1 0 "+-_+" "+2*_+"A"+_+" "+1.7*_+" 50 1 0 "+-_+" "+-_+"Z";break;case"one-way-up":var w=Math.sqrt(t);e="M"+-w/2+", "+w/2+"L "+-w/2+", "+-w/2+" 0, "+-w+" "+w/2+", "+-w/2+" "+w/2+", "+w/2+"Z";break;case"one-way-down":var x=Math.sqrt(t);e="M"+-x/2+", 0L "+-x/2+", "+-x+" "+x/2+", "+-x+" "+x/2+", 0 0, "+x/2+"Z";break;case"one-way-left":var M=Math.sqrt(t);e="M"+-M+", 0L "+-M/2+", "+-M/2+" "+M/2+", "+-M/2+" "+M/2+", "+M/2+" "+-M/2+", "+M/2+"Z";break;case"one-way-right":var j=Math.sqrt(t);e="M"+j/2+", 0L 0, "+-j/2+" "+-j+", "+-j/2+" "+-j+", "+j/2+" 0, "+j/2+"Z";break;case"chevron-up":var k=Math.sqrt(t);e="M"+-k/2+", "+k/2+"L "+-k/2+", "+-k/2+" 0, "+-k+" "+k/2+", "+-k/2+" "+k/2+", "+k/2+" 0, 0Z";break;case"chevron-down":var O=Math.sqrt(t);e="M"+-O/2+", 0L "+-O/2+", "+-O+" 0, "+-O/2+" "+O/2+", "+-O+" "+O/2+", 0 0, "+O/2+"Z";break;case"chevron-left":var S=Math.sqrt(t);e="M"+-S+", 0L "+-S/2+", "+-S/2+" "+S/2+", "+-S/2+" 0, 0 "+S/2+", "+S/2+" "+-S/2+", "+S/2+"Z";break;case"chevron-right":var C=Math.sqrt(t);e="M"+C/2+", 0L 0, "+-C/2+" "+-C+", "+-C/2+" "+-C/2+", 0 "+-C+", "+C/2+" 0, "+C/2+"Z";break;case"arrow-up":var A=Math.sqrt(t*Math.PI);e="M0, "+-A/2+"L "+A/2+", 0 "+A/6+", 0 "+A/6+", "+A/2+" "+-A/6+", "+A/2+" "+-A/6+", 0 "+-A/2+", 0Z";break;case"arrow-down":var T=Math.sqrt(t*Math.PI);e="M0, "+T/2+"L "+T/2+", 0 "+T/6+", 0 "+T/6+", "+-T/2+" "+-T/6+", "+-T/2+" "+-T/6+", 0 "+-T/2+", 0Z";break;case"arrow-left":var I=Math.sqrt(t*Math.PI);e="M"+-I/2+",0L 0,"+-I/2+" 0,"+-I/6+" "+I/2+","+-I/6+" "+I/2+","+I/6+" 0,"+I/6+" 0,"+I/2+"Z";break;case"arrow-right":var N=Math.sqrt(t*Math.PI);e="M"+N/2+",0L 0,"+-N/2+" 0,"+-N/6+" "+-N/2+","+-N/6+" "+-N/2+","+N/6+" 0,"+N/6+" 0,"+N/2+"Z";break;case"triangle-in-circle":var P=Math.sqrt(t/r),E=P*r/2;e="M0,"+-E+"L"+P+","+E+" "+-P+","+E+"Z";break;case"downward-triangle-in-circle":var L=Math.sqrt(t/r),F=L*r/2,D=2*L*Math.sqrt(3)/6;e="M0,"+(F+D)+"L"+L+","+(-F+D)+" "+-L+","+(-F+D)+"Z";break;case"left-triangle-in-circle":var R=Math.sqrt(t/r),U=R*r/2,z=Math.sqrt(t/r)*r/3*2;e="M"+-z+","+(2*U-U-2*R*r/6)+"L"+z/2+","+(z*r/2+(2*U-U-2*R*r/6))+" "+z/2+","+(-z*r/2+(2*U-U-2*R*r/6))+"Z";break;case"right-triangle-in-circle":var q=Math.sqrt(t/r),B=q*r/2,H=Math.sqrt(t/r)*r/3*2;e="M"+H+","+(2*B-B-2*q*r/6)+"L"+-H/2+","+(H*r/2+(2*B-B-2*q*r/6))+" "+-H/2+","+(-H*r/2+(2*B-B-2*q*r/6))+"Z";break;case"up-arrow-in-circle":var $=Math.sqrt(t*Math.PI);e="M0, "+-$/2+"L "+$/2+", 0 "+$/6+", 0 "+$/6+", "+$/2+" "+-$/6+", "+$/2+" "+-$/6+", 0 "+-$/2+", 0Z";break;case"down-arrow-in-circle":var V=Math.sqrt(t*Math.PI);e="M0, "+V/2+"L "+V/2+", 0 "+V/6+", 0 "+V/6+", "+-V/2+" "+-V/6+", "+-V/2+" "+-V/6+", 0 "+-V/2+", 0Z";break;case"left-arrow-in-circle":var W=Math.sqrt(t*Math.PI);e="M"+-W/2+",0L 0,"+-W/2+" 0,"+-W/6+" "+W/2+","+-W/6+" "+W/2+","+W/6+" 0,"+W/6+" 0,"+W/2+"Z";break;case"right-arrow-in-circle":var Z=Math.sqrt(t*Math.PI);e="M"+Z/2+",0L 0,"+-Z/2+" 0,"+-Z/6+" "+-Z/2+","+-Z/6+" "+-Z/2+","+Z/6+" 0,"+Z/6+" 0,"+Z/2+"Z";break;case"star":for(var Y=Math.sqrt(t*Math.PI/3),X="M 0,"+-Y+" L ",G=0,Q=[2,4,1,3];G<Q.length;G++){var J=Q[G],K=Math.PI/2+2*Math.PI/5*J;X+=" "+Y*Math.cos(K)+", "+-Y*Math.sin(K)}return X+="Z";case"cross-x":var tt=Math.sqrt(t/5)/2;e="M"+-3*tt+","+-tt+"H"+-tt+"V"+-3*tt+"H"+tt+"V"+-tt+"H"+3*tt+"V"+tt+"H"+tt+"V"+3*tt+"H"+-tt+"V"+tt+"H"+-3*tt+"Z";break;case"crown":var nt=Math.sqrt(t*Math.PI);e="M0,"+-nt/2+"L ",e+=" "+nt/4+", 0",e+=" "+3*nt/4+", "+-nt/2,e+=" "+nt/2+", "+nt/2,e+=" "+-nt/2+", "+nt/2,e+=" "+-3*nt/4+", "+-nt/2,e+=" "+-nt/4+", 0",e+="Z";break;case"pointy-flag":var et=Math.sqrt(t*Math.PI);e="M"+-et/2+","+-et/2+"L ",e+=" "+et/2+","+-et/4,e+=" "+-et/2+",0",e+="Z",e+=" M"+-et/2+","+-et/2+"L ",e+=" "+-et/2+","+et/2;break;case"flag":var rt=Math.sqrt(t*Math.PI);e="M"+-rt/2+","+rt/2+"L ",e+=" "+-rt/2+","+-rt/2,e+=" Q"+-3*rt/10+","+(-rt/2-rt/10),e+=" "+rt/10+","+-rt/2,e+="L "+rt/10+",0",e+=" Q"+-3*rt/10+","+-rt/10,e+=" "+-rt/2+",0",e+=" M"+rt/10+","+-rt/2,e+=" Q"+3*rt/10+","+(-rt/2+rt/10),e+=" "+rt/2+","+-rt/2+"L",e+=" "+rt/2+",0",e+=" Q"+3*rt/10+","+rt/10,e+=" "+rt/10+",0";break;case"rewind-arrows":var it=Math.sqrt(t*Math.PI);e="M"+-it/2+", 0 L ",e+=" 0, "+-it/2,e+=" "+it/8+", "+3*-it/8,e+=" "+-it/4+", 0",e+=" "+it/8+", "+3*it/8,e+=" 0, "+it/2,e+="Z",e+=" M"+(-it/2+it/3)+", 0 L ",e+=" "+it/3+", "+-it/2,e+=" "+(it/8+it/3)+", "+3*-it/8,e+=" "+(-it/4+it/3)+", 0",e+=" "+(it/8+it/3)+", "+3*it/8,e+=" "+it/3+", "+it/2,e+="Z";break;case"fast-forward-arrows":var ot=Math.sqrt(t*Math.PI);e="M"+ot/2+", 0 L ",e+=" 0, "+-ot/2,e+=" "+-ot/8+", "+3*-ot/8,e+=" "+ot/4+", 0",e+=" "+-ot/8+", "+3*ot/8,e+=" 0, "+ot/2,e+="Z",e+=" M"+(ot/2-ot/3)+", 0 L ",e+=" "+-ot/3+", "+-ot/2,e+=" "+(-ot/8-ot/3)+", "+3*-ot/8,e+=" "+(ot/4-ot/3)+", 0",e+=" "+(-ot/8-ot/3)+", "+3*ot/8,e+=" "+-ot/3+", "+ot/2,e+="Z";break;case"smiley-face":var ut=Math.sqrt(t/Math.PI);e="M0,"+ut+"A"+ut+","+ut+" 0 1,1 0,"+-ut+"A"+ut+","+ut+" 0 1,1 0,"+ut+"Z M"+-ut/2+","+ut/2+" Q0,"+.8*ut+" "+ut/2+","+ut/2+" Q0,"+.8*ut+" "+-ut/2+","+ut/2;break;case"meh-face":var at=Math.sqrt(t/Math.PI);e="M0,"+at+"A"+at+","+at+" 0 1,1 0,"+-at+"A"+at+","+at+" 0 1,1 0,"+at+"Z M"+-at/2+","+at/2+" L "+at/2+","+at/2;break;case"frown-face":var ct=Math.sqrt(t/Math.PI);e="M0,"+ct+"A"+ct+","+ct+" 0 1,1 0,"+-ct+"A"+ct+","+ct+" 0 1,1 0,"+ct+"Z M"+-ct/2+","+ct/2+" Q0,"+.1*ct+" "+ct/2+","+ct/2+" Q0,"+.1*ct+" "+-ct/2+","+ct/2;break;case"push-pin":var st=Math.sqrt(t*Math.PI);e="M"+-st/10+","+-st/2+" L",e+=" "+st/10+","+-st/2,e+=" "+st/10+","+-st/10,e+=" "+-st/10+","+-st/10,e+="Z",e+="M"+-st/10+","+-st/2,e+=" Q"+(-st/10-st/20)+","+-st/2,e+=" "+(-st/10-st/20)+","+(-st/2-st/20)+" L",e+=" "+(st/10+st/20)+","+(-st/2-st/20),e+=" Q"+(st/10+st/20)+","+-st/2,e+=" "+st/10+","+-st/2,e+="M"+-st/10+","+-st/10,e+=" Q"+-st/4+","+-st/10,e+=" "+-st/4+","+st/20+" L",e+=" "+st/4+","+st/20,e+=" Q"+st/4+","+-st/10,e+=" "+st/10+","+-st/10;break;case"check-mark":var ft=Math.sqrt(t*Math.PI);e="M"+-ft/2+", "+ft/10+" L ",e+=" "+2*-ft/10+", "+ft/2,e+=" "+ft/2+", "+-4*ft/10,e+=" "+4*ft/10+", "+-ft/2,e+=" "+2*-ft/10+", "+3*ft/10,e+=" "+4*-ft/10+", 0",e+="Z";break;case"check-marked-box":var lt=Math.sqrt(1.5*t),ht=.8,dt=lt/4,vt=lt/8;e="M"+lt/2+","+-lt/2+"L",e+=" "+-lt/2+","+-lt/2,e+=" "+-lt/2+","+lt/2,e+=" "+lt/2+","+lt/2,e+=" "+lt/2+",0",e+=" "+lt/2*ht+","+(lt/2-lt/2*ht),e+=" "+lt/2*ht+","+lt/2*ht,e+=" "+-lt/2*ht+","+lt/2*ht,e+=" "+-lt/2*ht+","+-lt/2*ht,e+=" "+lt/2*ht+","+-lt/2*ht,e+="Z",e+="M"+(-lt/2+dt)+", "+(lt/10-vt)+" L",e+=" "+(2*-lt/10+dt)+", "+(lt/2-vt),e+=" "+(lt/2+dt)+", "+(-4*lt/10-vt),e+=" "+(4*lt/10+dt)+", "+(-lt/2-vt),e+=" "+(2*-lt/10+dt)+", "+(3*lt/10-vt),e+=" "+(4*-lt/10+dt)+", "+-vt,e+="Z"}return e}e.d(n,"a",(function(){return r}))},function(t,n,e){"use strict";e.d(n,"a",(function(){return b}));var r=e(50),i=e(292);function o(t){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function u(t){return function(t){if(Array.isArray(t))return s(t)}(t)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||c(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function a(t,n){var e;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(e=c(t))||n&&t&&"number"==typeof t.length){e&&(t=e);var r=0,i=function(){};return{s:i,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,u=!0,a=!1;return{s:function(){e=t[Symbol.iterator]()},n:function(){var t=e.next();return u=t.done,t},e:function(t){a=!0,o=t},f:function(){try{u||null==e.return||e.return()}finally{if(a)throw o}}}}function c(t,n){if(t){if("string"==typeof t)return s(t,n);var e=Object.prototype.toString.call(t).slice(8,-1);return"Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?s(t,n):void 0}}function s(t,n){(null==n||n>t.length)&&(n=t.length);for(var e=0,r=new Array(n);e<n;e++)r[e]=t[e];return r}function f(t,n){for(var e=0;e<n.length;e++){var r=n[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function l(t,n,e){return(l="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(t,n,e){var r=function(t,n){for(;!Object.prototype.hasOwnProperty.call(t,n)&&null!==(t=p(t)););return t}(t,n);if(r){var i=Object.getOwnPropertyDescriptor(r,n);return i.get?i.get.call(e):i.value}})(t,n,e||t)}function h(t,n){return(h=Object.setPrototypeOf||function(t,n){return t.__proto__=n,t})(t,n)}function d(t){var n=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var e,r=p(t);if(n){var i=p(this).constructor;e=Reflect.construct(r,arguments,i)}else e=r.apply(this,arguments);return v(this,e)}}function v(t,n){return!n||"object"!==o(n)&&"function"!=typeof n?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):n}function p(t){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var g=r.a.ArrayExtensions,y=function(t){!function(t,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(n&&n.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),n&&h(t,n)}(o,t);var n,e,r,i=d(o);function o(t){var n;return function(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}(this,o),(n=i.call(this)).selectionManager=t.createSelectionManager(),n.selectionManager.registerOnSelectCallback&&n.selectionManager.registerOnSelectCallback((function(){n.restoreSelection()})),n}return n=o,(e=[{key:"clearSelection",value:function(){this.selectionManager.clear(),l(p(o.prototype),"clearSelection",this).call(this)}},{key:"handleContextMenu",value:function(t,n){this.selectionManager.showContextMenu(t&&t.identity?t.identity:{},n)}},{key:"applySelectionStateToData",value:function(t,n){n&&this.hasSelection()&&this.selectionManager.clear();var e,r=this.selectionManager.getSelectionIds(),i=a(t);try{for(i.s();!(e=i.n()).done;){var o=e.value;o.selected=this.isDataPointSelected(o,r)}}catch(t){i.e(t)}finally{i.f()}return this.hasSelection()}},{key:"restoreSelection",value:function(){this.syncSelectionState(),this.renderAll()}},{key:"hasSelection",value:function(){return this.selectionManager.getSelectionIds().length>0}},{key:"syncSelectionState",value:function(){if(this.isInvertedSelectionMode)return this.syncSelectionStateInverted();if(this.selectableDataPoints||this.selectableLegendDataPoints){var t=this.selectionManager.getSelectionIds();if(this.selectableDataPoints&&this.updateSelectableDataPointsBySelectedIds(this.selectableDataPoints,t),this.selectableLegendDataPoints&&this.updateSelectableDataPointsBySelectedIds(this.selectableLegendDataPoints,t),this.selectableLabelsDataPoints){var n,e=a(this.selectableLabelsDataPoints);try{var r=function(){var e=n.value;e.selected=t.some((function(t){return t.includes(e.identity)}))};for(e.s();!(n=e.n()).done;)r()}catch(t){e.e(t)}finally{e.f()}}}}},{key:"select",value:function(t,n){var e=this,r=[].concat(t),i=u(this.selectionManager.getSelectionIds());n&&r.length||this.selectionManager.clear();var o=[];r.forEach((function(t){t&&t.identity&&(e.isDataPointSelected(t,i)?(t.selected=!1,n&&o.push(t.identity)):(t.selected=!0,o.push(t.identity)))})),this.selectionManager.select(o,n),this.syncSelectionState()}},{key:"takeSelectionStateFromDataPoints",value:function(t){var n=this.selectionManager.getSelectionIds();g.clear(n);var e,r=a(t);try{for(r.s();!(e=r.n()).done;){var i=e.value;i.selected&&n.push(i.identity)}}catch(t){r.e(t)}finally{r.f()}}},{key:"sendSelectionToHost",value:function(){}},{key:"syncSelectionStateInverted",value:function(){var t=this.selectionManager.getSelectionIds(),n=this.selectableDataPoints;if(n)if(0===t.length){var e,r=a(n);try{for(r.s();!(e=r.n()).done;)e.value.selected=!1}catch(t){r.e(t)}finally{r.f()}}else{var i,o=a(n);try{var u=function(){var n=i.value;t.some((function(t){return t.includes(n.identity)}))?n.selected=!0:n.selected&&(n.selected=!1)};for(o.s();!(i=o.n()).done;)u()}catch(t){o.e(t)}finally{o.f()}}}},{key:"updateSelectableDataPointsBySelectedIds",value:function(t,n){var e,r=!1,i=a(t);try{for(i.s();!(e=i.n()).done;){var o=e.value;o.selected=this.isDataPointSelected(o,n),o.selected&&(r=!0)}}catch(t){i.e(t)}finally{i.f()}return r}},{key:"isDataPointSelected",value:function(t,n){return n.some((function(n){return n.includes(t.identity)}))}}])&&f(n.prototype,e),r&&f(n,r),o}(i.a);function b(t){return new y(t)}},function(t,n,e){"use strict";function r(t,n){var e;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(e=function(t,n){if(!t)return;if("string"==typeof t)return i(t,n);var e=Object.prototype.toString.call(t).slice(8,-1);"Object"===e&&t.constructor&&(e=t.constructor.name);if("Map"===e||"Set"===e)return Array.from(t);if("Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e))return i(t,n)}(t))||n&&t&&"number"==typeof t.length){e&&(t=e);var r=0,o=function(){};return{s:o,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var u,a=!0,c=!1;return{s:function(){e=t[Symbol.iterator]()},n:function(){var t=e.next();return a=t.done,t},e:function(t){c=!0,u=t},f:function(){try{a||null==e.return||e.return()}finally{if(c)throw u}}}}function i(t,n){(null==n||n>t.length)&&(n=t.length);for(var e=0,r=new Array(n);e<n;e++)r[e]=t[e];return r}function o(t,n){for(var e=0;e<n.length;e++){var r=n[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var u;function a(t){for(var n=0,e=t.length;n<e;n++)if(t[n].selected)return!0;return!1}e.d(n,"a",(function(){return c})),function(t){t[t.merge=0]="merge",t[t.remove=1]="remove"}(u||(u={}));var c=function(){function t(){!function(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}(this,t),this.renderSelectionInVisual=function(){},this.renderSelectionInLegend=function(){},this.renderSelectionInLabels=function(){},this.isInvertedSelectionMode=!1}var n,e,i;return n=t,(e=[{key:"bind",value:function(t){var n=this;t.interactivityServiceOptions&&t.interactivityServiceOptions.overrideSelectionFromData&&this.takeSelectionStateFromDataPoints(t.dataPoints),t.interactivityServiceOptions?t.interactivityServiceOptions.isLegend?(this.selectableLegendDataPoints=t.dataPoints,this.renderSelectionInLegend=function(){return t.behavior.renderSelection(n.legendHasSelection())}):t.interactivityServiceOptions.isLabels?(this.selectableLabelsDataPoints=t.dataPoints,this.renderSelectionInLabels=function(){return t.behavior.renderSelection(n.labelsHasSelection())}):(this.selectableDataPoints=t.dataPoints,this.renderSelectionInVisual=function(){return t.behavior.renderSelection(n.hasSelection())}):(this.selectableDataPoints=t.dataPoints,this.renderSelectionInVisual=function(){return t.behavior.renderSelection(n.hasSelection())}),t.behavior.bindEvents(t,this),this.syncSelectionState()}},{key:"clearSelection",value:function(){this.applyToAllSelectableDataPoints((function(t){return t.selected=!1})),this.renderAll()}},{key:"legendHasSelection",value:function(){return!!this.selectableLegendDataPoints&&a(this.selectableLegendDataPoints)}},{key:"labelsHasSelection",value:function(){return!!this.selectableLabelsDataPoints&&a(this.selectableLabelsDataPoints)}},{key:"isSelectionModeInverted",value:function(){return this.isInvertedSelectionMode}},{key:"handleSelection",value:function(t,n){t&&(this.select(t,n),this.sendSelectionToHost(),this.renderAll())}},{key:"handleContextMenu",value:function(t,n){}},{key:"handleClearSelection",value:function(){this.clearSelection(),this.sendSelectionToHost()}},{key:"renderAll",value:function(){this.renderSelectionInVisual(),this.renderSelectionInLegend(),this.renderSelectionInLabels()}},{key:"applyToAllSelectableDataPoints",value:function(t){var n=this.selectableDataPoints,e=this.selectableLegendDataPoints,i=this.selectableLabelsDataPoints;if(n){var o,u=r(n);try{for(u.s();!(o=u.n()).done;)t(o.value)}catch(t){u.e(t)}finally{u.f()}}if(e){var a,c=r(e);try{for(c.s();!(a=c.n()).done;)t(a.value)}catch(t){c.e(t)}finally{c.f()}}if(i){var s,f=r(i);try{for(f.s();!(s=f.n()).done;)t(s.value)}catch(t){f.e(t)}finally{f.f()}}}}])&&o(n.prototype,e),i&&o(n,i),t}()},function(t,n,e){"use strict";var r=e(70);n.a=function(t,n,e){var i=new r.a;return n=null==n?0:+n,i.restart((function(e){i.stop(),t(e+n)}),n,e),i}},function(t,n,e){"use strict";e.d(n,"a",(function(){return u})),e.d(n,"b",(function(){return a}));var r=e(21),i=e(131);function o(t,n,e,i){function o(t){return t.length?t.pop()+" ":""}return function(u,a){var c=[],s=[];return u=t(u),a=t(a),function(t,i,o,u,a,c){if(t!==o||i!==u){var s=a.push("translate(",null,n,null,e);c.push({i:s-4,x:Object(r.a)(t,o)},{i:s-2,x:Object(r.a)(i,u)})}else(o||u)&&a.push("translate("+o+n+u+e)}(u.translateX,u.translateY,a.translateX,a.translateY,c,s),function(t,n,e,u){t!==n?(t-n>180?n+=360:n-t>180&&(t+=360),u.push({i:e.push(o(e)+"rotate(",null,i)-2,x:Object(r.a)(t,n)})):n&&e.push(o(e)+"rotate("+n+i)}(u.rotate,a.rotate,c,s),function(t,n,e,u){t!==n?u.push({i:e.push(o(e)+"skewX(",null,i)-2,x:Object(r.a)(t,n)}):n&&e.push(o(e)+"skewX("+n+i)}(u.skewX,a.skewX,c,s),function(t,n,e,i,u,a){if(t!==e||n!==i){var c=u.push(o(u)+"scale(",null,",",null,")");a.push({i:c-4,x:Object(r.a)(t,e)},{i:c-2,x:Object(r.a)(n,i)})}else 1===e&&1===i||u.push(o(u)+"scale("+e+","+i+")")}(u.scaleX,u.scaleY,a.scaleX,a.scaleY,c,s),u=a=null,function(t){for(var n,e=-1,r=s.length;++e<r;)c[(n=s[e]).i]=n.x(t);return c.join("")}}}var u=o(i.a,"px, ","px)","deg)"),a=o(i.b,", ",")",")")},function(t,n,e){"use strict";e.d(n,"a",(function(){return p}));var r=e(135),i=e(272),o=e(273),u=e(274),a=e(275),c=e(136),s=e(276),f=e(277),l=e(278),h=e(279),d=e(133),v=e(134);function p(t,n,e){var r=new g(null==n?d.b:n,null==e?v.b:e,NaN,NaN,NaN,NaN);return null==t?r:r.addAll(t)}function g(t,n,e,r,i,o){this._x=t,this._y=n,this._x0=e,this._y0=r,this._x1=i,this._y1=o,this._root=void 0}function y(t){for(var n={data:t.data},e=n;t=t.next;)e=e.next={data:t.data};return n}var b=p.prototype=g.prototype;b.copy=function(){var t,n,e=new g(this._x,this._y,this._x0,this._y0,this._x1,this._y1),r=this._root;if(!r)return e;if(!r.length)return e._root=y(r),e;for(t=[{source:r,target:e._root=new Array(4)}];r=t.pop();)for(var i=0;i<4;++i)(n=r.source[i])&&(n.length?t.push({source:n,target:r.target[i]=new Array(4)}):r.target[i]=y(n));return e},b.add=r.b,b.addAll=r.a,b.cover=i.a,b.data=o.a,b.extent=u.a,b.find=a.a,b.remove=c.a,b.removeAll=c.b,b.root=s.a,b.size=f.a,b.visit=l.a,b.visitAfter=h.a,b.x=d.a,b.y=v.a},function(t,n,e){"use strict";var r=e(6),i=e(9),o=Object(r.a)((function(t){t.setTime(t-t.getMilliseconds())}),(function(t,n){t.setTime(+t+n*i.d)}),(function(t,n){return(n-t)/i.d}),(function(t){return t.getUTCSeconds()}));n.a=o;o.range},function(t,n,e){"use strict";var r=e(6),i=Object(r.a)((function(){}),(function(t,n){t.setTime(+t+n)}),(function(t,n){return n-t}));i.every=function(t){return t=Math.floor(t),isFinite(t)&&t>0?t>1?Object(r.a)((function(n){n.setTime(Math.floor(n/t)*t)}),(function(n,e){n.setTime(+n+e*t)}),(function(n,e){return(e-n)/t})):i:null},n.a=i;i.range},function(t,n,e){"use strict";e.d(n,"a",(function(){return i})),e.d(n,"b",(function(){return o}));var r,i,o,u,a=e(285);u={dateTime:"%x, %X",date:"%-m/%-d/%Y",time:"%-I:%M:%S %p",periods:["AM","PM"],days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],shortDays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],shortMonths:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]},r=Object(a.a)(u),i=r.format,r.parse,o=r.utcFormat,r.utcParse},,,,,,,,,,,,,,,,,,,,,,,,function(t,n,e){t.exports=e(323)},function(t,n,e){"use strict";e.r(n),function(t){var r=e(128),i=t.powerbi,o={name:"taskboard7A11309AC21042A28A78716F6638A2B0",displayName:"Stratada Task Board Standard Version",class:"Visual",apiVersion:"2.6.0",create:function(t){if(r.a)return new r.a(t);throw"Visual instance not found"},custom:!0};void 0!==i&&(i.visuals=i.visuals||{},i.visuals.plugins=i.visuals.plugins||{},i.visuals.plugins.taskboard7A11309AC21042A28A78716F6638A2B0=o),n.default=o}.call(this,e(76))},function(t,n,e){"use strict";var r=e(7),i=e(213),o=e(214);r.b.prototype.interrupt=i.a,r.b.prototype.transition=o.a},function(t,n,e){(function(n){function e(t){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var r;r=function(){return this}();try{r=r||new Function("return this")()}catch(t){"object"===(void 0===n?"undefined":e(n))&&(r=n)}t.exports=r}).call(this,e(76))},function(t,n){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),t.webpackPolyfill=1),t}},function(t,n){t.exports=!1},function(t,n,e){"use strict";function r(t){return((t*=2)<=1?t*t*t:(t-=2)*t*t+2)/2}e.d(n,"a",(function(){return r}))},function(t,n,e){"use strict";var r=Math.PI,i=2*r,o=i-1e-6;function u(){this._x0=this._y0=this._x1=this._y1=null,this._=""}function a(){return new u}u.prototype=a.prototype={constructor:u,moveTo:function(t,n){this._+="M"+(this._x0=this._x1=+t)+","+(this._y0=this._y1=+n)},closePath:function(){null!==this._x1&&(this._x1=this._x0,this._y1=this._y0,this._+="Z")},lineTo:function(t,n){this._+="L"+(this._x1=+t)+","+(this._y1=+n)},quadraticCurveTo:function(t,n,e,r){this._+="Q"+ +t+","+ +n+","+(this._x1=+e)+","+(this._y1=+r)},bezierCurveTo:function(t,n,e,r,i,o){this._+="C"+ +t+","+ +n+","+ +e+","+ +r+","+(this._x1=+i)+","+(this._y1=+o)},arcTo:function(t,n,e,i,o){t=+t,n=+n,e=+e,i=+i,o=+o;var u=this._x1,a=this._y1,c=e-t,s=i-n,f=u-t,l=a-n,h=f*f+l*l;if(o<0)throw new Error("negative radius: "+o);if(null===this._x1)this._+="M"+(this._x1=t)+","+(this._y1=n);else if(h>1e-6)if(Math.abs(l*c-s*f)>1e-6&&o){var d=e-u,v=i-a,p=c*c+s*s,g=d*d+v*v,y=Math.sqrt(p),b=Math.sqrt(h),m=o*Math.tan((r-Math.acos((p+h-g)/(2*y*b)))/2),_=m/b,w=m/y;Math.abs(_-1)>1e-6&&(this._+="L"+(t+_*f)+","+(n+_*l)),this._+="A"+o+","+o+",0,0,"+ +(l*d>f*v)+","+(this._x1=t+w*c)+","+(this._y1=n+w*s)}else this._+="L"+(this._x1=t)+","+(this._y1=n);else;},arc:function(t,n,e,u,a,c){t=+t,n=+n,c=!!c;var s=(e=+e)*Math.cos(u),f=e*Math.sin(u),l=t+s,h=n+f,d=1^c,v=c?u-a:a-u;if(e<0)throw new Error("negative radius: "+e);null===this._x1?this._+="M"+l+","+h:(Math.abs(this._x1-l)>1e-6||Math.abs(this._y1-h)>1e-6)&&(this._+="L"+l+","+h),e&&(v<0&&(v=v%i+i),v>o?this._+="A"+e+","+e+",0,1,"+d+","+(t-s)+","+(n-f)+"A"+e+","+e+",0,1,"+d+","+(this._x1=l)+","+(this._y1=h):v>1e-6&&(this._+="A"+e+","+e+",0,"+ +(v>=r)+","+d+","+(this._x1=t+e*Math.cos(a))+","+(this._y1=n+e*Math.sin(a))))},rect:function(t,n,e,r){this._+="M"+(this._x0=this._x1=+t)+","+(this._y0=this._y1=+n)+"h"+ +e+"v"+ +r+"h"+-e+"Z"},toString:function(){return this._}},n.a=a},function(t,n,e){"use strict";n.a=function(t,n){return t=+t,n=+n,function(e){return Math.round(t*(1-e)+n*e)}}},function(t,n,e){"use strict";var r=e(31);n.a=function(t,n){return Math.max(0,3*Math.max(-8,Math.min(8,Math.floor(Object(r.a)(n)/3)))-Object(r.a)(Math.abs(t)))}},function(t,n,e){"use strict";var r=e(31);n.a=function(t,n){return t=Math.abs(t),n=Math.abs(n)-t,Math.max(0,Object(r.a)(n)-Object(r.a)(t))+1}},function(t,n,e){"use strict";var r=e(31);n.a=function(t){return Math.max(0,-Object(r.a)(Math.abs(t)))}},function(t,n,e){"use strict";var r=e(6),i=Object(r.a)((function(t){t.setDate(1),t.setHours(0,0,0,0)}),(function(t,n){t.setMonth(t.getMonth()+n)}),(function(t,n){return n.getMonth()-t.getMonth()+12*(n.getFullYear()-t.getFullYear())}),(function(t){return t.getMonth()}));n.a=i;i.range},function(t,n,e){"use strict";var r=e(6),i=e(9),o=Object(r.a)((function(t){t.setTime(t-t.getMilliseconds()-t.getSeconds()*i.d-t.getMinutes()*i.c)}),(function(t,n){t.setTime(+t+n*i.b)}),(function(t,n){return(n-t)/i.b}),(function(t){return t.getHours()}));n.a=o;o.range},function(t,n,e){"use strict";var r=e(6),i=e(9),o=Object(r.a)((function(t){t.setTime(t-t.getMilliseconds()-t.getSeconds()*i.d)}),(function(t,n){t.setTime(+t+n*i.c)}),(function(t,n){return(n-t)/i.c}),(function(t){return t.getMinutes()}));n.a=o;o.range},function(t,n,e){"use strict";var r=e(6),i=Object(r.a)((function(t){t.setUTCDate(1),t.setUTCHours(0,0,0,0)}),(function(t,n){t.setUTCMonth(t.getUTCMonth()+n)}),(function(t,n){return n.getUTCMonth()-t.getUTCMonth()+12*(n.getUTCFullYear()-t.getUTCFullYear())}),(function(t){return t.getUTCMonth()}));n.a=i;i.range},function(t,n,e){"use strict";var r=e(6),i=e(9),o=Object(r.a)((function(t){t.setUTCMinutes(0,0,0)}),(function(t,n){t.setTime(+t+n*i.b)}),(function(t,n){return(n-t)/i.b}),(function(t){return t.getUTCHours()}));n.a=o;o.range},function(t,n,e){"use strict";var r=e(6),i=e(9),o=Object(r.a)((function(t){t.setUTCSeconds(0,0)}),(function(t,n){t.setTime(+t+n*i.c)}),(function(t,n){return(n-t)/i.c}),(function(t){return t.getUTCMinutes()}));n.a=o;o.range},function(t,n,e){"use strict";var r=Math.SQRT2;function i(t){return((t=Math.exp(t))+1/t)/2}n.a=function(t,n){var e,o,u=t[0],a=t[1],c=t[2],s=n[0],f=n[1],l=n[2],h=s-u,d=f-a,v=h*h+d*d;if(v<1e-12)o=Math.log(l/c)/r,e=function(t){return[u+t*h,a+t*d,c*Math.exp(r*t*o)]};else{var p=Math.sqrt(v),g=(l*l-c*c+4*v)/(2*c*2*p),y=(l*l-c*c-4*v)/(2*l*2*p),b=Math.log(Math.sqrt(g*g+1)-g),m=Math.log(Math.sqrt(y*y+1)-y);o=(m-b)/r,e=function(t){var n,e=t*o,s=i(b),f=c/(2*p)*(s*(n=r*e+b,((n=Math.exp(2*n))-1)/(n+1))-function(t){return((t=Math.exp(t))-1/t)/2}(b));return[u+f*h,a+f*d,c*s/i(r*e+b)]}}return e.duration=1e3*o,e}}]);
//# sourceMappingURL=visual.js.map