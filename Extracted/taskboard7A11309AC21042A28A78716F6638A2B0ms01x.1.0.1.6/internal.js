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
/*! For license information please see visual.js.LICENSE.txt */
var taskboard7A11309AC21042A28A78716F6638A2B0ms01x;(()=>{var t={1446:(t,e,n)=>{"use strict";var r;n.d(e,{S:()=>r}),function(t){t.ts=""}(r||(r={}))},438:(t,e,n)=>{"use strict";function r(t,e){let n="",r=Math.sqrt(3),i=Math.tan(30*Math.PI/180);switch(e){case"circle":{let e=Math.sqrt(t/Math.PI);n="M0,"+e+"A"+e+","+e+" 0 1,1 0,"+-e+"A"+e+","+e+" 0 1,1 0,"+e+"Z";break}case"cross":{let e=Math.sqrt(t/5)/2;n="M"+-3*e+","+-e+"H"+-e+"V"+-3*e+"H"+e+"V"+-e+"H"+3*e+"V"+e+"H"+e+"V"+3*e+"H"+-e+"V"+e+"H"+-3*e+"Z";break}case"diamond":{let e=Math.sqrt(t/(2*i)),r=e*i;n="M0,"+-e+"L"+r+",0 0,"+e+" "+-r+",0Z";break}case"square":{let e=Math.sqrt(t)/2;n="M"+-e+","+-e+"L"+e+","+-e+" "+e+","+e+" "+-e+","+e+"Z";break}case"triangle-down":{let e=Math.sqrt(t/r),i=e*r/2;n="M0,"+i+"L"+e+","+-i+" "+-e+","+-i+"Z";break}case"triangle-up":{let e=Math.sqrt(t/r),i=e*r/2;n="M0,"+-i+"L"+e+","+i+" "+-e+","+i+"Z";break}case"triangle-left":{let e=Math.sqrt(t/r);n="M"+-e+", 0L"+1*e/2+","+e*r/2+" "+1*e/2+","+e*r/2*-1+"Z";break}case"triangle-right":{let e=Math.sqrt(t/r);n="M"+e+", 0L"+-.5*e+","+e*r/2+" "+-.5*e+","+e*r/2*-1+"Z";break}case"pentagon":{let e=Math.sqrt(t/r);n="M0, "+-e+"L";for(let t=1;t<5;t++)n+=" "+e*Math.cos(Math.PI/2+2*Math.PI/5*t)+","+-e*Math.sin(Math.PI/2+2*Math.PI/5*t);n+="Z";break}case"hexagon":{let e=Math.sqrt(t/r);n="M"+e+", 0 L";for(let t=1;t<6;t++)n+=" "+e*Math.cos(2*Math.PI/6*t)+","+-e*Math.sin(2*Math.PI/6*t);n+="Z";break}case"heart":{let e=Math.sqrt(t/Math.PI/2);n="M"+-e+", "+-e+" A"+e+" "+1.7*e+" -50 1 0 "+-e+" "+2*e+"A"+e+" "+1.7*e+" 50 1 0 "+-e+" "+-e+"Z";break}case"one-way-up":{let e=Math.sqrt(t);n="M"+-e/2+", "+e/2+"L "+-e/2+", "+-e/2+" 0, "+-e+" "+e/2+", "+-e/2+" "+e/2+", "+e/2+"Z";break}case"one-way-down":{let e=Math.sqrt(t);n="M"+-e/2+", 0L "+-e/2+", "+-e+" "+e/2+", "+-e+" "+e/2+", 0 0, "+e/2+"Z";break}case"one-way-left":{let e=Math.sqrt(t);n="M"+-e+", 0L "+-e/2+", "+-e/2+" "+e/2+", "+-e/2+" "+e/2+", "+e/2+" "+-e/2+", "+e/2+"Z";break}case"one-way-right":{let e=Math.sqrt(t);n="M"+e/2+", 0L 0, "+-e/2+" "+-e+", "+-e/2+" "+-e+", "+e/2+" 0, "+e/2+"Z";break}case"chevron-up":{let e=Math.sqrt(t);n="M"+-e/2+", "+e/2+"L "+-e/2+", "+-e/2+" 0, "+-e+" "+e/2+", "+-e/2+" "+e/2+", "+e/2+" 0, 0Z";break}case"chevron-down":{let e=Math.sqrt(t);n="M"+-e/2+", 0L "+-e/2+", "+-e+" 0, "+-e/2+" "+e/2+", "+-e+" "+e/2+", 0 0, "+e/2+"Z";break}case"chevron-left":{let e=Math.sqrt(t);n="M"+-e+", 0L "+-e/2+", "+-e/2+" "+e/2+", "+-e/2+" 0, 0 "+e/2+", "+e/2+" "+-e/2+", "+e/2+"Z";break}case"chevron-right":{let e=Math.sqrt(t);n="M"+e/2+", 0L 0, "+-e/2+" "+-e+", "+-e/2+" "+-e/2+", 0 "+-e+", "+e/2+" 0, "+e/2+"Z";break}case"arrow-up":{let e=Math.sqrt(t*Math.PI);n="M0, "+-e/2+"L "+e/2+", 0 "+e/6+", 0 "+e/6+", "+e/2+" "+-e/6+", "+e/2+" "+-e/6+", 0 "+-e/2+", 0Z";break}case"arrow-down":{let e=Math.sqrt(t*Math.PI);n="M0, "+e/2+"L "+e/2+", 0 "+e/6+", 0 "+e/6+", "+-e/2+" "+-e/6+", "+-e/2+" "+-e/6+", 0 "+-e/2+", 0Z";break}case"arrow-left":{let e=Math.sqrt(t*Math.PI);n="M"+-e/2+",0L 0,"+-e/2+" 0,"+-e/6+" "+e/2+","+-e/6+" "+e/2+","+e/6+" 0,"+e/6+" 0,"+e/2+"Z";break}case"arrow-right":{let e=Math.sqrt(t*Math.PI);n="M"+e/2+",0L 0,"+-e/2+" 0,"+-e/6+" "+-e/2+","+-e/6+" "+-e/2+","+e/6+" 0,"+e/6+" 0,"+e/2+"Z";break}case"triangle-in-circle":{let e=Math.sqrt(t/r),i=e*r/2;n="M0,"+-i+"L"+e+","+i+" "+-e+","+i+"Z";break}case"downward-triangle-in-circle":{let e=Math.sqrt(t/r),i=e*r/2,o=2*e*Math.sqrt(3)/6;n="M0,"+(i+o)+"L"+e+","+(-i+o)+" "+-e+","+(-i+o)+"Z";break}case"left-triangle-in-circle":{let e=Math.sqrt(t/r),i=e*r/2,o=Math.sqrt(t/r)*r/3*2;n="M"+-o+","+(2*i-i-2*e*r/6)+"L"+o/2+","+(o*r/2+(2*i-i-2*e*r/6))+" "+o/2+","+(-o*r/2+(2*i-i-2*e*r/6))+"Z";break}case"right-triangle-in-circle":{let e=Math.sqrt(t/r),i=e*r/2,o=Math.sqrt(t/r)*r/3*2;n="M"+o+","+(2*i-i-2*e*r/6)+"L"+-o/2+","+(o*r/2+(2*i-i-2*e*r/6))+" "+-o/2+","+(-o*r/2+(2*i-i-2*e*r/6))+"Z";break}case"up-arrow-in-circle":{let e=Math.sqrt(t*Math.PI);n="M0, "+-e/2+"L "+e/2+", 0 "+e/6+", 0 "+e/6+", "+e/2+" "+-e/6+", "+e/2+" "+-e/6+", 0 "+-e/2+", 0Z";break}case"down-arrow-in-circle":{let e=Math.sqrt(t*Math.PI);n="M0, "+e/2+"L "+e/2+", 0 "+e/6+", 0 "+e/6+", "+-e/2+" "+-e/6+", "+-e/2+" "+-e/6+", 0 "+-e/2+", 0Z";break}case"left-arrow-in-circle":{let e=Math.sqrt(t*Math.PI);n="M"+-e/2+",0L 0,"+-e/2+" 0,"+-e/6+" "+e/2+","+-e/6+" "+e/2+","+e/6+" 0,"+e/6+" 0,"+e/2+"Z";break}case"right-arrow-in-circle":{let e=Math.sqrt(t*Math.PI);n="M"+e/2+",0L 0,"+-e/2+" 0,"+-e/6+" "+-e/2+","+-e/6+" "+-e/2+","+e/6+" 0,"+e/6+" 0,"+e/2+"Z";break}case"star":{let e=Math.sqrt(t*Math.PI/3),n="M 0,"+-e+" L ",r=[2,4,1,3];for(let t of r){let r=Math.PI/2+2*Math.PI/5*t;n+=" "+e*Math.cos(r)+", "+-e*Math.sin(r)}return n+="Z",n}case"cross-x":{let e=Math.sqrt(t/5)/2;n="M"+-3*e+","+-e+"H"+-e+"V"+-3*e+"H"+e+"V"+-e+"H"+3*e+"V"+e+"H"+e+"V"+3*e+"H"+-e+"V"+e+"H"+-3*e+"Z";break}case"crown":{let e=Math.sqrt(t*Math.PI);n="M0,"+-e/2+"L ",n+=" "+e/4+", 0",n+=" "+3*e/4+", "+-e/2,n+=" "+e/2+", "+e/2,n+=" "+-e/2+", "+e/2,n+=" "+-3*e/4+", "+-e/2,n+=" "+-e/4+", 0",n+="Z";break}case"pointy-flag":{let e=Math.sqrt(t*Math.PI);n="M"+-e/2+","+-e/2+"L ",n+=" "+e/2+","+-e/4,n+=" "+-e/2+",0",n+="Z",n+=" M"+-e/2+","+-e/2+"L ",n+=" "+-e/2+","+e/2;break}case"flag":{let e=Math.sqrt(t*Math.PI);n="M"+-e/2+","+e/2+"L ",n+=" "+-e/2+","+-e/2,n+=" Q"+-3*e/10+","+(-e/2-e/10),n+=" "+e/10+","+-e/2,n+="L "+e/10+",0",n+=" Q"+-3*e/10+","+-e/10,n+=" "+-e/2+",0",n+=" M"+e/10+","+-e/2,n+=" Q"+3*e/10+","+(-e/2+e/10),n+=" "+e/2+","+-e/2+"L",n+=" "+e/2+",0",n+=" Q"+3*e/10+","+e/10,n+=" "+e/10+",0";break}case"rewind-arrows":{let e=Math.sqrt(t*Math.PI);n="M"+-e/2+", 0 L ",n+=" 0, "+-e/2,n+=" "+e/8+", "+3*-e/8,n+=" "+-e/4+", 0",n+=" "+e/8+", "+3*e/8,n+=" 0, "+e/2,n+="Z",n+=" M"+(-e/2+e/3)+", 0 L ",n+=" "+e/3+", "+-e/2,n+=" "+(e/8+e/3)+", "+3*-e/8,n+=" "+(-e/4+e/3)+", 0",n+=" "+(e/8+e/3)+", "+3*e/8,n+=" "+e/3+", "+e/2,n+="Z";break}case"fast-forward-arrows":{let e=Math.sqrt(t*Math.PI);n="M"+e/2+", 0 L ",n+=" 0, "+-e/2,n+=" "+-e/8+", "+3*-e/8,n+=" "+e/4+", 0",n+=" "+-e/8+", "+3*e/8,n+=" 0, "+e/2,n+="Z",n+=" M"+(e/2-e/3)+", 0 L ",n+=" "+-e/3+", "+-e/2,n+=" "+(-e/8-e/3)+", "+3*-e/8,n+=" "+(e/4-e/3)+", 0",n+=" "+(-e/8-e/3)+", "+3*e/8,n+=" "+-e/3+", "+e/2,n+="Z";break}case"smiley-face":{let e=Math.sqrt(t/Math.PI);n="M0,"+e+"A"+e+","+e+" 0 1,1 0,"+-e+"A"+e+","+e+" 0 1,1 0,"+e+"Z M"+-e/2+","+e/2+" Q0,"+.8*e+" "+e/2+","+e/2+" Q0,"+.8*e+" "+-e/2+","+e/2;break}case"meh-face":{let e=Math.sqrt(t/Math.PI);n="M0,"+e+"A"+e+","+e+" 0 1,1 0,"+-e+"A"+e+","+e+" 0 1,1 0,"+e+"Z M"+-e/2+","+e/2+" L "+e/2+","+e/2;break}case"frown-face":{let e=Math.sqrt(t/Math.PI);n="M0,"+e+"A"+e+","+e+" 0 1,1 0,"+-e+"A"+e+","+e+" 0 1,1 0,"+e+"Z M"+-e/2+","+e/2+" Q0,"+.1*e+" "+e/2+","+e/2+" Q0,"+.1*e+" "+-e/2+","+e/2;break}case"push-pin":{let e=Math.sqrt(t*Math.PI);n="M"+-e/10+","+-e/2+" L",n+=" "+e/10+","+-e/2,n+=" "+e/10+","+-e/10,n+=" "+-e/10+","+-e/10,n+="Z",n+="M"+-e/10+","+-e/2,n+=" Q"+(-e/10-e/20)+","+-e/2,n+=" "+(-e/10-e/20)+","+(-e/2-e/20)+" L",n+=" "+(e/10+e/20)+","+(-e/2-e/20),n+=" Q"+(e/10+e/20)+","+-e/2,n+=" "+e/10+","+-e/2,n+="M"+-e/10+","+-e/10,n+=" Q"+-e/4+","+-e/10,n+=" "+-e/4+","+e/20+" L",n+=" "+e/4+","+e/20,n+=" Q"+e/4+","+-e/10,n+=" "+e/10+","+-e/10;break}case"check-mark":{let e=Math.sqrt(t*Math.PI);n="M"+-e/2+", "+e/10+" L ",n+=" "+2*-e/10+", "+e/2,n+=" "+e/2+", "+-4*e/10,n+=" "+4*e/10+", "+-e/2,n+=" "+2*-e/10+", "+3*e/10,n+=" "+4*-e/10+", 0",n+="Z";break}case"check-marked-box":{let e=Math.sqrt(1.5*t),r=.8,i=e/4,o=e/8;n="M"+e/2+","+-e/2+"L",n+=" "+-e/2+","+-e/2,n+=" "+-e/2+","+e/2,n+=" "+e/2+","+e/2,n+=" "+e/2+",0",n+=" "+e/2*r+","+(e/2-e/2*r),n+=" "+e/2*r+","+e/2*r,n+=" "+-e/2*r+","+e/2*r,n+=" "+-e/2*r+","+-e/2*r,n+=" "+e/2*r+","+-e/2*r,n+="Z",n+="M"+(-e/2+i)+", "+(e/10-o)+" L",n+=" "+(2*-e/10+i)+", "+(e/2-o),n+=" "+(e/2+i)+", "+(-4*e/10-o),n+=" "+(4*e/10+i)+", "+(-e/2-o),n+=" "+(2*-e/10+i)+", "+(3*e/10-o),n+=" "+(4*-e/10+i)+", "+-o,n+="Z";break}}return n}n.d(e,{u:()=>r})},4279:(t,e,n)=>{"use strict";var r;n.d(e,{j:()=>r}),function(t){t[t.Diamond="Diamond"]="Diamond",t[t.TriangleUp="TriangleUp"]="TriangleUp",t[t.TriangleDown="TriangleDown"]="TriangleDown",t[t.TriangleLeft="TriangleLeft"]="TriangleLeft",t[t.TriangleRight="TriangleRight"]="TriangleRight",t[t.Square="Square"]="Square",t[t.Circle="Circle"]="Circle",t[t.Pentagon="Pentagon"]="Pentagon",t[t.Hexagon="Hexagon"]="Hexagon",t[t.Heart="Heart"]="Heart",t[t.OneWayUp="OneWayUp"]="OneWayUp",t[t.OneWayDown="OneWayDown"]="OneWayDown",t[t.OneWayLeft="OneWayLeft"]="OneWayLeft",t[t.OneWayRight="OneWayRight"]="OneWayRight",t[t.ChevronUp="ChevronUp"]="ChevronUp",t[t.ChevronDown="ChevronDown"]="ChevronDown",t[t.ChevronLeft="ChevronLeft"]="ChevronLeft",t[t.ChevronRight="ChevronRight"]="ChevronRight",t[t.ArrowUp="ArrowUp"]="ArrowUp",t[t.ArrowDown="ArrowDown"]="ArrowDown",t[t.ArrowLeft="ArrowLeft"]="ArrowLeft",t[t.ArrowRight="ArrowRight"]="ArrowRight",t[t.TriangleInCircle="TriangleInCircle"]="TriangleInCircle",t[t.DownwardTriangleInCircle="DownwardTriangleInCircle"]="DownwardTriangleInCircle",t[t.LeftTriangleInCircle="LeftTriangleInCircle"]="LeftTriangleInCircle",t[t.RightTriangleInCircle="RightTriangleInCircle"]="RightTriangleInCircle",t[t.UpArrowInCircle="UpArrowInCircle"]="UpArrowInCircle",t[t.DownArrowInCircle="DownArrowInCircle"]="DownArrowInCircle",t[t.ArrowLeftInCircle="ArrowLeftInCircle"]="ArrowLeftInCircle",t[t.ArrowRightInCircle="ArrowRightInCircle"]="ArrowRightInCircle",t[t.Plus="Plus"]="Plus",t[t.CrossX="CrossX"]="CrossX",t[t.Crown="Crown"]="Crown",t[t.CheckMark="CheckMark"]="CheckMark",t[t.CheckMarkedBox="CheckMarkedBox"]="CheckMarkedBox",t[t.PointyFlag="PointyFlag"]="PointyFlag",t[t.Flag="Flag"]="Flag",t[t.RewindArrows="RewindArrows"]="RewindArrows",t[t.FastForwardArrows="FastForwardArrows"]="FastForwardArrows",t[t.SmileyFace="SmileyFace"]="SmileyFace",t[t.MehFace="MehFace"]="MehFace",t[t.FrownFace="FrownFace"]="FrownFace",t[t.PushPin="PushPin"]="PushPin",t[t.PowerButton="PowerButton"]="PowerButton",t[t.Star="Star"]="Star",t[t.IntertwinedRightArrows="IntertwinedRightArrows"]="IntertwinedRightArrows",t[t.CautionTriangle="CautionTriangle"]="CautionTriangle"}(r||(r={}))},8910:(t,e,n)=>{"use strict";n.d(e,{$:()=>s,e:()=>a});var r=n(662),i=n(1446),o=n(6738);function a(t,e,n,i,o){if(null==t||null==e)return;const a=document.createElement("div");a.setAttribute("class","popupDiv"),a.style.backgroundColor="#ffffff",a.style.width="550px",a.style.height="450px";const s=e.viewport.width>550?.5*(e.viewport.width-550):0;a.style.left=`${s}px`;const u=e.viewport.height>450?.5*(e.viewport.height-450):0;a.style.top=`${u}px`,a.style.position="absolute",a.style.zIndex="9",a.style.boxShadow="5px 7px 20px 7px #aaaaaa";const l=document.createElement("div");l.setAttribute("class","logo-div");const c=document.createElement("div");c.setAttribute("class","stratada-popup-logo"),c.style.width="50px",c.style.height="50px",c.style.left="15px",c.style.top="5px",c.style.position="relative",l.appendChild(c),l.style.width="100%";const f=document.createElement("p");f.style.fontSize="16px",f.style.float="right",f.style.paddingRight="15px",f.style.fontFamily="Segoe UI",f.style.fontWeight="700",f.style.verticalAlign="middle",f.style.position="absolute",f.style.top="0px",f.style.right="0px",f.style.color="#777",f.textContent="Stratada Taskboard Visual",l.appendChild(f),a.appendChild(l),a.appendChild(document.createElement("hr"));const h=document.createElement("div");h.setAttribute("class","textDiv"),h.style.paddingLeft="15px",h.style.paddingRight="15px";const p=document.createElement("p");p.style.fontSize="16px",p.style.fontFamily="Segoe UI",p.textContent=n;const d=document.createElement("p");d.style.fontSize="16px",d.style.fontFamily="Segoe UI",d.textContent=i,h.appendChild(p),h.appendChild(d),""!==o&&(0,r.Ys)(h).append("text").text("learn more here").style("font-size","16px").style("color","Blue").style("position","absolute").style("bottom","20px").style("text-decoration","underline").on("click",(()=>{t.host.launchUrl(o)})),a.appendChild(h),(0,r.Ys)(".body").node().appendChild(a)}function s(){const t=parseInt(`${i.S.ts}`);return(o.performance&&o.performance.now&&o.performance.timing&&o.performance.timing.navigationStart?o.performance.now()+o.performance.timing.navigationStart:Date.now())>t}},3175:(t,e,n)=>{"use strict";function r(t,e,n,r){if(t){let r=t[e];if(r){let t=r[n];if(void 0!==t)return t}}return r}function i(t,e,n,r,i){let o=t.objects;if(o){let t=o[e];if(t){let e=t[n];if(e){let t=e[r];if(void 0!==t)return t}}}return i}n.d(e,{b6:()=>i,oh:()=>S});let o=!0,a=!0,s="",u=12,l=!1,c=2,f=25,h=20,p="#fff",d=!1,g=12,v=15,y=13,m=13,b=13,w=13,_=!1,x=300,k=!1;function S(t){let e={solid:{color:"#000"}},n={solid:{color:p}};return{card:{taskNumberSorting:r(t,"card","taskNumberSorting",l),cardCol:r(t,"card","cardCol",c),height:r(t,"card","height",f),headerHeight:r(t,"card","headerHeight",h),cardColor:r(t,"card","cardColor",n).solid.color,ascending:r(t,"card","ascending",d)},taskIcons:{size:r(t,"taskIcons","size",g)},font:{statusFontSize:r(t,"font","statusFontSize",v),statusFontColor:r(t,"font","statusFontColor",e).solid.color,taskNumberFontSize:r(t,"font","taskNumberFontSize",y),taskNumberFontColor:r(t,"font","taskNumberFontColor",n).solid.color,taskFontSize:r(t,"font","taskFontSize",m),taskFontColor:r(t,"font","taskFontColor",e).solid.color,descriptionFontSize:r(t,"font","descriptionFontSize",b),descriptionFontColor:r(t,"font","descriptionFontColor",e).solid.color,resourceFontSize:r(t,"font","resourceFontSize",w),resourceFontColor:r(t,"font","resourceFontColor",e).solid.color},legend:{show:r(t,"legend","show",o),showTitle:r(t,"legend","showTitle",a),titleText:r(t,"legend","titleText",s),labelColor:r(t,"legend","labelColor",e).solid.color,fontSize:r(t,"legend","fontSize",u)},bucketSetting:{showFixedWidth:r(t,"bucketSetting","showFixedWidth",_),width:r(t,"bucketSetting","width",x),customSort:r(t,"bucketSetting","customSort",k)}}}},1840:(t,e,n)=>{"use strict";n.d(e,{u:()=>p});var r=n(662),i=n(4017),o=n(6486),a=n(880),s=n(6188),u=n(8482),l=n(8910),c=n(7435),f=n(1446),h=n(9755);class p{constructor(t){this.iscompanylogo=!0,this.isPro=!0,this.target=t.element,this.host=t.host,(0,i.Z)(t.element).classed("body",!0),this.selectionManager=t.host.createSelectionManager(),this.tooltipServiceWrapper=(0,a.p)(this.host.tooltipService,t.element),this.interactivityService=(0,u.L)(this.host),this.colors=t.host.colorPalette,this.colorHelper=new s.vH(this.colors),this.licenseManager=t.host.licenseManager,this.hasServicePlans=!1,""==`${f.S.ts}`?this.fetchLicenseDetail():this.hasServicePlans=!0}fetchLicenseDetail(){this.licenseManager.getAvailableServicePlans().then((t=>{this.notificationType=t.isLicenseUnsupportedEnv?1:0,this.hasServicePlans=!(!(t.plans&&t.plans.length&&["stratada.taskboard.taskboard-p1"].includes(`${t.plans[0].spIdentifier}`)&&1!==this.notificationType)||1!=t.plans[0].state&&2!=t.plans[0].state),this.hasServicePlans&&(0,i.Z)(".popupDiv").remove(),this.hasServicePlans||this.licenseManager.notifyFeatureBlocked("Please purchase a Pro License").then((t=>{t&&(this.isIconDisplayed=!0)})).catch((t=>{console.log("ERROR",t)}))})).catch((t=>{this.hasServicePlans=void 0,console.log(t)}))}update(t){let e=this.viewModel=(0,c.S)(t,this.host);this.settings=e.settings,this.dataPoints=e.dataPoints,this.legendColors=e.legendColors,this.options=t,this.taskIcons=e.taskIcons;let n=[],o=t.viewport.width,a=e.status,s=[];(0,r.td_)(".popupDiv").remove(),e.dataPoints.forEach((t=>{-1===s.indexOf(t.Priority)&&s.push(t.Priority)}));let u="";this.target.innerHTML="";let f=h("<div/>",{class:"main-container"}).appendTo(this.target);this.handleContextMenu(f,this.selectionManager);let g=1,v=this.settings.legend.show,y=h("<div/>",{width:"100%",style:"background : white;"+(v||this.iscompanylogo?"min-height:45px!important;":"height:5px!important;")}).appendTo(f);if(h("<div/>",{class:"legend-div",width:"calc(100% - 80px)"}).appendTo(y),this.iscompanylogo){let t=h("<div/>",{class:"stratada-logo-div",width:40,height:40}).attr("title","Stratada").appendTo(y),e=this;h("<a/>",{class:"stratada-logo ui-widget-content",id:"draggable",click:()=>{e.host.launchUrl("https://www.stratada.com/")}}).appendTo(t)}if(!p.isCorrectSettings())return;if(v){let t="Priority",e=[],n=[];this.dataPoints.forEach((t=>{0===e.filter((e=>e.Priority===t.Priority)).length&&(e.push(t),n.push(t))}));let a="AssignTo"===t?"Assign To : ":"Priority : ";this.settings.legend.showTitle&&""!==this.settings.legend.titleText&&(a=`${this.settings.legend.titleText}:`),this.settings.legend.showTitle&&r.Ys(".legend-div").append("text").attr("class","legend-title").attr("style","padding-right:2px").text(a).style("color",this.settings.legend.labelColor).style("font-size",`${this.settings.legend.fontSize}px`).style("transform",`translate(0px,-${this.settings.legend.fontSize<15?0:this.settings.legend.fontSize/3}px)`);let s=0,u=1;o>0&&(u=Math.floor(o/180));let l=270;0!==e.length&&(s=20*Math.ceil(e.length/u)),l=100,e.sort(((t,e)=>t.Priority>e.Priority?1:t.Priority<e.Priority?-1:0));let c=0;g=0;let f=r.Ys(".legend-div").append("svg").attr("class","legend").attr("width","92%").attr("height",s).selectAll("g").data(e).enter().append("g").attr("class","legend-text").attr("transform",((t,e)=>(c===u&&(g+=25,c=0),"translate("+c++*l+","+g+")")));f.append("rect").attr("width",18).attr("height",18).style("fill",((t,e)=>t.color));let d=0;f.append("text").attr("x",24).attr("y",9).attr("width",l).attr("dy",".35em").attr("title",((t,e)=>t.Priority)).text((t=>t.Priority)).attr("font-size",this.settings.legend.fontSize).attr("fill",this.settings.legend.labelColor).each((function(t,e){(0,i.Z)((0,r.td_)(".legend-text").nodes()[e]).attr("transform",`translate(${d},0)`),d+=this.getComputedTextLength()+33})),f.on("click",(e=>{if(P){let n=e.Priority;N.select(e.selectionId).then((e=>{f.attr("fill-opacity",e.length>0?p.Config.transparentOpacity:p.Config.solidOpacity),"Priority"!==t?h("div.task-body-container").each((function(){h(this).find("span.task-body-font-assign").text()!==n&&h(this).find("*").css({opacity:e.length>0?p.Config.transparentOpacity:p.Config.solidOpacity})})):h("div.task-body-container").each((function(){h(this).attr("data-Priority")!==n&&h(this).find("*").css({opacity:e.length>0?p.Config.transparentOpacity:p.Config.solidOpacity})}))})),r.Ba6.stopPropagation()}}))}let m=h("<div/>",{class:"child-container"}).appendTo(f);const b=2*this.settings.taskIcons.size,w=Math.sqrt(90*b/Math.PI),_=Math.sqrt(5*b/Math.sqrt(3))*Math.sqrt(3)/3*2,x=this.settings.taskIcons.size/2.5,k=100/a.length-.5+"%",S=this.settings.bucketSetting.showFixedWidth?this.settings.bucketSetting.width:k,C=this.settings.bucketSetting.showFixedWidth?`width:${k}; flex: 0 0 ${S}px`:k;a.forEach(((t,r)=>{n=e.dataPoints.filter((e=>e.status===t));let i=0,o=h("<div/>",{class:"laneExpanded-container status-panel",click:function(t){if(!h(t.target).hasClass("fa-minus")){let t=h(this);h(t).removeClass("laneCollapsed-container").addClass("laneExpanded-container"),h(t).find("div.laneCollapsed").addClass("hide"),h(t).find("div.lane-expanded").removeClass("hide"),h(t).find("div.lane-expanded").removeClass("hide"),h(t).css("flex",`0 0 ${S}px`),h(t).css("width",k)}},style:`width:${C}`}).appendTo(m),a=h("<div/>",{class:"lane-expanded"}).appendTo(o),s=h("<div/>",{class:"laneHeader",style:"display:flex"}).appendTo(a);!function(t,e,n,r){let i=h("<div/>",{class:"laneCollapsed hide"}).appendTo(e),o=h("<div/>",{style:"height:100%"}).appendTo(i),a=h("<div/>").appendTo(o);h("<span/>",{class:"laneCollapsed-cardCount",style:"text-shadow: 0 0 black;width:20px",text:t.length}).appendTo(o),h("<span/>",{class:"rotate-90 collapsed-panel-body",text:n}).appendTo(o),h("<span/>",{class:"fa fa-plus icon-plus"}).appendTo(a),h("<span/>",{class:"fa fa-minus icon-minus",style:"vertical-align:middle",click:function(t){let e=h(this).parents("div.status-panel");h(e).addClass("laneCollapsed-container").removeClass("laneExpanded-container"),h(e).find("div.laneCollapsed").removeClass("hide"),h(e).find("div.lane-expanded").addClass("hide"),h(e).css("width","2%"),h(e).css("display","inline-block"),h(e).css("flex","")}}).appendTo(r)}(n,o,t,s),h("<div/>",{class:"status-header",style:"margin:4px;font-weight:bold;display:inline-block;width:90%;text-overflow:ellipsis;overflow:hidden;height:25px",text:t}).appendTo(s),u="",n.forEach(((t,e)=>{let n=`<div class="task-body-container span-2 taskBodyContainer${r}" data-Priority="`+t.Priority+'" style="background-color:light'+t.color+';">'+`<div class="task-header taskHeader${r}" style="background-color:`+t.color+'">'+`<span class="task-header-font taskHeaderFont${r}">#`+t.taskNumber+"</span>"+`<div style="width: 30px; float: right; margin-right:2px; margin-top:1px;">\n          <svg width="100%" height="100%">\n          <path class="task-icon taskIcon${r}" d="${t.taskIconPath} ${"push-pin"===t.taskIconShape?"M"+-w/40+","+w/20+" L 0,"+w/2+" "+w/40+","+w/20:""}" fill="${t.taskIconColor}" stroke="${"star"===t.taskIconShape?"":"black"}"  style="transform: translate(${"heart"===t.taskIconShape?25:"crown"===t.taskIconShape?15:20}px,12px)  rotate(${"cross-x"===t.taskIconShape?45:"flag"===t.taskIconShape?-30:"push-pin"===t.taskIconShape?30:0}deg);"/>\n          <circle stroke="black" fill="none" r="${t.taskIconShape.includes("in-circle")?_:0}" cx="20" cy="${t.taskIconShape.includes("arrow")?12:14}"></circle>\n          <circle stroke="black" fill="black" r="${t.taskIconShape.includes("face")?x/10:0}"\n           cx="${20+3*Math.pow(-1,0)*x/8}" cy="${12-x/4}"></circle>\n           <circle stroke="black" fill="black" r="${t.taskIconShape.includes("face")?x/10:0}"\n           cx="${20+3*Math.pow(-1,1)*x/8}" cy="${12-x/4}"></circle>\n          </svg>\n          </div></div>`+`<div class="task-panel-body taskPanelBody${r}">`+`<h6 class="task-body-header taskBodyHeader${r}">`+t.task+"</h6>"+`<span class="task-body-font taskBodyFont${r}">`+t.taskDescription+"</span>"+`<span id=${t.taskIndex} class="task-body-font-assign taskBodyFontAssign${r}">`+t.assignTo+"</span></div></div>";u+=n,i=5===i?0:i})),h("<div/>",{class:"laneBody",html:u}).appendTo(a),d(n,`.taskBodyContainer${r}`),d(n,`.taskHeader${r}`),d(n,`.taskHeaderFont${r}`),d(n,`.taskPanelBody${r}`),d(n,`.taskBodyHeader${r}`),d(n,`.taskBodyFont${r}`),d(n,`.taskBodyFontAssign${r}`),d(n,`.taskIcon${r}`)}));const T=t=>!!new RegExp("^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$","i").test(t);let A=(100-this.settings.card.cardCol)/this.settings.card.cardCol;const M=a.length/this.settings.card.cardCol;r.td_(".task-body-container").style("width",`calc(${A}% - ${M}px)`),r.td_(".task-body-container").style("height",`${this.settings.card.height}%`),r.td_(".task-body-container").style("background-color",this.settings.card.cardColor),r.td_(".task-header").style("height",`${this.settings.card.headerHeight}%`),r.td_(".status-header").style("font-size",`${this.settings.font.statusFontSize}px`),r.td_(".task-header-font").style("font-size",`${this.settings.font.taskNumberFontSize}px`),r.td_(".task-body-header").style("font-size",`${this.settings.font.taskFontSize}px`),r.td_(".task-body-font").style("font-size",`${this.settings.font.descriptionFontSize}px`),r.td_(".task-body-font-assign").style("font-size",`${this.settings.font.resourceFontSize}px`),r.td_(".status-header").style("color",this.settings.font.statusFontColor),r.td_(".task-header-font").style("color",this.settings.font.taskNumberFontColor),r.td_(".task-body-header").style("color",this.settings.font.taskFontColor),r.td_(".task-body-font").style("color",this.settings.font.descriptionFontColor),r.td_(".task-body-font-assign").style("color",this.settings.font.resourceFontColor),r.td_(".task-body-font-assign").style("color",((t,n,r)=>{const o=+(0,i.Z)(r[n]).attr("id"),a=e.dataPoints[o].assignTo;return T(a)?"blue":`${this.settings.font.resourceFontColor}`})).on("mouseover",((t,n,r)=>{const o=+(0,i.Z)(r[n]).attr("id"),a=e.dataPoints[o].assignTo;T(a)&&(0,i.Z)(r[n]).style("text-decoration","underline")})).on("mouseleave",((t,n,r)=>{const o=+(0,i.Z)(r[n]).attr("id"),a=e.dataPoints[o].assignTo;T(a)&&(0,i.Z)(r[n]).style("text-decoration","none")})).on("click",((t,n,r)=>{const o=+(0,i.Z)(r[n]).attr("id"),a=e.dataPoints[o].assignTo;T(a)&&this.host.launchUrl(a)}));let E=0;h("div.status-panel").each((function(){h(this).height()>E&&(E=h(this).height())})),h("div.status-panel").height(E+g+60),h(".child-container").scroll((()=>{h(".child-container").offset.length>=E?h(".laneHeader").add("sticky"):h(".laneHeader").remove("sticky")}));let N=this.selectionManager,P=this.host.hostCapabilities.allowInteractions,Z=0;if(this.settings.bucketSetting.customSort&&(0,r.td_)(".status-header").call((0,r.ohM)().on("start",((t,e)=>{Z=event.x})).on("drag",((t,e)=>{let n=event.x;(0,i.Z)((0,r.td_)(".lane-expanded").nodes()[e]).attr("style",`transform: translate(${n-Z}px,0px)`)})).on("end",((t,e)=>{let n=event.x,r=o/a.length,i=Math.floor(n/r);a.forEach(((t,e)=>{e<i&&c.A[t]}));const s=a[e],u=a[i],l=e<i;e===i&&this.update(this.options),function(t,e,n,r){let i=[],o=[];Object.keys(c.A).forEach((t=>{o.push([t,c.A[t]])})),o.sort((function(t,e){return t[1]-e[1]})),o.forEach(((r,o)=>{const a=r[0];n?c.A[a]<c.A[e]?a!==t&&i.push(a):c.A[a]===c.A[e]?(i.push(e),i.push(t)):i.push(a):c.A[a]<c.A[e]?i.push(a):c.A[a]===c.A[e]?(i.push(t),i.push(e)):a!==t&&i.push(a)})),i.forEach(((t,e)=>{c.A[t]=e}));const a={objectName:"sortBy",selector:void 0,properties:{storeValues:JSON.stringify(c.A)}};r.host.persistProperties({merge:[a]}),r.update(r.options)}(s,u,l,this)}))),(0,l.$)())return void(0,l.e)(this,t,"This draft has expired","Please do contact Stratada to receive an updated draft of your visual","https://www.stratada.com/stratada-timeline/");let I=!1;a.forEach((t=>{e.dataPoints.filter((e=>e.status===t)).length>10&&(I=!0)})),a.length>3&&!this.hasServicePlans?(0,l.e)(this,t,"The Stratada Task Board Visual Standard version does not support more than three Buckets. Use filters to reduce your buckets to three or less.","To display more buckets along with many additional features, get the Stratada Task Board Visual Professional version.","https://www.stratada.com/stratada-task-board/"):!I||this.hasServicePlans?(this.renderTooltip((0,r.td_)(".task-panel-body"),2),this.renderTooltip((0,r.td_)(".task-icon"),1)):(0,l.e)(this,t,"The Stratada Task Board Visual Standard version does not support more than ten cards per bucket.  Use filters to reduce your cards to ten or less per bucket.","To display more tasks along with many additional features, get the Stratada Task Board Visual Professional version.","https://www.stratada.com/stratada-task-board/")}renderTooltip(t,e){let n=[];this.tooltipServiceWrapper.addTooltip(t,(t=>{if(n=[],1===e)return n.push({displayName:this.viewModel.taskIconDisplayName,value:t.data.taskIconValue}),n;if(2===e&&t.data){if(0===t.data.tooltips.length)return;return t.data.tooltips.forEach((t=>{n.push({displayName:t.displayName,value:t.value})})),n}}))}static isCorrectSettings(){let t=r.Ys(".stratada-logo").style("content").replace('url("',"").replace('")',"").split(","),e=t[0],n=t[1];function i(t){var e,n=0;if(0===t.length)return n;for(e=0;e<t.length;e++)n=(n<<5)-n+t.charCodeAt(e),n|=0;return n}function o(t){let e=r.Ys(t),n=e.style("opacity"),i=e.style("visibility"),o=e.style("opacity");return parseInt(n)>.7&&"hidden"!=i&&"collapse"!=i&&"none"!=o}return o(".stratada-logo-div")&&o("[title='Stratada']")&&o(".stratada-logo")&&-1810417147===i(e)&&-938241749===i(n)}handleContextMenu(t,e){t.on("contextmenu",(()=>{const t=event,n=t.target,r=(0,i.Z)(n).datum();e.showContextMenu((0,o.isObject)(r)?r.selectionId:{},{x:t.clientX,y:t.clientY}),t.preventDefault()}))}enumerateObjectInstances(t){let e=t.objectName,n=[];switch(e){case"card":n.push({objectName:e,properties:{taskNumberSorting:this.settings.card.taskNumberSorting,cardCol:this.settings.card.cardCol,height:this.settings.card.height,headerHeight:this.settings.card.headerHeight,cardColor:this.settings.card.cardColor,ascending:this.settings.card.ascending},validValues:{cardCol:{numberRange:{min:1,max:5}},height:{numberRange:{min:0,max:500}},headerHeight:{numberRange:{min:0,max:100}}},selector:null});break;case"font":n.push(function(t,e){return{objectName:t,properties:{statusFontSize:e.font.statusFontSize,statusFontColor:e.font.statusFontColor,taskNumberFontSize:e.font.taskNumberFontSize,taskNumberFontColor:e.font.taskNumberFontColor,taskFontSize:e.font.taskFontSize,taskFontColor:e.font.taskFontColor,descriptionFontSize:e.font.descriptionFontSize,descriptionFontColor:e.font.descriptionFontColor,resourceFontSize:e.font.resourceFontSize,resourceFontColor:e.font.resourceFontColor},validValues:{statusFontSize:{numberRange:{min:0,max:100}},taskNumberFontSize:{numberRange:{min:0,max:100}},taskFontSize:{numberRange:{min:0,max:100}},descriptionFontSize:{numberRange:{min:0,max:100}},resourceFontSize:{numberRange:{min:0,max:100}}},selector:null}}(e,this.settings));break;case"colorSelector":this.legendColors.sort(((t,e)=>t.value>e.value?1:t.value<e.value?-1:0)),this.legendColors.forEach((t=>{n.push({objectName:e,displayName:t.value,properties:{fill:{solid:{color:t.color}}},selector:t.selectionId.getSelector()})}));break;case"legend":n.push({objectName:e,displayName:"Legend",properties:{show:this.settings.legend.show,showTitle:this.settings.legend.showTitle,titleText:this.settings.legend.titleText,labelColor:this.settings.legend.labelColor,fontSize:this.settings.legend.fontSize},validValues:{fontSize:{numberRange:{min:1,max:25}}},selector:null});break;case"taskIcons":n.push({objectName:e,properties:{size:this.settings.taskIcons.size},validValues:{size:{numberRange:{min:1,max:1e3}}},selector:null}),this.taskIcons.length>0&&(this.taskIcons.sort(((t,e)=>t.value>e.value?1:t.value<e.value?-1:0)),this.taskIcons.forEach((t=>{null!==t.value&&n.push({objectName:e,displayName:t.value,properties:{fill:{solid:{color:t.color}},shape:t.shape},selector:t.selectionId.getSelector()})})));break;case"bucketSetting":n.push({objectName:e,properties:{showFixedWidth:this.settings.bucketSetting.showFixedWidth},validValues:{width:{numberRange:{min:0,max:1e4}}},selector:null}),this.settings.bucketSetting.showFixedWidth&&n.push({objectName:e,properties:{width:this.settings.bucketSetting.width},validValues:{width:{numberRange:{min:0,max:1e4}}},selector:null}),n.push({objectName:e,properties:{customSort:this.settings.bucketSetting.customSort},selector:null})}return n}}function d(t,e){r.td_(e).nodes().forEach(((e,n)=>{t.forEach(((i,o)=>{if(n===o){let n=[];n.push(t[o]),r.Ys(e).data(n)}}))}))}p.Config={xScalePadding:.1,solidOpacity:1,transparentOpacity:.5,margins:{top:0,right:0,bottom:25,left:30},xAxisFontMultiplier:.04}},7435:(t,e,n)=>{"use strict";n.d(e,{A:()=>l,S:()=>c});var r=n(6486),i=n(4279),o=n(3175),a=n(438);let s={},u={},l={};function c(t,e){let n=t.dataViews,c={dataPoints:[],settings:{},legendColors:[],taskIcons:[],status:[],taskIconDisplayName:""};if(!(n&&n[0]&&n[0].categorical&&n[0].categorical.categories&&n[0].categorical.categories[0].source))return c;let f,h,p,d,g,v,y,m,b=n[0].categorical,w=[];if(b.categories.forEach((t=>{t.source.roles.taskNumber&&(f=t),t.source.roles.task&&(h=t),t.source.roles.assignTo&&(p=t),t.source.roles.discription&&(v=t),t.source.roles.status&&(y=t),t.source.roles.priority&&(d=t),t.source.roles.taskIcon&&(g=t),t.source.roles.sortBy&&(m=t),t.source.roles.tooltip&&w.push(t)})),w=(0,r.uniqBy)(w,(t=>t.source.displayName)),!f)return c;let _=[],x=n[0].metadata.objects,k=(0,o.oh)(x);const S=n[0];(0,r.isObject)(S.metadata.objects)&&(0,r.isObject)(S.metadata.objects.legend)&&(0,r.isString)(S.metadata.objects.legend.storeValues)&&(s=JSON.parse(`${S.metadata.objects.legend.storeValues}`));let C=function(t,e){let n=(0,r.uniq)(e.values),i=[],a=t.colorPalette;return n.forEach(((n,r)=>{let u=a.getColor(`${n}`).value;s[n]&&(u=s[n]);let l={solid:{color:u}},c=(0,o.b6)(e,r,"colorSelector","fill",l).solid.color,f=t.createSelectionIdBuilder().withCategory(e,r).createSelectionId();s[n]=c,i.push({value:n,color:c,selectionId:f})})),i}(e,d);!function(t,e){if((0,r.isObject)(t.metadata.objects)&&(0,r.isObject)(t.metadata.objects.legend)&&(0,r.isString)(t.metadata.objects.legend.storeValues)){if(JSON.stringify(s)!==t.metadata.objects.legend.storeValues){const t={objectName:"legend",selector:void 0,properties:{storeValues:JSON.stringify(s)}};e.persistProperties({merge:[t]})}}else{const t={objectName:"legend",selector:void 0,properties:{storeValues:JSON.stringify(s)}};e.persistProperties({merge:[t]})}}(S,e),(0,r.isObject)(S.metadata.objects)&&(0,r.isObject)(S.metadata.objects.taskIcons)&&(0,r.isString)(S.metadata.objects.taskIcons.storeValues)&&(u=JSON.parse(`${S.metadata.objects.taskIcons.storeValues}`));let T=void 0!==g?function(t,e){let n=(0,r.uniq)(e.values),a=[],s=t.colorPalette;return n.forEach(((n,r)=>{let l=s.getColor(`${n}`).value,c=i.j.Diamond;u[n]&&(l=u[n][1],c=u[n][0]);let f={solid:{color:l}},h=(0,o.b6)(e,r,"taskIcons","fill",f).solid.color,p=(0,o.b6)(e,r,"taskIcons","shape",c),d=t.createSelectionIdBuilder().withCategory(e,r).createSelectionId();u[n]=[p,h],a.push({value:n,color:h,shape:p,selectionId:d})})),a}(e,g):[];!function(t,e){if((0,r.isObject)(t.metadata.objects)&&(0,r.isObject)(t.metadata.objects.taskIcons)&&(0,r.isString)(t.metadata.objects.taskIcons.storeValues)){if(JSON.stringify(u)!==t.metadata.objects.taskIcons.storeValues){const t={objectName:"taskIcons",selector:void 0,properties:{storeValues:JSON.stringify(u)}};e.persistProperties({merge:[t]})}}else{const t={objectName:"taskIcons",selector:void 0,properties:{storeValues:JSON.stringify(u)}};e.persistProperties({merge:[t]})}}(S,e);const A=10*k.taskIcons.size;for(let t=0,n=f.values.length;t<n;t++){let n=[];const r=C.find((e=>d.values[t]===e.value)).color,i=T.length>0?T.find((e=>{if(null!==e)return g.values[t]===e.value})).color:"";let o="",s="";if(T.length>0){let e=T.find((e=>g.values[t]===e.value));s=e.value?e.shape.toString().toLowerCase():"",o=(0,a.u)(A,s)}w.forEach((e=>{n.push({displayName:e.source.displayName,value:`${e.source.type.dateTime?new Date(`${e.values[t]}`).toDateString():e.values[t]}`})})),_.push({category:f.values[t]+"",status:y&&y.values[t]?y.values[t]+"":"",taskNumber:f?f.values[t]+"":"",task:h?h.values[t]+"":"",taskSort:0,taskDescription:v?v.values[t]+"":"",assignTo:p?p.values[t]+"":"",Priority:d?d.values[t]+"":"",color:r,selectionId:e.createSelectionIdBuilder().withCategory(f,t).createSelectionId(),taskIconValue:g?g.values[t]+"":"",taskIconPath:o,taskIconColor:i,taskIconShape:s,sortBy:m?m.values[t]+"":"",tooltips:n,taskIndex:t})}const M=[];_.forEach(((t,e)=>{-1===M.indexOf(t.status)&&M.push(t.status)})),(0,r.isObject)(S.metadata.objects)&&(0,r.isObject)(S.metadata.objects.sortBy)&&(0,r.isString)(S.metadata.objects.sortBy.storeValues)&&(l=JSON.parse(`${S.metadata.objects.sortBy.storeValues}`)),M.forEach(((t,e)=>{t in l||(l[t]=Object.keys(l).length)}));let E=[];Object.keys(l).forEach((t=>{E.push([t,l[t]])})),E.sort((function(t,e){return t[1]-e[1]}));let N=[];return E.forEach((t=>{-1!==M.indexOf(t[0])&&N.push(t[0])})),k.bucketSetting.customSort||(N=M),void 0!==m&&(k.card.ascending?_.sort(((t,e)=>t.sortBy>e.sortBy?1:t.sortBy<e.sortBy?-1:0)):_.sort(((t,e)=>t.sortBy<e.sortBy?1:t.sortBy>e.sortBy?-1:0))),k.card.taskNumberSorting&&function(t){let e=0;t.forEach((t=>{let n=t.taskNumber.split(".").length;n>e&&(e=n)})),t.forEach(((t,n)=>{let r=t.taskNumber,i=0,o=e-1;r.split(".").forEach(((t,e)=>{let n=Math.pow(10,o--),r=parseInt(t);i+=r*n})),t.taskSort=i})),t.sort(((t,e)=>t.taskSort>e.taskSort?1:t.taskSort<e.taskSort?-1:0))}(_),{dataPoints:_,settings:k,legendColors:C,taskIconDisplayName:g?g.source.displayName+"":"",taskIcons:T,status:N}}},4792:(t,e,n)=>{"use strict";var r=Array.prototype;r.slice,r.map},1077:(t,e,n)=>{"use strict";function r(t,e){return t<e?-1:t>e?1:t>=e?0:NaN}n.d(e,{Z:()=>r})},4355:(t,e,n)=>{"use strict";var r=n(1077),i=(0,n(9173).Z)(r.Z);i.right,i.left},9173:(t,e,n)=>{"use strict";n.d(e,{Z:()=>i});var r=n(1077);function i(t){var e;return 1===t.length&&(e=t,t=function(t,n){return(0,r.Z)(e(t),n)}),{left:function(e,n,r,i){for(null==r&&(r=0),null==i&&(i=e.length);r<i;){var o=r+i>>>1;t(e[o],n)<0?r=o+1:i=o}return r},right:function(e,n,r,i){for(null==r&&(r=0),null==i&&(i=e.length);r<i;){var o=r+i>>>1;t(e[o],n)>0?i=o:r=o+1}return r}}}},902:(t,e,n)=>{"use strict";n(4792),n(4355),n(7614)},91:(t,e,n)=>{"use strict";n(4355),n(902),n(4081),n(7614)},4081:(t,e,n)=>{"use strict";n(4792)},7614:(t,e,n)=>{"use strict";Math.sqrt(50),Math.sqrt(10),Math.sqrt(2)},4844:(t,e,n)=>{"use strict";Array.prototype.slice},7953:(t,e,n)=>{"use strict";n(4844)},9216:(t,e,n)=>{"use strict";n(7953)},514:(t,e,n)=>{"use strict";function r(t){return{type:t}}n(2263),["w","e"].map(r),["n","s"].map(r),["n","w","e","s","nw","ne","sw","se"].map(r)},4697:(t,e,n)=>{"use strict";n(514)},2533:(t,e,n)=>{"use strict";Array.prototype.slice},8682:(t,e,n)=>{"use strict";n(91),n(9273)},8860:(t,e,n)=>{"use strict";n(8682),n(146)},9273:(t,e,n)=>{"use strict";Math.cos,Math.sin,Math.PI,Math.max},146:(t,e,n)=>{"use strict";n(2533),n(9273)},2300:(t,e,n)=>{"use strict";n(9226),n(7719),n(3998)},3998:(t,e,n)=>{"use strict";n.d(e,{O:()=>r,Z:()=>a});var r="$";function i(){}function o(t,e){var n=new i;if(t instanceof i)t.each((function(t,e){n.set(e,t)}));else if(Array.isArray(t)){var r,o=-1,a=t.length;if(null==e)for(;++o<a;)n.set(o,t[o]);else for(;++o<a;)n.set(e(r=t[o],o,t),r)}else if(t)for(var s in t)n.set(s,t[s]);return n}i.prototype=o.prototype={constructor:i,has:function(t){return r+t in this},get:function(t){return this[r+t]},set:function(t,e){return this[r+t]=e,this},remove:function(t){var e=r+t;return e in this&&delete this[e]},clear:function(){for(var t in this)t[0]===r&&delete this[t]},keys:function(){var t=[];for(var e in this)e[0]===r&&t.push(e.slice(1));return t},values:function(){var t=[];for(var e in this)e[0]===r&&t.push(this[e]);return t},entries:function(){var t=[];for(var e in this)e[0]===r&&t.push({key:e.slice(1),value:this[e]});return t},size:function(){var t=0;for(var e in this)e[0]===r&&++t;return t},empty:function(){for(var t in this)if(t[0]===r)return!1;return!0},each:function(t){for(var e in this)e[0]===r&&t(this[e],e.slice(1),this)}};const a=o},9226:(t,e,n)=>{"use strict";n(3998)},7719:(t,e,n)=>{"use strict";var r=n(3998);function i(){}var o=r.Z.prototype;i.prototype=function(t,e){var n=new i;if(t instanceof i)t.each((function(t){n.add(t)}));else if(t){var r=-1,o=t.length;if(null==e)for(;++r<o;)n.add(t[r]);else for(;++r<o;)n.add(e(t[r],r,t))}return n}.prototype={constructor:i,has:o.has,add:function(t){return t+="",this[r.O+t]=t,this},remove:o.remove,clear:o.clear,values:o.keys,size:o.size,empty:o.empty,each:o.each}},6372:(t,e,n)=>{"use strict";n.d(e,{B8:()=>S,ZP:()=>w});var r=n(4087);function i(){}var o=.7,a=1/o,s="\\s*([+-]?\\d+)\\s*",u="\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",l="\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",c=/^#([0-9a-f]{3,8})$/,f=new RegExp("^rgb\\("+[s,s,s]+"\\)$"),h=new RegExp("^rgb\\("+[l,l,l]+"\\)$"),p=new RegExp("^rgba\\("+[s,s,s,u]+"\\)$"),d=new RegExp("^rgba\\("+[l,l,l,u]+"\\)$"),g=new RegExp("^hsl\\("+[u,l,l]+"\\)$"),v=new RegExp("^hsla\\("+[u,l,l,u]+"\\)$"),y={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074};function m(){return this.rgb().formatHex()}function b(){return this.rgb().formatRgb()}function w(t){var e,n;return t=(t+"").trim().toLowerCase(),(e=c.exec(t))?(n=e[1].length,e=parseInt(e[1],16),6===n?_(e):3===n?new C(e>>8&15|e>>4&240,e>>4&15|240&e,(15&e)<<4|15&e,1):8===n?x(e>>24&255,e>>16&255,e>>8&255,(255&e)/255):4===n?x(e>>12&15|e>>8&240,e>>8&15|e>>4&240,e>>4&15|240&e,((15&e)<<4|15&e)/255):null):(e=f.exec(t))?new C(e[1],e[2],e[3],1):(e=h.exec(t))?new C(255*e[1]/100,255*e[2]/100,255*e[3]/100,1):(e=p.exec(t))?x(e[1],e[2],e[3],e[4]):(e=d.exec(t))?x(255*e[1]/100,255*e[2]/100,255*e[3]/100,e[4]):(e=g.exec(t))?E(e[1],e[2]/100,e[3]/100,1):(e=v.exec(t))?E(e[1],e[2]/100,e[3]/100,e[4]):y.hasOwnProperty(t)?_(y[t]):"transparent"===t?new C(NaN,NaN,NaN,0):null}function _(t){return new C(t>>16&255,t>>8&255,255&t,1)}function x(t,e,n,r){return r<=0&&(t=e=n=NaN),new C(t,e,n,r)}function k(t){return t instanceof i||(t=w(t)),t?new C((t=t.rgb()).r,t.g,t.b,t.opacity):new C}function S(t,e,n,r){return 1===arguments.length?k(t):new C(t,e,n,null==r?1:r)}function C(t,e,n,r){this.r=+t,this.g=+e,this.b=+n,this.opacity=+r}function T(){return"#"+M(this.r)+M(this.g)+M(this.b)}function A(){var t=this.opacity;return(1===(t=isNaN(t)?1:Math.max(0,Math.min(1,t)))?"rgb(":"rgba(")+Math.max(0,Math.min(255,Math.round(this.r)||0))+", "+Math.max(0,Math.min(255,Math.round(this.g)||0))+", "+Math.max(0,Math.min(255,Math.round(this.b)||0))+(1===t?")":", "+t+")")}function M(t){return((t=Math.max(0,Math.min(255,Math.round(t)||0)))<16?"0":"")+t.toString(16)}function E(t,e,n,r){return r<=0?t=e=n=NaN:n<=0||n>=1?t=e=NaN:e<=0&&(t=NaN),new P(t,e,n,r)}function N(t){if(t instanceof P)return new P(t.h,t.s,t.l,t.opacity);if(t instanceof i||(t=w(t)),!t)return new P;if(t instanceof P)return t;var e=(t=t.rgb()).r/255,n=t.g/255,r=t.b/255,o=Math.min(e,n,r),a=Math.max(e,n,r),s=NaN,u=a-o,l=(a+o)/2;return u?(s=e===a?(n-r)/u+6*(n<r):n===a?(r-e)/u+2:(e-n)/u+4,u/=l<.5?a+o:2-a-o,s*=60):u=l>0&&l<1?0:s,new P(s,u,l,t.opacity)}function P(t,e,n,r){this.h=+t,this.s=+e,this.l=+n,this.opacity=+r}function Z(t,e,n){return 255*(t<60?e+(n-e)*t/60:t<180?n:t<240?e+(n-e)*(240-t)/60:e)}(0,r.Z)(i,w,{copy:function(t){return Object.assign(new this.constructor,this,t)},displayable:function(){return this.rgb().displayable()},hex:m,formatHex:m,formatHsl:function(){return N(this).formatHsl()},formatRgb:b,toString:b}),(0,r.Z)(C,S,(0,r.l)(i,{brighter:function(t){return t=null==t?a:Math.pow(a,t),new C(this.r*t,this.g*t,this.b*t,this.opacity)},darker:function(t){return t=null==t?o:Math.pow(o,t),new C(this.r*t,this.g*t,this.b*t,this.opacity)},rgb:function(){return this},displayable:function(){return-.5<=this.r&&this.r<255.5&&-.5<=this.g&&this.g<255.5&&-.5<=this.b&&this.b<255.5&&0<=this.opacity&&this.opacity<=1},hex:T,formatHex:T,formatRgb:A,toString:A})),(0,r.Z)(P,(function(t,e,n,r){return 1===arguments.length?N(t):new P(t,e,n,null==r?1:r)}),(0,r.l)(i,{brighter:function(t){return t=null==t?a:Math.pow(a,t),new P(this.h,this.s,this.l*t,this.opacity)},darker:function(t){return t=null==t?o:Math.pow(o,t),new P(this.h,this.s,this.l*t,this.opacity)},rgb:function(){var t=this.h%360+360*(this.h<0),e=isNaN(t)||isNaN(this.s)?0:this.s,n=this.l,r=n+(n<.5?n:1-n)*e,i=2*n-r;return new C(Z(t>=240?t-240:t+120,i,r),Z(t,i,r),Z(t<120?t+240:t-120,i,r),this.opacity)},displayable:function(){return(0<=this.s&&this.s<=1||isNaN(this.s))&&0<=this.l&&this.l<=1&&0<=this.opacity&&this.opacity<=1},formatHsl:function(){var t=this.opacity;return(1===(t=isNaN(t)?1:Math.max(0,Math.min(1,t)))?"hsl(":"hsla(")+(this.h||0)+", "+100*(this.s||0)+"%, "+100*(this.l||0)+"%"+(1===t?")":", "+t+")")}}))},4087:(t,e,n)=>{"use strict";function r(t,e,n){t.prototype=e.prototype=n,n.constructor=t}function i(t,e){var n=Object.create(t.prototype);for(var r in e)n[r]=e[r];return n}n.d(e,{Z:()=>r,l:()=>i})},9229:(t,e,n)=>{"use strict";Array.prototype.slice},9955:(t,e,n)=>{"use strict";n(91),n(9229)},3650:(t,e,n)=>{"use strict";n(91),n(9229),n(9955)},2833:(t,e,n)=>{"use strict";n(9955),n(3650)},2626:(t,e,n)=>{"use strict";n.d(e,{Z:()=>l});var r={value:function(){}};function i(){for(var t,e=0,n=arguments.length,r={};e<n;++e){if(!(t=arguments[e]+"")||t in r||/[\s.]/.test(t))throw new Error("illegal type: "+t);r[t]=[]}return new o(r)}function o(t){this._=t}function a(t,e){return t.trim().split(/^|\s+/).map((function(t){var n="",r=t.indexOf(".");if(r>=0&&(n=t.slice(r+1),t=t.slice(0,r)),t&&!e.hasOwnProperty(t))throw new Error("unknown type: "+t);return{type:t,name:n}}))}function s(t,e){for(var n,r=0,i=t.length;r<i;++r)if((n=t[r]).name===e)return n.value}function u(t,e,n){for(var i=0,o=t.length;i<o;++i)if(t[i].name===e){t[i]=r,t=t.slice(0,i).concat(t.slice(i+1));break}return null!=n&&t.push({name:e,value:n}),t}o.prototype=i.prototype={constructor:o,on:function(t,e){var n,r=this._,i=a(t+"",r),o=-1,l=i.length;if(!(arguments.length<2)){if(null!=e&&"function"!=typeof e)throw new Error("invalid callback: "+e);for(;++o<l;)if(n=(t=i[o]).type)r[n]=u(r[n],t.name,e);else if(null==e)for(n in r)r[n]=u(r[n],t.name,null);return this}for(;++o<l;)if((n=(t=i[o]).type)&&(n=s(r[n],t.name)))return n},copy:function(){var t={},e=this._;for(var n in e)t[n]=e[n].slice();return new o(t)},call:function(t,e){if((n=arguments.length-2)>0)for(var n,r,i=new Array(n),o=0;o<n;++o)i[o]=arguments[o+2];if(!this._.hasOwnProperty(t))throw new Error("unknown type: "+t);for(o=0,n=(r=this._[t]).length;o<n;++o)r[o].value.apply(e,i)},apply:function(t,e,n){if(!this._.hasOwnProperty(t))throw new Error("unknown type: "+t);for(var r=this._[t],i=0,o=r.length;i<o;++i)r[i].value.apply(e,n)}};const l=i},2135:(t,e,n)=>{"use strict";function r(t){return function(){return t}}n.d(e,{Z:()=>r})},9815:(t,e,n)=>{"use strict";n.d(e,{Z:()=>v});var r=n(2626),i=n(5109),o=n(3095),a=n(4017),s=n(4793),u=n(72),l=n(4299),c=n(2135),f=n(347);function h(){return!i.B.ctrlKey&&!i.B.button}function p(){return this.parentNode}function d(t){return null==t?{x:i.B.x,y:i.B.y}:t}function g(){return navigator.maxTouchPoints||"ontouchstart"in this}function v(){var t,e,n,v,y=h,m=p,b=d,w=g,_={},x=(0,r.Z)("start","drag","end"),k=0,S=0;function C(t){t.on("mousedown.drag",T).filter(w).on("touchstart.drag",E).on("touchmove.drag",N).on("touchend.drag touchcancel.drag",P).style("touch-action","none").style("-webkit-tap-highlight-color","rgba(0,0,0,0)")}function T(){if(!v&&y.apply(this,arguments)){var r=Z("mouse",m.apply(this,arguments),o.Z,this,arguments);r&&((0,a.Z)(i.B.view).on("mousemove.drag",A,!0).on("mouseup.drag",M,!0),(0,u.Z)(i.B.view),(0,l.r)(),n=!1,t=i.B.clientX,e=i.B.clientY,r("start"))}}function A(){if((0,l.Z)(),!n){var r=i.B.clientX-t,o=i.B.clientY-e;n=r*r+o*o>S}_.mouse("drag")}function M(){(0,a.Z)(i.B.view).on("mousemove.drag mouseup.drag",null),(0,u.D)(i.B.view,n),(0,l.Z)(),_.mouse("end")}function E(){if(y.apply(this,arguments)){var t,e,n=i.B.changedTouches,r=m.apply(this,arguments),o=n.length;for(t=0;t<o;++t)(e=Z(n[t].identifier,r,s.Z,this,arguments))&&((0,l.r)(),e("start"))}}function N(){var t,e,n=i.B.changedTouches,r=n.length;for(t=0;t<r;++t)(e=_[n[t].identifier])&&((0,l.Z)(),e("drag"))}function P(){var t,e,n=i.B.changedTouches,r=n.length;for(v&&clearTimeout(v),v=setTimeout((function(){v=null}),500),t=0;t<r;++t)(e=_[n[t].identifier])&&((0,l.r)(),e("end"))}function Z(t,e,n,r,o){var a,s,u,l=n(e,t),c=x.copy();if((0,i._H)(new f.Z(C,"beforestart",a,t,k,l[0],l[1],0,0,c),(function(){return null!=(i.B.subject=a=b.apply(r,o))&&(s=a.x-l[0]||0,u=a.y-l[1]||0,!0)})))return function h(p){var d,g=l;switch(p){case"start":_[t]=h,d=k++;break;case"end":delete _[t],--k;case"drag":l=n(e,t),d=k}(0,i._H)(new f.Z(C,p,a,t,d,l[0]+s,l[1]+u,l[0]-g[0],l[1]-g[1],c),c.apply,c,[p,r,o])}}return C.filter=function(t){return arguments.length?(y="function"==typeof t?t:(0,c.Z)(!!t),C):y},C.container=function(t){return arguments.length?(m="function"==typeof t?t:(0,c.Z)(t),C):m},C.subject=function(t){return arguments.length?(b="function"==typeof t?t:(0,c.Z)(t),C):b},C.touchable=function(t){return arguments.length?(w="function"==typeof t?t:(0,c.Z)(!!t),C):w},C.on=function(){var t=x.on.apply(x,arguments);return t===x?C:t},C.clickDistance=function(t){return arguments.length?(S=(t=+t)*t,C):Math.sqrt(S)},C}},347:(t,e,n)=>{"use strict";function r(t,e,n,r,i,o,a,s,u,l){this.target=t,this.type=e,this.subject=n,this.identifier=r,this.active=i,this.x=o,this.y=a,this.dx=s,this.dy=u,this._=l}n.d(e,{Z:()=>r}),r.prototype.on=function(){var t=this._.on.apply(this._,arguments);return t===this._?this:t}},4840:(t,e,n)=>{"use strict";n.d(e,{oh:()=>r.Z});var r=n(9815)},72:(t,e,n)=>{"use strict";n.d(e,{D:()=>a,Z:()=>o});var r=n(4017),i=n(4299);function o(t){var e=t.document.documentElement,n=(0,r.Z)(t).on("dragstart.drag",i.Z,!0);"onselectstart"in e?n.on("selectstart.drag",i.Z,!0):(e.__noselect=e.style.MozUserSelect,e.style.MozUserSelect="none")}function a(t,e){var n=t.document.documentElement,o=(0,r.Z)(t).on("dragstart.drag",null);e&&(o.on("click.drag",i.Z,!0),setTimeout((function(){o.on("click.drag",null)}),0)),"onselectstart"in n?o.on("selectstart.drag",null):(n.style.MozUserSelect=n.__noselect,delete n.__noselect)}},4299:(t,e,n)=>{"use strict";n.d(e,{Z:()=>o,r:()=>i});var r=n(5109);function i(){r.B.stopImmediatePropagation()}function o(){r.B.preventDefault(),r.B.stopImmediatePropagation()}},8716:(t,e,n)=>{"use strict";function r(t){return((t*=2)<=1?t*t*t:(t-=2)*t*t+2)/2}n.d(e,{tw:()=>r})},5224:(t,e,n)=>{"use strict";n(8571),n(3231),n(3238)},8571:(t,e,n)=>{"use strict";n(2300)},3231:(t,e,n)=>{"use strict";n(3238)},3238:(t,e,n)=>{"use strict";n(2300),Math.PI,Math.sqrt(5)},9885:(t,e,n)=>{"use strict";function r(t,e,n,r,i){var o=t*t,a=o*t;return((1-3*t+3*o-a)*e+(4-6*o+3*a)*n+(1+3*t+3*o-3*a)*r+a*i)/6}function i(t){var e=t.length-1;return function(n){var i=n<=0?n=0:n>=1?(n=1,e-1):Math.floor(n*e),o=t[i],a=t[i+1],s=i>0?t[i-1]:2*o-a,u=i<e-1?t[i+2]:2*a-o;return r((n-i/e)*e,s,o,a,u)}}n.d(e,{Z:()=>i,t:()=>r})},5692:(t,e,n)=>{"use strict";n.d(e,{Z:()=>i});var r=n(9885);function i(t){var e=t.length;return function(n){var i=Math.floor(((n%=1)<0?++n:n)*e),o=t[(i+e-1)%e],a=t[i%e],s=t[(i+1)%e],u=t[(i+2)%e];return(0,r.t)((n-i/e)*e,o,a,s,u)}}},5910:(t,e,n)=>{"use strict";n.d(e,{ZP:()=>o,yi:()=>i});var r=n(5302);function i(t){return 1==(t=+t)?o:function(e,n){return n-e?function(t,e,n){return t=Math.pow(t,n),e=Math.pow(e,n)-t,n=1/n,function(r){return Math.pow(t+r*e,n)}}(e,n,t):(0,r.Z)(isNaN(e)?n:e)}}function o(t,e){var n=e-t;return n?function(t,e){return function(n){return t+n*e}}(t,n):(0,r.Z)(isNaN(t)?e:t)}},5302:(t,e,n)=>{"use strict";function r(t){return function(){return t}}n.d(e,{Z:()=>r})},3626:(t,e,n)=>{"use strict";function r(t,e){return t=+t,e=+e,function(n){return t*(1-n)+e*n}}n.d(e,{Z:()=>r})},3414:(t,e,n)=>{"use strict";n.d(e,{ZP:()=>s});var r=n(6372),i=n(9885),o=n(5692),a=n(5910);const s=function t(e){var n=(0,a.yi)(e);function i(t,e){var i=n((t=(0,r.B8)(t)).r,(e=(0,r.B8)(e)).r),o=n(t.g,e.g),s=n(t.b,e.b),u=(0,a.ZP)(t.opacity,e.opacity);return function(e){return t.r=i(e),t.g=o(e),t.b=s(e),t.opacity=u(e),t+""}}return i.gamma=t,i}(1);function u(t){return function(e){var n,i,o=e.length,a=new Array(o),s=new Array(o),u=new Array(o);for(n=0;n<o;++n)i=(0,r.B8)(e[n]),a[n]=i.r||0,s[n]=i.g||0,u[n]=i.b||0;return a=t(a),s=t(s),u=t(u),i.opacity=1,function(t){return i.r=a(t),i.g=s(t),i.b=u(t),i+""}}}u(i.Z),u(o.Z)},9843:(t,e,n)=>{"use strict";n.d(e,{Z:()=>a});var r=n(3626),i=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,o=new RegExp(i.source,"g");function a(t,e){var n,a,s,u=i.lastIndex=o.lastIndex=0,l=-1,c=[],f=[];for(t+="",e+="";(n=i.exec(t))&&(a=o.exec(e));)(s=a.index)>u&&(s=e.slice(u,s),c[l]?c[l]+=s:c[++l]=s),(n=n[0])===(a=a[0])?c[l]?c[l]+=a:c[++l]=a:(c[++l]=null,f.push({i:l,x:(0,r.Z)(n,a)})),u=o.lastIndex;return u<e.length&&(s=e.slice(u),c[l]?c[l]+=s:c[++l]=s),c.length<2?f[0]?function(t){return function(e){return t(e)+""}}(f[0].x):function(t){return function(){return t}}(e):(e=f.length,function(t){for(var n,r=0;r<e;++r)c[(n=f[r]).i]=n.x(t);return c.join("")})}},6511:(t,e,n)=>{"use strict";n.d(e,{Z:()=>o,y:()=>i});var r=180/Math.PI,i={translateX:0,translateY:0,rotate:0,skewX:0,scaleX:1,scaleY:1};function o(t,e,n,i,o,a){var s,u,l;return(s=Math.sqrt(t*t+e*e))&&(t/=s,e/=s),(l=t*n+e*i)&&(n-=t*l,i-=e*l),(u=Math.sqrt(n*n+i*i))&&(n/=u,i/=u,l/=u),t*i<e*n&&(t=-t,e=-e,l=-l,s=-s),{translateX:o,translateY:a,rotate:Math.atan2(e,t)*r,skewX:Math.atan(l)*r,scaleX:s,scaleY:u}}},6697:(t,e,n)=>{"use strict";n.d(e,{Y:()=>a,w:()=>s});var r=n(3626),i=n(2490);function o(t,e,n,i){function o(t){return t.length?t.pop()+" ":""}return function(a,s){var u=[],l=[];return a=t(a),s=t(s),function(t,i,o,a,s,u){if(t!==o||i!==a){var l=s.push("translate(",null,e,null,n);u.push({i:l-4,x:(0,r.Z)(t,o)},{i:l-2,x:(0,r.Z)(i,a)})}else(o||a)&&s.push("translate("+o+e+a+n)}(a.translateX,a.translateY,s.translateX,s.translateY,u,l),function(t,e,n,a){t!==e?(t-e>180?e+=360:e-t>180&&(t+=360),a.push({i:n.push(o(n)+"rotate(",null,i)-2,x:(0,r.Z)(t,e)})):e&&n.push(o(n)+"rotate("+e+i)}(a.rotate,s.rotate,u,l),function(t,e,n,a){t!==e?a.push({i:n.push(o(n)+"skewX(",null,i)-2,x:(0,r.Z)(t,e)}):e&&n.push(o(n)+"skewX("+e+i)}(a.skewX,s.skewX,u,l),function(t,e,n,i,a,s){if(t!==n||e!==i){var u=a.push(o(a)+"scale(",null,",",null,")");s.push({i:u-4,x:(0,r.Z)(t,n)},{i:u-2,x:(0,r.Z)(e,i)})}else 1===n&&1===i||a.push(o(a)+"scale("+n+","+i+")")}(a.scaleX,a.scaleY,s.scaleX,s.scaleY,u,l),a=s=null,function(t){for(var e,n=-1,r=l.length;++n<r;)u[(e=l[n]).i]=e.x(t);return u.join("")}}}var a=o(i.z,"px, ","px)","deg)"),s=o(i.X,", ",")",")")},2490:(t,e,n)=>{"use strict";n.d(e,{X:()=>l,z:()=>u});var r,i,o,a,s=n(6511);function u(t){return"none"===t?s.y:(r||(r=document.createElement("DIV"),i=document.documentElement,o=document.defaultView),r.style.transform=t,t=o.getComputedStyle(i.appendChild(r),null).getPropertyValue("transform"),i.removeChild(r),t=t.slice(7,-1).split(","),(0,s.Z)(+t[0],+t[1],+t[2],+t[3],+t[4],+t[5]))}function l(t){return null==t?s.y:(a||(a=document.createElementNS("http://www.w3.org/2000/svg","g")),a.setAttribute("transform",t),(t=a.transform.baseVal.consolidate())?(t=t.matrix,(0,s.Z)(t.a,t.b,t.c,t.d,t.e,t.f)):s.y)}},9441:(t,e,n)=>{"use strict";var r=n(2763),i=n(4646);!function t(e){function n(t){var n=i.Z.source(e)(t);return function(){return n()/t}}return n.source=t,n}(r.Z)},2763:(t,e,n)=>{"use strict";function r(){return Math.random()}n.d(e,{Z:()=>r})},4807:(t,e,n)=>{"use strict";!function t(e){function n(t){return function(){return-Math.log(1-e())/t}}return n.source=t,n}(n(2763).Z)},1638:(t,e,n)=>{"use strict";n(5697),n(8972),n(405),n(9441),n(4646),n(4807)},4646:(t,e,n)=>{"use strict";n.d(e,{Z:()=>r});const r=function t(e){function n(t){return function(){for(var n=0,r=0;r<t;++r)n+=e();return n}}return n.source=t,n}(n(2763).Z)},405:(t,e,n)=>{"use strict";var r=n(2763),i=n(8972);!function t(e){function n(){var t=i.Z.source(e).apply(this,arguments);return function(){return Math.exp(t())}}return n.source=t,n}(r.Z)},8972:(t,e,n)=>{"use strict";n.d(e,{Z:()=>r});const r=function t(e){function n(t,n){var r,i;return t=null==t?0:+t,n=null==n?1:+n,function(){var o;if(null!=r)o=r,r=null;else do{r=2*e()-1,o=2*e()-1,i=r*r+o*o}while(!i||i>1);return t+n*o*Math.sqrt(-2*Math.log(i)/i)}}return n.source=t,n}(n(2763).Z)},5697:(t,e,n)=>{"use strict";!function t(e){function n(t,n){return t=null==t?0:+t,n=null==n?1:+n,1===arguments.length?(n=t,t=0):n-=t,function(){return e()*n+t}}return n.source=t,n}(n(2763).Z)},4057:(t,e,n)=>{"use strict";var r=Array.prototype;r.map,r.slice},9649:(t,e,n)=>{"use strict";n(91),n(7603)},5236:(t,e,n)=>{"use strict";n(91),n(4057)},4547:(t,e,n)=>{"use strict";n(5236),n(289),n(2685),n(4250),n(5437),n(5128)},9898:(t,e,n)=>{"use strict";n(4057),n(289)},5315:(t,e,n)=>{"use strict";n(9649),n(9898),n(289),n(2685),n(5437),n(7603),n(5128),n(2110),n(6602),n(6297),n(8383),n(819),n(4250),n(9313),n(4547),n(7197)},289:(t,e,n)=>{"use strict";n(91),n(5236),n(7197)},2685:(t,e,n)=>{"use strict";n(91),n(5236)},7603:(t,e,n)=>{"use strict";n(2300),n(4057)},5128:(t,e,n)=>{"use strict";n(289),n(5236)},2110:(t,e,n)=>{"use strict";n(91),n(4057)},6602:(t,e,n)=>{"use strict";n(91),n(4057),n(289)},4250:(t,e,n)=>{"use strict";n(5236),n(289),n(2685),n(5437),n(5128)},9313:(t,e,n)=>{"use strict";n(91),n(5236)},5437:(t,e,n)=>{"use strict";n(289),n(5236)},6297:(t,e,n)=>{"use strict";n(91),n(4057)},7197:(t,e,n)=>{"use strict";n(91)},8383:(t,e,n)=>{"use strict";n(91),n(4057),n(5236)},819:(t,e,n)=>{"use strict";n(8383)},9077:(t,e,n)=>{"use strict";function r(t){return function(){return t}}n.d(e,{Z:()=>r})},789:(t,e,n)=>{"use strict";n.d(e,{Z:()=>s});var r=n(3888),i=n(1986);function o(t){return function(){var e=this.ownerDocument,n=this.namespaceURI;return n===i.P&&e.documentElement.namespaceURI===i.P?e.createElement(t):e.createElementNS(n,t)}}function a(t){return function(){return this.ownerDocument.createElementNS(t.space,t.local)}}function s(t){var e=(0,r.Z)(t);return(e.local?a:o)(e)}},9825:(t,e,n)=>{"use strict";n.d(e,{B:()=>o.B,Ys:()=>r.Z,td:()=>i.Z});var r=n(4017),i=n(9628),o=n(5109)},3083:(t,e,n)=>{"use strict";function r(t){return function(){return this.matches(t)}}n.d(e,{Z:()=>r})},3095:(t,e,n)=>{"use strict";n.d(e,{Z:()=>o});var r=n(5553),i=n(4103);function o(t){var e=(0,r.Z)();return e.changedTouches&&(e=e.changedTouches[0]),(0,i.Z)(t,e)}},3888:(t,e,n)=>{"use strict";n.d(e,{Z:()=>i});var r=n(1986);function i(t){var e=t+="",n=e.indexOf(":");return n>=0&&"xmlns"!==(e=t.slice(0,n))&&(t=t.slice(n+1)),r.Z.hasOwnProperty(e)?{space:r.Z[e],local:t}:t}},1986:(t,e,n)=>{"use strict";n.d(e,{P:()=>r,Z:()=>i});var r="http://www.w3.org/1999/xhtml";const i={svg:"http://www.w3.org/2000/svg",xhtml:r,xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"}},4103:(t,e,n)=>{"use strict";function r(t,e){var n=t.ownerSVGElement||t;if(n.createSVGPoint){var r=n.createSVGPoint();return r.x=e.clientX,r.y=e.clientY,[(r=r.matrixTransform(t.getScreenCTM().inverse())).x,r.y]}var i=t.getBoundingClientRect();return[e.clientX-i.left-t.clientLeft,e.clientY-i.top-t.clientTop]}n.d(e,{Z:()=>r})},4017:(t,e,n)=>{"use strict";n.d(e,{Z:()=>i});var r=n(3933);function i(t){return"string"==typeof t?new r.Y1([[document.querySelector(t)]],[document.documentElement]):new r.Y1([[t]],r.Jz)}},9628:(t,e,n)=>{"use strict";n.d(e,{Z:()=>i});var r=n(3933);function i(t){return"string"==typeof t?new r.Y1([document.querySelectorAll(t)],[document.documentElement]):new r.Y1([null==t?[]:t],r.Jz)}},9911:(t,e,n)=>{"use strict";n.d(e,{Z:()=>i});var r=n(789);function i(t){var e="function"==typeof t?t:(0,r.Z)(t);return this.select((function(){return this.appendChild(e.apply(this,arguments))}))}},1033:(t,e,n)=>{"use strict";n.d(e,{Z:()=>c});var r=n(3888);function i(t){return function(){this.removeAttribute(t)}}function o(t){return function(){this.removeAttributeNS(t.space,t.local)}}function a(t,e){return function(){this.setAttribute(t,e)}}function s(t,e){return function(){this.setAttributeNS(t.space,t.local,e)}}function u(t,e){return function(){var n=e.apply(this,arguments);null==n?this.removeAttribute(t):this.setAttribute(t,n)}}function l(t,e){return function(){var n=e.apply(this,arguments);null==n?this.removeAttributeNS(t.space,t.local):this.setAttributeNS(t.space,t.local,n)}}function c(t,e){var n=(0,r.Z)(t);if(arguments.length<2){var c=this.node();return n.local?c.getAttributeNS(n.space,n.local):c.getAttribute(n)}return this.each((null==e?n.local?o:i:"function"==typeof e?n.local?l:u:n.local?s:a)(n,e))}},7124:(t,e,n)=>{"use strict";function r(){var t=arguments[0];return arguments[0]=this,t.apply(null,arguments),this}n.d(e,{Z:()=>r})},6198:(t,e,n)=>{"use strict";function r(t){return t.trim().split(/^|\s+/)}function i(t){return t.classList||new o(t)}function o(t){this._node=t,this._names=r(t.getAttribute("class")||"")}function a(t,e){for(var n=i(t),r=-1,o=e.length;++r<o;)n.add(e[r])}function s(t,e){for(var n=i(t),r=-1,o=e.length;++r<o;)n.remove(e[r])}function u(t){return function(){a(this,t)}}function l(t){return function(){s(this,t)}}function c(t,e){return function(){(e.apply(this,arguments)?a:s)(this,t)}}function f(t,e){var n=r(t+"");if(arguments.length<2){for(var o=i(this.node()),a=-1,s=n.length;++a<s;)if(!o.contains(n[a]))return!1;return!0}return this.each(("function"==typeof e?c:e?u:l)(n,e))}n.d(e,{Z:()=>f}),o.prototype={add:function(t){this._names.indexOf(t)<0&&(this._names.push(t),this._node.setAttribute("class",this._names.join(" ")))},remove:function(t){var e=this._names.indexOf(t);e>=0&&(this._names.splice(e,1),this._node.setAttribute("class",this._names.join(" ")))},contains:function(t){return this._names.indexOf(t)>=0}}},9397:(t,e,n)=>{"use strict";function r(){var t=this.cloneNode(!1),e=this.parentNode;return e?e.insertBefore(t,this.nextSibling):t}function i(){var t=this.cloneNode(!0),e=this.parentNode;return e?e.insertBefore(t,this.nextSibling):t}function o(t){return this.select(t?i:r)}n.d(e,{Z:()=>o})},8650:(t,e,n)=>{"use strict";n.d(e,{Z:()=>u});var r=n(3933),i=n(8737),o=n(9077);function a(t,e,n,r,o,a){for(var s,u=0,l=e.length,c=a.length;u<c;++u)(s=e[u])?(s.__data__=a[u],r[u]=s):n[u]=new i.F(t,a[u]);for(;u<l;++u)(s=e[u])&&(o[u]=s)}function s(t,e,n,r,o,a,s){var u,l,c,f={},h=e.length,p=a.length,d=new Array(h);for(u=0;u<h;++u)(l=e[u])&&(d[u]=c="$"+s.call(l,l.__data__,u,e),c in f?o[u]=l:f[c]=l);for(u=0;u<p;++u)(l=f[c="$"+s.call(t,a[u],u,a)])?(r[u]=l,l.__data__=a[u],f[c]=null):n[u]=new i.F(t,a[u]);for(u=0;u<h;++u)(l=e[u])&&f[d[u]]===l&&(o[u]=l)}function u(t,e){if(!t)return y=new Array(this.size()),p=-1,this.each((function(t){y[++p]=t})),y;var n=e?s:a,i=this._parents,u=this._groups;"function"!=typeof t&&(t=(0,o.Z)(t));for(var l=u.length,c=new Array(l),f=new Array(l),h=new Array(l),p=0;p<l;++p){var d=i[p],g=u[p],v=g.length,y=t.call(d,d&&d.__data__,p,i),m=y.length,b=f[p]=new Array(m),w=c[p]=new Array(m);n(d,g,b,w,h[p]=new Array(v),y,e);for(var _,x,k=0,S=0;k<m;++k)if(_=b[k]){for(k>=S&&(S=k+1);!(x=w[S])&&++S<m;);_._next=x||null}}return(c=new r.Y1(c,i))._enter=f,c._exit=h,c}},4391:(t,e,n)=>{"use strict";function r(t){return arguments.length?this.property("__data__",t):this.node().__data__}n.d(e,{Z:()=>r})},5362:(t,e,n)=>{"use strict";n.d(e,{Z:()=>s});var r=n(5021);function i(t,e,n){var i=(0,r.Z)(t),o=i.CustomEvent;"function"==typeof o?o=new o(e,n):(o=i.document.createEvent("Event"),n?(o.initEvent(e,n.bubbles,n.cancelable),o.detail=n.detail):o.initEvent(e,!1,!1)),t.dispatchEvent(o)}function o(t,e){return function(){return i(this,t,e)}}function a(t,e){return function(){return i(this,t,e.apply(this,arguments))}}function s(t,e){return this.each(("function"==typeof e?a:o)(t,e))}},8358:(t,e,n)=>{"use strict";function r(t){for(var e=this._groups,n=0,r=e.length;n<r;++n)for(var i,o=e[n],a=0,s=o.length;a<s;++a)(i=o[a])&&t.call(i,i.__data__,a,o);return this}n.d(e,{Z:()=>r})},4670:(t,e,n)=>{"use strict";function r(){return!this.node()}n.d(e,{Z:()=>r})},8737:(t,e,n)=>{"use strict";n.d(e,{F:()=>a,Z:()=>o});var r=n(327),i=n(3933);function o(){return new i.Y1(this._enter||this._groups.map(r.Z),this._parents)}function a(t,e){this.ownerDocument=t.ownerDocument,this.namespaceURI=t.namespaceURI,this._next=null,this._parent=t,this.__data__=e}a.prototype={constructor:a,appendChild:function(t){return this._parent.insertBefore(t,this._next)},insertBefore:function(t,e){return this._parent.insertBefore(t,e)},querySelector:function(t){return this._parent.querySelector(t)},querySelectorAll:function(t){return this._parent.querySelectorAll(t)}}},2978:(t,e,n)=>{"use strict";n.d(e,{Z:()=>o});var r=n(327),i=n(3933);function o(){return new i.Y1(this._exit||this._groups.map(r.Z),this._parents)}},4652:(t,e,n)=>{"use strict";n.d(e,{Z:()=>o});var r=n(3933),i=n(3083);function o(t){"function"!=typeof t&&(t=(0,i.Z)(t));for(var e=this._groups,n=e.length,o=new Array(n),a=0;a<n;++a)for(var s,u=e[a],l=u.length,c=o[a]=[],f=0;f<l;++f)(s=u[f])&&t.call(s,s.__data__,f,u)&&c.push(s);return new r.Y1(o,this._parents)}},5267:(t,e,n)=>{"use strict";function r(){this.innerHTML=""}function i(t){return function(){this.innerHTML=t}}function o(t){return function(){var e=t.apply(this,arguments);this.innerHTML=null==e?"":e}}function a(t){return arguments.length?this.each(null==t?r:("function"==typeof t?o:i)(t)):this.node().innerHTML}n.d(e,{Z:()=>a})},3933:(t,e,n)=>{"use strict";n.d(e,{Jz:()=>j,Y1:()=>L,ZP:()=>O});var r=n(4958),i=n(1344),o=n(4652),a=n(8650),s=n(8737),u=n(2978),l=n(2105),c=n(8244),f=n(8221),h=n(2322),p=n(7124),d=n(8098),g=n(9317),v=n(3912),y=n(4670),m=n(8358),b=n(1033),w=n(9986),_=n(9152),x=n(6198),k=n(7647),S=n(5267),C=n(1242),T=n(8275),A=n(9911),M=n(1053),E=n(1261),N=n(9397),P=n(4391),Z=n(5109),I=n(5362),j=[null];function L(t,e){this._groups=t,this._parents=e}function D(){return new L([[document.documentElement]],j)}L.prototype=D.prototype={constructor:L,select:r.Z,selectAll:i.Z,filter:o.Z,data:a.Z,enter:s.Z,exit:u.Z,join:l.Z,merge:c.Z,order:f.Z,sort:h.Z,call:p.Z,nodes:d.Z,node:g.Z,size:v.Z,empty:y.Z,each:m.Z,attr:b.Z,style:w.Z,property:_.Z,classed:x.Z,text:k.Z,html:S.Z,raise:C.Z,lower:T.Z,append:A.Z,insert:M.Z,remove:E.Z,clone:N.Z,datum:P.Z,on:Z.ZP,dispatch:I.Z};const O=D},1053:(t,e,n)=>{"use strict";n.d(e,{Z:()=>a});var r=n(789),i=n(2634);function o(){return null}function a(t,e){var n="function"==typeof t?t:(0,r.Z)(t),a=null==e?o:"function"==typeof e?e:(0,i.Z)(e);return this.select((function(){return this.insertBefore(n.apply(this,arguments),a.apply(this,arguments)||null)}))}},2105:(t,e,n)=>{"use strict";function r(t,e,n){var r=this.enter(),i=this,o=this.exit();return r="function"==typeof t?t(r):r.append(t+""),null!=e&&(i=e(i)),null==n?o.remove():n(o),r&&i?r.merge(i).order():i}n.d(e,{Z:()=>r})},8275:(t,e,n)=>{"use strict";function r(){this.previousSibling&&this.parentNode.insertBefore(this,this.parentNode.firstChild)}function i(){return this.each(r)}n.d(e,{Z:()=>i})},8244:(t,e,n)=>{"use strict";n.d(e,{Z:()=>i});var r=n(3933);function i(t){for(var e=this._groups,n=t._groups,i=e.length,o=n.length,a=Math.min(i,o),s=new Array(i),u=0;u<a;++u)for(var l,c=e[u],f=n[u],h=c.length,p=s[u]=new Array(h),d=0;d<h;++d)(l=c[d]||f[d])&&(p[d]=l);for(;u<i;++u)s[u]=e[u];return new r.Y1(s,this._parents)}},9317:(t,e,n)=>{"use strict";function r(){for(var t=this._groups,e=0,n=t.length;e<n;++e)for(var r=t[e],i=0,o=r.length;i<o;++i){var a=r[i];if(a)return a}return null}n.d(e,{Z:()=>r})},8098:(t,e,n)=>{"use strict";function r(){var t=new Array(this.size()),e=-1;return this.each((function(){t[++e]=this})),t}n.d(e,{Z:()=>r})},5109:(t,e,n)=>{"use strict";n.d(e,{B:()=>i,ZP:()=>c,_H:()=>f});var r={},i=null;function o(t,e,n){return t=a(t,e,n),function(e){var n=e.relatedTarget;n&&(n===this||8&n.compareDocumentPosition(this))||t.call(this,e)}}function a(t,e,n){return function(r){var o=i;i=r;try{t.call(this,this.__data__,e,n)}finally{i=o}}}function s(t){return t.trim().split(/^|\s+/).map((function(t){var e="",n=t.indexOf(".");return n>=0&&(e=t.slice(n+1),t=t.slice(0,n)),{type:t,name:e}}))}function u(t){return function(){var e=this.__on;if(e){for(var n,r=0,i=-1,o=e.length;r<o;++r)n=e[r],t.type&&n.type!==t.type||n.name!==t.name?e[++i]=n:this.removeEventListener(n.type,n.listener,n.capture);++i?e.length=i:delete this.__on}}}function l(t,e,n){var i=r.hasOwnProperty(t.type)?o:a;return function(r,o,a){var s,u=this.__on,l=i(e,o,a);if(u)for(var c=0,f=u.length;c<f;++c)if((s=u[c]).type===t.type&&s.name===t.name)return this.removeEventListener(s.type,s.listener,s.capture),this.addEventListener(s.type,s.listener=l,s.capture=n),void(s.value=e);this.addEventListener(t.type,l,n),s={type:t.type,name:t.name,value:e,listener:l,capture:n},u?u.push(s):this.__on=[s]}}function c(t,e,n){var r,i,o=s(t+""),a=o.length;if(!(arguments.length<2)){for(c=e?l:u,null==n&&(n=!1),r=0;r<a;++r)this.each(c(o[r],e,n));return this}var c=this.node().__on;if(c)for(var f,h=0,p=c.length;h<p;++h)for(r=0,f=c[h];r<a;++r)if((i=o[r]).type===f.type&&i.name===f.name)return f.value}function f(t,e,n,r){var o=i;t.sourceEvent=i,i=t;try{return e.apply(n,r)}finally{i=o}}"undefined"!=typeof document&&("onmouseenter"in document.documentElement||(r={mouseenter:"mouseover",mouseleave:"mouseout"}))},8221:(t,e,n)=>{"use strict";function r(){for(var t=this._groups,e=-1,n=t.length;++e<n;)for(var r,i=t[e],o=i.length-1,a=i[o];--o>=0;)(r=i[o])&&(a&&4^r.compareDocumentPosition(a)&&a.parentNode.insertBefore(r,a),a=r);return this}n.d(e,{Z:()=>r})},9152:(t,e,n)=>{"use strict";function r(t){return function(){delete this[t]}}function i(t,e){return function(){this[t]=e}}function o(t,e){return function(){var n=e.apply(this,arguments);null==n?delete this[t]:this[t]=n}}function a(t,e){return arguments.length>1?this.each((null==e?r:"function"==typeof e?o:i)(t,e)):this.node()[t]}n.d(e,{Z:()=>a})},1242:(t,e,n)=>{"use strict";function r(){this.nextSibling&&this.parentNode.appendChild(this)}function i(){return this.each(r)}n.d(e,{Z:()=>i})},1261:(t,e,n)=>{"use strict";function r(){var t=this.parentNode;t&&t.removeChild(this)}function i(){return this.each(r)}n.d(e,{Z:()=>i})},4958:(t,e,n)=>{"use strict";n.d(e,{Z:()=>o});var r=n(3933),i=n(2634);function o(t){"function"!=typeof t&&(t=(0,i.Z)(t));for(var e=this._groups,n=e.length,o=new Array(n),a=0;a<n;++a)for(var s,u,l=e[a],c=l.length,f=o[a]=new Array(c),h=0;h<c;++h)(s=l[h])&&(u=t.call(s,s.__data__,h,l))&&("__data__"in s&&(u.__data__=s.__data__),f[h]=u);return new r.Y1(o,this._parents)}},1344:(t,e,n)=>{"use strict";n.d(e,{Z:()=>o});var r=n(3933),i=n(3545);function o(t){"function"!=typeof t&&(t=(0,i.Z)(t));for(var e=this._groups,n=e.length,o=[],a=[],s=0;s<n;++s)for(var u,l=e[s],c=l.length,f=0;f<c;++f)(u=l[f])&&(o.push(t.call(u,u.__data__,f,l)),a.push(u));return new r.Y1(o,a)}},3912:(t,e,n)=>{"use strict";function r(){var t=0;return this.each((function(){++t})),t}n.d(e,{Z:()=>r})},2322:(t,e,n)=>{"use strict";n.d(e,{Z:()=>i});var r=n(3933);function i(t){function e(e,n){return e&&n?t(e.__data__,n.__data__):!e-!n}t||(t=o);for(var n=this._groups,i=n.length,a=new Array(i),s=0;s<i;++s){for(var u,l=n[s],c=l.length,f=a[s]=new Array(c),h=0;h<c;++h)(u=l[h])&&(f[h]=u);f.sort(e)}return new r.Y1(a,this._parents).order()}function o(t,e){return t<e?-1:t>e?1:t>=e?0:NaN}},327:(t,e,n)=>{"use strict";function r(t){return new Array(t.length)}n.d(e,{Z:()=>r})},9986:(t,e,n)=>{"use strict";n.d(e,{S:()=>u,Z:()=>s});var r=n(5021);function i(t){return function(){this.style.removeProperty(t)}}function o(t,e,n){return function(){this.style.setProperty(t,e,n)}}function a(t,e,n){return function(){var r=e.apply(this,arguments);null==r?this.style.removeProperty(t):this.style.setProperty(t,r,n)}}function s(t,e,n){return arguments.length>1?this.each((null==e?i:"function"==typeof e?a:o)(t,e,null==n?"":n)):u(this.node(),t)}function u(t,e){return t.style.getPropertyValue(e)||(0,r.Z)(t).getComputedStyle(t,null).getPropertyValue(e)}},7647:(t,e,n)=>{"use strict";function r(){this.textContent=""}function i(t){return function(){this.textContent=t}}function o(t){return function(){var e=t.apply(this,arguments);this.textContent=null==e?"":e}}function a(t){return arguments.length?this.each(null==t?r:("function"==typeof t?o:i)(t)):this.node().textContent}n.d(e,{Z:()=>a})},2634:(t,e,n)=>{"use strict";function r(){}function i(t){return null==t?r:function(){return this.querySelector(t)}}n.d(e,{Z:()=>i})},3545:(t,e,n)=>{"use strict";function r(){return[]}function i(t){return null==t?r:function(){return this.querySelectorAll(t)}}n.d(e,{Z:()=>i})},5553:(t,e,n)=>{"use strict";n.d(e,{Z:()=>i});var r=n(5109);function i(){for(var t,e=r.B;t=e.sourceEvent;)e=t;return e}},4793:(t,e,n)=>{"use strict";n.d(e,{Z:()=>o});var r=n(5553),i=n(4103);function o(t,e,n){arguments.length<3&&(n=e,e=(0,r.Z)().changedTouches);for(var o,a=0,s=e?e.length:0;a<s;++a)if((o=e[a]).identifier===n)return(0,i.Z)(t,o);return null}},5644:(t,e,n)=>{"use strict";n.d(e,{Z:()=>o});var r=n(5553),i=n(4103);function o(t,e){null==e&&(e=(0,r.Z)().touches);for(var n=0,o=e?e.length:0,a=new Array(o);n<o;++n)a[n]=(0,i.Z)(t,e[n]);return a}},5021:(t,e,n)=>{"use strict";function r(t){return t.ownerDocument&&t.ownerDocument.defaultView||t.document&&t||t.defaultView}n.d(e,{Z:()=>r})},4042:(t,e,n)=>{"use strict";n.d(e,{Z:()=>i});var r=n(5374);function i(t,e,n){var i=new r.B7;return e=null==e?0:+e,i.restart((function(n){i.stop(),t(n+e)}),e,n),i}},5374:(t,e,n)=>{"use strict";n.d(e,{B7:()=>v,HT:()=>y,zO:()=>d});var r,i,o=n(6738),a=0,s=0,u=0,l=0,c=0,f=0,h="object"==typeof performance&&performance.now?performance:Date,p="object"==typeof o&&o.requestAnimationFrame?o.requestAnimationFrame.bind(o):function(t){setTimeout(t,17)};function d(){return c||(p(g),c=h.now()+f)}function g(){c=0}function v(){this._call=this._time=this._next=null}function y(t,e,n){var r=new v;return r.restart(t,e,n),r}function m(){c=(l=h.now())+f,a=s=0;try{!function(){d(),++a;for(var t,e=r;e;)(t=c-e._time)>=0&&e._call.call(null,t),e=e._next;--a}()}finally{a=0,function(){for(var t,e,n=r,o=1/0;n;)n._call?(o>n._time&&(o=n._time),t=n,n=n._next):(e=n._next,n._next=null,n=t?t._next=e:r=e);i=t,w(o)}(),c=0}}function b(){var t=h.now(),e=t-l;e>1e3&&(f-=e,l=t)}function w(t){a||(s&&(s=clearTimeout(s)),t-c>24?(t<1/0&&(s=setTimeout(m,t-h.now()-f)),u&&(u=clearInterval(u))):(u||(l=h.now(),u=setInterval(b,1e3)),a=1,p(m)))}v.prototype=y.prototype={constructor:v,restart:function(t,e,n){if("function"!=typeof t)throw new TypeError("callback is not a function");n=(null==n?d():+n)+(null==e?0:+e),this._next||i===this||(i?i._next=this:r=this,i=this),this._call=t,this._time=n,w()},stop:function(){this._call&&(this._call=null,this._time=1/0,w())}}},2946:(t,e,n)=>{"use strict";n(8023),n(8529)},2263:(t,e,n)=>{"use strict";n(2901),n(8023),n(2946),n(7811)},7811:(t,e,n)=>{"use strict";n.d(e,{Z:()=>i});var r=n(8529);function i(t,e){var n,i,o,a=t.__transition,s=!0;if(a){for(o in e=null==e?null:e+"",a)(n=a[o]).name===e?(i=n.state>r.KE&&n.state<r.wS,n.state=r.Ku,n.timer.stop(),n.on.call(i?"interrupt":"cancel",t,t.__data__,n.index,n.group),delete a[o]):s=!1;s&&delete t.__transition}}},2901:(t,e,n)=>{"use strict";var r=n(3933),i=n(5428),o=n(4341);r.ZP.prototype.interrupt=i.Z,r.ZP.prototype.transition=o.Z},5428:(t,e,n)=>{"use strict";n.d(e,{Z:()=>i});var r=n(7811);function i(t){return this.each((function(){(0,r.Z)(this,t)}))}},4341:(t,e,n)=>{"use strict";n.d(e,{Z:()=>l});var r=n(8023),i=n(8529),o=n(8716),a=n(5374),s={time:null,delay:0,duration:250,ease:o.tw};function u(t,e){for(var n;!(n=t.__transition)||!(n=n[e]);)if(!(t=t.parentNode))return s.time=(0,a.zO)(),s;return n}function l(t){var e,n;t instanceof r.uT?(e=t._id,t=t._name):(e=(0,r.pZ)(),(n=s).time=(0,a.zO)(),t=null==t?null:t+"");for(var o=this._groups,l=o.length,c=0;c<l;++c)for(var f,h=o[c],p=h.length,d=0;d<p;++d)(f=h[d])&&(0,i.ZP)(f,t,e,d,h,n||u(f,e));return new r.uT(o,this._parents,t,e)}},3874:(t,e,n)=>{"use strict";n.d(e,{Z:()=>p});var r=n(6697),i=n(3888),o=n(6314),a=n(675);function s(t){return function(){this.removeAttribute(t)}}function u(t){return function(){this.removeAttributeNS(t.space,t.local)}}function l(t,e,n){var r,i,o=n+"";return function(){var a=this.getAttribute(t);return a===o?null:a===r?i:i=e(r=a,n)}}function c(t,e,n){var r,i,o=n+"";return function(){var a=this.getAttributeNS(t.space,t.local);return a===o?null:a===r?i:i=e(r=a,n)}}function f(t,e,n){var r,i,o;return function(){var a,s,u=n(this);if(null!=u)return(a=this.getAttribute(t))===(s=u+"")?null:a===r&&s===i?o:(i=s,o=e(r=a,u));this.removeAttribute(t)}}function h(t,e,n){var r,i,o;return function(){var a,s,u=n(this);if(null!=u)return(a=this.getAttributeNS(t.space,t.local))===(s=u+"")?null:a===r&&s===i?o:(i=s,o=e(r=a,u));this.removeAttributeNS(t.space,t.local)}}function p(t,e){var n=(0,i.Z)(t),p="transform"===n?r.w:a.Z;return this.attrTween(t,"function"==typeof e?(n.local?h:f)(n,p,(0,o.x)(this,"attr."+t,e)):null==e?(n.local?u:s)(n):(n.local?c:l)(n,p,e))}},8180:(t,e,n)=>{"use strict";n.d(e,{Z:()=>u});var r=n(3888);function i(t,e){return function(n){this.setAttribute(t,e.call(this,n))}}function o(t,e){return function(n){this.setAttributeNS(t.space,t.local,e.call(this,n))}}function a(t,e){var n,r;function i(){var i=e.apply(this,arguments);return i!==r&&(n=(r=i)&&o(t,i)),n}return i._value=e,i}function s(t,e){var n,r;function o(){var o=e.apply(this,arguments);return o!==r&&(n=(r=o)&&i(t,o)),n}return o._value=e,o}function u(t,e){var n="attr."+t;if(arguments.length<2)return(n=this.tween(n))&&n._value;if(null==e)return this.tween(n,null);if("function"!=typeof e)throw new Error;var i=(0,r.Z)(t);return this.tween(n,(i.local?a:s)(i,e))}},8836:(t,e,n)=>{"use strict";n.d(e,{Z:()=>a});var r=n(8529);function i(t,e){return function(){(0,r.S1)(this,t).delay=+e.apply(this,arguments)}}function o(t,e){return e=+e,function(){(0,r.S1)(this,t).delay=e}}function a(t){var e=this._id;return arguments.length?this.each(("function"==typeof t?i:o)(e,t)):(0,r.U2)(this.node(),e).delay}},4712:(t,e,n)=>{"use strict";n.d(e,{Z:()=>a});var r=n(8529);function i(t,e){return function(){(0,r.t8)(this,t).duration=+e.apply(this,arguments)}}function o(t,e){return e=+e,function(){(0,r.t8)(this,t).duration=e}}function a(t){var e=this._id;return arguments.length?this.each(("function"==typeof t?i:o)(e,t)):(0,r.U2)(this.node(),e).duration}},5439:(t,e,n)=>{"use strict";n.d(e,{Z:()=>o});var r=n(8529);function i(t,e){if("function"!=typeof e)throw new Error;return function(){(0,r.t8)(this,t).ease=e}}function o(t){var e=this._id;return arguments.length?this.each(i(e,t)):(0,r.U2)(this.node(),e).ease}},1128:(t,e,n)=>{"use strict";n.d(e,{Z:()=>i});var r=n(8529);function i(){var t,e,n=this,i=n._id,o=n.size();return new Promise((function(a,s){var u={value:s},l={value:function(){0==--o&&a()}};n.each((function(){var n=(0,r.t8)(this,i),o=n.on;o!==t&&((e=(t=o).copy())._.cancel.push(u),e._.interrupt.push(u),e._.end.push(l)),n.on=e}))}))}},1236:(t,e,n)=>{"use strict";n.d(e,{Z:()=>o});var r=n(3083),i=n(8023);function o(t){"function"!=typeof t&&(t=(0,r.Z)(t));for(var e=this._groups,n=e.length,o=new Array(n),a=0;a<n;++a)for(var s,u=e[a],l=u.length,c=o[a]=[],f=0;f<l;++f)(s=u[f])&&t.call(s,s.__data__,f,u)&&c.push(s);return new i.uT(o,this._parents,this._name,this._id)}},8023:(t,e,n)=>{"use strict";n.d(e,{pZ:()=>C,uT:()=>S});var r=n(3933),i=n(3874),o=n(8180),a=n(8836),s=n(4712),u=n(5439),l=n(1236),c=n(1444),f=n(1730),h=n(6696),p=n(5492),d=n(7256),g=n(1751),v=n(6796),y=n(7179),m=n(4763),b=n(4685),w=n(302),_=n(6314),x=n(1128),k=0;function S(t,e,n,r){this._groups=t,this._parents=e,this._name=n,this._id=r}function C(){return++k}var T=r.ZP.prototype;S.prototype=function(t){return(0,r.ZP)().transition(t)}.prototype={constructor:S,select:p.Z,selectAll:d.Z,filter:l.Z,merge:c.Z,selection:g.Z,transition:w.Z,call:T.call,nodes:T.nodes,node:T.node,size:T.size,empty:T.empty,each:T.each,on:f.Z,attr:i.Z,attrTween:o.Z,style:v.Z,styleTween:y.Z,text:m.Z,textTween:b.Z,remove:h.Z,tween:_.Z,delay:a.Z,duration:s.Z,ease:u.Z,end:x.Z}},675:(t,e,n)=>{"use strict";n.d(e,{Z:()=>s});var r=n(6372),i=n(3626),o=n(3414),a=n(9843);function s(t,e){var n;return("number"==typeof e?i.Z:e instanceof r.ZP?o.ZP:(n=(0,r.ZP)(e))?(e=n,o.ZP):a.Z)(t,e)}},1444:(t,e,n)=>{"use strict";n.d(e,{Z:()=>i});var r=n(8023);function i(t){if(t._id!==this._id)throw new Error;for(var e=this._groups,n=t._groups,i=e.length,o=n.length,a=Math.min(i,o),s=new Array(i),u=0;u<a;++u)for(var l,c=e[u],f=n[u],h=c.length,p=s[u]=new Array(h),d=0;d<h;++d)(l=c[d]||f[d])&&(p[d]=l);for(;u<i;++u)s[u]=e[u];return new r.uT(s,this._parents,this._name,this._id)}},1730:(t,e,n)=>{"use strict";n.d(e,{Z:()=>o});var r=n(8529);function i(t,e,n){var i,o,a=function(t){return(t+"").trim().split(/^|\s+/).every((function(t){var e=t.indexOf(".");return e>=0&&(t=t.slice(0,e)),!t||"start"===t}))}(e)?r.S1:r.t8;return function(){var r=a(this,t),s=r.on;s!==i&&(o=(i=s).copy()).on(e,n),r.on=o}}function o(t,e){var n=this._id;return arguments.length<2?(0,r.U2)(this.node(),n).on.on(t):this.each(i(n,t,e))}},6696:(t,e,n)=>{"use strict";function r(){return this.on("end.remove",(t=this._id,function(){var e=this.parentNode;for(var n in this.__transition)if(+n!==t)return;e&&e.removeChild(this)}));var t}n.d(e,{Z:()=>r})},8529:(t,e,n)=>{"use strict";n.d(e,{KE:()=>u,Ku:()=>c,S1:()=>h,U2:()=>d,ZP:()=>f,t8:()=>p,wS:()=>l});var r=n(2626),i=n(5374),o=n(4042),a=(0,r.Z)("start","end","cancel","interrupt"),s=[],u=2,l=5,c=6;function f(t,e,n,r,f,h){var p=t.__transition;if(p){if(n in p)return}else t.__transition={};!function(t,e,n){var r,a=t.__transition;function s(i){var l,p,d,g;if(1!==n.state)return h();for(l in a)if((g=a[l]).name===n.name){if(3===g.state)return(0,o.Z)(s);4===g.state?(g.state=c,g.timer.stop(),g.on.call("interrupt",t,t.__data__,g.index,g.group),delete a[l]):+l<e&&(g.state=c,g.timer.stop(),g.on.call("cancel",t,t.__data__,g.index,g.group),delete a[l])}if((0,o.Z)((function(){3===n.state&&(n.state=4,n.timer.restart(f,n.delay,n.time),f(i))})),n.state=u,n.on.call("start",t,t.__data__,n.index,n.group),n.state===u){for(n.state=3,r=new Array(d=n.tween.length),l=0,p=-1;l<d;++l)(g=n.tween[l].value.call(t,t.__data__,n.index,n.group))&&(r[++p]=g);r.length=p+1}}function f(e){for(var i=e<n.duration?n.ease.call(null,e/n.duration):(n.timer.restart(h),n.state=l,1),o=-1,a=r.length;++o<a;)r[o].call(t,i);n.state===l&&(n.on.call("end",t,t.__data__,n.index,n.group),h())}function h(){for(var r in n.state=c,n.timer.stop(),delete a[e],a)return;delete t.__transition}a[e]=n,n.timer=(0,i.HT)((function(t){n.state=1,n.timer.restart(s,n.delay,n.time),n.delay<=t&&s(t-n.delay)}),0,n.time)}(t,n,{name:e,index:r,group:f,on:a,tween:s,time:h.time,delay:h.delay,duration:h.duration,ease:h.ease,timer:null,state:0})}function h(t,e){var n=d(t,e);if(n.state>0)throw new Error("too late; already scheduled");return n}function p(t,e){var n=d(t,e);if(n.state>3)throw new Error("too late; already running");return n}function d(t,e){var n=t.__transition;if(!n||!(n=n[e]))throw new Error("transition not found");return n}},5492:(t,e,n)=>{"use strict";n.d(e,{Z:()=>a});var r=n(2634),i=n(8023),o=n(8529);function a(t){var e=this._name,n=this._id;"function"!=typeof t&&(t=(0,r.Z)(t));for(var a=this._groups,s=a.length,u=new Array(s),l=0;l<s;++l)for(var c,f,h=a[l],p=h.length,d=u[l]=new Array(p),g=0;g<p;++g)(c=h[g])&&(f=t.call(c,c.__data__,g,h))&&("__data__"in c&&(f.__data__=c.__data__),d[g]=f,(0,o.ZP)(d[g],e,n,g,d,(0,o.U2)(c,n)));return new i.uT(u,this._parents,e,n)}},7256:(t,e,n)=>{"use strict";n.d(e,{Z:()=>a});var r=n(3545),i=n(8023),o=n(8529);function a(t){var e=this._name,n=this._id;"function"!=typeof t&&(t=(0,r.Z)(t));for(var a=this._groups,s=a.length,u=[],l=[],c=0;c<s;++c)for(var f,h=a[c],p=h.length,d=0;d<p;++d)if(f=h[d]){for(var g,v=t.call(f,f.__data__,d,h),y=(0,o.U2)(f,n),m=0,b=v.length;m<b;++m)(g=v[m])&&(0,o.ZP)(g,e,n,m,v,y);u.push(v),l.push(f)}return new i.uT(u,l,e,n)}},1751:(t,e,n)=>{"use strict";n.d(e,{Z:()=>i});var r=n(3933).ZP.prototype.constructor;function i(){return new r(this._groups,this._parents)}},6796:(t,e,n)=>{"use strict";n.d(e,{Z:()=>l});var r=n(6697),i=n(9986),o=n(8529),a=n(6314),s=n(675);function u(t){return function(){this.style.removeProperty(t)}}function l(t,e,n){var l="transform"==(t+="")?r.Y:s.Z;return null==e?this.styleTween(t,function(t,e){var n,r,o;return function(){var a=(0,i.S)(this,t),s=(this.style.removeProperty(t),(0,i.S)(this,t));return a===s?null:a===n&&s===r?o:o=e(n=a,r=s)}}(t,l)).on("end.style."+t,u(t)):"function"==typeof e?this.styleTween(t,function(t,e,n){var r,o,a;return function(){var s=(0,i.S)(this,t),u=n(this),l=u+"";return null==u&&(this.style.removeProperty(t),l=u=(0,i.S)(this,t)),s===l?null:s===r&&l===o?a:(o=l,a=e(r=s,u))}}(t,l,(0,a.x)(this,"style."+t,e))).each(function(t,e){var n,r,i,a,s="style."+e,l="end."+s;return function(){var c=(0,o.t8)(this,t),f=c.on,h=null==c.value[s]?a||(a=u(e)):void 0;f===n&&i===h||(r=(n=f).copy()).on(l,i=h),c.on=r}}(this._id,t)):this.styleTween(t,function(t,e,n){var r,o,a=n+"";return function(){var s=(0,i.S)(this,t);return s===a?null:s===r?o:o=e(r=s,n)}}(t,l,e),n).on("end.style."+t,null)}},7179:(t,e,n)=>{"use strict";function r(t,e,n){return function(r){this.style.setProperty(t,e.call(this,r),n)}}function i(t,e,n){var i,o;function a(){var a=e.apply(this,arguments);return a!==o&&(i=(o=a)&&r(t,a,n)),i}return a._value=e,a}function o(t,e,n){var r="style."+(t+="");if(arguments.length<2)return(r=this.tween(r))&&r._value;if(null==e)return this.tween(r,null);if("function"!=typeof e)throw new Error;return this.tween(r,i(t,e,null==n?"":n))}n.d(e,{Z:()=>o})},4763:(t,e,n)=>{"use strict";n.d(e,{Z:()=>i});var r=n(6314);function i(t){return this.tween("text","function"==typeof t?function(t){return function(){var e=t(this);this.textContent=null==e?"":e}}((0,r.x)(this,"text",t)):function(t){return function(){this.textContent=t}}(null==t?"":t+""))}},4685:(t,e,n)=>{"use strict";function r(t){return function(e){this.textContent=t.call(this,e)}}function i(t){var e,n;function i(){var i=t.apply(this,arguments);return i!==n&&(e=(n=i)&&r(i)),e}return i._value=t,i}function o(t){var e="text";if(arguments.length<1)return(e=this.tween(e))&&e._value;if(null==t)return this.tween(e,null);if("function"!=typeof t)throw new Error;return this.tween(e,i(t))}n.d(e,{Z:()=>o})},302:(t,e,n)=>{"use strict";n.d(e,{Z:()=>o});var r=n(8023),i=n(8529);function o(){for(var t=this._name,e=this._id,n=(0,r.pZ)(),o=this._groups,a=o.length,s=0;s<a;++s)for(var u,l=o[s],c=l.length,f=0;f<c;++f)if(u=l[f]){var h=(0,i.U2)(u,e);(0,i.ZP)(u,t,n,f,l,{time:h.time+h.delay+h.duration,delay:0,duration:h.duration,ease:h.ease})}return new r.uT(o,this._parents,t,n)}},6314:(t,e,n)=>{"use strict";n.d(e,{Z:()=>a,x:()=>s});var r=n(8529);function i(t,e){var n,i;return function(){var o=(0,r.t8)(this,t),a=o.tween;if(a!==n)for(var s=0,u=(i=n=a).length;s<u;++s)if(i[s].name===e){(i=i.slice()).splice(s,1);break}o.tween=i}}function o(t,e,n){var i,o;if("function"!=typeof n)throw new Error;return function(){var a=(0,r.t8)(this,t),s=a.tween;if(s!==i){o=(i=s).slice();for(var u={name:e,value:n},l=0,c=o.length;l<c;++l)if(o[l].name===e){o[l]=u;break}l===c&&o.push(u)}a.tween=o}}function a(t,e){var n=this._id;if(t+="",arguments.length<2){for(var a,s=(0,r.U2)(this.node(),n).tween,u=0,l=s.length;u<l;++u)if((a=s[u]).name===t)return a.value;return null}return this.each((null==e?i:o)(n,t,e))}function s(t,e,n){var i=t._id;return t.each((function(){var t=(0,r.t8)(this,i);(t.value||(t.value={}))[e]=n.apply(this,arguments)})),function(t){return(0,r.U2)(t,i).value[e]}}},6629:(t,e,n)=>{"use strict";n.d(e,{T:()=>h,W:()=>p});var r=n(1791),i=n(2012),o=n(8473),a=n(364),s=n(2119),u=[];function l(){(0,r.q)(this),this.edge=this.site=this.circle=null}function c(t){var e=u.pop()||new l;return e.site=t,e}function f(t){(0,o.No)(t),s.U9.remove(t),u.push(t),(0,r.q)(t)}function h(t){var e=t.circle,n=e.x,r=e.cy,i=[n,r],u=t.P,l=t.N,c=[t];f(t);for(var h=u;h.circle&&Math.abs(n-h.circle.x)<s.Ho&&Math.abs(r-h.circle.cy)<s.Ho;)u=h.P,c.unshift(h),f(h),h=u;c.unshift(h),(0,o.No)(h);for(var p=l;p.circle&&Math.abs(n-p.circle.x)<s.Ho&&Math.abs(r-p.circle.cy)<s.Ho;)l=p.N,c.push(p),f(p),p=l;c.push(p),(0,o.No)(p);var d,g=c.length;for(d=1;d<g;++d)p=c[d],h=c[d-1],(0,a.FK)(p.edge,h.site,p.site,i);h=c[0],(p=c[g-1]).edge=(0,a.jN)(h.site,p.site,null,i),(0,o.Z6)(h),(0,o.Z6)(p)}function p(t){for(var e,n,r,u,l=t[0],f=t[1],h=s.U9._;h;)if((r=d(h,f)-l)>s.Ho)h=h.L;else{if(!((u=l-g(h,f))>s.Ho)){r>-s.Ho?(e=h.P,n=h):u>-s.Ho?(e=h,n=h.N):e=n=h;break}if(!h.R){e=h;break}h=h.R}(0,i.kE)(t);var p=c(t);if(s.U9.insert(e,p),e||n){if(e===n)return(0,o.No)(e),n=c(e.site),s.U9.insert(p,n),p.edge=n.edge=(0,a.jN)(e.site,p.site),(0,o.Z6)(e),void(0,o.Z6)(n);if(n){(0,o.No)(e),(0,o.No)(n);var v=e.site,y=v[0],m=v[1],b=t[0]-y,w=t[1]-m,_=n.site,x=_[0]-y,k=_[1]-m,S=2*(b*k-w*x),C=b*b+w*w,T=x*x+k*k,A=[(k*C-w*T)/S+y,(b*T-x*C)/S+m];(0,a.FK)(n.edge,v,_,A),p.edge=(0,a.jN)(v,t,null,A),n.edge=(0,a.jN)(t,_,null,A),(0,o.Z6)(e),(0,o.Z6)(n)}else p.edge=(0,a.jN)(e.site,p.site)}}function d(t,e){var n=t.site,r=n[0],i=n[1],o=i-e;if(!o)return r;var a=t.P;if(!a)return-1/0;var s=(n=a.site)[0],u=n[1],l=u-e;if(!l)return s;var c=s-r,f=1/o-1/l,h=c/l;return f?(-h+Math.sqrt(h*h-2*f*(c*c/(-2*l)-u+l/2+i-o/2)))/f+r:(r+s)/2}function g(t,e){var n=t.N;if(n)return d(n,e);var r=t.site;return r[1]===e?r[0]:1/0}},2012:(t,e,n)=>{"use strict";n.d(e,{A1:()=>l,BO:()=>s,iu:()=>c,kE:()=>o});var r=n(364),i=n(2119);function o(t){return i.gF[t.index]={site:t,halfedges:[]}}function a(t,e){var n=t.site,r=e.left,i=e.right;return n===i&&(i=r,r=n),i?Math.atan2(i[1]-r[1],i[0]-r[0]):(n===r?(r=e[1],i=e[0]):(r=e[0],i=e[1]),Math.atan2(r[0]-i[0],i[1]-r[1]))}function s(t,e){return e[+(e.left!==t.site)]}function u(t,e){return e[+(e.left===t.site)]}function l(){for(var t,e,n,r,o=0,s=i.gF.length;o<s;++o)if((t=i.gF[o])&&(r=(e=t.halfedges).length)){var u=new Array(r),l=new Array(r);for(n=0;n<r;++n)u[n]=n,l[n]=a(t,i.$Y[e[n]]);for(u.sort((function(t,e){return l[e]-l[t]})),n=0;n<r;++n)l[n]=e[u[n]];for(n=0;n<r;++n)e[n]=l[n]}}function c(t,e,n,o){var a,l,c,f,h,p,d,g,v,y,m,b,w=i.gF.length,_=!0;for(a=0;a<w;++a)if(l=i.gF[a]){for(c=l.site,f=(h=l.halfedges).length;f--;)i.$Y[h[f]]||h.splice(f,1);for(f=0,p=h.length;f<p;)m=(y=u(l,i.$Y[h[f]]))[0],b=y[1],g=(d=s(l,i.$Y[h[++f%p]]))[0],v=d[1],(Math.abs(m-g)>i.Ho||Math.abs(b-v)>i.Ho)&&(h.splice(f,0,i.$Y.push((0,r.UV)(c,y,Math.abs(m-t)<i.Ho&&o-b>i.Ho?[t,Math.abs(g-t)<i.Ho?v:o]:Math.abs(b-o)<i.Ho&&n-m>i.Ho?[Math.abs(v-o)<i.Ho?g:n,o]:Math.abs(m-n)<i.Ho&&b-e>i.Ho?[n,Math.abs(g-n)<i.Ho?v:e]:Math.abs(b-e)<i.Ho&&m-t>i.Ho?[Math.abs(v-e)<i.Ho?g:t,e]:null))-1),++p);p&&(_=!1)}if(_){var x,k,S,C=1/0;for(a=0,_=null;a<w;++a)(l=i.gF[a])&&(S=(x=(c=l.site)[0]-t)*x+(k=c[1]-e)*k)<C&&(C=S,_=l);if(_){var T=[t,e],A=[t,o],M=[n,o],E=[n,e];_.halfedges.push(i.$Y.push((0,r.UV)(c=_.site,T,A))-1,i.$Y.push((0,r.UV)(c,A,M))-1,i.$Y.push((0,r.UV)(c,M,E))-1,i.$Y.push((0,r.UV)(c,E,T))-1)}}for(a=0;a<w;++a)(l=i.gF[a])&&(l.halfedges.length||delete i.gF[a])}},8473:(t,e,n)=>{"use strict";n.d(e,{No:()=>l,Z6:()=>u,pk:()=>r});var r,i=n(1791),o=n(2119),a=[];function s(){(0,i.q)(this),this.x=this.y=this.arc=this.site=this.cy=null}function u(t){var e=t.P,n=t.N;if(e&&n){var i=e.site,u=t.site,l=n.site;if(i!==l){var c=u[0],f=u[1],h=i[0]-c,p=i[1]-f,d=l[0]-c,g=l[1]-f,v=2*(h*g-p*d);if(!(v>=-o.aW)){var y=h*h+p*p,m=d*d+g*g,b=(g*y-p*m)/v,w=(h*m-d*y)/v,_=a.pop()||new s;_.arc=t,_.site=u,_.x=b+c,_.y=(_.cy=w+f)+Math.sqrt(b*b+w*w),t.circle=_;for(var x=null,k=o.bf._;k;)if(_.y<k.y||_.y===k.y&&_.x<=k.x){if(!k.L){x=k.P;break}k=k.L}else{if(!k.R){x=k;break}k=k.R}o.bf.insert(x,_),x||(r=_)}}}}function l(t){var e=t.circle;e&&(e.P||(r=e.N),o.bf.remove(e),a.push(e),(0,i.q)(e),t.circle=null)}},2119:(t,e,n)=>{"use strict";n.d(e,{$Y:()=>a,Ho:()=>h,U9:()=>r,aW:()=>p,bf:()=>o,gF:()=>i});var r,i,o,a,s=n(6629),u=n(2012),l=n(8473),c=n(364),f=n(1791),h=1e-6,p=1e-12;function d(t,e){return e[1]-t[1]||e[0]-t[0]}function g(t,e){var n,h,p,g=t.sort(d).pop();for(a=[],i=new Array(t.length),r=new f.Z,o=new f.Z;;)if(p=l.pk,g&&(!p||g[1]<p.y||g[1]===p.y&&g[0]<p.x))g[0]===n&&g[1]===h||((0,s.W)(g),n=g[0],h=g[1]),g=t.pop();else{if(!p)break;(0,s.T)(p.arc)}if((0,u.A1)(),e){var v=+e[0][0],y=+e[0][1],m=+e[1][0],b=+e[1][1];(0,c.zb)(v,y,m,b),(0,u.iu)(v,y,m,b)}this.edges=a,this.cells=i,r=o=a=i=null}g.prototype={constructor:g,polygons:function(){var t=this.edges;return this.cells.map((function(e){var n=e.halfedges.map((function(n){return(0,u.BO)(e,t[n])}));return n.data=e.site.data,n}))},triangles:function(){var t=[],e=this.edges;return this.cells.forEach((function(n,r){if(o=(i=n.halfedges).length)for(var i,o,a,s,u,l,c=n.site,f=-1,h=e[i[o-1]],p=h.left===c?h.right:h.left;++f<o;)a=p,p=(h=e[i[f]]).left===c?h.right:h.left,a&&p&&r<a.index&&r<p.index&&(u=a,l=p,((s=c)[0]-l[0])*(u[1]-s[1])-(s[0]-u[0])*(l[1]-s[1])<0)&&t.push([c.data,a.data,p.data])})),t},links:function(){return this.edges.filter((function(t){return t.right})).map((function(t){return{source:t.left.data,target:t.right.data}}))},find:function(t,e,n){for(var r,i,o=this,a=o._found||0,s=o.cells.length;!(i=o.cells[a]);)if(++a>=s)return null;var u=t-i.site[0],l=e-i.site[1],c=u*u+l*l;do{i=o.cells[r=a],a=null,i.halfedges.forEach((function(n){var r=o.edges[n],s=r.left;if(s!==i.site&&s||(s=r.right)){var u=t-s[0],l=e-s[1],f=u*u+l*l;f<c&&(c=f,a=s.index)}}))}while(null!==a);return o._found=r,null==n||c<=n*n?i.site:null}}},364:(t,e,n)=>{"use strict";n.d(e,{FK:()=>a,UV:()=>o,jN:()=>i,zb:()=>l});var r=n(2119);function i(t,e,n,i){var o=[null,null],s=r.$Y.push(o)-1;return o.left=t,o.right=e,n&&a(o,t,e,n),i&&a(o,e,t,i),r.gF[t.index].halfedges.push(s),r.gF[e.index].halfedges.push(s),o}function o(t,e,n){var r=[e,n];return r.left=t,r}function a(t,e,n,r){t[0]||t[1]?t.left===n?t[1]=r:t[0]=r:(t[0]=r,t.left=e,t.right=n)}function s(t,e,n,r,i){var o,a=t[0],s=t[1],u=a[0],l=a[1],c=0,f=1,h=s[0]-u,p=s[1]-l;if(o=e-u,h||!(o>0)){if(o/=h,h<0){if(o<c)return;o<f&&(f=o)}else if(h>0){if(o>f)return;o>c&&(c=o)}if(o=r-u,h||!(o<0)){if(o/=h,h<0){if(o>f)return;o>c&&(c=o)}else if(h>0){if(o<c)return;o<f&&(f=o)}if(o=n-l,p||!(o>0)){if(o/=p,p<0){if(o<c)return;o<f&&(f=o)}else if(p>0){if(o>f)return;o>c&&(c=o)}if(o=i-l,p||!(o<0)){if(o/=p,p<0){if(o>f)return;o>c&&(c=o)}else if(p>0){if(o<c)return;o<f&&(f=o)}return!(c>0||f<1)||(c>0&&(t[0]=[u+c*h,l+c*p]),f<1&&(t[1]=[u+f*h,l+f*p]),!0)}}}}}function u(t,e,n,r,i){var o=t[1];if(o)return!0;var a,s,u=t[0],l=t.left,c=t.right,f=l[0],h=l[1],p=c[0],d=c[1],g=(f+p)/2,v=(h+d)/2;if(d===h){if(g<e||g>=r)return;if(f>p){if(u){if(u[1]>=i)return}else u=[g,n];o=[g,i]}else{if(u){if(u[1]<n)return}else u=[g,i];o=[g,n]}}else if(s=v-(a=(f-p)/(d-h))*g,a<-1||a>1)if(f>p){if(u){if(u[1]>=i)return}else u=[(n-s)/a,n];o=[(i-s)/a,i]}else{if(u){if(u[1]<n)return}else u=[(i-s)/a,i];o=[(n-s)/a,n]}else if(h<d){if(u){if(u[0]>=r)return}else u=[e,a*e+s];o=[r,a*r+s]}else{if(u){if(u[0]<e)return}else u=[r,a*r+s];o=[e,a*e+s]}return t[0]=u,t[1]=o,!0}function l(t,e,n,i){for(var o,a=r.$Y.length;a--;)u(o=r.$Y[a],t,e,n,i)&&s(o,t,e,n,i)&&(Math.abs(o[0][0]-o[1][0])>r.Ho||Math.abs(o[0][1]-o[1][1])>r.Ho)||delete r.$Y[a]}},1791:(t,e,n)=>{"use strict";function r(){this._=null}function i(t){t.U=t.C=t.L=t.R=t.P=t.N=null}function o(t,e){var n=e,r=e.R,i=n.U;i?i.L===n?i.L=r:i.R=r:t._=r,r.U=i,n.U=r,n.R=r.L,n.R&&(n.R.U=n),r.L=n}function a(t,e){var n=e,r=e.L,i=n.U;i?i.L===n?i.L=r:i.R=r:t._=r,r.U=i,n.U=r,n.L=r.R,n.L&&(n.L.U=n),r.R=n}function s(t){for(;t.L;)t=t.L;return t}n.d(e,{Z:()=>u,q:()=>i}),r.prototype={constructor:r,insert:function(t,e){var n,r,i;if(t){if(e.P=t,e.N=t.N,t.N&&(t.N.P=e),t.N=e,t.R){for(t=t.R;t.L;)t=t.L;t.L=e}else t.R=e;n=t}else this._?(t=s(this._),e.P=null,e.N=t,t.P=t.L=e,n=t):(e.P=e.N=null,this._=e,n=null);for(e.L=e.R=null,e.U=n,e.C=!0,t=e;n&&n.C;)n===(r=n.U).L?(i=r.R)&&i.C?(n.C=i.C=!1,r.C=!0,t=r):(t===n.R&&(o(this,n),n=(t=n).U),n.C=!1,r.C=!0,a(this,r)):(i=r.L)&&i.C?(n.C=i.C=!1,r.C=!0,t=r):(t===n.L&&(a(this,n),n=(t=n).U),n.C=!1,r.C=!0,o(this,r)),n=t.U;this._.C=!1},remove:function(t){t.N&&(t.N.P=t.P),t.P&&(t.P.N=t.N),t.N=t.P=null;var e,n,r,i=t.U,u=t.L,l=t.R;if(n=u?l?s(l):u:l,i?i.L===t?i.L=n:i.R=n:this._=n,u&&l?(r=n.C,n.C=t.C,n.L=u,u.U=n,n!==l?(i=n.U,n.U=t.U,t=n.R,i.L=t,n.R=l,l.U=n):(n.U=i,i=n,t=n.R)):(r=t.C,t=n),t&&(t.U=i),!r)if(t&&t.C)t.C=!1;else{do{if(t===this._)break;if(t===i.L){if((e=i.R).C&&(e.C=!1,i.C=!0,o(this,i),e=i.R),e.L&&e.L.C||e.R&&e.R.C){e.R&&e.R.C||(e.L.C=!1,e.C=!0,a(this,e),e=i.R),e.C=i.C,i.C=e.R.C=!1,o(this,i),t=this._;break}}else if((e=i.L).C&&(e.C=!1,i.C=!0,a(this,i),e=i.L),e.L&&e.L.C||e.R&&e.R.C){e.L&&e.L.C||(e.R.C=!1,e.C=!0,o(this,e),e=i.L),e.C=i.C,i.C=e.L.C=!1,a(this,i),t=this._;break}e.C=!0,t=i,i=i.U}while(!t.C);t&&(t.C=!1)}}};const u=r},5117:(t,e,n)=>{"use strict";n(1122)},1122:(t,e,n)=>{"use strict";n(2119)},9750:(t,e,n)=>{"use strict";n(5115),n(4905)},4905:(t,e,n)=>{"use strict";function r(t,e,n){this.k=t,this.x=e,this.y=n}r.prototype={constructor:r,scale:function(t){return 1===t?this:new r(this.k*t,this.x,this.y)},translate:function(t,e){return 0===t&0===e?this:new r(this.k,this.x+this.k*t,this.y+this.k*e)},apply:function(t){return[t[0]*this.k+this.x,t[1]*this.k+this.y]},applyX:function(t){return t*this.k+this.x},applyY:function(t){return t*this.k+this.y},invert:function(t){return[(t[0]-this.x)/this.k,(t[1]-this.y)/this.k]},invertX:function(t){return(t-this.x)/this.k},invertY:function(t){return(t-this.y)/this.k},rescaleX:function(t){return t.copy().domain(t.range().map(this.invertX,this).map(t.invert,t))},rescaleY:function(t){return t.copy().domain(t.range().map(this.invertY,this).map(t.invert,t))},toString:function(){return"translate("+this.x+","+this.y+") scale("+this.k+")"}},new r(1,0,0),r.prototype},5115:(t,e,n)=>{"use strict";n(2263),n(4905)},2156:(t,e,n)=>{},662:(t,e,n)=>{"use strict";n.d(e,{Ba6:()=>i.B,Ys:()=>i.Ys,ohM:()=>r.oh,td_:()=>i.td}),n(2156),n(91),n(9216),n(4697),n(8860),n(2300),n(2833);var r=n(4840),i=(n(5224),n(1638),n(5315),n(9825));n(2263),n(5117),n(9750)},9755:function(t,e,n){var r=n(6738),i=n(6544);!function(e,n){"use strict";"object"==typeof t.exports?t.exports=e.document?n(e,!0):function(t){if(!t.document)throw new Error("jQuery requires a window with a document");return n(t)}:n(e)}(void 0!==r?r:this,(function(t,e){"use strict";var n=[],r=Object.getPrototypeOf,o=n.slice,a=n.flat?function(t){return n.flat.call(t)}:function(t){return n.concat.apply([],t)},s=n.push,u=n.indexOf,l={},c=l.toString,f=l.hasOwnProperty,h=f.toString,p=h.call(Object),d={},g=function(t){return"function"==typeof t&&"number"!=typeof t.nodeType},v=function(t){return null!=t&&t===t.window},y=t.document,m={type:!0,src:!0,nonce:!0,noModule:!0};function b(t,e,n){var r,i,o=(n=n||y).createElement("script");if(o.text=t,e)for(r in m)(i=e[r]||e.getAttribute&&e.getAttribute(r))&&o.setAttribute(r,i);n.head.appendChild(o).parentNode.removeChild(o)}function w(t){return null==t?t+"":"object"==typeof t||"function"==typeof t?l[c.call(t)]||"object":typeof t}var _="3.5.0",x=function(t,e){return new x.fn.init(t,e)};function k(t){var e=!!t&&"length"in t&&t.length,n=w(t);return!g(t)&&!v(t)&&("array"===n||0===e||"number"==typeof e&&e>0&&e-1 in t)}x.fn=x.prototype={jquery:_,constructor:x,length:0,toArray:function(){return o.call(this)},get:function(t){return null==t?o.call(this):t<0?this[t+this.length]:this[t]},pushStack:function(t){var e=x.merge(this.constructor(),t);return e.prevObject=this,e},each:function(t){return x.each(this,t)},map:function(t){return this.pushStack(x.map(this,(function(e,n){return t.call(e,n,e)})))},slice:function(){return this.pushStack(o.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},even:function(){return this.pushStack(x.grep(this,(function(t,e){return(e+1)%2})))},odd:function(){return this.pushStack(x.grep(this,(function(t,e){return e%2})))},eq:function(t){var e=this.length,n=+t+(t<0?e:0);return this.pushStack(n>=0&&n<e?[this[n]]:[])},end:function(){return this.prevObject||this.constructor()},push:s,sort:n.sort,splice:n.splice},x.extend=x.fn.extend=function(){var t,e,n,r,i,o,a=arguments[0]||{},s=1,u=arguments.length,l=!1;for("boolean"==typeof a&&(l=a,a=arguments[s]||{},s++),"object"==typeof a||g(a)||(a={}),s===u&&(a=this,s--);s<u;s++)if(null!=(t=arguments[s]))for(e in t)r=t[e],"__proto__"!==e&&a!==r&&(l&&r&&(x.isPlainObject(r)||(i=Array.isArray(r)))?(n=a[e],o=i&&!Array.isArray(n)?[]:i||x.isPlainObject(n)?n:{},i=!1,a[e]=x.extend(l,o,r)):void 0!==r&&(a[e]=r));return a},x.extend({expando:"jQuery"+(_+Math.random()).replace(/\D/g,""),isReady:!0,error:function(t){throw new Error(t)},noop:function(){},isPlainObject:function(t){var e,n;return!(!t||"[object Object]"!==c.call(t)||(e=r(t))&&("function"!=typeof(n=f.call(e,"constructor")&&e.constructor)||h.call(n)!==p))},isEmptyObject:function(t){var e;for(e in t)return!1;return!0},globalEval:function(t,e,n){b(t,{nonce:e&&e.nonce},n)},each:function(t,e){var n,r=0;if(k(t))for(n=t.length;r<n&&!1!==e.call(t[r],r,t[r]);r++);else for(r in t)if(!1===e.call(t[r],r,t[r]))break;return t},makeArray:function(t,e){var n=e||[];return null!=t&&(k(Object(t))?x.merge(n,"string"==typeof t?[t]:t):s.call(n,t)),n},inArray:function(t,e,n){return null==e?-1:u.call(e,t,n)},merge:function(t,e){for(var n=+e.length,r=0,i=t.length;r<n;r++)t[i++]=e[r];return t.length=i,t},grep:function(t,e,n){for(var r=[],i=0,o=t.length,a=!n;i<o;i++)!e(t[i],i)!==a&&r.push(t[i]);return r},map:function(t,e,n){var r,i,o=0,s=[];if(k(t))for(r=t.length;o<r;o++)null!=(i=e(t[o],o,n))&&s.push(i);else for(o in t)null!=(i=e(t[o],o,n))&&s.push(i);return a(s)},guid:1,support:d}),"function"==typeof Symbol&&(x.fn[Symbol.iterator]=n[Symbol.iterator]),x.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),(function(t,e){l["[object "+e+"]"]=e.toLowerCase()}));var S=function(t){var e,n,r,i,o,a,s,u,l,c,f,h,p,d,g,v,y,m,b,w="sizzle"+1*new Date,_=t.document,x=0,k=0,S=ut(),C=ut(),T=ut(),A=ut(),M=function(t,e){return t===e&&(f=!0),0},E={}.hasOwnProperty,N=[],P=N.pop,Z=N.push,I=N.push,j=N.slice,L=function(t,e){for(var n=0,r=t.length;n<r;n++)if(t[n]===e)return n;return-1},D="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",O="[\\x20\\t\\r\\n\\f]",R="(?:\\\\[\\da-fA-F]{1,6}"+O+"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",q="\\["+O+"*("+R+")(?:"+O+"*([*^$|!~]?=)"+O+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+R+"))|)"+O+"*\\]",H=":("+R+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+q+")*)|.*)\\)|)",F=new RegExp(O+"+","g"),B=new RegExp("^"+O+"+|((?:^|[^\\\\])(?:\\\\.)*)"+O+"+$","g"),$=new RegExp("^"+O+"*,"+O+"*"),z=new RegExp("^"+O+"*([>+~]|"+O+")"+O+"*"),U=new RegExp(O+"|>"),W=new RegExp(H),V=new RegExp("^"+R+"$"),Y={ID:new RegExp("^#("+R+")"),CLASS:new RegExp("^\\.("+R+")"),TAG:new RegExp("^("+R+"|[*])"),ATTR:new RegExp("^"+q),PSEUDO:new RegExp("^"+H),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+O+"*(even|odd|(([+-]|)(\\d*)n|)"+O+"*(?:([+-]|)"+O+"*(\\d+)|))"+O+"*\\)|)","i"),bool:new RegExp("^(?:"+D+")$","i"),needsContext:new RegExp("^"+O+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+O+"*((?:-\\d)?\\d*)"+O+"*\\)|)(?=[^-]|$)","i")},X=/HTML$/i,G=/^(?:input|select|textarea|button)$/i,Q=/^h\d$/i,J=/^[^{]+\{\s*\[native \w/,K=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,tt=/[+~]/,et=new RegExp("\\\\[\\da-fA-F]{1,6}"+O+"?|\\\\([^\\r\\n\\f])","g"),nt=function(t,e){var n="0x"+t.slice(1)-65536;return e||(n<0?String.fromCharCode(n+65536):String.fromCharCode(n>>10|55296,1023&n|56320))},rt=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,it=function(t,e){return e?"\0"===t?"�":t.slice(0,-1)+"\\"+t.charCodeAt(t.length-1).toString(16)+" ":"\\"+t},ot=function(){h()},at=wt((function(t){return!0===t.disabled&&"fieldset"===t.nodeName.toLowerCase()}),{dir:"parentNode",next:"legend"});try{I.apply(N=j.call(_.childNodes),_.childNodes),N[_.childNodes.length].nodeType}catch(t){I={apply:N.length?function(t,e){Z.apply(t,j.call(e))}:function(t,e){for(var n=t.length,r=0;t[n++]=e[r++];);t.length=n-1}}}function st(t,e,r,i){var o,s,l,c,f,d,y,m=e&&e.ownerDocument,_=e?e.nodeType:9;if(r=r||[],"string"!=typeof t||!t||1!==_&&9!==_&&11!==_)return r;if(!i&&(h(e),e=e||p,g)){if(11!==_&&(f=K.exec(t)))if(o=f[1]){if(9===_){if(!(l=e.getElementById(o)))return r;if(l.id===o)return r.push(l),r}else if(m&&(l=m.getElementById(o))&&b(e,l)&&l.id===o)return r.push(l),r}else{if(f[2])return I.apply(r,e.getElementsByTagName(t)),r;if((o=f[3])&&n.getElementsByClassName&&e.getElementsByClassName)return I.apply(r,e.getElementsByClassName(o)),r}if(n.qsa&&!A[t+" "]&&(!v||!v.test(t))&&(1!==_||"object"!==e.nodeName.toLowerCase())){if(y=t,m=e,1===_&&(U.test(t)||z.test(t))){for((m=tt.test(t)&&yt(e.parentNode)||e)===e&&n.scope||((c=e.getAttribute("id"))?c=c.replace(rt,it):e.setAttribute("id",c=w)),s=(d=a(t)).length;s--;)d[s]=(c?"#"+c:":scope")+" "+bt(d[s]);y=d.join(",")}try{return I.apply(r,m.querySelectorAll(y)),r}catch(e){A(t,!0)}finally{c===w&&e.removeAttribute("id")}}}return u(t.replace(B,"$1"),e,r,i)}function ut(){var t=[];return function e(n,i){return t.push(n+" ")>r.cacheLength&&delete e[t.shift()],e[n+" "]=i}}function lt(t){return t[w]=!0,t}function ct(t){var e=p.createElement("fieldset");try{return!!t(e)}catch(t){return!1}finally{e.parentNode&&e.parentNode.removeChild(e),e=null}}function ft(t,e){for(var n=t.split("|"),i=n.length;i--;)r.attrHandle[n[i]]=e}function ht(t,e){var n=e&&t,r=n&&1===t.nodeType&&1===e.nodeType&&t.sourceIndex-e.sourceIndex;if(r)return r;if(n)for(;n=n.nextSibling;)if(n===e)return-1;return t?1:-1}function pt(t){return function(e){return"input"===e.nodeName.toLowerCase()&&e.type===t}}function dt(t){return function(e){var n=e.nodeName.toLowerCase();return("input"===n||"button"===n)&&e.type===t}}function gt(t){return function(e){return"form"in e?e.parentNode&&!1===e.disabled?"label"in e?"label"in e.parentNode?e.parentNode.disabled===t:e.disabled===t:e.isDisabled===t||e.isDisabled!==!t&&at(e)===t:e.disabled===t:"label"in e&&e.disabled===t}}function vt(t){return lt((function(e){return e=+e,lt((function(n,r){for(var i,o=t([],n.length,e),a=o.length;a--;)n[i=o[a]]&&(n[i]=!(r[i]=n[i]))}))}))}function yt(t){return t&&void 0!==t.getElementsByTagName&&t}for(e in n=st.support={},o=st.isXML=function(t){var e=t.namespaceURI,n=(t.ownerDocument||t).documentElement;return!X.test(e||n&&n.nodeName||"HTML")},h=st.setDocument=function(t){var e,i,a=t?t.ownerDocument||t:_;return a!=p&&9===a.nodeType&&a.documentElement?(d=(p=a).documentElement,g=!o(p),_!=p&&(i=p.defaultView)&&i.top!==i&&(i.addEventListener?i.addEventListener("unload",ot,!1):i.attachEvent&&i.attachEvent("onunload",ot)),n.scope=ct((function(t){return d.appendChild(t).appendChild(p.createElement("div")),void 0!==t.querySelectorAll&&!t.querySelectorAll(":scope fieldset div").length})),n.attributes=ct((function(t){return t.className="i",!t.getAttribute("className")})),n.getElementsByTagName=ct((function(t){return t.appendChild(p.createComment("")),!t.getElementsByTagName("*").length})),n.getElementsByClassName=J.test(p.getElementsByClassName),n.getById=ct((function(t){return d.appendChild(t).id=w,!p.getElementsByName||!p.getElementsByName(w).length})),n.getById?(r.filter.ID=function(t){var e=t.replace(et,nt);return function(t){return t.getAttribute("id")===e}},r.find.ID=function(t,e){if(void 0!==e.getElementById&&g){var n=e.getElementById(t);return n?[n]:[]}}):(r.filter.ID=function(t){var e=t.replace(et,nt);return function(t){var n=void 0!==t.getAttributeNode&&t.getAttributeNode("id");return n&&n.value===e}},r.find.ID=function(t,e){if(void 0!==e.getElementById&&g){var n,r,i,o=e.getElementById(t);if(o){if((n=o.getAttributeNode("id"))&&n.value===t)return[o];for(i=e.getElementsByName(t),r=0;o=i[r++];)if((n=o.getAttributeNode("id"))&&n.value===t)return[o]}return[]}}),r.find.TAG=n.getElementsByTagName?function(t,e){return void 0!==e.getElementsByTagName?e.getElementsByTagName(t):n.qsa?e.querySelectorAll(t):void 0}:function(t,e){var n,r=[],i=0,o=e.getElementsByTagName(t);if("*"===t){for(;n=o[i++];)1===n.nodeType&&r.push(n);return r}return o},r.find.CLASS=n.getElementsByClassName&&function(t,e){if(void 0!==e.getElementsByClassName&&g)return e.getElementsByClassName(t)},y=[],v=[],(n.qsa=J.test(p.querySelectorAll))&&(ct((function(t){var e;d.appendChild(t).innerHTML="<a id='"+w+"'></a><select id='"+w+"-\r\\' msallowcapture=''><option selected=''></option></select>",t.querySelectorAll("[msallowcapture^='']").length&&v.push("[*^$]="+O+"*(?:''|\"\")"),t.querySelectorAll("[selected]").length||v.push("\\["+O+"*(?:value|"+D+")"),t.querySelectorAll("[id~="+w+"-]").length||v.push("~="),(e=p.createElement("input")).setAttribute("name",""),t.appendChild(e),t.querySelectorAll("[name='']").length||v.push("\\["+O+"*name"+O+"*="+O+"*(?:''|\"\")"),t.querySelectorAll(":checked").length||v.push(":checked"),t.querySelectorAll("a#"+w+"+*").length||v.push(".#.+[+~]"),t.querySelectorAll("\\\f"),v.push("[\\r\\n\\f]")})),ct((function(t){t.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var e=p.createElement("input");e.setAttribute("type","hidden"),t.appendChild(e).setAttribute("name","D"),t.querySelectorAll("[name=d]").length&&v.push("name"+O+"*[*^$|!~]?="),2!==t.querySelectorAll(":enabled").length&&v.push(":enabled",":disabled"),d.appendChild(t).disabled=!0,2!==t.querySelectorAll(":disabled").length&&v.push(":enabled",":disabled"),t.querySelectorAll("*,:x"),v.push(",.*:")}))),(n.matchesSelector=J.test(m=d.matches||d.webkitMatchesSelector||d.mozMatchesSelector||d.oMatchesSelector||d.msMatchesSelector))&&ct((function(t){n.disconnectedMatch=m.call(t,"*"),m.call(t,"[s!='']:x"),y.push("!=",H)})),v=v.length&&new RegExp(v.join("|")),y=y.length&&new RegExp(y.join("|")),e=J.test(d.compareDocumentPosition),b=e||J.test(d.contains)?function(t,e){var n=9===t.nodeType?t.documentElement:t,r=e&&e.parentNode;return t===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):t.compareDocumentPosition&&16&t.compareDocumentPosition(r)))}:function(t,e){if(e)for(;e=e.parentNode;)if(e===t)return!0;return!1},M=e?function(t,e){if(t===e)return f=!0,0;var r=!t.compareDocumentPosition-!e.compareDocumentPosition;return r||(1&(r=(t.ownerDocument||t)==(e.ownerDocument||e)?t.compareDocumentPosition(e):1)||!n.sortDetached&&e.compareDocumentPosition(t)===r?t==p||t.ownerDocument==_&&b(_,t)?-1:e==p||e.ownerDocument==_&&b(_,e)?1:c?L(c,t)-L(c,e):0:4&r?-1:1)}:function(t,e){if(t===e)return f=!0,0;var n,r=0,i=t.parentNode,o=e.parentNode,a=[t],s=[e];if(!i||!o)return t==p?-1:e==p?1:i?-1:o?1:c?L(c,t)-L(c,e):0;if(i===o)return ht(t,e);for(n=t;n=n.parentNode;)a.unshift(n);for(n=e;n=n.parentNode;)s.unshift(n);for(;a[r]===s[r];)r++;return r?ht(a[r],s[r]):a[r]==_?-1:s[r]==_?1:0},p):p},st.matches=function(t,e){return st(t,null,null,e)},st.matchesSelector=function(t,e){if(h(t),n.matchesSelector&&g&&!A[e+" "]&&(!y||!y.test(e))&&(!v||!v.test(e)))try{var r=m.call(t,e);if(r||n.disconnectedMatch||t.document&&11!==t.document.nodeType)return r}catch(t){A(e,!0)}return st(e,p,null,[t]).length>0},st.contains=function(t,e){return(t.ownerDocument||t)!=p&&h(t),b(t,e)},st.attr=function(t,e){(t.ownerDocument||t)!=p&&h(t);var i=r.attrHandle[e.toLowerCase()],o=i&&E.call(r.attrHandle,e.toLowerCase())?i(t,e,!g):void 0;return void 0!==o?o:n.attributes||!g?t.getAttribute(e):(o=t.getAttributeNode(e))&&o.specified?o.value:null},st.escape=function(t){return(t+"").replace(rt,it)},st.error=function(t){throw new Error("Syntax error, unrecognized expression: "+t)},st.uniqueSort=function(t){var e,r=[],i=0,o=0;if(f=!n.detectDuplicates,c=!n.sortStable&&t.slice(0),t.sort(M),f){for(;e=t[o++];)e===t[o]&&(i=r.push(o));for(;i--;)t.splice(r[i],1)}return c=null,t},i=st.getText=function(t){var e,n="",r=0,o=t.nodeType;if(o){if(1===o||9===o||11===o){if("string"==typeof t.textContent)return t.textContent;for(t=t.firstChild;t;t=t.nextSibling)n+=i(t)}else if(3===o||4===o)return t.nodeValue}else for(;e=t[r++];)n+=i(e);return n},r=st.selectors={cacheLength:50,createPseudo:lt,match:Y,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(t){return t[1]=t[1].replace(et,nt),t[3]=(t[3]||t[4]||t[5]||"").replace(et,nt),"~="===t[2]&&(t[3]=" "+t[3]+" "),t.slice(0,4)},CHILD:function(t){return t[1]=t[1].toLowerCase(),"nth"===t[1].slice(0,3)?(t[3]||st.error(t[0]),t[4]=+(t[4]?t[5]+(t[6]||1):2*("even"===t[3]||"odd"===t[3])),t[5]=+(t[7]+t[8]||"odd"===t[3])):t[3]&&st.error(t[0]),t},PSEUDO:function(t){var e,n=!t[6]&&t[2];return Y.CHILD.test(t[0])?null:(t[3]?t[2]=t[4]||t[5]||"":n&&W.test(n)&&(e=a(n,!0))&&(e=n.indexOf(")",n.length-e)-n.length)&&(t[0]=t[0].slice(0,e),t[2]=n.slice(0,e)),t.slice(0,3))}},filter:{TAG:function(t){var e=t.replace(et,nt).toLowerCase();return"*"===t?function(){return!0}:function(t){return t.nodeName&&t.nodeName.toLowerCase()===e}},CLASS:function(t){var e=S[t+" "];return e||(e=new RegExp("(^|"+O+")"+t+"("+O+"|$)"))&&S(t,(function(t){return e.test("string"==typeof t.className&&t.className||void 0!==t.getAttribute&&t.getAttribute("class")||"")}))},ATTR:function(t,e,n){return function(r){var i=st.attr(r,t);return null==i?"!="===e:!e||(i+="","="===e?i===n:"!="===e?i!==n:"^="===e?n&&0===i.indexOf(n):"*="===e?n&&i.indexOf(n)>-1:"$="===e?n&&i.slice(-n.length)===n:"~="===e?(" "+i.replace(F," ")+" ").indexOf(n)>-1:"|="===e&&(i===n||i.slice(0,n.length+1)===n+"-"))}},CHILD:function(t,e,n,r,i){var o="nth"!==t.slice(0,3),a="last"!==t.slice(-4),s="of-type"===e;return 1===r&&0===i?function(t){return!!t.parentNode}:function(e,n,u){var l,c,f,h,p,d,g=o!==a?"nextSibling":"previousSibling",v=e.parentNode,y=s&&e.nodeName.toLowerCase(),m=!u&&!s,b=!1;if(v){if(o){for(;g;){for(h=e;h=h[g];)if(s?h.nodeName.toLowerCase()===y:1===h.nodeType)return!1;d=g="only"===t&&!d&&"nextSibling"}return!0}if(d=[a?v.firstChild:v.lastChild],a&&m){for(b=(p=(l=(c=(f=(h=v)[w]||(h[w]={}))[h.uniqueID]||(f[h.uniqueID]={}))[t]||[])[0]===x&&l[1])&&l[2],h=p&&v.childNodes[p];h=++p&&h&&h[g]||(b=p=0)||d.pop();)if(1===h.nodeType&&++b&&h===e){c[t]=[x,p,b];break}}else if(m&&(b=p=(l=(c=(f=(h=e)[w]||(h[w]={}))[h.uniqueID]||(f[h.uniqueID]={}))[t]||[])[0]===x&&l[1]),!1===b)for(;(h=++p&&h&&h[g]||(b=p=0)||d.pop())&&((s?h.nodeName.toLowerCase()!==y:1!==h.nodeType)||!++b||(m&&((c=(f=h[w]||(h[w]={}))[h.uniqueID]||(f[h.uniqueID]={}))[t]=[x,b]),h!==e)););return(b-=i)===r||b%r==0&&b/r>=0}}},PSEUDO:function(t,e){var n,i=r.pseudos[t]||r.setFilters[t.toLowerCase()]||st.error("unsupported pseudo: "+t);return i[w]?i(e):i.length>1?(n=[t,t,"",e],r.setFilters.hasOwnProperty(t.toLowerCase())?lt((function(t,n){for(var r,o=i(t,e),a=o.length;a--;)t[r=L(t,o[a])]=!(n[r]=o[a])})):function(t){return i(t,0,n)}):i}},pseudos:{not:lt((function(t){var e=[],n=[],r=s(t.replace(B,"$1"));return r[w]?lt((function(t,e,n,i){for(var o,a=r(t,null,i,[]),s=t.length;s--;)(o=a[s])&&(t[s]=!(e[s]=o))})):function(t,i,o){return e[0]=t,r(e,null,o,n),e[0]=null,!n.pop()}})),has:lt((function(t){return function(e){return st(t,e).length>0}})),contains:lt((function(t){return t=t.replace(et,nt),function(e){return(e.textContent||i(e)).indexOf(t)>-1}})),lang:lt((function(t){return V.test(t||"")||st.error("unsupported lang: "+t),t=t.replace(et,nt).toLowerCase(),function(e){var n;do{if(n=g?e.lang:e.getAttribute("xml:lang")||e.getAttribute("lang"))return(n=n.toLowerCase())===t||0===n.indexOf(t+"-")}while((e=e.parentNode)&&1===e.nodeType);return!1}})),target:function(e){var n=t.location&&t.location.hash;return n&&n.slice(1)===e.id},root:function(t){return t===d},focus:function(t){return t===p.activeElement&&(!p.hasFocus||p.hasFocus())&&!!(t.type||t.href||~t.tabIndex)},enabled:gt(!1),disabled:gt(!0),checked:function(t){var e=t.nodeName.toLowerCase();return"input"===e&&!!t.checked||"option"===e&&!!t.selected},selected:function(t){return t.parentNode&&t.parentNode.selectedIndex,!0===t.selected},empty:function(t){for(t=t.firstChild;t;t=t.nextSibling)if(t.nodeType<6)return!1;return!0},parent:function(t){return!r.pseudos.empty(t)},header:function(t){return Q.test(t.nodeName)},input:function(t){return G.test(t.nodeName)},button:function(t){var e=t.nodeName.toLowerCase();return"input"===e&&"button"===t.type||"button"===e},text:function(t){var e;return"input"===t.nodeName.toLowerCase()&&"text"===t.type&&(null==(e=t.getAttribute("type"))||"text"===e.toLowerCase())},first:vt((function(){return[0]})),last:vt((function(t,e){return[e-1]})),eq:vt((function(t,e,n){return[n<0?n+e:n]})),even:vt((function(t,e){for(var n=0;n<e;n+=2)t.push(n);return t})),odd:vt((function(t,e){for(var n=1;n<e;n+=2)t.push(n);return t})),lt:vt((function(t,e,n){for(var r=n<0?n+e:n>e?e:n;--r>=0;)t.push(r);return t})),gt:vt((function(t,e,n){for(var r=n<0?n+e:n;++r<e;)t.push(r);return t}))}},r.pseudos.nth=r.pseudos.eq,{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})r.pseudos[e]=pt(e);for(e in{submit:!0,reset:!0})r.pseudos[e]=dt(e);function mt(){}function bt(t){for(var e=0,n=t.length,r="";e<n;e++)r+=t[e].value;return r}function wt(t,e,n){var r=e.dir,i=e.next,o=i||r,a=n&&"parentNode"===o,s=k++;return e.first?function(e,n,i){for(;e=e[r];)if(1===e.nodeType||a)return t(e,n,i);return!1}:function(e,n,u){var l,c,f,h=[x,s];if(u){for(;e=e[r];)if((1===e.nodeType||a)&&t(e,n,u))return!0}else for(;e=e[r];)if(1===e.nodeType||a)if(c=(f=e[w]||(e[w]={}))[e.uniqueID]||(f[e.uniqueID]={}),i&&i===e.nodeName.toLowerCase())e=e[r]||e;else{if((l=c[o])&&l[0]===x&&l[1]===s)return h[2]=l[2];if(c[o]=h,h[2]=t(e,n,u))return!0}return!1}}function _t(t){return t.length>1?function(e,n,r){for(var i=t.length;i--;)if(!t[i](e,n,r))return!1;return!0}:t[0]}function xt(t,e,n,r,i){for(var o,a=[],s=0,u=t.length,l=null!=e;s<u;s++)(o=t[s])&&(n&&!n(o,r,i)||(a.push(o),l&&e.push(s)));return a}function kt(t,e,n,r,i,o){return r&&!r[w]&&(r=kt(r)),i&&!i[w]&&(i=kt(i,o)),lt((function(o,a,s,u){var l,c,f,h=[],p=[],d=a.length,g=o||function(t,e,n){for(var r=0,i=e.length;r<i;r++)st(t,e[r],n);return n}(e||"*",s.nodeType?[s]:s,[]),v=!t||!o&&e?g:xt(g,h,t,s,u),y=n?i||(o?t:d||r)?[]:a:v;if(n&&n(v,y,s,u),r)for(l=xt(y,p),r(l,[],s,u),c=l.length;c--;)(f=l[c])&&(y[p[c]]=!(v[p[c]]=f));if(o){if(i||t){if(i){for(l=[],c=y.length;c--;)(f=y[c])&&l.push(v[c]=f);i(null,y=[],l,u)}for(c=y.length;c--;)(f=y[c])&&(l=i?L(o,f):h[c])>-1&&(o[l]=!(a[l]=f))}}else y=xt(y===a?y.splice(d,y.length):y),i?i(null,a,y,u):I.apply(a,y)}))}function St(t){for(var e,n,i,o=t.length,a=r.relative[t[0].type],s=a||r.relative[" "],u=a?1:0,c=wt((function(t){return t===e}),s,!0),f=wt((function(t){return L(e,t)>-1}),s,!0),h=[function(t,n,r){var i=!a&&(r||n!==l)||((e=n).nodeType?c(t,n,r):f(t,n,r));return e=null,i}];u<o;u++)if(n=r.relative[t[u].type])h=[wt(_t(h),n)];else{if((n=r.filter[t[u].type].apply(null,t[u].matches))[w]){for(i=++u;i<o&&!r.relative[t[i].type];i++);return kt(u>1&&_t(h),u>1&&bt(t.slice(0,u-1).concat({value:" "===t[u-2].type?"*":""})).replace(B,"$1"),n,u<i&&St(t.slice(u,i)),i<o&&St(t=t.slice(i)),i<o&&bt(t))}h.push(n)}return _t(h)}return mt.prototype=r.filters=r.pseudos,r.setFilters=new mt,a=st.tokenize=function(t,e){var n,i,o,a,s,u,l,c=C[t+" "];if(c)return e?0:c.slice(0);for(s=t,u=[],l=r.preFilter;s;){for(a in n&&!(i=$.exec(s))||(i&&(s=s.slice(i[0].length)||s),u.push(o=[])),n=!1,(i=z.exec(s))&&(n=i.shift(),o.push({value:n,type:i[0].replace(B," ")}),s=s.slice(n.length)),r.filter)!(i=Y[a].exec(s))||l[a]&&!(i=l[a](i))||(n=i.shift(),o.push({value:n,type:a,matches:i}),s=s.slice(n.length));if(!n)break}return e?s.length:s?st.error(t):C(t,u).slice(0)},s=st.compile=function(t,e){var n,i=[],o=[],s=T[t+" "];if(!s){for(e||(e=a(t)),n=e.length;n--;)(s=St(e[n]))[w]?i.push(s):o.push(s);s=T(t,function(t,e){var n=e.length>0,i=t.length>0,o=function(o,a,s,u,c){var f,d,v,y=0,m="0",b=o&&[],w=[],_=l,k=o||i&&r.find.TAG("*",c),S=x+=null==_?1:Math.random()||.1,C=k.length;for(c&&(l=a==p||a||c);m!==C&&null!=(f=k[m]);m++){if(i&&f){for(d=0,a||f.ownerDocument==p||(h(f),s=!g);v=t[d++];)if(v(f,a||p,s)){u.push(f);break}c&&(x=S)}n&&((f=!v&&f)&&y--,o&&b.push(f))}if(y+=m,n&&m!==y){for(d=0;v=e[d++];)v(b,w,a,s);if(o){if(y>0)for(;m--;)b[m]||w[m]||(w[m]=P.call(u));w=xt(w)}I.apply(u,w),c&&!o&&w.length>0&&y+e.length>1&&st.uniqueSort(u)}return c&&(x=S,l=_),b};return n?lt(o):o}(o,i)),s.selector=t}return s},u=st.select=function(t,e,n,i){var o,u,l,c,f,h="function"==typeof t&&t,p=!i&&a(t=h.selector||t);if(n=n||[],1===p.length){if((u=p[0]=p[0].slice(0)).length>2&&"ID"===(l=u[0]).type&&9===e.nodeType&&g&&r.relative[u[1].type]){if(!(e=(r.find.ID(l.matches[0].replace(et,nt),e)||[])[0]))return n;h&&(e=e.parentNode),t=t.slice(u.shift().value.length)}for(o=Y.needsContext.test(t)?0:u.length;o--&&(l=u[o],!r.relative[c=l.type]);)if((f=r.find[c])&&(i=f(l.matches[0].replace(et,nt),tt.test(u[0].type)&&yt(e.parentNode)||e))){if(u.splice(o,1),!(t=i.length&&bt(u)))return I.apply(n,i),n;break}}return(h||s(t,p))(i,e,!g,n,!e||tt.test(t)&&yt(e.parentNode)||e),n},n.sortStable=w.split("").sort(M).join("")===w,n.detectDuplicates=!!f,h(),n.sortDetached=ct((function(t){return 1&t.compareDocumentPosition(p.createElement("fieldset"))})),ct((function(t){return t.innerHTML="<a href='#'></a>","#"===t.firstChild.getAttribute("href")}))||ft("type|href|height|width",(function(t,e,n){if(!n)return t.getAttribute(e,"type"===e.toLowerCase()?1:2)})),n.attributes&&ct((function(t){return t.innerHTML="<input/>",t.firstChild.setAttribute("value",""),""===t.firstChild.getAttribute("value")}))||ft("value",(function(t,e,n){if(!n&&"input"===t.nodeName.toLowerCase())return t.defaultValue})),ct((function(t){return null==t.getAttribute("disabled")}))||ft(D,(function(t,e,n){var r;if(!n)return!0===t[e]?e.toLowerCase():(r=t.getAttributeNode(e))&&r.specified?r.value:null})),st}(t);x.find=S,x.expr=S.selectors,x.expr[":"]=x.expr.pseudos,x.uniqueSort=x.unique=S.uniqueSort,x.text=S.getText,x.isXMLDoc=S.isXML,x.contains=S.contains,x.escapeSelector=S.escape;var C=function(t,e,n){for(var r=[],i=void 0!==n;(t=t[e])&&9!==t.nodeType;)if(1===t.nodeType){if(i&&x(t).is(n))break;r.push(t)}return r},T=function(t,e){for(var n=[];t;t=t.nextSibling)1===t.nodeType&&t!==e&&n.push(t);return n},A=x.expr.match.needsContext;function M(t,e){return t.nodeName&&t.nodeName.toLowerCase()===e.toLowerCase()}var E=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;function N(t,e,n){return g(e)?x.grep(t,(function(t,r){return!!e.call(t,r,t)!==n})):e.nodeType?x.grep(t,(function(t){return t===e!==n})):"string"!=typeof e?x.grep(t,(function(t){return u.call(e,t)>-1!==n})):x.filter(e,t,n)}x.filter=function(t,e,n){var r=e[0];return n&&(t=":not("+t+")"),1===e.length&&1===r.nodeType?x.find.matchesSelector(r,t)?[r]:[]:x.find.matches(t,x.grep(e,(function(t){return 1===t.nodeType})))},x.fn.extend({find:function(t){var e,n,r=this.length,i=this;if("string"!=typeof t)return this.pushStack(x(t).filter((function(){for(e=0;e<r;e++)if(x.contains(i[e],this))return!0})));for(n=this.pushStack([]),e=0;e<r;e++)x.find(t,i[e],n);return r>1?x.uniqueSort(n):n},filter:function(t){return this.pushStack(N(this,t||[],!1))},not:function(t){return this.pushStack(N(this,t||[],!0))},is:function(t){return!!N(this,"string"==typeof t&&A.test(t)?x(t):t||[],!1).length}});var P,Z=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;(x.fn.init=function(t,e,n){var r,i;if(!t)return this;if(n=n||P,"string"==typeof t){if(!(r="<"===t[0]&&">"===t[t.length-1]&&t.length>=3?[null,t,null]:Z.exec(t))||!r[1]&&e)return!e||e.jquery?(e||n).find(t):this.constructor(e).find(t);if(r[1]){if(e=e instanceof x?e[0]:e,x.merge(this,x.parseHTML(r[1],e&&e.nodeType?e.ownerDocument||e:y,!0)),E.test(r[1])&&x.isPlainObject(e))for(r in e)g(this[r])?this[r](e[r]):this.attr(r,e[r]);return this}return(i=y.getElementById(r[2]))&&(this[0]=i,this.length=1),this}return t.nodeType?(this[0]=t,this.length=1,this):g(t)?void 0!==n.ready?n.ready(t):t(x):x.makeArray(t,this)}).prototype=x.fn,P=x(y);var I=/^(?:parents|prev(?:Until|All))/,j={children:!0,contents:!0,next:!0,prev:!0};function L(t,e){for(;(t=t[e])&&1!==t.nodeType;);return t}x.fn.extend({has:function(t){var e=x(t,this),n=e.length;return this.filter((function(){for(var t=0;t<n;t++)if(x.contains(this,e[t]))return!0}))},closest:function(t,e){var n,r=0,i=this.length,o=[],a="string"!=typeof t&&x(t);if(!A.test(t))for(;r<i;r++)for(n=this[r];n&&n!==e;n=n.parentNode)if(n.nodeType<11&&(a?a.index(n)>-1:1===n.nodeType&&x.find.matchesSelector(n,t))){o.push(n);break}return this.pushStack(o.length>1?x.uniqueSort(o):o)},index:function(t){return t?"string"==typeof t?u.call(x(t),this[0]):u.call(this,t.jquery?t[0]:t):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(t,e){return this.pushStack(x.uniqueSort(x.merge(this.get(),x(t,e))))},addBack:function(t){return this.add(null==t?this.prevObject:this.prevObject.filter(t))}}),x.each({parent:function(t){var e=t.parentNode;return e&&11!==e.nodeType?e:null},parents:function(t){return C(t,"parentNode")},parentsUntil:function(t,e,n){return C(t,"parentNode",n)},next:function(t){return L(t,"nextSibling")},prev:function(t){return L(t,"previousSibling")},nextAll:function(t){return C(t,"nextSibling")},prevAll:function(t){return C(t,"previousSibling")},nextUntil:function(t,e,n){return C(t,"nextSibling",n)},prevUntil:function(t,e,n){return C(t,"previousSibling",n)},siblings:function(t){return T((t.parentNode||{}).firstChild,t)},children:function(t){return T(t.firstChild)},contents:function(t){return null!=t.contentDocument&&r(t.contentDocument)?t.contentDocument:(M(t,"template")&&(t=t.content||t),x.merge([],t.childNodes))}},(function(t,e){x.fn[t]=function(n,r){var i=x.map(this,e,n);return"Until"!==t.slice(-5)&&(r=n),r&&"string"==typeof r&&(i=x.filter(r,i)),this.length>1&&(j[t]||x.uniqueSort(i),I.test(t)&&i.reverse()),this.pushStack(i)}}));var D=/[^\x20\t\r\n\f]+/g;function O(t){return t}function R(t){throw t}function q(t,e,n,r){var i;try{t&&g(i=t.promise)?i.call(t).done(e).fail(n):t&&g(i=t.then)?i.call(t,e,n):e.apply(void 0,[t].slice(r))}catch(t){n.apply(void 0,[t])}}x.Callbacks=function(t){t="string"==typeof t?function(t){var e={};return x.each(t.match(D)||[],(function(t,n){e[n]=!0})),e}(t):x.extend({},t);var e,n,r,i,o=[],a=[],s=-1,u=function(){for(i=i||t.once,r=e=!0;a.length;s=-1)for(n=a.shift();++s<o.length;)!1===o[s].apply(n[0],n[1])&&t.stopOnFalse&&(s=o.length,n=!1);t.memory||(n=!1),e=!1,i&&(o=n?[]:"")},l={add:function(){return o&&(n&&!e&&(s=o.length-1,a.push(n)),function e(n){x.each(n,(function(n,r){g(r)?t.unique&&l.has(r)||o.push(r):r&&r.length&&"string"!==w(r)&&e(r)}))}(arguments),n&&!e&&u()),this},remove:function(){return x.each(arguments,(function(t,e){for(var n;(n=x.inArray(e,o,n))>-1;)o.splice(n,1),n<=s&&s--})),this},has:function(t){return t?x.inArray(t,o)>-1:o.length>0},empty:function(){return o&&(o=[]),this},disable:function(){return i=a=[],o=n="",this},disabled:function(){return!o},lock:function(){return i=a=[],n||e||(o=n=""),this},locked:function(){return!!i},fireWith:function(t,n){return i||(n=[t,(n=n||[]).slice?n.slice():n],a.push(n),e||u()),this},fire:function(){return l.fireWith(this,arguments),this},fired:function(){return!!r}};return l},x.extend({Deferred:function(e){var n=[["notify","progress",x.Callbacks("memory"),x.Callbacks("memory"),2],["resolve","done",x.Callbacks("once memory"),x.Callbacks("once memory"),0,"resolved"],["reject","fail",x.Callbacks("once memory"),x.Callbacks("once memory"),1,"rejected"]],r="pending",i={state:function(){return r},always:function(){return o.done(arguments).fail(arguments),this},catch:function(t){return i.then(null,t)},pipe:function(){var t=arguments;return x.Deferred((function(e){x.each(n,(function(n,r){var i=g(t[r[4]])&&t[r[4]];o[r[1]]((function(){var t=i&&i.apply(this,arguments);t&&g(t.promise)?t.promise().progress(e.notify).done(e.resolve).fail(e.reject):e[r[0]+"With"](this,i?[t]:arguments)}))})),t=null})).promise()},then:function(e,r,i){var o=0;function a(e,n,r,i){return function(){var s=this,u=arguments,l=function(){var t,l;if(!(e<o)){if((t=r.apply(s,u))===n.promise())throw new TypeError("Thenable self-resolution");l=t&&("object"==typeof t||"function"==typeof t)&&t.then,g(l)?i?l.call(t,a(o,n,O,i),a(o,n,R,i)):(o++,l.call(t,a(o,n,O,i),a(o,n,R,i),a(o,n,O,n.notifyWith))):(r!==O&&(s=void 0,u=[t]),(i||n.resolveWith)(s,u))}},c=i?l:function(){try{l()}catch(t){x.Deferred.exceptionHook&&x.Deferred.exceptionHook(t,c.stackTrace),e+1>=o&&(r!==R&&(s=void 0,u=[t]),n.rejectWith(s,u))}};e?c():(x.Deferred.getStackHook&&(c.stackTrace=x.Deferred.getStackHook()),t.setTimeout(c))}}return x.Deferred((function(t){n[0][3].add(a(0,t,g(i)?i:O,t.notifyWith)),n[1][3].add(a(0,t,g(e)?e:O)),n[2][3].add(a(0,t,g(r)?r:R))})).promise()},promise:function(t){return null!=t?x.extend(t,i):i}},o={};return x.each(n,(function(t,e){var a=e[2],s=e[5];i[e[1]]=a.add,s&&a.add((function(){r=s}),n[3-t][2].disable,n[3-t][3].disable,n[0][2].lock,n[0][3].lock),a.add(e[3].fire),o[e[0]]=function(){return o[e[0]+"With"](this===o?void 0:this,arguments),this},o[e[0]+"With"]=a.fireWith})),i.promise(o),e&&e.call(o,o),o},when:function(t){var e=arguments.length,n=e,r=Array(n),i=o.call(arguments),a=x.Deferred(),s=function(t){return function(n){r[t]=this,i[t]=arguments.length>1?o.call(arguments):n,--e||a.resolveWith(r,i)}};if(e<=1&&(q(t,a.done(s(n)).resolve,a.reject,!e),"pending"===a.state()||g(i[n]&&i[n].then)))return a.then();for(;n--;)q(i[n],s(n),a.reject);return a.promise()}});var H=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;x.Deferred.exceptionHook=function(e,n){t.console&&t.console.warn&&e&&H.test(e.name)&&t.console.warn("jQuery.Deferred exception: "+e.message,e.stack,n)},x.readyException=function(e){t.setTimeout((function(){throw e}))};var F=x.Deferred();function B(){y.removeEventListener("DOMContentLoaded",B),t.removeEventListener("load",B),x.ready()}x.fn.ready=function(t){return F.then(t).catch((function(t){x.readyException(t)})),this},x.extend({isReady:!1,readyWait:1,ready:function(t){(!0===t?--x.readyWait:x.isReady)||(x.isReady=!0,!0!==t&&--x.readyWait>0||F.resolveWith(y,[x]))}}),x.ready.then=F.then,"complete"===y.readyState||"loading"!==y.readyState&&!y.documentElement.doScroll?t.setTimeout(x.ready):(y.addEventListener("DOMContentLoaded",B),t.addEventListener("load",B));var $=function(t,e,n,r,i,o,a){var s=0,u=t.length,l=null==n;if("object"===w(n))for(s in i=!0,n)$(t,e,s,n[s],!0,o,a);else if(void 0!==r&&(i=!0,g(r)||(a=!0),l&&(a?(e.call(t,r),e=null):(l=e,e=function(t,e,n){return l.call(x(t),n)})),e))for(;s<u;s++)e(t[s],n,a?r:r.call(t[s],s,e(t[s],n)));return i?t:l?e.call(t):u?e(t[0],n):o},z=/^-ms-/,U=/-([a-z])/g;function W(t,e){return e.toUpperCase()}function V(t){return t.replace(z,"ms-").replace(U,W)}var Y=function(t){return 1===t.nodeType||9===t.nodeType||!+t.nodeType};function X(){this.expando=x.expando+X.uid++}X.uid=1,X.prototype={cache:function(t){var e=t[this.expando];return e||(e=Object.create(null),Y(t)&&(t.nodeType?t[this.expando]=e:Object.defineProperty(t,this.expando,{value:e,configurable:!0}))),e},set:function(t,e,n){var r,i=this.cache(t);if("string"==typeof e)i[V(e)]=n;else for(r in e)i[V(r)]=e[r];return i},get:function(t,e){return void 0===e?this.cache(t):t[this.expando]&&t[this.expando][V(e)]},access:function(t,e,n){return void 0===e||e&&"string"==typeof e&&void 0===n?this.get(t,e):(this.set(t,e,n),void 0!==n?n:e)},remove:function(t,e){var n,r=t[this.expando];if(void 0!==r){if(void 0!==e){n=(e=Array.isArray(e)?e.map(V):(e=V(e))in r?[e]:e.match(D)||[]).length;for(;n--;)delete r[e[n]]}(void 0===e||x.isEmptyObject(r))&&(t.nodeType?t[this.expando]=void 0:delete t[this.expando])}},hasData:function(t){var e=t[this.expando];return void 0!==e&&!x.isEmptyObject(e)}};var G=new X,Q=new X,J=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,K=/[A-Z]/g;function tt(t,e,n){var r;if(void 0===n&&1===t.nodeType)if(r="data-"+e.replace(K,"-$&").toLowerCase(),"string"==typeof(n=t.getAttribute(r))){try{n=function(t){return"true"===t||"false"!==t&&("null"===t?null:t===+t+""?+t:J.test(t)?JSON.parse(t):t)}(n)}catch(t){}Q.set(t,e,n)}else n=void 0;return n}x.extend({hasData:function(t){return Q.hasData(t)||G.hasData(t)},data:function(t,e,n){return Q.access(t,e,n)},removeData:function(t,e){Q.remove(t,e)},_data:function(t,e,n){return G.access(t,e,n)},_removeData:function(t,e){G.remove(t,e)}}),x.fn.extend({data:function(t,e){var n,r,i,o=this[0],a=o&&o.attributes;if(void 0===t){if(this.length&&(i=Q.get(o),1===o.nodeType&&!G.get(o,"hasDataAttrs"))){for(n=a.length;n--;)a[n]&&0===(r=a[n].name).indexOf("data-")&&(r=V(r.slice(5)),tt(o,r,i[r]));G.set(o,"hasDataAttrs",!0)}return i}return"object"==typeof t?this.each((function(){Q.set(this,t)})):$(this,(function(e){var n;if(o&&void 0===e)return void 0!==(n=Q.get(o,t))||void 0!==(n=tt(o,t))?n:void 0;this.each((function(){Q.set(this,t,e)}))}),null,e,arguments.length>1,null,!0)},removeData:function(t){return this.each((function(){Q.remove(this,t)}))}}),x.extend({queue:function(t,e,n){var r;if(t)return e=(e||"fx")+"queue",r=G.get(t,e),n&&(!r||Array.isArray(n)?r=G.access(t,e,x.makeArray(n)):r.push(n)),r||[]},dequeue:function(t,e){e=e||"fx";var n=x.queue(t,e),r=n.length,i=n.shift(),o=x._queueHooks(t,e);"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===e&&n.unshift("inprogress"),delete o.stop,i.call(t,(function(){x.dequeue(t,e)}),o)),!r&&o&&o.empty.fire()},_queueHooks:function(t,e){var n=e+"queueHooks";return G.get(t,n)||G.access(t,n,{empty:x.Callbacks("once memory").add((function(){G.remove(t,[e+"queue",n])}))})}}),x.fn.extend({queue:function(t,e){var n=2;return"string"!=typeof t&&(e=t,t="fx",n--),arguments.length<n?x.queue(this[0],t):void 0===e?this:this.each((function(){var n=x.queue(this,t,e);x._queueHooks(this,t),"fx"===t&&"inprogress"!==n[0]&&x.dequeue(this,t)}))},dequeue:function(t){return this.each((function(){x.dequeue(this,t)}))},clearQueue:function(t){return this.queue(t||"fx",[])},promise:function(t,e){var n,r=1,i=x.Deferred(),o=this,a=this.length,s=function(){--r||i.resolveWith(o,[o])};for("string"!=typeof t&&(e=t,t=void 0),t=t||"fx";a--;)(n=G.get(o[a],t+"queueHooks"))&&n.empty&&(r++,n.empty.add(s));return s(),i.promise(e)}});var et=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,nt=new RegExp("^(?:([+-])=|)("+et+")([a-z%]*)$","i"),rt=["Top","Right","Bottom","Left"],it=y.documentElement,ot=function(t){return x.contains(t.ownerDocument,t)},at={composed:!0};it.getRootNode&&(ot=function(t){return x.contains(t.ownerDocument,t)||t.getRootNode(at)===t.ownerDocument});var st=function(t,e){return"none"===(t=e||t).style.display||""===t.style.display&&ot(t)&&"none"===x.css(t,"display")};function ut(t,e,n,r){var i,o,a=20,s=r?function(){return r.cur()}:function(){return x.css(t,e,"")},u=s(),l=n&&n[3]||(x.cssNumber[e]?"":"px"),c=t.nodeType&&(x.cssNumber[e]||"px"!==l&&+u)&&nt.exec(x.css(t,e));if(c&&c[3]!==l){for(u/=2,l=l||c[3],c=+u||1;a--;)x.style(t,e,c+l),(1-o)*(1-(o=s()/u||.5))<=0&&(a=0),c/=o;c*=2,x.style(t,e,c+l),n=n||[]}return n&&(c=+c||+u||0,i=n[1]?c+(n[1]+1)*n[2]:+n[2],r&&(r.unit=l,r.start=c,r.end=i)),i}var lt={};function ct(t){var e,n=t.ownerDocument,r=t.nodeName,i=lt[r];return i||(e=n.body.appendChild(n.createElement(r)),i=x.css(e,"display"),e.parentNode.removeChild(e),"none"===i&&(i="block"),lt[r]=i,i)}function ft(t,e){for(var n,r,i=[],o=0,a=t.length;o<a;o++)(r=t[o]).style&&(n=r.style.display,e?("none"===n&&(i[o]=G.get(r,"display")||null,i[o]||(r.style.display="")),""===r.style.display&&st(r)&&(i[o]=ct(r))):"none"!==n&&(i[o]="none",G.set(r,"display",n)));for(o=0;o<a;o++)null!=i[o]&&(t[o].style.display=i[o]);return t}x.fn.extend({show:function(){return ft(this,!0)},hide:function(){return ft(this)},toggle:function(t){return"boolean"==typeof t?t?this.show():this.hide():this.each((function(){st(this)?x(this).show():x(this).hide()}))}});var ht,pt,dt=/^(?:checkbox|radio)$/i,gt=/<([a-z][^\/\0>\x20\t\r\n\f]*)/i,vt=/^$|^module$|\/(?:java|ecma)script/i;ht=y.createDocumentFragment().appendChild(y.createElement("div")),(pt=y.createElement("input")).setAttribute("type","radio"),pt.setAttribute("checked","checked"),pt.setAttribute("name","t"),ht.appendChild(pt),d.checkClone=ht.cloneNode(!0).cloneNode(!0).lastChild.checked,ht.innerHTML="<textarea>x</textarea>",d.noCloneChecked=!!ht.cloneNode(!0).lastChild.defaultValue,ht.innerHTML="<option></option>",d.option=!!ht.lastChild;var yt={thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};function mt(t,e){var n;return n=void 0!==t.getElementsByTagName?t.getElementsByTagName(e||"*"):void 0!==t.querySelectorAll?t.querySelectorAll(e||"*"):[],void 0===e||e&&M(t,e)?x.merge([t],n):n}function bt(t,e){for(var n=0,r=t.length;n<r;n++)G.set(t[n],"globalEval",!e||G.get(e[n],"globalEval"))}yt.tbody=yt.tfoot=yt.colgroup=yt.caption=yt.thead,yt.th=yt.td,d.option||(yt.optgroup=yt.option=[1,"<select multiple='multiple'>","</select>"]);var wt=/<|&#?\w+;/;function _t(t,e,n,r,i){for(var o,a,s,u,l,c,f=e.createDocumentFragment(),h=[],p=0,d=t.length;p<d;p++)if((o=t[p])||0===o)if("object"===w(o))x.merge(h,o.nodeType?[o]:o);else if(wt.test(o)){for(a=a||f.appendChild(e.createElement("div")),s=(gt.exec(o)||["",""])[1].toLowerCase(),u=yt[s]||yt._default,a.innerHTML=u[1]+x.htmlPrefilter(o)+u[2],c=u[0];c--;)a=a.lastChild;x.merge(h,a.childNodes),(a=f.firstChild).textContent=""}else h.push(e.createTextNode(o));for(f.textContent="",p=0;o=h[p++];)if(r&&x.inArray(o,r)>-1)i&&i.push(o);else if(l=ot(o),a=mt(f.appendChild(o),"script"),l&&bt(a),n)for(c=0;o=a[c++];)vt.test(o.type||"")&&n.push(o);return f}var xt=/^key/,kt=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,St=/^([^.]*)(?:\.(.+)|)/;function Ct(){return!0}function Tt(){return!1}function At(t,e){return t===function(){try{return y.activeElement}catch(t){}}()==("focus"===e)}function Mt(t,e,n,r,i,o){var a,s;if("object"==typeof e){for(s in"string"!=typeof n&&(r=r||n,n=void 0),e)Mt(t,s,n,r,e[s],o);return t}if(null==r&&null==i?(i=n,r=n=void 0):null==i&&("string"==typeof n?(i=r,r=void 0):(i=r,r=n,n=void 0)),!1===i)i=Tt;else if(!i)return t;return 1===o&&(a=i,i=function(t){return x().off(t),a.apply(this,arguments)},i.guid=a.guid||(a.guid=x.guid++)),t.each((function(){x.event.add(this,e,i,r,n)}))}function Et(t,e,n){n?(G.set(t,e,!1),x.event.add(t,e,{namespace:!1,handler:function(t){var r,i,a=G.get(this,e);if(1&t.isTrigger&&this[e]){if(a.length)(x.event.special[e]||{}).delegateType&&t.stopPropagation();else if(a=o.call(arguments),G.set(this,e,a),r=n(this,e),this[e](),a!==(i=G.get(this,e))||r?G.set(this,e,!1):i={},a!==i)return t.stopImmediatePropagation(),t.preventDefault(),i.value}else a.length&&(G.set(this,e,{value:x.event.trigger(x.extend(a[0],x.Event.prototype),a.slice(1),this)}),t.stopImmediatePropagation())}})):void 0===G.get(t,e)&&x.event.add(t,e,Ct)}x.event={global:{},add:function(t,e,n,r,i){var o,a,s,u,l,c,f,h,p,d,g,v=G.get(t);if(Y(t))for(n.handler&&(n=(o=n).handler,i=o.selector),i&&x.find.matchesSelector(it,i),n.guid||(n.guid=x.guid++),(u=v.events)||(u=v.events=Object.create(null)),(a=v.handle)||(a=v.handle=function(e){return void 0!==x&&x.event.triggered!==e.type?x.event.dispatch.apply(t,arguments):void 0}),l=(e=(e||"").match(D)||[""]).length;l--;)p=g=(s=St.exec(e[l])||[])[1],d=(s[2]||"").split(".").sort(),p&&(f=x.event.special[p]||{},p=(i?f.delegateType:f.bindType)||p,f=x.event.special[p]||{},c=x.extend({type:p,origType:g,data:r,handler:n,guid:n.guid,selector:i,needsContext:i&&x.expr.match.needsContext.test(i),namespace:d.join(".")},o),(h=u[p])||((h=u[p]=[]).delegateCount=0,f.setup&&!1!==f.setup.call(t,r,d,a)||t.addEventListener&&t.addEventListener(p,a)),f.add&&(f.add.call(t,c),c.handler.guid||(c.handler.guid=n.guid)),i?h.splice(h.delegateCount++,0,c):h.push(c),x.event.global[p]=!0)},remove:function(t,e,n,r,i){var o,a,s,u,l,c,f,h,p,d,g,v=G.hasData(t)&&G.get(t);if(v&&(u=v.events)){for(l=(e=(e||"").match(D)||[""]).length;l--;)if(p=g=(s=St.exec(e[l])||[])[1],d=(s[2]||"").split(".").sort(),p){for(f=x.event.special[p]||{},h=u[p=(r?f.delegateType:f.bindType)||p]||[],s=s[2]&&new RegExp("(^|\\.)"+d.join("\\.(?:.*\\.|)")+"(\\.|$)"),a=o=h.length;o--;)c=h[o],!i&&g!==c.origType||n&&n.guid!==c.guid||s&&!s.test(c.namespace)||r&&r!==c.selector&&("**"!==r||!c.selector)||(h.splice(o,1),c.selector&&h.delegateCount--,f.remove&&f.remove.call(t,c));a&&!h.length&&(f.teardown&&!1!==f.teardown.call(t,d,v.handle)||x.removeEvent(t,p,v.handle),delete u[p])}else for(p in u)x.event.remove(t,p+e[l],n,r,!0);x.isEmptyObject(u)&&G.remove(t,"handle events")}},dispatch:function(t){var e,n,r,i,o,a,s=new Array(arguments.length),u=x.event.fix(t),l=(G.get(this,"events")||Object.create(null))[u.type]||[],c=x.event.special[u.type]||{};for(s[0]=u,e=1;e<arguments.length;e++)s[e]=arguments[e];if(u.delegateTarget=this,!c.preDispatch||!1!==c.preDispatch.call(this,u)){for(a=x.event.handlers.call(this,u,l),e=0;(i=a[e++])&&!u.isPropagationStopped();)for(u.currentTarget=i.elem,n=0;(o=i.handlers[n++])&&!u.isImmediatePropagationStopped();)u.rnamespace&&!1!==o.namespace&&!u.rnamespace.test(o.namespace)||(u.handleObj=o,u.data=o.data,void 0!==(r=((x.event.special[o.origType]||{}).handle||o.handler).apply(i.elem,s))&&!1===(u.result=r)&&(u.preventDefault(),u.stopPropagation()));return c.postDispatch&&c.postDispatch.call(this,u),u.result}},handlers:function(t,e){var n,r,i,o,a,s=[],u=e.delegateCount,l=t.target;if(u&&l.nodeType&&!("click"===t.type&&t.button>=1))for(;l!==this;l=l.parentNode||this)if(1===l.nodeType&&("click"!==t.type||!0!==l.disabled)){for(o=[],a={},n=0;n<u;n++)void 0===a[i=(r=e[n]).selector+" "]&&(a[i]=r.needsContext?x(i,this).index(l)>-1:x.find(i,this,null,[l]).length),a[i]&&o.push(r);o.length&&s.push({elem:l,handlers:o})}return l=this,u<e.length&&s.push({elem:l,handlers:e.slice(u)}),s},addProp:function(t,e){Object.defineProperty(x.Event.prototype,t,{enumerable:!0,configurable:!0,get:g(e)?function(){if(this.originalEvent)return e(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[t]},set:function(e){Object.defineProperty(this,t,{enumerable:!0,configurable:!0,writable:!0,value:e})}})},fix:function(t){return t[x.expando]?t:new x.Event(t)},special:{load:{noBubble:!0},click:{setup:function(t){var e=this||t;return dt.test(e.type)&&e.click&&M(e,"input")&&Et(e,"click",Ct),!1},trigger:function(t){var e=this||t;return dt.test(e.type)&&e.click&&M(e,"input")&&Et(e,"click"),!0},_default:function(t){var e=t.target;return dt.test(e.type)&&e.click&&M(e,"input")&&G.get(e,"click")||M(e,"a")}},beforeunload:{postDispatch:function(t){void 0!==t.result&&t.originalEvent&&(t.originalEvent.returnValue=t.result)}}}},x.removeEvent=function(t,e,n){t.removeEventListener&&t.removeEventListener(e,n)},x.Event=function(t,e){if(!(this instanceof x.Event))return new x.Event(t,e);t&&t.type?(this.originalEvent=t,this.type=t.type,this.isDefaultPrevented=t.defaultPrevented||void 0===t.defaultPrevented&&!1===t.returnValue?Ct:Tt,this.target=t.target&&3===t.target.nodeType?t.target.parentNode:t.target,this.currentTarget=t.currentTarget,this.relatedTarget=t.relatedTarget):this.type=t,e&&x.extend(this,e),this.timeStamp=t&&t.timeStamp||Date.now(),this[x.expando]=!0},x.Event.prototype={constructor:x.Event,isDefaultPrevented:Tt,isPropagationStopped:Tt,isImmediatePropagationStopped:Tt,isSimulated:!1,preventDefault:function(){var t=this.originalEvent;this.isDefaultPrevented=Ct,t&&!this.isSimulated&&t.preventDefault()},stopPropagation:function(){var t=this.originalEvent;this.isPropagationStopped=Ct,t&&!this.isSimulated&&t.stopPropagation()},stopImmediatePropagation:function(){var t=this.originalEvent;this.isImmediatePropagationStopped=Ct,t&&!this.isSimulated&&t.stopImmediatePropagation(),this.stopPropagation()}},x.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,char:!0,code:!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:function(t){var e=t.button;return null==t.which&&xt.test(t.type)?null!=t.charCode?t.charCode:t.keyCode:!t.which&&void 0!==e&&kt.test(t.type)?1&e?1:2&e?3:4&e?2:0:t.which}},x.event.addProp),x.each({focus:"focusin",blur:"focusout"},(function(t,e){x.event.special[t]={setup:function(){return Et(this,t,At),!1},trigger:function(){return Et(this,t),!0},delegateType:e}})),x.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},(function(t,e){x.event.special[t]={delegateType:e,bindType:e,handle:function(t){var n,r=this,i=t.relatedTarget,o=t.handleObj;return i&&(i===r||x.contains(r,i))||(t.type=o.origType,n=o.handler.apply(this,arguments),t.type=e),n}}})),x.fn.extend({on:function(t,e,n,r){return Mt(this,t,e,n,r)},one:function(t,e,n,r){return Mt(this,t,e,n,r,1)},off:function(t,e,n){var r,i;if(t&&t.preventDefault&&t.handleObj)return r=t.handleObj,x(t.delegateTarget).off(r.namespace?r.origType+"."+r.namespace:r.origType,r.selector,r.handler),this;if("object"==typeof t){for(i in t)this.off(i,e,t[i]);return this}return!1!==e&&"function"!=typeof e||(n=e,e=void 0),!1===n&&(n=Tt),this.each((function(){x.event.remove(this,t,n,e)}))}});var Nt=/<script|<style|<link/i,Pt=/checked\s*(?:[^=]|=\s*.checked.)/i,Zt=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function It(t,e){return M(t,"table")&&M(11!==e.nodeType?e:e.firstChild,"tr")&&x(t).children("tbody")[0]||t}function jt(t){return t.type=(null!==t.getAttribute("type"))+"/"+t.type,t}function Lt(t){return"true/"===(t.type||"").slice(0,5)?t.type=t.type.slice(5):t.removeAttribute("type"),t}function Dt(t,e){var n,r,i,o,a,s;if(1===e.nodeType){if(G.hasData(t)&&(s=G.get(t).events))for(i in G.remove(e,"handle events"),s)for(n=0,r=s[i].length;n<r;n++)x.event.add(e,i,s[i][n]);Q.hasData(t)&&(o=Q.access(t),a=x.extend({},o),Q.set(e,a))}}function Ot(t,e){var n=e.nodeName.toLowerCase();"input"===n&&dt.test(t.type)?e.checked=t.checked:"input"!==n&&"textarea"!==n||(e.defaultValue=t.defaultValue)}function Rt(t,e,n,r){e=a(e);var i,o,s,u,l,c,f=0,h=t.length,p=h-1,v=e[0],y=g(v);if(y||h>1&&"string"==typeof v&&!d.checkClone&&Pt.test(v))return t.each((function(i){var o=t.eq(i);y&&(e[0]=v.call(this,i,o.html())),Rt(o,e,n,r)}));if(h&&(o=(i=_t(e,t[0].ownerDocument,!1,t,r)).firstChild,1===i.childNodes.length&&(i=o),o||r)){for(u=(s=x.map(mt(i,"script"),jt)).length;f<h;f++)l=i,f!==p&&(l=x.clone(l,!0,!0),u&&x.merge(s,mt(l,"script"))),n.call(t[f],l,f);if(u)for(c=s[s.length-1].ownerDocument,x.map(s,Lt),f=0;f<u;f++)l=s[f],vt.test(l.type||"")&&!G.access(l,"globalEval")&&x.contains(c,l)&&(l.src&&"module"!==(l.type||"").toLowerCase()?x._evalUrl&&!l.noModule&&x._evalUrl(l.src,{nonce:l.nonce||l.getAttribute("nonce")},c):b(l.textContent.replace(Zt,""),l,c))}return t}function qt(t,e,n){for(var r,i=e?x.filter(e,t):t,o=0;null!=(r=i[o]);o++)n||1!==r.nodeType||x.cleanData(mt(r)),r.parentNode&&(n&&ot(r)&&bt(mt(r,"script")),r.parentNode.removeChild(r));return t}x.extend({htmlPrefilter:function(t){return t},clone:function(t,e,n){var r,i,o,a,s=t.cloneNode(!0),u=ot(t);if(!(d.noCloneChecked||1!==t.nodeType&&11!==t.nodeType||x.isXMLDoc(t)))for(a=mt(s),r=0,i=(o=mt(t)).length;r<i;r++)Ot(o[r],a[r]);if(e)if(n)for(o=o||mt(t),a=a||mt(s),r=0,i=o.length;r<i;r++)Dt(o[r],a[r]);else Dt(t,s);return(a=mt(s,"script")).length>0&&bt(a,!u&&mt(t,"script")),s},cleanData:function(t){for(var e,n,r,i=x.event.special,o=0;void 0!==(n=t[o]);o++)if(Y(n)){if(e=n[G.expando]){if(e.events)for(r in e.events)i[r]?x.event.remove(n,r):x.removeEvent(n,r,e.handle);n[G.expando]=void 0}n[Q.expando]&&(n[Q.expando]=void 0)}}}),x.fn.extend({detach:function(t){return qt(this,t,!0)},remove:function(t){return qt(this,t)},text:function(t){return $(this,(function(t){return void 0===t?x.text(this):this.empty().each((function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=t)}))}),null,t,arguments.length)},append:function(){return Rt(this,arguments,(function(t){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||It(this,t).appendChild(t)}))},prepend:function(){return Rt(this,arguments,(function(t){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var e=It(this,t);e.insertBefore(t,e.firstChild)}}))},before:function(){return Rt(this,arguments,(function(t){this.parentNode&&this.parentNode.insertBefore(t,this)}))},after:function(){return Rt(this,arguments,(function(t){this.parentNode&&this.parentNode.insertBefore(t,this.nextSibling)}))},empty:function(){for(var t,e=0;null!=(t=this[e]);e++)1===t.nodeType&&(x.cleanData(mt(t,!1)),t.textContent="");return this},clone:function(t,e){return t=null!=t&&t,e=null==e?t:e,this.map((function(){return x.clone(this,t,e)}))},html:function(t){return $(this,(function(t){var e=this[0]||{},n=0,r=this.length;if(void 0===t&&1===e.nodeType)return e.innerHTML;if("string"==typeof t&&!Nt.test(t)&&!yt[(gt.exec(t)||["",""])[1].toLowerCase()]){t=x.htmlPrefilter(t);try{for(;n<r;n++)1===(e=this[n]||{}).nodeType&&(x.cleanData(mt(e,!1)),e.innerHTML=t);e=0}catch(t){}}e&&this.empty().append(t)}),null,t,arguments.length)},replaceWith:function(){var t=[];return Rt(this,arguments,(function(e){var n=this.parentNode;x.inArray(this,t)<0&&(x.cleanData(mt(this)),n&&n.replaceChild(e,this))}),t)}}),x.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},(function(t,e){x.fn[t]=function(t){for(var n,r=[],i=x(t),o=i.length-1,a=0;a<=o;a++)n=a===o?this:this.clone(!0),x(i[a])[e](n),s.apply(r,n.get());return this.pushStack(r)}}));var Ht=new RegExp("^("+et+")(?!px)[a-z%]+$","i"),Ft=function(e){var n=e.ownerDocument.defaultView;return n&&n.opener||(n=t),n.getComputedStyle(e)},Bt=function(t,e,n){var r,i,o={};for(i in e)o[i]=t.style[i],t.style[i]=e[i];for(i in r=n.call(t),e)t.style[i]=o[i];return r},$t=new RegExp(rt.join("|"),"i");function zt(t,e,n){var r,i,o,a,s=t.style;return(n=n||Ft(t))&&(""!==(a=n.getPropertyValue(e)||n[e])||ot(t)||(a=x.style(t,e)),!d.pixelBoxStyles()&&Ht.test(a)&&$t.test(e)&&(r=s.width,i=s.minWidth,o=s.maxWidth,s.minWidth=s.maxWidth=s.width=a,a=n.width,s.width=r,s.minWidth=i,s.maxWidth=o)),void 0!==a?a+"":a}function Ut(t,e){return{get:function(){if(!t())return(this.get=e).apply(this,arguments);delete this.get}}}!function(){function e(){if(c){l.style.cssText="position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0",c.style.cssText="position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%",it.appendChild(l).appendChild(c);var e=t.getComputedStyle(c);r="1%"!==e.top,u=12===n(e.marginLeft),c.style.right="60%",a=36===n(e.right),i=36===n(e.width),c.style.position="absolute",o=12===n(c.offsetWidth/3),it.removeChild(l),c=null}}function n(t){return Math.round(parseFloat(t))}var r,i,o,a,s,u,l=y.createElement("div"),c=y.createElement("div");c.style&&(c.style.backgroundClip="content-box",c.cloneNode(!0).style.backgroundClip="",d.clearCloneStyle="content-box"===c.style.backgroundClip,x.extend(d,{boxSizingReliable:function(){return e(),i},pixelBoxStyles:function(){return e(),a},pixelPosition:function(){return e(),r},reliableMarginLeft:function(){return e(),u},scrollboxSize:function(){return e(),o},reliableTrDimensions:function(){var e,n,r,i;return null==s&&(e=y.createElement("table"),n=y.createElement("tr"),r=y.createElement("div"),e.style.cssText="position:absolute;left:-11111px",n.style.height="1px",r.style.height="9px",it.appendChild(e).appendChild(n).appendChild(r),i=t.getComputedStyle(n),s=parseInt(i.height)>3,it.removeChild(e)),s}}))}();var Wt=["Webkit","Moz","ms"],Vt=y.createElement("div").style,Yt={};function Xt(t){return x.cssProps[t]||Yt[t]||(t in Vt?t:Yt[t]=function(t){for(var e=t[0].toUpperCase()+t.slice(1),n=Wt.length;n--;)if((t=Wt[n]+e)in Vt)return t}(t)||t)}var Gt=/^(none|table(?!-c[ea]).+)/,Qt=/^--/,Jt={position:"absolute",visibility:"hidden",display:"block"},Kt={letterSpacing:"0",fontWeight:"400"};function te(t,e,n){var r=nt.exec(e);return r?Math.max(0,r[2]-(n||0))+(r[3]||"px"):e}function ee(t,e,n,r,i,o){var a="width"===e?1:0,s=0,u=0;if(n===(r?"border":"content"))return 0;for(;a<4;a+=2)"margin"===n&&(u+=x.css(t,n+rt[a],!0,i)),r?("content"===n&&(u-=x.css(t,"padding"+rt[a],!0,i)),"margin"!==n&&(u-=x.css(t,"border"+rt[a]+"Width",!0,i))):(u+=x.css(t,"padding"+rt[a],!0,i),"padding"!==n?u+=x.css(t,"border"+rt[a]+"Width",!0,i):s+=x.css(t,"border"+rt[a]+"Width",!0,i));return!r&&o>=0&&(u+=Math.max(0,Math.ceil(t["offset"+e[0].toUpperCase()+e.slice(1)]-o-u-s-.5))||0),u}function ne(t,e,n){var r=Ft(t),i=(!d.boxSizingReliable()||n)&&"border-box"===x.css(t,"boxSizing",!1,r),o=i,a=zt(t,e,r),s="offset"+e[0].toUpperCase()+e.slice(1);if(Ht.test(a)){if(!n)return a;a="auto"}return(!d.boxSizingReliable()&&i||!d.reliableTrDimensions()&&M(t,"tr")||"auto"===a||!parseFloat(a)&&"inline"===x.css(t,"display",!1,r))&&t.getClientRects().length&&(i="border-box"===x.css(t,"boxSizing",!1,r),(o=s in t)&&(a=t[s])),(a=parseFloat(a)||0)+ee(t,e,n||(i?"border":"content"),o,r,a)+"px"}function re(t,e,n,r,i){return new re.prototype.init(t,e,n,r,i)}x.extend({cssHooks:{opacity:{get:function(t,e){if(e){var n=zt(t,"opacity");return""===n?"1":n}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,gridArea:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnStart:!0,gridRow:!0,gridRowEnd:!0,gridRowStart:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{},style:function(t,e,n,r){if(t&&3!==t.nodeType&&8!==t.nodeType&&t.style){var i,o,a,s=V(e),u=Qt.test(e),l=t.style;if(u||(e=Xt(s)),a=x.cssHooks[e]||x.cssHooks[s],void 0===n)return a&&"get"in a&&void 0!==(i=a.get(t,!1,r))?i:l[e];"string"==(o=typeof n)&&(i=nt.exec(n))&&i[1]&&(n=ut(t,e,i),o="number"),null!=n&&n==n&&("number"!==o||u||(n+=i&&i[3]||(x.cssNumber[s]?"":"px")),d.clearCloneStyle||""!==n||0!==e.indexOf("background")||(l[e]="inherit"),a&&"set"in a&&void 0===(n=a.set(t,n,r))||(u?l.setProperty(e,n):l[e]=n))}},css:function(t,e,n,r){var i,o,a,s=V(e);return Qt.test(e)||(e=Xt(s)),(a=x.cssHooks[e]||x.cssHooks[s])&&"get"in a&&(i=a.get(t,!0,n)),void 0===i&&(i=zt(t,e,r)),"normal"===i&&e in Kt&&(i=Kt[e]),""===n||n?(o=parseFloat(i),!0===n||isFinite(o)?o||0:i):i}}),x.each(["height","width"],(function(t,e){x.cssHooks[e]={get:function(t,n,r){if(n)return!Gt.test(x.css(t,"display"))||t.getClientRects().length&&t.getBoundingClientRect().width?ne(t,e,r):Bt(t,Jt,(function(){return ne(t,e,r)}))},set:function(t,n,r){var i,o=Ft(t),a=!d.scrollboxSize()&&"absolute"===o.position,s=(a||r)&&"border-box"===x.css(t,"boxSizing",!1,o),u=r?ee(t,e,r,s,o):0;return s&&a&&(u-=Math.ceil(t["offset"+e[0].toUpperCase()+e.slice(1)]-parseFloat(o[e])-ee(t,e,"border",!1,o)-.5)),u&&(i=nt.exec(n))&&"px"!==(i[3]||"px")&&(t.style[e]=n,n=x.css(t,e)),te(0,n,u)}}})),x.cssHooks.marginLeft=Ut(d.reliableMarginLeft,(function(t,e){if(e)return(parseFloat(zt(t,"marginLeft"))||t.getBoundingClientRect().left-Bt(t,{marginLeft:0},(function(){return t.getBoundingClientRect().left})))+"px"})),x.each({margin:"",padding:"",border:"Width"},(function(t,e){x.cssHooks[t+e]={expand:function(n){for(var r=0,i={},o="string"==typeof n?n.split(" "):[n];r<4;r++)i[t+rt[r]+e]=o[r]||o[r-2]||o[0];return i}},"margin"!==t&&(x.cssHooks[t+e].set=te)})),x.fn.extend({css:function(t,e){return $(this,(function(t,e,n){var r,i,o={},a=0;if(Array.isArray(e)){for(r=Ft(t),i=e.length;a<i;a++)o[e[a]]=x.css(t,e[a],!1,r);return o}return void 0!==n?x.style(t,e,n):x.css(t,e)}),t,e,arguments.length>1)}}),x.Tween=re,re.prototype={constructor:re,init:function(t,e,n,r,i,o){this.elem=t,this.prop=n,this.easing=i||x.easing._default,this.options=e,this.start=this.now=this.cur(),this.end=r,this.unit=o||(x.cssNumber[n]?"":"px")},cur:function(){var t=re.propHooks[this.prop];return t&&t.get?t.get(this):re.propHooks._default.get(this)},run:function(t){var e,n=re.propHooks[this.prop];return this.options.duration?this.pos=e=x.easing[this.easing](t,this.options.duration*t,0,1,this.options.duration):this.pos=e=t,this.now=(this.end-this.start)*e+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):re.propHooks._default.set(this),this}},re.prototype.init.prototype=re.prototype,re.propHooks={_default:{get:function(t){var e;return 1!==t.elem.nodeType||null!=t.elem[t.prop]&&null==t.elem.style[t.prop]?t.elem[t.prop]:(e=x.css(t.elem,t.prop,""))&&"auto"!==e?e:0},set:function(t){x.fx.step[t.prop]?x.fx.step[t.prop](t):1!==t.elem.nodeType||!x.cssHooks[t.prop]&&null==t.elem.style[Xt(t.prop)]?t.elem[t.prop]=t.now:x.style(t.elem,t.prop,t.now+t.unit)}}},re.propHooks.scrollTop=re.propHooks.scrollLeft={set:function(t){t.elem.nodeType&&t.elem.parentNode&&(t.elem[t.prop]=t.now)}},x.easing={linear:function(t){return t},swing:function(t){return.5-Math.cos(t*Math.PI)/2},_default:"swing"},x.fx=re.prototype.init,x.fx.step={};var ie,oe,ae=/^(?:toggle|show|hide)$/,se=/queueHooks$/;function ue(){oe&&(!1===y.hidden&&t.requestAnimationFrame?t.requestAnimationFrame(ue):t.setTimeout(ue,x.fx.interval),x.fx.tick())}function le(){return t.setTimeout((function(){ie=void 0})),ie=Date.now()}function ce(t,e){var n,r=0,i={height:t};for(e=e?1:0;r<4;r+=2-e)i["margin"+(n=rt[r])]=i["padding"+n]=t;return e&&(i.opacity=i.width=t),i}function fe(t,e,n){for(var r,i=(he.tweeners[e]||[]).concat(he.tweeners["*"]),o=0,a=i.length;o<a;o++)if(r=i[o].call(n,e,t))return r}function he(t,e,n){var r,i,o=0,a=he.prefilters.length,s=x.Deferred().always((function(){delete u.elem})),u=function(){if(i)return!1;for(var e=ie||le(),n=Math.max(0,l.startTime+l.duration-e),r=1-(n/l.duration||0),o=0,a=l.tweens.length;o<a;o++)l.tweens[o].run(r);return s.notifyWith(t,[l,r,n]),r<1&&a?n:(a||s.notifyWith(t,[l,1,0]),s.resolveWith(t,[l]),!1)},l=s.promise({elem:t,props:x.extend({},e),opts:x.extend(!0,{specialEasing:{},easing:x.easing._default},n),originalProperties:e,originalOptions:n,startTime:ie||le(),duration:n.duration,tweens:[],createTween:function(e,n){var r=x.Tween(t,l.opts,e,n,l.opts.specialEasing[e]||l.opts.easing);return l.tweens.push(r),r},stop:function(e){var n=0,r=e?l.tweens.length:0;if(i)return this;for(i=!0;n<r;n++)l.tweens[n].run(1);return e?(s.notifyWith(t,[l,1,0]),s.resolveWith(t,[l,e])):s.rejectWith(t,[l,e]),this}}),c=l.props;for(function(t,e){var n,r,i,o,a;for(n in t)if(i=e[r=V(n)],o=t[n],Array.isArray(o)&&(i=o[1],o=t[n]=o[0]),n!==r&&(t[r]=o,delete t[n]),(a=x.cssHooks[r])&&"expand"in a)for(n in o=a.expand(o),delete t[r],o)n in t||(t[n]=o[n],e[n]=i);else e[r]=i}(c,l.opts.specialEasing);o<a;o++)if(r=he.prefilters[o].call(l,t,c,l.opts))return g(r.stop)&&(x._queueHooks(l.elem,l.opts.queue).stop=r.stop.bind(r)),r;return x.map(c,fe,l),g(l.opts.start)&&l.opts.start.call(t,l),l.progress(l.opts.progress).done(l.opts.done,l.opts.complete).fail(l.opts.fail).always(l.opts.always),x.fx.timer(x.extend(u,{elem:t,anim:l,queue:l.opts.queue})),l}x.Animation=x.extend(he,{tweeners:{"*":[function(t,e){var n=this.createTween(t,e);return ut(n.elem,t,nt.exec(e),n),n}]},tweener:function(t,e){g(t)?(e=t,t=["*"]):t=t.match(D);for(var n,r=0,i=t.length;r<i;r++)n=t[r],he.tweeners[n]=he.tweeners[n]||[],he.tweeners[n].unshift(e)},prefilters:[function(t,e,n){var r,i,o,a,s,u,l,c,f="width"in e||"height"in e,h=this,p={},d=t.style,g=t.nodeType&&st(t),v=G.get(t,"fxshow");for(r in n.queue||(null==(a=x._queueHooks(t,"fx")).unqueued&&(a.unqueued=0,s=a.empty.fire,a.empty.fire=function(){a.unqueued||s()}),a.unqueued++,h.always((function(){h.always((function(){a.unqueued--,x.queue(t,"fx").length||a.empty.fire()}))}))),e)if(i=e[r],ae.test(i)){if(delete e[r],o=o||"toggle"===i,i===(g?"hide":"show")){if("show"!==i||!v||void 0===v[r])continue;g=!0}p[r]=v&&v[r]||x.style(t,r)}if((u=!x.isEmptyObject(e))||!x.isEmptyObject(p))for(r in f&&1===t.nodeType&&(n.overflow=[d.overflow,d.overflowX,d.overflowY],null==(l=v&&v.display)&&(l=G.get(t,"display")),"none"===(c=x.css(t,"display"))&&(l?c=l:(ft([t],!0),l=t.style.display||l,c=x.css(t,"display"),ft([t]))),("inline"===c||"inline-block"===c&&null!=l)&&"none"===x.css(t,"float")&&(u||(h.done((function(){d.display=l})),null==l&&(c=d.display,l="none"===c?"":c)),d.display="inline-block")),n.overflow&&(d.overflow="hidden",h.always((function(){d.overflow=n.overflow[0],d.overflowX=n.overflow[1],d.overflowY=n.overflow[2]}))),u=!1,p)u||(v?"hidden"in v&&(g=v.hidden):v=G.access(t,"fxshow",{display:l}),o&&(v.hidden=!g),g&&ft([t],!0),h.done((function(){for(r in g||ft([t]),G.remove(t,"fxshow"),p)x.style(t,r,p[r])}))),u=fe(g?v[r]:0,r,h),r in v||(v[r]=u.start,g&&(u.end=u.start,u.start=0))}],prefilter:function(t,e){e?he.prefilters.unshift(t):he.prefilters.push(t)}}),x.speed=function(t,e,n){var r=t&&"object"==typeof t?x.extend({},t):{complete:n||!n&&e||g(t)&&t,duration:t,easing:n&&e||e&&!g(e)&&e};return x.fx.off?r.duration=0:"number"!=typeof r.duration&&(r.duration in x.fx.speeds?r.duration=x.fx.speeds[r.duration]:r.duration=x.fx.speeds._default),null!=r.queue&&!0!==r.queue||(r.queue="fx"),r.old=r.complete,r.complete=function(){g(r.old)&&r.old.call(this),r.queue&&x.dequeue(this,r.queue)},r},x.fn.extend({fadeTo:function(t,e,n,r){return this.filter(st).css("opacity",0).show().end().animate({opacity:e},t,n,r)},animate:function(t,e,n,r){var i=x.isEmptyObject(t),o=x.speed(e,n,r),a=function(){var e=he(this,x.extend({},t),o);(i||G.get(this,"finish"))&&e.stop(!0)};return a.finish=a,i||!1===o.queue?this.each(a):this.queue(o.queue,a)},stop:function(t,e,n){var r=function(t){var e=t.stop;delete t.stop,e(n)};return"string"!=typeof t&&(n=e,e=t,t=void 0),e&&this.queue(t||"fx",[]),this.each((function(){var e=!0,i=null!=t&&t+"queueHooks",o=x.timers,a=G.get(this);if(i)a[i]&&a[i].stop&&r(a[i]);else for(i in a)a[i]&&a[i].stop&&se.test(i)&&r(a[i]);for(i=o.length;i--;)o[i].elem!==this||null!=t&&o[i].queue!==t||(o[i].anim.stop(n),e=!1,o.splice(i,1));!e&&n||x.dequeue(this,t)}))},finish:function(t){return!1!==t&&(t=t||"fx"),this.each((function(){var e,n=G.get(this),r=n[t+"queue"],i=n[t+"queueHooks"],o=x.timers,a=r?r.length:0;for(n.finish=!0,x.queue(this,t,[]),i&&i.stop&&i.stop.call(this,!0),e=o.length;e--;)o[e].elem===this&&o[e].queue===t&&(o[e].anim.stop(!0),o.splice(e,1));for(e=0;e<a;e++)r[e]&&r[e].finish&&r[e].finish.call(this);delete n.finish}))}}),x.each(["toggle","show","hide"],(function(t,e){var n=x.fn[e];x.fn[e]=function(t,r,i){return null==t||"boolean"==typeof t?n.apply(this,arguments):this.animate(ce(e,!0),t,r,i)}})),x.each({slideDown:ce("show"),slideUp:ce("hide"),slideToggle:ce("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},(function(t,e){x.fn[t]=function(t,n,r){return this.animate(e,t,n,r)}})),x.timers=[],x.fx.tick=function(){var t,e=0,n=x.timers;for(ie=Date.now();e<n.length;e++)(t=n[e])()||n[e]!==t||n.splice(e--,1);n.length||x.fx.stop(),ie=void 0},x.fx.timer=function(t){x.timers.push(t),x.fx.start()},x.fx.interval=13,x.fx.start=function(){oe||(oe=!0,ue())},x.fx.stop=function(){oe=null},x.fx.speeds={slow:600,fast:200,_default:400},x.fn.delay=function(e,n){return e=x.fx&&x.fx.speeds[e]||e,n=n||"fx",this.queue(n,(function(n,r){var i=t.setTimeout(n,e);r.stop=function(){t.clearTimeout(i)}}))},function(){var t=y.createElement("input"),e=y.createElement("select").appendChild(y.createElement("option"));t.type="checkbox",d.checkOn=""!==t.value,d.optSelected=e.selected,(t=y.createElement("input")).value="t",t.type="radio",d.radioValue="t"===t.value}();var pe,de=x.expr.attrHandle;x.fn.extend({attr:function(t,e){return $(this,x.attr,t,e,arguments.length>1)},removeAttr:function(t){return this.each((function(){x.removeAttr(this,t)}))}}),x.extend({attr:function(t,e,n){var r,i,o=t.nodeType;if(3!==o&&8!==o&&2!==o)return void 0===t.getAttribute?x.prop(t,e,n):(1===o&&x.isXMLDoc(t)||(i=x.attrHooks[e.toLowerCase()]||(x.expr.match.bool.test(e)?pe:void 0)),void 0!==n?null===n?void x.removeAttr(t,e):i&&"set"in i&&void 0!==(r=i.set(t,n,e))?r:(t.setAttribute(e,n+""),n):i&&"get"in i&&null!==(r=i.get(t,e))?r:null==(r=x.find.attr(t,e))?void 0:r)},attrHooks:{type:{set:function(t,e){if(!d.radioValue&&"radio"===e&&M(t,"input")){var n=t.value;return t.setAttribute("type",e),n&&(t.value=n),e}}}},removeAttr:function(t,e){var n,r=0,i=e&&e.match(D);if(i&&1===t.nodeType)for(;n=i[r++];)t.removeAttribute(n)}}),pe={set:function(t,e,n){return!1===e?x.removeAttr(t,n):t.setAttribute(n,n),n}},x.each(x.expr.match.bool.source.match(/\w+/g),(function(t,e){var n=de[e]||x.find.attr;de[e]=function(t,e,r){var i,o,a=e.toLowerCase();return r||(o=de[a],de[a]=i,i=null!=n(t,e,r)?a:null,de[a]=o),i}}));var ge=/^(?:input|select|textarea|button)$/i,ve=/^(?:a|area)$/i;function ye(t){return(t.match(D)||[]).join(" ")}function me(t){return t.getAttribute&&t.getAttribute("class")||""}function be(t){return Array.isArray(t)?t:"string"==typeof t&&t.match(D)||[]}x.fn.extend({prop:function(t,e){return $(this,x.prop,t,e,arguments.length>1)},removeProp:function(t){return this.each((function(){delete this[x.propFix[t]||t]}))}}),x.extend({prop:function(t,e,n){var r,i,o=t.nodeType;if(3!==o&&8!==o&&2!==o)return 1===o&&x.isXMLDoc(t)||(e=x.propFix[e]||e,i=x.propHooks[e]),void 0!==n?i&&"set"in i&&void 0!==(r=i.set(t,n,e))?r:t[e]=n:i&&"get"in i&&null!==(r=i.get(t,e))?r:t[e]},propHooks:{tabIndex:{get:function(t){var e=x.find.attr(t,"tabindex");return e?parseInt(e,10):ge.test(t.nodeName)||ve.test(t.nodeName)&&t.href?0:-1}}},propFix:{for:"htmlFor",class:"className"}}),d.optSelected||(x.propHooks.selected={get:function(t){var e=t.parentNode;return e&&e.parentNode&&e.parentNode.selectedIndex,null},set:function(t){var e=t.parentNode;e&&(e.selectedIndex,e.parentNode&&e.parentNode.selectedIndex)}}),x.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],(function(){x.propFix[this.toLowerCase()]=this})),x.fn.extend({addClass:function(t){var e,n,r,i,o,a,s,u=0;if(g(t))return this.each((function(e){x(this).addClass(t.call(this,e,me(this)))}));if((e=be(t)).length)for(;n=this[u++];)if(i=me(n),r=1===n.nodeType&&" "+ye(i)+" "){for(a=0;o=e[a++];)r.indexOf(" "+o+" ")<0&&(r+=o+" ");i!==(s=ye(r))&&n.setAttribute("class",s)}return this},removeClass:function(t){var e,n,r,i,o,a,s,u=0;if(g(t))return this.each((function(e){x(this).removeClass(t.call(this,e,me(this)))}));if(!arguments.length)return this.attr("class","");if((e=be(t)).length)for(;n=this[u++];)if(i=me(n),r=1===n.nodeType&&" "+ye(i)+" "){for(a=0;o=e[a++];)for(;r.indexOf(" "+o+" ")>-1;)r=r.replace(" "+o+" "," ");i!==(s=ye(r))&&n.setAttribute("class",s)}return this},toggleClass:function(t,e){var n=typeof t,r="string"===n||Array.isArray(t);return"boolean"==typeof e&&r?e?this.addClass(t):this.removeClass(t):g(t)?this.each((function(n){x(this).toggleClass(t.call(this,n,me(this),e),e)})):this.each((function(){var e,i,o,a;if(r)for(i=0,o=x(this),a=be(t);e=a[i++];)o.hasClass(e)?o.removeClass(e):o.addClass(e);else void 0!==t&&"boolean"!==n||((e=me(this))&&G.set(this,"__className__",e),this.setAttribute&&this.setAttribute("class",e||!1===t?"":G.get(this,"__className__")||""))}))},hasClass:function(t){var e,n,r=0;for(e=" "+t+" ";n=this[r++];)if(1===n.nodeType&&(" "+ye(me(n))+" ").indexOf(e)>-1)return!0;return!1}});var we=/\r/g;x.fn.extend({val:function(t){var e,n,r,i=this[0];return arguments.length?(r=g(t),this.each((function(n){var i;1===this.nodeType&&(null==(i=r?t.call(this,n,x(this).val()):t)?i="":"number"==typeof i?i+="":Array.isArray(i)&&(i=x.map(i,(function(t){return null==t?"":t+""}))),(e=x.valHooks[this.type]||x.valHooks[this.nodeName.toLowerCase()])&&"set"in e&&void 0!==e.set(this,i,"value")||(this.value=i))}))):i?(e=x.valHooks[i.type]||x.valHooks[i.nodeName.toLowerCase()])&&"get"in e&&void 0!==(n=e.get(i,"value"))?n:"string"==typeof(n=i.value)?n.replace(we,""):null==n?"":n:void 0}}),x.extend({valHooks:{option:{get:function(t){var e=x.find.attr(t,"value");return null!=e?e:ye(x.text(t))}},select:{get:function(t){var e,n,r,i=t.options,o=t.selectedIndex,a="select-one"===t.type,s=a?null:[],u=a?o+1:i.length;for(r=o<0?u:a?o:0;r<u;r++)if(((n=i[r]).selected||r===o)&&!n.disabled&&(!n.parentNode.disabled||!M(n.parentNode,"optgroup"))){if(e=x(n).val(),a)return e;s.push(e)}return s},set:function(t,e){for(var n,r,i=t.options,o=x.makeArray(e),a=i.length;a--;)((r=i[a]).selected=x.inArray(x.valHooks.option.get(r),o)>-1)&&(n=!0);return n||(t.selectedIndex=-1),o}}}}),x.each(["radio","checkbox"],(function(){x.valHooks[this]={set:function(t,e){if(Array.isArray(e))return t.checked=x.inArray(x(t).val(),e)>-1}},d.checkOn||(x.valHooks[this].get=function(t){return null===t.getAttribute("value")?"on":t.value})})),d.focusin="onfocusin"in t;var _e=/^(?:focusinfocus|focusoutblur)$/,xe=function(t){t.stopPropagation()};x.extend(x.event,{trigger:function(e,n,r,i){var o,a,s,u,l,c,h,p,d=[r||y],m=f.call(e,"type")?e.type:e,b=f.call(e,"namespace")?e.namespace.split("."):[];if(a=p=s=r=r||y,3!==r.nodeType&&8!==r.nodeType&&!_e.test(m+x.event.triggered)&&(m.indexOf(".")>-1&&(b=m.split("."),m=b.shift(),b.sort()),l=m.indexOf(":")<0&&"on"+m,(e=e[x.expando]?e:new x.Event(m,"object"==typeof e&&e)).isTrigger=i?2:3,e.namespace=b.join("."),e.rnamespace=e.namespace?new RegExp("(^|\\.)"+b.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,e.result=void 0,e.target||(e.target=r),n=null==n?[e]:x.makeArray(n,[e]),h=x.event.special[m]||{},i||!h.trigger||!1!==h.trigger.apply(r,n))){if(!i&&!h.noBubble&&!v(r)){for(u=h.delegateType||m,_e.test(u+m)||(a=a.parentNode);a;a=a.parentNode)d.push(a),s=a;s===(r.ownerDocument||y)&&d.push(s.defaultView||s.parentWindow||t)}for(o=0;(a=d[o++])&&!e.isPropagationStopped();)p=a,e.type=o>1?u:h.bindType||m,(c=(G.get(a,"events")||Object.create(null))[e.type]&&G.get(a,"handle"))&&c.apply(a,n),(c=l&&a[l])&&c.apply&&Y(a)&&(e.result=c.apply(a,n),!1===e.result&&e.preventDefault());return e.type=m,i||e.isDefaultPrevented()||h._default&&!1!==h._default.apply(d.pop(),n)||!Y(r)||l&&g(r[m])&&!v(r)&&((s=r[l])&&(r[l]=null),x.event.triggered=m,e.isPropagationStopped()&&p.addEventListener(m,xe),r[m](),e.isPropagationStopped()&&p.removeEventListener(m,xe),x.event.triggered=void 0,s&&(r[l]=s)),e.result}},simulate:function(t,e,n){var r=x.extend(new x.Event,n,{type:t,isSimulated:!0});x.event.trigger(r,null,e)}}),x.fn.extend({trigger:function(t,e){return this.each((function(){x.event.trigger(t,e,this)}))},triggerHandler:function(t,e){var n=this[0];if(n)return x.event.trigger(t,e,n,!0)}}),d.focusin||x.each({focus:"focusin",blur:"focusout"},(function(t,e){var n=function(t){x.event.simulate(e,t.target,x.event.fix(t))};x.event.special[e]={setup:function(){var r=this.ownerDocument||this.document||this,i=G.access(r,e);i||r.addEventListener(t,n,!0),G.access(r,e,(i||0)+1)},teardown:function(){var r=this.ownerDocument||this.document||this,i=G.access(r,e)-1;i?G.access(r,e,i):(r.removeEventListener(t,n,!0),G.remove(r,e))}}}));var ke=t.location,Se={guid:Date.now()},Ce=/\?/;x.parseXML=function(e){var n;if(!e||"string"!=typeof e)return null;try{n=(new t.DOMParser).parseFromString(e,"text/xml")}catch(t){n=void 0}return n&&!n.getElementsByTagName("parsererror").length||x.error("Invalid XML: "+e),n};var Te=/\[\]$/,Ae=/\r?\n/g,Me=/^(?:submit|button|image|reset|file)$/i,Ee=/^(?:input|select|textarea|keygen)/i;function Ne(t,e,n,r){var i;if(Array.isArray(e))x.each(e,(function(e,i){n||Te.test(t)?r(t,i):Ne(t+"["+("object"==typeof i&&null!=i?e:"")+"]",i,n,r)}));else if(n||"object"!==w(e))r(t,e);else for(i in e)Ne(t+"["+i+"]",e[i],n,r)}x.param=function(t,e){var n,r=[],i=function(t,e){var n=g(e)?e():e;r[r.length]=encodeURIComponent(t)+"="+encodeURIComponent(null==n?"":n)};if(null==t)return"";if(Array.isArray(t)||t.jquery&&!x.isPlainObject(t))x.each(t,(function(){i(this.name,this.value)}));else for(n in t)Ne(n,t[n],e,i);return r.join("&")},x.fn.extend({serialize:function(){return x.param(this.serializeArray())},serializeArray:function(){return this.map((function(){var t=x.prop(this,"elements");return t?x.makeArray(t):this})).filter((function(){var t=this.type;return this.name&&!x(this).is(":disabled")&&Ee.test(this.nodeName)&&!Me.test(t)&&(this.checked||!dt.test(t))})).map((function(t,e){var n=x(this).val();return null==n?null:Array.isArray(n)?x.map(n,(function(t){return{name:e.name,value:t.replace(Ae,"\r\n")}})):{name:e.name,value:n.replace(Ae,"\r\n")}})).get()}});var Pe=/%20/g,Ze=/#.*$/,Ie=/([?&])_=[^&]*/,je=/^(.*?):[ \t]*([^\r\n]*)$/gm,Le=/^(?:GET|HEAD)$/,De=/^\/\//,Oe={},Re={},qe="*/".concat("*"),He=y.createElement("a");function Fe(t){return function(e,n){"string"!=typeof e&&(n=e,e="*");var r,i=0,o=e.toLowerCase().match(D)||[];if(g(n))for(;r=o[i++];)"+"===r[0]?(r=r.slice(1)||"*",(t[r]=t[r]||[]).unshift(n)):(t[r]=t[r]||[]).push(n)}}function Be(t,e,n,r){var i={},o=t===Re;function a(s){var u;return i[s]=!0,x.each(t[s]||[],(function(t,s){var l=s(e,n,r);return"string"!=typeof l||o||i[l]?o?!(u=l):void 0:(e.dataTypes.unshift(l),a(l),!1)})),u}return a(e.dataTypes[0])||!i["*"]&&a("*")}function $e(t,e){var n,r,i=x.ajaxSettings.flatOptions||{};for(n in e)void 0!==e[n]&&((i[n]?t:r||(r={}))[n]=e[n]);return r&&x.extend(!0,t,r),t}He.href=ke.href,x.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:ke.href,type:"GET",isLocal:/^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(ke.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":qe,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":x.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(t,e){return e?$e($e(t,x.ajaxSettings),e):$e(x.ajaxSettings,t)},ajaxPrefilter:Fe(Oe),ajaxTransport:Fe(Re),ajax:function(e,n){"object"==typeof e&&(n=e,e=void 0),n=n||{};var r,i,o,a,s,u,l,c,f,h,p=x.ajaxSetup({},n),d=p.context||p,g=p.context&&(d.nodeType||d.jquery)?x(d):x.event,v=x.Deferred(),m=x.Callbacks("once memory"),b=p.statusCode||{},w={},_={},k="canceled",S={readyState:0,getResponseHeader:function(t){var e;if(l){if(!a)for(a={};e=je.exec(o);)a[e[1].toLowerCase()+" "]=(a[e[1].toLowerCase()+" "]||[]).concat(e[2]);e=a[t.toLowerCase()+" "]}return null==e?null:e.join(", ")},getAllResponseHeaders:function(){return l?o:null},setRequestHeader:function(t,e){return null==l&&(t=_[t.toLowerCase()]=_[t.toLowerCase()]||t,w[t]=e),this},overrideMimeType:function(t){return null==l&&(p.mimeType=t),this},statusCode:function(t){var e;if(t)if(l)S.always(t[S.status]);else for(e in t)b[e]=[b[e],t[e]];return this},abort:function(t){var e=t||k;return r&&r.abort(e),C(0,e),this}};if(v.promise(S),p.url=((e||p.url||ke.href)+"").replace(De,ke.protocol+"//"),p.type=n.method||n.type||p.method||p.type,p.dataTypes=(p.dataType||"*").toLowerCase().match(D)||[""],null==p.crossDomain){u=y.createElement("a");try{u.href=p.url,u.href=u.href,p.crossDomain=He.protocol+"//"+He.host!=u.protocol+"//"+u.host}catch(t){p.crossDomain=!0}}if(p.data&&p.processData&&"string"!=typeof p.data&&(p.data=x.param(p.data,p.traditional)),Be(Oe,p,n,S),l)return S;for(f in(c=x.event&&p.global)&&0==x.active++&&x.event.trigger("ajaxStart"),p.type=p.type.toUpperCase(),p.hasContent=!Le.test(p.type),i=p.url.replace(Ze,""),p.hasContent?p.data&&p.processData&&0===(p.contentType||"").indexOf("application/x-www-form-urlencoded")&&(p.data=p.data.replace(Pe,"+")):(h=p.url.slice(i.length),p.data&&(p.processData||"string"==typeof p.data)&&(i+=(Ce.test(i)?"&":"?")+p.data,delete p.data),!1===p.cache&&(i=i.replace(Ie,"$1"),h=(Ce.test(i)?"&":"?")+"_="+Se.guid+++h),p.url=i+h),p.ifModified&&(x.lastModified[i]&&S.setRequestHeader("If-Modified-Since",x.lastModified[i]),x.etag[i]&&S.setRequestHeader("If-None-Match",x.etag[i])),(p.data&&p.hasContent&&!1!==p.contentType||n.contentType)&&S.setRequestHeader("Content-Type",p.contentType),S.setRequestHeader("Accept",p.dataTypes[0]&&p.accepts[p.dataTypes[0]]?p.accepts[p.dataTypes[0]]+("*"!==p.dataTypes[0]?", "+qe+"; q=0.01":""):p.accepts["*"]),p.headers)S.setRequestHeader(f,p.headers[f]);if(p.beforeSend&&(!1===p.beforeSend.call(d,S,p)||l))return S.abort();if(k="abort",m.add(p.complete),S.done(p.success),S.fail(p.error),r=Be(Re,p,n,S)){if(S.readyState=1,c&&g.trigger("ajaxSend",[S,p]),l)return S;p.async&&p.timeout>0&&(s=t.setTimeout((function(){S.abort("timeout")}),p.timeout));try{l=!1,r.send(w,C)}catch(t){if(l)throw t;C(-1,t)}}else C(-1,"No Transport");function C(e,n,a,u){var f,h,y,w,_,k=n;l||(l=!0,s&&t.clearTimeout(s),r=void 0,o=u||"",S.readyState=e>0?4:0,f=e>=200&&e<300||304===e,a&&(w=function(t,e,n){for(var r,i,o,a,s=t.contents,u=t.dataTypes;"*"===u[0];)u.shift(),void 0===r&&(r=t.mimeType||e.getResponseHeader("Content-Type"));if(r)for(i in s)if(s[i]&&s[i].test(r)){u.unshift(i);break}if(u[0]in n)o=u[0];else{for(i in n){if(!u[0]||t.converters[i+" "+u[0]]){o=i;break}a||(a=i)}o=o||a}if(o)return o!==u[0]&&u.unshift(o),n[o]}(p,S,a)),!f&&x.inArray("script",p.dataTypes)>-1&&(p.converters["text script"]=function(){}),w=function(t,e,n,r){var i,o,a,s,u,l={},c=t.dataTypes.slice();if(c[1])for(a in t.converters)l[a.toLowerCase()]=t.converters[a];for(o=c.shift();o;)if(t.responseFields[o]&&(n[t.responseFields[o]]=e),!u&&r&&t.dataFilter&&(e=t.dataFilter(e,t.dataType)),u=o,o=c.shift())if("*"===o)o=u;else if("*"!==u&&u!==o){if(!(a=l[u+" "+o]||l["* "+o]))for(i in l)if((s=i.split(" "))[1]===o&&(a=l[u+" "+s[0]]||l["* "+s[0]])){!0===a?a=l[i]:!0!==l[i]&&(o=s[0],c.unshift(s[1]));break}if(!0!==a)if(a&&t.throws)e=a(e);else try{e=a(e)}catch(t){return{state:"parsererror",error:a?t:"No conversion from "+u+" to "+o}}}return{state:"success",data:e}}(p,w,S,f),f?(p.ifModified&&((_=S.getResponseHeader("Last-Modified"))&&(x.lastModified[i]=_),(_=S.getResponseHeader("etag"))&&(x.etag[i]=_)),204===e||"HEAD"===p.type?k="nocontent":304===e?k="notmodified":(k=w.state,h=w.data,f=!(y=w.error))):(y=k,!e&&k||(k="error",e<0&&(e=0))),S.status=e,S.statusText=(n||k)+"",f?v.resolveWith(d,[h,k,S]):v.rejectWith(d,[S,k,y]),S.statusCode(b),b=void 0,c&&g.trigger(f?"ajaxSuccess":"ajaxError",[S,p,f?h:y]),m.fireWith(d,[S,k]),c&&(g.trigger("ajaxComplete",[S,p]),--x.active||x.event.trigger("ajaxStop")))}return S},getJSON:function(t,e,n){return x.get(t,e,n,"json")},getScript:function(t,e){return x.get(t,void 0,e,"script")}}),x.each(["get","post"],(function(t,e){x[e]=function(t,n,r,i){return g(n)&&(i=i||r,r=n,n=void 0),x.ajax(x.extend({url:t,type:e,dataType:i,data:n,success:r},x.isPlainObject(t)&&t))}})),x.ajaxPrefilter((function(t){var e;for(e in t.headers)"content-type"===e.toLowerCase()&&(t.contentType=t.headers[e]||"")})),x._evalUrl=function(t,e,n){return x.ajax({url:t,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,converters:{"text script":function(){}},dataFilter:function(t){x.globalEval(t,e,n)}})},x.fn.extend({wrapAll:function(t){var e;return this[0]&&(g(t)&&(t=t.call(this[0])),e=x(t,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&e.insertBefore(this[0]),e.map((function(){for(var t=this;t.firstElementChild;)t=t.firstElementChild;return t})).append(this)),this},wrapInner:function(t){return g(t)?this.each((function(e){x(this).wrapInner(t.call(this,e))})):this.each((function(){var e=x(this),n=e.contents();n.length?n.wrapAll(t):e.append(t)}))},wrap:function(t){var e=g(t);return this.each((function(n){x(this).wrapAll(e?t.call(this,n):t)}))},unwrap:function(t){return this.parent(t).not("body").each((function(){x(this).replaceWith(this.childNodes)})),this}}),x.expr.pseudos.hidden=function(t){return!x.expr.pseudos.visible(t)},x.expr.pseudos.visible=function(t){return!!(t.offsetWidth||t.offsetHeight||t.getClientRects().length)},x.ajaxSettings.xhr=function(){try{return new t.XMLHttpRequest}catch(t){}};var ze={0:200,1223:204},Ue=x.ajaxSettings.xhr();d.cors=!!Ue&&"withCredentials"in Ue,d.ajax=Ue=!!Ue,x.ajaxTransport((function(e){var n,r;if(d.cors||Ue&&!e.crossDomain)return{send:function(i,o){var a,s=e.xhr();if(s.open(e.type,e.url,e.async,e.username,e.password),e.xhrFields)for(a in e.xhrFields)s[a]=e.xhrFields[a];for(a in e.mimeType&&s.overrideMimeType&&s.overrideMimeType(e.mimeType),e.crossDomain||i["X-Requested-With"]||(i["X-Requested-With"]="XMLHttpRequest"),i)s.setRequestHeader(a,i[a]);n=function(t){return function(){n&&(n=r=s.onload=s.onerror=s.onabort=s.ontimeout=s.onreadystatechange=null,"abort"===t?s.abort():"error"===t?"number"!=typeof s.status?o(0,"error"):o(s.status,s.statusText):o(ze[s.status]||s.status,s.statusText,"text"!==(s.responseType||"text")||"string"!=typeof s.responseText?{binary:s.response}:{text:s.responseText},s.getAllResponseHeaders()))}},s.onload=n(),r=s.onerror=s.ontimeout=n("error"),void 0!==s.onabort?s.onabort=r:s.onreadystatechange=function(){4===s.readyState&&t.setTimeout((function(){n&&r()}))},n=n("abort");try{s.send(e.hasContent&&e.data||null)}catch(t){if(n)throw t}},abort:function(){n&&n()}}})),x.ajaxPrefilter((function(t){t.crossDomain&&(t.contents.script=!1)})),x.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(t){return x.globalEval(t),t}}}),x.ajaxPrefilter("script",(function(t){void 0===t.cache&&(t.cache=!1),t.crossDomain&&(t.type="GET")})),x.ajaxTransport("script",(function(t){var e,n;if(t.crossDomain||t.scriptAttrs)return{send:function(r,i){e=x("<script>").attr(t.scriptAttrs||{}).prop({charset:t.scriptCharset,src:t.url}).on("load error",n=function(t){e.remove(),n=null,t&&i("error"===t.type?404:200,t.type)}),y.head.appendChild(e[0])},abort:function(){n&&n()}}}));var We,Ve=[],Ye=/(=)\?(?=&|$)|\?\?/;x.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var t=Ve.pop()||x.expando+"_"+Se.guid++;return this[t]=!0,t}}),x.ajaxPrefilter("json jsonp",(function(e,n,r){var i,o,a,s=!1!==e.jsonp&&(Ye.test(e.url)?"url":"string"==typeof e.data&&0===(e.contentType||"").indexOf("application/x-www-form-urlencoded")&&Ye.test(e.data)&&"data");if(s||"jsonp"===e.dataTypes[0])return i=e.jsonpCallback=g(e.jsonpCallback)?e.jsonpCallback():e.jsonpCallback,s?e[s]=e[s].replace(Ye,"$1"+i):!1!==e.jsonp&&(e.url+=(Ce.test(e.url)?"&":"?")+e.jsonp+"="+i),e.converters["script json"]=function(){return a||x.error(i+" was not called"),a[0]},e.dataTypes[0]="json",o=t[i],t[i]=function(){a=arguments},r.always((function(){void 0===o?x(t).removeProp(i):t[i]=o,e[i]&&(e.jsonpCallback=n.jsonpCallback,Ve.push(i)),a&&g(o)&&o(a[0]),a=o=void 0})),"script"})),d.createHTMLDocument=((We=y.implementation.createHTMLDocument("").body).innerHTML="<form></form><form></form>",2===We.childNodes.length),x.parseHTML=function(t,e,n){return"string"!=typeof t?[]:("boolean"==typeof e&&(n=e,e=!1),e||(d.createHTMLDocument?((r=(e=y.implementation.createHTMLDocument("")).createElement("base")).href=y.location.href,e.head.appendChild(r)):e=y),o=!n&&[],(i=E.exec(t))?[e.createElement(i[1])]:(i=_t([t],e,o),o&&o.length&&x(o).remove(),x.merge([],i.childNodes)));var r,i,o},x.fn.load=function(t,e,n){var r,i,o,a=this,s=t.indexOf(" ");return s>-1&&(r=ye(t.slice(s)),t=t.slice(0,s)),g(e)?(n=e,e=void 0):e&&"object"==typeof e&&(i="POST"),a.length>0&&x.ajax({url:t,type:i||"GET",dataType:"html",data:e}).done((function(t){o=arguments,a.html(r?x("<div>").append(x.parseHTML(t)).find(r):t)})).always(n&&function(t,e){a.each((function(){n.apply(this,o||[t.responseText,e,t])}))}),this},x.expr.pseudos.animated=function(t){return x.grep(x.timers,(function(e){return t===e.elem})).length},x.offset={setOffset:function(t,e,n){var r,i,o,a,s,u,l=x.css(t,"position"),c=x(t),f={};"static"===l&&(t.style.position="relative"),s=c.offset(),o=x.css(t,"top"),u=x.css(t,"left"),("absolute"===l||"fixed"===l)&&(o+u).indexOf("auto")>-1?(a=(r=c.position()).top,i=r.left):(a=parseFloat(o)||0,i=parseFloat(u)||0),g(e)&&(e=e.call(t,n,x.extend({},s))),null!=e.top&&(f.top=e.top-s.top+a),null!=e.left&&(f.left=e.left-s.left+i),"using"in e?e.using.call(t,f):("number"==typeof f.top&&(f.top+="px"),"number"==typeof f.left&&(f.left+="px"),c.css(f))}},x.fn.extend({offset:function(t){if(arguments.length)return void 0===t?this:this.each((function(e){x.offset.setOffset(this,t,e)}));var e,n,r=this[0];return r?r.getClientRects().length?(e=r.getBoundingClientRect(),n=r.ownerDocument.defaultView,{top:e.top+n.pageYOffset,left:e.left+n.pageXOffset}):{top:0,left:0}:void 0},position:function(){if(this[0]){var t,e,n,r=this[0],i={top:0,left:0};if("fixed"===x.css(r,"position"))e=r.getBoundingClientRect();else{for(e=this.offset(),n=r.ownerDocument,t=r.offsetParent||n.documentElement;t&&(t===n.body||t===n.documentElement)&&"static"===x.css(t,"position");)t=t.parentNode;t&&t!==r&&1===t.nodeType&&((i=x(t).offset()).top+=x.css(t,"borderTopWidth",!0),i.left+=x.css(t,"borderLeftWidth",!0))}return{top:e.top-i.top-x.css(r,"marginTop",!0),left:e.left-i.left-x.css(r,"marginLeft",!0)}}},offsetParent:function(){return this.map((function(){for(var t=this.offsetParent;t&&"static"===x.css(t,"position");)t=t.offsetParent;return t||it}))}}),x.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},(function(t,e){var n="pageYOffset"===e;x.fn[t]=function(r){return $(this,(function(t,r,i){var o;if(v(t)?o=t:9===t.nodeType&&(o=t.defaultView),void 0===i)return o?o[e]:t[r];o?o.scrollTo(n?o.pageXOffset:i,n?i:o.pageYOffset):t[r]=i}),t,r,arguments.length)}})),x.each(["top","left"],(function(t,e){x.cssHooks[e]=Ut(d.pixelPosition,(function(t,n){if(n)return n=zt(t,e),Ht.test(n)?x(t).position()[e]+"px":n}))})),x.each({Height:"height",Width:"width"},(function(t,e){x.each({padding:"inner"+t,content:e,"":"outer"+t},(function(n,r){x.fn[r]=function(i,o){var a=arguments.length&&(n||"boolean"!=typeof i),s=n||(!0===i||!0===o?"margin":"border");return $(this,(function(e,n,i){var o;return v(e)?0===r.indexOf("outer")?e["inner"+t]:e.document.documentElement["client"+t]:9===e.nodeType?(o=e.documentElement,Math.max(e.body["scroll"+t],o["scroll"+t],e.body["offset"+t],o["offset"+t],o["client"+t])):void 0===i?x.css(e,n,s):x.style(e,n,i,s)}),e,a?i:void 0,a)}}))})),x.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],(function(t,e){x.fn[e]=function(t){return this.on(e,t)}})),x.fn.extend({bind:function(t,e,n){return this.on(t,null,e,n)},unbind:function(t,e){return this.off(t,null,e)},delegate:function(t,e,n,r){return this.on(e,t,n,r)},undelegate:function(t,e,n){return 1===arguments.length?this.off(t,"**"):this.off(e,t||"**",n)},hover:function(t,e){return this.mouseenter(t).mouseleave(e||t)}}),x.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),(function(t,e){x.fn[e]=function(t,n){return arguments.length>0?this.on(e,null,t,n):this.trigger(e)}}));var Xe=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;x.proxy=function(t,e){var n,r,i;if("string"==typeof e&&(n=t[e],e=t,t=n),g(t))return r=o.call(arguments,2),i=function(){return t.apply(e||this,r.concat(o.call(arguments)))},i.guid=t.guid=t.guid||x.guid++,i},x.holdReady=function(t){t?x.readyWait++:x.ready(!0)},x.isArray=Array.isArray,x.parseJSON=JSON.parse,x.nodeName=M,x.isFunction=g,x.isWindow=v,x.camelCase=V,x.type=w,x.now=Date.now,x.isNumeric=function(t){var e=x.type(t);return("number"===e||"string"===e)&&!isNaN(t-parseFloat(t))},x.trim=function(t){return null==t?"":(t+"").replace(Xe,"")},"function"==typeof i&&i.amd&&i("jquery",[],(function(){return x}));var Ge=t.jQuery,Qe=t.$;return x.noConflict=function(e){return t.$===x&&(t.$=Qe),e&&t.jQuery===x&&(t.jQuery=Ge),x},void 0===e&&(t.jQuery=t.$=x),x}))},6486:function(t,e,n){t=n.nmd(t);var r=n(6544);(function(){var i,o="Expected a function",a="__lodash_hash_undefined__",s="__lodash_placeholder__",u=32,l=128,c=1/0,f=9007199254740991,h=NaN,p=4294967295,d=[["ary",l],["bind",1],["bindKey",2],["curry",8],["curryRight",16],["flip",512],["partial",u],["partialRight",64],["rearg",256]],g="[object Arguments]",v="[object Array]",y="[object Boolean]",m="[object Date]",b="[object Error]",w="[object Function]",_="[object GeneratorFunction]",x="[object Map]",k="[object Number]",S="[object Object]",C="[object Promise]",T="[object RegExp]",A="[object Set]",M="[object String]",E="[object Symbol]",N="[object WeakMap]",P="[object ArrayBuffer]",Z="[object DataView]",I="[object Float32Array]",j="[object Float64Array]",L="[object Int8Array]",D="[object Int16Array]",O="[object Int32Array]",R="[object Uint8Array]",q="[object Uint8ClampedArray]",H="[object Uint16Array]",F="[object Uint32Array]",B=/\b__p \+= '';/g,$=/\b(__p \+=) '' \+/g,z=/(__e\(.*?\)|\b__t\)) \+\n'';/g,U=/&(?:amp|lt|gt|quot|#39);/g,W=/[&<>"']/g,V=RegExp(U.source),Y=RegExp(W.source),X=/<%-([\s\S]+?)%>/g,G=/<%([\s\S]+?)%>/g,Q=/<%=([\s\S]+?)%>/g,J=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,K=/^\w*$/,tt=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,et=/[\\^$.*+?()[\]{}|]/g,nt=RegExp(et.source),rt=/^\s+|\s+$/g,it=/^\s+/,ot=/\s+$/,at=/\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,st=/\{\n\/\* \[wrapped with (.+)\] \*/,ut=/,? & /,lt=/[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,ct=/\\(\\)?/g,ft=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,ht=/\w*$/,pt=/^[-+]0x[0-9a-f]+$/i,dt=/^0b[01]+$/i,gt=/^\[object .+?Constructor\]$/,vt=/^0o[0-7]+$/i,yt=/^(?:0|[1-9]\d*)$/,mt=/[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,bt=/($^)/,wt=/['\n\r\u2028\u2029\\]/g,_t="\\ud800-\\udfff",xt="\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff",kt="\\u2700-\\u27bf",St="a-z\\xdf-\\xf6\\xf8-\\xff",Ct="A-Z\\xc0-\\xd6\\xd8-\\xde",Tt="\\ufe0e\\ufe0f",At="\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",Mt="["+_t+"]",Et="["+At+"]",Nt="["+xt+"]",Pt="\\d+",Zt="["+kt+"]",It="["+St+"]",jt="[^"+_t+At+Pt+kt+St+Ct+"]",Lt="\\ud83c[\\udffb-\\udfff]",Dt="[^"+_t+"]",Ot="(?:\\ud83c[\\udde6-\\uddff]){2}",Rt="[\\ud800-\\udbff][\\udc00-\\udfff]",qt="["+Ct+"]",Ht="\\u200d",Ft="(?:"+It+"|"+jt+")",Bt="(?:"+qt+"|"+jt+")",$t="(?:['’](?:d|ll|m|re|s|t|ve))?",zt="(?:['’](?:D|LL|M|RE|S|T|VE))?",Ut="(?:"+Nt+"|"+Lt+")?",Wt="["+Tt+"]?",Vt=Wt+Ut+"(?:"+Ht+"(?:"+[Dt,Ot,Rt].join("|")+")"+Wt+Ut+")*",Yt="(?:"+[Zt,Ot,Rt].join("|")+")"+Vt,Xt="(?:"+[Dt+Nt+"?",Nt,Ot,Rt,Mt].join("|")+")",Gt=RegExp("['’]","g"),Qt=RegExp(Nt,"g"),Jt=RegExp(Lt+"(?="+Lt+")|"+Xt+Vt,"g"),Kt=RegExp([qt+"?"+It+"+"+$t+"(?="+[Et,qt,"$"].join("|")+")",Bt+"+"+zt+"(?="+[Et,qt+Ft,"$"].join("|")+")",qt+"?"+Ft+"+"+$t,qt+"+"+zt,"\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])","\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])",Pt,Yt].join("|"),"g"),te=RegExp("["+Ht+_t+xt+Tt+"]"),ee=/[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,ne=["Array","Buffer","DataView","Date","Error","Float32Array","Float64Array","Function","Int8Array","Int16Array","Int32Array","Map","Math","Object","Promise","RegExp","Set","String","Symbol","TypeError","Uint8Array","Uint8ClampedArray","Uint16Array","Uint32Array","WeakMap","_","clearTimeout","isFinite","parseInt","setTimeout"],re=-1,ie={};ie[I]=ie[j]=ie[L]=ie[D]=ie[O]=ie[R]=ie[q]=ie[H]=ie[F]=!0,ie[g]=ie[v]=ie[P]=ie[y]=ie[Z]=ie[m]=ie[b]=ie[w]=ie[x]=ie[k]=ie[S]=ie[T]=ie[A]=ie[M]=ie[N]=!1;var oe={};oe[g]=oe[v]=oe[P]=oe[Z]=oe[y]=oe[m]=oe[I]=oe[j]=oe[L]=oe[D]=oe[O]=oe[x]=oe[k]=oe[S]=oe[T]=oe[A]=oe[M]=oe[E]=oe[R]=oe[q]=oe[H]=oe[F]=!0,oe[b]=oe[w]=oe[N]=!1;var ae={"\\":"\\","'":"'","\n":"n","\r":"r","\u2028":"u2028","\u2029":"u2029"},se=parseFloat,ue=parseInt,le="object"==typeof n.g&&n.g&&n.g.Object===Object&&n.g,ce="object"==typeof self&&self&&self.Object===Object&&self,fe=le||ce||Function("return this")(),he=e&&!e.nodeType&&e,pe=he&&t&&!t.nodeType&&t,de=pe&&pe.exports===he,ge=de&&le.process,ve=function(){try{return pe&&pe.require&&pe.require("util").types||ge&&ge.binding&&ge.binding("util")}catch(t){}}(),ye=ve&&ve.isArrayBuffer,me=ve&&ve.isDate,be=ve&&ve.isMap,we=ve&&ve.isRegExp,_e=ve&&ve.isSet,xe=ve&&ve.isTypedArray;function ke(t,e,n){switch(n.length){case 0:return t.call(e);case 1:return t.call(e,n[0]);case 2:return t.call(e,n[0],n[1]);case 3:return t.call(e,n[0],n[1],n[2])}return t.apply(e,n)}function Se(t,e,n,r){for(var i=-1,o=null==t?0:t.length;++i<o;){var a=t[i];e(r,a,n(a),t)}return r}function Ce(t,e){for(var n=-1,r=null==t?0:t.length;++n<r&&!1!==e(t[n],n,t););return t}function Te(t,e){for(var n=null==t?0:t.length;n--&&!1!==e(t[n],n,t););return t}function Ae(t,e){for(var n=-1,r=null==t?0:t.length;++n<r;)if(!e(t[n],n,t))return!1;return!0}function Me(t,e){for(var n=-1,r=null==t?0:t.length,i=0,o=[];++n<r;){var a=t[n];e(a,n,t)&&(o[i++]=a)}return o}function Ee(t,e){return!(null==t||!t.length)&&qe(t,e,0)>-1}function Ne(t,e,n){for(var r=-1,i=null==t?0:t.length;++r<i;)if(n(e,t[r]))return!0;return!1}function Pe(t,e){for(var n=-1,r=null==t?0:t.length,i=Array(r);++n<r;)i[n]=e(t[n],n,t);return i}function Ze(t,e){for(var n=-1,r=e.length,i=t.length;++n<r;)t[i+n]=e[n];return t}function Ie(t,e,n,r){var i=-1,o=null==t?0:t.length;for(r&&o&&(n=t[++i]);++i<o;)n=e(n,t[i],i,t);return n}function je(t,e,n,r){var i=null==t?0:t.length;for(r&&i&&(n=t[--i]);i--;)n=e(n,t[i],i,t);return n}function Le(t,e){for(var n=-1,r=null==t?0:t.length;++n<r;)if(e(t[n],n,t))return!0;return!1}var De=$e("length");function Oe(t,e,n){var r;return n(t,(function(t,n,i){if(e(t,n,i))return r=n,!1})),r}function Re(t,e,n,r){for(var i=t.length,o=n+(r?1:-1);r?o--:++o<i;)if(e(t[o],o,t))return o;return-1}function qe(t,e,n){return e==e?function(t,e,n){for(var r=n-1,i=t.length;++r<i;)if(t[r]===e)return r;return-1}(t,e,n):Re(t,Fe,n)}function He(t,e,n,r){for(var i=n-1,o=t.length;++i<o;)if(r(t[i],e))return i;return-1}function Fe(t){return t!=t}function Be(t,e){var n=null==t?0:t.length;return n?We(t,e)/n:h}function $e(t){return function(e){return null==e?i:e[t]}}function ze(t){return function(e){return null==t?i:t[e]}}function Ue(t,e,n,r,i){return i(t,(function(t,i,o){n=r?(r=!1,t):e(n,t,i,o)})),n}function We(t,e){for(var n,r=-1,o=t.length;++r<o;){var a=e(t[r]);a!==i&&(n=n===i?a:n+a)}return n}function Ve(t,e){for(var n=-1,r=Array(t);++n<t;)r[n]=e(n);return r}function Ye(t){return function(e){return t(e)}}function Xe(t,e){return Pe(e,(function(e){return t[e]}))}function Ge(t,e){return t.has(e)}function Qe(t,e){for(var n=-1,r=t.length;++n<r&&qe(e,t[n],0)>-1;);return n}function Je(t,e){for(var n=t.length;n--&&qe(e,t[n],0)>-1;);return n}function Ke(t,e){for(var n=t.length,r=0;n--;)t[n]===e&&++r;return r}var tn=ze({À:"A",Á:"A",Â:"A",Ã:"A",Ä:"A",Å:"A",à:"a",á:"a",â:"a",ã:"a",ä:"a",å:"a",Ç:"C",ç:"c",Ð:"D",ð:"d",È:"E",É:"E",Ê:"E",Ë:"E",è:"e",é:"e",ê:"e",ë:"e",Ì:"I",Í:"I",Î:"I",Ï:"I",ì:"i",í:"i",î:"i",ï:"i",Ñ:"N",ñ:"n",Ò:"O",Ó:"O",Ô:"O",Õ:"O",Ö:"O",Ø:"O",ò:"o",ó:"o",ô:"o",õ:"o",ö:"o",ø:"o",Ù:"U",Ú:"U",Û:"U",Ü:"U",ù:"u",ú:"u",û:"u",ü:"u",Ý:"Y",ý:"y",ÿ:"y",Æ:"Ae",æ:"ae",Þ:"Th",þ:"th",ß:"ss",Ā:"A",Ă:"A",Ą:"A",ā:"a",ă:"a",ą:"a",Ć:"C",Ĉ:"C",Ċ:"C",Č:"C",ć:"c",ĉ:"c",ċ:"c",č:"c",Ď:"D",Đ:"D",ď:"d",đ:"d",Ē:"E",Ĕ:"E",Ė:"E",Ę:"E",Ě:"E",ē:"e",ĕ:"e",ė:"e",ę:"e",ě:"e",Ĝ:"G",Ğ:"G",Ġ:"G",Ģ:"G",ĝ:"g",ğ:"g",ġ:"g",ģ:"g",Ĥ:"H",Ħ:"H",ĥ:"h",ħ:"h",Ĩ:"I",Ī:"I",Ĭ:"I",Į:"I",İ:"I",ĩ:"i",ī:"i",ĭ:"i",į:"i",ı:"i",Ĵ:"J",ĵ:"j",Ķ:"K",ķ:"k",ĸ:"k",Ĺ:"L",Ļ:"L",Ľ:"L",Ŀ:"L",Ł:"L",ĺ:"l",ļ:"l",ľ:"l",ŀ:"l",ł:"l",Ń:"N",Ņ:"N",Ň:"N",Ŋ:"N",ń:"n",ņ:"n",ň:"n",ŋ:"n",Ō:"O",Ŏ:"O",Ő:"O",ō:"o",ŏ:"o",ő:"o",Ŕ:"R",Ŗ:"R",Ř:"R",ŕ:"r",ŗ:"r",ř:"r",Ś:"S",Ŝ:"S",Ş:"S",Š:"S",ś:"s",ŝ:"s",ş:"s",š:"s",Ţ:"T",Ť:"T",Ŧ:"T",ţ:"t",ť:"t",ŧ:"t",Ũ:"U",Ū:"U",Ŭ:"U",Ů:"U",Ű:"U",Ų:"U",ũ:"u",ū:"u",ŭ:"u",ů:"u",ű:"u",ų:"u",Ŵ:"W",ŵ:"w",Ŷ:"Y",ŷ:"y",Ÿ:"Y",Ź:"Z",Ż:"Z",Ž:"Z",ź:"z",ż:"z",ž:"z",Ĳ:"IJ",ĳ:"ij",Œ:"Oe",œ:"oe",ŉ:"'n",ſ:"s"}),en=ze({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"});function nn(t){return"\\"+ae[t]}function rn(t){return te.test(t)}function on(t){var e=-1,n=Array(t.size);return t.forEach((function(t,r){n[++e]=[r,t]})),n}function an(t,e){return function(n){return t(e(n))}}function sn(t,e){for(var n=-1,r=t.length,i=0,o=[];++n<r;){var a=t[n];a!==e&&a!==s||(t[n]=s,o[i++]=n)}return o}function un(t){var e=-1,n=Array(t.size);return t.forEach((function(t){n[++e]=t})),n}function ln(t){var e=-1,n=Array(t.size);return t.forEach((function(t){n[++e]=[t,t]})),n}function cn(t){return rn(t)?function(t){for(var e=Jt.lastIndex=0;Jt.test(t);)++e;return e}(t):De(t)}function fn(t){return rn(t)?function(t){return t.match(Jt)||[]}(t):function(t){return t.split("")}(t)}var hn=ze({"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'"}),pn=function t(e){var n,r=(e=null==e?fe:pn.defaults(fe.Object(),e,pn.pick(fe,ne))).Array,_t=e.Date,xt=e.Error,kt=e.Function,St=e.Math,Ct=e.Object,Tt=e.RegExp,At=e.String,Mt=e.TypeError,Et=r.prototype,Nt=kt.prototype,Pt=Ct.prototype,Zt=e["__core-js_shared__"],It=Nt.toString,jt=Pt.hasOwnProperty,Lt=0,Dt=(n=/[^.]+$/.exec(Zt&&Zt.keys&&Zt.keys.IE_PROTO||""))?"Symbol(src)_1."+n:"",Ot=Pt.toString,Rt=It.call(Ct),qt=fe._,Ht=Tt("^"+It.call(jt).replace(et,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),Ft=de?e.Buffer:i,Bt=e.Symbol,$t=e.Uint8Array,zt=Ft?Ft.allocUnsafe:i,Ut=an(Ct.getPrototypeOf,Ct),Wt=Ct.create,Vt=Pt.propertyIsEnumerable,Yt=Et.splice,Xt=Bt?Bt.isConcatSpreadable:i,Jt=Bt?Bt.iterator:i,te=Bt?Bt.toStringTag:i,ae=function(){try{var t=uo(Ct,"defineProperty");return t({},"",{}),t}catch(t){}}(),le=e.clearTimeout!==fe.clearTimeout&&e.clearTimeout,ce=_t&&_t.now!==fe.Date.now&&_t.now,he=e.setTimeout!==fe.setTimeout&&e.setTimeout,pe=St.ceil,ge=St.floor,ve=Ct.getOwnPropertySymbols,De=Ft?Ft.isBuffer:i,ze=e.isFinite,dn=Et.join,gn=an(Ct.keys,Ct),vn=St.max,yn=St.min,mn=_t.now,bn=e.parseInt,wn=St.random,_n=Et.reverse,xn=uo(e,"DataView"),kn=uo(e,"Map"),Sn=uo(e,"Promise"),Cn=uo(e,"Set"),Tn=uo(e,"WeakMap"),An=uo(Ct,"create"),Mn=Tn&&new Tn,En={},Nn=Ro(xn),Pn=Ro(kn),Zn=Ro(Sn),In=Ro(Cn),jn=Ro(Tn),Ln=Bt?Bt.prototype:i,Dn=Ln?Ln.valueOf:i,On=Ln?Ln.toString:i;function Rn(t){if(es(t)&&!za(t)&&!(t instanceof Bn)){if(t instanceof Fn)return t;if(jt.call(t,"__wrapped__"))return qo(t)}return new Fn(t)}var qn=function(){function t(){}return function(e){if(!ts(e))return{};if(Wt)return Wt(e);t.prototype=e;var n=new t;return t.prototype=i,n}}();function Hn(){}function Fn(t,e){this.__wrapped__=t,this.__actions__=[],this.__chain__=!!e,this.__index__=0,this.__values__=i}function Bn(t){this.__wrapped__=t,this.__actions__=[],this.__dir__=1,this.__filtered__=!1,this.__iteratees__=[],this.__takeCount__=p,this.__views__=[]}function $n(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}function zn(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}function Un(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}function Wn(t){var e=-1,n=null==t?0:t.length;for(this.__data__=new Un;++e<n;)this.add(t[e])}function Vn(t){var e=this.__data__=new zn(t);this.size=e.size}function Yn(t,e){var n=za(t),r=!n&&$a(t),i=!n&&!r&&Ya(t),o=!n&&!r&&!i&&ls(t),a=n||r||i||o,s=a?Ve(t.length,At):[],u=s.length;for(var l in t)!e&&!jt.call(t,l)||a&&("length"==l||i&&("offset"==l||"parent"==l)||o&&("buffer"==l||"byteLength"==l||"byteOffset"==l)||vo(l,u))||s.push(l);return s}function Xn(t){var e=t.length;return e?t[Ur(0,e-1)]:i}function Gn(t,e){return Io(Ti(t),or(e,0,t.length))}function Qn(t){return Io(Ti(t))}function Jn(t,e,n){(n!==i&&!Ha(t[e],n)||n===i&&!(e in t))&&rr(t,e,n)}function Kn(t,e,n){var r=t[e];jt.call(t,e)&&Ha(r,n)&&(n!==i||e in t)||rr(t,e,n)}function tr(t,e){for(var n=t.length;n--;)if(Ha(t[n][0],e))return n;return-1}function er(t,e,n,r){return cr(t,(function(t,i,o){e(r,t,n(t),o)})),r}function nr(t,e){return t&&Ai(e,Ps(e),t)}function rr(t,e,n){"__proto__"==e&&ae?ae(t,e,{configurable:!0,enumerable:!0,value:n,writable:!0}):t[e]=n}function ir(t,e){for(var n=-1,o=e.length,a=r(o),s=null==t;++n<o;)a[n]=s?i:Ts(t,e[n]);return a}function or(t,e,n){return t==t&&(n!==i&&(t=t<=n?t:n),e!==i&&(t=t>=e?t:e)),t}function ar(t,e,n,r,o,a){var s,u=1&e,l=2&e,c=4&e;if(n&&(s=o?n(t,r,o,a):n(t)),s!==i)return s;if(!ts(t))return t;var f=za(t);if(f){if(s=function(t){var e=t.length,n=new t.constructor(e);return e&&"string"==typeof t[0]&&jt.call(t,"index")&&(n.index=t.index,n.input=t.input),n}(t),!u)return Ti(t,s)}else{var h=fo(t),p=h==w||h==_;if(Ya(t))return wi(t,u);if(h==S||h==g||p&&!o){if(s=l||p?{}:po(t),!u)return l?function(t,e){return Ai(t,co(t),e)}(t,function(t,e){return t&&Ai(e,Zs(e),t)}(s,t)):function(t,e){return Ai(t,lo(t),e)}(t,nr(s,t))}else{if(!oe[h])return o?t:{};s=function(t,e,n){var r,i=t.constructor;switch(e){case P:return _i(t);case y:case m:return new i(+t);case Z:return function(t,e){var n=e?_i(t.buffer):t.buffer;return new t.constructor(n,t.byteOffset,t.byteLength)}(t,n);case I:case j:case L:case D:case O:case R:case q:case H:case F:return xi(t,n);case x:return new i;case k:case M:return new i(t);case T:return function(t){var e=new t.constructor(t.source,ht.exec(t));return e.lastIndex=t.lastIndex,e}(t);case A:return new i;case E:return r=t,Dn?Ct(Dn.call(r)):{}}}(t,h,u)}}a||(a=new Vn);var d=a.get(t);if(d)return d;a.set(t,s),as(t)?t.forEach((function(r){s.add(ar(r,e,n,r,t,a))})):ns(t)&&t.forEach((function(r,i){s.set(i,ar(r,e,n,i,t,a))}));var v=f?i:(c?l?eo:to:l?Zs:Ps)(t);return Ce(v||t,(function(r,i){v&&(r=t[i=r]),Kn(s,i,ar(r,e,n,i,t,a))})),s}function sr(t,e,n){var r=n.length;if(null==t)return!r;for(t=Ct(t);r--;){var o=n[r],a=e[o],s=t[o];if(s===i&&!(o in t)||!a(s))return!1}return!0}function ur(t,e,n){if("function"!=typeof t)throw new Mt(o);return Eo((function(){t.apply(i,n)}),e)}function lr(t,e,n,r){var i=-1,o=Ee,a=!0,s=t.length,u=[],l=e.length;if(!s)return u;n&&(e=Pe(e,Ye(n))),r?(o=Ne,a=!1):e.length>=200&&(o=Ge,a=!1,e=new Wn(e));t:for(;++i<s;){var c=t[i],f=null==n?c:n(c);if(c=r||0!==c?c:0,a&&f==f){for(var h=l;h--;)if(e[h]===f)continue t;u.push(c)}else o(e,f,r)||u.push(c)}return u}Rn.templateSettings={escape:X,evaluate:G,interpolate:Q,variable:"",imports:{_:Rn}},Rn.prototype=Hn.prototype,Rn.prototype.constructor=Rn,Fn.prototype=qn(Hn.prototype),Fn.prototype.constructor=Fn,Bn.prototype=qn(Hn.prototype),Bn.prototype.constructor=Bn,$n.prototype.clear=function(){this.__data__=An?An(null):{},this.size=0},$n.prototype.delete=function(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e},$n.prototype.get=function(t){var e=this.__data__;if(An){var n=e[t];return n===a?i:n}return jt.call(e,t)?e[t]:i},$n.prototype.has=function(t){var e=this.__data__;return An?e[t]!==i:jt.call(e,t)},$n.prototype.set=function(t,e){var n=this.__data__;return this.size+=this.has(t)?0:1,n[t]=An&&e===i?a:e,this},zn.prototype.clear=function(){this.__data__=[],this.size=0},zn.prototype.delete=function(t){var e=this.__data__,n=tr(e,t);return!(n<0||(n==e.length-1?e.pop():Yt.call(e,n,1),--this.size,0))},zn.prototype.get=function(t){var e=this.__data__,n=tr(e,t);return n<0?i:e[n][1]},zn.prototype.has=function(t){return tr(this.__data__,t)>-1},zn.prototype.set=function(t,e){var n=this.__data__,r=tr(n,t);return r<0?(++this.size,n.push([t,e])):n[r][1]=e,this},Un.prototype.clear=function(){this.size=0,this.__data__={hash:new $n,map:new(kn||zn),string:new $n}},Un.prototype.delete=function(t){var e=ao(this,t).delete(t);return this.size-=e?1:0,e},Un.prototype.get=function(t){return ao(this,t).get(t)},Un.prototype.has=function(t){return ao(this,t).has(t)},Un.prototype.set=function(t,e){var n=ao(this,t),r=n.size;return n.set(t,e),this.size+=n.size==r?0:1,this},Wn.prototype.add=Wn.prototype.push=function(t){return this.__data__.set(t,a),this},Wn.prototype.has=function(t){return this.__data__.has(t)},Vn.prototype.clear=function(){this.__data__=new zn,this.size=0},Vn.prototype.delete=function(t){var e=this.__data__,n=e.delete(t);return this.size=e.size,n},Vn.prototype.get=function(t){return this.__data__.get(t)},Vn.prototype.has=function(t){return this.__data__.has(t)},Vn.prototype.set=function(t,e){var n=this.__data__;if(n instanceof zn){var r=n.__data__;if(!kn||r.length<199)return r.push([t,e]),this.size=++n.size,this;n=this.__data__=new Un(r)}return n.set(t,e),this.size=n.size,this};var cr=Ni(mr),fr=Ni(br,!0);function hr(t,e){var n=!0;return cr(t,(function(t,r,i){return n=!!e(t,r,i)})),n}function pr(t,e,n){for(var r=-1,o=t.length;++r<o;){var a=t[r],s=e(a);if(null!=s&&(u===i?s==s&&!us(s):n(s,u)))var u=s,l=a}return l}function dr(t,e){var n=[];return cr(t,(function(t,r,i){e(t,r,i)&&n.push(t)})),n}function gr(t,e,n,r,i){var o=-1,a=t.length;for(n||(n=go),i||(i=[]);++o<a;){var s=t[o];e>0&&n(s)?e>1?gr(s,e-1,n,r,i):Ze(i,s):r||(i[i.length]=s)}return i}var vr=Pi(),yr=Pi(!0);function mr(t,e){return t&&vr(t,e,Ps)}function br(t,e){return t&&yr(t,e,Ps)}function wr(t,e){return Me(e,(function(e){return Qa(t[e])}))}function _r(t,e){for(var n=0,r=(e=vi(e,t)).length;null!=t&&n<r;)t=t[Oo(e[n++])];return n&&n==r?t:i}function xr(t,e,n){var r=e(t);return za(t)?r:Ze(r,n(t))}function kr(t){return null==t?t===i?"[object Undefined]":"[object Null]":te&&te in Ct(t)?function(t){var e=jt.call(t,te),n=t[te];try{t[te]=i;var r=!0}catch(t){}var o=Ot.call(t);return r&&(e?t[te]=n:delete t[te]),o}(t):function(t){return Ot.call(t)}(t)}function Sr(t,e){return t>e}function Cr(t,e){return null!=t&&jt.call(t,e)}function Tr(t,e){return null!=t&&e in Ct(t)}function Ar(t,e,n){for(var o=n?Ne:Ee,a=t[0].length,s=t.length,u=s,l=r(s),c=1/0,f=[];u--;){var h=t[u];u&&e&&(h=Pe(h,Ye(e))),c=yn(h.length,c),l[u]=!n&&(e||a>=120&&h.length>=120)?new Wn(u&&h):i}h=t[0];var p=-1,d=l[0];t:for(;++p<a&&f.length<c;){var g=h[p],v=e?e(g):g;if(g=n||0!==g?g:0,!(d?Ge(d,v):o(f,v,n))){for(u=s;--u;){var y=l[u];if(!(y?Ge(y,v):o(t[u],v,n)))continue t}d&&d.push(v),f.push(g)}}return f}function Mr(t,e,n){var r=null==(t=Co(t,e=vi(e,t)))?t:t[Oo(Go(e))];return null==r?i:ke(r,t,n)}function Er(t){return es(t)&&kr(t)==g}function Nr(t,e,n,r,o){return t===e||(null==t||null==e||!es(t)&&!es(e)?t!=t&&e!=e:function(t,e,n,r,o,a){var s=za(t),u=za(e),l=s?v:fo(t),c=u?v:fo(e),f=(l=l==g?S:l)==S,h=(c=c==g?S:c)==S,p=l==c;if(p&&Ya(t)){if(!Ya(e))return!1;s=!0,f=!1}if(p&&!f)return a||(a=new Vn),s||ls(t)?Ji(t,e,n,r,o,a):function(t,e,n,r,i,o,a){switch(n){case Z:if(t.byteLength!=e.byteLength||t.byteOffset!=e.byteOffset)return!1;t=t.buffer,e=e.buffer;case P:return!(t.byteLength!=e.byteLength||!o(new $t(t),new $t(e)));case y:case m:case k:return Ha(+t,+e);case b:return t.name==e.name&&t.message==e.message;case T:case M:return t==e+"";case x:var s=on;case A:var u=1&r;if(s||(s=un),t.size!=e.size&&!u)return!1;var l=a.get(t);if(l)return l==e;r|=2,a.set(t,e);var c=Ji(s(t),s(e),r,i,o,a);return a.delete(t),c;case E:if(Dn)return Dn.call(t)==Dn.call(e)}return!1}(t,e,l,n,r,o,a);if(!(1&n)){var d=f&&jt.call(t,"__wrapped__"),w=h&&jt.call(e,"__wrapped__");if(d||w){var _=d?t.value():t,C=w?e.value():e;return a||(a=new Vn),o(_,C,n,r,a)}}return!!p&&(a||(a=new Vn),function(t,e,n,r,o,a){var s=1&n,u=to(t),l=u.length;if(l!=to(e).length&&!s)return!1;for(var c=l;c--;){var f=u[c];if(!(s?f in e:jt.call(e,f)))return!1}var h=a.get(t),p=a.get(e);if(h&&p)return h==e&&p==t;var d=!0;a.set(t,e),a.set(e,t);for(var g=s;++c<l;){var v=t[f=u[c]],y=e[f];if(r)var m=s?r(y,v,f,e,t,a):r(v,y,f,t,e,a);if(!(m===i?v===y||o(v,y,n,r,a):m)){d=!1;break}g||(g="constructor"==f)}if(d&&!g){var b=t.constructor,w=e.constructor;b==w||!("constructor"in t)||!("constructor"in e)||"function"==typeof b&&b instanceof b&&"function"==typeof w&&w instanceof w||(d=!1)}return a.delete(t),a.delete(e),d}(t,e,n,r,o,a))}(t,e,n,r,Nr,o))}function Pr(t,e,n,r){var o=n.length,a=o,s=!r;if(null==t)return!a;for(t=Ct(t);o--;){var u=n[o];if(s&&u[2]?u[1]!==t[u[0]]:!(u[0]in t))return!1}for(;++o<a;){var l=(u=n[o])[0],c=t[l],f=u[1];if(s&&u[2]){if(c===i&&!(l in t))return!1}else{var h=new Vn;if(r)var p=r(c,f,l,t,e,h);if(!(p===i?Nr(f,c,3,r,h):p))return!1}}return!0}function Zr(t){return!(!ts(t)||(e=t,Dt&&Dt in e))&&(Qa(t)?Ht:gt).test(Ro(t));var e}function Ir(t){return"function"==typeof t?t:null==t?ru:"object"==typeof t?za(t)?Rr(t[0],t[1]):Or(t):hu(t)}function jr(t){if(!_o(t))return gn(t);var e=[];for(var n in Ct(t))jt.call(t,n)&&"constructor"!=n&&e.push(n);return e}function Lr(t,e){return t<e}function Dr(t,e){var n=-1,i=Wa(t)?r(t.length):[];return cr(t,(function(t,r,o){i[++n]=e(t,r,o)})),i}function Or(t){var e=so(t);return 1==e.length&&e[0][2]?ko(e[0][0],e[0][1]):function(n){return n===t||Pr(n,t,e)}}function Rr(t,e){return mo(t)&&xo(e)?ko(Oo(t),e):function(n){var r=Ts(n,t);return r===i&&r===e?As(n,t):Nr(e,r,3)}}function qr(t,e,n,r,o){t!==e&&vr(e,(function(a,s){if(o||(o=new Vn),ts(a))!function(t,e,n,r,o,a,s){var u=Ao(t,n),l=Ao(e,n),c=s.get(l);if(c)Jn(t,n,c);else{var f=a?a(u,l,n+"",t,e,s):i,h=f===i;if(h){var p=za(l),d=!p&&Ya(l),g=!p&&!d&&ls(l);f=l,p||d||g?za(u)?f=u:Va(u)?f=Ti(u):d?(h=!1,f=wi(l,!0)):g?(h=!1,f=xi(l,!0)):f=[]:is(l)||$a(l)?(f=u,$a(u)?f=ys(u):ts(u)&&!Qa(u)||(f=po(l))):h=!1}h&&(s.set(l,f),o(f,l,r,a,s),s.delete(l)),Jn(t,n,f)}}(t,e,s,n,qr,r,o);else{var u=r?r(Ao(t,s),a,s+"",t,e,o):i;u===i&&(u=a),Jn(t,s,u)}}),Zs)}function Hr(t,e){var n=t.length;if(n)return vo(e+=e<0?n:0,n)?t[e]:i}function Fr(t,e,n){e=e.length?Pe(e,(function(t){return za(t)?function(e){return _r(e,1===t.length?t[0]:t)}:t})):[ru];var r=-1;e=Pe(e,Ye(oo()));var i=Dr(t,(function(t,n,i){var o=Pe(e,(function(e){return e(t)}));return{criteria:o,index:++r,value:t}}));return function(t,e){var r=t.length;for(t.sort((function(t,e){return function(t,e,n){for(var r=-1,i=t.criteria,o=e.criteria,a=i.length,s=n.length;++r<a;){var u=ki(i[r],o[r]);if(u)return r>=s?u:u*("desc"==n[r]?-1:1)}return t.index-e.index}(t,e,n)}));r--;)t[r]=t[r].value;return t}(i)}function Br(t,e,n){for(var r=-1,i=e.length,o={};++r<i;){var a=e[r],s=_r(t,a);n(s,a)&&Gr(o,vi(a,t),s)}return o}function $r(t,e,n,r){var i=r?He:qe,o=-1,a=e.length,s=t;for(t===e&&(e=Ti(e)),n&&(s=Pe(t,Ye(n)));++o<a;)for(var u=0,l=e[o],c=n?n(l):l;(u=i(s,c,u,r))>-1;)s!==t&&Yt.call(s,u,1),Yt.call(t,u,1);return t}function zr(t,e){for(var n=t?e.length:0,r=n-1;n--;){var i=e[n];if(n==r||i!==o){var o=i;vo(i)?Yt.call(t,i,1):ui(t,i)}}return t}function Ur(t,e){return t+ge(wn()*(e-t+1))}function Wr(t,e){var n="";if(!t||e<1||e>f)return n;do{e%2&&(n+=t),(e=ge(e/2))&&(t+=t)}while(e);return n}function Vr(t,e){return No(So(t,e,ru),t+"")}function Yr(t){return Xn(Hs(t))}function Xr(t,e){var n=Hs(t);return Io(n,or(e,0,n.length))}function Gr(t,e,n,r){if(!ts(t))return t;for(var o=-1,a=(e=vi(e,t)).length,s=a-1,u=t;null!=u&&++o<a;){var l=Oo(e[o]),c=n;if("__proto__"===l||"constructor"===l||"prototype"===l)return t;if(o!=s){var f=u[l];(c=r?r(f,l,u):i)===i&&(c=ts(f)?f:vo(e[o+1])?[]:{})}Kn(u,l,c),u=u[l]}return t}var Qr=Mn?function(t,e){return Mn.set(t,e),t}:ru,Jr=ae?function(t,e){return ae(t,"toString",{configurable:!0,enumerable:!1,value:tu(e),writable:!0})}:ru;function Kr(t){return Io(Hs(t))}function ti(t,e,n){var i=-1,o=t.length;e<0&&(e=-e>o?0:o+e),(n=n>o?o:n)<0&&(n+=o),o=e>n?0:n-e>>>0,e>>>=0;for(var a=r(o);++i<o;)a[i]=t[i+e];return a}function ei(t,e){var n;return cr(t,(function(t,r,i){return!(n=e(t,r,i))})),!!n}function ni(t,e,n){var r=0,i=null==t?r:t.length;if("number"==typeof e&&e==e&&i<=2147483647){for(;r<i;){var o=r+i>>>1,a=t[o];null!==a&&!us(a)&&(n?a<=e:a<e)?r=o+1:i=o}return i}return ri(t,e,ru,n)}function ri(t,e,n,r){var o=0,a=null==t?0:t.length;if(0===a)return 0;for(var s=(e=n(e))!=e,u=null===e,l=us(e),c=e===i;o<a;){var f=ge((o+a)/2),h=n(t[f]),p=h!==i,d=null===h,g=h==h,v=us(h);if(s)var y=r||g;else y=c?g&&(r||p):u?g&&p&&(r||!d):l?g&&p&&!d&&(r||!v):!d&&!v&&(r?h<=e:h<e);y?o=f+1:a=f}return yn(a,4294967294)}function ii(t,e){for(var n=-1,r=t.length,i=0,o=[];++n<r;){var a=t[n],s=e?e(a):a;if(!n||!Ha(s,u)){var u=s;o[i++]=0===a?0:a}}return o}function oi(t){return"number"==typeof t?t:us(t)?h:+t}function ai(t){if("string"==typeof t)return t;if(za(t))return Pe(t,ai)+"";if(us(t))return On?On.call(t):"";var e=t+"";return"0"==e&&1/t==-1/0?"-0":e}function si(t,e,n){var r=-1,i=Ee,o=t.length,a=!0,s=[],u=s;if(n)a=!1,i=Ne;else if(o>=200){var l=e?null:Wi(t);if(l)return un(l);a=!1,i=Ge,u=new Wn}else u=e?[]:s;t:for(;++r<o;){var c=t[r],f=e?e(c):c;if(c=n||0!==c?c:0,a&&f==f){for(var h=u.length;h--;)if(u[h]===f)continue t;e&&u.push(f),s.push(c)}else i(u,f,n)||(u!==s&&u.push(f),s.push(c))}return s}function ui(t,e){return null==(t=Co(t,e=vi(e,t)))||delete t[Oo(Go(e))]}function li(t,e,n,r){return Gr(t,e,n(_r(t,e)),r)}function ci(t,e,n,r){for(var i=t.length,o=r?i:-1;(r?o--:++o<i)&&e(t[o],o,t););return n?ti(t,r?0:o,r?o+1:i):ti(t,r?o+1:0,r?i:o)}function fi(t,e){var n=t;return n instanceof Bn&&(n=n.value()),Ie(e,(function(t,e){return e.func.apply(e.thisArg,Ze([t],e.args))}),n)}function hi(t,e,n){var i=t.length;if(i<2)return i?si(t[0]):[];for(var o=-1,a=r(i);++o<i;)for(var s=t[o],u=-1;++u<i;)u!=o&&(a[o]=lr(a[o]||s,t[u],e,n));return si(gr(a,1),e,n)}function pi(t,e,n){for(var r=-1,o=t.length,a=e.length,s={};++r<o;){var u=r<a?e[r]:i;n(s,t[r],u)}return s}function di(t){return Va(t)?t:[]}function gi(t){return"function"==typeof t?t:ru}function vi(t,e){return za(t)?t:mo(t,e)?[t]:Do(ms(t))}var yi=Vr;function mi(t,e,n){var r=t.length;return n=n===i?r:n,!e&&n>=r?t:ti(t,e,n)}var bi=le||function(t){return fe.clearTimeout(t)};function wi(t,e){if(e)return t.slice();var n=t.length,r=zt?zt(n):new t.constructor(n);return t.copy(r),r}function _i(t){var e=new t.constructor(t.byteLength);return new $t(e).set(new $t(t)),e}function xi(t,e){var n=e?_i(t.buffer):t.buffer;return new t.constructor(n,t.byteOffset,t.length)}function ki(t,e){if(t!==e){var n=t!==i,r=null===t,o=t==t,a=us(t),s=e!==i,u=null===e,l=e==e,c=us(e);if(!u&&!c&&!a&&t>e||a&&s&&l&&!u&&!c||r&&s&&l||!n&&l||!o)return 1;if(!r&&!a&&!c&&t<e||c&&n&&o&&!r&&!a||u&&n&&o||!s&&o||!l)return-1}return 0}function Si(t,e,n,i){for(var o=-1,a=t.length,s=n.length,u=-1,l=e.length,c=vn(a-s,0),f=r(l+c),h=!i;++u<l;)f[u]=e[u];for(;++o<s;)(h||o<a)&&(f[n[o]]=t[o]);for(;c--;)f[u++]=t[o++];return f}function Ci(t,e,n,i){for(var o=-1,a=t.length,s=-1,u=n.length,l=-1,c=e.length,f=vn(a-u,0),h=r(f+c),p=!i;++o<f;)h[o]=t[o];for(var d=o;++l<c;)h[d+l]=e[l];for(;++s<u;)(p||o<a)&&(h[d+n[s]]=t[o++]);return h}function Ti(t,e){var n=-1,i=t.length;for(e||(e=r(i));++n<i;)e[n]=t[n];return e}function Ai(t,e,n,r){var o=!n;n||(n={});for(var a=-1,s=e.length;++a<s;){var u=e[a],l=r?r(n[u],t[u],u,n,t):i;l===i&&(l=t[u]),o?rr(n,u,l):Kn(n,u,l)}return n}function Mi(t,e){return function(n,r){var i=za(n)?Se:er,o=e?e():{};return i(n,t,oo(r,2),o)}}function Ei(t){return Vr((function(e,n){var r=-1,o=n.length,a=o>1?n[o-1]:i,s=o>2?n[2]:i;for(a=t.length>3&&"function"==typeof a?(o--,a):i,s&&yo(n[0],n[1],s)&&(a=o<3?i:a,o=1),e=Ct(e);++r<o;){var u=n[r];u&&t(e,u,r,a)}return e}))}function Ni(t,e){return function(n,r){if(null==n)return n;if(!Wa(n))return t(n,r);for(var i=n.length,o=e?i:-1,a=Ct(n);(e?o--:++o<i)&&!1!==r(a[o],o,a););return n}}function Pi(t){return function(e,n,r){for(var i=-1,o=Ct(e),a=r(e),s=a.length;s--;){var u=a[t?s:++i];if(!1===n(o[u],u,o))break}return e}}function Zi(t){return function(e){var n=rn(e=ms(e))?fn(e):i,r=n?n[0]:e.charAt(0),o=n?mi(n,1).join(""):e.slice(1);return r[t]()+o}}function Ii(t){return function(e){return Ie(Qs($s(e).replace(Gt,"")),t,"")}}function ji(t){return function(){var e=arguments;switch(e.length){case 0:return new t;case 1:return new t(e[0]);case 2:return new t(e[0],e[1]);case 3:return new t(e[0],e[1],e[2]);case 4:return new t(e[0],e[1],e[2],e[3]);case 5:return new t(e[0],e[1],e[2],e[3],e[4]);case 6:return new t(e[0],e[1],e[2],e[3],e[4],e[5]);case 7:return new t(e[0],e[1],e[2],e[3],e[4],e[5],e[6])}var n=qn(t.prototype),r=t.apply(n,e);return ts(r)?r:n}}function Li(t){return function(e,n,r){var o=Ct(e);if(!Wa(e)){var a=oo(n,3);e=Ps(e),n=function(t){return a(o[t],t,o)}}var s=t(e,n,r);return s>-1?o[a?e[s]:s]:i}}function Di(t){return Ki((function(e){var n=e.length,r=n,a=Fn.prototype.thru;for(t&&e.reverse();r--;){var s=e[r];if("function"!=typeof s)throw new Mt(o);if(a&&!u&&"wrapper"==ro(s))var u=new Fn([],!0)}for(r=u?r:n;++r<n;){var l=ro(s=e[r]),c="wrapper"==l?no(s):i;u=c&&bo(c[0])&&424==c[1]&&!c[4].length&&1==c[9]?u[ro(c[0])].apply(u,c[3]):1==s.length&&bo(s)?u[l]():u.thru(s)}return function(){var t=arguments,r=t[0];if(u&&1==t.length&&za(r))return u.plant(r).value();for(var i=0,o=n?e[i].apply(this,t):r;++i<n;)o=e[i].call(this,o);return o}}))}function Oi(t,e,n,o,a,s,u,c,f,h){var p=e&l,d=1&e,g=2&e,v=24&e,y=512&e,m=g?i:ji(t);return function i(){for(var l=arguments.length,b=r(l),w=l;w--;)b[w]=arguments[w];if(v)var _=io(i),x=Ke(b,_);if(o&&(b=Si(b,o,a,v)),s&&(b=Ci(b,s,u,v)),l-=x,v&&l<h){var k=sn(b,_);return zi(t,e,Oi,i.placeholder,n,b,k,c,f,h-l)}var S=d?n:this,C=g?S[t]:t;return l=b.length,c?b=To(b,c):y&&l>1&&b.reverse(),p&&f<l&&(b.length=f),this&&this!==fe&&this instanceof i&&(C=m||ji(C)),C.apply(S,b)}}function Ri(t,e){return function(n,r){return function(t,e,n,r){return mr(t,(function(t,i,o){e(r,n(t),i,o)})),r}(n,t,e(r),{})}}function qi(t,e){return function(n,r){var o;if(n===i&&r===i)return e;if(n!==i&&(o=n),r!==i){if(o===i)return r;"string"==typeof n||"string"==typeof r?(n=ai(n),r=ai(r)):(n=oi(n),r=oi(r)),o=t(n,r)}return o}}function Hi(t){return Ki((function(e){return e=Pe(e,Ye(oo())),Vr((function(n){var r=this;return t(e,(function(t){return ke(t,r,n)}))}))}))}function Fi(t,e){var n=(e=e===i?" ":ai(e)).length;if(n<2)return n?Wr(e,t):e;var r=Wr(e,pe(t/cn(e)));return rn(e)?mi(fn(r),0,t).join(""):r.slice(0,t)}function Bi(t){return function(e,n,o){return o&&"number"!=typeof o&&yo(e,n,o)&&(n=o=i),e=ps(e),n===i?(n=e,e=0):n=ps(n),function(t,e,n,i){for(var o=-1,a=vn(pe((e-t)/(n||1)),0),s=r(a);a--;)s[i?a:++o]=t,t+=n;return s}(e,n,o=o===i?e<n?1:-1:ps(o),t)}}function $i(t){return function(e,n){return"string"==typeof e&&"string"==typeof n||(e=vs(e),n=vs(n)),t(e,n)}}function zi(t,e,n,r,o,a,s,l,c,f){var h=8&e;e|=h?u:64,4&(e&=~(h?64:u))||(e&=-4);var p=[t,e,o,h?a:i,h?s:i,h?i:a,h?i:s,l,c,f],d=n.apply(i,p);return bo(t)&&Mo(d,p),d.placeholder=r,Po(d,t,e)}function Ui(t){var e=St[t];return function(t,n){if(t=vs(t),(n=null==n?0:yn(ds(n),292))&&ze(t)){var r=(ms(t)+"e").split("e");return+((r=(ms(e(r[0]+"e"+(+r[1]+n)))+"e").split("e"))[0]+"e"+(+r[1]-n))}return e(t)}}var Wi=Cn&&1/un(new Cn([,-0]))[1]==c?function(t){return new Cn(t)}:uu;function Vi(t){return function(e){var n=fo(e);return n==x?on(e):n==A?ln(e):function(t,e){return Pe(e,(function(e){return[e,t[e]]}))}(e,t(e))}}function Yi(t,e,n,a,c,f,h,p){var d=2&e;if(!d&&"function"!=typeof t)throw new Mt(o);var g=a?a.length:0;if(g||(e&=-97,a=c=i),h=h===i?h:vn(ds(h),0),p=p===i?p:ds(p),g-=c?c.length:0,64&e){var v=a,y=c;a=c=i}var m=d?i:no(t),b=[t,e,n,a,c,v,y,f,h,p];if(m&&function(t,e){var n=t[1],r=e[1],i=n|r,o=i<131,a=r==l&&8==n||r==l&&256==n&&t[7].length<=e[8]||384==r&&e[7].length<=e[8]&&8==n;if(!o&&!a)return t;1&r&&(t[2]=e[2],i|=1&n?0:4);var u=e[3];if(u){var c=t[3];t[3]=c?Si(c,u,e[4]):u,t[4]=c?sn(t[3],s):e[4]}(u=e[5])&&(c=t[5],t[5]=c?Ci(c,u,e[6]):u,t[6]=c?sn(t[5],s):e[6]),(u=e[7])&&(t[7]=u),r&l&&(t[8]=null==t[8]?e[8]:yn(t[8],e[8])),null==t[9]&&(t[9]=e[9]),t[0]=e[0],t[1]=i}(b,m),t=b[0],e=b[1],n=b[2],a=b[3],c=b[4],!(p=b[9]=b[9]===i?d?0:t.length:vn(b[9]-g,0))&&24&e&&(e&=-25),e&&1!=e)w=8==e||16==e?function(t,e,n){var o=ji(t);return function a(){for(var s=arguments.length,u=r(s),l=s,c=io(a);l--;)u[l]=arguments[l];var f=s<3&&u[0]!==c&&u[s-1]!==c?[]:sn(u,c);return(s-=f.length)<n?zi(t,e,Oi,a.placeholder,i,u,f,i,i,n-s):ke(this&&this!==fe&&this instanceof a?o:t,this,u)}}(t,e,p):e!=u&&33!=e||c.length?Oi.apply(i,b):function(t,e,n,i){var o=1&e,a=ji(t);return function e(){for(var s=-1,u=arguments.length,l=-1,c=i.length,f=r(c+u),h=this&&this!==fe&&this instanceof e?a:t;++l<c;)f[l]=i[l];for(;u--;)f[l++]=arguments[++s];return ke(h,o?n:this,f)}}(t,e,n,a);else var w=function(t,e,n){var r=1&e,i=ji(t);return function e(){return(this&&this!==fe&&this instanceof e?i:t).apply(r?n:this,arguments)}}(t,e,n);return Po((m?Qr:Mo)(w,b),t,e)}function Xi(t,e,n,r){return t===i||Ha(t,Pt[n])&&!jt.call(r,n)?e:t}function Gi(t,e,n,r,o,a){return ts(t)&&ts(e)&&(a.set(e,t),qr(t,e,i,Gi,a),a.delete(e)),t}function Qi(t){return is(t)?i:t}function Ji(t,e,n,r,o,a){var s=1&n,u=t.length,l=e.length;if(u!=l&&!(s&&l>u))return!1;var c=a.get(t),f=a.get(e);if(c&&f)return c==e&&f==t;var h=-1,p=!0,d=2&n?new Wn:i;for(a.set(t,e),a.set(e,t);++h<u;){var g=t[h],v=e[h];if(r)var y=s?r(v,g,h,e,t,a):r(g,v,h,t,e,a);if(y!==i){if(y)continue;p=!1;break}if(d){if(!Le(e,(function(t,e){if(!Ge(d,e)&&(g===t||o(g,t,n,r,a)))return d.push(e)}))){p=!1;break}}else if(g!==v&&!o(g,v,n,r,a)){p=!1;break}}return a.delete(t),a.delete(e),p}function Ki(t){return No(So(t,i,Uo),t+"")}function to(t){return xr(t,Ps,lo)}function eo(t){return xr(t,Zs,co)}var no=Mn?function(t){return Mn.get(t)}:uu;function ro(t){for(var e=t.name+"",n=En[e],r=jt.call(En,e)?n.length:0;r--;){var i=n[r],o=i.func;if(null==o||o==t)return i.name}return e}function io(t){return(jt.call(Rn,"placeholder")?Rn:t).placeholder}function oo(){var t=Rn.iteratee||iu;return t=t===iu?Ir:t,arguments.length?t(arguments[0],arguments[1]):t}function ao(t,e){var n,r,i=t.__data__;return("string"==(r=typeof(n=e))||"number"==r||"symbol"==r||"boolean"==r?"__proto__"!==n:null===n)?i["string"==typeof e?"string":"hash"]:i.map}function so(t){for(var e=Ps(t),n=e.length;n--;){var r=e[n],i=t[r];e[n]=[r,i,xo(i)]}return e}function uo(t,e){var n=function(t,e){return null==t?i:t[e]}(t,e);return Zr(n)?n:i}var lo=ve?function(t){return null==t?[]:(t=Ct(t),Me(ve(t),(function(e){return Vt.call(t,e)})))}:gu,co=ve?function(t){for(var e=[];t;)Ze(e,lo(t)),t=Ut(t);return e}:gu,fo=kr;function ho(t,e,n){for(var r=-1,i=(e=vi(e,t)).length,o=!1;++r<i;){var a=Oo(e[r]);if(!(o=null!=t&&n(t,a)))break;t=t[a]}return o||++r!=i?o:!!(i=null==t?0:t.length)&&Ka(i)&&vo(a,i)&&(za(t)||$a(t))}function po(t){return"function"!=typeof t.constructor||_o(t)?{}:qn(Ut(t))}function go(t){return za(t)||$a(t)||!!(Xt&&t&&t[Xt])}function vo(t,e){var n=typeof t;return!!(e=null==e?f:e)&&("number"==n||"symbol"!=n&&yt.test(t))&&t>-1&&t%1==0&&t<e}function yo(t,e,n){if(!ts(n))return!1;var r=typeof e;return!!("number"==r?Wa(n)&&vo(e,n.length):"string"==r&&e in n)&&Ha(n[e],t)}function mo(t,e){if(za(t))return!1;var n=typeof t;return!("number"!=n&&"symbol"!=n&&"boolean"!=n&&null!=t&&!us(t))||K.test(t)||!J.test(t)||null!=e&&t in Ct(e)}function bo(t){var e=ro(t),n=Rn[e];if("function"!=typeof n||!(e in Bn.prototype))return!1;if(t===n)return!0;var r=no(n);return!!r&&t===r[0]}(xn&&fo(new xn(new ArrayBuffer(1)))!=Z||kn&&fo(new kn)!=x||Sn&&fo(Sn.resolve())!=C||Cn&&fo(new Cn)!=A||Tn&&fo(new Tn)!=N)&&(fo=function(t){var e=kr(t),n=e==S?t.constructor:i,r=n?Ro(n):"";if(r)switch(r){case Nn:return Z;case Pn:return x;case Zn:return C;case In:return A;case jn:return N}return e});var wo=Zt?Qa:vu;function _o(t){var e=t&&t.constructor;return t===("function"==typeof e&&e.prototype||Pt)}function xo(t){return t==t&&!ts(t)}function ko(t,e){return function(n){return null!=n&&n[t]===e&&(e!==i||t in Ct(n))}}function So(t,e,n){return e=vn(e===i?t.length-1:e,0),function(){for(var i=arguments,o=-1,a=vn(i.length-e,0),s=r(a);++o<a;)s[o]=i[e+o];o=-1;for(var u=r(e+1);++o<e;)u[o]=i[o];return u[e]=n(s),ke(t,this,u)}}function Co(t,e){return e.length<2?t:_r(t,ti(e,0,-1))}function To(t,e){for(var n=t.length,r=yn(e.length,n),o=Ti(t);r--;){var a=e[r];t[r]=vo(a,n)?o[a]:i}return t}function Ao(t,e){if(("constructor"!==e||"function"!=typeof t[e])&&"__proto__"!=e)return t[e]}var Mo=Zo(Qr),Eo=he||function(t,e){return fe.setTimeout(t,e)},No=Zo(Jr);function Po(t,e,n){var r=e+"";return No(t,function(t,e){var n=e.length;if(!n)return t;var r=n-1;return e[r]=(n>1?"& ":"")+e[r],e=e.join(n>2?", ":" "),t.replace(at,"{\n/* [wrapped with "+e+"] */\n")}(r,function(t,e){return Ce(d,(function(n){var r="_."+n[0];e&n[1]&&!Ee(t,r)&&t.push(r)})),t.sort()}(function(t){var e=t.match(st);return e?e[1].split(ut):[]}(r),n)))}function Zo(t){var e=0,n=0;return function(){var r=mn(),o=16-(r-n);if(n=r,o>0){if(++e>=800)return arguments[0]}else e=0;return t.apply(i,arguments)}}function Io(t,e){var n=-1,r=t.length,o=r-1;for(e=e===i?r:e;++n<e;){var a=Ur(n,o),s=t[a];t[a]=t[n],t[n]=s}return t.length=e,t}var jo,Lo,Do=(jo=ja((function(t){var e=[];return 46===t.charCodeAt(0)&&e.push(""),t.replace(tt,(function(t,n,r,i){e.push(r?i.replace(ct,"$1"):n||t)})),e}),(function(t){return 500===Lo.size&&Lo.clear(),t})),Lo=jo.cache,jo);function Oo(t){if("string"==typeof t||us(t))return t;var e=t+"";return"0"==e&&1/t==-1/0?"-0":e}function Ro(t){if(null!=t){try{return It.call(t)}catch(t){}try{return t+""}catch(t){}}return""}function qo(t){if(t instanceof Bn)return t.clone();var e=new Fn(t.__wrapped__,t.__chain__);return e.__actions__=Ti(t.__actions__),e.__index__=t.__index__,e.__values__=t.__values__,e}var Ho=Vr((function(t,e){return Va(t)?lr(t,gr(e,1,Va,!0)):[]})),Fo=Vr((function(t,e){var n=Go(e);return Va(n)&&(n=i),Va(t)?lr(t,gr(e,1,Va,!0),oo(n,2)):[]})),Bo=Vr((function(t,e){var n=Go(e);return Va(n)&&(n=i),Va(t)?lr(t,gr(e,1,Va,!0),i,n):[]}));function $o(t,e,n){var r=null==t?0:t.length;if(!r)return-1;var i=null==n?0:ds(n);return i<0&&(i=vn(r+i,0)),Re(t,oo(e,3),i)}function zo(t,e,n){var r=null==t?0:t.length;if(!r)return-1;var o=r-1;return n!==i&&(o=ds(n),o=n<0?vn(r+o,0):yn(o,r-1)),Re(t,oo(e,3),o,!0)}function Uo(t){return null!=t&&t.length?gr(t,1):[]}function Wo(t){return t&&t.length?t[0]:i}var Vo=Vr((function(t){var e=Pe(t,di);return e.length&&e[0]===t[0]?Ar(e):[]})),Yo=Vr((function(t){var e=Go(t),n=Pe(t,di);return e===Go(n)?e=i:n.pop(),n.length&&n[0]===t[0]?Ar(n,oo(e,2)):[]})),Xo=Vr((function(t){var e=Go(t),n=Pe(t,di);return(e="function"==typeof e?e:i)&&n.pop(),n.length&&n[0]===t[0]?Ar(n,i,e):[]}));function Go(t){var e=null==t?0:t.length;return e?t[e-1]:i}var Qo=Vr(Jo);function Jo(t,e){return t&&t.length&&e&&e.length?$r(t,e):t}var Ko=Ki((function(t,e){var n=null==t?0:t.length,r=ir(t,e);return zr(t,Pe(e,(function(t){return vo(t,n)?+t:t})).sort(ki)),r}));function ta(t){return null==t?t:_n.call(t)}var ea=Vr((function(t){return si(gr(t,1,Va,!0))})),na=Vr((function(t){var e=Go(t);return Va(e)&&(e=i),si(gr(t,1,Va,!0),oo(e,2))})),ra=Vr((function(t){var e=Go(t);return e="function"==typeof e?e:i,si(gr(t,1,Va,!0),i,e)}));function ia(t){if(!t||!t.length)return[];var e=0;return t=Me(t,(function(t){if(Va(t))return e=vn(t.length,e),!0})),Ve(e,(function(e){return Pe(t,$e(e))}))}function oa(t,e){if(!t||!t.length)return[];var n=ia(t);return null==e?n:Pe(n,(function(t){return ke(e,i,t)}))}var aa=Vr((function(t,e){return Va(t)?lr(t,e):[]})),sa=Vr((function(t){return hi(Me(t,Va))})),ua=Vr((function(t){var e=Go(t);return Va(e)&&(e=i),hi(Me(t,Va),oo(e,2))})),la=Vr((function(t){var e=Go(t);return e="function"==typeof e?e:i,hi(Me(t,Va),i,e)})),ca=Vr(ia),fa=Vr((function(t){var e=t.length,n=e>1?t[e-1]:i;return n="function"==typeof n?(t.pop(),n):i,oa(t,n)}));function ha(t){var e=Rn(t);return e.__chain__=!0,e}function pa(t,e){return e(t)}var da=Ki((function(t){var e=t.length,n=e?t[0]:0,r=this.__wrapped__,o=function(e){return ir(e,t)};return!(e>1||this.__actions__.length)&&r instanceof Bn&&vo(n)?((r=r.slice(n,+n+(e?1:0))).__actions__.push({func:pa,args:[o],thisArg:i}),new Fn(r,this.__chain__).thru((function(t){return e&&!t.length&&t.push(i),t}))):this.thru(o)})),ga=Mi((function(t,e,n){jt.call(t,n)?++t[n]:rr(t,n,1)})),va=Li($o),ya=Li(zo);function ma(t,e){return(za(t)?Ce:cr)(t,oo(e,3))}function ba(t,e){return(za(t)?Te:fr)(t,oo(e,3))}var wa=Mi((function(t,e,n){jt.call(t,n)?t[n].push(e):rr(t,n,[e])})),_a=Vr((function(t,e,n){var i=-1,o="function"==typeof e,a=Wa(t)?r(t.length):[];return cr(t,(function(t){a[++i]=o?ke(e,t,n):Mr(t,e,n)})),a})),xa=Mi((function(t,e,n){rr(t,n,e)}));function ka(t,e){return(za(t)?Pe:Dr)(t,oo(e,3))}var Sa=Mi((function(t,e,n){t[n?0:1].push(e)}),(function(){return[[],[]]})),Ca=Vr((function(t,e){if(null==t)return[];var n=e.length;return n>1&&yo(t,e[0],e[1])?e=[]:n>2&&yo(e[0],e[1],e[2])&&(e=[e[0]]),Fr(t,gr(e,1),[])})),Ta=ce||function(){return fe.Date.now()};function Aa(t,e,n){return e=n?i:e,e=t&&null==e?t.length:e,Yi(t,l,i,i,i,i,e)}function Ma(t,e){var n;if("function"!=typeof e)throw new Mt(o);return t=ds(t),function(){return--t>0&&(n=e.apply(this,arguments)),t<=1&&(e=i),n}}var Ea=Vr((function(t,e,n){var r=1;if(n.length){var i=sn(n,io(Ea));r|=u}return Yi(t,r,e,n,i)})),Na=Vr((function(t,e,n){var r=3;if(n.length){var i=sn(n,io(Na));r|=u}return Yi(e,r,t,n,i)}));function Pa(t,e,n){var r,a,s,u,l,c,f=0,h=!1,p=!1,d=!0;if("function"!=typeof t)throw new Mt(o);function g(e){var n=r,o=a;return r=a=i,f=e,u=t.apply(o,n)}function v(t){return f=t,l=Eo(m,e),h?g(t):u}function y(t){var n=t-c;return c===i||n>=e||n<0||p&&t-f>=s}function m(){var t=Ta();if(y(t))return b(t);l=Eo(m,function(t){var n=e-(t-c);return p?yn(n,s-(t-f)):n}(t))}function b(t){return l=i,d&&r?g(t):(r=a=i,u)}function w(){var t=Ta(),n=y(t);if(r=arguments,a=this,c=t,n){if(l===i)return v(c);if(p)return bi(l),l=Eo(m,e),g(c)}return l===i&&(l=Eo(m,e)),u}return e=vs(e)||0,ts(n)&&(h=!!n.leading,s=(p="maxWait"in n)?vn(vs(n.maxWait)||0,e):s,d="trailing"in n?!!n.trailing:d),w.cancel=function(){l!==i&&bi(l),f=0,r=c=a=l=i},w.flush=function(){return l===i?u:b(Ta())},w}var Za=Vr((function(t,e){return ur(t,1,e)})),Ia=Vr((function(t,e,n){return ur(t,vs(e)||0,n)}));function ja(t,e){if("function"!=typeof t||null!=e&&"function"!=typeof e)throw new Mt(o);var n=function(){var r=arguments,i=e?e.apply(this,r):r[0],o=n.cache;if(o.has(i))return o.get(i);var a=t.apply(this,r);return n.cache=o.set(i,a)||o,a};return n.cache=new(ja.Cache||Un),n}function La(t){if("function"!=typeof t)throw new Mt(o);return function(){var e=arguments;switch(e.length){case 0:return!t.call(this);case 1:return!t.call(this,e[0]);case 2:return!t.call(this,e[0],e[1]);case 3:return!t.call(this,e[0],e[1],e[2])}return!t.apply(this,e)}}ja.Cache=Un;var Da=yi((function(t,e){var n=(e=1==e.length&&za(e[0])?Pe(e[0],Ye(oo())):Pe(gr(e,1),Ye(oo()))).length;return Vr((function(r){for(var i=-1,o=yn(r.length,n);++i<o;)r[i]=e[i].call(this,r[i]);return ke(t,this,r)}))})),Oa=Vr((function(t,e){var n=sn(e,io(Oa));return Yi(t,u,i,e,n)})),Ra=Vr((function(t,e){var n=sn(e,io(Ra));return Yi(t,64,i,e,n)})),qa=Ki((function(t,e){return Yi(t,256,i,i,i,e)}));function Ha(t,e){return t===e||t!=t&&e!=e}var Fa=$i(Sr),Ba=$i((function(t,e){return t>=e})),$a=Er(function(){return arguments}())?Er:function(t){return es(t)&&jt.call(t,"callee")&&!Vt.call(t,"callee")},za=r.isArray,Ua=ye?Ye(ye):function(t){return es(t)&&kr(t)==P};function Wa(t){return null!=t&&Ka(t.length)&&!Qa(t)}function Va(t){return es(t)&&Wa(t)}var Ya=De||vu,Xa=me?Ye(me):function(t){return es(t)&&kr(t)==m};function Ga(t){if(!es(t))return!1;var e=kr(t);return e==b||"[object DOMException]"==e||"string"==typeof t.message&&"string"==typeof t.name&&!is(t)}function Qa(t){if(!ts(t))return!1;var e=kr(t);return e==w||e==_||"[object AsyncFunction]"==e||"[object Proxy]"==e}function Ja(t){return"number"==typeof t&&t==ds(t)}function Ka(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=f}function ts(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)}function es(t){return null!=t&&"object"==typeof t}var ns=be?Ye(be):function(t){return es(t)&&fo(t)==x};function rs(t){return"number"==typeof t||es(t)&&kr(t)==k}function is(t){if(!es(t)||kr(t)!=S)return!1;var e=Ut(t);if(null===e)return!0;var n=jt.call(e,"constructor")&&e.constructor;return"function"==typeof n&&n instanceof n&&It.call(n)==Rt}var os=we?Ye(we):function(t){return es(t)&&kr(t)==T},as=_e?Ye(_e):function(t){return es(t)&&fo(t)==A};function ss(t){return"string"==typeof t||!za(t)&&es(t)&&kr(t)==M}function us(t){return"symbol"==typeof t||es(t)&&kr(t)==E}var ls=xe?Ye(xe):function(t){return es(t)&&Ka(t.length)&&!!ie[kr(t)]},cs=$i(Lr),fs=$i((function(t,e){return t<=e}));function hs(t){if(!t)return[];if(Wa(t))return ss(t)?fn(t):Ti(t);if(Jt&&t[Jt])return function(t){for(var e,n=[];!(e=t.next()).done;)n.push(e.value);return n}(t[Jt]());var e=fo(t);return(e==x?on:e==A?un:Hs)(t)}function ps(t){return t?(t=vs(t))===c||t===-1/0?17976931348623157e292*(t<0?-1:1):t==t?t:0:0===t?t:0}function ds(t){var e=ps(t),n=e%1;return e==e?n?e-n:e:0}function gs(t){return t?or(ds(t),0,p):0}function vs(t){if("number"==typeof t)return t;if(us(t))return h;if(ts(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=ts(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=t.replace(rt,"");var n=dt.test(t);return n||vt.test(t)?ue(t.slice(2),n?2:8):pt.test(t)?h:+t}function ys(t){return Ai(t,Zs(t))}function ms(t){return null==t?"":ai(t)}var bs=Ei((function(t,e){if(_o(e)||Wa(e))Ai(e,Ps(e),t);else for(var n in e)jt.call(e,n)&&Kn(t,n,e[n])})),ws=Ei((function(t,e){Ai(e,Zs(e),t)})),_s=Ei((function(t,e,n,r){Ai(e,Zs(e),t,r)})),xs=Ei((function(t,e,n,r){Ai(e,Ps(e),t,r)})),ks=Ki(ir),Ss=Vr((function(t,e){t=Ct(t);var n=-1,r=e.length,o=r>2?e[2]:i;for(o&&yo(e[0],e[1],o)&&(r=1);++n<r;)for(var a=e[n],s=Zs(a),u=-1,l=s.length;++u<l;){var c=s[u],f=t[c];(f===i||Ha(f,Pt[c])&&!jt.call(t,c))&&(t[c]=a[c])}return t})),Cs=Vr((function(t){return t.push(i,Gi),ke(js,i,t)}));function Ts(t,e,n){var r=null==t?i:_r(t,e);return r===i?n:r}function As(t,e){return null!=t&&ho(t,e,Tr)}var Ms=Ri((function(t,e,n){null!=e&&"function"!=typeof e.toString&&(e=Ot.call(e)),t[e]=n}),tu(ru)),Es=Ri((function(t,e,n){null!=e&&"function"!=typeof e.toString&&(e=Ot.call(e)),jt.call(t,e)?t[e].push(n):t[e]=[n]}),oo),Ns=Vr(Mr);function Ps(t){return Wa(t)?Yn(t):jr(t)}function Zs(t){return Wa(t)?Yn(t,!0):function(t){if(!ts(t))return function(t){var e=[];if(null!=t)for(var n in Ct(t))e.push(n);return e}(t);var e=_o(t),n=[];for(var r in t)("constructor"!=r||!e&&jt.call(t,r))&&n.push(r);return n}(t)}var Is=Ei((function(t,e,n){qr(t,e,n)})),js=Ei((function(t,e,n,r){qr(t,e,n,r)})),Ls=Ki((function(t,e){var n={};if(null==t)return n;var r=!1;e=Pe(e,(function(e){return e=vi(e,t),r||(r=e.length>1),e})),Ai(t,eo(t),n),r&&(n=ar(n,7,Qi));for(var i=e.length;i--;)ui(n,e[i]);return n})),Ds=Ki((function(t,e){return null==t?{}:function(t,e){return Br(t,e,(function(e,n){return As(t,n)}))}(t,e)}));function Os(t,e){if(null==t)return{};var n=Pe(eo(t),(function(t){return[t]}));return e=oo(e),Br(t,n,(function(t,n){return e(t,n[0])}))}var Rs=Vi(Ps),qs=Vi(Zs);function Hs(t){return null==t?[]:Xe(t,Ps(t))}var Fs=Ii((function(t,e,n){return e=e.toLowerCase(),t+(n?Bs(e):e)}));function Bs(t){return Gs(ms(t).toLowerCase())}function $s(t){return(t=ms(t))&&t.replace(mt,tn).replace(Qt,"")}var zs=Ii((function(t,e,n){return t+(n?"-":"")+e.toLowerCase()})),Us=Ii((function(t,e,n){return t+(n?" ":"")+e.toLowerCase()})),Ws=Zi("toLowerCase"),Vs=Ii((function(t,e,n){return t+(n?"_":"")+e.toLowerCase()})),Ys=Ii((function(t,e,n){return t+(n?" ":"")+Gs(e)})),Xs=Ii((function(t,e,n){return t+(n?" ":"")+e.toUpperCase()})),Gs=Zi("toUpperCase");function Qs(t,e,n){return t=ms(t),(e=n?i:e)===i?function(t){return ee.test(t)}(t)?function(t){return t.match(Kt)||[]}(t):function(t){return t.match(lt)||[]}(t):t.match(e)||[]}var Js=Vr((function(t,e){try{return ke(t,i,e)}catch(t){return Ga(t)?t:new xt(t)}})),Ks=Ki((function(t,e){return Ce(e,(function(e){e=Oo(e),rr(t,e,Ea(t[e],t))})),t}));function tu(t){return function(){return t}}var eu=Di(),nu=Di(!0);function ru(t){return t}function iu(t){return Ir("function"==typeof t?t:ar(t,1))}var ou=Vr((function(t,e){return function(n){return Mr(n,t,e)}})),au=Vr((function(t,e){return function(n){return Mr(t,n,e)}}));function su(t,e,n){var r=Ps(e),i=wr(e,r);null!=n||ts(e)&&(i.length||!r.length)||(n=e,e=t,t=this,i=wr(e,Ps(e)));var o=!(ts(n)&&"chain"in n&&!n.chain),a=Qa(t);return Ce(i,(function(n){var r=e[n];t[n]=r,a&&(t.prototype[n]=function(){var e=this.__chain__;if(o||e){var n=t(this.__wrapped__),i=n.__actions__=Ti(this.__actions__);return i.push({func:r,args:arguments,thisArg:t}),n.__chain__=e,n}return r.apply(t,Ze([this.value()],arguments))})})),t}function uu(){}var lu=Hi(Pe),cu=Hi(Ae),fu=Hi(Le);function hu(t){return mo(t)?$e(Oo(t)):function(t){return function(e){return _r(e,t)}}(t)}var pu=Bi(),du=Bi(!0);function gu(){return[]}function vu(){return!1}var yu,mu=qi((function(t,e){return t+e}),0),bu=Ui("ceil"),wu=qi((function(t,e){return t/e}),1),_u=Ui("floor"),xu=qi((function(t,e){return t*e}),1),ku=Ui("round"),Su=qi((function(t,e){return t-e}),0);return Rn.after=function(t,e){if("function"!=typeof e)throw new Mt(o);return t=ds(t),function(){if(--t<1)return e.apply(this,arguments)}},Rn.ary=Aa,Rn.assign=bs,Rn.assignIn=ws,Rn.assignInWith=_s,Rn.assignWith=xs,Rn.at=ks,Rn.before=Ma,Rn.bind=Ea,Rn.bindAll=Ks,Rn.bindKey=Na,Rn.castArray=function(){if(!arguments.length)return[];var t=arguments[0];return za(t)?t:[t]},Rn.chain=ha,Rn.chunk=function(t,e,n){e=(n?yo(t,e,n):e===i)?1:vn(ds(e),0);var o=null==t?0:t.length;if(!o||e<1)return[];for(var a=0,s=0,u=r(pe(o/e));a<o;)u[s++]=ti(t,a,a+=e);return u},Rn.compact=function(t){for(var e=-1,n=null==t?0:t.length,r=0,i=[];++e<n;){var o=t[e];o&&(i[r++]=o)}return i},Rn.concat=function(){var t=arguments.length;if(!t)return[];for(var e=r(t-1),n=arguments[0],i=t;i--;)e[i-1]=arguments[i];return Ze(za(n)?Ti(n):[n],gr(e,1))},Rn.cond=function(t){var e=null==t?0:t.length,n=oo();return t=e?Pe(t,(function(t){if("function"!=typeof t[1])throw new Mt(o);return[n(t[0]),t[1]]})):[],Vr((function(n){for(var r=-1;++r<e;){var i=t[r];if(ke(i[0],this,n))return ke(i[1],this,n)}}))},Rn.conforms=function(t){return function(t){var e=Ps(t);return function(n){return sr(n,t,e)}}(ar(t,1))},Rn.constant=tu,Rn.countBy=ga,Rn.create=function(t,e){var n=qn(t);return null==e?n:nr(n,e)},Rn.curry=function t(e,n,r){var o=Yi(e,8,i,i,i,i,i,n=r?i:n);return o.placeholder=t.placeholder,o},Rn.curryRight=function t(e,n,r){var o=Yi(e,16,i,i,i,i,i,n=r?i:n);return o.placeholder=t.placeholder,o},Rn.debounce=Pa,Rn.defaults=Ss,Rn.defaultsDeep=Cs,Rn.defer=Za,Rn.delay=Ia,Rn.difference=Ho,Rn.differenceBy=Fo,Rn.differenceWith=Bo,Rn.drop=function(t,e,n){var r=null==t?0:t.length;return r?ti(t,(e=n||e===i?1:ds(e))<0?0:e,r):[]},Rn.dropRight=function(t,e,n){var r=null==t?0:t.length;return r?ti(t,0,(e=r-(e=n||e===i?1:ds(e)))<0?0:e):[]},Rn.dropRightWhile=function(t,e){return t&&t.length?ci(t,oo(e,3),!0,!0):[]},Rn.dropWhile=function(t,e){return t&&t.length?ci(t,oo(e,3),!0):[]},Rn.fill=function(t,e,n,r){var o=null==t?0:t.length;return o?(n&&"number"!=typeof n&&yo(t,e,n)&&(n=0,r=o),function(t,e,n,r){var o=t.length;for((n=ds(n))<0&&(n=-n>o?0:o+n),(r=r===i||r>o?o:ds(r))<0&&(r+=o),r=n>r?0:gs(r);n<r;)t[n++]=e;return t}(t,e,n,r)):[]},Rn.filter=function(t,e){return(za(t)?Me:dr)(t,oo(e,3))},Rn.flatMap=function(t,e){return gr(ka(t,e),1)},Rn.flatMapDeep=function(t,e){return gr(ka(t,e),c)},Rn.flatMapDepth=function(t,e,n){return n=n===i?1:ds(n),gr(ka(t,e),n)},Rn.flatten=Uo,Rn.flattenDeep=function(t){return null!=t&&t.length?gr(t,c):[]},Rn.flattenDepth=function(t,e){return null!=t&&t.length?gr(t,e=e===i?1:ds(e)):[]},Rn.flip=function(t){return Yi(t,512)},Rn.flow=eu,Rn.flowRight=nu,Rn.fromPairs=function(t){for(var e=-1,n=null==t?0:t.length,r={};++e<n;){var i=t[e];r[i[0]]=i[1]}return r},Rn.functions=function(t){return null==t?[]:wr(t,Ps(t))},Rn.functionsIn=function(t){return null==t?[]:wr(t,Zs(t))},Rn.groupBy=wa,Rn.initial=function(t){return null!=t&&t.length?ti(t,0,-1):[]},Rn.intersection=Vo,Rn.intersectionBy=Yo,Rn.intersectionWith=Xo,Rn.invert=Ms,Rn.invertBy=Es,Rn.invokeMap=_a,Rn.iteratee=iu,Rn.keyBy=xa,Rn.keys=Ps,Rn.keysIn=Zs,Rn.map=ka,Rn.mapKeys=function(t,e){var n={};return e=oo(e,3),mr(t,(function(t,r,i){rr(n,e(t,r,i),t)})),n},Rn.mapValues=function(t,e){var n={};return e=oo(e,3),mr(t,(function(t,r,i){rr(n,r,e(t,r,i))})),n},Rn.matches=function(t){return Or(ar(t,1))},Rn.matchesProperty=function(t,e){return Rr(t,ar(e,1))},Rn.memoize=ja,Rn.merge=Is,Rn.mergeWith=js,Rn.method=ou,Rn.methodOf=au,Rn.mixin=su,Rn.negate=La,Rn.nthArg=function(t){return t=ds(t),Vr((function(e){return Hr(e,t)}))},Rn.omit=Ls,Rn.omitBy=function(t,e){return Os(t,La(oo(e)))},Rn.once=function(t){return Ma(2,t)},Rn.orderBy=function(t,e,n,r){return null==t?[]:(za(e)||(e=null==e?[]:[e]),za(n=r?i:n)||(n=null==n?[]:[n]),Fr(t,e,n))},Rn.over=lu,Rn.overArgs=Da,Rn.overEvery=cu,Rn.overSome=fu,Rn.partial=Oa,Rn.partialRight=Ra,Rn.partition=Sa,Rn.pick=Ds,Rn.pickBy=Os,Rn.property=hu,Rn.propertyOf=function(t){return function(e){return null==t?i:_r(t,e)}},Rn.pull=Qo,Rn.pullAll=Jo,Rn.pullAllBy=function(t,e,n){return t&&t.length&&e&&e.length?$r(t,e,oo(n,2)):t},Rn.pullAllWith=function(t,e,n){return t&&t.length&&e&&e.length?$r(t,e,i,n):t},Rn.pullAt=Ko,Rn.range=pu,Rn.rangeRight=du,Rn.rearg=qa,Rn.reject=function(t,e){return(za(t)?Me:dr)(t,La(oo(e,3)))},Rn.remove=function(t,e){var n=[];if(!t||!t.length)return n;var r=-1,i=[],o=t.length;for(e=oo(e,3);++r<o;){var a=t[r];e(a,r,t)&&(n.push(a),i.push(r))}return zr(t,i),n},Rn.rest=function(t,e){if("function"!=typeof t)throw new Mt(o);return Vr(t,e=e===i?e:ds(e))},Rn.reverse=ta,Rn.sampleSize=function(t,e,n){return e=(n?yo(t,e,n):e===i)?1:ds(e),(za(t)?Gn:Xr)(t,e)},Rn.set=function(t,e,n){return null==t?t:Gr(t,e,n)},Rn.setWith=function(t,e,n,r){return r="function"==typeof r?r:i,null==t?t:Gr(t,e,n,r)},Rn.shuffle=function(t){return(za(t)?Qn:Kr)(t)},Rn.slice=function(t,e,n){var r=null==t?0:t.length;return r?(n&&"number"!=typeof n&&yo(t,e,n)?(e=0,n=r):(e=null==e?0:ds(e),n=n===i?r:ds(n)),ti(t,e,n)):[]},Rn.sortBy=Ca,Rn.sortedUniq=function(t){return t&&t.length?ii(t):[]},Rn.sortedUniqBy=function(t,e){return t&&t.length?ii(t,oo(e,2)):[]},Rn.split=function(t,e,n){return n&&"number"!=typeof n&&yo(t,e,n)&&(e=n=i),(n=n===i?p:n>>>0)?(t=ms(t))&&("string"==typeof e||null!=e&&!os(e))&&!(e=ai(e))&&rn(t)?mi(fn(t),0,n):t.split(e,n):[]},Rn.spread=function(t,e){if("function"!=typeof t)throw new Mt(o);return e=null==e?0:vn(ds(e),0),Vr((function(n){var r=n[e],i=mi(n,0,e);return r&&Ze(i,r),ke(t,this,i)}))},Rn.tail=function(t){var e=null==t?0:t.length;return e?ti(t,1,e):[]},Rn.take=function(t,e,n){return t&&t.length?ti(t,0,(e=n||e===i?1:ds(e))<0?0:e):[]},Rn.takeRight=function(t,e,n){var r=null==t?0:t.length;return r?ti(t,(e=r-(e=n||e===i?1:ds(e)))<0?0:e,r):[]},Rn.takeRightWhile=function(t,e){return t&&t.length?ci(t,oo(e,3),!1,!0):[]},Rn.takeWhile=function(t,e){return t&&t.length?ci(t,oo(e,3)):[]},Rn.tap=function(t,e){return e(t),t},Rn.throttle=function(t,e,n){var r=!0,i=!0;if("function"!=typeof t)throw new Mt(o);return ts(n)&&(r="leading"in n?!!n.leading:r,i="trailing"in n?!!n.trailing:i),Pa(t,e,{leading:r,maxWait:e,trailing:i})},Rn.thru=pa,Rn.toArray=hs,Rn.toPairs=Rs,Rn.toPairsIn=qs,Rn.toPath=function(t){return za(t)?Pe(t,Oo):us(t)?[t]:Ti(Do(ms(t)))},Rn.toPlainObject=ys,Rn.transform=function(t,e,n){var r=za(t),i=r||Ya(t)||ls(t);if(e=oo(e,4),null==n){var o=t&&t.constructor;n=i?r?new o:[]:ts(t)&&Qa(o)?qn(Ut(t)):{}}return(i?Ce:mr)(t,(function(t,r,i){return e(n,t,r,i)})),n},Rn.unary=function(t){return Aa(t,1)},Rn.union=ea,Rn.unionBy=na,Rn.unionWith=ra,Rn.uniq=function(t){return t&&t.length?si(t):[]},Rn.uniqBy=function(t,e){return t&&t.length?si(t,oo(e,2)):[]},Rn.uniqWith=function(t,e){return e="function"==typeof e?e:i,t&&t.length?si(t,i,e):[]},Rn.unset=function(t,e){return null==t||ui(t,e)},Rn.unzip=ia,Rn.unzipWith=oa,Rn.update=function(t,e,n){return null==t?t:li(t,e,gi(n))},Rn.updateWith=function(t,e,n,r){return r="function"==typeof r?r:i,null==t?t:li(t,e,gi(n),r)},Rn.values=Hs,Rn.valuesIn=function(t){return null==t?[]:Xe(t,Zs(t))},Rn.without=aa,Rn.words=Qs,Rn.wrap=function(t,e){return Oa(gi(e),t)},Rn.xor=sa,Rn.xorBy=ua,Rn.xorWith=la,Rn.zip=ca,Rn.zipObject=function(t,e){return pi(t||[],e||[],Kn)},Rn.zipObjectDeep=function(t,e){return pi(t||[],e||[],Gr)},Rn.zipWith=fa,Rn.entries=Rs,Rn.entriesIn=qs,Rn.extend=ws,Rn.extendWith=_s,su(Rn,Rn),Rn.add=mu,Rn.attempt=Js,Rn.camelCase=Fs,Rn.capitalize=Bs,Rn.ceil=bu,Rn.clamp=function(t,e,n){return n===i&&(n=e,e=i),n!==i&&(n=(n=vs(n))==n?n:0),e!==i&&(e=(e=vs(e))==e?e:0),or(vs(t),e,n)},Rn.clone=function(t){return ar(t,4)},Rn.cloneDeep=function(t){return ar(t,5)},Rn.cloneDeepWith=function(t,e){return ar(t,5,e="function"==typeof e?e:i)},Rn.cloneWith=function(t,e){return ar(t,4,e="function"==typeof e?e:i)},Rn.conformsTo=function(t,e){return null==e||sr(t,e,Ps(e))},Rn.deburr=$s,Rn.defaultTo=function(t,e){return null==t||t!=t?e:t},Rn.divide=wu,Rn.endsWith=function(t,e,n){t=ms(t),e=ai(e);var r=t.length,o=n=n===i?r:or(ds(n),0,r);return(n-=e.length)>=0&&t.slice(n,o)==e},Rn.eq=Ha,Rn.escape=function(t){return(t=ms(t))&&Y.test(t)?t.replace(W,en):t},Rn.escapeRegExp=function(t){return(t=ms(t))&&nt.test(t)?t.replace(et,"\\$&"):t},Rn.every=function(t,e,n){var r=za(t)?Ae:hr;return n&&yo(t,e,n)&&(e=i),r(t,oo(e,3))},Rn.find=va,Rn.findIndex=$o,Rn.findKey=function(t,e){return Oe(t,oo(e,3),mr)},Rn.findLast=ya,Rn.findLastIndex=zo,Rn.findLastKey=function(t,e){return Oe(t,oo(e,3),br)},Rn.floor=_u,Rn.forEach=ma,Rn.forEachRight=ba,Rn.forIn=function(t,e){return null==t?t:vr(t,oo(e,3),Zs)},Rn.forInRight=function(t,e){return null==t?t:yr(t,oo(e,3),Zs)},Rn.forOwn=function(t,e){return t&&mr(t,oo(e,3))},Rn.forOwnRight=function(t,e){return t&&br(t,oo(e,3))},Rn.get=Ts,Rn.gt=Fa,Rn.gte=Ba,Rn.has=function(t,e){return null!=t&&ho(t,e,Cr)},Rn.hasIn=As,Rn.head=Wo,Rn.identity=ru,Rn.includes=function(t,e,n,r){t=Wa(t)?t:Hs(t),n=n&&!r?ds(n):0;var i=t.length;return n<0&&(n=vn(i+n,0)),ss(t)?n<=i&&t.indexOf(e,n)>-1:!!i&&qe(t,e,n)>-1},Rn.indexOf=function(t,e,n){var r=null==t?0:t.length;if(!r)return-1;var i=null==n?0:ds(n);return i<0&&(i=vn(r+i,0)),qe(t,e,i)},Rn.inRange=function(t,e,n){return e=ps(e),n===i?(n=e,e=0):n=ps(n),function(t,e,n){return t>=yn(e,n)&&t<vn(e,n)}(t=vs(t),e,n)},Rn.invoke=Ns,Rn.isArguments=$a,Rn.isArray=za,Rn.isArrayBuffer=Ua,Rn.isArrayLike=Wa,Rn.isArrayLikeObject=Va,Rn.isBoolean=function(t){return!0===t||!1===t||es(t)&&kr(t)==y},Rn.isBuffer=Ya,Rn.isDate=Xa,Rn.isElement=function(t){return es(t)&&1===t.nodeType&&!is(t)},Rn.isEmpty=function(t){if(null==t)return!0;if(Wa(t)&&(za(t)||"string"==typeof t||"function"==typeof t.splice||Ya(t)||ls(t)||$a(t)))return!t.length;var e=fo(t);if(e==x||e==A)return!t.size;if(_o(t))return!jr(t).length;for(var n in t)if(jt.call(t,n))return!1;return!0},Rn.isEqual=function(t,e){return Nr(t,e)},Rn.isEqualWith=function(t,e,n){var r=(n="function"==typeof n?n:i)?n(t,e):i;return r===i?Nr(t,e,i,n):!!r},Rn.isError=Ga,Rn.isFinite=function(t){return"number"==typeof t&&ze(t)},Rn.isFunction=Qa,Rn.isInteger=Ja,Rn.isLength=Ka,Rn.isMap=ns,Rn.isMatch=function(t,e){return t===e||Pr(t,e,so(e))},Rn.isMatchWith=function(t,e,n){return n="function"==typeof n?n:i,Pr(t,e,so(e),n)},Rn.isNaN=function(t){return rs(t)&&t!=+t},Rn.isNative=function(t){if(wo(t))throw new xt("Unsupported core-js use. Try https://npms.io/search?q=ponyfill.");return Zr(t)},Rn.isNil=function(t){return null==t},Rn.isNull=function(t){return null===t},Rn.isNumber=rs,Rn.isObject=ts,Rn.isObjectLike=es,Rn.isPlainObject=is,Rn.isRegExp=os,Rn.isSafeInteger=function(t){return Ja(t)&&t>=-9007199254740991&&t<=f},Rn.isSet=as,Rn.isString=ss,Rn.isSymbol=us,Rn.isTypedArray=ls,Rn.isUndefined=function(t){return t===i},Rn.isWeakMap=function(t){return es(t)&&fo(t)==N},Rn.isWeakSet=function(t){return es(t)&&"[object WeakSet]"==kr(t)},Rn.join=function(t,e){return null==t?"":dn.call(t,e)},Rn.kebabCase=zs,Rn.last=Go,Rn.lastIndexOf=function(t,e,n){var r=null==t?0:t.length;if(!r)return-1;var o=r;return n!==i&&(o=(o=ds(n))<0?vn(r+o,0):yn(o,r-1)),e==e?function(t,e,n){for(var r=n+1;r--;)if(t[r]===e)return r;return r}(t,e,o):Re(t,Fe,o,!0)},Rn.lowerCase=Us,Rn.lowerFirst=Ws,Rn.lt=cs,Rn.lte=fs,Rn.max=function(t){return t&&t.length?pr(t,ru,Sr):i},Rn.maxBy=function(t,e){return t&&t.length?pr(t,oo(e,2),Sr):i},Rn.mean=function(t){return Be(t,ru)},Rn.meanBy=function(t,e){return Be(t,oo(e,2))},Rn.min=function(t){return t&&t.length?pr(t,ru,Lr):i},Rn.minBy=function(t,e){return t&&t.length?pr(t,oo(e,2),Lr):i},Rn.stubArray=gu,Rn.stubFalse=vu,Rn.stubObject=function(){return{}},Rn.stubString=function(){return""},Rn.stubTrue=function(){return!0},Rn.multiply=xu,Rn.nth=function(t,e){return t&&t.length?Hr(t,ds(e)):i},Rn.noConflict=function(){return fe._===this&&(fe._=qt),this},Rn.noop=uu,Rn.now=Ta,Rn.pad=function(t,e,n){t=ms(t);var r=(e=ds(e))?cn(t):0;if(!e||r>=e)return t;var i=(e-r)/2;return Fi(ge(i),n)+t+Fi(pe(i),n)},Rn.padEnd=function(t,e,n){t=ms(t);var r=(e=ds(e))?cn(t):0;return e&&r<e?t+Fi(e-r,n):t},Rn.padStart=function(t,e,n){t=ms(t);var r=(e=ds(e))?cn(t):0;return e&&r<e?Fi(e-r,n)+t:t},Rn.parseInt=function(t,e,n){return n||null==e?e=0:e&&(e=+e),bn(ms(t).replace(it,""),e||0)},Rn.random=function(t,e,n){if(n&&"boolean"!=typeof n&&yo(t,e,n)&&(e=n=i),n===i&&("boolean"==typeof e?(n=e,e=i):"boolean"==typeof t&&(n=t,t=i)),t===i&&e===i?(t=0,e=1):(t=ps(t),e===i?(e=t,t=0):e=ps(e)),t>e){var r=t;t=e,e=r}if(n||t%1||e%1){var o=wn();return yn(t+o*(e-t+se("1e-"+((o+"").length-1))),e)}return Ur(t,e)},Rn.reduce=function(t,e,n){var r=za(t)?Ie:Ue,i=arguments.length<3;return r(t,oo(e,4),n,i,cr)},Rn.reduceRight=function(t,e,n){var r=za(t)?je:Ue,i=arguments.length<3;return r(t,oo(e,4),n,i,fr)},Rn.repeat=function(t,e,n){return e=(n?yo(t,e,n):e===i)?1:ds(e),Wr(ms(t),e)},Rn.replace=function(){var t=arguments,e=ms(t[0]);return t.length<3?e:e.replace(t[1],t[2])},Rn.result=function(t,e,n){var r=-1,o=(e=vi(e,t)).length;for(o||(o=1,t=i);++r<o;){var a=null==t?i:t[Oo(e[r])];a===i&&(r=o,a=n),t=Qa(a)?a.call(t):a}return t},Rn.round=ku,Rn.runInContext=t,Rn.sample=function(t){return(za(t)?Xn:Yr)(t)},Rn.size=function(t){if(null==t)return 0;if(Wa(t))return ss(t)?cn(t):t.length;var e=fo(t);return e==x||e==A?t.size:jr(t).length},Rn.snakeCase=Vs,Rn.some=function(t,e,n){var r=za(t)?Le:ei;return n&&yo(t,e,n)&&(e=i),r(t,oo(e,3))},Rn.sortedIndex=function(t,e){return ni(t,e)},Rn.sortedIndexBy=function(t,e,n){return ri(t,e,oo(n,2))},Rn.sortedIndexOf=function(t,e){var n=null==t?0:t.length;if(n){var r=ni(t,e);if(r<n&&Ha(t[r],e))return r}return-1},Rn.sortedLastIndex=function(t,e){return ni(t,e,!0)},Rn.sortedLastIndexBy=function(t,e,n){return ri(t,e,oo(n,2),!0)},Rn.sortedLastIndexOf=function(t,e){if(null!=t&&t.length){var n=ni(t,e,!0)-1;if(Ha(t[n],e))return n}return-1},Rn.startCase=Ys,Rn.startsWith=function(t,e,n){return t=ms(t),n=null==n?0:or(ds(n),0,t.length),e=ai(e),t.slice(n,n+e.length)==e},Rn.subtract=Su,Rn.sum=function(t){return t&&t.length?We(t,ru):0},Rn.sumBy=function(t,e){return t&&t.length?We(t,oo(e,2)):0},Rn.template=function(t,e,n){var r=Rn.templateSettings;n&&yo(t,e,n)&&(e=i),t=ms(t),e=_s({},e,r,Xi);var o,a,s=_s({},e.imports,r.imports,Xi),u=Ps(s),l=Xe(s,u),c=0,f=e.interpolate||bt,h="__p += '",p=Tt((e.escape||bt).source+"|"+f.source+"|"+(f===Q?ft:bt).source+"|"+(e.evaluate||bt).source+"|$","g"),d="//# sourceURL="+(jt.call(e,"sourceURL")?(e.sourceURL+"").replace(/\s/g," "):"lodash.templateSources["+ ++re+"]")+"\n";t.replace(p,(function(e,n,r,i,s,u){return r||(r=i),h+=t.slice(c,u).replace(wt,nn),n&&(o=!0,h+="' +\n__e("+n+") +\n'"),s&&(a=!0,h+="';\n"+s+";\n__p += '"),r&&(h+="' +\n((__t = ("+r+")) == null ? '' : __t) +\n'"),c=u+e.length,e})),h+="';\n";var g=jt.call(e,"variable")&&e.variable;g||(h="with (obj) {\n"+h+"\n}\n"),h=(a?h.replace(B,""):h).replace($,"$1").replace(z,"$1;"),h="function("+(g||"obj")+") {\n"+(g?"":"obj || (obj = {});\n")+"var __t, __p = ''"+(o?", __e = _.escape":"")+(a?", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n":";\n")+h+"return __p\n}";var v=Js((function(){return kt(u,d+"return "+h).apply(i,l)}));if(v.source=h,Ga(v))throw v;return v},Rn.times=function(t,e){if((t=ds(t))<1||t>f)return[];var n=p,r=yn(t,p);e=oo(e),t-=p;for(var i=Ve(r,e);++n<t;)e(n);return i},Rn.toFinite=ps,Rn.toInteger=ds,Rn.toLength=gs,Rn.toLower=function(t){return ms(t).toLowerCase()},Rn.toNumber=vs,Rn.toSafeInteger=function(t){return t?or(ds(t),-9007199254740991,f):0===t?t:0},Rn.toString=ms,Rn.toUpper=function(t){return ms(t).toUpperCase()},Rn.trim=function(t,e,n){if((t=ms(t))&&(n||e===i))return t.replace(rt,"");if(!t||!(e=ai(e)))return t;var r=fn(t),o=fn(e);return mi(r,Qe(r,o),Je(r,o)+1).join("")},Rn.trimEnd=function(t,e,n){if((t=ms(t))&&(n||e===i))return t.replace(ot,"");if(!t||!(e=ai(e)))return t;var r=fn(t);return mi(r,0,Je(r,fn(e))+1).join("")},Rn.trimStart=function(t,e,n){if((t=ms(t))&&(n||e===i))return t.replace(it,"");if(!t||!(e=ai(e)))return t;var r=fn(t);return mi(r,Qe(r,fn(e))).join("")},Rn.truncate=function(t,e){var n=30,r="...";if(ts(e)){var o="separator"in e?e.separator:o;n="length"in e?ds(e.length):n,r="omission"in e?ai(e.omission):r}var a=(t=ms(t)).length;if(rn(t)){var s=fn(t);a=s.length}if(n>=a)return t;var u=n-cn(r);if(u<1)return r;var l=s?mi(s,0,u).join(""):t.slice(0,u);if(o===i)return l+r;if(s&&(u+=l.length-u),os(o)){if(t.slice(u).search(o)){var c,f=l;for(o.global||(o=Tt(o.source,ms(ht.exec(o))+"g")),o.lastIndex=0;c=o.exec(f);)var h=c.index;l=l.slice(0,h===i?u:h)}}else if(t.indexOf(ai(o),u)!=u){var p=l.lastIndexOf(o);p>-1&&(l=l.slice(0,p))}return l+r},Rn.unescape=function(t){return(t=ms(t))&&V.test(t)?t.replace(U,hn):t},Rn.uniqueId=function(t){var e=++Lt;return ms(t)+e},Rn.upperCase=Xs,Rn.upperFirst=Gs,Rn.each=ma,Rn.eachRight=ba,Rn.first=Wo,su(Rn,(yu={},mr(Rn,(function(t,e){jt.call(Rn.prototype,e)||(yu[e]=t)})),yu),{chain:!1}),Rn.VERSION="4.17.19",Ce(["bind","bindKey","curry","curryRight","partial","partialRight"],(function(t){Rn[t].placeholder=Rn})),Ce(["drop","take"],(function(t,e){Bn.prototype[t]=function(n){n=n===i?1:vn(ds(n),0);var r=this.__filtered__&&!e?new Bn(this):this.clone();return r.__filtered__?r.__takeCount__=yn(n,r.__takeCount__):r.__views__.push({size:yn(n,p),type:t+(r.__dir__<0?"Right":"")}),r},Bn.prototype[t+"Right"]=function(e){return this.reverse()[t](e).reverse()}})),Ce(["filter","map","takeWhile"],(function(t,e){var n=e+1,r=1==n||3==n;Bn.prototype[t]=function(t){var e=this.clone();return e.__iteratees__.push({iteratee:oo(t,3),type:n}),e.__filtered__=e.__filtered__||r,e}})),Ce(["head","last"],(function(t,e){var n="take"+(e?"Right":"");Bn.prototype[t]=function(){return this[n](1).value()[0]}})),Ce(["initial","tail"],(function(t,e){var n="drop"+(e?"":"Right");Bn.prototype[t]=function(){return this.__filtered__?new Bn(this):this[n](1)}})),Bn.prototype.compact=function(){return this.filter(ru)},Bn.prototype.find=function(t){return this.filter(t).head()},Bn.prototype.findLast=function(t){return this.reverse().find(t)},Bn.prototype.invokeMap=Vr((function(t,e){return"function"==typeof t?new Bn(this):this.map((function(n){return Mr(n,t,e)}))})),Bn.prototype.reject=function(t){return this.filter(La(oo(t)))},Bn.prototype.slice=function(t,e){t=ds(t);var n=this;return n.__filtered__&&(t>0||e<0)?new Bn(n):(t<0?n=n.takeRight(-t):t&&(n=n.drop(t)),e!==i&&(n=(e=ds(e))<0?n.dropRight(-e):n.take(e-t)),n)},Bn.prototype.takeRightWhile=function(t){return this.reverse().takeWhile(t).reverse()},Bn.prototype.toArray=function(){return this.take(p)},mr(Bn.prototype,(function(t,e){var n=/^(?:filter|find|map|reject)|While$/.test(e),r=/^(?:head|last)$/.test(e),o=Rn[r?"take"+("last"==e?"Right":""):e],a=r||/^find/.test(e);o&&(Rn.prototype[e]=function(){var e=this.__wrapped__,s=r?[1]:arguments,u=e instanceof Bn,l=s[0],c=u||za(e),f=function(t){var e=o.apply(Rn,Ze([t],s));return r&&h?e[0]:e};c&&n&&"function"==typeof l&&1!=l.length&&(u=c=!1);var h=this.__chain__,p=!!this.__actions__.length,d=a&&!h,g=u&&!p;if(!a&&c){e=g?e:new Bn(this);var v=t.apply(e,s);return v.__actions__.push({func:pa,args:[f],thisArg:i}),new Fn(v,h)}return d&&g?t.apply(this,s):(v=this.thru(f),d?r?v.value()[0]:v.value():v)})})),Ce(["pop","push","shift","sort","splice","unshift"],(function(t){var e=Et[t],n=/^(?:push|sort|unshift)$/.test(t)?"tap":"thru",r=/^(?:pop|shift)$/.test(t);Rn.prototype[t]=function(){var t=arguments;if(r&&!this.__chain__){var i=this.value();return e.apply(za(i)?i:[],t)}return this[n]((function(n){return e.apply(za(n)?n:[],t)}))}})),mr(Bn.prototype,(function(t,e){var n=Rn[e];if(n){var r=n.name+"";jt.call(En,r)||(En[r]=[]),En[r].push({name:e,func:n})}})),En[Oi(i,2).name]=[{name:"wrapper",func:i}],Bn.prototype.clone=function(){var t=new Bn(this.__wrapped__);return t.__actions__=Ti(this.__actions__),t.__dir__=this.__dir__,t.__filtered__=this.__filtered__,t.__iteratees__=Ti(this.__iteratees__),t.__takeCount__=this.__takeCount__,t.__views__=Ti(this.__views__),t},Bn.prototype.reverse=function(){if(this.__filtered__){var t=new Bn(this);t.__dir__=-1,t.__filtered__=!0}else(t=this.clone()).__dir__*=-1;return t},Bn.prototype.value=function(){var t=this.__wrapped__.value(),e=this.__dir__,n=za(t),r=e<0,i=n?t.length:0,o=function(t,e,n){for(var r=-1,i=n.length;++r<i;){var o=n[r],a=o.size;switch(o.type){case"drop":t+=a;break;case"dropRight":e-=a;break;case"take":e=yn(e,t+a);break;case"takeRight":t=vn(t,e-a)}}return{start:t,end:e}}(0,i,this.__views__),a=o.start,s=o.end,u=s-a,l=r?s:a-1,c=this.__iteratees__,f=c.length,h=0,p=yn(u,this.__takeCount__);if(!n||!r&&i==u&&p==u)return fi(t,this.__actions__);var d=[];t:for(;u--&&h<p;){for(var g=-1,v=t[l+=e];++g<f;){var y=c[g],m=y.iteratee,b=y.type,w=m(v);if(2==b)v=w;else if(!w){if(1==b)continue t;break t}}d[h++]=v}return d},Rn.prototype.at=da,Rn.prototype.chain=function(){return ha(this)},Rn.prototype.commit=function(){return new Fn(this.value(),this.__chain__)},Rn.prototype.next=function(){this.__values__===i&&(this.__values__=hs(this.value()));var t=this.__index__>=this.__values__.length;return{done:t,value:t?i:this.__values__[this.__index__++]}},Rn.prototype.plant=function(t){for(var e,n=this;n instanceof Hn;){var r=qo(n);r.__index__=0,r.__values__=i,e?o.__wrapped__=r:e=r;var o=r;n=n.__wrapped__}return o.__wrapped__=t,e},Rn.prototype.reverse=function(){var t=this.__wrapped__;if(t instanceof Bn){var e=t;return this.__actions__.length&&(e=new Bn(this)),(e=e.reverse()).__actions__.push({func:pa,args:[ta],thisArg:i}),new Fn(e,this.__chain__)}return this.thru(ta)},Rn.prototype.toJSON=Rn.prototype.valueOf=Rn.prototype.value=function(){return fi(this.__wrapped__,this.__actions__)},Rn.prototype.first=Rn.prototype.head,Jt&&(Rn.prototype[Jt]=function(){return this}),Rn}();"function"==typeof r&&"object"==typeof r.amd&&r.amd?(fe._=pn,r((function(){return pn}))):pe?((pe.exports=pn)._=pn,he._=pn):fe._=pn}).call(this)},663:(t,e,n)=>{"use strict";n.d(e,{v:()=>i});var r=n(7182);class i{constructor(t,e,n){this.colorPalette=t,this.fillProp=e,this.defaultDataPointColor=n}getColorForSeriesValue(t,e,n){return this.isHighContrast?this.getThemeColor(n):this.fillProp&&r.W7(t,this.fillProp)||this.defaultDataPointColor||this.colorPalette.getColor(String(e)).value}getColorForMeasure(t,e,n){if(this.isHighContrast)return this.getThemeColor(n);const i=this.colorPalette.getColor(e).value;return this.fillProp&&r.W7(t,this.fillProp)||this.defaultDataPointColor||i}static normalizeSelector(t,e){return t&&(e||t.data)?{data:t.data}:t}get isHighContrast(){return!(!this.colorPalette||!this.colorPalette.isHighContrast)}getThemeColor(t="background"){return this.colorPalette&&this.colorPalette[t]&&this.colorPalette[t].value}getHighContrastColor(t="background",e){return this.isHighContrast?this.getThemeColor(t):e}}},686:(t,e,n)=>{"use strict";n.d(e,{$Q:()=>m,Bx:()=>h,HO:()=>b,SE:()=>g,U1:()=>o,U8:()=>f,WV:()=>s,_j:()=>c,cD:()=>i,jd:()=>v,ok:()=>p,qH:()=>d,s1:()=>a});var r=n(7802);function i(t,e){t=t.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,(function(t,e,n,r){return e+e+n+n+r+r}));const n=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);let r=n?{r:parseInt(n[1],16),g:parseInt(n[2],16),b:parseInt(n[3],16)}:null;return null===r?"":e||0===e?"rgba("+r.r+","+r.g+","+r.b+","+e+")":"rgb("+r.r+","+r.g+","+r.b+")"}function o(t,e){if(0===e)return t;let n=function(t,e){let n=t.H+e;return{H:n>1?n-1:n,S:t.S,V:t.V}}(u(s(t)),e);return h(l(n))}function a(t){return h(s(t))}function s(t){if(t.indexOf("#")>=0){if(7===t.length){let e=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);if(null==e||e.length<4)return;return{R:parseInt(e[1],16),G:parseInt(e[2],16),B:parseInt(e[3],16)}}if(4===t.length){let e=/^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(t);if(null==e||e.length<4)return;return{R:parseInt(e[1]+e[1],16),G:parseInt(e[2]+e[2],16),B:parseInt(e[3]+e[3],16)}}}else{if(t.indexOf("rgb(")>=0){let e=/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(t);if(null==e||e.length<4)return;return{R:parseInt(e[1],10),G:parseInt(e[2],10),B:parseInt(e[3],10)}}if(t.indexOf("rgba(")>=0){let e=/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d*(?:\.\d+)?)\)$/.exec(t);if(null==e||e.length<5)return;return{R:parseInt(e[1],10),G:parseInt(e[2],10),B:parseInt(e[3],10),A:parseFloat(e[4])}}}}function u(t){let e,n,r=t.R/255,i=t.G/255,o=t.B/255,a=Math.min(r,Math.min(i,o)),s=Math.max(r,Math.max(i,o)),u=s-a;return 0===s||0===u?(e=0,n=0):(e=u/s,n=r===s?(i-o)/u:i===s?2+(o-r)/u:4+(r-i)/u),n/=6,n<0&&(n+=1),{H:n,S:e,V:s}}function l(t){let e,n,r,i=t.H,o=t.S,a=t.V;if(0===o)e=a,n=a,r=a;else{let t,s,u,l,c,f;switch(f=6*i,c=Math.floor(f),l=f-c,t=a*(1-o),s=a*(1-o*l),u=a*(1-o*(1-l)),c){case 0:e=a,n=u,r=t;break;case 1:e=s,n=a,r=t;break;case 2:e=t,n=a,r=u;break;case 3:e=t,n=s,r=a;break;case 4:e=u,n=t,r=a;break;case 5:e=a,n=t,r=s}}return{R:Math.floor(255*e),G:Math.floor(255*n),B:Math.floor(255*r)}}function c(t,e){let n=Math.floor(e);return{R:Math.max(0,t.R-n),G:Math.max(0,t.G-n),B:Math.max(0,t.B-n)}}function f(t){return null==t.A?"rgb("+t.R+","+t.G+","+t.B+")":"rgba("+t.R+","+t.G+","+t.B+","+t.A+")"}function h(t){return"#"+y(t.R)+y(t.G)+y(t.B)}function p(t,e,n){return h(d(s(t),e,s(n)))}function d(t,e,n){return e=r.QO(e,0,1),{R:g(t.R,e,n.R),G:g(t.G,e,n.G),B:g(t.B,e,n.B)}}function g(t,e,n){return e=r.QO(e,0,1),t=r.QO(t,0,255),n=r.QO(n,0,255),Math.round(e*t+(1-e)*n)}function v(t,e,n){let r=u(t);return(e+n>1||e<=0||n<=0)&&(e=.8,n=.2),r.V<e?r.V=r.V+n:r.V=r.V-n,h(l(r))}function y(t){let e=r.QO(t,0,255).toString(16).toUpperCase();return 1===e.length?"0"+e:e}function m(t,e,n){let r=e.map((t=>s(t)));return i=>{if(null==i&&(i=0),isNaN(i))return;if(n){if(i>=t[t.length-1])return e[e.length-1];if(i<=t[0])return e[0]}let o,a,s,u;for(let n=1,l=t.length;n<l;n++){if(o=t[n-1],a=t[n],a===i)return e[n];if(i>=o&&i<=a){s=r[n-1],u=r[n];break}}return h({R:Math.round((i-o)*(u.R-s.R)/(a-o)+s.R),G:Math.round((i-o)*(u.G-s.G)/(a-o)+s.G),B:Math.round((i-o)*(u.B-s.B)/(a-o)+s.B)})}}function b(t,e){let n=parseInt(t.slice(1),16),r=e<0?0:255,i=e<0?-1*e:e,o=n>>16,a=n>>8&255,s=255&n;return"#"+(16777216+65536*(Math.round((r-o)*i)+o)+256*(Math.round((r-a)*i)+a)+(Math.round((r-s)*i)+s)).toString(16).slice(1)}},6188:(t,e,n)=>{"use strict";n.d(e,{vH:()=>r.v});var r=n(663),i=n(686);i.jd,i.SE,i.$Q,i._j,i.ok,i.Bx,i.cD,i.s1,i.WV,i.qH,i.U8,i.U1,i.HO},9866:(t,e,n)=>{"use strict";function r(t,e,n){if(!t)return n;let r=t[e];return void 0===r?n:r}n.d(e,{N:()=>r})},7182:(t,e,n)=>{"use strict";n.d(e,{W7:()=>i});var r=n(9866);function i(t,e,n){const i=function(t,e,n){return t?r.N(t[e.objectName],e.propertyName,n):n}(t,e);return i&&i.solid?i.solid.color:n}},9406:(t,e,n)=>{"use strict";var r;function i(t){for(let e=0,n=t.length;e<n;e++)if(t[e].selected)return!0;return!1}n.d(e,{H_:()=>o}),function(t){t[t.merge=0]="merge",t[t.remove=1]="remove"}(r||(r={}));class o{constructor(){this.renderSelectionInVisual=()=>{},this.renderSelectionInLegend=()=>{},this.renderSelectionInLabels=()=>{},this.isInvertedSelectionMode=!1}bind(t){t.interactivityServiceOptions&&t.interactivityServiceOptions.overrideSelectionFromData&&this.takeSelectionStateFromDataPoints(t.dataPoints),t.interactivityServiceOptions?t.interactivityServiceOptions.isLegend?(this.selectableLegendDataPoints=t.dataPoints,this.renderSelectionInLegend=()=>t.behavior.renderSelection(this.legendHasSelection())):t.interactivityServiceOptions.isLabels?(this.selectableLabelsDataPoints=t.dataPoints,this.renderSelectionInLabels=()=>t.behavior.renderSelection(this.labelsHasSelection())):(this.selectableDataPoints=t.dataPoints,this.renderSelectionInVisual=()=>t.behavior.renderSelection(this.hasSelection())):(this.selectableDataPoints=t.dataPoints,this.renderSelectionInVisual=()=>t.behavior.renderSelection(this.hasSelection())),t.behavior.bindEvents(t,this),this.syncSelectionState()}clearSelection(){this.applyToAllSelectableDataPoints((t=>t.selected=!1)),this.renderAll()}legendHasSelection(){return!!this.selectableLegendDataPoints&&i(this.selectableLegendDataPoints)}labelsHasSelection(){return!!this.selectableLabelsDataPoints&&i(this.selectableLabelsDataPoints)}isSelectionModeInverted(){return this.isInvertedSelectionMode}handleSelection(t,e){t&&(this.select(t,e),this.sendSelectionToHost(),this.renderAll())}handleContextMenu(t,e){}handleClearSelection(){this.clearSelection(),this.sendSelectionToHost()}renderAll(){this.renderSelectionInVisual(),this.renderSelectionInLegend(),this.renderSelectionInLabels()}applyToAllSelectableDataPoints(t){let e=this.selectableDataPoints,n=this.selectableLegendDataPoints,r=this.selectableLabelsDataPoints;if(e)for(let n of e)t(n);if(n)for(let e of n)t(e);if(r)for(let e of r)t(e)}}},8482:(t,e,n)=>{"use strict";n.d(e,{L:()=>s});var r=n(369),i=n(9406),o=r.S;class a extends i.H_{constructor(t){super(),this.selectionManager=t.createSelectionManager(),this.selectionManager.registerOnSelectCallback&&this.selectionManager.registerOnSelectCallback((()=>{this.restoreSelection()}))}clearSelection(){this.selectionManager.clear(),super.clearSelection()}handleContextMenu(t,e){this.selectionManager.showContextMenu(t&&t.identity?t.identity:{},e)}applySelectionStateToData(t,e){e&&this.hasSelection()&&this.selectionManager.clear();const n=this.selectionManager.getSelectionIds();for(let e of t)e.selected=this.isDataPointSelected(e,n);return this.hasSelection()}restoreSelection(){this.syncSelectionState(),this.renderAll()}hasSelection(){return this.selectionManager.getSelectionIds().length>0}syncSelectionState(){if(this.isInvertedSelectionMode)return this.syncSelectionStateInverted();if(!this.selectableDataPoints&&!this.selectableLegendDataPoints)return;const t=this.selectionManager.getSelectionIds();if(this.selectableDataPoints&&this.updateSelectableDataPointsBySelectedIds(this.selectableDataPoints,t),this.selectableLegendDataPoints&&this.updateSelectableDataPointsBySelectedIds(this.selectableLegendDataPoints,t),this.selectableLabelsDataPoints)for(let e of this.selectableLabelsDataPoints)e.selected=t.some((t=>t.includes(e.identity)))}select(t,e){const n=[].concat(t),r=[...this.selectionManager.getSelectionIds()];e&&n.length||this.selectionManager.clear();const i=[];n.forEach((t=>{t&&t.identity&&(this.isDataPointSelected(t,r)?(t.selected=!1,e&&i.push(t.identity)):(t.selected=!0,i.push(t.identity)))})),this.selectionManager.select(i,e),this.syncSelectionState()}takeSelectionStateFromDataPoints(t){const e=this.selectionManager.getSelectionIds();o.clear(e);for(let n of t)n.selected&&e.push(n.identity)}sendSelectionToHost(){}syncSelectionStateInverted(){let t=this.selectionManager.getSelectionIds(),e=this.selectableDataPoints;if(e)if(0===t.length)for(let t of e)t.selected=!1;else for(let n of e)t.some((t=>t.includes(n.identity)))?n.selected=!0:n.selected&&(n.selected=!1)}updateSelectableDataPointsBySelectedIds(t,e){let n=!1;for(let r of t)r.selected=this.isDataPointSelected(r,e),r.selected&&(n=!0);return n}isDataPointSelected(t,e){return e.some((e=>e.includes(t.identity)))}}function s(t){return new a(t)}},369:(t,e,n)=>{"use strict";var r;n.d(e,{S:()=>r}),function(t){function e(t,e){t.indexOf(e)<0&&t.push(e)}function n(t,e){let n=[];for(let r=0;r<e;++r)n.push(t[r]);return n}function r(t){let e=t;return e.withId=i,e}function i(e){return t.findWithId(this,e)}function o(t){let e=t;return e.withName=u,e}function a(t,e){let n=s(t,e);if(n>=0)return t[n]}function s(t,e){for(let n=0,r=t.length;n<r;n++)if(t[n].name===e)return n;return-1}function u(t){return a(this,t)}function l(t,e){let n=t.length;if(n>=2)for(let r=1;r<n;r++)if(e(t[r-1],t[r])>0)return!1;return!0}t.intersect=function(t,e){let n=[];for(let r=t.length-1;r>=0;--r)-1!==e.indexOf(t[r])&&n.push(t[r]);return n},t.diff=function(t,e){let n=[];for(let r=t.length-1;r>=0;--r){let i=t[r];-1===e.indexOf(i)&&n.push(i)}return n},t.distinct=function(t){let e=[];for(let n=0,r=t.length;n<r;n++){let r=t[n];-1===e.indexOf(r)&&e.push(r)}return e},t.union=function(t,n){for(let r=0,i=n.length;r<i;++r)e(t,n[r])},t.unionSingle=e,t.range=function(t,e,n){let r=[];for(let i=e;i<=n;++i)r.push(t[i]);return r},t.take=n,t.copy=function(t){return n(t,t.length)},t.sequenceEqual=function(t,e,n){if(t||(t=null),e||(e=null),t===e)return!0;if(!!t!=!!e)return!1;let r=t.length;if(r!==e.length)return!1;let i=0;for(;i<r&&n(t[i],e[i]);)++i;return i===r},t.emptyToNull=function(t){return t&&0===t.length?null:t},t.indexOf=function(t,e){for(let n=0,r=t.length;n<r;++n)if(e(t[n]))return n;return-1},t.rotate=function(t,e){if(0===e)return t.slice();let n=t.slice(e);return Array.prototype.push.apply(n,t.slice(0,e)),n},t.createWithId=function(){return r([])},t.extendWithId=r,t.findWithId=function(t,e){for(let n=0,r=t.length;n<r;n++){let r=t[n];if(r.id===e)return r}},t.createWithName=function(){return o([])},t.extendWithName=o,t.findItemWithName=a,t.indexWithName=s,t.insertSorted=function(t,e){for(let n=t.length-1;n>=0;n--){let r=t[n]-e;if(0===r)return!1;if(!(r>0))return t.splice(n+1,0,e),!0}return t.unshift(e),!0},t.removeFirst=function(t,e){let n=t.indexOf(e);return!(n<0||(t.splice(n,1),0))},t.clear=function(t){if(t)for(;t.length>0;)t.pop()},t.isUndefinedOrEmpty=function(t){return!t||0===t.length},t.swap=function(t,e,n){let r=t[e];t[e]=t[n],t[n]=r},t.isInArray=function(t,e,n){return t.some((t=>n(t,e)))},t.isArrayOrInheritedArray=function(t){let e=t;for(;null!=e;){if(Array.isArray(e))return!0;e=Object.getPrototypeOf(e)}return!1},t.isSorted=l,t.isSortedNumeric=function(t,e){return l(t,e?(t,e)=>e-t:(t,e)=>t-e)},t.ensureArray=function(t){return Array.isArray(t)?t:[t]}}(r||(r={}))},880:(t,e,n)=>{"use strict";n.d(e,{p:()=>u});var r=n(4017),i=n(5644),o=n(5572),a=n(6738);const s=()=>n(9825).B;function u(t,e,n=1e3,r=s){return new l({tooltipService:t,rootElement:e,handleTouchDelay:n,getEventMethod:r})}class l{constructor(t){this.visualHostTooltipService=t.tooltipService,this.rootElement=t.rootElement,this.handleTouchDelay=t.handleTouchDelay,this.getEvent=t.getEventMethod||s}addTooltip(t,e,n,r){if(!t||!this.visualHostTooltipService.enabled())return;let i=this.rootElement;t.on("mouseover.tooltip",(()=>{if(!this.canDisplayTooltip())return;let t=this.makeTooltipEventArgs(i,!0,!1);if(!t)return;let r=e(t);if(null==r)return;let o=this.getSelectionIds(t,n);this.visualHostTooltipService.show({coordinates:t.coordinates,isTouchEvent:!1,dataItems:r,identities:o})})),t.on("mouseout.tooltip",(()=>{this.visualHostTooltipService.hide({isTouchEvent:!1,immediately:!1})})),t.on("mousemove.tooltip",(()=>{if(!this.canDisplayTooltip())return;let t,o=this.makeTooltipEventArgs(i,!0,!1);if(!o)return;if(r&&(t=e(o),null==t))return;let a=this.getSelectionIds(o,n);this.visualHostTooltipService.move({coordinates:o.coordinates,isTouchEvent:!1,dataItems:t,identities:a})}));let s=o.ME(),u=o.dF(),l=o.bQ();t.on(s+".tooltip",(()=>{this.visualHostTooltipService.hide({isTouchEvent:!0,immediately:!0});let t=this.makeTooltipEventArgs(i,l,!0);if(!t)return;let r=e(t),o=this.getSelectionIds(t,n);this.visualHostTooltipService.show({coordinates:t.coordinates,isTouchEvent:!0,dataItems:r,identities:o})})),t.on(u+".tooltip",(()=>{this.handleTouchTimeoutId&&clearTimeout(this.handleTouchTimeoutId),this.handleTouchTimeoutId=a.setTimeout((()=>{this.handleTouchTimeoutId=void 0}),this.handleTouchDelay)}))}getSelectionIds(t,e){const n=e?e(t):null;return n?[n]:[]}hide(){this.visualHostTooltipService.hide({immediately:!0,isTouchEvent:!1})}makeTooltipEventArgs(t,e,n){let i=this.getEvent().target;return{data:(0,r.Z)(i).datum(),coordinates:this.getCoordinates(t,e),elementCoordinates:this.getCoordinates(i,e),context:i,isTouchEvent:n}}canDisplayTooltip(){let t=!0;const e=this.getEvent();return void 0!==e.buttons&&(t=!(0!==e.buttons)),t=t&&null==this.handleTouchTimeoutId,t}getCoordinates(t,e){let n;if(e){let e,r=event;for(;e=r.sourceEvent;)r=e;let i=t.getBoundingClientRect();n=[r.clientX-i.left-t.clientLeft,r.clientY-i.top-t.clientTop]}else{let e=(0,i.Z)(t);e&&e.length>0&&(n=e[0])}return n}}},5572:(t,e,n)=>{"use strict";n.d(e,{ME:()=>i,bQ:()=>a,dF:()=>o});var r=n(6738);function i(){let t="touchstart";return r.PointerEvent&&(t="pointerdown"),t}function o(){let t="touchend";return r.PointerEvent&&(t="pointerup"),t}function a(){let t=i();return"pointerdown"===t||"MSPointerDown"===t}},7802:(t,e,n)=>{"use strict";function r(t,e,n){return null==t?t:t<e?e:t>n?n:t}n.d(e,{QO:()=>r}),Number.MAX_VALUE,Number.MAX_VALUE,Math.log(10)},6738:t=>{"use strict";t.exports=Function("return this")()},6544:t=>{"use strict";t.exports=!1}},e={};function n(r){var i=e[r];if(void 0!==i)return i.exports;var o=e[r]={id:r,loaded:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.loaded=!0,o.exports}n.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return n.d(e,{a:e}),e},n.d=(t,e)=>{for(var r in e)n.o(e,r)&&!n.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),n.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),n.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.nmd=t=>(t.paths=[],t.children||(t.children=[]),t);var r={};(()=>{"use strict";n.r(r),n.d(r,{default:()=>o});var t=n(1840),e=n(6738).powerbi,i={name:"taskboard7A11309AC21042A28A78716F6638A2B0ms01x",displayName:"Stratada Taskboard",class:"Visual",apiVersion:"4.7.0",create:e=>{if(t.u)return new t.u(e);throw"Visual instance not found"},createModalDialog:(t,e,n)=>{const r=globalThis.dialogRegistry;t in r&&new r[t](e,n)},custom:!0};void 0!==e&&(e.visuals=e.visuals||{},e.visuals.plugins=e.visuals.plugins||{},e.visuals.plugins.taskboard7A11309AC21042A28A78716F6638A2B0ms01x=i);const o=i})(),taskboard7A11309AC21042A28A78716F6638A2B0ms01x=r})();