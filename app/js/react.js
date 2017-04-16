/**
 * React v15.5.4
 */
(function (f) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (typeof define === "function" && define.amd) {
    define([], f);
  } else {
    var g;if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }g.React = f();
  }
})(function () {
  var define, module, exports;return function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
        }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
          var n = t[o][1][e];return s(n ? n : e);
        }, l, l.exports, e, t, n, r);
      }return n[o].exports;
    }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) s(r[o]);return s;
  }({ 1: [function (_dereq_, module, exports) {
      /**
       * Copyright 2013-present, Facebook, Inc.
       * All rights reserved.
       *
       * This source code is licensed under the BSD-style license found in the
       * LICENSE file in the root directory of this source tree. An additional grant
       * of patent rights can be found in the PATENTS file in the same directory.
       *
       * 
       */

      'use strict';

      /**
       * Escape and wrap key so it is safe to use as a reactid
       *
       * @param {string} key to be escaped.
       * @return {string} the escaped key.
       */

      function escape(key) {
        var escapeRegex = /[=:]/g;
        var escaperLookup = {
          '=': '=0',
          ':': '=2'
        };
        var escapedString = ('' + key).replace(escapeRegex, function (match) {
          return escaperLookup[match];
        });

        return '$' + escapedString;
      }

      /**
       * Unescape and unwrap key for human-readable display
       *
       * @param {string} key to unescape.
       * @return {string} the unescaped key.
       */
      function unescape(key) {
        var unescapeRegex = /(=0|=2)/g;
        var unescaperLookup = {
          '=0': '=',
          '=2': ':'
        };
        var keySubstring = key[0] === '.' && key[1] === '$' ? key.substring(2) : key.substring(1);

        return ('' + keySubstring).replace(unescapeRegex, function (match) {
          return unescaperLookup[match];
        });
      }

      var KeyEscapeUtils = {
        escape: escape,
        unescape: unescape
      };

      module.exports = KeyEscapeUtils;
    }, {}], 2: [function (_dereq_, module, exports) {
      /**
       * Copyright 2013-present, Facebook, Inc.
       * All rights reserved.
       *
       * This source code is licensed under the BSD-style license found in the
       * LICENSE file in the root directory of this source tree. An additional grant
       * of patent rights can be found in the PATENTS file in the same directory.
       *
       * 
       */

      'use strict';

      var _prodInvariant = _dereq_(25);

      var invariant = _dereq_(29);

      /**
       * Static poolers. Several custom versions for each potential number of
       * arguments. A completely generic pooler is easy to implement, but would
       * require accessing the `arguments` object. In each of these, `this` refers to
       * the Class itself, not an instance. If any others are needed, simply add them
       * here, or in their own files.
       */
      var oneArgumentPooler = function (copyFieldsFrom) {
        var Klass = this;
        if (Klass.instancePool.length) {
          var instance = Klass.instancePool.pop();
          Klass.call(instance, copyFieldsFrom);
          return instance;
        } else {
          return new Klass(copyFieldsFrom);
        }
      };

      var twoArgumentPooler = function (a1, a2) {
        var Klass = this;
        if (Klass.instancePool.length) {
          var instance = Klass.instancePool.pop();
          Klass.call(instance, a1, a2);
          return instance;
        } else {
          return new Klass(a1, a2);
        }
      };

      var threeArgumentPooler = function (a1, a2, a3) {
        var Klass = this;
        if (Klass.instancePool.length) {
          var instance = Klass.instancePool.pop();
          Klass.call(instance, a1, a2, a3);
          return instance;
        } else {
          return new Klass(a1, a2, a3);
        }
      };

      var fourArgumentPooler = function (a1, a2, a3, a4) {
        var Klass = this;
        if (Klass.instancePool.length) {
          var instance = Klass.instancePool.pop();
          Klass.call(instance, a1, a2, a3, a4);
          return instance;
        } else {
          return new Klass(a1, a2, a3, a4);
        }
      };

      var standardReleaser = function (instance) {
        var Klass = this;
        !(instance instanceof Klass) ? "development" !== 'production' ? invariant(false, 'Trying to release an instance into a pool of a different type.') : _prodInvariant('25') : void 0;
        instance.destructor();
        if (Klass.instancePool.length < Klass.poolSize) {
          Klass.instancePool.push(instance);
        }
      };

      var DEFAULT_POOL_SIZE = 10;
      var DEFAULT_POOLER = oneArgumentPooler;

      /**
       * Augments `CopyConstructor` to be a poolable class, augmenting only the class
       * itself (statically) not adding any prototypical fields. Any CopyConstructor
       * you give this may have a `poolSize` property, and will look for a
       * prototypical `destructor` on instances.
       *
       * @param {Function} CopyConstructor Constructor that can be used to reset.
       * @param {Function} pooler Customizable pooler.
       */
      var addPoolingTo = function (CopyConstructor, pooler) {
        // Casting as any so that flow ignores the actual implementation and trusts
        // it to match the type we declared
        var NewKlass = CopyConstructor;
        NewKlass.instancePool = [];
        NewKlass.getPooled = pooler || DEFAULT_POOLER;
        if (!NewKlass.poolSize) {
          NewKlass.poolSize = DEFAULT_POOL_SIZE;
        }
        NewKlass.release = standardReleaser;
        return NewKlass;
      };

      var PooledClass = {
        addPoolingTo: addPoolingTo,
        oneArgumentPooler: oneArgumentPooler,
        twoArgumentPooler: twoArgumentPooler,
        threeArgumentPooler: threeArgumentPooler,
        fourArgumentPooler: fourArgumentPooler
      };

      module.exports = PooledClass;
    }, { "25": 25, "29": 29 }], 3: [function (_dereq_, module, exports) {
      /**
       * Copyright 2013-present, Facebook, Inc.
       * All rights reserved.
       *
       * This source code is licensed under the BSD-style license found in the
       * LICENSE file in the root directory of this source tree. An additional grant
       * of patent rights can be found in the PATENTS file in the same directory.
       *
       */

      'use strict';

      var _assign = _dereq_(31);

      var ReactChildren = _dereq_(4);
      var ReactComponent = _dereq_(6);
      var ReactPureComponent = _dereq_(17);
      var ReactClass = _dereq_(5);
      var ReactDOMFactories = _dereq_(9);
      var ReactElement = _dereq_(10);
      var ReactPropTypes = _dereq_(15);
      var ReactVersion = _dereq_(19);

      var onlyChild = _dereq_(24);
      var warning = _dereq_(30);

      var createElement = ReactElement.createElement;
      var createFactory = ReactElement.createFactory;
      var cloneElement = ReactElement.cloneElement;

      if ("development" !== 'production') {
        var canDefineProperty = _dereq_(20);
        var ReactElementValidator = _dereq_(12);
        var didWarnPropTypesDeprecated = false;
        createElement = ReactElementValidator.createElement;
        createFactory = ReactElementValidator.createFactory;
        cloneElement = ReactElementValidator.cloneElement;
      }

      var __spread = _assign;

      if ("development" !== 'production') {
        var warned = false;
        __spread = function () {
          "development" !== 'production' ? warning(warned, 'React.__spread is deprecated and should not be used. Use ' + 'Object.assign directly or another helper function with similar ' + 'semantics. You may be seeing this warning due to your compiler. ' + 'See https://fb.me/react-spread-deprecation for more details.') : void 0;
          warned = true;
          return _assign.apply(null, arguments);
        };
      }

      var React = {

        // Modern

        Children: {
          map: ReactChildren.map,
          forEach: ReactChildren.forEach,
          count: ReactChildren.count,
          toArray: ReactChildren.toArray,
          only: onlyChild
        },

        Component: ReactComponent,
        PureComponent: ReactPureComponent,

        createElement: createElement,
        cloneElement: cloneElement,
        isValidElement: ReactElement.isValidElement,

        // Classic

        PropTypes: ReactPropTypes,
        createClass: ReactClass.createClass,
        createFactory: createFactory,
        createMixin: function (mixin) {
          // Currently a noop. Will be used to validate and trace mixins.
          return mixin;
        },

        // This looks DOM specific but these are actually isomorphic helpers
        // since they are just generating DOM strings.
        DOM: ReactDOMFactories,

        version: ReactVersion,

        // Deprecated hook for JSX spread, don't use this for anything.
        __spread: __spread
      };

      // TODO: Fix tests so that this deprecation warning doesn't cause failures.
      if ("development" !== 'production') {
        if (canDefineProperty) {
          Object.defineProperty(React, 'PropTypes', {
            get: function () {
              "development" !== 'production' ? warning(didWarnPropTypesDeprecated, 'Accessing PropTypes via the main React package is deprecated. Use ' + 'the prop-types package from npm instead.') : void 0;
              didWarnPropTypesDeprecated = true;
              return ReactPropTypes;
            }
          });
        }
      }

      module.exports = React;
    }, { "10": 10, "12": 12, "15": 15, "17": 17, "19": 19, "20": 20, "24": 24, "30": 30, "31": 31, "4": 4, "5": 5, "6": 6, "9": 9 }], 4: [function (_dereq_, module, exports) {
      /**
       * Copyright 2013-present, Facebook, Inc.
       * All rights reserved.
       *
       * This source code is licensed under the BSD-style license found in the
       * LICENSE file in the root directory of this source tree. An additional grant
       * of patent rights can be found in the PATENTS file in the same directory.
       *
       */

      'use strict';

      var PooledClass = _dereq_(2);
      var ReactElement = _dereq_(10);

      var emptyFunction = _dereq_(27);
      var traverseAllChildren = _dereq_(26);

      var twoArgumentPooler = PooledClass.twoArgumentPooler;
      var fourArgumentPooler = PooledClass.fourArgumentPooler;

      var userProvidedKeyEscapeRegex = /\/+/g;
      function escapeUserProvidedKey(text) {
        return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
      }

      /**
       * PooledClass representing the bookkeeping associated with performing a child
       * traversal. Allows avoiding binding callbacks.
       *
       * @constructor ForEachBookKeeping
       * @param {!function} forEachFunction Function to perform traversal with.
       * @param {?*} forEachContext Context to perform context with.
       */
      function ForEachBookKeeping(forEachFunction, forEachContext) {
        this.func = forEachFunction;
        this.context = forEachContext;
        this.count = 0;
      }
      ForEachBookKeeping.prototype.destructor = function () {
        this.func = null;
        this.context = null;
        this.count = 0;
      };
      PooledClass.addPoolingTo(ForEachBookKeeping, twoArgumentPooler);

      function forEachSingleChild(bookKeeping, child, name) {
        var func = bookKeeping.func,
            context = bookKeeping.context;

        func.call(context, child, bookKeeping.count++);
      }

      /**
       * Iterates through children that are typically specified as `props.children`.
       *
       * See https://facebook.github.io/react/docs/top-level-api.html#react.children.foreach
       *
       * The provided forEachFunc(child, index) will be called for each
       * leaf child.
       *
       * @param {?*} children Children tree container.
       * @param {function(*, int)} forEachFunc
       * @param {*} forEachContext Context for forEachContext.
       */
      function forEachChildren(children, forEachFunc, forEachContext) {
        if (children == null) {
          return children;
        }
        var traverseContext = ForEachBookKeeping.getPooled(forEachFunc, forEachContext);
        traverseAllChildren(children, forEachSingleChild, traverseContext);
        ForEachBookKeeping.release(traverseContext);
      }

      /**
       * PooledClass representing the bookkeeping associated with performing a child
       * mapping. Allows avoiding binding callbacks.
       *
       * @constructor MapBookKeeping
       * @param {!*} mapResult Object containing the ordered map of results.
       * @param {!function} mapFunction Function to perform mapping with.
       * @param {?*} mapContext Context to perform mapping with.
       */
      function MapBookKeeping(mapResult, keyPrefix, mapFunction, mapContext) {
        this.result = mapResult;
        this.keyPrefix = keyPrefix;
        this.func = mapFunction;
        this.context = mapContext;
        this.count = 0;
      }
      MapBookKeeping.prototype.destructor = function () {
        this.result = null;
        this.keyPrefix = null;
        this.func = null;
        this.context = null;
        this.count = 0;
      };
      PooledClass.addPoolingTo(MapBookKeeping, fourArgumentPooler);

      function mapSingleChildIntoContext(bookKeeping, child, childKey) {
        var result = bookKeeping.result,
            keyPrefix = bookKeeping.keyPrefix,
            func = bookKeeping.func,
            context = bookKeeping.context;

        var mappedChild = func.call(context, child, bookKeeping.count++);
        if (Array.isArray(mappedChild)) {
          mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, emptyFunction.thatReturnsArgument);
        } else if (mappedChild != null) {
          if (ReactElement.isValidElement(mappedChild)) {
            mappedChild = ReactElement.cloneAndReplaceKey(mappedChild,
            // Keep both the (mapped) and old keys if they differ, just as
            // traverseAllChildren used to do for objects as children
            keyPrefix + (mappedChild.key && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey(mappedChild.key) + '/' : '') + childKey);
          }
          result.push(mappedChild);
        }
      }

      function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
        var escapedPrefix = '';
        if (prefix != null) {
          escapedPrefix = escapeUserProvidedKey(prefix) + '/';
        }
        var traverseContext = MapBookKeeping.getPooled(array, escapedPrefix, func, context);
        traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
        MapBookKeeping.release(traverseContext);
      }

      /**
       * Maps children that are typically specified as `props.children`.
       *
       * See https://facebook.github.io/react/docs/top-level-api.html#react.children.map
       *
       * The provided mapFunction(child, key, index) will be called for each
       * leaf child.
       *
       * @param {?*} children Children tree container.
       * @param {function(*, int)} func The map function.
       * @param {*} context Context for mapFunction.
       * @return {object} Object containing the ordered map of results.
       */
      function mapChildren(children, func, context) {
        if (children == null) {
          return children;
        }
        var result = [];
        mapIntoWithKeyPrefixInternal(children, result, null, func, context);
        return result;
      }

      function forEachSingleChildDummy(traverseContext, child, name) {
        return null;
      }

      /**
       * Count the number of children that are typically specified as
       * `props.children`.
       *
       * See https://facebook.github.io/react/docs/top-level-api.html#react.children.count
       *
       * @param {?*} children Children tree container.
       * @return {number} The number of children.
       */
      function countChildren(children, context) {
        return traverseAllChildren(children, forEachSingleChildDummy, null);
      }

      /**
       * Flatten a children object (typically specified as `props.children`) and
       * return an array with appropriately re-keyed children.
       *
       * See https://facebook.github.io/react/docs/top-level-api.html#react.children.toarray
       */
      function toArray(children) {
        var result = [];
        mapIntoWithKeyPrefixInternal(children, result, null, emptyFunction.thatReturnsArgument);
        return result;
      }

      var ReactChildren = {
        forEach: forEachChildren,
        map: mapChildren,
        mapIntoWithKeyPrefixInternal: mapIntoWithKeyPrefixInternal,
        count: countChildren,
        toArray: toArray
      };

      module.exports = ReactChildren;
    }, { "10": 10, "2": 2, "26": 26, "27": 27 }], 5: [function (_dereq_, module, exports) {
      /**
       * Copyright 2013-present, Facebook, Inc.
       * All rights reserved.
       *
       * This source code is licensed under the BSD-style license found in the
       * LICENSE file in the root directory of this source tree. An additional grant
       * of patent rights can be found in the PATENTS file in the same directory.
       *
       */

      'use strict';

      var _prodInvariant = _dereq_(25),
          _assign = _dereq_(31);

      var ReactComponent = _dereq_(6);
      var ReactElement = _dereq_(10);
      var ReactPropTypeLocationNames = _dereq_(14);
      var ReactNoopUpdateQueue = _dereq_(13);

      var emptyObject = _dereq_(28);
      var invariant = _dereq_(29);
      var warning = _dereq_(30);

      var MIXINS_KEY = 'mixins';

      // Helper function to allow the creation of anonymous functions which do not
      // have .name set to the name of the variable being assigned to.
      function identity(fn) {
        return fn;
      }

      /**
       * Policies that describe methods in `ReactClassInterface`.
       */

      var injectedMixins = [];

      /**
       * Composite components are higher-level components that compose other composite
       * or host components.
       *
       * To create a new type of `ReactClass`, pass a specification of
       * your new class to `React.createClass`. The only requirement of your class
       * specification is that you implement a `render` method.
       *
       *   var MyComponent = React.createClass({
       *     render: function() {
       *       return <div>Hello World</div>;
       *     }
       *   });
       *
       * The class specification supports a specific protocol of methods that have
       * special meaning (e.g. `render`). See `ReactClassInterface` for
       * more the comprehensive protocol. Any other properties and methods in the
       * class specification will be available on the prototype.
       *
       * @interface ReactClassInterface
       * @internal
       */
      var ReactClassInterface = {

        /**
         * An array of Mixin objects to include when defining your component.
         *
         * @type {array}
         * @optional
         */
        mixins: 'DEFINE_MANY',

        /**
         * An object containing properties and methods that should be defined on
         * the component's constructor instead of its prototype (static methods).
         *
         * @type {object}
         * @optional
         */
        statics: 'DEFINE_MANY',

        /**
         * Definition of prop types for this component.
         *
         * @type {object}
         * @optional
         */
        propTypes: 'DEFINE_MANY',

        /**
         * Definition of context types for this component.
         *
         * @type {object}
         * @optional
         */
        contextTypes: 'DEFINE_MANY',

        /**
         * Definition of context types this component sets for its children.
         *
         * @type {object}
         * @optional
         */
        childContextTypes: 'DEFINE_MANY',

        // ==== Definition methods ====

        /**
         * Invoked when the component is mounted. Values in the mapping will be set on
         * `this.props` if that prop is not specified (i.e. using an `in` check).
         *
         * This method is invoked before `getInitialState` and therefore cannot rely
         * on `this.state` or use `this.setState`.
         *
         * @return {object}
         * @optional
         */
        getDefaultProps: 'DEFINE_MANY_MERGED',

        /**
         * Invoked once before the component is mounted. The return value will be used
         * as the initial value of `this.state`.
         *
         *   getInitialState: function() {
         *     return {
         *       isOn: false,
         *       fooBaz: new BazFoo()
         *     }
         *   }
         *
         * @return {object}
         * @optional
         */
        getInitialState: 'DEFINE_MANY_MERGED',

        /**
         * @return {object}
         * @optional
         */
        getChildContext: 'DEFINE_MANY_MERGED',

        /**
         * Uses props from `this.props` and state from `this.state` to render the
         * structure of the component.
         *
         * No guarantees are made about when or how often this method is invoked, so
         * it must not have side effects.
         *
         *   render: function() {
         *     var name = this.props.name;
         *     return <div>Hello, {name}!</div>;
         *   }
         *
         * @return {ReactComponent}
         * @required
         */
        render: 'DEFINE_ONCE',

        // ==== Delegate methods ====

        /**
         * Invoked when the component is initially created and about to be mounted.
         * This may have side effects, but any external subscriptions or data created
         * by this method must be cleaned up in `componentWillUnmount`.
         *
         * @optional
         */
        componentWillMount: 'DEFINE_MANY',

        /**
         * Invoked when the component has been mounted and has a DOM representation.
         * However, there is no guarantee that the DOM node is in the document.
         *
         * Use this as an opportunity to operate on the DOM when the component has
         * been mounted (initialized and rendered) for the first time.
         *
         * @param {DOMElement} rootNode DOM element representing the component.
         * @optional
         */
        componentDidMount: 'DEFINE_MANY',

        /**
         * Invoked before the component receives new props.
         *
         * Use this as an opportunity to react to a prop transition by updating the
         * state using `this.setState`. Current props are accessed via `this.props`.
         *
         *   componentWillReceiveProps: function(nextProps, nextContext) {
         *     this.setState({
         *       likesIncreasing: nextProps.likeCount > this.props.likeCount
         *     });
         *   }
         *
         * NOTE: There is no equivalent `componentWillReceiveState`. An incoming prop
         * transition may cause a state change, but the opposite is not true. If you
         * need it, you are probably looking for `componentWillUpdate`.
         *
         * @param {object} nextProps
         * @optional
         */
        componentWillReceiveProps: 'DEFINE_MANY',

        /**
         * Invoked while deciding if the component should be updated as a result of
         * receiving new props, state and/or context.
         *
         * Use this as an opportunity to `return false` when you're certain that the
         * transition to the new props/state/context will not require a component
         * update.
         *
         *   shouldComponentUpdate: function(nextProps, nextState, nextContext) {
         *     return !equal(nextProps, this.props) ||
         *       !equal(nextState, this.state) ||
         *       !equal(nextContext, this.context);
         *   }
         *
         * @param {object} nextProps
         * @param {?object} nextState
         * @param {?object} nextContext
         * @return {boolean} True if the component should update.
         * @optional
         */
        shouldComponentUpdate: 'DEFINE_ONCE',

        /**
         * Invoked when the component is about to update due to a transition from
         * `this.props`, `this.state` and `this.context` to `nextProps`, `nextState`
         * and `nextContext`.
         *
         * Use this as an opportunity to perform preparation before an update occurs.
         *
         * NOTE: You **cannot** use `this.setState()` in this method.
         *
         * @param {object} nextProps
         * @param {?object} nextState
         * @param {?object} nextContext
         * @param {ReactReconcileTransaction} transaction
         * @optional
         */
        componentWillUpdate: 'DEFINE_MANY',

        /**
         * Invoked when the component's DOM representation has been updated.
         *
         * Use this as an opportunity to operate on the DOM when the component has
         * been updated.
         *
         * @param {object} prevProps
         * @param {?object} prevState
         * @param {?object} prevContext
         * @param {DOMElement} rootNode DOM element representing the component.
         * @optional
         */
        componentDidUpdate: 'DEFINE_MANY',

        /**
         * Invoked when the component is about to be removed from its parent and have
         * its DOM representation destroyed.
         *
         * Use this as an opportunity to deallocate any external resources.
         *
         * NOTE: There is no `componentDidUnmount` since your component will have been
         * destroyed by that point.
         *
         * @optional
         */
        componentWillUnmount: 'DEFINE_MANY',

        // ==== Advanced methods ====

        /**
         * Updates the component's currently mounted DOM representation.
         *
         * By default, this implements React's rendering and reconciliation algorithm.
         * Sophisticated clients may wish to override this.
         *
         * @param {ReactReconcileTransaction} transaction
         * @internal
         * @overridable
         */
        updateComponent: 'OVERRIDE_BASE'

      };

      /**
       * Mapping from class specification keys to special processing functions.
       *
       * Although these are declared like instance properties in the specification
       * when defining classes using `React.createClass`, they are actually static
       * and are accessible on the constructor instead of the prototype. Despite
       * being static, they must be defined outside of the "statics" key under
       * which all other static methods are defined.
       */
      var RESERVED_SPEC_KEYS = {
        displayName: function (Constructor, displayName) {
          Constructor.displayName = displayName;
        },
        mixins: function (Constructor, mixins) {
          if (mixins) {
            for (var i = 0; i < mixins.length; i++) {
              mixSpecIntoComponent(Constructor, mixins[i]);
            }
          }
        },
        childContextTypes: function (Constructor, childContextTypes) {
          if ("development" !== 'production') {
            validateTypeDef(Constructor, childContextTypes, 'childContext');
          }
          Constructor.childContextTypes = _assign({}, Constructor.childContextTypes, childContextTypes);
        },
        contextTypes: function (Constructor, contextTypes) {
          if ("development" !== 'production') {
            validateTypeDef(Constructor, contextTypes, 'context');
          }
          Constructor.contextTypes = _assign({}, Constructor.contextTypes, contextTypes);
        },
        /**
         * Special case getDefaultProps which should move into statics but requires
         * automatic merging.
         */
        getDefaultProps: function (Constructor, getDefaultProps) {
          if (Constructor.getDefaultProps) {
            Constructor.getDefaultProps = createMergedResultFunction(Constructor.getDefaultProps, getDefaultProps);
          } else {
            Constructor.getDefaultProps = getDefaultProps;
          }
        },
        propTypes: function (Constructor, propTypes) {
          if ("development" !== 'production') {
            validateTypeDef(Constructor, propTypes, 'prop');
          }
          Constructor.propTypes = _assign({}, Constructor.propTypes, propTypes);
        },
        statics: function (Constructor, statics) {
          mixStaticSpecIntoComponent(Constructor, statics);
        },
        autobind: function () {} };

      function validateTypeDef(Constructor, typeDef, location) {
        for (var propName in typeDef) {
          if (typeDef.hasOwnProperty(propName)) {
            // use a warning instead of an invariant so components
            // don't show up in prod but only in __DEV__
            "development" !== 'production' ? warning(typeof typeDef[propName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'React.PropTypes.', Constructor.displayName || 'ReactClass', ReactPropTypeLocationNames[location], propName) : void 0;
          }
        }
      }

      function validateMethodOverride(isAlreadyDefined, name) {
        var specPolicy = ReactClassInterface.hasOwnProperty(name) ? ReactClassInterface[name] : null;

        // Disallow overriding of base class methods unless explicitly allowed.
        if (ReactClassMixin.hasOwnProperty(name)) {
          !(specPolicy === 'OVERRIDE_BASE') ? "development" !== 'production' ? invariant(false, 'ReactClassInterface: You are attempting to override `%s` from your class specification. Ensure that your method names do not overlap with React methods.', name) : _prodInvariant('73', name) : void 0;
        }

        // Disallow defining methods more than once unless explicitly allowed.
        if (isAlreadyDefined) {
          !(specPolicy === 'DEFINE_MANY' || specPolicy === 'DEFINE_MANY_MERGED') ? "development" !== 'production' ? invariant(false, 'ReactClassInterface: You are attempting to define `%s` on your component more than once. This conflict may be due to a mixin.', name) : _prodInvariant('74', name) : void 0;
        }
      }

      /**
       * Mixin helper which handles policy validation and reserved
       * specification keys when building React classes.
       */
      function mixSpecIntoComponent(Constructor, spec) {
        if (!spec) {
          if ("development" !== 'production') {
            var typeofSpec = typeof spec;
            var isMixinValid = typeofSpec === 'object' && spec !== null;

            "development" !== 'production' ? warning(isMixinValid, '%s: You\'re attempting to include a mixin that is either null ' + 'or not an object. Check the mixins included by the component, ' + 'as well as any mixins they include themselves. ' + 'Expected object but got %s.', Constructor.displayName || 'ReactClass', spec === null ? null : typeofSpec) : void 0;
          }

          return;
        }

        !(typeof spec !== 'function') ? "development" !== 'production' ? invariant(false, 'ReactClass: You\'re attempting to use a component class or function as a mixin. Instead, just use a regular object.') : _prodInvariant('75') : void 0;
        !!ReactElement.isValidElement(spec) ? "development" !== 'production' ? invariant(false, 'ReactClass: You\'re attempting to use a component as a mixin. Instead, just use a regular object.') : _prodInvariant('76') : void 0;

        var proto = Constructor.prototype;
        var autoBindPairs = proto.__reactAutoBindPairs;

        // By handling mixins before any other properties, we ensure the same
        // chaining order is applied to methods with DEFINE_MANY policy, whether
        // mixins are listed before or after these methods in the spec.
        if (spec.hasOwnProperty(MIXINS_KEY)) {
          RESERVED_SPEC_KEYS.mixins(Constructor, spec.mixins);
        }

        for (var name in spec) {
          if (!spec.hasOwnProperty(name)) {
            continue;
          }

          if (name === MIXINS_KEY) {
            // We have already handled mixins in a special case above.
            continue;
          }

          var property = spec[name];
          var isAlreadyDefined = proto.hasOwnProperty(name);
          validateMethodOverride(isAlreadyDefined, name);

          if (RESERVED_SPEC_KEYS.hasOwnProperty(name)) {
            RESERVED_SPEC_KEYS[name](Constructor, property);
          } else {
            // Setup methods on prototype:
            // The following member methods should not be automatically bound:
            // 1. Expected ReactClass methods (in the "interface").
            // 2. Overridden methods (that were mixed in).
            var isReactClassMethod = ReactClassInterface.hasOwnProperty(name);
            var isFunction = typeof property === 'function';
            var shouldAutoBind = isFunction && !isReactClassMethod && !isAlreadyDefined && spec.autobind !== false;

            if (shouldAutoBind) {
              autoBindPairs.push(name, property);
              proto[name] = property;
            } else {
              if (isAlreadyDefined) {
                var specPolicy = ReactClassInterface[name];

                // These cases should already be caught by validateMethodOverride.
                !(isReactClassMethod && (specPolicy === 'DEFINE_MANY_MERGED' || specPolicy === 'DEFINE_MANY')) ? "development" !== 'production' ? invariant(false, 'ReactClass: Unexpected spec policy %s for key %s when mixing in component specs.', specPolicy, name) : _prodInvariant('77', specPolicy, name) : void 0;

                // For methods which are defined more than once, call the existing
                // methods before calling the new property, merging if appropriate.
                if (specPolicy === 'DEFINE_MANY_MERGED') {
                  proto[name] = createMergedResultFunction(proto[name], property);
                } else if (specPolicy === 'DEFINE_MANY') {
                  proto[name] = createChainedFunction(proto[name], property);
                }
              } else {
                proto[name] = property;
                if ("development" !== 'production') {
                  // Add verbose displayName to the function, which helps when looking
                  // at profiling tools.
                  if (typeof property === 'function' && spec.displayName) {
                    proto[name].displayName = spec.displayName + '_' + name;
                  }
                }
              }
            }
          }
        }
      }

      function mixStaticSpecIntoComponent(Constructor, statics) {
        if (!statics) {
          return;
        }
        for (var name in statics) {
          var property = statics[name];
          if (!statics.hasOwnProperty(name)) {
            continue;
          }

          var isReserved = name in RESERVED_SPEC_KEYS;
          !!isReserved ? "development" !== 'production' ? invariant(false, 'ReactClass: You are attempting to define a reserved property, `%s`, that shouldn\'t be on the "statics" key. Define it as an instance property instead; it will still be accessible on the constructor.', name) : _prodInvariant('78', name) : void 0;

          var isInherited = name in Constructor;
          !!isInherited ? "development" !== 'production' ? invariant(false, 'ReactClass: You are attempting to define `%s` on your component more than once. This conflict may be due to a mixin.', name) : _prodInvariant('79', name) : void 0;
          Constructor[name] = property;
        }
      }

      /**
       * Merge two objects, but throw if both contain the same key.
       *
       * @param {object} one The first object, which is mutated.
       * @param {object} two The second object
       * @return {object} one after it has been mutated to contain everything in two.
       */
      function mergeIntoWithNoDuplicateKeys(one, two) {
        !(one && two && typeof one === 'object' && typeof two === 'object') ? "development" !== 'production' ? invariant(false, 'mergeIntoWithNoDuplicateKeys(): Cannot merge non-objects.') : _prodInvariant('80') : void 0;

        for (var key in two) {
          if (two.hasOwnProperty(key)) {
            !(one[key] === undefined) ? "development" !== 'production' ? invariant(false, 'mergeIntoWithNoDuplicateKeys(): Tried to merge two objects with the same key: `%s`. This conflict may be due to a mixin; in particular, this may be caused by two getInitialState() or getDefaultProps() methods returning objects with clashing keys.', key) : _prodInvariant('81', key) : void 0;
            one[key] = two[key];
          }
        }
        return one;
      }

      /**
       * Creates a function that invokes two functions and merges their return values.
       *
       * @param {function} one Function to invoke first.
       * @param {function} two Function to invoke second.
       * @return {function} Function that invokes the two argument functions.
       * @private
       */
      function createMergedResultFunction(one, two) {
        return function mergedResult() {
          var a = one.apply(this, arguments);
          var b = two.apply(this, arguments);
          if (a == null) {
            return b;
          } else if (b == null) {
            return a;
          }
          var c = {};
          mergeIntoWithNoDuplicateKeys(c, a);
          mergeIntoWithNoDuplicateKeys(c, b);
          return c;
        };
      }

      /**
       * Creates a function that invokes two functions and ignores their return vales.
       *
       * @param {function} one Function to invoke first.
       * @param {function} two Function to invoke second.
       * @return {function} Function that invokes the two argument functions.
       * @private
       */
      function createChainedFunction(one, two) {
        return function chainedFunction() {
          one.apply(this, arguments);
          two.apply(this, arguments);
        };
      }

      /**
       * Binds a method to the component.
       *
       * @param {object} component Component whose method is going to be bound.
       * @param {function} method Method to be bound.
       * @return {function} The bound method.
       */
      function bindAutoBindMethod(component, method) {
        var boundMethod = method.bind(component);
        if ("development" !== 'production') {
          boundMethod.__reactBoundContext = component;
          boundMethod.__reactBoundMethod = method;
          boundMethod.__reactBoundArguments = null;
          var componentName = component.constructor.displayName;
          var _bind = boundMethod.bind;
          boundMethod.bind = function (newThis) {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              args[_key - 1] = arguments[_key];
            }

            // User is trying to bind() an autobound method; we effectively will
            // ignore the value of "this" that the user is trying to use, so
            // let's warn.
            if (newThis !== component && newThis !== null) {
              "development" !== 'production' ? warning(false, 'bind(): React component methods may only be bound to the ' + 'component instance. See %s', componentName) : void 0;
            } else if (!args.length) {
              "development" !== 'production' ? warning(false, 'bind(): You are binding a component method to the component. ' + 'React does this for you automatically in a high-performance ' + 'way, so you can safely remove this call. See %s', componentName) : void 0;
              return boundMethod;
            }
            var reboundMethod = _bind.apply(boundMethod, arguments);
            reboundMethod.__reactBoundContext = component;
            reboundMethod.__reactBoundMethod = method;
            reboundMethod.__reactBoundArguments = args;
            return reboundMethod;
          };
        }
        return boundMethod;
      }

      /**
       * Binds all auto-bound methods in a component.
       *
       * @param {object} component Component whose method is going to be bound.
       */
      function bindAutoBindMethods(component) {
        var pairs = component.__reactAutoBindPairs;
        for (var i = 0; i < pairs.length; i += 2) {
          var autoBindKey = pairs[i];
          var method = pairs[i + 1];
          component[autoBindKey] = bindAutoBindMethod(component, method);
        }
      }

      /**
       * Add more to the ReactClass base class. These are all legacy features and
       * therefore not already part of the modern ReactComponent.
       */
      var ReactClassMixin = {

        /**
         * TODO: This will be deprecated because state should always keep a consistent
         * type signature and the only use case for this, is to avoid that.
         */
        replaceState: function (newState, callback) {
          this.updater.enqueueReplaceState(this, newState);
          if (callback) {
            this.updater.enqueueCallback(this, callback, 'replaceState');
          }
        },

        /**
         * Checks whether or not this composite component is mounted.
         * @return {boolean} True if mounted, false otherwise.
         * @protected
         * @final
         */
        isMounted: function () {
          return this.updater.isMounted(this);
        }
      };

      var ReactClassComponent = function () {};
      _assign(ReactClassComponent.prototype, ReactComponent.prototype, ReactClassMixin);

      var didWarnDeprecated = false;

      /**
       * Module for creating composite components.
       *
       * @class ReactClass
       */
      var ReactClass = {

        /**
         * Creates a composite component class given a class specification.
         * See https://facebook.github.io/react/docs/top-level-api.html#react.createclass
         *
         * @param {object} spec Class specification (which must define `render`).
         * @return {function} Component constructor function.
         * @public
         */
        createClass: function (spec) {
          if ("development" !== 'production') {
            "development" !== 'production' ? warning(didWarnDeprecated, '%s: React.createClass is deprecated and will be removed in version 16. ' + 'Use plain JavaScript classes instead. If you\'re not yet ready to ' + 'migrate, create-react-class is available on npm as a ' + 'drop-in replacement.', spec && spec.displayName || 'A Component') : void 0;
            didWarnDeprecated = true;
          }

          // To keep our warnings more understandable, we'll use a little hack here to
          // ensure that Constructor.name !== 'Constructor'. This makes sure we don't
          // unnecessarily identify a class without displayName as 'Constructor'.
          var Constructor = identity(function (props, context, updater) {
            // This constructor gets overridden by mocks. The argument is used
            // by mocks to assert on what gets mounted.

            if ("development" !== 'production') {
              "development" !== 'production' ? warning(this instanceof Constructor, 'Something is calling a React component directly. Use a factory or ' + 'JSX instead. See: https://fb.me/react-legacyfactory') : void 0;
            }

            // Wire up auto-binding
            if (this.__reactAutoBindPairs.length) {
              bindAutoBindMethods(this);
            }

            this.props = props;
            this.context = context;
            this.refs = emptyObject;
            this.updater = updater || ReactNoopUpdateQueue;

            this.state = null;

            // ReactClasses doesn't have constructors. Instead, they use the
            // getInitialState and componentWillMount methods for initialization.

            var initialState = this.getInitialState ? this.getInitialState() : null;
            if ("development" !== 'production') {
              // We allow auto-mocks to proceed as if they're returning null.
              if (initialState === undefined && this.getInitialState._isMockFunction) {
                // This is probably bad practice. Consider warning here and
                // deprecating this convenience.
                initialState = null;
              }
            }
            !(typeof initialState === 'object' && !Array.isArray(initialState)) ? "development" !== 'production' ? invariant(false, '%s.getInitialState(): must return an object or null', Constructor.displayName || 'ReactCompositeComponent') : _prodInvariant('82', Constructor.displayName || 'ReactCompositeComponent') : void 0;

            this.state = initialState;
          });
          Constructor.prototype = new ReactClassComponent();
          Constructor.prototype.constructor = Constructor;
          Constructor.prototype.__reactAutoBindPairs = [];

          injectedMixins.forEach(mixSpecIntoComponent.bind(null, Constructor));

          mixSpecIntoComponent(Constructor, spec);

          // Initialize the defaultProps property after all mixins have been merged.
          if (Constructor.getDefaultProps) {
            Constructor.defaultProps = Constructor.getDefaultProps();
          }

          if ("development" !== 'production') {
            // This is a tag to indicate that the use of these method names is ok,
            // since it's used with createClass. If it's not, then it's likely a
            // mistake so we'll warn you to use the static property, property
            // initializer or constructor respectively.
            if (Constructor.getDefaultProps) {
              Constructor.getDefaultProps.isReactClassApproved = {};
            }
            if (Constructor.prototype.getInitialState) {
              Constructor.prototype.getInitialState.isReactClassApproved = {};
            }
          }

          !Constructor.prototype.render ? "development" !== 'production' ? invariant(false, 'createClass(...): Class specification must implement a `render` method.') : _prodInvariant('83') : void 0;

          if ("development" !== 'production') {
            "development" !== 'production' ? warning(!Constructor.prototype.componentShouldUpdate, '%s has a method called ' + 'componentShouldUpdate(). Did you mean shouldComponentUpdate()? ' + 'The name is phrased as a question because the function is ' + 'expected to return a value.', spec.displayName || 'A component') : void 0;
            "development" !== 'production' ? warning(!Constructor.prototype.componentWillRecieveProps, '%s has a method called ' + 'componentWillRecieveProps(). Did you mean componentWillReceiveProps()?', spec.displayName || 'A component') : void 0;
          }

          // Reduce time spent doing lookups by setting these on the prototype.
          for (var methodName in ReactClassInterface) {
            if (!Constructor.prototype[methodName]) {
              Constructor.prototype[methodName] = null;
            }
          }

          return Constructor;
        },

        injection: {
          injectMixin: function (mixin) {
            injectedMixins.push(mixin);
          }
        }

      };

      module.exports = ReactClass;
    }, { "10": 10, "13": 13, "14": 14, "25": 25, "28": 28, "29": 29, "30": 30, "31": 31, "6": 6 }], 6: [function (_dereq_, module, exports) {
      /**
       * Copyright 2013-present, Facebook, Inc.
       * All rights reserved.
       *
       * This source code is licensed under the BSD-style license found in the
       * LICENSE file in the root directory of this source tree. An additional grant
       * of patent rights can be found in the PATENTS file in the same directory.
       *
       */

      'use strict';

      var _prodInvariant = _dereq_(25);

      var ReactNoopUpdateQueue = _dereq_(13);

      var canDefineProperty = _dereq_(20);
      var emptyObject = _dereq_(28);
      var invariant = _dereq_(29);
      var warning = _dereq_(30);

      /**
       * Base class helpers for the updating state of a component.
       */
      function ReactComponent(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        // We initialize the default updater but the real one gets injected by the
        // renderer.
        this.updater = updater || ReactNoopUpdateQueue;
      }

      ReactComponent.prototype.isReactComponent = {};

      /**
       * Sets a subset of the state. Always use this to mutate
       * state. You should treat `this.state` as immutable.
       *
       * There is no guarantee that `this.state` will be immediately updated, so
       * accessing `this.state` after calling this method may return the old value.
       *
       * There is no guarantee that calls to `setState` will run synchronously,
       * as they may eventually be batched together.  You can provide an optional
       * callback that will be executed when the call to setState is actually
       * completed.
       *
       * When a function is provided to setState, it will be called at some point in
       * the future (not synchronously). It will be called with the up to date
       * component arguments (state, props, context). These values can be different
       * from this.* because your function may be called after receiveProps but before
       * shouldComponentUpdate, and this new state, props, and context will not yet be
       * assigned to this.
       *
       * @param {object|function} partialState Next partial state or function to
       *        produce next partial state to be merged with current state.
       * @param {?function} callback Called after state is updated.
       * @final
       * @protected
       */
      ReactComponent.prototype.setState = function (partialState, callback) {
        !(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null) ? "development" !== 'production' ? invariant(false, 'setState(...): takes an object of state variables to update or a function which returns an object of state variables.') : _prodInvariant('85') : void 0;
        this.updater.enqueueSetState(this, partialState);
        if (callback) {
          this.updater.enqueueCallback(this, callback, 'setState');
        }
      };

      /**
       * Forces an update. This should only be invoked when it is known with
       * certainty that we are **not** in a DOM transaction.
       *
       * You may want to call this when you know that some deeper aspect of the
       * component's state has changed but `setState` was not called.
       *
       * This will not invoke `shouldComponentUpdate`, but it will invoke
       * `componentWillUpdate` and `componentDidUpdate`.
       *
       * @param {?function} callback Called after update is complete.
       * @final
       * @protected
       */
      ReactComponent.prototype.forceUpdate = function (callback) {
        this.updater.enqueueForceUpdate(this);
        if (callback) {
          this.updater.enqueueCallback(this, callback, 'forceUpdate');
        }
      };

      /**
       * Deprecated APIs. These APIs used to exist on classic React classes but since
       * we would like to deprecate them, we're not going to move them over to this
       * modern base class. Instead, we define a getter that warns if it's accessed.
       */
      if ("development" !== 'production') {
        var deprecatedAPIs = {
          isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
          replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
        };
        var defineDeprecationWarning = function (methodName, info) {
          if (canDefineProperty) {
            Object.defineProperty(ReactComponent.prototype, methodName, {
              get: function () {
                "development" !== 'production' ? warning(false, '%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]) : void 0;
                return undefined;
              }
            });
          }
        };
        for (var fnName in deprecatedAPIs) {
          if (deprecatedAPIs.hasOwnProperty(fnName)) {
            defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
          }
        }
      }

      module.exports = ReactComponent;
    }, { "13": 13, "20": 20, "25": 25, "28": 28, "29": 29, "30": 30 }], 7: [function (_dereq_, module, exports) {
      /**
       * Copyright 2016-present, Facebook, Inc.
       * All rights reserved.
       *
       * This source code is licensed under the BSD-style license found in the
       * LICENSE file in the root directory of this source tree. An additional grant
       * of patent rights can be found in the PATENTS file in the same directory.
       *
       * 
       */

      'use strict';

      var _prodInvariant = _dereq_(25);

      var ReactCurrentOwner = _dereq_(8);

      var invariant = _dereq_(29);
      var warning = _dereq_(30);

      function isNative(fn) {
        // Based on isNative() from Lodash
        var funcToString = Function.prototype.toString;
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        var reIsNative = RegExp('^' + funcToString
        // Take an example native function source for comparison
        .call(hasOwnProperty)
        // Strip regex characters so we can use it for regex
        .replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
        // Remove hasOwnProperty from the template to make it generic
        .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
        try {
          var source = funcToString.call(fn);
          return reIsNative.test(source);
        } catch (err) {
          return false;
        }
      }

      var canUseCollections =
      // Array.from
      typeof Array.from === 'function' &&
      // Map
      typeof Map === 'function' && isNative(Map) &&
      // Map.prototype.keys
      Map.prototype != null && typeof Map.prototype.keys === 'function' && isNative(Map.prototype.keys) &&
      // Set
      typeof Set === 'function' && isNative(Set) &&
      // Set.prototype.keys
      Set.prototype != null && typeof Set.prototype.keys === 'function' && isNative(Set.prototype.keys);

      var setItem;
      var getItem;
      var removeItem;
      var getItemIDs;
      var addRoot;
      var removeRoot;
      var getRootIDs;

      if (canUseCollections) {
        var itemMap = new Map();
        var rootIDSet = new Set();

        setItem = function (id, item) {
          itemMap.set(id, item);
        };
        getItem = function (id) {
          return itemMap.get(id);
        };
        removeItem = function (id) {
          itemMap['delete'](id);
        };
        getItemIDs = function () {
          return Array.from(itemMap.keys());
        };

        addRoot = function (id) {
          rootIDSet.add(id);
        };
        removeRoot = function (id) {
          rootIDSet['delete'](id);
        };
        getRootIDs = function () {
          return Array.from(rootIDSet.keys());
        };
      } else {
        var itemByKey = {};
        var rootByKey = {};

        // Use non-numeric keys to prevent V8 performance issues:
        // https://github.com/facebook/react/pull/7232
        var getKeyFromID = function (id) {
          return '.' + id;
        };
        var getIDFromKey = function (key) {
          return parseInt(key.substr(1), 10);
        };

        setItem = function (id, item) {
          var key = getKeyFromID(id);
          itemByKey[key] = item;
        };
        getItem = function (id) {
          var key = getKeyFromID(id);
          return itemByKey[key];
        };
        removeItem = function (id) {
          var key = getKeyFromID(id);
          delete itemByKey[key];
        };
        getItemIDs = function () {
          return Object.keys(itemByKey).map(getIDFromKey);
        };

        addRoot = function (id) {
          var key = getKeyFromID(id);
          rootByKey[key] = true;
        };
        removeRoot = function (id) {
          var key = getKeyFromID(id);
          delete rootByKey[key];
        };
        getRootIDs = function () {
          return Object.keys(rootByKey).map(getIDFromKey);
        };
      }

      var unmountedIDs = [];

      function purgeDeep(id) {
        var item = getItem(id);
        if (item) {
          var childIDs = item.childIDs;

          removeItem(id);
          childIDs.forEach(purgeDeep);
        }
      }

      function describeComponentFrame(name, source, ownerName) {
        return '\n    in ' + (name || 'Unknown') + (source ? ' (at ' + source.fileName.replace(/^.*[\\\/]/, '') + ':' + source.lineNumber + ')' : ownerName ? ' (created by ' + ownerName + ')' : '');
      }

      function getDisplayName(element) {
        if (element == null) {
          return '#empty';
        } else if (typeof element === 'string' || typeof element === 'number') {
          return '#text';
        } else if (typeof element.type === 'string') {
          return element.type;
        } else {
          return element.type.displayName || element.type.name || 'Unknown';
        }
      }

      function describeID(id) {
        var name = ReactComponentTreeHook.getDisplayName(id);
        var element = ReactComponentTreeHook.getElement(id);
        var ownerID = ReactComponentTreeHook.getOwnerID(id);
        var ownerName;
        if (ownerID) {
          ownerName = ReactComponentTreeHook.getDisplayName(ownerID);
        }
        "development" !== 'production' ? warning(element, 'ReactComponentTreeHook: Missing React element for debugID %s when ' + 'building stack', id) : void 0;
        return describeComponentFrame(name, element && element._source, ownerName);
      }

      var ReactComponentTreeHook = {
        onSetChildren: function (id, nextChildIDs) {
          var item = getItem(id);
          !item ? "development" !== 'production' ? invariant(false, 'Item must have been set') : _prodInvariant('144') : void 0;
          item.childIDs = nextChildIDs;

          for (var i = 0; i < nextChildIDs.length; i++) {
            var nextChildID = nextChildIDs[i];
            var nextChild = getItem(nextChildID);
            !nextChild ? "development" !== 'production' ? invariant(false, 'Expected hook events to fire for the child before its parent includes it in onSetChildren().') : _prodInvariant('140') : void 0;
            !(nextChild.childIDs != null || typeof nextChild.element !== 'object' || nextChild.element == null) ? "development" !== 'production' ? invariant(false, 'Expected onSetChildren() to fire for a container child before its parent includes it in onSetChildren().') : _prodInvariant('141') : void 0;
            !nextChild.isMounted ? "development" !== 'production' ? invariant(false, 'Expected onMountComponent() to fire for the child before its parent includes it in onSetChildren().') : _prodInvariant('71') : void 0;
            if (nextChild.parentID == null) {
              nextChild.parentID = id;
              // TODO: This shouldn't be necessary but mounting a new root during in
              // componentWillMount currently causes not-yet-mounted components to
              // be purged from our tree data so their parent id is missing.
            }
            !(nextChild.parentID === id) ? "development" !== 'production' ? invariant(false, 'Expected onBeforeMountComponent() parent and onSetChildren() to be consistent (%s has parents %s and %s).', nextChildID, nextChild.parentID, id) : _prodInvariant('142', nextChildID, nextChild.parentID, id) : void 0;
          }
        },
        onBeforeMountComponent: function (id, element, parentID) {
          var item = {
            element: element,
            parentID: parentID,
            text: null,
            childIDs: [],
            isMounted: false,
            updateCount: 0
          };
          setItem(id, item);
        },
        onBeforeUpdateComponent: function (id, element) {
          var item = getItem(id);
          if (!item || !item.isMounted) {
            // We may end up here as a result of setState() in componentWillUnmount().
            // In this case, ignore the element.
            return;
          }
          item.element = element;
        },
        onMountComponent: function (id) {
          var item = getItem(id);
          !item ? "development" !== 'production' ? invariant(false, 'Item must have been set') : _prodInvariant('144') : void 0;
          item.isMounted = true;
          var isRoot = item.parentID === 0;
          if (isRoot) {
            addRoot(id);
          }
        },
        onUpdateComponent: function (id) {
          var item = getItem(id);
          if (!item || !item.isMounted) {
            // We may end up here as a result of setState() in componentWillUnmount().
            // In this case, ignore the element.
            return;
          }
          item.updateCount++;
        },
        onUnmountComponent: function (id) {
          var item = getItem(id);
          if (item) {
            // We need to check if it exists.
            // `item` might not exist if it is inside an error boundary, and a sibling
            // error boundary child threw while mounting. Then this instance never
            // got a chance to mount, but it still gets an unmounting event during
            // the error boundary cleanup.
            item.isMounted = false;
            var isRoot = item.parentID === 0;
            if (isRoot) {
              removeRoot(id);
            }
          }
          unmountedIDs.push(id);
        },
        purgeUnmountedComponents: function () {
          if (ReactComponentTreeHook._preventPurging) {
            // Should only be used for testing.
            return;
          }

          for (var i = 0; i < unmountedIDs.length; i++) {
            var id = unmountedIDs[i];
            purgeDeep(id);
          }
          unmountedIDs.length = 0;
        },
        isMounted: function (id) {
          var item = getItem(id);
          return item ? item.isMounted : false;
        },
        getCurrentStackAddendum: function (topElement) {
          var info = '';
          if (topElement) {
            var name = getDisplayName(topElement);
            var owner = topElement._owner;
            info += describeComponentFrame(name, topElement._source, owner && owner.getName());
          }

          var currentOwner = ReactCurrentOwner.current;
          var id = currentOwner && currentOwner._debugID;

          info += ReactComponentTreeHook.getStackAddendumByID(id);
          return info;
        },
        getStackAddendumByID: function (id) {
          var info = '';
          while (id) {
            info += describeID(id);
            id = ReactComponentTreeHook.getParentID(id);
          }
          return info;
        },
        getChildIDs: function (id) {
          var item = getItem(id);
          return item ? item.childIDs : [];
        },
        getDisplayName: function (id) {
          var element = ReactComponentTreeHook.getElement(id);
          if (!element) {
            return null;
          }
          return getDisplayName(element);
        },
        getElement: function (id) {
          var item = getItem(id);
          return item ? item.element : null;
        },
        getOwnerID: function (id) {
          var element = ReactComponentTreeHook.getElement(id);
          if (!element || !element._owner) {
            return null;
          }
          return element._owner._debugID;
        },
        getParentID: function (id) {
          var item = getItem(id);
          return item ? item.parentID : null;
        },
        getSource: function (id) {
          var item = getItem(id);
          var element = item ? item.element : null;
          var source = element != null ? element._source : null;
          return source;
        },
        getText: function (id) {
          var element = ReactComponentTreeHook.getElement(id);
          if (typeof element === 'string') {
            return element;
          } else if (typeof element === 'number') {
            return '' + element;
          } else {
            return null;
          }
        },
        getUpdateCount: function (id) {
          var item = getItem(id);
          return item ? item.updateCount : 0;
        },

        getRootIDs: getRootIDs,
        getRegisteredIDs: getItemIDs
      };

      module.exports = ReactComponentTreeHook;
    }, { "25": 25, "29": 29, "30": 30, "8": 8 }], 8: [function (_dereq_, module, exports) {
      /**
       * Copyright 2013-present, Facebook, Inc.
       * All rights reserved.
       *
       * This source code is licensed under the BSD-style license found in the
       * LICENSE file in the root directory of this source tree. An additional grant
       * of patent rights can be found in the PATENTS file in the same directory.
       *
       * 
       */

      'use strict';

      /**
       * Keeps track of the current owner.
       *
       * The current owner is the component who should own any components that are
       * currently being constructed.
       */

      var ReactCurrentOwner = {

        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null

      };

      module.exports = ReactCurrentOwner;
    }, {}], 9: [function (_dereq_, module, exports) {
      /**
       * Copyright 2013-present, Facebook, Inc.
       * All rights reserved.
       *
       * This source code is licensed under the BSD-style license found in the
       * LICENSE file in the root directory of this source tree. An additional grant
       * of patent rights can be found in the PATENTS file in the same directory.
       *
       */

      'use strict';

      var ReactElement = _dereq_(10);

      /**
       * Create a factory that creates HTML tag elements.
       *
       * @private
       */
      var createDOMFactory = ReactElement.createFactory;
      if ("development" !== 'production') {
        var ReactElementValidator = _dereq_(12);
        createDOMFactory = ReactElementValidator.createFactory;
      }

      /**
       * Creates a mapping from supported HTML tags to `ReactDOMComponent` classes.
       * This is also accessible via `React.DOM`.
       *
       * @public
       */
      var ReactDOMFactories = {
        a: createDOMFactory('a'),
        abbr: createDOMFactory('abbr'),
        address: createDOMFactory('address'),
        area: createDOMFactory('area'),
        article: createDOMFactory('article'),
        aside: createDOMFactory('aside'),
        audio: createDOMFactory('audio'),
        b: createDOMFactory('b'),
        base: createDOMFactory('base'),
        bdi: createDOMFactory('bdi'),
        bdo: createDOMFactory('bdo'),
        big: createDOMFactory('big'),
        blockquote: createDOMFactory('blockquote'),
        body: createDOMFactory('body'),
        br: createDOMFactory('br'),
        button: createDOMFactory('button'),
        canvas: createDOMFactory('canvas'),
        caption: createDOMFactory('caption'),
        cite: createDOMFactory('cite'),
        code: createDOMFactory('code'),
        col: createDOMFactory('col'),
        colgroup: createDOMFactory('colgroup'),
        data: createDOMFactory('data'),
        datalist: createDOMFactory('datalist'),
        dd: createDOMFactory('dd'),
        del: createDOMFactory('del'),
        details: createDOMFactory('details'),
        dfn: createDOMFactory('dfn'),
        dialog: createDOMFactory('dialog'),
        div: createDOMFactory('div'),
        dl: createDOMFactory('dl'),
        dt: createDOMFactory('dt'),
        em: createDOMFactory('em'),
        embed: createDOMFactory('embed'),
        fieldset: createDOMFactory('fieldset'),
        figcaption: createDOMFactory('figcaption'),
        figure: createDOMFactory('figure'),
        footer: createDOMFactory('footer'),
        form: createDOMFactory('form'),
        h1: createDOMFactory('h1'),
        h2: createDOMFactory('h2'),
        h3: createDOMFactory('h3'),
        h4: createDOMFactory('h4'),
        h5: createDOMFactory('h5'),
        h6: createDOMFactory('h6'),
        head: createDOMFactory('head'),
        header: createDOMFactory('header'),
        hgroup: createDOMFactory('hgroup'),
        hr: createDOMFactory('hr'),
        html: createDOMFactory('html'),
        i: createDOMFactory('i'),
        iframe: createDOMFactory('iframe'),
        img: createDOMFactory('img'),
        input: createDOMFactory('input'),
        ins: createDOMFactory('ins'),
        kbd: createDOMFactory('kbd'),
        keygen: createDOMFactory('keygen'),
        label: createDOMFactory('label'),
        legend: createDOMFactory('legend'),
        li: createDOMFactory('li'),
        link: createDOMFactory('link'),
        main: createDOMFactory('main'),
        map: createDOMFactory('map'),
        mark: createDOMFactory('mark'),
        menu: createDOMFactory('menu'),
        menuitem: createDOMFactory('menuitem'),
        meta: createDOMFactory('meta'),
        meter: createDOMFactory('meter'),
        nav: createDOMFactory('nav'),
        noscript: createDOMFactory('noscript'),
        object: createDOMFactory('object'),
        ol: createDOMFactory('ol'),
        optgroup: createDOMFactory('optgroup'),
        option: createDOMFactory('option'),
        output: createDOMFactory('output'),
        p: createDOMFactory('p'),
        param: createDOMFactory('param'),
        picture: createDOMFactory('picture'),
        pre: createDOMFactory('pre'),
        progress: createDOMFactory('progress'),
        q: createDOMFactory('q'),
        rp: createDOMFactory('rp'),
        rt: createDOMFactory('rt'),
        ruby: createDOMFactory('ruby'),
        s: createDOMFactory('s'),
        samp: createDOMFactory('samp'),
        script: createDOMFactory('script'),
        section: createDOMFactory('section'),
        select: createDOMFactory('select'),
        small: createDOMFactory('small'),
        source: createDOMFactory('source'),
        span: createDOMFactory('span'),
        strong: createDOMFactory('strong'),
        style: createDOMFactory('style'),
        sub: createDOMFactory('sub'),
        summary: createDOMFactory('summary'),
        sup: createDOMFactory('sup'),
        table: createDOMFactory('table'),
        tbody: createDOMFactory('tbody'),
        td: createDOMFactory('td'),
        textarea: createDOMFactory('textarea'),
        tfoot: createDOMFactory('tfoot'),
        th: createDOMFactory('th'),
        thead: createDOMFactory('thead'),
        time: createDOMFactory('time'),
        title: createDOMFactory('title'),
        tr: createDOMFactory('tr'),
        track: createDOMFactory('track'),
        u: createDOMFactory('u'),
        ul: createDOMFactory('ul'),
        'var': createDOMFactory('var'),
        video: createDOMFactory('video'),
        wbr: createDOMFactory('wbr'),

        // SVG
        circle: createDOMFactory('circle'),
        clipPath: createDOMFactory('clipPath'),
        defs: createDOMFactory('defs'),
        ellipse: createDOMFactory('ellipse'),
        g: createDOMFactory('g'),
        image: createDOMFactory('image'),
        line: createDOMFactory('line'),
        linearGradient: createDOMFactory('linearGradient'),
        mask: createDOMFactory('mask'),
        path: createDOMFactory('path'),
        pattern: createDOMFactory('pattern'),
        polygon: createDOMFactory('polygon'),
        polyline: createDOMFactory('polyline'),
        radialGradient: createDOMFactory('radialGradient'),
        rect: createDOMFactory('rect'),
        stop: createDOMFactory('stop'),
        svg: createDOMFactory('svg'),
        text: createDOMFactory('text'),
        tspan: createDOMFactory('tspan')
      };

      module.exports = ReactDOMFactories;
    }, { "10": 10, "12": 12 }], 10: [function (_dereq_, module, exports) {
      /**
       * Copyright 2014-present, Facebook, Inc.
       * All rights reserved.
       *
       * This source code is licensed under the BSD-style license found in the
       * LICENSE file in the root directory of this source tree. An additional grant
       * of patent rights can be found in the PATENTS file in the same directory.
       *
       */

      'use strict';

      var _assign = _dereq_(31);

      var ReactCurrentOwner = _dereq_(8);

      var warning = _dereq_(30);
      var canDefineProperty = _dereq_(20);
      var hasOwnProperty = Object.prototype.hasOwnProperty;

      var REACT_ELEMENT_TYPE = _dereq_(11);

      var RESERVED_PROPS = {
        key: true,
        ref: true,
        __self: true,
        __source: true
      };

      var specialPropKeyWarningShown, specialPropRefWarningShown;

      function hasValidRef(config) {
        if ("development" !== 'production') {
          if (hasOwnProperty.call(config, 'ref')) {
            var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;
            if (getter && getter.isReactWarning) {
              return false;
            }
          }
        }
        return config.ref !== undefined;
      }

      function hasValidKey(config) {
        if ("development" !== 'production') {
          if (hasOwnProperty.call(config, 'key')) {
            var getter = Object.getOwnPropertyDescriptor(config, 'key').get;
            if (getter && getter.isReactWarning) {
              return false;
            }
          }
        }
        return config.key !== undefined;
      }

      function defineKeyPropWarningGetter(props, displayName) {
        var warnAboutAccessingKey = function () {
          if (!specialPropKeyWarningShown) {
            specialPropKeyWarningShown = true;
            "development" !== 'production' ? warning(false, '%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName) : void 0;
          }
        };
        warnAboutAccessingKey.isReactWarning = true;
        Object.defineProperty(props, 'key', {
          get: warnAboutAccessingKey,
          configurable: true
        });
      }

      function defineRefPropWarningGetter(props, displayName) {
        var warnAboutAccessingRef = function () {
          if (!specialPropRefWarningShown) {
            specialPropRefWarningShown = true;
            "development" !== 'production' ? warning(false, '%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName) : void 0;
          }
        };
        warnAboutAccessingRef.isReactWarning = true;
        Object.defineProperty(props, 'ref', {
          get: warnAboutAccessingRef,
          configurable: true
        });
      }

      /**
       * Factory method to create a new React element. This no longer adheres to
       * the class pattern, so do not use new to call it. Also, no instanceof check
       * will work. Instead test $$typeof field against Symbol.for('react.element') to check
       * if something is a React Element.
       *
       * @param {*} type
       * @param {*} key
       * @param {string|object} ref
       * @param {*} self A *temporary* helper to detect places where `this` is
       * different from the `owner` when React.createElement is called, so that we
       * can warn. We want to get rid of owner and replace string `ref`s with arrow
       * functions, and as long as `this` and owner are the same, there will be no
       * change in behavior.
       * @param {*} source An annotation object (added by a transpiler or otherwise)
       * indicating filename, line number, and/or other information.
       * @param {*} owner
       * @param {*} props
       * @internal
       */
      var ReactElement = function (type, key, ref, self, source, owner, props) {
        var element = {
          // This tag allow us to uniquely identify this as a React Element
          $$typeof: REACT_ELEMENT_TYPE,

          // Built-in properties that belong on the element
          type: type,
          key: key,
          ref: ref,
          props: props,

          // Record the component responsible for creating this element.
          _owner: owner
        };

        if ("development" !== 'production') {
          // The validation flag is currently mutative. We put it on
          // an external backing store so that we can freeze the whole object.
          // This can be replaced with a WeakMap once they are implemented in
          // commonly used development environments.
          element._store = {};

          // To make comparing ReactElements easier for testing purposes, we make
          // the validation flag non-enumerable (where possible, which should
          // include every environment we run tests in), so the test framework
          // ignores it.
          if (canDefineProperty) {
            Object.defineProperty(element._store, 'validated', {
              configurable: false,
              enumerable: false,
              writable: true,
              value: false
            });
            // self and source are DEV only properties.
            Object.defineProperty(element, '_self', {
              configurable: false,
              enumerable: false,
              writable: false,
              value: self
            });
            // Two elements created in two different places should be considered
            // equal for testing purposes and therefore we hide it from enumeration.
            Object.defineProperty(element, '_source', {
              configurable: false,
              enumerable: false,
              writable: false,
              value: source
            });
          } else {
            element._store.validated = false;
            element._self = self;
            element._source = source;
          }
          if (Object.freeze) {
            Object.freeze(element.props);
            Object.freeze(element);
          }
        }

        return element;
      };

      /**
       * Create and return a new ReactElement of the given type.
       * See https://facebook.github.io/react/docs/top-level-api.html#react.createelement
       */
      ReactElement.createElement = function (type, config, children) {
        var propName;

        // Reserved names are extracted
        var props = {};

        var key = null;
        var ref = null;
        var self = null;
        var source = null;

        if (config != null) {
          if (hasValidRef(config)) {
            ref = config.ref;
          }
          if (hasValidKey(config)) {
            key = '' + config.key;
          }

          self = config.__self === undefined ? null : config.__self;
          source = config.__source === undefined ? null : config.__source;
          // Remaining properties are added to a new props object
          for (propName in config) {
            if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
              props[propName] = config[propName];
            }
          }
        }

        // Children can be more than one argument, and those are transferred onto
        // the newly allocated props object.
        var childrenLength = arguments.length - 2;
        if (childrenLength === 1) {
          props.children = children;
        } else if (childrenLength > 1) {
          var childArray = Array(childrenLength);
          for (var i = 0; i < childrenLength; i++) {
            childArray[i] = arguments[i + 2];
          }
          if ("development" !== 'production') {
            if (Object.freeze) {
              Object.freeze(childArray);
            }
          }
          props.children = childArray;
        }

        // Resolve default props
        if (type && type.defaultProps) {
          var defaultProps = type.defaultProps;
          for (propName in defaultProps) {
            if (props[propName] === undefined) {
              props[propName] = defaultProps[propName];
            }
          }
        }
        if ("development" !== 'production') {
          if (key || ref) {
            if (typeof props.$$typeof === 'undefined' || props.$$typeof !== REACT_ELEMENT_TYPE) {
              var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
              if (key) {
                defineKeyPropWarningGetter(props, displayName);
              }
              if (ref) {
                defineRefPropWarningGetter(props, displayName);
              }
            }
          }
        }
        return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
      };

      /**
       * Return a function that produces ReactElements of a given type.
       * See https://facebook.github.io/react/docs/top-level-api.html#react.createfactory
       */
      ReactElement.createFactory = function (type) {
        var factory = ReactElement.createElement.bind(null, type);
        // Expose the type on the factory and the prototype so that it can be
        // easily accessed on elements. E.g. `<Foo />.type === Foo`.
        // This should not be named `constructor` since this may not be the function
        // that created the element, and it may not even be a constructor.
        // Legacy hook TODO: Warn if this is accessed
        factory.type = type;
        return factory;
      };

      ReactElement.cloneAndReplaceKey = function (oldElement, newKey) {
        var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);

        return newElement;
      };

      /**
       * Clone and return a new ReactElement using element as the starting point.
       * See https://facebook.github.io/react/docs/top-level-api.html#react.cloneelement
       */
      ReactElement.cloneElement = function (element, config, children) {
        var propName;

        // Original props are copied
        var props = _assign({}, element.props);

        // Reserved names are extracted
        var key = element.key;
        var ref = element.ref;
        // Self is preserved since the owner is preserved.
        var self = element._self;
        // Source is preserved since cloneElement is unlikely to be targeted by a
        // transpiler, and the original source is probably a better indicator of the
        // true owner.
        var source = element._source;

        // Owner will be preserved, unless ref is overridden
        var owner = element._owner;

        if (config != null) {
          if (hasValidRef(config)) {
            // Silently steal the ref from the parent.
            ref = config.ref;
            owner = ReactCurrentOwner.current;
          }
          if (hasValidKey(config)) {
            key = '' + config.key;
          }

          // Remaining properties override existing props
          var defaultProps;
          if (element.type && element.type.defaultProps) {
            defaultProps = element.type.defaultProps;
          }
          for (propName in config) {
            if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
              if (config[propName] === undefined && defaultProps !== undefined) {
                // Resolve default props
                props[propName] = defaultProps[propName];
              } else {
                props[propName] = config[propName];
              }
            }
          }
        }

        // Children can be more than one argument, and those are transferred onto
        // the newly allocated props object.
        var childrenLength = arguments.length - 2;
        if (childrenLength === 1) {
          props.children = children;
        } else if (childrenLength > 1) {
          var childArray = Array(childrenLength);
          for (var i = 0; i < childrenLength; i++) {
            childArray[i] = arguments[i + 2];
          }
          props.children = childArray;
        }

        return ReactElement(element.type, key, ref, self, source, owner, props);
      };

      /**
       * Verifies the object is a ReactElement.
       * See https://facebook.github.io/react/docs/top-level-api.html#react.isvalidelement
       * @param {?object} object
       * @return {boolean} True if `object` is a valid component.
       * @final
       */
      ReactElement.isValidElement = function (object) {
        return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
      };

      module.exports = ReactElement;
    }, { "11": 11, "20": 20, "30": 30, "31": 31, "8": 8 }], 11: [function (_dereq_, module, exports) {
      /**
       * Copyright 2014-present, Facebook, Inc.
       * All rights reserved.
       *
       * This source code is licensed under the BSD-style license found in the
       * LICENSE file in the root directory of this source tree. An additional grant
       * of patent rights can be found in the PATENTS file in the same directory.
       *
       * 
       */

      'use strict';

      // The Symbol used to tag the ReactElement type. If there is no native Symbol
      // nor polyfill, then a plain number is used for performance.

      var REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol['for'] && Symbol['for']('react.element') || 0xeac7;

      module.exports = REACT_ELEMENT_TYPE;
    }, {}], 12: [function (_dereq_, module, exports) {
      /**
       * Copyright 2014-present, Facebook, Inc.
       * All rights reserved.
       *
       * This source code is licensed under the BSD-style license found in the
       * LICENSE file in the root directory of this source tree. An additional grant
       * of patent rights can be found in the PATENTS file in the same directory.
       *
       */

      /**
       * ReactElementValidator provides a wrapper around a element factory
       * which validates the props passed to the element. This is intended to be
       * used only in DEV and could be replaced by a static type checker for languages
       * that support it.
       */

      'use strict';

      var ReactCurrentOwner = _dereq_(8);
      var ReactComponentTreeHook = _dereq_(7);
      var ReactElement = _dereq_(10);

      var checkReactTypeSpec = _dereq_(21);

      var canDefineProperty = _dereq_(20);
      var getIteratorFn = _dereq_(22);
      var warning = _dereq_(30);

      function getDeclarationErrorAddendum() {
        if (ReactCurrentOwner.current) {
          var name = ReactCurrentOwner.current.getName();
          if (name) {
            return ' Check the render method of `' + name + '`.';
          }
        }
        return '';
      }

      function getSourceInfoErrorAddendum(elementProps) {
        if (elementProps !== null && elementProps !== undefined && elementProps.__source !== undefined) {
          var source = elementProps.__source;
          var fileName = source.fileName.replace(/^.*[\\\/]/, '');
          var lineNumber = source.lineNumber;
          return ' Check your code at ' + fileName + ':' + lineNumber + '.';
        }
        return '';
      }

      /**
       * Warn if there's no key explicitly set on dynamic arrays of children or
       * object keys are not valid. This allows us to keep track of children between
       * updates.
       */
      var ownerHasKeyUseWarning = {};

      function getCurrentComponentErrorInfo(parentType) {
        var info = getDeclarationErrorAddendum();

        if (!info) {
          var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;
          if (parentName) {
            info = ' Check the top-level render call using <' + parentName + '>.';
          }
        }
        return info;
      }

      /**
       * Warn if the element doesn't have an explicit key assigned to it.
       * This element is in an array. The array could grow and shrink or be
       * reordered. All children that haven't already been validated are required to
       * have a "key" property assigned to it. Error statuses are cached so a warning
       * will only be shown once.
       *
       * @internal
       * @param {ReactElement} element Element that requires a key.
       * @param {*} parentType element's parent's type.
       */
      function validateExplicitKey(element, parentType) {
        if (!element._store || element._store.validated || element.key != null) {
          return;
        }
        element._store.validated = true;

        var memoizer = ownerHasKeyUseWarning.uniqueKey || (ownerHasKeyUseWarning.uniqueKey = {});

        var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
        if (memoizer[currentComponentErrorInfo]) {
          return;
        }
        memoizer[currentComponentErrorInfo] = true;

        // Usually the current owner is the offender, but if it accepts children as a
        // property, it may be the creator of the child that's responsible for
        // assigning it a key.
        var childOwner = '';
        if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
          // Give the component that originally created this child.
          childOwner = ' It was passed a child from ' + element._owner.getName() + '.';
        }

        "development" !== 'production' ? warning(false, 'Each child in an array or iterator should have a unique "key" prop.' + '%s%s See https://fb.me/react-warning-keys for more information.%s', currentComponentErrorInfo, childOwner, ReactComponentTreeHook.getCurrentStackAddendum(element)) : void 0;
      }

      /**
       * Ensure that every element either is passed in a static location, in an
       * array with an explicit keys property defined, or in an object literal
       * with valid key property.
       *
       * @internal
       * @param {ReactNode} node Statically passed child of any type.
       * @param {*} parentType node's parent's type.
       */
      function validateChildKeys(node, parentType) {
        if (typeof node !== 'object') {
          return;
        }
        if (Array.isArray(node)) {
          for (var i = 0; i < node.length; i++) {
            var child = node[i];
            if (ReactElement.isValidElement(child)) {
              validateExplicitKey(child, parentType);
            }
          }
        } else if (ReactElement.isValidElement(node)) {
          // This element was passed in a valid location.
          if (node._store) {
            node._store.validated = true;
          }
        } else if (node) {
          var iteratorFn = getIteratorFn(node);
          // Entry iterators provide implicit keys.
          if (iteratorFn) {
            if (iteratorFn !== node.entries) {
              var iterator = iteratorFn.call(node);
              var step;
              while (!(step = iterator.next()).done) {
                if (ReactElement.isValidElement(step.value)) {
                  validateExplicitKey(step.value, parentType);
                }
              }
            }
          }
        }
      }

      /**
       * Given an element, validate that its props follow the propTypes definition,
       * provided by the type.
       *
       * @param {ReactElement} element
       */
      function validatePropTypes(element) {
        var componentClass = element.type;
        if (typeof componentClass !== 'function') {
          return;
        }
        var name = componentClass.displayName || componentClass.name;
        if (componentClass.propTypes) {
          checkReactTypeSpec(componentClass.propTypes, element.props, 'prop', name, element, null);
        }
        if (typeof componentClass.getDefaultProps === 'function') {
          "development" !== 'production' ? warning(componentClass.getDefaultProps.isReactClassApproved, 'getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.') : void 0;
        }
      }

      var ReactElementValidator = {

        createElement: function (type, props, children) {
          var validType = typeof type === 'string' || typeof type === 'function';
          // We warn in this case but don't throw. We expect the element creation to
          // succeed and there will likely be errors in render.
          if (!validType) {
            if (typeof type !== 'function' && typeof type !== 'string') {
              var info = '';
              if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
                info += ' You likely forgot to export your component from the file ' + 'it\'s defined in.';
              }

              var sourceInfo = getSourceInfoErrorAddendum(props);
              if (sourceInfo) {
                info += sourceInfo;
              } else {
                info += getDeclarationErrorAddendum();
              }

              info += ReactComponentTreeHook.getCurrentStackAddendum();

              "development" !== 'production' ? warning(false, 'React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', type == null ? type : typeof type, info) : void 0;
            }
          }

          var element = ReactElement.createElement.apply(this, arguments);

          // The result can be nullish if a mock or a custom function is used.
          // TODO: Drop this when these are no longer allowed as the type argument.
          if (element == null) {
            return element;
          }

          // Skip key warning if the type isn't valid since our key validation logic
          // doesn't expect a non-string/function type and can throw confusing errors.
          // We don't want exception behavior to differ between dev and prod.
          // (Rendering will throw with a helpful message and as soon as the type is
          // fixed, the key warnings will appear.)
          if (validType) {
            for (var i = 2; i < arguments.length; i++) {
              validateChildKeys(arguments[i], type);
            }
          }

          validatePropTypes(element);

          return element;
        },

        createFactory: function (type) {
          var validatedFactory = ReactElementValidator.createElement.bind(null, type);
          // Legacy hook TODO: Warn if this is accessed
          validatedFactory.type = type;

          if ("development" !== 'production') {
            if (canDefineProperty) {
              Object.defineProperty(validatedFactory, 'type', {
                enumerable: false,
                get: function () {
                  "development" !== 'production' ? warning(false, 'Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.') : void 0;
                  Object.defineProperty(this, 'type', {
                    value: type
                  });
                  return type;
                }
              });
            }
          }

          return validatedFactory;
        },

        cloneElement: function (element, props, children) {
          var newElement = ReactElement.cloneElement.apply(this, arguments);
          for (var i = 2; i < arguments.length; i++) {
            validateChildKeys(arguments[i], newElement.type);
          }
          validatePropTypes(newElement);
          return newElement;
        }

      };

      module.exports = ReactElementValidator;
    }, { "10": 10, "20": 20, "21": 21, "22": 22, "30": 30, "7": 7, "8": 8 }], 13: [function (_dereq_, module, exports) {
      /**
       * Copyright 2015-present, Facebook, Inc.
       * All rights reserved.
       *
       * This source code is licensed under the BSD-style license found in the
       * LICENSE file in the root directory of this source tree. An additional grant
       * of patent rights can be found in the PATENTS file in the same directory.
       *
       */

      'use strict';

      var warning = _dereq_(30);

      function warnNoop(publicInstance, callerName) {
        if ("development" !== 'production') {
          var constructor = publicInstance.constructor;
          "development" !== 'production' ? warning(false, '%s(...): Can only update a mounted or mounting component. ' + 'This usually means you called %s() on an unmounted component. ' + 'This is a no-op. Please check the code for the %s component.', callerName, callerName, constructor && (constructor.displayName || constructor.name) || 'ReactClass') : void 0;
        }
      }

      /**
       * This is the abstract API for an update queue.
       */
      var ReactNoopUpdateQueue = {

        /**
         * Checks whether or not this composite component is mounted.
         * @param {ReactClass} publicInstance The instance we want to test.
         * @return {boolean} True if mounted, false otherwise.
         * @protected
         * @final
         */
        isMounted: function (publicInstance) {
          return false;
        },

        /**
         * Enqueue a callback that will be executed after all the pending updates
         * have processed.
         *
         * @param {ReactClass} publicInstance The instance to use as `this` context.
         * @param {?function} callback Called after state is updated.
         * @internal
         */
        enqueueCallback: function (publicInstance, callback) {},

        /**
         * Forces an update. This should only be invoked when it is known with
         * certainty that we are **not** in a DOM transaction.
         *
         * You may want to call this when you know that some deeper aspect of the
         * component's state has changed but `setState` was not called.
         *
         * This will not invoke `shouldComponentUpdate`, but it will invoke
         * `componentWillUpdate` and `componentDidUpdate`.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @internal
         */
        enqueueForceUpdate: function (publicInstance) {
          warnNoop(publicInstance, 'forceUpdate');
        },

        /**
         * Replaces all of the state. Always use this or `setState` to mutate state.
         * You should treat `this.state` as immutable.
         *
         * There is no guarantee that `this.state` will be immediately updated, so
         * accessing `this.state` after calling this method may return the old value.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {object} completeState Next state.
         * @internal
         */
        enqueueReplaceState: function (publicInstance, completeState) {
          warnNoop(publicInstance, 'replaceState');
        },

        /**
         * Sets a subset of the state. This only exists because _pendingState is
         * internal. This provides a merging strategy that is not available to deep
         * properties which is confusing. TODO: Expose pendingState or don't use it
         * during the merge.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {object} partialState Next partial state to be merged with state.
         * @internal
         */
        enqueueSetState: function (publicInstance, partialState) {
          warnNoop(publicInstance, 'setState');
        }
      };

      module.exports = ReactNoopUpdateQueue;
    }, { "30": 30 }], 14: [function (_dereq_, module, exports) {
      /**
       * Copyright 2013-present, Facebook, Inc.
       * All rights reserved.
       *
       * This source code is licensed under the BSD-style license found in the
       * LICENSE file in the root directory of this source tree. An additional grant
       * of patent rights can be found in the PATENTS file in the same directory.
       *
       * 
       */

      'use strict';

      var ReactPropTypeLocationNames = {};

      if ("development" !== 'production') {
        ReactPropTypeLocationNames = {
          prop: 'prop',
          context: 'context',
          childContext: 'child context'
        };
      }

      module.exports = ReactPropTypeLocationNames;
    }, {}], 15: [function (_dereq_, module, exports) {
      /**
       * Copyright 2013-present, Facebook, Inc.
       * All rights reserved.
       *
       * This source code is licensed under the BSD-style license found in the
       * LICENSE file in the root directory of this source tree. An additional grant
       * of patent rights can be found in the PATENTS file in the same directory.
       *
       */

      'use strict';

      var _require = _dereq_(10),
          isValidElement = _require.isValidElement;

      var factory = _dereq_(33);

      module.exports = factory(isValidElement);
    }, { "10": 10, "33": 33 }], 16: [function (_dereq_, module, exports) {
      /**
       * Copyright 2013-present, Facebook, Inc.
       * All rights reserved.
       *
       * This source code is licensed under the BSD-style license found in the
       * LICENSE file in the root directory of this source tree. An additional grant
       * of patent rights can be found in the PATENTS file in the same directory.
       *
       * 
       */

      'use strict';

      var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

      module.exports = ReactPropTypesSecret;
    }, {}], 17: [function (_dereq_, module, exports) {
      /**
       * Copyright 2013-present, Facebook, Inc.
       * All rights reserved.
       *
       * This source code is licensed under the BSD-style license found in the
       * LICENSE file in the root directory of this source tree. An additional grant
       * of patent rights can be found in the PATENTS file in the same directory.
       *
       */

      'use strict';

      var _assign = _dereq_(31);

      var ReactComponent = _dereq_(6);
      var ReactNoopUpdateQueue = _dereq_(13);

      var emptyObject = _dereq_(28);

      /**
       * Base class helpers for the updating state of a component.
       */
      function ReactPureComponent(props, context, updater) {
        // Duplicated from ReactComponent.
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        // We initialize the default updater but the real one gets injected by the
        // renderer.
        this.updater = updater || ReactNoopUpdateQueue;
      }

      function ComponentDummy() {}
      ComponentDummy.prototype = ReactComponent.prototype;
      ReactPureComponent.prototype = new ComponentDummy();
      ReactPureComponent.prototype.constructor = ReactPureComponent;
      // Avoid an extra prototype jump for these methods.
      _assign(ReactPureComponent.prototype, ReactComponent.prototype);
      ReactPureComponent.prototype.isPureReactComponent = true;

      module.exports = ReactPureComponent;
    }, { "13": 13, "28": 28, "31": 31, "6": 6 }], 18: [function (_dereq_, module, exports) {
      /**
       * Copyright 2013-present, Facebook, Inc.
       * All rights reserved.
       *
       * This source code is licensed under the BSD-style license found in the
       * LICENSE file in the root directory of this source tree. An additional grant
       * of patent rights can be found in the PATENTS file in the same directory.
       *
       */

      'use strict';

      var _assign = _dereq_(31);

      var React = _dereq_(3);

      // `version` will be added here by the React module.
      var ReactUMDEntry = _assign(React, {
        __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
          ReactCurrentOwner: _dereq_(8)
        }
      });

      if ("development" !== 'production') {
        _assign(ReactUMDEntry.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, {
          // ReactComponentTreeHook should not be included in production.
          ReactComponentTreeHook: _dereq_(7),
          getNextDebugID: _dereq_(23)
        });
      }

      module.exports = ReactUMDEntry;
    }, { "23": 23, "3": 3, "31": 31, "7": 7, "8": 8 }], 19: [function (_dereq_, module, exports) {
      /**
       * Copyright 2013-present, Facebook, Inc.
       * All rights reserved.
       *
       * This source code is licensed under the BSD-style license found in the
       * LICENSE file in the root directory of this source tree. An additional grant
       * of patent rights can be found in the PATENTS file in the same directory.
       *
       */

      'use strict';

      module.exports = '15.5.4';
    }, {}], 20: [function (_dereq_, module, exports) {
      /**
       * Copyright 2013-present, Facebook, Inc.
       * All rights reserved.
       *
       * This source code is licensed under the BSD-style license found in the
       * LICENSE file in the root directory of this source tree. An additional grant
       * of patent rights can be found in the PATENTS file in the same directory.
       *
       * 
       */

      'use strict';

      var canDefineProperty = false;
      if ("development" !== 'production') {
        try {
          // $FlowFixMe https://github.com/facebook/flow/issues/285
          Object.defineProperty({}, 'x', { get: function () {} });
          canDefineProperty = true;
        } catch (x) {
          // IE will fail on defineProperty
        }
      }

      module.exports = canDefineProperty;
    }, {}], 21: [function (_dereq_, module, exports) {
      (function (process) {
        /**
         * Copyright 2013-present, Facebook, Inc.
         * All rights reserved.
         *
         * This source code is licensed under the BSD-style license found in the
         * LICENSE file in the root directory of this source tree. An additional grant
         * of patent rights can be found in the PATENTS file in the same directory.
         *
         */

        'use strict';

        var _prodInvariant = _dereq_(25);

        var ReactPropTypeLocationNames = _dereq_(14);
        var ReactPropTypesSecret = _dereq_(16);

        var invariant = _dereq_(29);
        var warning = _dereq_(30);

        var ReactComponentTreeHook;

        if (typeof process !== 'undefined' && process.env && "development" === 'test') {
          // Temporary hack.
          // Inline requires don't work well with Jest:
          // https://github.com/facebook/react/issues/7240
          // Remove the inline requires when we don't need them anymore:
          // https://github.com/facebook/react/pull/7178
          ReactComponentTreeHook = _dereq_(7);
        }

        var loggedTypeFailures = {};

        /**
         * Assert that the values match with the type specs.
         * Error messages are memorized and will only be shown once.
         *
         * @param {object} typeSpecs Map of name to a ReactPropType
         * @param {object} values Runtime values that need to be type-checked
         * @param {string} location e.g. "prop", "context", "child context"
         * @param {string} componentName Name of the component for error messages.
         * @param {?object} element The React element that is being type-checked
         * @param {?number} debugID The React component instance that is being type-checked
         * @private
         */
        function checkReactTypeSpec(typeSpecs, values, location, componentName, element, debugID) {
          for (var typeSpecName in typeSpecs) {
            if (typeSpecs.hasOwnProperty(typeSpecName)) {
              var error;
              // Prop type validation may throw. In case they do, we don't want to
              // fail the render phase where it didn't fail before. So we log it.
              // After these have been cleaned up, we'll let them throw.
              try {
                // This is intentionally an invariant that gets caught. It's the same
                // behavior as without this statement except with a better message.
                !(typeof typeSpecs[typeSpecName] === 'function') ? "development" !== 'production' ? invariant(false, '%s: %s type `%s` is invalid; it must be a function, usually from React.PropTypes.', componentName || 'React class', ReactPropTypeLocationNames[location], typeSpecName) : _prodInvariant('84', componentName || 'React class', ReactPropTypeLocationNames[location], typeSpecName) : void 0;
                error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
              } catch (ex) {
                error = ex;
              }
              "development" !== 'production' ? warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', ReactPropTypeLocationNames[location], typeSpecName, typeof error) : void 0;
              if (error instanceof Error && !(error.message in loggedTypeFailures)) {
                // Only monitor this failure once because there tends to be a lot of the
                // same error.
                loggedTypeFailures[error.message] = true;

                var componentStackInfo = '';

                if ("development" !== 'production') {
                  if (!ReactComponentTreeHook) {
                    ReactComponentTreeHook = _dereq_(7);
                  }
                  if (debugID !== null) {
                    componentStackInfo = ReactComponentTreeHook.getStackAddendumByID(debugID);
                  } else if (element !== null) {
                    componentStackInfo = ReactComponentTreeHook.getCurrentStackAddendum(element);
                  }
                }

                "development" !== 'production' ? warning(false, 'Failed %s type: %s%s', location, error.message, componentStackInfo) : void 0;
              }
            }
          }
        }

        module.exports = checkReactTypeSpec;
      }).call(this, undefined);
    }, { "14": 14, "16": 16, "25": 25, "29": 29, "30": 30, "7": 7 }], 22: [function (_dereq_, module, exports) {
      /**
       * Copyright 2013-present, Facebook, Inc.
       * All rights reserved.
       *
       * This source code is licensed under the BSD-style license found in the
       * LICENSE file in the root directory of this source tree. An additional grant
       * of patent rights can be found in the PATENTS file in the same directory.
       *
       * 
       */

      'use strict';

      /* global Symbol */

      var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
      var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

      /**
       * Returns the iterator method function contained on the iterable object.
       *
       * Be sure to invoke the function with the iterable as context:
       *
       *     var iteratorFn = getIteratorFn(myIterable);
       *     if (iteratorFn) {
       *       var iterator = iteratorFn.call(myIterable);
       *       ...
       *     }
       *
       * @param {?object} maybeIterable
       * @return {?function}
       */
      function getIteratorFn(maybeIterable) {
        var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
        if (typeof iteratorFn === 'function') {
          return iteratorFn;
        }
      }

      module.exports = getIteratorFn;
    }, {}], 23: [function (_dereq_, module, exports) {
      /**
       * Copyright 2013-present, Facebook, Inc.
       * All rights reserved.
       *
       * This source code is licensed under the BSD-style license found in the
       * LICENSE file in the root directory of this source tree. An additional grant
       * of patent rights can be found in the PATENTS file in the same directory.
       *
       * 
       */

      'use strict';

      var nextDebugID = 1;

      function getNextDebugID() {
        return nextDebugID++;
      }

      module.exports = getNextDebugID;
    }, {}], 24: [function (_dereq_, module, exports) {
      /**
       * Copyright 2013-present, Facebook, Inc.
       * All rights reserved.
       *
       * This source code is licensed under the BSD-style license found in the
       * LICENSE file in the root directory of this source tree. An additional grant
       * of patent rights can be found in the PATENTS file in the same directory.
       *
       */
      'use strict';

      var _prodInvariant = _dereq_(25);

      var ReactElement = _dereq_(10);

      var invariant = _dereq_(29);

      /**
       * Returns the first child in a collection of children and verifies that there
       * is only one child in the collection.
       *
       * See https://facebook.github.io/react/docs/top-level-api.html#react.children.only
       *
       * The current implementation of this function assumes that a single child gets
       * passed without a wrapper, but the purpose of this helper function is to
       * abstract away the particular structure of children.
       *
       * @param {?object} children Child collection structure.
       * @return {ReactElement} The first and only `ReactElement` contained in the
       * structure.
       */
      function onlyChild(children) {
        !ReactElement.isValidElement(children) ? "development" !== 'production' ? invariant(false, 'React.Children.only expected to receive a single React element child.') : _prodInvariant('143') : void 0;
        return children;
      }

      module.exports = onlyChild;
    }, { "10": 10, "25": 25, "29": 29 }], 25: [function (_dereq_, module, exports) {
      /**
       * Copyright (c) 2013-present, Facebook, Inc.
       * All rights reserved.
       *
       * This source code is licensed under the BSD-style license found in the
       * LICENSE file in the root directory of this source tree. An additional grant
       * of patent rights can be found in the PATENTS file in the same directory.
       *
       * 
       */
      'use strict';

      /**
       * WARNING: DO NOT manually require this module.
       * This is a replacement for `invariant(...)` used by the error code system
       * and will _only_ be required by the corresponding babel pass.
       * It always throws.
       */

      function reactProdInvariant(code) {
        var argCount = arguments.length - 1;

        var message = 'Minified React error #' + code + '; visit ' + 'http://facebook.github.io/react/docs/error-decoder.html?invariant=' + code;

        for (var argIdx = 0; argIdx < argCount; argIdx++) {
          message += '&args[]=' + encodeURIComponent(arguments[argIdx + 1]);
        }

        message += ' for the full message or use the non-minified dev environment' + ' for full errors and additional helpful warnings.';

        var error = new Error(message);
        error.name = 'Invariant Violation';
        error.framesToPop = 1; // we don't care about reactProdInvariant's own frame

        throw error;
      }

      module.exports = reactProdInvariant;
    }, {}], 26: [function (_dereq_, module, exports) {
      /**
       * Copyright 2013-present, Facebook, Inc.
       * All rights reserved.
       *
       * This source code is licensed under the BSD-style license found in the
       * LICENSE file in the root directory of this source tree. An additional grant
       * of patent rights can be found in the PATENTS file in the same directory.
       *
       */

      'use strict';

      var _prodInvariant = _dereq_(25);

      var ReactCurrentOwner = _dereq_(8);
      var REACT_ELEMENT_TYPE = _dereq_(11);

      var getIteratorFn = _dereq_(22);
      var invariant = _dereq_(29);
      var KeyEscapeUtils = _dereq_(1);
      var warning = _dereq_(30);

      var SEPARATOR = '.';
      var SUBSEPARATOR = ':';

      /**
       * This is inlined from ReactElement since this file is shared between
       * isomorphic and renderers. We could extract this to a
       *
       */

      /**
       * TODO: Test that a single child and an array with one item have the same key
       * pattern.
       */

      var didWarnAboutMaps = false;

      /**
       * Generate a key string that identifies a component within a set.
       *
       * @param {*} component A component that could contain a manual key.
       * @param {number} index Index that is used if a manual key is not provided.
       * @return {string}
       */
      function getComponentKey(component, index) {
        // Do some typechecking here since we call this blindly. We want to ensure
        // that we don't block potential future ES APIs.
        if (component && typeof component === 'object' && component.key != null) {
          // Explicit key
          return KeyEscapeUtils.escape(component.key);
        }
        // Implicit key determined by the index in the set
        return index.toString(36);
      }

      /**
       * @param {?*} children Children tree container.
       * @param {!string} nameSoFar Name of the key path so far.
       * @param {!function} callback Callback to invoke with each child found.
       * @param {?*} traverseContext Used to pass information throughout the traversal
       * process.
       * @return {!number} The number of children in this subtree.
       */
      function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
        var type = typeof children;

        if (type === 'undefined' || type === 'boolean') {
          // All of the above are perceived as null.
          children = null;
        }

        if (children === null || type === 'string' || type === 'number' ||
        // The following is inlined from ReactElement. This means we can optimize
        // some checks. React Fiber also inlines this logic for similar purposes.
        type === 'object' && children.$$typeof === REACT_ELEMENT_TYPE) {
          callback(traverseContext, children,
          // If it's the only child, treat the name as if it was wrapped in an array
          // so that it's consistent if the number of children grows.
          nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
          return 1;
        }

        var child;
        var nextName;
        var subtreeCount = 0; // Count of children found in the current subtree.
        var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

        if (Array.isArray(children)) {
          for (var i = 0; i < children.length; i++) {
            child = children[i];
            nextName = nextNamePrefix + getComponentKey(child, i);
            subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
          }
        } else {
          var iteratorFn = getIteratorFn(children);
          if (iteratorFn) {
            var iterator = iteratorFn.call(children);
            var step;
            if (iteratorFn !== children.entries) {
              var ii = 0;
              while (!(step = iterator.next()).done) {
                child = step.value;
                nextName = nextNamePrefix + getComponentKey(child, ii++);
                subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
              }
            } else {
              if ("development" !== 'production') {
                var mapsAsChildrenAddendum = '';
                if (ReactCurrentOwner.current) {
                  var mapsAsChildrenOwnerName = ReactCurrentOwner.current.getName();
                  if (mapsAsChildrenOwnerName) {
                    mapsAsChildrenAddendum = ' Check the render method of `' + mapsAsChildrenOwnerName + '`.';
                  }
                }
                "development" !== 'production' ? warning(didWarnAboutMaps, 'Using Maps as children is not yet fully supported. It is an ' + 'experimental feature that might be removed. Convert it to a ' + 'sequence / iterable of keyed ReactElements instead.%s', mapsAsChildrenAddendum) : void 0;
                didWarnAboutMaps = true;
              }
              // Iterator will provide entry [k,v] tuples rather than values.
              while (!(step = iterator.next()).done) {
                var entry = step.value;
                if (entry) {
                  child = entry[1];
                  nextName = nextNamePrefix + KeyEscapeUtils.escape(entry[0]) + SUBSEPARATOR + getComponentKey(child, 0);
                  subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
                }
              }
            }
          } else if (type === 'object') {
            var addendum = '';
            if ("development" !== 'production') {
              addendum = ' If you meant to render a collection of children, use an array ' + 'instead or wrap the object using createFragment(object) from the ' + 'React add-ons.';
              if (children._isReactElement) {
                addendum = ' It looks like you\'re using an element created by a different ' + 'version of React. Make sure to use only one copy of React.';
              }
              if (ReactCurrentOwner.current) {
                var name = ReactCurrentOwner.current.getName();
                if (name) {
                  addendum += ' Check the render method of `' + name + '`.';
                }
              }
            }
            var childrenString = String(children);
            !false ? "development" !== 'production' ? invariant(false, 'Objects are not valid as a React child (found: %s).%s', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum) : _prodInvariant('31', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum) : void 0;
          }
        }

        return subtreeCount;
      }

      /**
       * Traverses children that are typically specified as `props.children`, but
       * might also be specified through attributes:
       *
       * - `traverseAllChildren(this.props.children, ...)`
       * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
       *
       * The `traverseContext` is an optional argument that is passed through the
       * entire traversal. It can be used to store accumulations or anything else that
       * the callback might find relevant.
       *
       * @param {?*} children Children tree object.
       * @param {!function} callback To invoke upon traversing each child.
       * @param {?*} traverseContext Context for traversal.
       * @return {!number} The number of children in this subtree.
       */
      function traverseAllChildren(children, callback, traverseContext) {
        if (children == null) {
          return 0;
        }

        return traverseAllChildrenImpl(children, '', callback, traverseContext);
      }

      module.exports = traverseAllChildren;
    }, { "1": 1, "11": 11, "22": 22, "25": 25, "29": 29, "30": 30, "8": 8 }], 27: [function (_dereq_, module, exports) {
      "use strict";

      /**
       * Copyright (c) 2013-present, Facebook, Inc.
       * All rights reserved.
       *
       * This source code is licensed under the BSD-style license found in the
       * LICENSE file in the root directory of this source tree. An additional grant
       * of patent rights can be found in the PATENTS file in the same directory.
       *
       * 
       */

      function makeEmptyFunction(arg) {
        return function () {
          return arg;
        };
      }

      /**
       * This function accepts and discards inputs; it has no side effects. This is
       * primarily useful idiomatically for overridable function endpoints which
       * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
       */
      var emptyFunction = function emptyFunction() {};

      emptyFunction.thatReturns = makeEmptyFunction;
      emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
      emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
      emptyFunction.thatReturnsNull = makeEmptyFunction(null);
      emptyFunction.thatReturnsThis = function () {
        return this;
      };
      emptyFunction.thatReturnsArgument = function (arg) {
        return arg;
      };

      module.exports = emptyFunction;
    }, {}], 28: [function (_dereq_, module, exports) {
      /**
       * Copyright (c) 2013-present, Facebook, Inc.
       * All rights reserved.
       *
       * This source code is licensed under the BSD-style license found in the
       * LICENSE file in the root directory of this source tree. An additional grant
       * of patent rights can be found in the PATENTS file in the same directory.
       *
       */

      'use strict';

      var emptyObject = {};

      if ("development" !== 'production') {
        Object.freeze(emptyObject);
      }

      module.exports = emptyObject;
    }, {}], 29: [function (_dereq_, module, exports) {
      /**
       * Copyright (c) 2013-present, Facebook, Inc.
       * All rights reserved.
       *
       * This source code is licensed under the BSD-style license found in the
       * LICENSE file in the root directory of this source tree. An additional grant
       * of patent rights can be found in the PATENTS file in the same directory.
       *
       */

      'use strict';

      /**
       * Use invariant() to assert state which your program assumes to be true.
       *
       * Provide sprintf-style format (only %s is supported) and arguments
       * to provide information about what broke and what you were
       * expecting.
       *
       * The invariant message will be stripped in production, but the invariant
       * will remain to ensure logic does not differ in production.
       */

      var validateFormat = function validateFormat(format) {};

      if ("development" !== 'production') {
        validateFormat = function validateFormat(format) {
          if (format === undefined) {
            throw new Error('invariant requires an error message argument');
          }
        };
      }

      function invariant(condition, format, a, b, c, d, e, f) {
        validateFormat(format);

        if (!condition) {
          var error;
          if (format === undefined) {
            error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
          } else {
            var args = [a, b, c, d, e, f];
            var argIndex = 0;
            error = new Error(format.replace(/%s/g, function () {
              return args[argIndex++];
            }));
            error.name = 'Invariant Violation';
          }

          error.framesToPop = 1; // we don't care about invariant's own frame
          throw error;
        }
      }

      module.exports = invariant;
    }, {}], 30: [function (_dereq_, module, exports) {
      /**
       * Copyright 2014-2015, Facebook, Inc.
       * All rights reserved.
       *
       * This source code is licensed under the BSD-style license found in the
       * LICENSE file in the root directory of this source tree. An additional grant
       * of patent rights can be found in the PATENTS file in the same directory.
       *
       */

      'use strict';

      var emptyFunction = _dereq_(27);

      /**
       * Similar to invariant but only logs a warning if the condition is not met.
       * This can be used to log issues in development environments in critical
       * paths. Removing the logging code for production environments will keep the
       * same logic and follow the same code paths.
       */

      var warning = emptyFunction;

      if ("development" !== 'production') {
        (function () {
          var printWarning = function printWarning(format) {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              args[_key - 1] = arguments[_key];
            }

            var argIndex = 0;
            var message = 'Warning: ' + format.replace(/%s/g, function () {
              return args[argIndex++];
            });
            if (typeof console !== 'undefined') {
              console.error(message);
            }
            try {
              // --- Welcome to debugging React ---
              // This error was thrown as a convenience so that you can use this stack
              // to find the callsite that caused this warning to fire.
              throw new Error(message);
            } catch (x) {}
          };

          warning = function warning(condition, format) {
            if (format === undefined) {
              throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
            }

            if (format.indexOf('Failed Composite propType: ') === 0) {
              return; // Ignore CompositeComponent proptype check.
            }

            if (!condition) {
              for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
                args[_key2 - 2] = arguments[_key2];
              }

              printWarning.apply(undefined, [format].concat(args));
            }
          };
        })();
      }

      module.exports = warning;
    }, { "27": 27 }], 31: [function (_dereq_, module, exports) {
      /*
      object-assign
      (c) Sindre Sorhus
      @license MIT
      */

      'use strict';
      /* eslint-disable no-unused-vars */

      var getOwnPropertySymbols = Object.getOwnPropertySymbols;
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      var propIsEnumerable = Object.prototype.propertyIsEnumerable;

      function toObject(val) {
        if (val === null || val === undefined) {
          throw new TypeError('Object.assign cannot be called with null or undefined');
        }

        return Object(val);
      }

      function shouldUseNative() {
        try {
          if (!Object.assign) {
            return false;
          }

          // Detect buggy property enumeration order in older V8 versions.

          // https://bugs.chromium.org/p/v8/issues/detail?id=4118
          var test1 = new String('abc'); // eslint-disable-line no-new-wrappers
          test1[5] = 'de';
          if (Object.getOwnPropertyNames(test1)[0] === '5') {
            return false;
          }

          // https://bugs.chromium.org/p/v8/issues/detail?id=3056
          var test2 = {};
          for (var i = 0; i < 10; i++) {
            test2['_' + String.fromCharCode(i)] = i;
          }
          var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
            return test2[n];
          });
          if (order2.join('') !== '0123456789') {
            return false;
          }

          // https://bugs.chromium.org/p/v8/issues/detail?id=3056
          var test3 = {};
          'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
            test3[letter] = letter;
          });
          if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
            return false;
          }

          return true;
        } catch (err) {
          // We don't expect any of the above to throw, but better to be safe.
          return false;
        }
      }

      module.exports = shouldUseNative() ? Object.assign : function (target, source) {
        var from;
        var to = toObject(target);
        var symbols;

        for (var s = 1; s < arguments.length; s++) {
          from = Object(arguments[s]);

          for (var key in from) {
            if (hasOwnProperty.call(from, key)) {
              to[key] = from[key];
            }
          }

          if (getOwnPropertySymbols) {
            symbols = getOwnPropertySymbols(from);
            for (var i = 0; i < symbols.length; i++) {
              if (propIsEnumerable.call(from, symbols[i])) {
                to[symbols[i]] = from[symbols[i]];
              }
            }
          }
        }

        return to;
      };
    }, {}], 32: [function (_dereq_, module, exports) {
      /**
       * Copyright 2013-present, Facebook, Inc.
       * All rights reserved.
       *
       * This source code is licensed under the BSD-style license found in the
       * LICENSE file in the root directory of this source tree. An additional grant
       * of patent rights can be found in the PATENTS file in the same directory.
       */

      'use strict';

      if ("development" !== 'production') {
        var invariant = _dereq_(29);
        var warning = _dereq_(30);
        var ReactPropTypesSecret = _dereq_(35);
        var loggedTypeFailures = {};
      }

      /**
       * Assert that the values match with the type specs.
       * Error messages are memorized and will only be shown once.
       *
       * @param {object} typeSpecs Map of name to a ReactPropType
       * @param {object} values Runtime values that need to be type-checked
       * @param {string} location e.g. "prop", "context", "child context"
       * @param {string} componentName Name of the component for error messages.
       * @param {?Function} getStack Returns the component stack.
       * @private
       */
      function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
        if ("development" !== 'production') {
          for (var typeSpecName in typeSpecs) {
            if (typeSpecs.hasOwnProperty(typeSpecName)) {
              var error;
              // Prop type validation may throw. In case they do, we don't want to
              // fail the render phase where it didn't fail before. So we log it.
              // After these have been cleaned up, we'll let them throw.
              try {
                // This is intentionally an invariant that gets caught. It's the same
                // behavior as without this statement except with a better message.
                invariant(typeof typeSpecs[typeSpecName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'React.PropTypes.', componentName || 'React class', location, typeSpecName);
                error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
              } catch (ex) {
                error = ex;
              }
              warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error);
              if (error instanceof Error && !(error.message in loggedTypeFailures)) {
                // Only monitor this failure once because there tends to be a lot of the
                // same error.
                loggedTypeFailures[error.message] = true;

                var stack = getStack ? getStack() : '';

                warning(false, 'Failed %s type: %s%s', location, error.message, stack != null ? stack : '');
              }
            }
          }
        }
      }

      module.exports = checkPropTypes;
    }, { "29": 29, "30": 30, "35": 35 }], 33: [function (_dereq_, module, exports) {
      /**
       * Copyright 2013-present, Facebook, Inc.
       * All rights reserved.
       *
       * This source code is licensed under the BSD-style license found in the
       * LICENSE file in the root directory of this source tree. An additional grant
       * of patent rights can be found in the PATENTS file in the same directory.
       */

      'use strict';

      // React 15.5 references this module, and assumes PropTypes are still callable in production.
      // Therefore we re-export development-only version with all the PropTypes checks here.
      // However if one is migrating to the `prop-types` npm library, they will go through the
      // `index.js` entry point, and it will branch depending on the environment.

      var factory = _dereq_(34);
      module.exports = function (isValidElement) {
        // It is still allowed in 15.5.
        var throwOnDirectAccess = false;
        return factory(isValidElement, throwOnDirectAccess);
      };
    }, { "34": 34 }], 34: [function (_dereq_, module, exports) {
      /**
       * Copyright 2013-present, Facebook, Inc.
       * All rights reserved.
       *
       * This source code is licensed under the BSD-style license found in the
       * LICENSE file in the root directory of this source tree. An additional grant
       * of patent rights can be found in the PATENTS file in the same directory.
       */

      'use strict';

      var emptyFunction = _dereq_(27);
      var invariant = _dereq_(29);
      var warning = _dereq_(30);

      var ReactPropTypesSecret = _dereq_(35);
      var checkPropTypes = _dereq_(32);

      module.exports = function (isValidElement, throwOnDirectAccess) {
        /* global Symbol */
        var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
        var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

        /**
         * Returns the iterator method function contained on the iterable object.
         *
         * Be sure to invoke the function with the iterable as context:
         *
         *     var iteratorFn = getIteratorFn(myIterable);
         *     if (iteratorFn) {
         *       var iterator = iteratorFn.call(myIterable);
         *       ...
         *     }
         *
         * @param {?object} maybeIterable
         * @return {?function}
         */
        function getIteratorFn(maybeIterable) {
          var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
          if (typeof iteratorFn === 'function') {
            return iteratorFn;
          }
        }

        /**
         * Collection of methods that allow declaration and validation of props that are
         * supplied to React components. Example usage:
         *
         *   var Props = require('ReactPropTypes');
         *   var MyArticle = React.createClass({
         *     propTypes: {
         *       // An optional string prop named "description".
         *       description: Props.string,
         *
         *       // A required enum prop named "category".
         *       category: Props.oneOf(['News','Photos']).isRequired,
         *
         *       // A prop named "dialog" that requires an instance of Dialog.
         *       dialog: Props.instanceOf(Dialog).isRequired
         *     },
         *     render: function() { ... }
         *   });
         *
         * A more formal specification of how these methods are used:
         *
         *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
         *   decl := ReactPropTypes.{type}(.isRequired)?
         *
         * Each and every declaration produces a function with the same signature. This
         * allows the creation of custom validation functions. For example:
         *
         *  var MyLink = React.createClass({
         *    propTypes: {
         *      // An optional string or URI prop named "href".
         *      href: function(props, propName, componentName) {
         *        var propValue = props[propName];
         *        if (propValue != null && typeof propValue !== 'string' &&
         *            !(propValue instanceof URI)) {
         *          return new Error(
         *            'Expected a string or an URI for ' + propName + ' in ' +
         *            componentName
         *          );
         *        }
         *      }
         *    },
         *    render: function() {...}
         *  });
         *
         * @internal
         */

        var ANONYMOUS = '<<anonymous>>';

        // Important!
        // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
        var ReactPropTypes = {
          array: createPrimitiveTypeChecker('array'),
          bool: createPrimitiveTypeChecker('boolean'),
          func: createPrimitiveTypeChecker('function'),
          number: createPrimitiveTypeChecker('number'),
          object: createPrimitiveTypeChecker('object'),
          string: createPrimitiveTypeChecker('string'),
          symbol: createPrimitiveTypeChecker('symbol'),

          any: createAnyTypeChecker(),
          arrayOf: createArrayOfTypeChecker,
          element: createElementTypeChecker(),
          instanceOf: createInstanceTypeChecker,
          node: createNodeChecker(),
          objectOf: createObjectOfTypeChecker,
          oneOf: createEnumTypeChecker,
          oneOfType: createUnionTypeChecker,
          shape: createShapeTypeChecker
        };

        /**
         * inlined Object.is polyfill to avoid requiring consumers ship their own
         * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
         */
        /*eslint-disable no-self-compare*/
        function is(x, y) {
          // SameValue algorithm
          if (x === y) {
            // Steps 1-5, 7-10
            // Steps 6.b-6.e: +0 != -0
            return x !== 0 || 1 / x === 1 / y;
          } else {
            // Step 6.a: NaN == NaN
            return x !== x && y !== y;
          }
        }
        /*eslint-enable no-self-compare*/

        /**
         * We use an Error-like object for backward compatibility as people may call
         * PropTypes directly and inspect their output. However, we don't use real
         * Errors anymore. We don't inspect their stack anyway, and creating them
         * is prohibitively expensive if they are created too often, such as what
         * happens in oneOfType() for any type before the one that matched.
         */
        function PropTypeError(message) {
          this.message = message;
          this.stack = '';
        }
        // Make `instanceof Error` still work for returned errors.
        PropTypeError.prototype = Error.prototype;

        function createChainableTypeChecker(validate) {
          if ("development" !== 'production') {
            var manualPropTypeCallCache = {};
          }
          function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
            componentName = componentName || ANONYMOUS;
            propFullName = propFullName || propName;

            if (secret !== ReactPropTypesSecret) {
              if (throwOnDirectAccess) {
                // New behavior only for users of `prop-types` package
                invariant(false, 'Calling PropTypes validators directly is not supported by the `prop-types` package. ' + 'Use `PropTypes.checkPropTypes()` to call them. ' + 'Read more at http://fb.me/use-check-prop-types');
              } else if ("development" !== 'production' && typeof console !== 'undefined') {
                // Old behavior for people using React.PropTypes
                var cacheKey = componentName + ':' + propName;
                if (!manualPropTypeCallCache[cacheKey]) {
                  warning(false, 'You are manually calling a React.PropTypes validation ' + 'function for the `%s` prop on `%s`. This is deprecated ' + 'and will throw in the standalone `prop-types` package. ' + 'You may be seeing this warning due to a third-party PropTypes ' + 'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.', propFullName, componentName);
                  manualPropTypeCallCache[cacheKey] = true;
                }
              }
            }
            if (props[propName] == null) {
              if (isRequired) {
                if (props[propName] === null) {
                  return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
                }
                return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
              }
              return null;
            } else {
              return validate(props, propName, componentName, location, propFullName);
            }
          }

          var chainedCheckType = checkType.bind(null, false);
          chainedCheckType.isRequired = checkType.bind(null, true);

          return chainedCheckType;
        }

        function createPrimitiveTypeChecker(expectedType) {
          function validate(props, propName, componentName, location, propFullName, secret) {
            var propValue = props[propName];
            var propType = getPropType(propValue);
            if (propType !== expectedType) {
              // `propValue` being instance of, say, date/regexp, pass the 'object'
              // check, but we can offer a more precise error message here rather than
              // 'of type `object`'.
              var preciseType = getPreciseType(propValue);

              return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
            }
            return null;
          }
          return createChainableTypeChecker(validate);
        }

        function createAnyTypeChecker() {
          return createChainableTypeChecker(emptyFunction.thatReturnsNull);
        }

        function createArrayOfTypeChecker(typeChecker) {
          function validate(props, propName, componentName, location, propFullName) {
            if (typeof typeChecker !== 'function') {
              return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
            }
            var propValue = props[propName];
            if (!Array.isArray(propValue)) {
              var propType = getPropType(propValue);
              return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
            }
            for (var i = 0; i < propValue.length; i++) {
              var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
              if (error instanceof Error) {
                return error;
              }
            }
            return null;
          }
          return createChainableTypeChecker(validate);
        }

        function createElementTypeChecker() {
          function validate(props, propName, componentName, location, propFullName) {
            var propValue = props[propName];
            if (!isValidElement(propValue)) {
              var propType = getPropType(propValue);
              return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
            }
            return null;
          }
          return createChainableTypeChecker(validate);
        }

        function createInstanceTypeChecker(expectedClass) {
          function validate(props, propName, componentName, location, propFullName) {
            if (!(props[propName] instanceof expectedClass)) {
              var expectedClassName = expectedClass.name || ANONYMOUS;
              var actualClassName = getClassName(props[propName]);
              return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
            }
            return null;
          }
          return createChainableTypeChecker(validate);
        }

        function createEnumTypeChecker(expectedValues) {
          if (!Array.isArray(expectedValues)) {
            "development" !== 'production' ? warning(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
            return emptyFunction.thatReturnsNull;
          }

          function validate(props, propName, componentName, location, propFullName) {
            var propValue = props[propName];
            for (var i = 0; i < expectedValues.length; i++) {
              if (is(propValue, expectedValues[i])) {
                return null;
              }
            }

            var valuesString = JSON.stringify(expectedValues);
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
          }
          return createChainableTypeChecker(validate);
        }

        function createObjectOfTypeChecker(typeChecker) {
          function validate(props, propName, componentName, location, propFullName) {
            if (typeof typeChecker !== 'function') {
              return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
            }
            var propValue = props[propName];
            var propType = getPropType(propValue);
            if (propType !== 'object') {
              return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
            }
            for (var key in propValue) {
              if (propValue.hasOwnProperty(key)) {
                var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
                if (error instanceof Error) {
                  return error;
                }
              }
            }
            return null;
          }
          return createChainableTypeChecker(validate);
        }

        function createUnionTypeChecker(arrayOfTypeCheckers) {
          if (!Array.isArray(arrayOfTypeCheckers)) {
            "development" !== 'production' ? warning(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
            return emptyFunction.thatReturnsNull;
          }

          function validate(props, propName, componentName, location, propFullName) {
            for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
              var checker = arrayOfTypeCheckers[i];
              if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
                return null;
              }
            }

            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
          }
          return createChainableTypeChecker(validate);
        }

        function createNodeChecker() {
          function validate(props, propName, componentName, location, propFullName) {
            if (!isNode(props[propName])) {
              return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
            }
            return null;
          }
          return createChainableTypeChecker(validate);
        }

        function createShapeTypeChecker(shapeTypes) {
          function validate(props, propName, componentName, location, propFullName) {
            var propValue = props[propName];
            var propType = getPropType(propValue);
            if (propType !== 'object') {
              return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
            }
            for (var key in shapeTypes) {
              var checker = shapeTypes[key];
              if (!checker) {
                continue;
              }
              var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
              if (error) {
                return error;
              }
            }
            return null;
          }
          return createChainableTypeChecker(validate);
        }

        function isNode(propValue) {
          switch (typeof propValue) {
            case 'number':
            case 'string':
            case 'undefined':
              return true;
            case 'boolean':
              return !propValue;
            case 'object':
              if (Array.isArray(propValue)) {
                return propValue.every(isNode);
              }
              if (propValue === null || isValidElement(propValue)) {
                return true;
              }

              var iteratorFn = getIteratorFn(propValue);
              if (iteratorFn) {
                var iterator = iteratorFn.call(propValue);
                var step;
                if (iteratorFn !== propValue.entries) {
                  while (!(step = iterator.next()).done) {
                    if (!isNode(step.value)) {
                      return false;
                    }
                  }
                } else {
                  // Iterator will provide entry [k,v] tuples rather than values.
                  while (!(step = iterator.next()).done) {
                    var entry = step.value;
                    if (entry) {
                      if (!isNode(entry[1])) {
                        return false;
                      }
                    }
                  }
                }
              } else {
                return false;
              }

              return true;
            default:
              return false;
          }
        }

        function isSymbol(propType, propValue) {
          // Native Symbol.
          if (propType === 'symbol') {
            return true;
          }

          // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
          if (propValue['@@toStringTag'] === 'Symbol') {
            return true;
          }

          // Fallback for non-spec compliant Symbols which are polyfilled.
          if (typeof Symbol === 'function' && propValue instanceof Symbol) {
            return true;
          }

          return false;
        }

        // Equivalent of `typeof` but with special handling for array and regexp.
        function getPropType(propValue) {
          var propType = typeof propValue;
          if (Array.isArray(propValue)) {
            return 'array';
          }
          if (propValue instanceof RegExp) {
            // Old webkits (at least until Android 4.0) return 'function' rather than
            // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
            // passes PropTypes.object.
            return 'object';
          }
          if (isSymbol(propType, propValue)) {
            return 'symbol';
          }
          return propType;
        }

        // This handles more types than `getPropType`. Only used for error messages.
        // See `createPrimitiveTypeChecker`.
        function getPreciseType(propValue) {
          var propType = getPropType(propValue);
          if (propType === 'object') {
            if (propValue instanceof Date) {
              return 'date';
            } else if (propValue instanceof RegExp) {
              return 'regexp';
            }
          }
          return propType;
        }

        // Returns class name of the object, if any.
        function getClassName(propValue) {
          if (!propValue.constructor || !propValue.constructor.name) {
            return ANONYMOUS;
          }
          return propValue.constructor.name;
        }

        ReactPropTypes.checkPropTypes = checkPropTypes;
        ReactPropTypes.PropTypes = ReactPropTypes;

        return ReactPropTypes;
      };
    }, { "27": 27, "29": 29, "30": 30, "32": 32, "35": 35 }], 35: [function (_dereq_, module, exports) {
      /**
       * Copyright 2013-present, Facebook, Inc.
       * All rights reserved.
       *
       * This source code is licensed under the BSD-style license found in the
       * LICENSE file in the root directory of this source tree. An additional grant
       * of patent rights can be found in the PATENTS file in the same directory.
       */

      'use strict';

      var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

      module.exports = ReactPropTypesSecret;
    }, {}] }, {}, [18])(18);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlYWN0LmpzIl0sIm5hbWVzIjpbImYiLCJleHBvcnRzIiwibW9kdWxlIiwiZGVmaW5lIiwiYW1kIiwiZyIsIndpbmRvdyIsImdsb2JhbCIsInNlbGYiLCJSZWFjdCIsImUiLCJ0IiwibiIsInIiLCJzIiwibyIsInUiLCJhIiwicmVxdWlyZSIsImkiLCJFcnJvciIsImNvZGUiLCJsIiwiY2FsbCIsImxlbmd0aCIsIl9kZXJlcV8iLCJlc2NhcGUiLCJrZXkiLCJlc2NhcGVSZWdleCIsImVzY2FwZXJMb29rdXAiLCJlc2NhcGVkU3RyaW5nIiwicmVwbGFjZSIsIm1hdGNoIiwidW5lc2NhcGUiLCJ1bmVzY2FwZVJlZ2V4IiwidW5lc2NhcGVyTG9va3VwIiwia2V5U3Vic3RyaW5nIiwic3Vic3RyaW5nIiwiS2V5RXNjYXBlVXRpbHMiLCJfcHJvZEludmFyaWFudCIsImludmFyaWFudCIsIm9uZUFyZ3VtZW50UG9vbGVyIiwiY29weUZpZWxkc0Zyb20iLCJLbGFzcyIsImluc3RhbmNlUG9vbCIsImluc3RhbmNlIiwicG9wIiwidHdvQXJndW1lbnRQb29sZXIiLCJhMSIsImEyIiwidGhyZWVBcmd1bWVudFBvb2xlciIsImEzIiwiZm91ckFyZ3VtZW50UG9vbGVyIiwiYTQiLCJzdGFuZGFyZFJlbGVhc2VyIiwiZGVzdHJ1Y3RvciIsInBvb2xTaXplIiwicHVzaCIsIkRFRkFVTFRfUE9PTF9TSVpFIiwiREVGQVVMVF9QT09MRVIiLCJhZGRQb29saW5nVG8iLCJDb3B5Q29uc3RydWN0b3IiLCJwb29sZXIiLCJOZXdLbGFzcyIsImdldFBvb2xlZCIsInJlbGVhc2UiLCJQb29sZWRDbGFzcyIsIl9hc3NpZ24iLCJSZWFjdENoaWxkcmVuIiwiUmVhY3RDb21wb25lbnQiLCJSZWFjdFB1cmVDb21wb25lbnQiLCJSZWFjdENsYXNzIiwiUmVhY3RET01GYWN0b3JpZXMiLCJSZWFjdEVsZW1lbnQiLCJSZWFjdFByb3BUeXBlcyIsIlJlYWN0VmVyc2lvbiIsIm9ubHlDaGlsZCIsIndhcm5pbmciLCJjcmVhdGVFbGVtZW50IiwiY3JlYXRlRmFjdG9yeSIsImNsb25lRWxlbWVudCIsImNhbkRlZmluZVByb3BlcnR5IiwiUmVhY3RFbGVtZW50VmFsaWRhdG9yIiwiZGlkV2FyblByb3BUeXBlc0RlcHJlY2F0ZWQiLCJfX3NwcmVhZCIsIndhcm5lZCIsImFwcGx5IiwiYXJndW1lbnRzIiwiQ2hpbGRyZW4iLCJtYXAiLCJmb3JFYWNoIiwiY291bnQiLCJ0b0FycmF5Iiwib25seSIsIkNvbXBvbmVudCIsIlB1cmVDb21wb25lbnQiLCJpc1ZhbGlkRWxlbWVudCIsIlByb3BUeXBlcyIsImNyZWF0ZUNsYXNzIiwiY3JlYXRlTWl4aW4iLCJtaXhpbiIsIkRPTSIsInZlcnNpb24iLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImdldCIsImVtcHR5RnVuY3Rpb24iLCJ0cmF2ZXJzZUFsbENoaWxkcmVuIiwidXNlclByb3ZpZGVkS2V5RXNjYXBlUmVnZXgiLCJlc2NhcGVVc2VyUHJvdmlkZWRLZXkiLCJ0ZXh0IiwiRm9yRWFjaEJvb2tLZWVwaW5nIiwiZm9yRWFjaEZ1bmN0aW9uIiwiZm9yRWFjaENvbnRleHQiLCJmdW5jIiwiY29udGV4dCIsInByb3RvdHlwZSIsImZvckVhY2hTaW5nbGVDaGlsZCIsImJvb2tLZWVwaW5nIiwiY2hpbGQiLCJuYW1lIiwiZm9yRWFjaENoaWxkcmVuIiwiY2hpbGRyZW4iLCJmb3JFYWNoRnVuYyIsInRyYXZlcnNlQ29udGV4dCIsIk1hcEJvb2tLZWVwaW5nIiwibWFwUmVzdWx0Iiwia2V5UHJlZml4IiwibWFwRnVuY3Rpb24iLCJtYXBDb250ZXh0IiwicmVzdWx0IiwibWFwU2luZ2xlQ2hpbGRJbnRvQ29udGV4dCIsImNoaWxkS2V5IiwibWFwcGVkQ2hpbGQiLCJBcnJheSIsImlzQXJyYXkiLCJtYXBJbnRvV2l0aEtleVByZWZpeEludGVybmFsIiwidGhhdFJldHVybnNBcmd1bWVudCIsImNsb25lQW5kUmVwbGFjZUtleSIsImFycmF5IiwicHJlZml4IiwiZXNjYXBlZFByZWZpeCIsIm1hcENoaWxkcmVuIiwiZm9yRWFjaFNpbmdsZUNoaWxkRHVtbXkiLCJjb3VudENoaWxkcmVuIiwiUmVhY3RQcm9wVHlwZUxvY2F0aW9uTmFtZXMiLCJSZWFjdE5vb3BVcGRhdGVRdWV1ZSIsImVtcHR5T2JqZWN0IiwiTUlYSU5TX0tFWSIsImlkZW50aXR5IiwiZm4iLCJpbmplY3RlZE1peGlucyIsIlJlYWN0Q2xhc3NJbnRlcmZhY2UiLCJtaXhpbnMiLCJzdGF0aWNzIiwicHJvcFR5cGVzIiwiY29udGV4dFR5cGVzIiwiY2hpbGRDb250ZXh0VHlwZXMiLCJnZXREZWZhdWx0UHJvcHMiLCJnZXRJbml0aWFsU3RhdGUiLCJnZXRDaGlsZENvbnRleHQiLCJyZW5kZXIiLCJjb21wb25lbnRXaWxsTW91bnQiLCJjb21wb25lbnREaWRNb3VudCIsImNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMiLCJzaG91bGRDb21wb25lbnRVcGRhdGUiLCJjb21wb25lbnRXaWxsVXBkYXRlIiwiY29tcG9uZW50RGlkVXBkYXRlIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJ1cGRhdGVDb21wb25lbnQiLCJSRVNFUlZFRF9TUEVDX0tFWVMiLCJkaXNwbGF5TmFtZSIsIkNvbnN0cnVjdG9yIiwibWl4U3BlY0ludG9Db21wb25lbnQiLCJ2YWxpZGF0ZVR5cGVEZWYiLCJjcmVhdGVNZXJnZWRSZXN1bHRGdW5jdGlvbiIsIm1peFN0YXRpY1NwZWNJbnRvQ29tcG9uZW50IiwiYXV0b2JpbmQiLCJ0eXBlRGVmIiwibG9jYXRpb24iLCJwcm9wTmFtZSIsImhhc093blByb3BlcnR5IiwidmFsaWRhdGVNZXRob2RPdmVycmlkZSIsImlzQWxyZWFkeURlZmluZWQiLCJzcGVjUG9saWN5IiwiUmVhY3RDbGFzc01peGluIiwic3BlYyIsInR5cGVvZlNwZWMiLCJpc01peGluVmFsaWQiLCJwcm90byIsImF1dG9CaW5kUGFpcnMiLCJfX3JlYWN0QXV0b0JpbmRQYWlycyIsInByb3BlcnR5IiwiaXNSZWFjdENsYXNzTWV0aG9kIiwiaXNGdW5jdGlvbiIsInNob3VsZEF1dG9CaW5kIiwiY3JlYXRlQ2hhaW5lZEZ1bmN0aW9uIiwiaXNSZXNlcnZlZCIsImlzSW5oZXJpdGVkIiwibWVyZ2VJbnRvV2l0aE5vRHVwbGljYXRlS2V5cyIsIm9uZSIsInR3byIsInVuZGVmaW5lZCIsIm1lcmdlZFJlc3VsdCIsImIiLCJjIiwiY2hhaW5lZEZ1bmN0aW9uIiwiYmluZEF1dG9CaW5kTWV0aG9kIiwiY29tcG9uZW50IiwibWV0aG9kIiwiYm91bmRNZXRob2QiLCJiaW5kIiwiX19yZWFjdEJvdW5kQ29udGV4dCIsIl9fcmVhY3RCb3VuZE1ldGhvZCIsIl9fcmVhY3RCb3VuZEFyZ3VtZW50cyIsImNvbXBvbmVudE5hbWUiLCJjb25zdHJ1Y3RvciIsIl9iaW5kIiwibmV3VGhpcyIsIl9sZW4iLCJhcmdzIiwiX2tleSIsInJlYm91bmRNZXRob2QiLCJiaW5kQXV0b0JpbmRNZXRob2RzIiwicGFpcnMiLCJhdXRvQmluZEtleSIsInJlcGxhY2VTdGF0ZSIsIm5ld1N0YXRlIiwiY2FsbGJhY2siLCJ1cGRhdGVyIiwiZW5xdWV1ZVJlcGxhY2VTdGF0ZSIsImVucXVldWVDYWxsYmFjayIsImlzTW91bnRlZCIsIlJlYWN0Q2xhc3NDb21wb25lbnQiLCJkaWRXYXJuRGVwcmVjYXRlZCIsInByb3BzIiwicmVmcyIsInN0YXRlIiwiaW5pdGlhbFN0YXRlIiwiX2lzTW9ja0Z1bmN0aW9uIiwiZGVmYXVsdFByb3BzIiwiaXNSZWFjdENsYXNzQXBwcm92ZWQiLCJjb21wb25lbnRTaG91bGRVcGRhdGUiLCJjb21wb25lbnRXaWxsUmVjaWV2ZVByb3BzIiwibWV0aG9kTmFtZSIsImluamVjdGlvbiIsImluamVjdE1peGluIiwiaXNSZWFjdENvbXBvbmVudCIsInNldFN0YXRlIiwicGFydGlhbFN0YXRlIiwiZW5xdWV1ZVNldFN0YXRlIiwiZm9yY2VVcGRhdGUiLCJlbnF1ZXVlRm9yY2VVcGRhdGUiLCJkZXByZWNhdGVkQVBJcyIsImRlZmluZURlcHJlY2F0aW9uV2FybmluZyIsImluZm8iLCJmbk5hbWUiLCJSZWFjdEN1cnJlbnRPd25lciIsImlzTmF0aXZlIiwiZnVuY1RvU3RyaW5nIiwiRnVuY3Rpb24iLCJ0b1N0cmluZyIsInJlSXNOYXRpdmUiLCJSZWdFeHAiLCJzb3VyY2UiLCJ0ZXN0IiwiZXJyIiwiY2FuVXNlQ29sbGVjdGlvbnMiLCJmcm9tIiwiTWFwIiwia2V5cyIsIlNldCIsInNldEl0ZW0iLCJnZXRJdGVtIiwicmVtb3ZlSXRlbSIsImdldEl0ZW1JRHMiLCJhZGRSb290IiwicmVtb3ZlUm9vdCIsImdldFJvb3RJRHMiLCJpdGVtTWFwIiwicm9vdElEU2V0IiwiaWQiLCJpdGVtIiwic2V0IiwiYWRkIiwiaXRlbUJ5S2V5Iiwicm9vdEJ5S2V5IiwiZ2V0S2V5RnJvbUlEIiwiZ2V0SURGcm9tS2V5IiwicGFyc2VJbnQiLCJzdWJzdHIiLCJ1bm1vdW50ZWRJRHMiLCJwdXJnZURlZXAiLCJjaGlsZElEcyIsImRlc2NyaWJlQ29tcG9uZW50RnJhbWUiLCJvd25lck5hbWUiLCJmaWxlTmFtZSIsImxpbmVOdW1iZXIiLCJnZXREaXNwbGF5TmFtZSIsImVsZW1lbnQiLCJ0eXBlIiwiZGVzY3JpYmVJRCIsIlJlYWN0Q29tcG9uZW50VHJlZUhvb2siLCJnZXRFbGVtZW50Iiwib3duZXJJRCIsImdldE93bmVySUQiLCJfc291cmNlIiwib25TZXRDaGlsZHJlbiIsIm5leHRDaGlsZElEcyIsIm5leHRDaGlsZElEIiwibmV4dENoaWxkIiwicGFyZW50SUQiLCJvbkJlZm9yZU1vdW50Q29tcG9uZW50IiwidXBkYXRlQ291bnQiLCJvbkJlZm9yZVVwZGF0ZUNvbXBvbmVudCIsIm9uTW91bnRDb21wb25lbnQiLCJpc1Jvb3QiLCJvblVwZGF0ZUNvbXBvbmVudCIsIm9uVW5tb3VudENvbXBvbmVudCIsInB1cmdlVW5tb3VudGVkQ29tcG9uZW50cyIsIl9wcmV2ZW50UHVyZ2luZyIsImdldEN1cnJlbnRTdGFja0FkZGVuZHVtIiwidG9wRWxlbWVudCIsIm93bmVyIiwiX293bmVyIiwiZ2V0TmFtZSIsImN1cnJlbnRPd25lciIsImN1cnJlbnQiLCJfZGVidWdJRCIsImdldFN0YWNrQWRkZW5kdW1CeUlEIiwiZ2V0UGFyZW50SUQiLCJnZXRDaGlsZElEcyIsImdldFNvdXJjZSIsImdldFRleHQiLCJnZXRVcGRhdGVDb3VudCIsImdldFJlZ2lzdGVyZWRJRHMiLCJjcmVhdGVET01GYWN0b3J5IiwiYWJiciIsImFkZHJlc3MiLCJhcmVhIiwiYXJ0aWNsZSIsImFzaWRlIiwiYXVkaW8iLCJiYXNlIiwiYmRpIiwiYmRvIiwiYmlnIiwiYmxvY2txdW90ZSIsImJvZHkiLCJiciIsImJ1dHRvbiIsImNhbnZhcyIsImNhcHRpb24iLCJjaXRlIiwiY29sIiwiY29sZ3JvdXAiLCJkYXRhIiwiZGF0YWxpc3QiLCJkZCIsImRlbCIsImRldGFpbHMiLCJkZm4iLCJkaWFsb2ciLCJkaXYiLCJkbCIsImR0IiwiZW0iLCJlbWJlZCIsImZpZWxkc2V0IiwiZmlnY2FwdGlvbiIsImZpZ3VyZSIsImZvb3RlciIsImZvcm0iLCJoMSIsImgyIiwiaDMiLCJoNCIsImg1IiwiaDYiLCJoZWFkIiwiaGVhZGVyIiwiaGdyb3VwIiwiaHIiLCJodG1sIiwiaWZyYW1lIiwiaW1nIiwiaW5wdXQiLCJpbnMiLCJrYmQiLCJrZXlnZW4iLCJsYWJlbCIsImxlZ2VuZCIsImxpIiwibGluayIsIm1haW4iLCJtYXJrIiwibWVudSIsIm1lbnVpdGVtIiwibWV0YSIsIm1ldGVyIiwibmF2Iiwibm9zY3JpcHQiLCJvYmplY3QiLCJvbCIsIm9wdGdyb3VwIiwib3B0aW9uIiwib3V0cHV0IiwicCIsInBhcmFtIiwicGljdHVyZSIsInByZSIsInByb2dyZXNzIiwicSIsInJwIiwicnQiLCJydWJ5Iiwic2FtcCIsInNjcmlwdCIsInNlY3Rpb24iLCJzZWxlY3QiLCJzbWFsbCIsInNwYW4iLCJzdHJvbmciLCJzdHlsZSIsInN1YiIsInN1bW1hcnkiLCJzdXAiLCJ0YWJsZSIsInRib2R5IiwidGQiLCJ0ZXh0YXJlYSIsInRmb290IiwidGgiLCJ0aGVhZCIsInRpbWUiLCJ0aXRsZSIsInRyIiwidHJhY2siLCJ1bCIsInZpZGVvIiwid2JyIiwiY2lyY2xlIiwiY2xpcFBhdGgiLCJkZWZzIiwiZWxsaXBzZSIsImltYWdlIiwibGluZSIsImxpbmVhckdyYWRpZW50IiwibWFzayIsInBhdGgiLCJwYXR0ZXJuIiwicG9seWdvbiIsInBvbHlsaW5lIiwicmFkaWFsR3JhZGllbnQiLCJyZWN0Iiwic3RvcCIsInN2ZyIsInRzcGFuIiwiUkVBQ1RfRUxFTUVOVF9UWVBFIiwiUkVTRVJWRURfUFJPUFMiLCJyZWYiLCJfX3NlbGYiLCJfX3NvdXJjZSIsInNwZWNpYWxQcm9wS2V5V2FybmluZ1Nob3duIiwic3BlY2lhbFByb3BSZWZXYXJuaW5nU2hvd24iLCJoYXNWYWxpZFJlZiIsImNvbmZpZyIsImdldHRlciIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImlzUmVhY3RXYXJuaW5nIiwiaGFzVmFsaWRLZXkiLCJkZWZpbmVLZXlQcm9wV2FybmluZ0dldHRlciIsIndhcm5BYm91dEFjY2Vzc2luZ0tleSIsImNvbmZpZ3VyYWJsZSIsImRlZmluZVJlZlByb3BXYXJuaW5nR2V0dGVyIiwid2FybkFib3V0QWNjZXNzaW5nUmVmIiwiJCR0eXBlb2YiLCJfc3RvcmUiLCJlbnVtZXJhYmxlIiwid3JpdGFibGUiLCJ2YWx1ZSIsInZhbGlkYXRlZCIsIl9zZWxmIiwiZnJlZXplIiwiY2hpbGRyZW5MZW5ndGgiLCJjaGlsZEFycmF5IiwiZmFjdG9yeSIsIm9sZEVsZW1lbnQiLCJuZXdLZXkiLCJuZXdFbGVtZW50IiwiU3ltYm9sIiwiY2hlY2tSZWFjdFR5cGVTcGVjIiwiZ2V0SXRlcmF0b3JGbiIsImdldERlY2xhcmF0aW9uRXJyb3JBZGRlbmR1bSIsImdldFNvdXJjZUluZm9FcnJvckFkZGVuZHVtIiwiZWxlbWVudFByb3BzIiwib3duZXJIYXNLZXlVc2VXYXJuaW5nIiwiZ2V0Q3VycmVudENvbXBvbmVudEVycm9ySW5mbyIsInBhcmVudFR5cGUiLCJwYXJlbnROYW1lIiwidmFsaWRhdGVFeHBsaWNpdEtleSIsIm1lbW9pemVyIiwidW5pcXVlS2V5IiwiY3VycmVudENvbXBvbmVudEVycm9ySW5mbyIsImNoaWxkT3duZXIiLCJ2YWxpZGF0ZUNoaWxkS2V5cyIsIm5vZGUiLCJpdGVyYXRvckZuIiwiZW50cmllcyIsIml0ZXJhdG9yIiwic3RlcCIsIm5leHQiLCJkb25lIiwidmFsaWRhdGVQcm9wVHlwZXMiLCJjb21wb25lbnRDbGFzcyIsInZhbGlkVHlwZSIsInNvdXJjZUluZm8iLCJ2YWxpZGF0ZWRGYWN0b3J5Iiwid2Fybk5vb3AiLCJwdWJsaWNJbnN0YW5jZSIsImNhbGxlck5hbWUiLCJjb21wbGV0ZVN0YXRlIiwicHJvcCIsImNoaWxkQ29udGV4dCIsIl9yZXF1aXJlIiwiUmVhY3RQcm9wVHlwZXNTZWNyZXQiLCJDb21wb25lbnREdW1teSIsImlzUHVyZVJlYWN0Q29tcG9uZW50IiwiUmVhY3RVTURFbnRyeSIsIl9fU0VDUkVUX0lOVEVSTkFMU19ET19OT1RfVVNFX09SX1lPVV9XSUxMX0JFX0ZJUkVEIiwiZ2V0TmV4dERlYnVnSUQiLCJ4IiwicHJvY2VzcyIsImVudiIsImxvZ2dlZFR5cGVGYWlsdXJlcyIsInR5cGVTcGVjcyIsInZhbHVlcyIsImRlYnVnSUQiLCJ0eXBlU3BlY05hbWUiLCJlcnJvciIsImV4IiwibWVzc2FnZSIsImNvbXBvbmVudFN0YWNrSW5mbyIsIklURVJBVE9SX1NZTUJPTCIsIkZBVVhfSVRFUkFUT1JfU1lNQk9MIiwibWF5YmVJdGVyYWJsZSIsIm5leHREZWJ1Z0lEIiwicmVhY3RQcm9kSW52YXJpYW50IiwiYXJnQ291bnQiLCJhcmdJZHgiLCJlbmNvZGVVUklDb21wb25lbnQiLCJmcmFtZXNUb1BvcCIsIlNFUEFSQVRPUiIsIlNVQlNFUEFSQVRPUiIsImRpZFdhcm5BYm91dE1hcHMiLCJnZXRDb21wb25lbnRLZXkiLCJpbmRleCIsInRyYXZlcnNlQWxsQ2hpbGRyZW5JbXBsIiwibmFtZVNvRmFyIiwibmV4dE5hbWUiLCJzdWJ0cmVlQ291bnQiLCJuZXh0TmFtZVByZWZpeCIsImlpIiwibWFwc0FzQ2hpbGRyZW5BZGRlbmR1bSIsIm1hcHNBc0NoaWxkcmVuT3duZXJOYW1lIiwiZW50cnkiLCJhZGRlbmR1bSIsIl9pc1JlYWN0RWxlbWVudCIsImNoaWxkcmVuU3RyaW5nIiwiU3RyaW5nIiwiam9pbiIsIm1ha2VFbXB0eUZ1bmN0aW9uIiwiYXJnIiwidGhhdFJldHVybnMiLCJ0aGF0UmV0dXJuc0ZhbHNlIiwidGhhdFJldHVybnNUcnVlIiwidGhhdFJldHVybnNOdWxsIiwidGhhdFJldHVybnNUaGlzIiwidmFsaWRhdGVGb3JtYXQiLCJmb3JtYXQiLCJjb25kaXRpb24iLCJkIiwiYXJnSW5kZXgiLCJwcmludFdhcm5pbmciLCJjb25zb2xlIiwiaW5kZXhPZiIsIl9sZW4yIiwiX2tleTIiLCJjb25jYXQiLCJnZXRPd25Qcm9wZXJ0eVN5bWJvbHMiLCJwcm9wSXNFbnVtZXJhYmxlIiwicHJvcGVydHlJc0VudW1lcmFibGUiLCJ0b09iamVjdCIsInZhbCIsIlR5cGVFcnJvciIsInNob3VsZFVzZU5hdGl2ZSIsImFzc2lnbiIsInRlc3QxIiwiZ2V0T3duUHJvcGVydHlOYW1lcyIsInRlc3QyIiwiZnJvbUNoYXJDb2RlIiwib3JkZXIyIiwidGVzdDMiLCJzcGxpdCIsImxldHRlciIsInRhcmdldCIsInRvIiwic3ltYm9scyIsImNoZWNrUHJvcFR5cGVzIiwiZ2V0U3RhY2siLCJzdGFjayIsInRocm93T25EaXJlY3RBY2Nlc3MiLCJBTk9OWU1PVVMiLCJjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlciIsImJvb2wiLCJudW1iZXIiLCJzdHJpbmciLCJzeW1ib2wiLCJhbnkiLCJjcmVhdGVBbnlUeXBlQ2hlY2tlciIsImFycmF5T2YiLCJjcmVhdGVBcnJheU9mVHlwZUNoZWNrZXIiLCJjcmVhdGVFbGVtZW50VHlwZUNoZWNrZXIiLCJpbnN0YW5jZU9mIiwiY3JlYXRlSW5zdGFuY2VUeXBlQ2hlY2tlciIsImNyZWF0ZU5vZGVDaGVja2VyIiwib2JqZWN0T2YiLCJjcmVhdGVPYmplY3RPZlR5cGVDaGVja2VyIiwib25lT2YiLCJjcmVhdGVFbnVtVHlwZUNoZWNrZXIiLCJvbmVPZlR5cGUiLCJjcmVhdGVVbmlvblR5cGVDaGVja2VyIiwic2hhcGUiLCJjcmVhdGVTaGFwZVR5cGVDaGVja2VyIiwiaXMiLCJ5IiwiUHJvcFR5cGVFcnJvciIsImNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyIiwidmFsaWRhdGUiLCJtYW51YWxQcm9wVHlwZUNhbGxDYWNoZSIsImNoZWNrVHlwZSIsImlzUmVxdWlyZWQiLCJwcm9wRnVsbE5hbWUiLCJzZWNyZXQiLCJjYWNoZUtleSIsImNoYWluZWRDaGVja1R5cGUiLCJleHBlY3RlZFR5cGUiLCJwcm9wVmFsdWUiLCJwcm9wVHlwZSIsImdldFByb3BUeXBlIiwicHJlY2lzZVR5cGUiLCJnZXRQcmVjaXNlVHlwZSIsInR5cGVDaGVja2VyIiwiZXhwZWN0ZWRDbGFzcyIsImV4cGVjdGVkQ2xhc3NOYW1lIiwiYWN0dWFsQ2xhc3NOYW1lIiwiZ2V0Q2xhc3NOYW1lIiwiZXhwZWN0ZWRWYWx1ZXMiLCJ2YWx1ZXNTdHJpbmciLCJKU09OIiwic3RyaW5naWZ5IiwiYXJyYXlPZlR5cGVDaGVja2VycyIsImNoZWNrZXIiLCJpc05vZGUiLCJzaGFwZVR5cGVzIiwiZXZlcnkiLCJpc1N5bWJvbCIsIkRhdGUiXSwibWFwcGluZ3MiOiJBQUFDOzs7QUFHRCxDQUFDLFVBQVNBLENBQVQsRUFBVztBQUFDLE1BQUcsT0FBT0MsT0FBUCxLQUFpQixRQUFqQixJQUEyQixPQUFPQyxNQUFQLEtBQWdCLFdBQTlDLEVBQTBEO0FBQUNBLFdBQU9ELE9BQVAsR0FBZUQsR0FBZjtBQUFtQixHQUE5RSxNQUFtRixJQUFHLE9BQU9HLE1BQVAsS0FBZ0IsVUFBaEIsSUFBNEJBLE9BQU9DLEdBQXRDLEVBQTBDO0FBQUNELFdBQU8sRUFBUCxFQUFVSCxDQUFWO0FBQWEsR0FBeEQsTUFBNEQ7QUFBQyxRQUFJSyxDQUFKLENBQU0sSUFBRyxPQUFPQyxNQUFQ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QSxjQUFQO0FBQ0QsT0FyY0Q7QUF1Y0MsS0ExZGUsRUEwZGQsRUFBQyxNQUFLLEVBQU4sRUFBUyxNQUFLLEVBQWQsRUFBaUIsTUFBSyxFQUF0QixFQUF5QixNQUFLLEVBQTlCLEVBQWlDLE1BQUssRUFBdEMsRUExZGMsQ0FwNkd3eEIsRUE4M0gzdkIsSUFBRyxDQUFDLFVBQVNqRCxPQUFULEVBQWlCdkIsTUFBakIsRUFBd0JELE9BQXhCLEVBQWdDO0FBQ2pGOzs7Ozs7Ozs7QUFTQTs7QUFFQSxVQUFJNGdCLHVCQUF1Qiw4Q0FBM0I7O0FBRUEzZ0IsYUFBT0QsT0FBUCxHQUFpQjRnQixvQkFBakI7QUFFQyxLQWhCK0MsRUFnQjlDLEVBaEI4QyxDQTkzSHd2QixFQUEzYixFQTg0SHRXLEVBOTRIc1csRUE4NEhuVyxDQUFDLEVBQUQsQ0E5NEhtVyxFQTg0SDdWLEVBOTRINlYsQ0FBUDtBQSs0SHJXLENBLzRIRCIsImZpbGUiOiJyZWFjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiAvKipcbiAgKiBSZWFjdCB2MTUuNS40XG4gICovXG4oZnVuY3Rpb24oZil7aWYodHlwZW9mIGV4cG9ydHM9PT1cIm9iamVjdFwiJiZ0eXBlb2YgbW9kdWxlIT09XCJ1bmRlZmluZWRcIil7bW9kdWxlLmV4cG9ydHM9ZigpfWVsc2UgaWYodHlwZW9mIGRlZmluZT09PVwiZnVuY3Rpb25cIiYmZGVmaW5lLmFtZCl7ZGVmaW5lKFtdLGYpfWVsc2V7dmFyIGc7aWYodHlwZW9mIHdpbmRvdyE9PVwidW5kZWZpbmVkXCIpe2c9d2luZG93fWVsc2UgaWYodHlwZW9mIGdsb2JhbCE9PVwidW5kZWZpbmVkXCIpe2c9Z2xvYmFsfWVsc2UgaWYodHlwZW9mIHNlbGYhPT1cInVuZGVmaW5lZFwiKXtnPXNlbGZ9ZWxzZXtnPXRoaXN9Zy5SZWFjdCA9IGYoKX19KShmdW5jdGlvbigpe3ZhciBkZWZpbmUsbW9kdWxlLGV4cG9ydHM7cmV0dXJuIChmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pKHsxOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcbi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIFxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBFc2NhcGUgYW5kIHdyYXAga2V5IHNvIGl0IGlzIHNhZmUgdG8gdXNlIGFzIGEgcmVhY3RpZFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgdG8gYmUgZXNjYXBlZC5cbiAqIEByZXR1cm4ge3N0cmluZ30gdGhlIGVzY2FwZWQga2V5LlxuICovXG5cbmZ1bmN0aW9uIGVzY2FwZShrZXkpIHtcbiAgdmFyIGVzY2FwZVJlZ2V4ID0gL1s9Ol0vZztcbiAgdmFyIGVzY2FwZXJMb29rdXAgPSB7XG4gICAgJz0nOiAnPTAnLFxuICAgICc6JzogJz0yJ1xuICB9O1xuICB2YXIgZXNjYXBlZFN0cmluZyA9ICgnJyArIGtleSkucmVwbGFjZShlc2NhcGVSZWdleCwgZnVuY3Rpb24gKG1hdGNoKSB7XG4gICAgcmV0dXJuIGVzY2FwZXJMb29rdXBbbWF0Y2hdO1xuICB9KTtcblxuICByZXR1cm4gJyQnICsgZXNjYXBlZFN0cmluZztcbn1cblxuLyoqXG4gKiBVbmVzY2FwZSBhbmQgdW53cmFwIGtleSBmb3IgaHVtYW4tcmVhZGFibGUgZGlzcGxheVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgdG8gdW5lc2NhcGUuXG4gKiBAcmV0dXJuIHtzdHJpbmd9IHRoZSB1bmVzY2FwZWQga2V5LlxuICovXG5mdW5jdGlvbiB1bmVzY2FwZShrZXkpIHtcbiAgdmFyIHVuZXNjYXBlUmVnZXggPSAvKD0wfD0yKS9nO1xuICB2YXIgdW5lc2NhcGVyTG9va3VwID0ge1xuICAgICc9MCc6ICc9JyxcbiAgICAnPTInOiAnOidcbiAgfTtcbiAgdmFyIGtleVN1YnN0cmluZyA9IGtleVswXSA9PT0gJy4nICYmIGtleVsxXSA9PT0gJyQnID8ga2V5LnN1YnN0cmluZygyKSA6IGtleS5zdWJzdHJpbmcoMSk7XG5cbiAgcmV0dXJuICgnJyArIGtleVN1YnN0cmluZykucmVwbGFjZSh1bmVzY2FwZVJlZ2V4LCBmdW5jdGlvbiAobWF0Y2gpIHtcbiAgICByZXR1cm4gdW5lc2NhcGVyTG9va3VwW21hdGNoXTtcbiAgfSk7XG59XG5cbnZhciBLZXlFc2NhcGVVdGlscyA9IHtcbiAgZXNjYXBlOiBlc2NhcGUsXG4gIHVuZXNjYXBlOiB1bmVzY2FwZVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBLZXlFc2NhcGVVdGlscztcbn0se31dLDI6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xuLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgX3Byb2RJbnZhcmlhbnQgPSBfZGVyZXFfKDI1KTtcblxudmFyIGludmFyaWFudCA9IF9kZXJlcV8oMjkpO1xuXG4vKipcbiAqIFN0YXRpYyBwb29sZXJzLiBTZXZlcmFsIGN1c3RvbSB2ZXJzaW9ucyBmb3IgZWFjaCBwb3RlbnRpYWwgbnVtYmVyIG9mXG4gKiBhcmd1bWVudHMuIEEgY29tcGxldGVseSBnZW5lcmljIHBvb2xlciBpcyBlYXN5IHRvIGltcGxlbWVudCwgYnV0IHdvdWxkXG4gKiByZXF1aXJlIGFjY2Vzc2luZyB0aGUgYGFyZ3VtZW50c2Agb2JqZWN0LiBJbiBlYWNoIG9mIHRoZXNlLCBgdGhpc2AgcmVmZXJzIHRvXG4gKiB0aGUgQ2xhc3MgaXRzZWxmLCBub3QgYW4gaW5zdGFuY2UuIElmIGFueSBvdGhlcnMgYXJlIG5lZWRlZCwgc2ltcGx5IGFkZCB0aGVtXG4gKiBoZXJlLCBvciBpbiB0aGVpciBvd24gZmlsZXMuXG4gKi9cbnZhciBvbmVBcmd1bWVudFBvb2xlciA9IGZ1bmN0aW9uIChjb3B5RmllbGRzRnJvbSkge1xuICB2YXIgS2xhc3MgPSB0aGlzO1xuICBpZiAoS2xhc3MuaW5zdGFuY2VQb29sLmxlbmd0aCkge1xuICAgIHZhciBpbnN0YW5jZSA9IEtsYXNzLmluc3RhbmNlUG9vbC5wb3AoKTtcbiAgICBLbGFzcy5jYWxsKGluc3RhbmNlLCBjb3B5RmllbGRzRnJvbSk7XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgS2xhc3MoY29weUZpZWxkc0Zyb20pO1xuICB9XG59O1xuXG52YXIgdHdvQXJndW1lbnRQb29sZXIgPSBmdW5jdGlvbiAoYTEsIGEyKSB7XG4gIHZhciBLbGFzcyA9IHRoaXM7XG4gIGlmIChLbGFzcy5pbnN0YW5jZVBvb2wubGVuZ3RoKSB7XG4gICAgdmFyIGluc3RhbmNlID0gS2xhc3MuaW5zdGFuY2VQb29sLnBvcCgpO1xuICAgIEtsYXNzLmNhbGwoaW5zdGFuY2UsIGExLCBhMik7XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgS2xhc3MoYTEsIGEyKTtcbiAgfVxufTtcblxudmFyIHRocmVlQXJndW1lbnRQb29sZXIgPSBmdW5jdGlvbiAoYTEsIGEyLCBhMykge1xuICB2YXIgS2xhc3MgPSB0aGlzO1xuICBpZiAoS2xhc3MuaW5zdGFuY2VQb29sLmxlbmd0aCkge1xuICAgIHZhciBpbnN0YW5jZSA9IEtsYXNzLmluc3RhbmNlUG9vbC5wb3AoKTtcbiAgICBLbGFzcy5jYWxsKGluc3RhbmNlLCBhMSwgYTIsIGEzKTtcbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBLbGFzcyhhMSwgYTIsIGEzKTtcbiAgfVxufTtcblxudmFyIGZvdXJBcmd1bWVudFBvb2xlciA9IGZ1bmN0aW9uIChhMSwgYTIsIGEzLCBhNCkge1xuICB2YXIgS2xhc3MgPSB0aGlzO1xuICBpZiAoS2xhc3MuaW5zdGFuY2VQb29sLmxlbmd0aCkge1xuICAgIHZhciBpbnN0YW5jZSA9IEtsYXNzLmluc3RhbmNlUG9vbC5wb3AoKTtcbiAgICBLbGFzcy5jYWxsKGluc3RhbmNlLCBhMSwgYTIsIGEzLCBhNCk7XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgS2xhc3MoYTEsIGEyLCBhMywgYTQpO1xuICB9XG59O1xuXG52YXIgc3RhbmRhcmRSZWxlYXNlciA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICB2YXIgS2xhc3MgPSB0aGlzO1xuICAhKGluc3RhbmNlIGluc3RhbmNlb2YgS2xhc3MpID8gXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdUcnlpbmcgdG8gcmVsZWFzZSBhbiBpbnN0YW5jZSBpbnRvIGEgcG9vbCBvZiBhIGRpZmZlcmVudCB0eXBlLicpIDogX3Byb2RJbnZhcmlhbnQoJzI1JykgOiB2b2lkIDA7XG4gIGluc3RhbmNlLmRlc3RydWN0b3IoKTtcbiAgaWYgKEtsYXNzLmluc3RhbmNlUG9vbC5sZW5ndGggPCBLbGFzcy5wb29sU2l6ZSkge1xuICAgIEtsYXNzLmluc3RhbmNlUG9vbC5wdXNoKGluc3RhbmNlKTtcbiAgfVxufTtcblxudmFyIERFRkFVTFRfUE9PTF9TSVpFID0gMTA7XG52YXIgREVGQVVMVF9QT09MRVIgPSBvbmVBcmd1bWVudFBvb2xlcjtcblxuLyoqXG4gKiBBdWdtZW50cyBgQ29weUNvbnN0cnVjdG9yYCB0byBiZSBhIHBvb2xhYmxlIGNsYXNzLCBhdWdtZW50aW5nIG9ubHkgdGhlIGNsYXNzXG4gKiBpdHNlbGYgKHN0YXRpY2FsbHkpIG5vdCBhZGRpbmcgYW55IHByb3RvdHlwaWNhbCBmaWVsZHMuIEFueSBDb3B5Q29uc3RydWN0b3JcbiAqIHlvdSBnaXZlIHRoaXMgbWF5IGhhdmUgYSBgcG9vbFNpemVgIHByb3BlcnR5LCBhbmQgd2lsbCBsb29rIGZvciBhXG4gKiBwcm90b3R5cGljYWwgYGRlc3RydWN0b3JgIG9uIGluc3RhbmNlcy5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBDb3B5Q29uc3RydWN0b3IgQ29uc3RydWN0b3IgdGhhdCBjYW4gYmUgdXNlZCB0byByZXNldC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHBvb2xlciBDdXN0b21pemFibGUgcG9vbGVyLlxuICovXG52YXIgYWRkUG9vbGluZ1RvID0gZnVuY3Rpb24gKENvcHlDb25zdHJ1Y3RvciwgcG9vbGVyKSB7XG4gIC8vIENhc3RpbmcgYXMgYW55IHNvIHRoYXQgZmxvdyBpZ25vcmVzIHRoZSBhY3R1YWwgaW1wbGVtZW50YXRpb24gYW5kIHRydXN0c1xuICAvLyBpdCB0byBtYXRjaCB0aGUgdHlwZSB3ZSBkZWNsYXJlZFxuICB2YXIgTmV3S2xhc3MgPSBDb3B5Q29uc3RydWN0b3I7XG4gIE5ld0tsYXNzLmluc3RhbmNlUG9vbCA9IFtdO1xuICBOZXdLbGFzcy5nZXRQb29sZWQgPSBwb29sZXIgfHwgREVGQVVMVF9QT09MRVI7XG4gIGlmICghTmV3S2xhc3MucG9vbFNpemUpIHtcbiAgICBOZXdLbGFzcy5wb29sU2l6ZSA9IERFRkFVTFRfUE9PTF9TSVpFO1xuICB9XG4gIE5ld0tsYXNzLnJlbGVhc2UgPSBzdGFuZGFyZFJlbGVhc2VyO1xuICByZXR1cm4gTmV3S2xhc3M7XG59O1xuXG52YXIgUG9vbGVkQ2xhc3MgPSB7XG4gIGFkZFBvb2xpbmdUbzogYWRkUG9vbGluZ1RvLFxuICBvbmVBcmd1bWVudFBvb2xlcjogb25lQXJndW1lbnRQb29sZXIsXG4gIHR3b0FyZ3VtZW50UG9vbGVyOiB0d29Bcmd1bWVudFBvb2xlcixcbiAgdGhyZWVBcmd1bWVudFBvb2xlcjogdGhyZWVBcmd1bWVudFBvb2xlcixcbiAgZm91ckFyZ3VtZW50UG9vbGVyOiBmb3VyQXJndW1lbnRQb29sZXJcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUG9vbGVkQ2xhc3M7XG59LHtcIjI1XCI6MjUsXCIyOVwiOjI5fV0sMzpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG4vKipcbiAqIENvcHlyaWdodCAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2Fzc2lnbiA9IF9kZXJlcV8oMzEpO1xuXG52YXIgUmVhY3RDaGlsZHJlbiA9IF9kZXJlcV8oNCk7XG52YXIgUmVhY3RDb21wb25lbnQgPSBfZGVyZXFfKDYpO1xudmFyIFJlYWN0UHVyZUNvbXBvbmVudCA9IF9kZXJlcV8oMTcpO1xudmFyIFJlYWN0Q2xhc3MgPSBfZGVyZXFfKDUpO1xudmFyIFJlYWN0RE9NRmFjdG9yaWVzID0gX2RlcmVxXyg5KTtcbnZhciBSZWFjdEVsZW1lbnQgPSBfZGVyZXFfKDEwKTtcbnZhciBSZWFjdFByb3BUeXBlcyA9IF9kZXJlcV8oMTUpO1xudmFyIFJlYWN0VmVyc2lvbiA9IF9kZXJlcV8oMTkpO1xuXG52YXIgb25seUNoaWxkID0gX2RlcmVxXygyNCk7XG52YXIgd2FybmluZyA9IF9kZXJlcV8oMzApO1xuXG52YXIgY3JlYXRlRWxlbWVudCA9IFJlYWN0RWxlbWVudC5jcmVhdGVFbGVtZW50O1xudmFyIGNyZWF0ZUZhY3RvcnkgPSBSZWFjdEVsZW1lbnQuY3JlYXRlRmFjdG9yeTtcbnZhciBjbG9uZUVsZW1lbnQgPSBSZWFjdEVsZW1lbnQuY2xvbmVFbGVtZW50O1xuXG5pZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFyIGNhbkRlZmluZVByb3BlcnR5ID0gX2RlcmVxXygyMCk7XG4gIHZhciBSZWFjdEVsZW1lbnRWYWxpZGF0b3IgPSBfZGVyZXFfKDEyKTtcbiAgdmFyIGRpZFdhcm5Qcm9wVHlwZXNEZXByZWNhdGVkID0gZmFsc2U7XG4gIGNyZWF0ZUVsZW1lbnQgPSBSZWFjdEVsZW1lbnRWYWxpZGF0b3IuY3JlYXRlRWxlbWVudDtcbiAgY3JlYXRlRmFjdG9yeSA9IFJlYWN0RWxlbWVudFZhbGlkYXRvci5jcmVhdGVGYWN0b3J5O1xuICBjbG9uZUVsZW1lbnQgPSBSZWFjdEVsZW1lbnRWYWxpZGF0b3IuY2xvbmVFbGVtZW50O1xufVxuXG52YXIgX19zcHJlYWQgPSBfYXNzaWduO1xuXG5pZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFyIHdhcm5lZCA9IGZhbHNlO1xuICBfX3NwcmVhZCA9IGZ1bmN0aW9uICgpIHtcbiAgICBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcod2FybmVkLCAnUmVhY3QuX19zcHJlYWQgaXMgZGVwcmVjYXRlZCBhbmQgc2hvdWxkIG5vdCBiZSB1c2VkLiBVc2UgJyArICdPYmplY3QuYXNzaWduIGRpcmVjdGx5IG9yIGFub3RoZXIgaGVscGVyIGZ1bmN0aW9uIHdpdGggc2ltaWxhciAnICsgJ3NlbWFudGljcy4gWW91IG1heSBiZSBzZWVpbmcgdGhpcyB3YXJuaW5nIGR1ZSB0byB5b3VyIGNvbXBpbGVyLiAnICsgJ1NlZSBodHRwczovL2ZiLm1lL3JlYWN0LXNwcmVhZC1kZXByZWNhdGlvbiBmb3IgbW9yZSBkZXRhaWxzLicpIDogdm9pZCAwO1xuICAgIHdhcm5lZCA9IHRydWU7XG4gICAgcmV0dXJuIF9hc3NpZ24uYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgfTtcbn1cblxudmFyIFJlYWN0ID0ge1xuXG4gIC8vIE1vZGVyblxuXG4gIENoaWxkcmVuOiB7XG4gICAgbWFwOiBSZWFjdENoaWxkcmVuLm1hcCxcbiAgICBmb3JFYWNoOiBSZWFjdENoaWxkcmVuLmZvckVhY2gsXG4gICAgY291bnQ6IFJlYWN0Q2hpbGRyZW4uY291bnQsXG4gICAgdG9BcnJheTogUmVhY3RDaGlsZHJlbi50b0FycmF5LFxuICAgIG9ubHk6IG9ubHlDaGlsZFxuICB9LFxuXG4gIENvbXBvbmVudDogUmVhY3RDb21wb25lbnQsXG4gIFB1cmVDb21wb25lbnQ6IFJlYWN0UHVyZUNvbXBvbmVudCxcblxuICBjcmVhdGVFbGVtZW50OiBjcmVhdGVFbGVtZW50LFxuICBjbG9uZUVsZW1lbnQ6IGNsb25lRWxlbWVudCxcbiAgaXNWYWxpZEVsZW1lbnQ6IFJlYWN0RWxlbWVudC5pc1ZhbGlkRWxlbWVudCxcblxuICAvLyBDbGFzc2ljXG5cbiAgUHJvcFR5cGVzOiBSZWFjdFByb3BUeXBlcyxcbiAgY3JlYXRlQ2xhc3M6IFJlYWN0Q2xhc3MuY3JlYXRlQ2xhc3MsXG4gIGNyZWF0ZUZhY3Rvcnk6IGNyZWF0ZUZhY3RvcnksXG4gIGNyZWF0ZU1peGluOiBmdW5jdGlvbiAobWl4aW4pIHtcbiAgICAvLyBDdXJyZW50bHkgYSBub29wLiBXaWxsIGJlIHVzZWQgdG8gdmFsaWRhdGUgYW5kIHRyYWNlIG1peGlucy5cbiAgICByZXR1cm4gbWl4aW47XG4gIH0sXG5cbiAgLy8gVGhpcyBsb29rcyBET00gc3BlY2lmaWMgYnV0IHRoZXNlIGFyZSBhY3R1YWxseSBpc29tb3JwaGljIGhlbHBlcnNcbiAgLy8gc2luY2UgdGhleSBhcmUganVzdCBnZW5lcmF0aW5nIERPTSBzdHJpbmdzLlxuICBET006IFJlYWN0RE9NRmFjdG9yaWVzLFxuXG4gIHZlcnNpb246IFJlYWN0VmVyc2lvbixcblxuICAvLyBEZXByZWNhdGVkIGhvb2sgZm9yIEpTWCBzcHJlYWQsIGRvbid0IHVzZSB0aGlzIGZvciBhbnl0aGluZy5cbiAgX19zcHJlYWQ6IF9fc3ByZWFkXG59O1xuXG4vLyBUT0RPOiBGaXggdGVzdHMgc28gdGhhdCB0aGlzIGRlcHJlY2F0aW9uIHdhcm5pbmcgZG9lc24ndCBjYXVzZSBmYWlsdXJlcy5cbmlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJykge1xuICBpZiAoY2FuRGVmaW5lUHJvcGVydHkpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUmVhY3QsICdQcm9wVHlwZXMnLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGRpZFdhcm5Qcm9wVHlwZXNEZXByZWNhdGVkLCAnQWNjZXNzaW5nIFByb3BUeXBlcyB2aWEgdGhlIG1haW4gUmVhY3QgcGFja2FnZSBpcyBkZXByZWNhdGVkLiBVc2UgJyArICd0aGUgcHJvcC10eXBlcyBwYWNrYWdlIGZyb20gbnBtIGluc3RlYWQuJykgOiB2b2lkIDA7XG4gICAgICAgIGRpZFdhcm5Qcm9wVHlwZXNEZXByZWNhdGVkID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIFJlYWN0UHJvcFR5cGVzO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3Q7XG59LHtcIjEwXCI6MTAsXCIxMlwiOjEyLFwiMTVcIjoxNSxcIjE3XCI6MTcsXCIxOVwiOjE5LFwiMjBcIjoyMCxcIjI0XCI6MjQsXCIzMFwiOjMwLFwiMzFcIjozMSxcIjRcIjo0LFwiNVwiOjUsXCI2XCI6NixcIjlcIjo5fV0sNDpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG4vKipcbiAqIENvcHlyaWdodCAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUG9vbGVkQ2xhc3MgPSBfZGVyZXFfKDIpO1xudmFyIFJlYWN0RWxlbWVudCA9IF9kZXJlcV8oMTApO1xuXG52YXIgZW1wdHlGdW5jdGlvbiA9IF9kZXJlcV8oMjcpO1xudmFyIHRyYXZlcnNlQWxsQ2hpbGRyZW4gPSBfZGVyZXFfKDI2KTtcblxudmFyIHR3b0FyZ3VtZW50UG9vbGVyID0gUG9vbGVkQ2xhc3MudHdvQXJndW1lbnRQb29sZXI7XG52YXIgZm91ckFyZ3VtZW50UG9vbGVyID0gUG9vbGVkQ2xhc3MuZm91ckFyZ3VtZW50UG9vbGVyO1xuXG52YXIgdXNlclByb3ZpZGVkS2V5RXNjYXBlUmVnZXggPSAvXFwvKy9nO1xuZnVuY3Rpb24gZXNjYXBlVXNlclByb3ZpZGVkS2V5KHRleHQpIHtcbiAgcmV0dXJuICgnJyArIHRleHQpLnJlcGxhY2UodXNlclByb3ZpZGVkS2V5RXNjYXBlUmVnZXgsICckJi8nKTtcbn1cblxuLyoqXG4gKiBQb29sZWRDbGFzcyByZXByZXNlbnRpbmcgdGhlIGJvb2trZWVwaW5nIGFzc29jaWF0ZWQgd2l0aCBwZXJmb3JtaW5nIGEgY2hpbGRcbiAqIHRyYXZlcnNhbC4gQWxsb3dzIGF2b2lkaW5nIGJpbmRpbmcgY2FsbGJhY2tzLlxuICpcbiAqIEBjb25zdHJ1Y3RvciBGb3JFYWNoQm9va0tlZXBpbmdcbiAqIEBwYXJhbSB7IWZ1bmN0aW9ufSBmb3JFYWNoRnVuY3Rpb24gRnVuY3Rpb24gdG8gcGVyZm9ybSB0cmF2ZXJzYWwgd2l0aC5cbiAqIEBwYXJhbSB7Pyp9IGZvckVhY2hDb250ZXh0IENvbnRleHQgdG8gcGVyZm9ybSBjb250ZXh0IHdpdGguXG4gKi9cbmZ1bmN0aW9uIEZvckVhY2hCb29rS2VlcGluZyhmb3JFYWNoRnVuY3Rpb24sIGZvckVhY2hDb250ZXh0KSB7XG4gIHRoaXMuZnVuYyA9IGZvckVhY2hGdW5jdGlvbjtcbiAgdGhpcy5jb250ZXh0ID0gZm9yRWFjaENvbnRleHQ7XG4gIHRoaXMuY291bnQgPSAwO1xufVxuRm9yRWFjaEJvb2tLZWVwaW5nLnByb3RvdHlwZS5kZXN0cnVjdG9yID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmZ1bmMgPSBudWxsO1xuICB0aGlzLmNvbnRleHQgPSBudWxsO1xuICB0aGlzLmNvdW50ID0gMDtcbn07XG5Qb29sZWRDbGFzcy5hZGRQb29saW5nVG8oRm9yRWFjaEJvb2tLZWVwaW5nLCB0d29Bcmd1bWVudFBvb2xlcik7XG5cbmZ1bmN0aW9uIGZvckVhY2hTaW5nbGVDaGlsZChib29rS2VlcGluZywgY2hpbGQsIG5hbWUpIHtcbiAgdmFyIGZ1bmMgPSBib29rS2VlcGluZy5mdW5jLFxuICAgICAgY29udGV4dCA9IGJvb2tLZWVwaW5nLmNvbnRleHQ7XG5cbiAgZnVuYy5jYWxsKGNvbnRleHQsIGNoaWxkLCBib29rS2VlcGluZy5jb3VudCsrKTtcbn1cblxuLyoqXG4gKiBJdGVyYXRlcyB0aHJvdWdoIGNoaWxkcmVuIHRoYXQgYXJlIHR5cGljYWxseSBzcGVjaWZpZWQgYXMgYHByb3BzLmNoaWxkcmVuYC5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9mYWNlYm9vay5naXRodWIuaW8vcmVhY3QvZG9jcy90b3AtbGV2ZWwtYXBpLmh0bWwjcmVhY3QuY2hpbGRyZW4uZm9yZWFjaFxuICpcbiAqIFRoZSBwcm92aWRlZCBmb3JFYWNoRnVuYyhjaGlsZCwgaW5kZXgpIHdpbGwgYmUgY2FsbGVkIGZvciBlYWNoXG4gKiBsZWFmIGNoaWxkLlxuICpcbiAqIEBwYXJhbSB7Pyp9IGNoaWxkcmVuIENoaWxkcmVuIHRyZWUgY29udGFpbmVyLlxuICogQHBhcmFtIHtmdW5jdGlvbigqLCBpbnQpfSBmb3JFYWNoRnVuY1xuICogQHBhcmFtIHsqfSBmb3JFYWNoQ29udGV4dCBDb250ZXh0IGZvciBmb3JFYWNoQ29udGV4dC5cbiAqL1xuZnVuY3Rpb24gZm9yRWFjaENoaWxkcmVuKGNoaWxkcmVuLCBmb3JFYWNoRnVuYywgZm9yRWFjaENvbnRleHQpIHtcbiAgaWYgKGNoaWxkcmVuID09IG51bGwpIHtcbiAgICByZXR1cm4gY2hpbGRyZW47XG4gIH1cbiAgdmFyIHRyYXZlcnNlQ29udGV4dCA9IEZvckVhY2hCb29rS2VlcGluZy5nZXRQb29sZWQoZm9yRWFjaEZ1bmMsIGZvckVhY2hDb250ZXh0KTtcbiAgdHJhdmVyc2VBbGxDaGlsZHJlbihjaGlsZHJlbiwgZm9yRWFjaFNpbmdsZUNoaWxkLCB0cmF2ZXJzZUNvbnRleHQpO1xuICBGb3JFYWNoQm9va0tlZXBpbmcucmVsZWFzZSh0cmF2ZXJzZUNvbnRleHQpO1xufVxuXG4vKipcbiAqIFBvb2xlZENsYXNzIHJlcHJlc2VudGluZyB0aGUgYm9va2tlZXBpbmcgYXNzb2NpYXRlZCB3aXRoIHBlcmZvcm1pbmcgYSBjaGlsZFxuICogbWFwcGluZy4gQWxsb3dzIGF2b2lkaW5nIGJpbmRpbmcgY2FsbGJhY2tzLlxuICpcbiAqIEBjb25zdHJ1Y3RvciBNYXBCb29rS2VlcGluZ1xuICogQHBhcmFtIHshKn0gbWFwUmVzdWx0IE9iamVjdCBjb250YWluaW5nIHRoZSBvcmRlcmVkIG1hcCBvZiByZXN1bHRzLlxuICogQHBhcmFtIHshZnVuY3Rpb259IG1hcEZ1bmN0aW9uIEZ1bmN0aW9uIHRvIHBlcmZvcm0gbWFwcGluZyB3aXRoLlxuICogQHBhcmFtIHs/Kn0gbWFwQ29udGV4dCBDb250ZXh0IHRvIHBlcmZvcm0gbWFwcGluZyB3aXRoLlxuICovXG5mdW5jdGlvbiBNYXBCb29rS2VlcGluZyhtYXBSZXN1bHQsIGtleVByZWZpeCwgbWFwRnVuY3Rpb24sIG1hcENvbnRleHQpIHtcbiAgdGhpcy5yZXN1bHQgPSBtYXBSZXN1bHQ7XG4gIHRoaXMua2V5UHJlZml4ID0ga2V5UHJlZml4O1xuICB0aGlzLmZ1bmMgPSBtYXBGdW5jdGlvbjtcbiAgdGhpcy5jb250ZXh0ID0gbWFwQ29udGV4dDtcbiAgdGhpcy5jb3VudCA9IDA7XG59XG5NYXBCb29rS2VlcGluZy5wcm90b3R5cGUuZGVzdHJ1Y3RvciA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5yZXN1bHQgPSBudWxsO1xuICB0aGlzLmtleVByZWZpeCA9IG51bGw7XG4gIHRoaXMuZnVuYyA9IG51bGw7XG4gIHRoaXMuY29udGV4dCA9IG51bGw7XG4gIHRoaXMuY291bnQgPSAwO1xufTtcblBvb2xlZENsYXNzLmFkZFBvb2xpbmdUbyhNYXBCb29rS2VlcGluZywgZm91ckFyZ3VtZW50UG9vbGVyKTtcblxuZnVuY3Rpb24gbWFwU2luZ2xlQ2hpbGRJbnRvQ29udGV4dChib29rS2VlcGluZywgY2hpbGQsIGNoaWxkS2V5KSB7XG4gIHZhciByZXN1bHQgPSBib29rS2VlcGluZy5yZXN1bHQsXG4gICAgICBrZXlQcmVmaXggPSBib29rS2VlcGluZy5rZXlQcmVmaXgsXG4gICAgICBmdW5jID0gYm9va0tlZXBpbmcuZnVuYyxcbiAgICAgIGNvbnRleHQgPSBib29rS2VlcGluZy5jb250ZXh0O1xuXG5cbiAgdmFyIG1hcHBlZENoaWxkID0gZnVuYy5jYWxsKGNvbnRleHQsIGNoaWxkLCBib29rS2VlcGluZy5jb3VudCsrKTtcbiAgaWYgKEFycmF5LmlzQXJyYXkobWFwcGVkQ2hpbGQpKSB7XG4gICAgbWFwSW50b1dpdGhLZXlQcmVmaXhJbnRlcm5hbChtYXBwZWRDaGlsZCwgcmVzdWx0LCBjaGlsZEtleSwgZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc0FyZ3VtZW50KTtcbiAgfSBlbHNlIGlmIChtYXBwZWRDaGlsZCAhPSBudWxsKSB7XG4gICAgaWYgKFJlYWN0RWxlbWVudC5pc1ZhbGlkRWxlbWVudChtYXBwZWRDaGlsZCkpIHtcbiAgICAgIG1hcHBlZENoaWxkID0gUmVhY3RFbGVtZW50LmNsb25lQW5kUmVwbGFjZUtleShtYXBwZWRDaGlsZCxcbiAgICAgIC8vIEtlZXAgYm90aCB0aGUgKG1hcHBlZCkgYW5kIG9sZCBrZXlzIGlmIHRoZXkgZGlmZmVyLCBqdXN0IGFzXG4gICAgICAvLyB0cmF2ZXJzZUFsbENoaWxkcmVuIHVzZWQgdG8gZG8gZm9yIG9iamVjdHMgYXMgY2hpbGRyZW5cbiAgICAgIGtleVByZWZpeCArIChtYXBwZWRDaGlsZC5rZXkgJiYgKCFjaGlsZCB8fCBjaGlsZC5rZXkgIT09IG1hcHBlZENoaWxkLmtleSkgPyBlc2NhcGVVc2VyUHJvdmlkZWRLZXkobWFwcGVkQ2hpbGQua2V5KSArICcvJyA6ICcnKSArIGNoaWxkS2V5KTtcbiAgICB9XG4gICAgcmVzdWx0LnB1c2gobWFwcGVkQ2hpbGQpO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1hcEludG9XaXRoS2V5UHJlZml4SW50ZXJuYWwoY2hpbGRyZW4sIGFycmF5LCBwcmVmaXgsIGZ1bmMsIGNvbnRleHQpIHtcbiAgdmFyIGVzY2FwZWRQcmVmaXggPSAnJztcbiAgaWYgKHByZWZpeCAhPSBudWxsKSB7XG4gICAgZXNjYXBlZFByZWZpeCA9IGVzY2FwZVVzZXJQcm92aWRlZEtleShwcmVmaXgpICsgJy8nO1xuICB9XG4gIHZhciB0cmF2ZXJzZUNvbnRleHQgPSBNYXBCb29rS2VlcGluZy5nZXRQb29sZWQoYXJyYXksIGVzY2FwZWRQcmVmaXgsIGZ1bmMsIGNvbnRleHQpO1xuICB0cmF2ZXJzZUFsbENoaWxkcmVuKGNoaWxkcmVuLCBtYXBTaW5nbGVDaGlsZEludG9Db250ZXh0LCB0cmF2ZXJzZUNvbnRleHQpO1xuICBNYXBCb29rS2VlcGluZy5yZWxlYXNlKHRyYXZlcnNlQ29udGV4dCk7XG59XG5cbi8qKlxuICogTWFwcyBjaGlsZHJlbiB0aGF0IGFyZSB0eXBpY2FsbHkgc3BlY2lmaWVkIGFzIGBwcm9wcy5jaGlsZHJlbmAuXG4gKlxuICogU2VlIGh0dHBzOi8vZmFjZWJvb2suZ2l0aHViLmlvL3JlYWN0L2RvY3MvdG9wLWxldmVsLWFwaS5odG1sI3JlYWN0LmNoaWxkcmVuLm1hcFxuICpcbiAqIFRoZSBwcm92aWRlZCBtYXBGdW5jdGlvbihjaGlsZCwga2V5LCBpbmRleCkgd2lsbCBiZSBjYWxsZWQgZm9yIGVhY2hcbiAqIGxlYWYgY2hpbGQuXG4gKlxuICogQHBhcmFtIHs/Kn0gY2hpbGRyZW4gQ2hpbGRyZW4gdHJlZSBjb250YWluZXIuXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKCosIGludCl9IGZ1bmMgVGhlIG1hcCBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7Kn0gY29udGV4dCBDb250ZXh0IGZvciBtYXBGdW5jdGlvbi5cbiAqIEByZXR1cm4ge29iamVjdH0gT2JqZWN0IGNvbnRhaW5pbmcgdGhlIG9yZGVyZWQgbWFwIG9mIHJlc3VsdHMuXG4gKi9cbmZ1bmN0aW9uIG1hcENoaWxkcmVuKGNoaWxkcmVuLCBmdW5jLCBjb250ZXh0KSB7XG4gIGlmIChjaGlsZHJlbiA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGNoaWxkcmVuO1xuICB9XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgbWFwSW50b1dpdGhLZXlQcmVmaXhJbnRlcm5hbChjaGlsZHJlbiwgcmVzdWx0LCBudWxsLCBmdW5jLCBjb250ZXh0KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gZm9yRWFjaFNpbmdsZUNoaWxkRHVtbXkodHJhdmVyc2VDb250ZXh0LCBjaGlsZCwgbmFtZSkge1xuICByZXR1cm4gbnVsbDtcbn1cblxuLyoqXG4gKiBDb3VudCB0aGUgbnVtYmVyIG9mIGNoaWxkcmVuIHRoYXQgYXJlIHR5cGljYWxseSBzcGVjaWZpZWQgYXNcbiAqIGBwcm9wcy5jaGlsZHJlbmAuXG4gKlxuICogU2VlIGh0dHBzOi8vZmFjZWJvb2suZ2l0aHViLmlvL3JlYWN0L2RvY3MvdG9wLWxldmVsLWFwaS5odG1sI3JlYWN0LmNoaWxkcmVuLmNvdW50XG4gKlxuICogQHBhcmFtIHs/Kn0gY2hpbGRyZW4gQ2hpbGRyZW4gdHJlZSBjb250YWluZXIuXG4gKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBudW1iZXIgb2YgY2hpbGRyZW4uXG4gKi9cbmZ1bmN0aW9uIGNvdW50Q2hpbGRyZW4oY2hpbGRyZW4sIGNvbnRleHQpIHtcbiAgcmV0dXJuIHRyYXZlcnNlQWxsQ2hpbGRyZW4oY2hpbGRyZW4sIGZvckVhY2hTaW5nbGVDaGlsZER1bW15LCBudWxsKTtcbn1cblxuLyoqXG4gKiBGbGF0dGVuIGEgY2hpbGRyZW4gb2JqZWN0ICh0eXBpY2FsbHkgc3BlY2lmaWVkIGFzIGBwcm9wcy5jaGlsZHJlbmApIGFuZFxuICogcmV0dXJuIGFuIGFycmF5IHdpdGggYXBwcm9wcmlhdGVseSByZS1rZXllZCBjaGlsZHJlbi5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9mYWNlYm9vay5naXRodWIuaW8vcmVhY3QvZG9jcy90b3AtbGV2ZWwtYXBpLmh0bWwjcmVhY3QuY2hpbGRyZW4udG9hcnJheVxuICovXG5mdW5jdGlvbiB0b0FycmF5KGNoaWxkcmVuKSB7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgbWFwSW50b1dpdGhLZXlQcmVmaXhJbnRlcm5hbChjaGlsZHJlbiwgcmVzdWx0LCBudWxsLCBlbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zQXJndW1lbnQpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG52YXIgUmVhY3RDaGlsZHJlbiA9IHtcbiAgZm9yRWFjaDogZm9yRWFjaENoaWxkcmVuLFxuICBtYXA6IG1hcENoaWxkcmVuLFxuICBtYXBJbnRvV2l0aEtleVByZWZpeEludGVybmFsOiBtYXBJbnRvV2l0aEtleVByZWZpeEludGVybmFsLFxuICBjb3VudDogY291bnRDaGlsZHJlbixcbiAgdG9BcnJheTogdG9BcnJheVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdENoaWxkcmVuO1xufSx7XCIxMFwiOjEwLFwiMlwiOjIsXCIyNlwiOjI2LFwiMjdcIjoyN31dLDU6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xuLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIF9wcm9kSW52YXJpYW50ID0gX2RlcmVxXygyNSksXG4gICAgX2Fzc2lnbiA9IF9kZXJlcV8oMzEpO1xuXG52YXIgUmVhY3RDb21wb25lbnQgPSBfZGVyZXFfKDYpO1xudmFyIFJlYWN0RWxlbWVudCA9IF9kZXJlcV8oMTApO1xudmFyIFJlYWN0UHJvcFR5cGVMb2NhdGlvbk5hbWVzID0gX2RlcmVxXygxNCk7XG52YXIgUmVhY3ROb29wVXBkYXRlUXVldWUgPSBfZGVyZXFfKDEzKTtcblxudmFyIGVtcHR5T2JqZWN0ID0gX2RlcmVxXygyOCk7XG52YXIgaW52YXJpYW50ID0gX2RlcmVxXygyOSk7XG52YXIgd2FybmluZyA9IF9kZXJlcV8oMzApO1xuXG52YXIgTUlYSU5TX0tFWSA9ICdtaXhpbnMnO1xuXG4vLyBIZWxwZXIgZnVuY3Rpb24gdG8gYWxsb3cgdGhlIGNyZWF0aW9uIG9mIGFub255bW91cyBmdW5jdGlvbnMgd2hpY2ggZG8gbm90XG4vLyBoYXZlIC5uYW1lIHNldCB0byB0aGUgbmFtZSBvZiB0aGUgdmFyaWFibGUgYmVpbmcgYXNzaWduZWQgdG8uXG5mdW5jdGlvbiBpZGVudGl0eShmbikge1xuICByZXR1cm4gZm47XG59XG5cbi8qKlxuICogUG9saWNpZXMgdGhhdCBkZXNjcmliZSBtZXRob2RzIGluIGBSZWFjdENsYXNzSW50ZXJmYWNlYC5cbiAqL1xuXG5cbnZhciBpbmplY3RlZE1peGlucyA9IFtdO1xuXG4vKipcbiAqIENvbXBvc2l0ZSBjb21wb25lbnRzIGFyZSBoaWdoZXItbGV2ZWwgY29tcG9uZW50cyB0aGF0IGNvbXBvc2Ugb3RoZXIgY29tcG9zaXRlXG4gKiBvciBob3N0IGNvbXBvbmVudHMuXG4gKlxuICogVG8gY3JlYXRlIGEgbmV3IHR5cGUgb2YgYFJlYWN0Q2xhc3NgLCBwYXNzIGEgc3BlY2lmaWNhdGlvbiBvZlxuICogeW91ciBuZXcgY2xhc3MgdG8gYFJlYWN0LmNyZWF0ZUNsYXNzYC4gVGhlIG9ubHkgcmVxdWlyZW1lbnQgb2YgeW91ciBjbGFzc1xuICogc3BlY2lmaWNhdGlvbiBpcyB0aGF0IHlvdSBpbXBsZW1lbnQgYSBgcmVuZGVyYCBtZXRob2QuXG4gKlxuICogICB2YXIgTXlDb21wb25lbnQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gKiAgICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAqICAgICAgIHJldHVybiA8ZGl2PkhlbGxvIFdvcmxkPC9kaXY+O1xuICogICAgIH1cbiAqICAgfSk7XG4gKlxuICogVGhlIGNsYXNzIHNwZWNpZmljYXRpb24gc3VwcG9ydHMgYSBzcGVjaWZpYyBwcm90b2NvbCBvZiBtZXRob2RzIHRoYXQgaGF2ZVxuICogc3BlY2lhbCBtZWFuaW5nIChlLmcuIGByZW5kZXJgKS4gU2VlIGBSZWFjdENsYXNzSW50ZXJmYWNlYCBmb3JcbiAqIG1vcmUgdGhlIGNvbXByZWhlbnNpdmUgcHJvdG9jb2wuIEFueSBvdGhlciBwcm9wZXJ0aWVzIGFuZCBtZXRob2RzIGluIHRoZVxuICogY2xhc3Mgc3BlY2lmaWNhdGlvbiB3aWxsIGJlIGF2YWlsYWJsZSBvbiB0aGUgcHJvdG90eXBlLlxuICpcbiAqIEBpbnRlcmZhY2UgUmVhY3RDbGFzc0ludGVyZmFjZVxuICogQGludGVybmFsXG4gKi9cbnZhciBSZWFjdENsYXNzSW50ZXJmYWNlID0ge1xuXG4gIC8qKlxuICAgKiBBbiBhcnJheSBvZiBNaXhpbiBvYmplY3RzIHRvIGluY2x1ZGUgd2hlbiBkZWZpbmluZyB5b3VyIGNvbXBvbmVudC5cbiAgICpcbiAgICogQHR5cGUge2FycmF5fVxuICAgKiBAb3B0aW9uYWxcbiAgICovXG4gIG1peGluczogJ0RFRklORV9NQU5ZJyxcblxuICAvKipcbiAgICogQW4gb2JqZWN0IGNvbnRhaW5pbmcgcHJvcGVydGllcyBhbmQgbWV0aG9kcyB0aGF0IHNob3VsZCBiZSBkZWZpbmVkIG9uXG4gICAqIHRoZSBjb21wb25lbnQncyBjb25zdHJ1Y3RvciBpbnN0ZWFkIG9mIGl0cyBwcm90b3R5cGUgKHN0YXRpYyBtZXRob2RzKS5cbiAgICpcbiAgICogQHR5cGUge29iamVjdH1cbiAgICogQG9wdGlvbmFsXG4gICAqL1xuICBzdGF0aWNzOiAnREVGSU5FX01BTlknLFxuXG4gIC8qKlxuICAgKiBEZWZpbml0aW9uIG9mIHByb3AgdHlwZXMgZm9yIHRoaXMgY29tcG9uZW50LlxuICAgKlxuICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgKiBAb3B0aW9uYWxcbiAgICovXG4gIHByb3BUeXBlczogJ0RFRklORV9NQU5ZJyxcblxuICAvKipcbiAgICogRGVmaW5pdGlvbiBvZiBjb250ZXh0IHR5cGVzIGZvciB0aGlzIGNvbXBvbmVudC5cbiAgICpcbiAgICogQHR5cGUge29iamVjdH1cbiAgICogQG9wdGlvbmFsXG4gICAqL1xuICBjb250ZXh0VHlwZXM6ICdERUZJTkVfTUFOWScsXG5cbiAgLyoqXG4gICAqIERlZmluaXRpb24gb2YgY29udGV4dCB0eXBlcyB0aGlzIGNvbXBvbmVudCBzZXRzIGZvciBpdHMgY2hpbGRyZW4uXG4gICAqXG4gICAqIEB0eXBlIHtvYmplY3R9XG4gICAqIEBvcHRpb25hbFxuICAgKi9cbiAgY2hpbGRDb250ZXh0VHlwZXM6ICdERUZJTkVfTUFOWScsXG5cbiAgLy8gPT09PSBEZWZpbml0aW9uIG1ldGhvZHMgPT09PVxuXG4gIC8qKlxuICAgKiBJbnZva2VkIHdoZW4gdGhlIGNvbXBvbmVudCBpcyBtb3VudGVkLiBWYWx1ZXMgaW4gdGhlIG1hcHBpbmcgd2lsbCBiZSBzZXQgb25cbiAgICogYHRoaXMucHJvcHNgIGlmIHRoYXQgcHJvcCBpcyBub3Qgc3BlY2lmaWVkIChpLmUuIHVzaW5nIGFuIGBpbmAgY2hlY2spLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBpcyBpbnZva2VkIGJlZm9yZSBgZ2V0SW5pdGlhbFN0YXRlYCBhbmQgdGhlcmVmb3JlIGNhbm5vdCByZWx5XG4gICAqIG9uIGB0aGlzLnN0YXRlYCBvciB1c2UgYHRoaXMuc2V0U3RhdGVgLlxuICAgKlxuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqIEBvcHRpb25hbFxuICAgKi9cbiAgZ2V0RGVmYXVsdFByb3BzOiAnREVGSU5FX01BTllfTUVSR0VEJyxcblxuICAvKipcbiAgICogSW52b2tlZCBvbmNlIGJlZm9yZSB0aGUgY29tcG9uZW50IGlzIG1vdW50ZWQuIFRoZSByZXR1cm4gdmFsdWUgd2lsbCBiZSB1c2VkXG4gICAqIGFzIHRoZSBpbml0aWFsIHZhbHVlIG9mIGB0aGlzLnN0YXRlYC5cbiAgICpcbiAgICogICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgKiAgICAgcmV0dXJuIHtcbiAgICogICAgICAgaXNPbjogZmFsc2UsXG4gICAqICAgICAgIGZvb0JhejogbmV3IEJhekZvbygpXG4gICAqICAgICB9XG4gICAqICAgfVxuICAgKlxuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqIEBvcHRpb25hbFxuICAgKi9cbiAgZ2V0SW5pdGlhbFN0YXRlOiAnREVGSU5FX01BTllfTUVSR0VEJyxcblxuICAvKipcbiAgICogQHJldHVybiB7b2JqZWN0fVxuICAgKiBAb3B0aW9uYWxcbiAgICovXG4gIGdldENoaWxkQ29udGV4dDogJ0RFRklORV9NQU5ZX01FUkdFRCcsXG5cbiAgLyoqXG4gICAqIFVzZXMgcHJvcHMgZnJvbSBgdGhpcy5wcm9wc2AgYW5kIHN0YXRlIGZyb20gYHRoaXMuc3RhdGVgIHRvIHJlbmRlciB0aGVcbiAgICogc3RydWN0dXJlIG9mIHRoZSBjb21wb25lbnQuXG4gICAqXG4gICAqIE5vIGd1YXJhbnRlZXMgYXJlIG1hZGUgYWJvdXQgd2hlbiBvciBob3cgb2Z0ZW4gdGhpcyBtZXRob2QgaXMgaW52b2tlZCwgc29cbiAgICogaXQgbXVzdCBub3QgaGF2ZSBzaWRlIGVmZmVjdHMuXG4gICAqXG4gICAqICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICogICAgIHZhciBuYW1lID0gdGhpcy5wcm9wcy5uYW1lO1xuICAgKiAgICAgcmV0dXJuIDxkaXY+SGVsbG8sIHtuYW1lfSE8L2Rpdj47XG4gICAqICAgfVxuICAgKlxuICAgKiBAcmV0dXJuIHtSZWFjdENvbXBvbmVudH1cbiAgICogQHJlcXVpcmVkXG4gICAqL1xuICByZW5kZXI6ICdERUZJTkVfT05DRScsXG5cbiAgLy8gPT09PSBEZWxlZ2F0ZSBtZXRob2RzID09PT1cblxuICAvKipcbiAgICogSW52b2tlZCB3aGVuIHRoZSBjb21wb25lbnQgaXMgaW5pdGlhbGx5IGNyZWF0ZWQgYW5kIGFib3V0IHRvIGJlIG1vdW50ZWQuXG4gICAqIFRoaXMgbWF5IGhhdmUgc2lkZSBlZmZlY3RzLCBidXQgYW55IGV4dGVybmFsIHN1YnNjcmlwdGlvbnMgb3IgZGF0YSBjcmVhdGVkXG4gICAqIGJ5IHRoaXMgbWV0aG9kIG11c3QgYmUgY2xlYW5lZCB1cCBpbiBgY29tcG9uZW50V2lsbFVubW91bnRgLlxuICAgKlxuICAgKiBAb3B0aW9uYWxcbiAgICovXG4gIGNvbXBvbmVudFdpbGxNb3VudDogJ0RFRklORV9NQU5ZJyxcblxuICAvKipcbiAgICogSW52b2tlZCB3aGVuIHRoZSBjb21wb25lbnQgaGFzIGJlZW4gbW91bnRlZCBhbmQgaGFzIGEgRE9NIHJlcHJlc2VudGF0aW9uLlxuICAgKiBIb3dldmVyLCB0aGVyZSBpcyBubyBndWFyYW50ZWUgdGhhdCB0aGUgRE9NIG5vZGUgaXMgaW4gdGhlIGRvY3VtZW50LlxuICAgKlxuICAgKiBVc2UgdGhpcyBhcyBhbiBvcHBvcnR1bml0eSB0byBvcGVyYXRlIG9uIHRoZSBET00gd2hlbiB0aGUgY29tcG9uZW50IGhhc1xuICAgKiBiZWVuIG1vdW50ZWQgKGluaXRpYWxpemVkIGFuZCByZW5kZXJlZCkgZm9yIHRoZSBmaXJzdCB0aW1lLlxuICAgKlxuICAgKiBAcGFyYW0ge0RPTUVsZW1lbnR9IHJvb3ROb2RlIERPTSBlbGVtZW50IHJlcHJlc2VudGluZyB0aGUgY29tcG9uZW50LlxuICAgKiBAb3B0aW9uYWxcbiAgICovXG4gIGNvbXBvbmVudERpZE1vdW50OiAnREVGSU5FX01BTlknLFxuXG4gIC8qKlxuICAgKiBJbnZva2VkIGJlZm9yZSB0aGUgY29tcG9uZW50IHJlY2VpdmVzIG5ldyBwcm9wcy5cbiAgICpcbiAgICogVXNlIHRoaXMgYXMgYW4gb3Bwb3J0dW5pdHkgdG8gcmVhY3QgdG8gYSBwcm9wIHRyYW5zaXRpb24gYnkgdXBkYXRpbmcgdGhlXG4gICAqIHN0YXRlIHVzaW5nIGB0aGlzLnNldFN0YXRlYC4gQ3VycmVudCBwcm9wcyBhcmUgYWNjZXNzZWQgdmlhIGB0aGlzLnByb3BzYC5cbiAgICpcbiAgICogICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbihuZXh0UHJvcHMsIG5leHRDb250ZXh0KSB7XG4gICAqICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICogICAgICAgbGlrZXNJbmNyZWFzaW5nOiBuZXh0UHJvcHMubGlrZUNvdW50ID4gdGhpcy5wcm9wcy5saWtlQ291bnRcbiAgICogICAgIH0pO1xuICAgKiAgIH1cbiAgICpcbiAgICogTk9URTogVGhlcmUgaXMgbm8gZXF1aXZhbGVudCBgY29tcG9uZW50V2lsbFJlY2VpdmVTdGF0ZWAuIEFuIGluY29taW5nIHByb3BcbiAgICogdHJhbnNpdGlvbiBtYXkgY2F1c2UgYSBzdGF0ZSBjaGFuZ2UsIGJ1dCB0aGUgb3Bwb3NpdGUgaXMgbm90IHRydWUuIElmIHlvdVxuICAgKiBuZWVkIGl0LCB5b3UgYXJlIHByb2JhYmx5IGxvb2tpbmcgZm9yIGBjb21wb25lbnRXaWxsVXBkYXRlYC5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IG5leHRQcm9wc1xuICAgKiBAb3B0aW9uYWxcbiAgICovXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6ICdERUZJTkVfTUFOWScsXG5cbiAgLyoqXG4gICAqIEludm9rZWQgd2hpbGUgZGVjaWRpbmcgaWYgdGhlIGNvbXBvbmVudCBzaG91bGQgYmUgdXBkYXRlZCBhcyBhIHJlc3VsdCBvZlxuICAgKiByZWNlaXZpbmcgbmV3IHByb3BzLCBzdGF0ZSBhbmQvb3IgY29udGV4dC5cbiAgICpcbiAgICogVXNlIHRoaXMgYXMgYW4gb3Bwb3J0dW5pdHkgdG8gYHJldHVybiBmYWxzZWAgd2hlbiB5b3UncmUgY2VydGFpbiB0aGF0IHRoZVxuICAgKiB0cmFuc2l0aW9uIHRvIHRoZSBuZXcgcHJvcHMvc3RhdGUvY29udGV4dCB3aWxsIG5vdCByZXF1aXJlIGEgY29tcG9uZW50XG4gICAqIHVwZGF0ZS5cbiAgICpcbiAgICogICBzaG91bGRDb21wb25lbnRVcGRhdGU6IGZ1bmN0aW9uKG5leHRQcm9wcywgbmV4dFN0YXRlLCBuZXh0Q29udGV4dCkge1xuICAgKiAgICAgcmV0dXJuICFlcXVhbChuZXh0UHJvcHMsIHRoaXMucHJvcHMpIHx8XG4gICAqICAgICAgICFlcXVhbChuZXh0U3RhdGUsIHRoaXMuc3RhdGUpIHx8XG4gICAqICAgICAgICFlcXVhbChuZXh0Q29udGV4dCwgdGhpcy5jb250ZXh0KTtcbiAgICogICB9XG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBuZXh0UHJvcHNcbiAgICogQHBhcmFtIHs/b2JqZWN0fSBuZXh0U3RhdGVcbiAgICogQHBhcmFtIHs/b2JqZWN0fSBuZXh0Q29udGV4dFxuICAgKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIHRoZSBjb21wb25lbnQgc2hvdWxkIHVwZGF0ZS5cbiAgICogQG9wdGlvbmFsXG4gICAqL1xuICBzaG91bGRDb21wb25lbnRVcGRhdGU6ICdERUZJTkVfT05DRScsXG5cbiAgLyoqXG4gICAqIEludm9rZWQgd2hlbiB0aGUgY29tcG9uZW50IGlzIGFib3V0IHRvIHVwZGF0ZSBkdWUgdG8gYSB0cmFuc2l0aW9uIGZyb21cbiAgICogYHRoaXMucHJvcHNgLCBgdGhpcy5zdGF0ZWAgYW5kIGB0aGlzLmNvbnRleHRgIHRvIGBuZXh0UHJvcHNgLCBgbmV4dFN0YXRlYFxuICAgKiBhbmQgYG5leHRDb250ZXh0YC5cbiAgICpcbiAgICogVXNlIHRoaXMgYXMgYW4gb3Bwb3J0dW5pdHkgdG8gcGVyZm9ybSBwcmVwYXJhdGlvbiBiZWZvcmUgYW4gdXBkYXRlIG9jY3Vycy5cbiAgICpcbiAgICogTk9URTogWW91ICoqY2Fubm90KiogdXNlIGB0aGlzLnNldFN0YXRlKClgIGluIHRoaXMgbWV0aG9kLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gbmV4dFByb3BzXG4gICAqIEBwYXJhbSB7P29iamVjdH0gbmV4dFN0YXRlXG4gICAqIEBwYXJhbSB7P29iamVjdH0gbmV4dENvbnRleHRcbiAgICogQHBhcmFtIHtSZWFjdFJlY29uY2lsZVRyYW5zYWN0aW9ufSB0cmFuc2FjdGlvblxuICAgKiBAb3B0aW9uYWxcbiAgICovXG4gIGNvbXBvbmVudFdpbGxVcGRhdGU6ICdERUZJTkVfTUFOWScsXG5cbiAgLyoqXG4gICAqIEludm9rZWQgd2hlbiB0aGUgY29tcG9uZW50J3MgRE9NIHJlcHJlc2VudGF0aW9uIGhhcyBiZWVuIHVwZGF0ZWQuXG4gICAqXG4gICAqIFVzZSB0aGlzIGFzIGFuIG9wcG9ydHVuaXR5IHRvIG9wZXJhdGUgb24gdGhlIERPTSB3aGVuIHRoZSBjb21wb25lbnQgaGFzXG4gICAqIGJlZW4gdXBkYXRlZC5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IHByZXZQcm9wc1xuICAgKiBAcGFyYW0gez9vYmplY3R9IHByZXZTdGF0ZVxuICAgKiBAcGFyYW0gez9vYmplY3R9IHByZXZDb250ZXh0XG4gICAqIEBwYXJhbSB7RE9NRWxlbWVudH0gcm9vdE5vZGUgRE9NIGVsZW1lbnQgcmVwcmVzZW50aW5nIHRoZSBjb21wb25lbnQuXG4gICAqIEBvcHRpb25hbFxuICAgKi9cbiAgY29tcG9uZW50RGlkVXBkYXRlOiAnREVGSU5FX01BTlknLFxuXG4gIC8qKlxuICAgKiBJbnZva2VkIHdoZW4gdGhlIGNvbXBvbmVudCBpcyBhYm91dCB0byBiZSByZW1vdmVkIGZyb20gaXRzIHBhcmVudCBhbmQgaGF2ZVxuICAgKiBpdHMgRE9NIHJlcHJlc2VudGF0aW9uIGRlc3Ryb3llZC5cbiAgICpcbiAgICogVXNlIHRoaXMgYXMgYW4gb3Bwb3J0dW5pdHkgdG8gZGVhbGxvY2F0ZSBhbnkgZXh0ZXJuYWwgcmVzb3VyY2VzLlxuICAgKlxuICAgKiBOT1RFOiBUaGVyZSBpcyBubyBgY29tcG9uZW50RGlkVW5tb3VudGAgc2luY2UgeW91ciBjb21wb25lbnQgd2lsbCBoYXZlIGJlZW5cbiAgICogZGVzdHJveWVkIGJ5IHRoYXQgcG9pbnQuXG4gICAqXG4gICAqIEBvcHRpb25hbFxuICAgKi9cbiAgY29tcG9uZW50V2lsbFVubW91bnQ6ICdERUZJTkVfTUFOWScsXG5cbiAgLy8gPT09PSBBZHZhbmNlZCBtZXRob2RzID09PT1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgY29tcG9uZW50J3MgY3VycmVudGx5IG1vdW50ZWQgRE9NIHJlcHJlc2VudGF0aW9uLlxuICAgKlxuICAgKiBCeSBkZWZhdWx0LCB0aGlzIGltcGxlbWVudHMgUmVhY3QncyByZW5kZXJpbmcgYW5kIHJlY29uY2lsaWF0aW9uIGFsZ29yaXRobS5cbiAgICogU29waGlzdGljYXRlZCBjbGllbnRzIG1heSB3aXNoIHRvIG92ZXJyaWRlIHRoaXMuXG4gICAqXG4gICAqIEBwYXJhbSB7UmVhY3RSZWNvbmNpbGVUcmFuc2FjdGlvbn0gdHJhbnNhY3Rpb25cbiAgICogQGludGVybmFsXG4gICAqIEBvdmVycmlkYWJsZVxuICAgKi9cbiAgdXBkYXRlQ29tcG9uZW50OiAnT1ZFUlJJREVfQkFTRSdcblxufTtcblxuLyoqXG4gKiBNYXBwaW5nIGZyb20gY2xhc3Mgc3BlY2lmaWNhdGlvbiBrZXlzIHRvIHNwZWNpYWwgcHJvY2Vzc2luZyBmdW5jdGlvbnMuXG4gKlxuICogQWx0aG91Z2ggdGhlc2UgYXJlIGRlY2xhcmVkIGxpa2UgaW5zdGFuY2UgcHJvcGVydGllcyBpbiB0aGUgc3BlY2lmaWNhdGlvblxuICogd2hlbiBkZWZpbmluZyBjbGFzc2VzIHVzaW5nIGBSZWFjdC5jcmVhdGVDbGFzc2AsIHRoZXkgYXJlIGFjdHVhbGx5IHN0YXRpY1xuICogYW5kIGFyZSBhY2Nlc3NpYmxlIG9uIHRoZSBjb25zdHJ1Y3RvciBpbnN0ZWFkIG9mIHRoZSBwcm90b3R5cGUuIERlc3BpdGVcbiAqIGJlaW5nIHN0YXRpYywgdGhleSBtdXN0IGJlIGRlZmluZWQgb3V0c2lkZSBvZiB0aGUgXCJzdGF0aWNzXCIga2V5IHVuZGVyXG4gKiB3aGljaCBhbGwgb3RoZXIgc3RhdGljIG1ldGhvZHMgYXJlIGRlZmluZWQuXG4gKi9cbnZhciBSRVNFUlZFRF9TUEVDX0tFWVMgPSB7XG4gIGRpc3BsYXlOYW1lOiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIGRpc3BsYXlOYW1lKSB7XG4gICAgQ29uc3RydWN0b3IuZGlzcGxheU5hbWUgPSBkaXNwbGF5TmFtZTtcbiAgfSxcbiAgbWl4aW5zOiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIG1peGlucykge1xuICAgIGlmIChtaXhpbnMpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWl4aW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG1peFNwZWNJbnRvQ29tcG9uZW50KENvbnN0cnVjdG9yLCBtaXhpbnNbaV0pO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgY2hpbGRDb250ZXh0VHlwZXM6IGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgY2hpbGRDb250ZXh0VHlwZXMpIHtcbiAgICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIHZhbGlkYXRlVHlwZURlZihDb25zdHJ1Y3RvciwgY2hpbGRDb250ZXh0VHlwZXMsICdjaGlsZENvbnRleHQnKTtcbiAgICB9XG4gICAgQ29uc3RydWN0b3IuY2hpbGRDb250ZXh0VHlwZXMgPSBfYXNzaWduKHt9LCBDb25zdHJ1Y3Rvci5jaGlsZENvbnRleHRUeXBlcywgY2hpbGRDb250ZXh0VHlwZXMpO1xuICB9LFxuICBjb250ZXh0VHlwZXM6IGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgY29udGV4dFR5cGVzKSB7XG4gICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICB2YWxpZGF0ZVR5cGVEZWYoQ29uc3RydWN0b3IsIGNvbnRleHRUeXBlcywgJ2NvbnRleHQnKTtcbiAgICB9XG4gICAgQ29uc3RydWN0b3IuY29udGV4dFR5cGVzID0gX2Fzc2lnbih7fSwgQ29uc3RydWN0b3IuY29udGV4dFR5cGVzLCBjb250ZXh0VHlwZXMpO1xuICB9LFxuICAvKipcbiAgICogU3BlY2lhbCBjYXNlIGdldERlZmF1bHRQcm9wcyB3aGljaCBzaG91bGQgbW92ZSBpbnRvIHN0YXRpY3MgYnV0IHJlcXVpcmVzXG4gICAqIGF1dG9tYXRpYyBtZXJnaW5nLlxuICAgKi9cbiAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIGdldERlZmF1bHRQcm9wcykge1xuICAgIGlmIChDb25zdHJ1Y3Rvci5nZXREZWZhdWx0UHJvcHMpIHtcbiAgICAgIENvbnN0cnVjdG9yLmdldERlZmF1bHRQcm9wcyA9IGNyZWF0ZU1lcmdlZFJlc3VsdEZ1bmN0aW9uKENvbnN0cnVjdG9yLmdldERlZmF1bHRQcm9wcywgZ2V0RGVmYXVsdFByb3BzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgQ29uc3RydWN0b3IuZ2V0RGVmYXVsdFByb3BzID0gZ2V0RGVmYXVsdFByb3BzO1xuICAgIH1cbiAgfSxcbiAgcHJvcFR5cGVzOiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3BUeXBlcykge1xuICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgdmFsaWRhdGVUeXBlRGVmKENvbnN0cnVjdG9yLCBwcm9wVHlwZXMsICdwcm9wJyk7XG4gICAgfVxuICAgIENvbnN0cnVjdG9yLnByb3BUeXBlcyA9IF9hc3NpZ24oe30sIENvbnN0cnVjdG9yLnByb3BUeXBlcywgcHJvcFR5cGVzKTtcbiAgfSxcbiAgc3RhdGljczogZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBzdGF0aWNzKSB7XG4gICAgbWl4U3RhdGljU3BlY0ludG9Db21wb25lbnQoQ29uc3RydWN0b3IsIHN0YXRpY3MpO1xuICB9LFxuICBhdXRvYmluZDogZnVuY3Rpb24gKCkge30gfTtcblxuZnVuY3Rpb24gdmFsaWRhdGVUeXBlRGVmKENvbnN0cnVjdG9yLCB0eXBlRGVmLCBsb2NhdGlvbikge1xuICBmb3IgKHZhciBwcm9wTmFtZSBpbiB0eXBlRGVmKSB7XG4gICAgaWYgKHR5cGVEZWYuaGFzT3duUHJvcGVydHkocHJvcE5hbWUpKSB7XG4gICAgICAvLyB1c2UgYSB3YXJuaW5nIGluc3RlYWQgb2YgYW4gaW52YXJpYW50IHNvIGNvbXBvbmVudHNcbiAgICAgIC8vIGRvbid0IHNob3cgdXAgaW4gcHJvZCBidXQgb25seSBpbiBfX0RFVl9fXG4gICAgICBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcodHlwZW9mIHR5cGVEZWZbcHJvcE5hbWVdID09PSAnZnVuY3Rpb24nLCAnJXM6ICVzIHR5cGUgYCVzYCBpcyBpbnZhbGlkOyBpdCBtdXN0IGJlIGEgZnVuY3Rpb24sIHVzdWFsbHkgZnJvbSAnICsgJ1JlYWN0LlByb3BUeXBlcy4nLCBDb25zdHJ1Y3Rvci5kaXNwbGF5TmFtZSB8fCAnUmVhY3RDbGFzcycsIFJlYWN0UHJvcFR5cGVMb2NhdGlvbk5hbWVzW2xvY2F0aW9uXSwgcHJvcE5hbWUpIDogdm9pZCAwO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZU1ldGhvZE92ZXJyaWRlKGlzQWxyZWFkeURlZmluZWQsIG5hbWUpIHtcbiAgdmFyIHNwZWNQb2xpY3kgPSBSZWFjdENsYXNzSW50ZXJmYWNlLmhhc093blByb3BlcnR5KG5hbWUpID8gUmVhY3RDbGFzc0ludGVyZmFjZVtuYW1lXSA6IG51bGw7XG5cbiAgLy8gRGlzYWxsb3cgb3ZlcnJpZGluZyBvZiBiYXNlIGNsYXNzIG1ldGhvZHMgdW5sZXNzIGV4cGxpY2l0bHkgYWxsb3dlZC5cbiAgaWYgKFJlYWN0Q2xhc3NNaXhpbi5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICEoc3BlY1BvbGljeSA9PT0gJ09WRVJSSURFX0JBU0UnKSA/IFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnUmVhY3RDbGFzc0ludGVyZmFjZTogWW91IGFyZSBhdHRlbXB0aW5nIHRvIG92ZXJyaWRlIGAlc2AgZnJvbSB5b3VyIGNsYXNzIHNwZWNpZmljYXRpb24uIEVuc3VyZSB0aGF0IHlvdXIgbWV0aG9kIG5hbWVzIGRvIG5vdCBvdmVybGFwIHdpdGggUmVhY3QgbWV0aG9kcy4nLCBuYW1lKSA6IF9wcm9kSW52YXJpYW50KCc3MycsIG5hbWUpIDogdm9pZCAwO1xuICB9XG5cbiAgLy8gRGlzYWxsb3cgZGVmaW5pbmcgbWV0aG9kcyBtb3JlIHRoYW4gb25jZSB1bmxlc3MgZXhwbGljaXRseSBhbGxvd2VkLlxuICBpZiAoaXNBbHJlYWR5RGVmaW5lZCkge1xuICAgICEoc3BlY1BvbGljeSA9PT0gJ0RFRklORV9NQU5ZJyB8fCBzcGVjUG9saWN5ID09PSAnREVGSU5FX01BTllfTUVSR0VEJykgPyBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ1JlYWN0Q2xhc3NJbnRlcmZhY2U6IFlvdSBhcmUgYXR0ZW1wdGluZyB0byBkZWZpbmUgYCVzYCBvbiB5b3VyIGNvbXBvbmVudCBtb3JlIHRoYW4gb25jZS4gVGhpcyBjb25mbGljdCBtYXkgYmUgZHVlIHRvIGEgbWl4aW4uJywgbmFtZSkgOiBfcHJvZEludmFyaWFudCgnNzQnLCBuYW1lKSA6IHZvaWQgMDtcbiAgfVxufVxuXG4vKipcbiAqIE1peGluIGhlbHBlciB3aGljaCBoYW5kbGVzIHBvbGljeSB2YWxpZGF0aW9uIGFuZCByZXNlcnZlZFxuICogc3BlY2lmaWNhdGlvbiBrZXlzIHdoZW4gYnVpbGRpbmcgUmVhY3QgY2xhc3Nlcy5cbiAqL1xuZnVuY3Rpb24gbWl4U3BlY0ludG9Db21wb25lbnQoQ29uc3RydWN0b3IsIHNwZWMpIHtcbiAgaWYgKCFzcGVjKSB7XG4gICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICB2YXIgdHlwZW9mU3BlYyA9IHR5cGVvZiBzcGVjO1xuICAgICAgdmFyIGlzTWl4aW5WYWxpZCA9IHR5cGVvZlNwZWMgPT09ICdvYmplY3QnICYmIHNwZWMgIT09IG51bGw7XG5cbiAgICAgIFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyhpc01peGluVmFsaWQsICclczogWW91XFwncmUgYXR0ZW1wdGluZyB0byBpbmNsdWRlIGEgbWl4aW4gdGhhdCBpcyBlaXRoZXIgbnVsbCAnICsgJ29yIG5vdCBhbiBvYmplY3QuIENoZWNrIHRoZSBtaXhpbnMgaW5jbHVkZWQgYnkgdGhlIGNvbXBvbmVudCwgJyArICdhcyB3ZWxsIGFzIGFueSBtaXhpbnMgdGhleSBpbmNsdWRlIHRoZW1zZWx2ZXMuICcgKyAnRXhwZWN0ZWQgb2JqZWN0IGJ1dCBnb3QgJXMuJywgQ29uc3RydWN0b3IuZGlzcGxheU5hbWUgfHwgJ1JlYWN0Q2xhc3MnLCBzcGVjID09PSBudWxsID8gbnVsbCA6IHR5cGVvZlNwZWMpIDogdm9pZCAwO1xuICAgIH1cblxuICAgIHJldHVybjtcbiAgfVxuXG4gICEodHlwZW9mIHNwZWMgIT09ICdmdW5jdGlvbicpID8gXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdSZWFjdENsYXNzOiBZb3VcXCdyZSBhdHRlbXB0aW5nIHRvIHVzZSBhIGNvbXBvbmVudCBjbGFzcyBvciBmdW5jdGlvbiBhcyBhIG1peGluLiBJbnN0ZWFkLCBqdXN0IHVzZSBhIHJlZ3VsYXIgb2JqZWN0LicpIDogX3Byb2RJbnZhcmlhbnQoJzc1JykgOiB2b2lkIDA7XG4gICEhUmVhY3RFbGVtZW50LmlzVmFsaWRFbGVtZW50KHNwZWMpID8gXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdSZWFjdENsYXNzOiBZb3VcXCdyZSBhdHRlbXB0aW5nIHRvIHVzZSBhIGNvbXBvbmVudCBhcyBhIG1peGluLiBJbnN0ZWFkLCBqdXN0IHVzZSBhIHJlZ3VsYXIgb2JqZWN0LicpIDogX3Byb2RJbnZhcmlhbnQoJzc2JykgOiB2b2lkIDA7XG5cbiAgdmFyIHByb3RvID0gQ29uc3RydWN0b3IucHJvdG90eXBlO1xuICB2YXIgYXV0b0JpbmRQYWlycyA9IHByb3RvLl9fcmVhY3RBdXRvQmluZFBhaXJzO1xuXG4gIC8vIEJ5IGhhbmRsaW5nIG1peGlucyBiZWZvcmUgYW55IG90aGVyIHByb3BlcnRpZXMsIHdlIGVuc3VyZSB0aGUgc2FtZVxuICAvLyBjaGFpbmluZyBvcmRlciBpcyBhcHBsaWVkIHRvIG1ldGhvZHMgd2l0aCBERUZJTkVfTUFOWSBwb2xpY3ksIHdoZXRoZXJcbiAgLy8gbWl4aW5zIGFyZSBsaXN0ZWQgYmVmb3JlIG9yIGFmdGVyIHRoZXNlIG1ldGhvZHMgaW4gdGhlIHNwZWMuXG4gIGlmIChzcGVjLmhhc093blByb3BlcnR5KE1JWElOU19LRVkpKSB7XG4gICAgUkVTRVJWRURfU1BFQ19LRVlTLm1peGlucyhDb25zdHJ1Y3Rvciwgc3BlYy5taXhpbnMpO1xuICB9XG5cbiAgZm9yICh2YXIgbmFtZSBpbiBzcGVjKSB7XG4gICAgaWYgKCFzcGVjLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAobmFtZSA9PT0gTUlYSU5TX0tFWSkge1xuICAgICAgLy8gV2UgaGF2ZSBhbHJlYWR5IGhhbmRsZWQgbWl4aW5zIGluIGEgc3BlY2lhbCBjYXNlIGFib3ZlLlxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgdmFyIHByb3BlcnR5ID0gc3BlY1tuYW1lXTtcbiAgICB2YXIgaXNBbHJlYWR5RGVmaW5lZCA9IHByb3RvLmhhc093blByb3BlcnR5KG5hbWUpO1xuICAgIHZhbGlkYXRlTWV0aG9kT3ZlcnJpZGUoaXNBbHJlYWR5RGVmaW5lZCwgbmFtZSk7XG5cbiAgICBpZiAoUkVTRVJWRURfU1BFQ19LRVlTLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICBSRVNFUlZFRF9TUEVDX0tFWVNbbmFtZV0oQ29uc3RydWN0b3IsIHByb3BlcnR5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU2V0dXAgbWV0aG9kcyBvbiBwcm90b3R5cGU6XG4gICAgICAvLyBUaGUgZm9sbG93aW5nIG1lbWJlciBtZXRob2RzIHNob3VsZCBub3QgYmUgYXV0b21hdGljYWxseSBib3VuZDpcbiAgICAgIC8vIDEuIEV4cGVjdGVkIFJlYWN0Q2xhc3MgbWV0aG9kcyAoaW4gdGhlIFwiaW50ZXJmYWNlXCIpLlxuICAgICAgLy8gMi4gT3ZlcnJpZGRlbiBtZXRob2RzICh0aGF0IHdlcmUgbWl4ZWQgaW4pLlxuICAgICAgdmFyIGlzUmVhY3RDbGFzc01ldGhvZCA9IFJlYWN0Q2xhc3NJbnRlcmZhY2UuaGFzT3duUHJvcGVydHkobmFtZSk7XG4gICAgICB2YXIgaXNGdW5jdGlvbiA9IHR5cGVvZiBwcm9wZXJ0eSA9PT0gJ2Z1bmN0aW9uJztcbiAgICAgIHZhciBzaG91bGRBdXRvQmluZCA9IGlzRnVuY3Rpb24gJiYgIWlzUmVhY3RDbGFzc01ldGhvZCAmJiAhaXNBbHJlYWR5RGVmaW5lZCAmJiBzcGVjLmF1dG9iaW5kICE9PSBmYWxzZTtcblxuICAgICAgaWYgKHNob3VsZEF1dG9CaW5kKSB7XG4gICAgICAgIGF1dG9CaW5kUGFpcnMucHVzaChuYW1lLCBwcm9wZXJ0eSk7XG4gICAgICAgIHByb3RvW25hbWVdID0gcHJvcGVydHk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoaXNBbHJlYWR5RGVmaW5lZCkge1xuICAgICAgICAgIHZhciBzcGVjUG9saWN5ID0gUmVhY3RDbGFzc0ludGVyZmFjZVtuYW1lXTtcblxuICAgICAgICAgIC8vIFRoZXNlIGNhc2VzIHNob3VsZCBhbHJlYWR5IGJlIGNhdWdodCBieSB2YWxpZGF0ZU1ldGhvZE92ZXJyaWRlLlxuICAgICAgICAgICEoaXNSZWFjdENsYXNzTWV0aG9kICYmIChzcGVjUG9saWN5ID09PSAnREVGSU5FX01BTllfTUVSR0VEJyB8fCBzcGVjUG9saWN5ID09PSAnREVGSU5FX01BTlknKSkgPyBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ1JlYWN0Q2xhc3M6IFVuZXhwZWN0ZWQgc3BlYyBwb2xpY3kgJXMgZm9yIGtleSAlcyB3aGVuIG1peGluZyBpbiBjb21wb25lbnQgc3BlY3MuJywgc3BlY1BvbGljeSwgbmFtZSkgOiBfcHJvZEludmFyaWFudCgnNzcnLCBzcGVjUG9saWN5LCBuYW1lKSA6IHZvaWQgMDtcblxuICAgICAgICAgIC8vIEZvciBtZXRob2RzIHdoaWNoIGFyZSBkZWZpbmVkIG1vcmUgdGhhbiBvbmNlLCBjYWxsIHRoZSBleGlzdGluZ1xuICAgICAgICAgIC8vIG1ldGhvZHMgYmVmb3JlIGNhbGxpbmcgdGhlIG5ldyBwcm9wZXJ0eSwgbWVyZ2luZyBpZiBhcHByb3ByaWF0ZS5cbiAgICAgICAgICBpZiAoc3BlY1BvbGljeSA9PT0gJ0RFRklORV9NQU5ZX01FUkdFRCcpIHtcbiAgICAgICAgICAgIHByb3RvW25hbWVdID0gY3JlYXRlTWVyZ2VkUmVzdWx0RnVuY3Rpb24ocHJvdG9bbmFtZV0sIHByb3BlcnR5KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHNwZWNQb2xpY3kgPT09ICdERUZJTkVfTUFOWScpIHtcbiAgICAgICAgICAgIHByb3RvW25hbWVdID0gY3JlYXRlQ2hhaW5lZEZ1bmN0aW9uKHByb3RvW25hbWVdLCBwcm9wZXJ0eSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByb3RvW25hbWVdID0gcHJvcGVydHk7XG4gICAgICAgICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICAvLyBBZGQgdmVyYm9zZSBkaXNwbGF5TmFtZSB0byB0aGUgZnVuY3Rpb24sIHdoaWNoIGhlbHBzIHdoZW4gbG9va2luZ1xuICAgICAgICAgICAgLy8gYXQgcHJvZmlsaW5nIHRvb2xzLlxuICAgICAgICAgICAgaWYgKHR5cGVvZiBwcm9wZXJ0eSA9PT0gJ2Z1bmN0aW9uJyAmJiBzcGVjLmRpc3BsYXlOYW1lKSB7XG4gICAgICAgICAgICAgIHByb3RvW25hbWVdLmRpc3BsYXlOYW1lID0gc3BlYy5kaXNwbGF5TmFtZSArICdfJyArIG5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIG1peFN0YXRpY1NwZWNJbnRvQ29tcG9uZW50KENvbnN0cnVjdG9yLCBzdGF0aWNzKSB7XG4gIGlmICghc3RhdGljcykge1xuICAgIHJldHVybjtcbiAgfVxuICBmb3IgKHZhciBuYW1lIGluIHN0YXRpY3MpIHtcbiAgICB2YXIgcHJvcGVydHkgPSBzdGF0aWNzW25hbWVdO1xuICAgIGlmICghc3RhdGljcy5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgdmFyIGlzUmVzZXJ2ZWQgPSBuYW1lIGluIFJFU0VSVkVEX1NQRUNfS0VZUztcbiAgICAhIWlzUmVzZXJ2ZWQgPyBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ1JlYWN0Q2xhc3M6IFlvdSBhcmUgYXR0ZW1wdGluZyB0byBkZWZpbmUgYSByZXNlcnZlZCBwcm9wZXJ0eSwgYCVzYCwgdGhhdCBzaG91bGRuXFwndCBiZSBvbiB0aGUgXCJzdGF0aWNzXCIga2V5LiBEZWZpbmUgaXQgYXMgYW4gaW5zdGFuY2UgcHJvcGVydHkgaW5zdGVhZDsgaXQgd2lsbCBzdGlsbCBiZSBhY2Nlc3NpYmxlIG9uIHRoZSBjb25zdHJ1Y3Rvci4nLCBuYW1lKSA6IF9wcm9kSW52YXJpYW50KCc3OCcsIG5hbWUpIDogdm9pZCAwO1xuXG4gICAgdmFyIGlzSW5oZXJpdGVkID0gbmFtZSBpbiBDb25zdHJ1Y3RvcjtcbiAgICAhIWlzSW5oZXJpdGVkID8gXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdSZWFjdENsYXNzOiBZb3UgYXJlIGF0dGVtcHRpbmcgdG8gZGVmaW5lIGAlc2Agb24geW91ciBjb21wb25lbnQgbW9yZSB0aGFuIG9uY2UuIFRoaXMgY29uZmxpY3QgbWF5IGJlIGR1ZSB0byBhIG1peGluLicsIG5hbWUpIDogX3Byb2RJbnZhcmlhbnQoJzc5JywgbmFtZSkgOiB2b2lkIDA7XG4gICAgQ29uc3RydWN0b3JbbmFtZV0gPSBwcm9wZXJ0eTtcbiAgfVxufVxuXG4vKipcbiAqIE1lcmdlIHR3byBvYmplY3RzLCBidXQgdGhyb3cgaWYgYm90aCBjb250YWluIHRoZSBzYW1lIGtleS5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gb25lIFRoZSBmaXJzdCBvYmplY3QsIHdoaWNoIGlzIG11dGF0ZWQuXG4gKiBAcGFyYW0ge29iamVjdH0gdHdvIFRoZSBzZWNvbmQgb2JqZWN0XG4gKiBAcmV0dXJuIHtvYmplY3R9IG9uZSBhZnRlciBpdCBoYXMgYmVlbiBtdXRhdGVkIHRvIGNvbnRhaW4gZXZlcnl0aGluZyBpbiB0d28uXG4gKi9cbmZ1bmN0aW9uIG1lcmdlSW50b1dpdGhOb0R1cGxpY2F0ZUtleXMob25lLCB0d28pIHtcbiAgIShvbmUgJiYgdHdvICYmIHR5cGVvZiBvbmUgPT09ICdvYmplY3QnICYmIHR5cGVvZiB0d28gPT09ICdvYmplY3QnKSA/IFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnbWVyZ2VJbnRvV2l0aE5vRHVwbGljYXRlS2V5cygpOiBDYW5ub3QgbWVyZ2Ugbm9uLW9iamVjdHMuJykgOiBfcHJvZEludmFyaWFudCgnODAnKSA6IHZvaWQgMDtcblxuICBmb3IgKHZhciBrZXkgaW4gdHdvKSB7XG4gICAgaWYgKHR3by5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAhKG9uZVtrZXldID09PSB1bmRlZmluZWQpID8gXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdtZXJnZUludG9XaXRoTm9EdXBsaWNhdGVLZXlzKCk6IFRyaWVkIHRvIG1lcmdlIHR3byBvYmplY3RzIHdpdGggdGhlIHNhbWUga2V5OiBgJXNgLiBUaGlzIGNvbmZsaWN0IG1heSBiZSBkdWUgdG8gYSBtaXhpbjsgaW4gcGFydGljdWxhciwgdGhpcyBtYXkgYmUgY2F1c2VkIGJ5IHR3byBnZXRJbml0aWFsU3RhdGUoKSBvciBnZXREZWZhdWx0UHJvcHMoKSBtZXRob2RzIHJldHVybmluZyBvYmplY3RzIHdpdGggY2xhc2hpbmcga2V5cy4nLCBrZXkpIDogX3Byb2RJbnZhcmlhbnQoJzgxJywga2V5KSA6IHZvaWQgMDtcbiAgICAgIG9uZVtrZXldID0gdHdvW2tleV07XG4gICAgfVxuICB9XG4gIHJldHVybiBvbmU7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgaW52b2tlcyB0d28gZnVuY3Rpb25zIGFuZCBtZXJnZXMgdGhlaXIgcmV0dXJuIHZhbHVlcy5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBvbmUgRnVuY3Rpb24gdG8gaW52b2tlIGZpcnN0LlxuICogQHBhcmFtIHtmdW5jdGlvbn0gdHdvIEZ1bmN0aW9uIHRvIGludm9rZSBzZWNvbmQuXG4gKiBAcmV0dXJuIHtmdW5jdGlvbn0gRnVuY3Rpb24gdGhhdCBpbnZva2VzIHRoZSB0d28gYXJndW1lbnQgZnVuY3Rpb25zLlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gY3JlYXRlTWVyZ2VkUmVzdWx0RnVuY3Rpb24ob25lLCB0d28pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIG1lcmdlZFJlc3VsdCgpIHtcbiAgICB2YXIgYSA9IG9uZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHZhciBiID0gdHdvLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKGEgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGI7XG4gICAgfSBlbHNlIGlmIChiID09IG51bGwpIHtcbiAgICAgIHJldHVybiBhO1xuICAgIH1cbiAgICB2YXIgYyA9IHt9O1xuICAgIG1lcmdlSW50b1dpdGhOb0R1cGxpY2F0ZUtleXMoYywgYSk7XG4gICAgbWVyZ2VJbnRvV2l0aE5vRHVwbGljYXRlS2V5cyhjLCBiKTtcbiAgICByZXR1cm4gYztcbiAgfTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBpbnZva2VzIHR3byBmdW5jdGlvbnMgYW5kIGlnbm9yZXMgdGhlaXIgcmV0dXJuIHZhbGVzLlxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IG9uZSBGdW5jdGlvbiB0byBpbnZva2UgZmlyc3QuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSB0d28gRnVuY3Rpb24gdG8gaW52b2tlIHNlY29uZC5cbiAqIEByZXR1cm4ge2Z1bmN0aW9ufSBGdW5jdGlvbiB0aGF0IGludm9rZXMgdGhlIHR3byBhcmd1bWVudCBmdW5jdGlvbnMuXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBjcmVhdGVDaGFpbmVkRnVuY3Rpb24ob25lLCB0d28pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGNoYWluZWRGdW5jdGlvbigpIHtcbiAgICBvbmUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0d28uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfTtcbn1cblxuLyoqXG4gKiBCaW5kcyBhIG1ldGhvZCB0byB0aGUgY29tcG9uZW50LlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBjb21wb25lbnQgQ29tcG9uZW50IHdob3NlIG1ldGhvZCBpcyBnb2luZyB0byBiZSBib3VuZC5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IG1ldGhvZCBNZXRob2QgdG8gYmUgYm91bmQuXG4gKiBAcmV0dXJuIHtmdW5jdGlvbn0gVGhlIGJvdW5kIG1ldGhvZC5cbiAqL1xuZnVuY3Rpb24gYmluZEF1dG9CaW5kTWV0aG9kKGNvbXBvbmVudCwgbWV0aG9kKSB7XG4gIHZhciBib3VuZE1ldGhvZCA9IG1ldGhvZC5iaW5kKGNvbXBvbmVudCk7XG4gIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIGJvdW5kTWV0aG9kLl9fcmVhY3RCb3VuZENvbnRleHQgPSBjb21wb25lbnQ7XG4gICAgYm91bmRNZXRob2QuX19yZWFjdEJvdW5kTWV0aG9kID0gbWV0aG9kO1xuICAgIGJvdW5kTWV0aG9kLl9fcmVhY3RCb3VuZEFyZ3VtZW50cyA9IG51bGw7XG4gICAgdmFyIGNvbXBvbmVudE5hbWUgPSBjb21wb25lbnQuY29uc3RydWN0b3IuZGlzcGxheU5hbWU7XG4gICAgdmFyIF9iaW5kID0gYm91bmRNZXRob2QuYmluZDtcbiAgICBib3VuZE1ldGhvZC5iaW5kID0gZnVuY3Rpb24gKG5ld1RoaXMpIHtcbiAgICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICAgIH1cblxuICAgICAgLy8gVXNlciBpcyB0cnlpbmcgdG8gYmluZCgpIGFuIGF1dG9ib3VuZCBtZXRob2Q7IHdlIGVmZmVjdGl2ZWx5IHdpbGxcbiAgICAgIC8vIGlnbm9yZSB0aGUgdmFsdWUgb2YgXCJ0aGlzXCIgdGhhdCB0aGUgdXNlciBpcyB0cnlpbmcgdG8gdXNlLCBzb1xuICAgICAgLy8gbGV0J3Mgd2Fybi5cbiAgICAgIGlmIChuZXdUaGlzICE9PSBjb21wb25lbnQgJiYgbmV3VGhpcyAhPT0gbnVsbCkge1xuICAgICAgICBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICdiaW5kKCk6IFJlYWN0IGNvbXBvbmVudCBtZXRob2RzIG1heSBvbmx5IGJlIGJvdW5kIHRvIHRoZSAnICsgJ2NvbXBvbmVudCBpbnN0YW5jZS4gU2VlICVzJywgY29tcG9uZW50TmFtZSkgOiB2b2lkIDA7XG4gICAgICB9IGVsc2UgaWYgKCFhcmdzLmxlbmd0aCkge1xuICAgICAgICBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICdiaW5kKCk6IFlvdSBhcmUgYmluZGluZyBhIGNvbXBvbmVudCBtZXRob2QgdG8gdGhlIGNvbXBvbmVudC4gJyArICdSZWFjdCBkb2VzIHRoaXMgZm9yIHlvdSBhdXRvbWF0aWNhbGx5IGluIGEgaGlnaC1wZXJmb3JtYW5jZSAnICsgJ3dheSwgc28geW91IGNhbiBzYWZlbHkgcmVtb3ZlIHRoaXMgY2FsbC4gU2VlICVzJywgY29tcG9uZW50TmFtZSkgOiB2b2lkIDA7XG4gICAgICAgIHJldHVybiBib3VuZE1ldGhvZDtcbiAgICAgIH1cbiAgICAgIHZhciByZWJvdW5kTWV0aG9kID0gX2JpbmQuYXBwbHkoYm91bmRNZXRob2QsIGFyZ3VtZW50cyk7XG4gICAgICByZWJvdW5kTWV0aG9kLl9fcmVhY3RCb3VuZENvbnRleHQgPSBjb21wb25lbnQ7XG4gICAgICByZWJvdW5kTWV0aG9kLl9fcmVhY3RCb3VuZE1ldGhvZCA9IG1ldGhvZDtcbiAgICAgIHJlYm91bmRNZXRob2QuX19yZWFjdEJvdW5kQXJndW1lbnRzID0gYXJncztcbiAgICAgIHJldHVybiByZWJvdW5kTWV0aG9kO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGJvdW5kTWV0aG9kO1xufVxuXG4vKipcbiAqIEJpbmRzIGFsbCBhdXRvLWJvdW5kIG1ldGhvZHMgaW4gYSBjb21wb25lbnQuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IGNvbXBvbmVudCBDb21wb25lbnQgd2hvc2UgbWV0aG9kIGlzIGdvaW5nIHRvIGJlIGJvdW5kLlxuICovXG5mdW5jdGlvbiBiaW5kQXV0b0JpbmRNZXRob2RzKGNvbXBvbmVudCkge1xuICB2YXIgcGFpcnMgPSBjb21wb25lbnQuX19yZWFjdEF1dG9CaW5kUGFpcnM7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcGFpcnMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICB2YXIgYXV0b0JpbmRLZXkgPSBwYWlyc1tpXTtcbiAgICB2YXIgbWV0aG9kID0gcGFpcnNbaSArIDFdO1xuICAgIGNvbXBvbmVudFthdXRvQmluZEtleV0gPSBiaW5kQXV0b0JpbmRNZXRob2QoY29tcG9uZW50LCBtZXRob2QpO1xuICB9XG59XG5cbi8qKlxuICogQWRkIG1vcmUgdG8gdGhlIFJlYWN0Q2xhc3MgYmFzZSBjbGFzcy4gVGhlc2UgYXJlIGFsbCBsZWdhY3kgZmVhdHVyZXMgYW5kXG4gKiB0aGVyZWZvcmUgbm90IGFscmVhZHkgcGFydCBvZiB0aGUgbW9kZXJuIFJlYWN0Q29tcG9uZW50LlxuICovXG52YXIgUmVhY3RDbGFzc01peGluID0ge1xuXG4gIC8qKlxuICAgKiBUT0RPOiBUaGlzIHdpbGwgYmUgZGVwcmVjYXRlZCBiZWNhdXNlIHN0YXRlIHNob3VsZCBhbHdheXMga2VlcCBhIGNvbnNpc3RlbnRcbiAgICogdHlwZSBzaWduYXR1cmUgYW5kIHRoZSBvbmx5IHVzZSBjYXNlIGZvciB0aGlzLCBpcyB0byBhdm9pZCB0aGF0LlxuICAgKi9cbiAgcmVwbGFjZVN0YXRlOiBmdW5jdGlvbiAobmV3U3RhdGUsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy51cGRhdGVyLmVucXVldWVSZXBsYWNlU3RhdGUodGhpcywgbmV3U3RhdGUpO1xuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgdGhpcy51cGRhdGVyLmVucXVldWVDYWxsYmFjayh0aGlzLCBjYWxsYmFjaywgJ3JlcGxhY2VTdGF0ZScpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgb3Igbm90IHRoaXMgY29tcG9zaXRlIGNvbXBvbmVudCBpcyBtb3VudGVkLlxuICAgKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIG1vdW50ZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICogQHByb3RlY3RlZFxuICAgKiBAZmluYWxcbiAgICovXG4gIGlzTW91bnRlZDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnVwZGF0ZXIuaXNNb3VudGVkKHRoaXMpO1xuICB9XG59O1xuXG52YXIgUmVhY3RDbGFzc0NvbXBvbmVudCA9IGZ1bmN0aW9uICgpIHt9O1xuX2Fzc2lnbihSZWFjdENsYXNzQ29tcG9uZW50LnByb3RvdHlwZSwgUmVhY3RDb21wb25lbnQucHJvdG90eXBlLCBSZWFjdENsYXNzTWl4aW4pO1xuXG52YXIgZGlkV2FybkRlcHJlY2F0ZWQgPSBmYWxzZTtcblxuLyoqXG4gKiBNb2R1bGUgZm9yIGNyZWF0aW5nIGNvbXBvc2l0ZSBjb21wb25lbnRzLlxuICpcbiAqIEBjbGFzcyBSZWFjdENsYXNzXG4gKi9cbnZhciBSZWFjdENsYXNzID0ge1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgY29tcG9zaXRlIGNvbXBvbmVudCBjbGFzcyBnaXZlbiBhIGNsYXNzIHNwZWNpZmljYXRpb24uXG4gICAqIFNlZSBodHRwczovL2ZhY2Vib29rLmdpdGh1Yi5pby9yZWFjdC9kb2NzL3RvcC1sZXZlbC1hcGkuaHRtbCNyZWFjdC5jcmVhdGVjbGFzc1xuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gc3BlYyBDbGFzcyBzcGVjaWZpY2F0aW9uICh3aGljaCBtdXN0IGRlZmluZSBgcmVuZGVyYCkuXG4gICAqIEByZXR1cm4ge2Z1bmN0aW9ufSBDb21wb25lbnQgY29uc3RydWN0b3IgZnVuY3Rpb24uXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIGNyZWF0ZUNsYXNzOiBmdW5jdGlvbiAoc3BlYykge1xuICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGRpZFdhcm5EZXByZWNhdGVkLCAnJXM6IFJlYWN0LmNyZWF0ZUNsYXNzIGlzIGRlcHJlY2F0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiB2ZXJzaW9uIDE2LiAnICsgJ1VzZSBwbGFpbiBKYXZhU2NyaXB0IGNsYXNzZXMgaW5zdGVhZC4gSWYgeW91XFwncmUgbm90IHlldCByZWFkeSB0byAnICsgJ21pZ3JhdGUsIGNyZWF0ZS1yZWFjdC1jbGFzcyBpcyBhdmFpbGFibGUgb24gbnBtIGFzIGEgJyArICdkcm9wLWluIHJlcGxhY2VtZW50LicsIHNwZWMgJiYgc3BlYy5kaXNwbGF5TmFtZSB8fCAnQSBDb21wb25lbnQnKSA6IHZvaWQgMDtcbiAgICAgIGRpZFdhcm5EZXByZWNhdGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBUbyBrZWVwIG91ciB3YXJuaW5ncyBtb3JlIHVuZGVyc3RhbmRhYmxlLCB3ZSdsbCB1c2UgYSBsaXR0bGUgaGFjayBoZXJlIHRvXG4gICAgLy8gZW5zdXJlIHRoYXQgQ29uc3RydWN0b3IubmFtZSAhPT0gJ0NvbnN0cnVjdG9yJy4gVGhpcyBtYWtlcyBzdXJlIHdlIGRvbid0XG4gICAgLy8gdW5uZWNlc3NhcmlseSBpZGVudGlmeSBhIGNsYXNzIHdpdGhvdXQgZGlzcGxheU5hbWUgYXMgJ0NvbnN0cnVjdG9yJy5cbiAgICB2YXIgQ29uc3RydWN0b3IgPSBpZGVudGl0eShmdW5jdGlvbiAocHJvcHMsIGNvbnRleHQsIHVwZGF0ZXIpIHtcbiAgICAgIC8vIFRoaXMgY29uc3RydWN0b3IgZ2V0cyBvdmVycmlkZGVuIGJ5IG1vY2tzLiBUaGUgYXJndW1lbnQgaXMgdXNlZFxuICAgICAgLy8gYnkgbW9ja3MgdG8gYXNzZXJ0IG9uIHdoYXQgZ2V0cyBtb3VudGVkLlxuXG4gICAgICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKHRoaXMgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvciwgJ1NvbWV0aGluZyBpcyBjYWxsaW5nIGEgUmVhY3QgY29tcG9uZW50IGRpcmVjdGx5LiBVc2UgYSBmYWN0b3J5IG9yICcgKyAnSlNYIGluc3RlYWQuIFNlZTogaHR0cHM6Ly9mYi5tZS9yZWFjdC1sZWdhY3lmYWN0b3J5JykgOiB2b2lkIDA7XG4gICAgICB9XG5cbiAgICAgIC8vIFdpcmUgdXAgYXV0by1iaW5kaW5nXG4gICAgICBpZiAodGhpcy5fX3JlYWN0QXV0b0JpbmRQYWlycy5sZW5ndGgpIHtcbiAgICAgICAgYmluZEF1dG9CaW5kTWV0aG9kcyh0aGlzKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgICAgIHRoaXMucmVmcyA9IGVtcHR5T2JqZWN0O1xuICAgICAgdGhpcy51cGRhdGVyID0gdXBkYXRlciB8fCBSZWFjdE5vb3BVcGRhdGVRdWV1ZTtcblxuICAgICAgdGhpcy5zdGF0ZSA9IG51bGw7XG5cbiAgICAgIC8vIFJlYWN0Q2xhc3NlcyBkb2Vzbid0IGhhdmUgY29uc3RydWN0b3JzLiBJbnN0ZWFkLCB0aGV5IHVzZSB0aGVcbiAgICAgIC8vIGdldEluaXRpYWxTdGF0ZSBhbmQgY29tcG9uZW50V2lsbE1vdW50IG1ldGhvZHMgZm9yIGluaXRpYWxpemF0aW9uLlxuXG4gICAgICB2YXIgaW5pdGlhbFN0YXRlID0gdGhpcy5nZXRJbml0aWFsU3RhdGUgPyB0aGlzLmdldEluaXRpYWxTdGF0ZSgpIDogbnVsbDtcbiAgICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAvLyBXZSBhbGxvdyBhdXRvLW1vY2tzIHRvIHByb2NlZWQgYXMgaWYgdGhleSdyZSByZXR1cm5pbmcgbnVsbC5cbiAgICAgICAgaWYgKGluaXRpYWxTdGF0ZSA9PT0gdW5kZWZpbmVkICYmIHRoaXMuZ2V0SW5pdGlhbFN0YXRlLl9pc01vY2tGdW5jdGlvbikge1xuICAgICAgICAgIC8vIFRoaXMgaXMgcHJvYmFibHkgYmFkIHByYWN0aWNlLiBDb25zaWRlciB3YXJuaW5nIGhlcmUgYW5kXG4gICAgICAgICAgLy8gZGVwcmVjYXRpbmcgdGhpcyBjb252ZW5pZW5jZS5cbiAgICAgICAgICBpbml0aWFsU3RhdGUgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAhKHR5cGVvZiBpbml0aWFsU3RhdGUgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KGluaXRpYWxTdGF0ZSkpID8gXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICclcy5nZXRJbml0aWFsU3RhdGUoKTogbXVzdCByZXR1cm4gYW4gb2JqZWN0IG9yIG51bGwnLCBDb25zdHJ1Y3Rvci5kaXNwbGF5TmFtZSB8fCAnUmVhY3RDb21wb3NpdGVDb21wb25lbnQnKSA6IF9wcm9kSW52YXJpYW50KCc4MicsIENvbnN0cnVjdG9yLmRpc3BsYXlOYW1lIHx8ICdSZWFjdENvbXBvc2l0ZUNvbXBvbmVudCcpIDogdm9pZCAwO1xuXG4gICAgICB0aGlzLnN0YXRlID0gaW5pdGlhbFN0YXRlO1xuICAgIH0pO1xuICAgIENvbnN0cnVjdG9yLnByb3RvdHlwZSA9IG5ldyBSZWFjdENsYXNzQ29tcG9uZW50KCk7XG4gICAgQ29uc3RydWN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQ29uc3RydWN0b3I7XG4gICAgQ29uc3RydWN0b3IucHJvdG90eXBlLl9fcmVhY3RBdXRvQmluZFBhaXJzID0gW107XG5cbiAgICBpbmplY3RlZE1peGlucy5mb3JFYWNoKG1peFNwZWNJbnRvQ29tcG9uZW50LmJpbmQobnVsbCwgQ29uc3RydWN0b3IpKTtcblxuICAgIG1peFNwZWNJbnRvQ29tcG9uZW50KENvbnN0cnVjdG9yLCBzcGVjKTtcblxuICAgIC8vIEluaXRpYWxpemUgdGhlIGRlZmF1bHRQcm9wcyBwcm9wZXJ0eSBhZnRlciBhbGwgbWl4aW5zIGhhdmUgYmVlbiBtZXJnZWQuXG4gICAgaWYgKENvbnN0cnVjdG9yLmdldERlZmF1bHRQcm9wcykge1xuICAgICAgQ29uc3RydWN0b3IuZGVmYXVsdFByb3BzID0gQ29uc3RydWN0b3IuZ2V0RGVmYXVsdFByb3BzKCk7XG4gICAgfVxuXG4gICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAvLyBUaGlzIGlzIGEgdGFnIHRvIGluZGljYXRlIHRoYXQgdGhlIHVzZSBvZiB0aGVzZSBtZXRob2QgbmFtZXMgaXMgb2ssXG4gICAgICAvLyBzaW5jZSBpdCdzIHVzZWQgd2l0aCBjcmVhdGVDbGFzcy4gSWYgaXQncyBub3QsIHRoZW4gaXQncyBsaWtlbHkgYVxuICAgICAgLy8gbWlzdGFrZSBzbyB3ZSdsbCB3YXJuIHlvdSB0byB1c2UgdGhlIHN0YXRpYyBwcm9wZXJ0eSwgcHJvcGVydHlcbiAgICAgIC8vIGluaXRpYWxpemVyIG9yIGNvbnN0cnVjdG9yIHJlc3BlY3RpdmVseS5cbiAgICAgIGlmIChDb25zdHJ1Y3Rvci5nZXREZWZhdWx0UHJvcHMpIHtcbiAgICAgICAgQ29uc3RydWN0b3IuZ2V0RGVmYXVsdFByb3BzLmlzUmVhY3RDbGFzc0FwcHJvdmVkID0ge307XG4gICAgICB9XG4gICAgICBpZiAoQ29uc3RydWN0b3IucHJvdG90eXBlLmdldEluaXRpYWxTdGF0ZSkge1xuICAgICAgICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUuZ2V0SW5pdGlhbFN0YXRlLmlzUmVhY3RDbGFzc0FwcHJvdmVkID0ge307XG4gICAgICB9XG4gICAgfVxuXG4gICAgIUNvbnN0cnVjdG9yLnByb3RvdHlwZS5yZW5kZXIgPyBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ2NyZWF0ZUNsYXNzKC4uLik6IENsYXNzIHNwZWNpZmljYXRpb24gbXVzdCBpbXBsZW1lbnQgYSBgcmVuZGVyYCBtZXRob2QuJykgOiBfcHJvZEludmFyaWFudCgnODMnKSA6IHZvaWQgMDtcblxuICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKCFDb25zdHJ1Y3Rvci5wcm90b3R5cGUuY29tcG9uZW50U2hvdWxkVXBkYXRlLCAnJXMgaGFzIGEgbWV0aG9kIGNhbGxlZCAnICsgJ2NvbXBvbmVudFNob3VsZFVwZGF0ZSgpLiBEaWQgeW91IG1lYW4gc2hvdWxkQ29tcG9uZW50VXBkYXRlKCk/ICcgKyAnVGhlIG5hbWUgaXMgcGhyYXNlZCBhcyBhIHF1ZXN0aW9uIGJlY2F1c2UgdGhlIGZ1bmN0aW9uIGlzICcgKyAnZXhwZWN0ZWQgdG8gcmV0dXJuIGEgdmFsdWUuJywgc3BlYy5kaXNwbGF5TmFtZSB8fCAnQSBjb21wb25lbnQnKSA6IHZvaWQgMDtcbiAgICAgIFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyghQ29uc3RydWN0b3IucHJvdG90eXBlLmNvbXBvbmVudFdpbGxSZWNpZXZlUHJvcHMsICclcyBoYXMgYSBtZXRob2QgY2FsbGVkICcgKyAnY29tcG9uZW50V2lsbFJlY2lldmVQcm9wcygpLiBEaWQgeW91IG1lYW4gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcygpPycsIHNwZWMuZGlzcGxheU5hbWUgfHwgJ0EgY29tcG9uZW50JykgOiB2b2lkIDA7XG4gICAgfVxuXG4gICAgLy8gUmVkdWNlIHRpbWUgc3BlbnQgZG9pbmcgbG9va3VwcyBieSBzZXR0aW5nIHRoZXNlIG9uIHRoZSBwcm90b3R5cGUuXG4gICAgZm9yICh2YXIgbWV0aG9kTmFtZSBpbiBSZWFjdENsYXNzSW50ZXJmYWNlKSB7XG4gICAgICBpZiAoIUNvbnN0cnVjdG9yLnByb3RvdHlwZVttZXRob2ROYW1lXSkge1xuICAgICAgICBDb25zdHJ1Y3Rvci5wcm90b3R5cGVbbWV0aG9kTmFtZV0gPSBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcbiAgfSxcblxuICBpbmplY3Rpb246IHtcbiAgICBpbmplY3RNaXhpbjogZnVuY3Rpb24gKG1peGluKSB7XG4gICAgICBpbmplY3RlZE1peGlucy5wdXNoKG1peGluKTtcbiAgICB9XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdENsYXNzO1xufSx7XCIxMFwiOjEwLFwiMTNcIjoxMyxcIjE0XCI6MTQsXCIyNVwiOjI1LFwiMjhcIjoyOCxcIjI5XCI6MjksXCIzMFwiOjMwLFwiMzFcIjozMSxcIjZcIjo2fV0sNjpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG4vKipcbiAqIENvcHlyaWdodCAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgX3Byb2RJbnZhcmlhbnQgPSBfZGVyZXFfKDI1KTtcblxudmFyIFJlYWN0Tm9vcFVwZGF0ZVF1ZXVlID0gX2RlcmVxXygxMyk7XG5cbnZhciBjYW5EZWZpbmVQcm9wZXJ0eSA9IF9kZXJlcV8oMjApO1xudmFyIGVtcHR5T2JqZWN0ID0gX2RlcmVxXygyOCk7XG52YXIgaW52YXJpYW50ID0gX2RlcmVxXygyOSk7XG52YXIgd2FybmluZyA9IF9kZXJlcV8oMzApO1xuXG4vKipcbiAqIEJhc2UgY2xhc3MgaGVscGVycyBmb3IgdGhlIHVwZGF0aW5nIHN0YXRlIG9mIGEgY29tcG9uZW50LlxuICovXG5mdW5jdGlvbiBSZWFjdENvbXBvbmVudChwcm9wcywgY29udGV4dCwgdXBkYXRlcikge1xuICB0aGlzLnByb3BzID0gcHJvcHM7XG4gIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gIHRoaXMucmVmcyA9IGVtcHR5T2JqZWN0O1xuICAvLyBXZSBpbml0aWFsaXplIHRoZSBkZWZhdWx0IHVwZGF0ZXIgYnV0IHRoZSByZWFsIG9uZSBnZXRzIGluamVjdGVkIGJ5IHRoZVxuICAvLyByZW5kZXJlci5cbiAgdGhpcy51cGRhdGVyID0gdXBkYXRlciB8fCBSZWFjdE5vb3BVcGRhdGVRdWV1ZTtcbn1cblxuUmVhY3RDb21wb25lbnQucHJvdG90eXBlLmlzUmVhY3RDb21wb25lbnQgPSB7fTtcblxuLyoqXG4gKiBTZXRzIGEgc3Vic2V0IG9mIHRoZSBzdGF0ZS4gQWx3YXlzIHVzZSB0aGlzIHRvIG11dGF0ZVxuICogc3RhdGUuIFlvdSBzaG91bGQgdHJlYXQgYHRoaXMuc3RhdGVgIGFzIGltbXV0YWJsZS5cbiAqXG4gKiBUaGVyZSBpcyBubyBndWFyYW50ZWUgdGhhdCBgdGhpcy5zdGF0ZWAgd2lsbCBiZSBpbW1lZGlhdGVseSB1cGRhdGVkLCBzb1xuICogYWNjZXNzaW5nIGB0aGlzLnN0YXRlYCBhZnRlciBjYWxsaW5nIHRoaXMgbWV0aG9kIG1heSByZXR1cm4gdGhlIG9sZCB2YWx1ZS5cbiAqXG4gKiBUaGVyZSBpcyBubyBndWFyYW50ZWUgdGhhdCBjYWxscyB0byBgc2V0U3RhdGVgIHdpbGwgcnVuIHN5bmNocm9ub3VzbHksXG4gKiBhcyB0aGV5IG1heSBldmVudHVhbGx5IGJlIGJhdGNoZWQgdG9nZXRoZXIuICBZb3UgY2FuIHByb3ZpZGUgYW4gb3B0aW9uYWxcbiAqIGNhbGxiYWNrIHRoYXQgd2lsbCBiZSBleGVjdXRlZCB3aGVuIHRoZSBjYWxsIHRvIHNldFN0YXRlIGlzIGFjdHVhbGx5XG4gKiBjb21wbGV0ZWQuXG4gKlxuICogV2hlbiBhIGZ1bmN0aW9uIGlzIHByb3ZpZGVkIHRvIHNldFN0YXRlLCBpdCB3aWxsIGJlIGNhbGxlZCBhdCBzb21lIHBvaW50IGluXG4gKiB0aGUgZnV0dXJlIChub3Qgc3luY2hyb25vdXNseSkuIEl0IHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlIHVwIHRvIGRhdGVcbiAqIGNvbXBvbmVudCBhcmd1bWVudHMgKHN0YXRlLCBwcm9wcywgY29udGV4dCkuIFRoZXNlIHZhbHVlcyBjYW4gYmUgZGlmZmVyZW50XG4gKiBmcm9tIHRoaXMuKiBiZWNhdXNlIHlvdXIgZnVuY3Rpb24gbWF5IGJlIGNhbGxlZCBhZnRlciByZWNlaXZlUHJvcHMgYnV0IGJlZm9yZVxuICogc2hvdWxkQ29tcG9uZW50VXBkYXRlLCBhbmQgdGhpcyBuZXcgc3RhdGUsIHByb3BzLCBhbmQgY29udGV4dCB3aWxsIG5vdCB5ZXQgYmVcbiAqIGFzc2lnbmVkIHRvIHRoaXMuXG4gKlxuICogQHBhcmFtIHtvYmplY3R8ZnVuY3Rpb259IHBhcnRpYWxTdGF0ZSBOZXh0IHBhcnRpYWwgc3RhdGUgb3IgZnVuY3Rpb24gdG9cbiAqICAgICAgICBwcm9kdWNlIG5leHQgcGFydGlhbCBzdGF0ZSB0byBiZSBtZXJnZWQgd2l0aCBjdXJyZW50IHN0YXRlLlxuICogQHBhcmFtIHs/ZnVuY3Rpb259IGNhbGxiYWNrIENhbGxlZCBhZnRlciBzdGF0ZSBpcyB1cGRhdGVkLlxuICogQGZpbmFsXG4gKiBAcHJvdGVjdGVkXG4gKi9cblJlYWN0Q29tcG9uZW50LnByb3RvdHlwZS5zZXRTdGF0ZSA9IGZ1bmN0aW9uIChwYXJ0aWFsU3RhdGUsIGNhbGxiYWNrKSB7XG4gICEodHlwZW9mIHBhcnRpYWxTdGF0ZSA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIHBhcnRpYWxTdGF0ZSA9PT0gJ2Z1bmN0aW9uJyB8fCBwYXJ0aWFsU3RhdGUgPT0gbnVsbCkgPyBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ3NldFN0YXRlKC4uLik6IHRha2VzIGFuIG9iamVjdCBvZiBzdGF0ZSB2YXJpYWJsZXMgdG8gdXBkYXRlIG9yIGEgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyBhbiBvYmplY3Qgb2Ygc3RhdGUgdmFyaWFibGVzLicpIDogX3Byb2RJbnZhcmlhbnQoJzg1JykgOiB2b2lkIDA7XG4gIHRoaXMudXBkYXRlci5lbnF1ZXVlU2V0U3RhdGUodGhpcywgcGFydGlhbFN0YXRlKTtcbiAgaWYgKGNhbGxiYWNrKSB7XG4gICAgdGhpcy51cGRhdGVyLmVucXVldWVDYWxsYmFjayh0aGlzLCBjYWxsYmFjaywgJ3NldFN0YXRlJyk7XG4gIH1cbn07XG5cbi8qKlxuICogRm9yY2VzIGFuIHVwZGF0ZS4gVGhpcyBzaG91bGQgb25seSBiZSBpbnZva2VkIHdoZW4gaXQgaXMga25vd24gd2l0aFxuICogY2VydGFpbnR5IHRoYXQgd2UgYXJlICoqbm90KiogaW4gYSBET00gdHJhbnNhY3Rpb24uXG4gKlxuICogWW91IG1heSB3YW50IHRvIGNhbGwgdGhpcyB3aGVuIHlvdSBrbm93IHRoYXQgc29tZSBkZWVwZXIgYXNwZWN0IG9mIHRoZVxuICogY29tcG9uZW50J3Mgc3RhdGUgaGFzIGNoYW5nZWQgYnV0IGBzZXRTdGF0ZWAgd2FzIG5vdCBjYWxsZWQuXG4gKlxuICogVGhpcyB3aWxsIG5vdCBpbnZva2UgYHNob3VsZENvbXBvbmVudFVwZGF0ZWAsIGJ1dCBpdCB3aWxsIGludm9rZVxuICogYGNvbXBvbmVudFdpbGxVcGRhdGVgIGFuZCBgY29tcG9uZW50RGlkVXBkYXRlYC5cbiAqXG4gKiBAcGFyYW0gez9mdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGVkIGFmdGVyIHVwZGF0ZSBpcyBjb21wbGV0ZS5cbiAqIEBmaW5hbFxuICogQHByb3RlY3RlZFxuICovXG5SZWFjdENvbXBvbmVudC5wcm90b3R5cGUuZm9yY2VVcGRhdGUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgdGhpcy51cGRhdGVyLmVucXVldWVGb3JjZVVwZGF0ZSh0aGlzKTtcbiAgaWYgKGNhbGxiYWNrKSB7XG4gICAgdGhpcy51cGRhdGVyLmVucXVldWVDYWxsYmFjayh0aGlzLCBjYWxsYmFjaywgJ2ZvcmNlVXBkYXRlJyk7XG4gIH1cbn07XG5cbi8qKlxuICogRGVwcmVjYXRlZCBBUElzLiBUaGVzZSBBUElzIHVzZWQgdG8gZXhpc3Qgb24gY2xhc3NpYyBSZWFjdCBjbGFzc2VzIGJ1dCBzaW5jZVxuICogd2Ugd291bGQgbGlrZSB0byBkZXByZWNhdGUgdGhlbSwgd2UncmUgbm90IGdvaW5nIHRvIG1vdmUgdGhlbSBvdmVyIHRvIHRoaXNcbiAqIG1vZGVybiBiYXNlIGNsYXNzLiBJbnN0ZWFkLCB3ZSBkZWZpbmUgYSBnZXR0ZXIgdGhhdCB3YXJucyBpZiBpdCdzIGFjY2Vzc2VkLlxuICovXG5pZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFyIGRlcHJlY2F0ZWRBUElzID0ge1xuICAgIGlzTW91bnRlZDogWydpc01vdW50ZWQnLCAnSW5zdGVhZCwgbWFrZSBzdXJlIHRvIGNsZWFuIHVwIHN1YnNjcmlwdGlvbnMgYW5kIHBlbmRpbmcgcmVxdWVzdHMgaW4gJyArICdjb21wb25lbnRXaWxsVW5tb3VudCB0byBwcmV2ZW50IG1lbW9yeSBsZWFrcy4nXSxcbiAgICByZXBsYWNlU3RhdGU6IFsncmVwbGFjZVN0YXRlJywgJ1JlZmFjdG9yIHlvdXIgY29kZSB0byB1c2Ugc2V0U3RhdGUgaW5zdGVhZCAoc2VlICcgKyAnaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2lzc3Vlcy8zMjM2KS4nXVxuICB9O1xuICB2YXIgZGVmaW5lRGVwcmVjYXRpb25XYXJuaW5nID0gZnVuY3Rpb24gKG1ldGhvZE5hbWUsIGluZm8pIHtcbiAgICBpZiAoY2FuRGVmaW5lUHJvcGVydHkpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSZWFjdENvbXBvbmVudC5wcm90b3R5cGUsIG1ldGhvZE5hbWUsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGZhbHNlLCAnJXMoLi4uKSBpcyBkZXByZWNhdGVkIGluIHBsYWluIEphdmFTY3JpcHQgUmVhY3QgY2xhc3Nlcy4gJXMnLCBpbmZvWzBdLCBpbmZvWzFdKSA6IHZvaWQgMDtcbiAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG4gIGZvciAodmFyIGZuTmFtZSBpbiBkZXByZWNhdGVkQVBJcykge1xuICAgIGlmIChkZXByZWNhdGVkQVBJcy5oYXNPd25Qcm9wZXJ0eShmbk5hbWUpKSB7XG4gICAgICBkZWZpbmVEZXByZWNhdGlvbldhcm5pbmcoZm5OYW1lLCBkZXByZWNhdGVkQVBJc1tmbk5hbWVdKTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdENvbXBvbmVudDtcbn0se1wiMTNcIjoxMyxcIjIwXCI6MjAsXCIyNVwiOjI1LFwiMjhcIjoyOCxcIjI5XCI6MjksXCIzMFwiOjMwfV0sNzpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG4vKipcbiAqIENvcHlyaWdodCAyMDE2LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBfcHJvZEludmFyaWFudCA9IF9kZXJlcV8oMjUpO1xuXG52YXIgUmVhY3RDdXJyZW50T3duZXIgPSBfZGVyZXFfKDgpO1xuXG52YXIgaW52YXJpYW50ID0gX2RlcmVxXygyOSk7XG52YXIgd2FybmluZyA9IF9kZXJlcV8oMzApO1xuXG5mdW5jdGlvbiBpc05hdGl2ZShmbikge1xuICAvLyBCYXNlZCBvbiBpc05hdGl2ZSgpIGZyb20gTG9kYXNoXG4gIHZhciBmdW5jVG9TdHJpbmcgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmc7XG4gIHZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG4gIHZhciByZUlzTmF0aXZlID0gUmVnRXhwKCdeJyArIGZ1bmNUb1N0cmluZ1xuICAvLyBUYWtlIGFuIGV4YW1wbGUgbmF0aXZlIGZ1bmN0aW9uIHNvdXJjZSBmb3IgY29tcGFyaXNvblxuICAuY2FsbChoYXNPd25Qcm9wZXJ0eSlcbiAgLy8gU3RyaXAgcmVnZXggY2hhcmFjdGVycyBzbyB3ZSBjYW4gdXNlIGl0IGZvciByZWdleFxuICAucmVwbGFjZSgvW1xcXFxeJC4qKz8oKVtcXF17fXxdL2csICdcXFxcJCYnKVxuICAvLyBSZW1vdmUgaGFzT3duUHJvcGVydHkgZnJvbSB0aGUgdGVtcGxhdGUgdG8gbWFrZSBpdCBnZW5lcmljXG4gIC5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcXFxcKCl8IGZvciAuKz8oPz1cXFxcXFxdKS9nLCAnJDEuKj8nKSArICckJyk7XG4gIHRyeSB7XG4gICAgdmFyIHNvdXJjZSA9IGZ1bmNUb1N0cmluZy5jYWxsKGZuKTtcbiAgICByZXR1cm4gcmVJc05hdGl2ZS50ZXN0KHNvdXJjZSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG52YXIgY2FuVXNlQ29sbGVjdGlvbnMgPVxuLy8gQXJyYXkuZnJvbVxudHlwZW9mIEFycmF5LmZyb20gPT09ICdmdW5jdGlvbicgJiZcbi8vIE1hcFxudHlwZW9mIE1hcCA9PT0gJ2Z1bmN0aW9uJyAmJiBpc05hdGl2ZShNYXApICYmXG4vLyBNYXAucHJvdG90eXBlLmtleXNcbk1hcC5wcm90b3R5cGUgIT0gbnVsbCAmJiB0eXBlb2YgTWFwLnByb3RvdHlwZS5rZXlzID09PSAnZnVuY3Rpb24nICYmIGlzTmF0aXZlKE1hcC5wcm90b3R5cGUua2V5cykgJiZcbi8vIFNldFxudHlwZW9mIFNldCA9PT0gJ2Z1bmN0aW9uJyAmJiBpc05hdGl2ZShTZXQpICYmXG4vLyBTZXQucHJvdG90eXBlLmtleXNcblNldC5wcm90b3R5cGUgIT0gbnVsbCAmJiB0eXBlb2YgU2V0LnByb3RvdHlwZS5rZXlzID09PSAnZnVuY3Rpb24nICYmIGlzTmF0aXZlKFNldC5wcm90b3R5cGUua2V5cyk7XG5cbnZhciBzZXRJdGVtO1xudmFyIGdldEl0ZW07XG52YXIgcmVtb3ZlSXRlbTtcbnZhciBnZXRJdGVtSURzO1xudmFyIGFkZFJvb3Q7XG52YXIgcmVtb3ZlUm9vdDtcbnZhciBnZXRSb290SURzO1xuXG5pZiAoY2FuVXNlQ29sbGVjdGlvbnMpIHtcbiAgdmFyIGl0ZW1NYXAgPSBuZXcgTWFwKCk7XG4gIHZhciByb290SURTZXQgPSBuZXcgU2V0KCk7XG5cbiAgc2V0SXRlbSA9IGZ1bmN0aW9uIChpZCwgaXRlbSkge1xuICAgIGl0ZW1NYXAuc2V0KGlkLCBpdGVtKTtcbiAgfTtcbiAgZ2V0SXRlbSA9IGZ1bmN0aW9uIChpZCkge1xuICAgIHJldHVybiBpdGVtTWFwLmdldChpZCk7XG4gIH07XG4gIHJlbW92ZUl0ZW0gPSBmdW5jdGlvbiAoaWQpIHtcbiAgICBpdGVtTWFwWydkZWxldGUnXShpZCk7XG4gIH07XG4gIGdldEl0ZW1JRHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20oaXRlbU1hcC5rZXlzKCkpO1xuICB9O1xuXG4gIGFkZFJvb3QgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICByb290SURTZXQuYWRkKGlkKTtcbiAgfTtcbiAgcmVtb3ZlUm9vdCA9IGZ1bmN0aW9uIChpZCkge1xuICAgIHJvb3RJRFNldFsnZGVsZXRlJ10oaWQpO1xuICB9O1xuICBnZXRSb290SURzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHJvb3RJRFNldC5rZXlzKCkpO1xuICB9O1xufSBlbHNlIHtcbiAgdmFyIGl0ZW1CeUtleSA9IHt9O1xuICB2YXIgcm9vdEJ5S2V5ID0ge307XG5cbiAgLy8gVXNlIG5vbi1udW1lcmljIGtleXMgdG8gcHJldmVudCBWOCBwZXJmb3JtYW5jZSBpc3N1ZXM6XG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9wdWxsLzcyMzJcbiAgdmFyIGdldEtleUZyb21JRCA9IGZ1bmN0aW9uIChpZCkge1xuICAgIHJldHVybiAnLicgKyBpZDtcbiAgfTtcbiAgdmFyIGdldElERnJvbUtleSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gcGFyc2VJbnQoa2V5LnN1YnN0cigxKSwgMTApO1xuICB9O1xuXG4gIHNldEl0ZW0gPSBmdW5jdGlvbiAoaWQsIGl0ZW0pIHtcbiAgICB2YXIga2V5ID0gZ2V0S2V5RnJvbUlEKGlkKTtcbiAgICBpdGVtQnlLZXlba2V5XSA9IGl0ZW07XG4gIH07XG4gIGdldEl0ZW0gPSBmdW5jdGlvbiAoaWQpIHtcbiAgICB2YXIga2V5ID0gZ2V0S2V5RnJvbUlEKGlkKTtcbiAgICByZXR1cm4gaXRlbUJ5S2V5W2tleV07XG4gIH07XG4gIHJlbW92ZUl0ZW0gPSBmdW5jdGlvbiAoaWQpIHtcbiAgICB2YXIga2V5ID0gZ2V0S2V5RnJvbUlEKGlkKTtcbiAgICBkZWxldGUgaXRlbUJ5S2V5W2tleV07XG4gIH07XG4gIGdldEl0ZW1JRHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGl0ZW1CeUtleSkubWFwKGdldElERnJvbUtleSk7XG4gIH07XG5cbiAgYWRkUm9vdCA9IGZ1bmN0aW9uIChpZCkge1xuICAgIHZhciBrZXkgPSBnZXRLZXlGcm9tSUQoaWQpO1xuICAgIHJvb3RCeUtleVtrZXldID0gdHJ1ZTtcbiAgfTtcbiAgcmVtb3ZlUm9vdCA9IGZ1bmN0aW9uIChpZCkge1xuICAgIHZhciBrZXkgPSBnZXRLZXlGcm9tSUQoaWQpO1xuICAgIGRlbGV0ZSByb290QnlLZXlba2V5XTtcbiAgfTtcbiAgZ2V0Um9vdElEcyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMocm9vdEJ5S2V5KS5tYXAoZ2V0SURGcm9tS2V5KTtcbiAgfTtcbn1cblxudmFyIHVubW91bnRlZElEcyA9IFtdO1xuXG5mdW5jdGlvbiBwdXJnZURlZXAoaWQpIHtcbiAgdmFyIGl0ZW0gPSBnZXRJdGVtKGlkKTtcbiAgaWYgKGl0ZW0pIHtcbiAgICB2YXIgY2hpbGRJRHMgPSBpdGVtLmNoaWxkSURzO1xuXG4gICAgcmVtb3ZlSXRlbShpZCk7XG4gICAgY2hpbGRJRHMuZm9yRWFjaChwdXJnZURlZXApO1xuICB9XG59XG5cbmZ1bmN0aW9uIGRlc2NyaWJlQ29tcG9uZW50RnJhbWUobmFtZSwgc291cmNlLCBvd25lck5hbWUpIHtcbiAgcmV0dXJuICdcXG4gICAgaW4gJyArIChuYW1lIHx8ICdVbmtub3duJykgKyAoc291cmNlID8gJyAoYXQgJyArIHNvdXJjZS5maWxlTmFtZS5yZXBsYWNlKC9eLipbXFxcXFxcL10vLCAnJykgKyAnOicgKyBzb3VyY2UubGluZU51bWJlciArICcpJyA6IG93bmVyTmFtZSA/ICcgKGNyZWF0ZWQgYnkgJyArIG93bmVyTmFtZSArICcpJyA6ICcnKTtcbn1cblxuZnVuY3Rpb24gZ2V0RGlzcGxheU5hbWUoZWxlbWVudCkge1xuICBpZiAoZWxlbWVudCA9PSBudWxsKSB7XG4gICAgcmV0dXJuICcjZW1wdHknO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBlbGVtZW50ID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgZWxlbWVudCA9PT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gJyN0ZXh0JztcbiAgfSBlbHNlIGlmICh0eXBlb2YgZWxlbWVudC50eXBlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBlbGVtZW50LnR5cGU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGVsZW1lbnQudHlwZS5kaXNwbGF5TmFtZSB8fCBlbGVtZW50LnR5cGUubmFtZSB8fCAnVW5rbm93bic7XG4gIH1cbn1cblxuZnVuY3Rpb24gZGVzY3JpYmVJRChpZCkge1xuICB2YXIgbmFtZSA9IFJlYWN0Q29tcG9uZW50VHJlZUhvb2suZ2V0RGlzcGxheU5hbWUoaWQpO1xuICB2YXIgZWxlbWVudCA9IFJlYWN0Q29tcG9uZW50VHJlZUhvb2suZ2V0RWxlbWVudChpZCk7XG4gIHZhciBvd25lcklEID0gUmVhY3RDb21wb25lbnRUcmVlSG9vay5nZXRPd25lcklEKGlkKTtcbiAgdmFyIG93bmVyTmFtZTtcbiAgaWYgKG93bmVySUQpIHtcbiAgICBvd25lck5hbWUgPSBSZWFjdENvbXBvbmVudFRyZWVIb29rLmdldERpc3BsYXlOYW1lKG93bmVySUQpO1xuICB9XG4gIFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyhlbGVtZW50LCAnUmVhY3RDb21wb25lbnRUcmVlSG9vazogTWlzc2luZyBSZWFjdCBlbGVtZW50IGZvciBkZWJ1Z0lEICVzIHdoZW4gJyArICdidWlsZGluZyBzdGFjaycsIGlkKSA6IHZvaWQgMDtcbiAgcmV0dXJuIGRlc2NyaWJlQ29tcG9uZW50RnJhbWUobmFtZSwgZWxlbWVudCAmJiBlbGVtZW50Ll9zb3VyY2UsIG93bmVyTmFtZSk7XG59XG5cbnZhciBSZWFjdENvbXBvbmVudFRyZWVIb29rID0ge1xuICBvblNldENoaWxkcmVuOiBmdW5jdGlvbiAoaWQsIG5leHRDaGlsZElEcykge1xuICAgIHZhciBpdGVtID0gZ2V0SXRlbShpZCk7XG4gICAgIWl0ZW0gPyBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ0l0ZW0gbXVzdCBoYXZlIGJlZW4gc2V0JykgOiBfcHJvZEludmFyaWFudCgnMTQ0JykgOiB2b2lkIDA7XG4gICAgaXRlbS5jaGlsZElEcyA9IG5leHRDaGlsZElEcztcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmV4dENoaWxkSURzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgbmV4dENoaWxkSUQgPSBuZXh0Q2hpbGRJRHNbaV07XG4gICAgICB2YXIgbmV4dENoaWxkID0gZ2V0SXRlbShuZXh0Q2hpbGRJRCk7XG4gICAgICAhbmV4dENoaWxkID8gXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdFeHBlY3RlZCBob29rIGV2ZW50cyB0byBmaXJlIGZvciB0aGUgY2hpbGQgYmVmb3JlIGl0cyBwYXJlbnQgaW5jbHVkZXMgaXQgaW4gb25TZXRDaGlsZHJlbigpLicpIDogX3Byb2RJbnZhcmlhbnQoJzE0MCcpIDogdm9pZCAwO1xuICAgICAgIShuZXh0Q2hpbGQuY2hpbGRJRHMgIT0gbnVsbCB8fCB0eXBlb2YgbmV4dENoaWxkLmVsZW1lbnQgIT09ICdvYmplY3QnIHx8IG5leHRDaGlsZC5lbGVtZW50ID09IG51bGwpID8gXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdFeHBlY3RlZCBvblNldENoaWxkcmVuKCkgdG8gZmlyZSBmb3IgYSBjb250YWluZXIgY2hpbGQgYmVmb3JlIGl0cyBwYXJlbnQgaW5jbHVkZXMgaXQgaW4gb25TZXRDaGlsZHJlbigpLicpIDogX3Byb2RJbnZhcmlhbnQoJzE0MScpIDogdm9pZCAwO1xuICAgICAgIW5leHRDaGlsZC5pc01vdW50ZWQgPyBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ0V4cGVjdGVkIG9uTW91bnRDb21wb25lbnQoKSB0byBmaXJlIGZvciB0aGUgY2hpbGQgYmVmb3JlIGl0cyBwYXJlbnQgaW5jbHVkZXMgaXQgaW4gb25TZXRDaGlsZHJlbigpLicpIDogX3Byb2RJbnZhcmlhbnQoJzcxJykgOiB2b2lkIDA7XG4gICAgICBpZiAobmV4dENoaWxkLnBhcmVudElEID09IG51bGwpIHtcbiAgICAgICAgbmV4dENoaWxkLnBhcmVudElEID0gaWQ7XG4gICAgICAgIC8vIFRPRE86IFRoaXMgc2hvdWxkbid0IGJlIG5lY2Vzc2FyeSBidXQgbW91bnRpbmcgYSBuZXcgcm9vdCBkdXJpbmcgaW5cbiAgICAgICAgLy8gY29tcG9uZW50V2lsbE1vdW50IGN1cnJlbnRseSBjYXVzZXMgbm90LXlldC1tb3VudGVkIGNvbXBvbmVudHMgdG9cbiAgICAgICAgLy8gYmUgcHVyZ2VkIGZyb20gb3VyIHRyZWUgZGF0YSBzbyB0aGVpciBwYXJlbnQgaWQgaXMgbWlzc2luZy5cbiAgICAgIH1cbiAgICAgICEobmV4dENoaWxkLnBhcmVudElEID09PSBpZCkgPyBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ0V4cGVjdGVkIG9uQmVmb3JlTW91bnRDb21wb25lbnQoKSBwYXJlbnQgYW5kIG9uU2V0Q2hpbGRyZW4oKSB0byBiZSBjb25zaXN0ZW50ICglcyBoYXMgcGFyZW50cyAlcyBhbmQgJXMpLicsIG5leHRDaGlsZElELCBuZXh0Q2hpbGQucGFyZW50SUQsIGlkKSA6IF9wcm9kSW52YXJpYW50KCcxNDInLCBuZXh0Q2hpbGRJRCwgbmV4dENoaWxkLnBhcmVudElELCBpZCkgOiB2b2lkIDA7XG4gICAgfVxuICB9LFxuICBvbkJlZm9yZU1vdW50Q29tcG9uZW50OiBmdW5jdGlvbiAoaWQsIGVsZW1lbnQsIHBhcmVudElEKSB7XG4gICAgdmFyIGl0ZW0gPSB7XG4gICAgICBlbGVtZW50OiBlbGVtZW50LFxuICAgICAgcGFyZW50SUQ6IHBhcmVudElELFxuICAgICAgdGV4dDogbnVsbCxcbiAgICAgIGNoaWxkSURzOiBbXSxcbiAgICAgIGlzTW91bnRlZDogZmFsc2UsXG4gICAgICB1cGRhdGVDb3VudDogMFxuICAgIH07XG4gICAgc2V0SXRlbShpZCwgaXRlbSk7XG4gIH0sXG4gIG9uQmVmb3JlVXBkYXRlQ29tcG9uZW50OiBmdW5jdGlvbiAoaWQsIGVsZW1lbnQpIHtcbiAgICB2YXIgaXRlbSA9IGdldEl0ZW0oaWQpO1xuICAgIGlmICghaXRlbSB8fCAhaXRlbS5pc01vdW50ZWQpIHtcbiAgICAgIC8vIFdlIG1heSBlbmQgdXAgaGVyZSBhcyBhIHJlc3VsdCBvZiBzZXRTdGF0ZSgpIGluIGNvbXBvbmVudFdpbGxVbm1vdW50KCkuXG4gICAgICAvLyBJbiB0aGlzIGNhc2UsIGlnbm9yZSB0aGUgZWxlbWVudC5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaXRlbS5lbGVtZW50ID0gZWxlbWVudDtcbiAgfSxcbiAgb25Nb3VudENvbXBvbmVudDogZnVuY3Rpb24gKGlkKSB7XG4gICAgdmFyIGl0ZW0gPSBnZXRJdGVtKGlkKTtcbiAgICAhaXRlbSA/IFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnSXRlbSBtdXN0IGhhdmUgYmVlbiBzZXQnKSA6IF9wcm9kSW52YXJpYW50KCcxNDQnKSA6IHZvaWQgMDtcbiAgICBpdGVtLmlzTW91bnRlZCA9IHRydWU7XG4gICAgdmFyIGlzUm9vdCA9IGl0ZW0ucGFyZW50SUQgPT09IDA7XG4gICAgaWYgKGlzUm9vdCkge1xuICAgICAgYWRkUm9vdChpZCk7XG4gICAgfVxuICB9LFxuICBvblVwZGF0ZUNvbXBvbmVudDogZnVuY3Rpb24gKGlkKSB7XG4gICAgdmFyIGl0ZW0gPSBnZXRJdGVtKGlkKTtcbiAgICBpZiAoIWl0ZW0gfHwgIWl0ZW0uaXNNb3VudGVkKSB7XG4gICAgICAvLyBXZSBtYXkgZW5kIHVwIGhlcmUgYXMgYSByZXN1bHQgb2Ygc2V0U3RhdGUoKSBpbiBjb21wb25lbnRXaWxsVW5tb3VudCgpLlxuICAgICAgLy8gSW4gdGhpcyBjYXNlLCBpZ25vcmUgdGhlIGVsZW1lbnQuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGl0ZW0udXBkYXRlQ291bnQrKztcbiAgfSxcbiAgb25Vbm1vdW50Q29tcG9uZW50OiBmdW5jdGlvbiAoaWQpIHtcbiAgICB2YXIgaXRlbSA9IGdldEl0ZW0oaWQpO1xuICAgIGlmIChpdGVtKSB7XG4gICAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIGlmIGl0IGV4aXN0cy5cbiAgICAgIC8vIGBpdGVtYCBtaWdodCBub3QgZXhpc3QgaWYgaXQgaXMgaW5zaWRlIGFuIGVycm9yIGJvdW5kYXJ5LCBhbmQgYSBzaWJsaW5nXG4gICAgICAvLyBlcnJvciBib3VuZGFyeSBjaGlsZCB0aHJldyB3aGlsZSBtb3VudGluZy4gVGhlbiB0aGlzIGluc3RhbmNlIG5ldmVyXG4gICAgICAvLyBnb3QgYSBjaGFuY2UgdG8gbW91bnQsIGJ1dCBpdCBzdGlsbCBnZXRzIGFuIHVubW91bnRpbmcgZXZlbnQgZHVyaW5nXG4gICAgICAvLyB0aGUgZXJyb3IgYm91bmRhcnkgY2xlYW51cC5cbiAgICAgIGl0ZW0uaXNNb3VudGVkID0gZmFsc2U7XG4gICAgICB2YXIgaXNSb290ID0gaXRlbS5wYXJlbnRJRCA9PT0gMDtcbiAgICAgIGlmIChpc1Jvb3QpIHtcbiAgICAgICAgcmVtb3ZlUm9vdChpZCk7XG4gICAgICB9XG4gICAgfVxuICAgIHVubW91bnRlZElEcy5wdXNoKGlkKTtcbiAgfSxcbiAgcHVyZ2VVbm1vdW50ZWRDb21wb25lbnRzOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKFJlYWN0Q29tcG9uZW50VHJlZUhvb2suX3ByZXZlbnRQdXJnaW5nKSB7XG4gICAgICAvLyBTaG91bGQgb25seSBiZSB1c2VkIGZvciB0ZXN0aW5nLlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdW5tb3VudGVkSURzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWQgPSB1bm1vdW50ZWRJRHNbaV07XG4gICAgICBwdXJnZURlZXAoaWQpO1xuICAgIH1cbiAgICB1bm1vdW50ZWRJRHMubGVuZ3RoID0gMDtcbiAgfSxcbiAgaXNNb3VudGVkOiBmdW5jdGlvbiAoaWQpIHtcbiAgICB2YXIgaXRlbSA9IGdldEl0ZW0oaWQpO1xuICAgIHJldHVybiBpdGVtID8gaXRlbS5pc01vdW50ZWQgOiBmYWxzZTtcbiAgfSxcbiAgZ2V0Q3VycmVudFN0YWNrQWRkZW5kdW06IGZ1bmN0aW9uICh0b3BFbGVtZW50KSB7XG4gICAgdmFyIGluZm8gPSAnJztcbiAgICBpZiAodG9wRWxlbWVudCkge1xuICAgICAgdmFyIG5hbWUgPSBnZXREaXNwbGF5TmFtZSh0b3BFbGVtZW50KTtcbiAgICAgIHZhciBvd25lciA9IHRvcEVsZW1lbnQuX293bmVyO1xuICAgICAgaW5mbyArPSBkZXNjcmliZUNvbXBvbmVudEZyYW1lKG5hbWUsIHRvcEVsZW1lbnQuX3NvdXJjZSwgb3duZXIgJiYgb3duZXIuZ2V0TmFtZSgpKTtcbiAgICB9XG5cbiAgICB2YXIgY3VycmVudE93bmVyID0gUmVhY3RDdXJyZW50T3duZXIuY3VycmVudDtcbiAgICB2YXIgaWQgPSBjdXJyZW50T3duZXIgJiYgY3VycmVudE93bmVyLl9kZWJ1Z0lEO1xuXG4gICAgaW5mbyArPSBSZWFjdENvbXBvbmVudFRyZWVIb29rLmdldFN0YWNrQWRkZW5kdW1CeUlEKGlkKTtcbiAgICByZXR1cm4gaW5mbztcbiAgfSxcbiAgZ2V0U3RhY2tBZGRlbmR1bUJ5SUQ6IGZ1bmN0aW9uIChpZCkge1xuICAgIHZhciBpbmZvID0gJyc7XG4gICAgd2hpbGUgKGlkKSB7XG4gICAgICBpbmZvICs9IGRlc2NyaWJlSUQoaWQpO1xuICAgICAgaWQgPSBSZWFjdENvbXBvbmVudFRyZWVIb29rLmdldFBhcmVudElEKGlkKTtcbiAgICB9XG4gICAgcmV0dXJuIGluZm87XG4gIH0sXG4gIGdldENoaWxkSURzOiBmdW5jdGlvbiAoaWQpIHtcbiAgICB2YXIgaXRlbSA9IGdldEl0ZW0oaWQpO1xuICAgIHJldHVybiBpdGVtID8gaXRlbS5jaGlsZElEcyA6IFtdO1xuICB9LFxuICBnZXREaXNwbGF5TmFtZTogZnVuY3Rpb24gKGlkKSB7XG4gICAgdmFyIGVsZW1lbnQgPSBSZWFjdENvbXBvbmVudFRyZWVIb29rLmdldEVsZW1lbnQoaWQpO1xuICAgIGlmICghZWxlbWVudCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBnZXREaXNwbGF5TmFtZShlbGVtZW50KTtcbiAgfSxcbiAgZ2V0RWxlbWVudDogZnVuY3Rpb24gKGlkKSB7XG4gICAgdmFyIGl0ZW0gPSBnZXRJdGVtKGlkKTtcbiAgICByZXR1cm4gaXRlbSA/IGl0ZW0uZWxlbWVudCA6IG51bGw7XG4gIH0sXG4gIGdldE93bmVySUQ6IGZ1bmN0aW9uIChpZCkge1xuICAgIHZhciBlbGVtZW50ID0gUmVhY3RDb21wb25lbnRUcmVlSG9vay5nZXRFbGVtZW50KGlkKTtcbiAgICBpZiAoIWVsZW1lbnQgfHwgIWVsZW1lbnQuX293bmVyKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGVsZW1lbnQuX293bmVyLl9kZWJ1Z0lEO1xuICB9LFxuICBnZXRQYXJlbnRJRDogZnVuY3Rpb24gKGlkKSB7XG4gICAgdmFyIGl0ZW0gPSBnZXRJdGVtKGlkKTtcbiAgICByZXR1cm4gaXRlbSA/IGl0ZW0ucGFyZW50SUQgOiBudWxsO1xuICB9LFxuICBnZXRTb3VyY2U6IGZ1bmN0aW9uIChpZCkge1xuICAgIHZhciBpdGVtID0gZ2V0SXRlbShpZCk7XG4gICAgdmFyIGVsZW1lbnQgPSBpdGVtID8gaXRlbS5lbGVtZW50IDogbnVsbDtcbiAgICB2YXIgc291cmNlID0gZWxlbWVudCAhPSBudWxsID8gZWxlbWVudC5fc291cmNlIDogbnVsbDtcbiAgICByZXR1cm4gc291cmNlO1xuICB9LFxuICBnZXRUZXh0OiBmdW5jdGlvbiAoaWQpIHtcbiAgICB2YXIgZWxlbWVudCA9IFJlYWN0Q29tcG9uZW50VHJlZUhvb2suZ2V0RWxlbWVudChpZCk7XG4gICAgaWYgKHR5cGVvZiBlbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZWxlbWVudCA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiAnJyArIGVsZW1lbnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfSxcbiAgZ2V0VXBkYXRlQ291bnQ6IGZ1bmN0aW9uIChpZCkge1xuICAgIHZhciBpdGVtID0gZ2V0SXRlbShpZCk7XG4gICAgcmV0dXJuIGl0ZW0gPyBpdGVtLnVwZGF0ZUNvdW50IDogMDtcbiAgfSxcblxuXG4gIGdldFJvb3RJRHM6IGdldFJvb3RJRHMsXG4gIGdldFJlZ2lzdGVyZWRJRHM6IGdldEl0ZW1JRHNcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3RDb21wb25lbnRUcmVlSG9vaztcbn0se1wiMjVcIjoyNSxcIjI5XCI6MjksXCIzMFwiOjMwLFwiOFwiOjh9XSw4OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcbi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIFxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBLZWVwcyB0cmFjayBvZiB0aGUgY3VycmVudCBvd25lci5cbiAqXG4gKiBUaGUgY3VycmVudCBvd25lciBpcyB0aGUgY29tcG9uZW50IHdobyBzaG91bGQgb3duIGFueSBjb21wb25lbnRzIHRoYXQgYXJlXG4gKiBjdXJyZW50bHkgYmVpbmcgY29uc3RydWN0ZWQuXG4gKi9cbnZhciBSZWFjdEN1cnJlbnRPd25lciA9IHtcblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqIEB0eXBlIHtSZWFjdENvbXBvbmVudH1cbiAgICovXG4gIGN1cnJlbnQ6IG51bGxcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdEN1cnJlbnRPd25lcjtcbn0se31dLDk6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xuLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0RWxlbWVudCA9IF9kZXJlcV8oMTApO1xuXG4vKipcbiAqIENyZWF0ZSBhIGZhY3RvcnkgdGhhdCBjcmVhdGVzIEhUTUwgdGFnIGVsZW1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKi9cbnZhciBjcmVhdGVET01GYWN0b3J5ID0gUmVhY3RFbGVtZW50LmNyZWF0ZUZhY3Rvcnk7XG5pZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFyIFJlYWN0RWxlbWVudFZhbGlkYXRvciA9IF9kZXJlcV8oMTIpO1xuICBjcmVhdGVET01GYWN0b3J5ID0gUmVhY3RFbGVtZW50VmFsaWRhdG9yLmNyZWF0ZUZhY3Rvcnk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1hcHBpbmcgZnJvbSBzdXBwb3J0ZWQgSFRNTCB0YWdzIHRvIGBSZWFjdERPTUNvbXBvbmVudGAgY2xhc3Nlcy5cbiAqIFRoaXMgaXMgYWxzbyBhY2Nlc3NpYmxlIHZpYSBgUmVhY3QuRE9NYC5cbiAqXG4gKiBAcHVibGljXG4gKi9cbnZhciBSZWFjdERPTUZhY3RvcmllcyA9IHtcbiAgYTogY3JlYXRlRE9NRmFjdG9yeSgnYScpLFxuICBhYmJyOiBjcmVhdGVET01GYWN0b3J5KCdhYmJyJyksXG4gIGFkZHJlc3M6IGNyZWF0ZURPTUZhY3RvcnkoJ2FkZHJlc3MnKSxcbiAgYXJlYTogY3JlYXRlRE9NRmFjdG9yeSgnYXJlYScpLFxuICBhcnRpY2xlOiBjcmVhdGVET01GYWN0b3J5KCdhcnRpY2xlJyksXG4gIGFzaWRlOiBjcmVhdGVET01GYWN0b3J5KCdhc2lkZScpLFxuICBhdWRpbzogY3JlYXRlRE9NRmFjdG9yeSgnYXVkaW8nKSxcbiAgYjogY3JlYXRlRE9NRmFjdG9yeSgnYicpLFxuICBiYXNlOiBjcmVhdGVET01GYWN0b3J5KCdiYXNlJyksXG4gIGJkaTogY3JlYXRlRE9NRmFjdG9yeSgnYmRpJyksXG4gIGJkbzogY3JlYXRlRE9NRmFjdG9yeSgnYmRvJyksXG4gIGJpZzogY3JlYXRlRE9NRmFjdG9yeSgnYmlnJyksXG4gIGJsb2NrcXVvdGU6IGNyZWF0ZURPTUZhY3RvcnkoJ2Jsb2NrcXVvdGUnKSxcbiAgYm9keTogY3JlYXRlRE9NRmFjdG9yeSgnYm9keScpLFxuICBicjogY3JlYXRlRE9NRmFjdG9yeSgnYnInKSxcbiAgYnV0dG9uOiBjcmVhdGVET01GYWN0b3J5KCdidXR0b24nKSxcbiAgY2FudmFzOiBjcmVhdGVET01GYWN0b3J5KCdjYW52YXMnKSxcbiAgY2FwdGlvbjogY3JlYXRlRE9NRmFjdG9yeSgnY2FwdGlvbicpLFxuICBjaXRlOiBjcmVhdGVET01GYWN0b3J5KCdjaXRlJyksXG4gIGNvZGU6IGNyZWF0ZURPTUZhY3RvcnkoJ2NvZGUnKSxcbiAgY29sOiBjcmVhdGVET01GYWN0b3J5KCdjb2wnKSxcbiAgY29sZ3JvdXA6IGNyZWF0ZURPTUZhY3RvcnkoJ2NvbGdyb3VwJyksXG4gIGRhdGE6IGNyZWF0ZURPTUZhY3RvcnkoJ2RhdGEnKSxcbiAgZGF0YWxpc3Q6IGNyZWF0ZURPTUZhY3RvcnkoJ2RhdGFsaXN0JyksXG4gIGRkOiBjcmVhdGVET01GYWN0b3J5KCdkZCcpLFxuICBkZWw6IGNyZWF0ZURPTUZhY3RvcnkoJ2RlbCcpLFxuICBkZXRhaWxzOiBjcmVhdGVET01GYWN0b3J5KCdkZXRhaWxzJyksXG4gIGRmbjogY3JlYXRlRE9NRmFjdG9yeSgnZGZuJyksXG4gIGRpYWxvZzogY3JlYXRlRE9NRmFjdG9yeSgnZGlhbG9nJyksXG4gIGRpdjogY3JlYXRlRE9NRmFjdG9yeSgnZGl2JyksXG4gIGRsOiBjcmVhdGVET01GYWN0b3J5KCdkbCcpLFxuICBkdDogY3JlYXRlRE9NRmFjdG9yeSgnZHQnKSxcbiAgZW06IGNyZWF0ZURPTUZhY3RvcnkoJ2VtJyksXG4gIGVtYmVkOiBjcmVhdGVET01GYWN0b3J5KCdlbWJlZCcpLFxuICBmaWVsZHNldDogY3JlYXRlRE9NRmFjdG9yeSgnZmllbGRzZXQnKSxcbiAgZmlnY2FwdGlvbjogY3JlYXRlRE9NRmFjdG9yeSgnZmlnY2FwdGlvbicpLFxuICBmaWd1cmU6IGNyZWF0ZURPTUZhY3RvcnkoJ2ZpZ3VyZScpLFxuICBmb290ZXI6IGNyZWF0ZURPTUZhY3RvcnkoJ2Zvb3RlcicpLFxuICBmb3JtOiBjcmVhdGVET01GYWN0b3J5KCdmb3JtJyksXG4gIGgxOiBjcmVhdGVET01GYWN0b3J5KCdoMScpLFxuICBoMjogY3JlYXRlRE9NRmFjdG9yeSgnaDInKSxcbiAgaDM6IGNyZWF0ZURPTUZhY3RvcnkoJ2gzJyksXG4gIGg0OiBjcmVhdGVET01GYWN0b3J5KCdoNCcpLFxuICBoNTogY3JlYXRlRE9NRmFjdG9yeSgnaDUnKSxcbiAgaDY6IGNyZWF0ZURPTUZhY3RvcnkoJ2g2JyksXG4gIGhlYWQ6IGNyZWF0ZURPTUZhY3RvcnkoJ2hlYWQnKSxcbiAgaGVhZGVyOiBjcmVhdGVET01GYWN0b3J5KCdoZWFkZXInKSxcbiAgaGdyb3VwOiBjcmVhdGVET01GYWN0b3J5KCdoZ3JvdXAnKSxcbiAgaHI6IGNyZWF0ZURPTUZhY3RvcnkoJ2hyJyksXG4gIGh0bWw6IGNyZWF0ZURPTUZhY3RvcnkoJ2h0bWwnKSxcbiAgaTogY3JlYXRlRE9NRmFjdG9yeSgnaScpLFxuICBpZnJhbWU6IGNyZWF0ZURPTUZhY3RvcnkoJ2lmcmFtZScpLFxuICBpbWc6IGNyZWF0ZURPTUZhY3RvcnkoJ2ltZycpLFxuICBpbnB1dDogY3JlYXRlRE9NRmFjdG9yeSgnaW5wdXQnKSxcbiAgaW5zOiBjcmVhdGVET01GYWN0b3J5KCdpbnMnKSxcbiAga2JkOiBjcmVhdGVET01GYWN0b3J5KCdrYmQnKSxcbiAga2V5Z2VuOiBjcmVhdGVET01GYWN0b3J5KCdrZXlnZW4nKSxcbiAgbGFiZWw6IGNyZWF0ZURPTUZhY3RvcnkoJ2xhYmVsJyksXG4gIGxlZ2VuZDogY3JlYXRlRE9NRmFjdG9yeSgnbGVnZW5kJyksXG4gIGxpOiBjcmVhdGVET01GYWN0b3J5KCdsaScpLFxuICBsaW5rOiBjcmVhdGVET01GYWN0b3J5KCdsaW5rJyksXG4gIG1haW46IGNyZWF0ZURPTUZhY3RvcnkoJ21haW4nKSxcbiAgbWFwOiBjcmVhdGVET01GYWN0b3J5KCdtYXAnKSxcbiAgbWFyazogY3JlYXRlRE9NRmFjdG9yeSgnbWFyaycpLFxuICBtZW51OiBjcmVhdGVET01GYWN0b3J5KCdtZW51JyksXG4gIG1lbnVpdGVtOiBjcmVhdGVET01GYWN0b3J5KCdtZW51aXRlbScpLFxuICBtZXRhOiBjcmVhdGVET01GYWN0b3J5KCdtZXRhJyksXG4gIG1ldGVyOiBjcmVhdGVET01GYWN0b3J5KCdtZXRlcicpLFxuICBuYXY6IGNyZWF0ZURPTUZhY3RvcnkoJ25hdicpLFxuICBub3NjcmlwdDogY3JlYXRlRE9NRmFjdG9yeSgnbm9zY3JpcHQnKSxcbiAgb2JqZWN0OiBjcmVhdGVET01GYWN0b3J5KCdvYmplY3QnKSxcbiAgb2w6IGNyZWF0ZURPTUZhY3RvcnkoJ29sJyksXG4gIG9wdGdyb3VwOiBjcmVhdGVET01GYWN0b3J5KCdvcHRncm91cCcpLFxuICBvcHRpb246IGNyZWF0ZURPTUZhY3RvcnkoJ29wdGlvbicpLFxuICBvdXRwdXQ6IGNyZWF0ZURPTUZhY3RvcnkoJ291dHB1dCcpLFxuICBwOiBjcmVhdGVET01GYWN0b3J5KCdwJyksXG4gIHBhcmFtOiBjcmVhdGVET01GYWN0b3J5KCdwYXJhbScpLFxuICBwaWN0dXJlOiBjcmVhdGVET01GYWN0b3J5KCdwaWN0dXJlJyksXG4gIHByZTogY3JlYXRlRE9NRmFjdG9yeSgncHJlJyksXG4gIHByb2dyZXNzOiBjcmVhdGVET01GYWN0b3J5KCdwcm9ncmVzcycpLFxuICBxOiBjcmVhdGVET01GYWN0b3J5KCdxJyksXG4gIHJwOiBjcmVhdGVET01GYWN0b3J5KCdycCcpLFxuICBydDogY3JlYXRlRE9NRmFjdG9yeSgncnQnKSxcbiAgcnVieTogY3JlYXRlRE9NRmFjdG9yeSgncnVieScpLFxuICBzOiBjcmVhdGVET01GYWN0b3J5KCdzJyksXG4gIHNhbXA6IGNyZWF0ZURPTUZhY3RvcnkoJ3NhbXAnKSxcbiAgc2NyaXB0OiBjcmVhdGVET01GYWN0b3J5KCdzY3JpcHQnKSxcbiAgc2VjdGlvbjogY3JlYXRlRE9NRmFjdG9yeSgnc2VjdGlvbicpLFxuICBzZWxlY3Q6IGNyZWF0ZURPTUZhY3RvcnkoJ3NlbGVjdCcpLFxuICBzbWFsbDogY3JlYXRlRE9NRmFjdG9yeSgnc21hbGwnKSxcbiAgc291cmNlOiBjcmVhdGVET01GYWN0b3J5KCdzb3VyY2UnKSxcbiAgc3BhbjogY3JlYXRlRE9NRmFjdG9yeSgnc3BhbicpLFxuICBzdHJvbmc6IGNyZWF0ZURPTUZhY3RvcnkoJ3N0cm9uZycpLFxuICBzdHlsZTogY3JlYXRlRE9NRmFjdG9yeSgnc3R5bGUnKSxcbiAgc3ViOiBjcmVhdGVET01GYWN0b3J5KCdzdWInKSxcbiAgc3VtbWFyeTogY3JlYXRlRE9NRmFjdG9yeSgnc3VtbWFyeScpLFxuICBzdXA6IGNyZWF0ZURPTUZhY3RvcnkoJ3N1cCcpLFxuICB0YWJsZTogY3JlYXRlRE9NRmFjdG9yeSgndGFibGUnKSxcbiAgdGJvZHk6IGNyZWF0ZURPTUZhY3RvcnkoJ3Rib2R5JyksXG4gIHRkOiBjcmVhdGVET01GYWN0b3J5KCd0ZCcpLFxuICB0ZXh0YXJlYTogY3JlYXRlRE9NRmFjdG9yeSgndGV4dGFyZWEnKSxcbiAgdGZvb3Q6IGNyZWF0ZURPTUZhY3RvcnkoJ3Rmb290JyksXG4gIHRoOiBjcmVhdGVET01GYWN0b3J5KCd0aCcpLFxuICB0aGVhZDogY3JlYXRlRE9NRmFjdG9yeSgndGhlYWQnKSxcbiAgdGltZTogY3JlYXRlRE9NRmFjdG9yeSgndGltZScpLFxuICB0aXRsZTogY3JlYXRlRE9NRmFjdG9yeSgndGl0bGUnKSxcbiAgdHI6IGNyZWF0ZURPTUZhY3RvcnkoJ3RyJyksXG4gIHRyYWNrOiBjcmVhdGVET01GYWN0b3J5KCd0cmFjaycpLFxuICB1OiBjcmVhdGVET01GYWN0b3J5KCd1JyksXG4gIHVsOiBjcmVhdGVET01GYWN0b3J5KCd1bCcpLFxuICAndmFyJzogY3JlYXRlRE9NRmFjdG9yeSgndmFyJyksXG4gIHZpZGVvOiBjcmVhdGVET01GYWN0b3J5KCd2aWRlbycpLFxuICB3YnI6IGNyZWF0ZURPTUZhY3RvcnkoJ3dicicpLFxuXG4gIC8vIFNWR1xuICBjaXJjbGU6IGNyZWF0ZURPTUZhY3RvcnkoJ2NpcmNsZScpLFxuICBjbGlwUGF0aDogY3JlYXRlRE9NRmFjdG9yeSgnY2xpcFBhdGgnKSxcbiAgZGVmczogY3JlYXRlRE9NRmFjdG9yeSgnZGVmcycpLFxuICBlbGxpcHNlOiBjcmVhdGVET01GYWN0b3J5KCdlbGxpcHNlJyksXG4gIGc6IGNyZWF0ZURPTUZhY3RvcnkoJ2cnKSxcbiAgaW1hZ2U6IGNyZWF0ZURPTUZhY3RvcnkoJ2ltYWdlJyksXG4gIGxpbmU6IGNyZWF0ZURPTUZhY3RvcnkoJ2xpbmUnKSxcbiAgbGluZWFyR3JhZGllbnQ6IGNyZWF0ZURPTUZhY3RvcnkoJ2xpbmVhckdyYWRpZW50JyksXG4gIG1hc2s6IGNyZWF0ZURPTUZhY3RvcnkoJ21hc2snKSxcbiAgcGF0aDogY3JlYXRlRE9NRmFjdG9yeSgncGF0aCcpLFxuICBwYXR0ZXJuOiBjcmVhdGVET01GYWN0b3J5KCdwYXR0ZXJuJyksXG4gIHBvbHlnb246IGNyZWF0ZURPTUZhY3RvcnkoJ3BvbHlnb24nKSxcbiAgcG9seWxpbmU6IGNyZWF0ZURPTUZhY3RvcnkoJ3BvbHlsaW5lJyksXG4gIHJhZGlhbEdyYWRpZW50OiBjcmVhdGVET01GYWN0b3J5KCdyYWRpYWxHcmFkaWVudCcpLFxuICByZWN0OiBjcmVhdGVET01GYWN0b3J5KCdyZWN0JyksXG4gIHN0b3A6IGNyZWF0ZURPTUZhY3RvcnkoJ3N0b3AnKSxcbiAgc3ZnOiBjcmVhdGVET01GYWN0b3J5KCdzdmcnKSxcbiAgdGV4dDogY3JlYXRlRE9NRmFjdG9yeSgndGV4dCcpLFxuICB0c3BhbjogY3JlYXRlRE9NRmFjdG9yeSgndHNwYW4nKVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdERPTUZhY3Rvcmllcztcbn0se1wiMTBcIjoxMCxcIjEyXCI6MTJ9XSwxMDpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG4vKipcbiAqIENvcHlyaWdodCAyMDE0LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2Fzc2lnbiA9IF9kZXJlcV8oMzEpO1xuXG52YXIgUmVhY3RDdXJyZW50T3duZXIgPSBfZGVyZXFfKDgpO1xuXG52YXIgd2FybmluZyA9IF9kZXJlcV8oMzApO1xudmFyIGNhbkRlZmluZVByb3BlcnR5ID0gX2RlcmVxXygyMCk7XG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG52YXIgUkVBQ1RfRUxFTUVOVF9UWVBFID0gX2RlcmVxXygxMSk7XG5cbnZhciBSRVNFUlZFRF9QUk9QUyA9IHtcbiAga2V5OiB0cnVlLFxuICByZWY6IHRydWUsXG4gIF9fc2VsZjogdHJ1ZSxcbiAgX19zb3VyY2U6IHRydWVcbn07XG5cbnZhciBzcGVjaWFsUHJvcEtleVdhcm5pbmdTaG93biwgc3BlY2lhbFByb3BSZWZXYXJuaW5nU2hvd247XG5cbmZ1bmN0aW9uIGhhc1ZhbGlkUmVmKGNvbmZpZykge1xuICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChjb25maWcsICdyZWYnKSkge1xuICAgICAgdmFyIGdldHRlciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoY29uZmlnLCAncmVmJykuZ2V0O1xuICAgICAgaWYgKGdldHRlciAmJiBnZXR0ZXIuaXNSZWFjdFdhcm5pbmcpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gY29uZmlnLnJlZiAhPT0gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBoYXNWYWxpZEtleShjb25maWcpIHtcbiAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoY29uZmlnLCAna2V5JykpIHtcbiAgICAgIHZhciBnZXR0ZXIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGNvbmZpZywgJ2tleScpLmdldDtcbiAgICAgIGlmIChnZXR0ZXIgJiYgZ2V0dGVyLmlzUmVhY3RXYXJuaW5nKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNvbmZpZy5rZXkgIT09IHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gZGVmaW5lS2V5UHJvcFdhcm5pbmdHZXR0ZXIocHJvcHMsIGRpc3BsYXlOYW1lKSB7XG4gIHZhciB3YXJuQWJvdXRBY2Nlc3NpbmdLZXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFzcGVjaWFsUHJvcEtleVdhcm5pbmdTaG93bikge1xuICAgICAgc3BlY2lhbFByb3BLZXlXYXJuaW5nU2hvd24gPSB0cnVlO1xuICAgICAgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGZhbHNlLCAnJXM6IGBrZXlgIGlzIG5vdCBhIHByb3AuIFRyeWluZyB0byBhY2Nlc3MgaXQgd2lsbCByZXN1bHQgJyArICdpbiBgdW5kZWZpbmVkYCBiZWluZyByZXR1cm5lZC4gSWYgeW91IG5lZWQgdG8gYWNjZXNzIHRoZSBzYW1lICcgKyAndmFsdWUgd2l0aGluIHRoZSBjaGlsZCBjb21wb25lbnQsIHlvdSBzaG91bGQgcGFzcyBpdCBhcyBhIGRpZmZlcmVudCAnICsgJ3Byb3AuIChodHRwczovL2ZiLm1lL3JlYWN0LXNwZWNpYWwtcHJvcHMpJywgZGlzcGxheU5hbWUpIDogdm9pZCAwO1xuICAgIH1cbiAgfTtcbiAgd2FybkFib3V0QWNjZXNzaW5nS2V5LmlzUmVhY3RXYXJuaW5nID0gdHJ1ZTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3BzLCAna2V5Jywge1xuICAgIGdldDogd2FybkFib3V0QWNjZXNzaW5nS2V5LFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbn1cblxuZnVuY3Rpb24gZGVmaW5lUmVmUHJvcFdhcm5pbmdHZXR0ZXIocHJvcHMsIGRpc3BsYXlOYW1lKSB7XG4gIHZhciB3YXJuQWJvdXRBY2Nlc3NpbmdSZWYgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFzcGVjaWFsUHJvcFJlZldhcm5pbmdTaG93bikge1xuICAgICAgc3BlY2lhbFByb3BSZWZXYXJuaW5nU2hvd24gPSB0cnVlO1xuICAgICAgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGZhbHNlLCAnJXM6IGByZWZgIGlzIG5vdCBhIHByb3AuIFRyeWluZyB0byBhY2Nlc3MgaXQgd2lsbCByZXN1bHQgJyArICdpbiBgdW5kZWZpbmVkYCBiZWluZyByZXR1cm5lZC4gSWYgeW91IG5lZWQgdG8gYWNjZXNzIHRoZSBzYW1lICcgKyAndmFsdWUgd2l0aGluIHRoZSBjaGlsZCBjb21wb25lbnQsIHlvdSBzaG91bGQgcGFzcyBpdCBhcyBhIGRpZmZlcmVudCAnICsgJ3Byb3AuIChodHRwczovL2ZiLm1lL3JlYWN0LXNwZWNpYWwtcHJvcHMpJywgZGlzcGxheU5hbWUpIDogdm9pZCAwO1xuICAgIH1cbiAgfTtcbiAgd2FybkFib3V0QWNjZXNzaW5nUmVmLmlzUmVhY3RXYXJuaW5nID0gdHJ1ZTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3BzLCAncmVmJywge1xuICAgIGdldDogd2FybkFib3V0QWNjZXNzaW5nUmVmLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbn1cblxuLyoqXG4gKiBGYWN0b3J5IG1ldGhvZCB0byBjcmVhdGUgYSBuZXcgUmVhY3QgZWxlbWVudC4gVGhpcyBubyBsb25nZXIgYWRoZXJlcyB0b1xuICogdGhlIGNsYXNzIHBhdHRlcm4sIHNvIGRvIG5vdCB1c2UgbmV3IHRvIGNhbGwgaXQuIEFsc28sIG5vIGluc3RhbmNlb2YgY2hlY2tcbiAqIHdpbGwgd29yay4gSW5zdGVhZCB0ZXN0ICQkdHlwZW9mIGZpZWxkIGFnYWluc3QgU3ltYm9sLmZvcigncmVhY3QuZWxlbWVudCcpIHRvIGNoZWNrXG4gKiBpZiBzb21ldGhpbmcgaXMgYSBSZWFjdCBFbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7Kn0gdHlwZVxuICogQHBhcmFtIHsqfSBrZXlcbiAqIEBwYXJhbSB7c3RyaW5nfG9iamVjdH0gcmVmXG4gKiBAcGFyYW0geyp9IHNlbGYgQSAqdGVtcG9yYXJ5KiBoZWxwZXIgdG8gZGV0ZWN0IHBsYWNlcyB3aGVyZSBgdGhpc2AgaXNcbiAqIGRpZmZlcmVudCBmcm9tIHRoZSBgb3duZXJgIHdoZW4gUmVhY3QuY3JlYXRlRWxlbWVudCBpcyBjYWxsZWQsIHNvIHRoYXQgd2VcbiAqIGNhbiB3YXJuLiBXZSB3YW50IHRvIGdldCByaWQgb2Ygb3duZXIgYW5kIHJlcGxhY2Ugc3RyaW5nIGByZWZgcyB3aXRoIGFycm93XG4gKiBmdW5jdGlvbnMsIGFuZCBhcyBsb25nIGFzIGB0aGlzYCBhbmQgb3duZXIgYXJlIHRoZSBzYW1lLCB0aGVyZSB3aWxsIGJlIG5vXG4gKiBjaGFuZ2UgaW4gYmVoYXZpb3IuXG4gKiBAcGFyYW0geyp9IHNvdXJjZSBBbiBhbm5vdGF0aW9uIG9iamVjdCAoYWRkZWQgYnkgYSB0cmFuc3BpbGVyIG9yIG90aGVyd2lzZSlcbiAqIGluZGljYXRpbmcgZmlsZW5hbWUsIGxpbmUgbnVtYmVyLCBhbmQvb3Igb3RoZXIgaW5mb3JtYXRpb24uXG4gKiBAcGFyYW0geyp9IG93bmVyXG4gKiBAcGFyYW0geyp9IHByb3BzXG4gKiBAaW50ZXJuYWxcbiAqL1xudmFyIFJlYWN0RWxlbWVudCA9IGZ1bmN0aW9uICh0eXBlLCBrZXksIHJlZiwgc2VsZiwgc291cmNlLCBvd25lciwgcHJvcHMpIHtcbiAgdmFyIGVsZW1lbnQgPSB7XG4gICAgLy8gVGhpcyB0YWcgYWxsb3cgdXMgdG8gdW5pcXVlbHkgaWRlbnRpZnkgdGhpcyBhcyBhIFJlYWN0IEVsZW1lbnRcbiAgICAkJHR5cGVvZjogUkVBQ1RfRUxFTUVOVF9UWVBFLFxuXG4gICAgLy8gQnVpbHQtaW4gcHJvcGVydGllcyB0aGF0IGJlbG9uZyBvbiB0aGUgZWxlbWVudFxuICAgIHR5cGU6IHR5cGUsXG4gICAga2V5OiBrZXksXG4gICAgcmVmOiByZWYsXG4gICAgcHJvcHM6IHByb3BzLFxuXG4gICAgLy8gUmVjb3JkIHRoZSBjb21wb25lbnQgcmVzcG9uc2libGUgZm9yIGNyZWF0aW5nIHRoaXMgZWxlbWVudC5cbiAgICBfb3duZXI6IG93bmVyXG4gIH07XG5cbiAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgLy8gVGhlIHZhbGlkYXRpb24gZmxhZyBpcyBjdXJyZW50bHkgbXV0YXRpdmUuIFdlIHB1dCBpdCBvblxuICAgIC8vIGFuIGV4dGVybmFsIGJhY2tpbmcgc3RvcmUgc28gdGhhdCB3ZSBjYW4gZnJlZXplIHRoZSB3aG9sZSBvYmplY3QuXG4gICAgLy8gVGhpcyBjYW4gYmUgcmVwbGFjZWQgd2l0aCBhIFdlYWtNYXAgb25jZSB0aGV5IGFyZSBpbXBsZW1lbnRlZCBpblxuICAgIC8vIGNvbW1vbmx5IHVzZWQgZGV2ZWxvcG1lbnQgZW52aXJvbm1lbnRzLlxuICAgIGVsZW1lbnQuX3N0b3JlID0ge307XG5cbiAgICAvLyBUbyBtYWtlIGNvbXBhcmluZyBSZWFjdEVsZW1lbnRzIGVhc2llciBmb3IgdGVzdGluZyBwdXJwb3Nlcywgd2UgbWFrZVxuICAgIC8vIHRoZSB2YWxpZGF0aW9uIGZsYWcgbm9uLWVudW1lcmFibGUgKHdoZXJlIHBvc3NpYmxlLCB3aGljaCBzaG91bGRcbiAgICAvLyBpbmNsdWRlIGV2ZXJ5IGVudmlyb25tZW50IHdlIHJ1biB0ZXN0cyBpbiksIHNvIHRoZSB0ZXN0IGZyYW1ld29ya1xuICAgIC8vIGlnbm9yZXMgaXQuXG4gICAgaWYgKGNhbkRlZmluZVByb3BlcnR5KSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWxlbWVudC5fc3RvcmUsICd2YWxpZGF0ZWQnLCB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6IGZhbHNlXG4gICAgICB9KTtcbiAgICAgIC8vIHNlbGYgYW5kIHNvdXJjZSBhcmUgREVWIG9ubHkgcHJvcGVydGllcy5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbGVtZW50LCAnX3NlbGYnLCB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiBzZWxmXG4gICAgICB9KTtcbiAgICAgIC8vIFR3byBlbGVtZW50cyBjcmVhdGVkIGluIHR3byBkaWZmZXJlbnQgcGxhY2VzIHNob3VsZCBiZSBjb25zaWRlcmVkXG4gICAgICAvLyBlcXVhbCBmb3IgdGVzdGluZyBwdXJwb3NlcyBhbmQgdGhlcmVmb3JlIHdlIGhpZGUgaXQgZnJvbSBlbnVtZXJhdGlvbi5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbGVtZW50LCAnX3NvdXJjZScsIHtcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6IHNvdXJjZVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQuX3N0b3JlLnZhbGlkYXRlZCA9IGZhbHNlO1xuICAgICAgZWxlbWVudC5fc2VsZiA9IHNlbGY7XG4gICAgICBlbGVtZW50Ll9zb3VyY2UgPSBzb3VyY2U7XG4gICAgfVxuICAgIGlmIChPYmplY3QuZnJlZXplKSB7XG4gICAgICBPYmplY3QuZnJlZXplKGVsZW1lbnQucHJvcHMpO1xuICAgICAgT2JqZWN0LmZyZWV6ZShlbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZWxlbWVudDtcbn07XG5cbi8qKlxuICogQ3JlYXRlIGFuZCByZXR1cm4gYSBuZXcgUmVhY3RFbGVtZW50IG9mIHRoZSBnaXZlbiB0eXBlLlxuICogU2VlIGh0dHBzOi8vZmFjZWJvb2suZ2l0aHViLmlvL3JlYWN0L2RvY3MvdG9wLWxldmVsLWFwaS5odG1sI3JlYWN0LmNyZWF0ZWVsZW1lbnRcbiAqL1xuUmVhY3RFbGVtZW50LmNyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbiAodHlwZSwgY29uZmlnLCBjaGlsZHJlbikge1xuICB2YXIgcHJvcE5hbWU7XG5cbiAgLy8gUmVzZXJ2ZWQgbmFtZXMgYXJlIGV4dHJhY3RlZFxuICB2YXIgcHJvcHMgPSB7fTtcblxuICB2YXIga2V5ID0gbnVsbDtcbiAgdmFyIHJlZiA9IG51bGw7XG4gIHZhciBzZWxmID0gbnVsbDtcbiAgdmFyIHNvdXJjZSA9IG51bGw7XG5cbiAgaWYgKGNvbmZpZyAhPSBudWxsKSB7XG4gICAgaWYgKGhhc1ZhbGlkUmVmKGNvbmZpZykpIHtcbiAgICAgIHJlZiA9IGNvbmZpZy5yZWY7XG4gICAgfVxuICAgIGlmIChoYXNWYWxpZEtleShjb25maWcpKSB7XG4gICAgICBrZXkgPSAnJyArIGNvbmZpZy5rZXk7XG4gICAgfVxuXG4gICAgc2VsZiA9IGNvbmZpZy5fX3NlbGYgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBjb25maWcuX19zZWxmO1xuICAgIHNvdXJjZSA9IGNvbmZpZy5fX3NvdXJjZSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGNvbmZpZy5fX3NvdXJjZTtcbiAgICAvLyBSZW1haW5pbmcgcHJvcGVydGllcyBhcmUgYWRkZWQgdG8gYSBuZXcgcHJvcHMgb2JqZWN0XG4gICAgZm9yIChwcm9wTmFtZSBpbiBjb25maWcpIHtcbiAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbmZpZywgcHJvcE5hbWUpICYmICFSRVNFUlZFRF9QUk9QUy5oYXNPd25Qcm9wZXJ0eShwcm9wTmFtZSkpIHtcbiAgICAgICAgcHJvcHNbcHJvcE5hbWVdID0gY29uZmlnW3Byb3BOYW1lXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBDaGlsZHJlbiBjYW4gYmUgbW9yZSB0aGFuIG9uZSBhcmd1bWVudCwgYW5kIHRob3NlIGFyZSB0cmFuc2ZlcnJlZCBvbnRvXG4gIC8vIHRoZSBuZXdseSBhbGxvY2F0ZWQgcHJvcHMgb2JqZWN0LlxuICB2YXIgY2hpbGRyZW5MZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoIC0gMjtcbiAgaWYgKGNoaWxkcmVuTGVuZ3RoID09PSAxKSB7XG4gICAgcHJvcHMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgfSBlbHNlIGlmIChjaGlsZHJlbkxlbmd0aCA+IDEpIHtcbiAgICB2YXIgY2hpbGRBcnJheSA9IEFycmF5KGNoaWxkcmVuTGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuTGVuZ3RoOyBpKyspIHtcbiAgICAgIGNoaWxkQXJyYXlbaV0gPSBhcmd1bWVudHNbaSArIDJdO1xuICAgIH1cbiAgICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIGlmIChPYmplY3QuZnJlZXplKSB7XG4gICAgICAgIE9iamVjdC5mcmVlemUoY2hpbGRBcnJheSk7XG4gICAgICB9XG4gICAgfVxuICAgIHByb3BzLmNoaWxkcmVuID0gY2hpbGRBcnJheTtcbiAgfVxuXG4gIC8vIFJlc29sdmUgZGVmYXVsdCBwcm9wc1xuICBpZiAodHlwZSAmJiB0eXBlLmRlZmF1bHRQcm9wcykge1xuICAgIHZhciBkZWZhdWx0UHJvcHMgPSB0eXBlLmRlZmF1bHRQcm9wcztcbiAgICBmb3IgKHByb3BOYW1lIGluIGRlZmF1bHRQcm9wcykge1xuICAgICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHByb3BzW3Byb3BOYW1lXSA9IGRlZmF1bHRQcm9wc1twcm9wTmFtZV07XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIGlmIChrZXkgfHwgcmVmKSB7XG4gICAgICBpZiAodHlwZW9mIHByb3BzLiQkdHlwZW9mID09PSAndW5kZWZpbmVkJyB8fCBwcm9wcy4kJHR5cGVvZiAhPT0gUkVBQ1RfRUxFTUVOVF9UWVBFKSB7XG4gICAgICAgIHZhciBkaXNwbGF5TmFtZSA9IHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nID8gdHlwZS5kaXNwbGF5TmFtZSB8fCB0eXBlLm5hbWUgfHwgJ1Vua25vd24nIDogdHlwZTtcbiAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgIGRlZmluZUtleVByb3BXYXJuaW5nR2V0dGVyKHByb3BzLCBkaXNwbGF5TmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlZikge1xuICAgICAgICAgIGRlZmluZVJlZlByb3BXYXJuaW5nR2V0dGVyKHByb3BzLCBkaXNwbGF5TmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIFJlYWN0RWxlbWVudCh0eXBlLCBrZXksIHJlZiwgc2VsZiwgc291cmNlLCBSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50LCBwcm9wcyk7XG59O1xuXG4vKipcbiAqIFJldHVybiBhIGZ1bmN0aW9uIHRoYXQgcHJvZHVjZXMgUmVhY3RFbGVtZW50cyBvZiBhIGdpdmVuIHR5cGUuXG4gKiBTZWUgaHR0cHM6Ly9mYWNlYm9vay5naXRodWIuaW8vcmVhY3QvZG9jcy90b3AtbGV2ZWwtYXBpLmh0bWwjcmVhY3QuY3JlYXRlZmFjdG9yeVxuICovXG5SZWFjdEVsZW1lbnQuY3JlYXRlRmFjdG9yeSA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gIHZhciBmYWN0b3J5ID0gUmVhY3RFbGVtZW50LmNyZWF0ZUVsZW1lbnQuYmluZChudWxsLCB0eXBlKTtcbiAgLy8gRXhwb3NlIHRoZSB0eXBlIG9uIHRoZSBmYWN0b3J5IGFuZCB0aGUgcHJvdG90eXBlIHNvIHRoYXQgaXQgY2FuIGJlXG4gIC8vIGVhc2lseSBhY2Nlc3NlZCBvbiBlbGVtZW50cy4gRS5nLiBgPEZvbyAvPi50eXBlID09PSBGb29gLlxuICAvLyBUaGlzIHNob3VsZCBub3QgYmUgbmFtZWQgYGNvbnN0cnVjdG9yYCBzaW5jZSB0aGlzIG1heSBub3QgYmUgdGhlIGZ1bmN0aW9uXG4gIC8vIHRoYXQgY3JlYXRlZCB0aGUgZWxlbWVudCwgYW5kIGl0IG1heSBub3QgZXZlbiBiZSBhIGNvbnN0cnVjdG9yLlxuICAvLyBMZWdhY3kgaG9vayBUT0RPOiBXYXJuIGlmIHRoaXMgaXMgYWNjZXNzZWRcbiAgZmFjdG9yeS50eXBlID0gdHlwZTtcbiAgcmV0dXJuIGZhY3Rvcnk7XG59O1xuXG5SZWFjdEVsZW1lbnQuY2xvbmVBbmRSZXBsYWNlS2V5ID0gZnVuY3Rpb24gKG9sZEVsZW1lbnQsIG5ld0tleSkge1xuICB2YXIgbmV3RWxlbWVudCA9IFJlYWN0RWxlbWVudChvbGRFbGVtZW50LnR5cGUsIG5ld0tleSwgb2xkRWxlbWVudC5yZWYsIG9sZEVsZW1lbnQuX3NlbGYsIG9sZEVsZW1lbnQuX3NvdXJjZSwgb2xkRWxlbWVudC5fb3duZXIsIG9sZEVsZW1lbnQucHJvcHMpO1xuXG4gIHJldHVybiBuZXdFbGVtZW50O1xufTtcblxuLyoqXG4gKiBDbG9uZSBhbmQgcmV0dXJuIGEgbmV3IFJlYWN0RWxlbWVudCB1c2luZyBlbGVtZW50IGFzIHRoZSBzdGFydGluZyBwb2ludC5cbiAqIFNlZSBodHRwczovL2ZhY2Vib29rLmdpdGh1Yi5pby9yZWFjdC9kb2NzL3RvcC1sZXZlbC1hcGkuaHRtbCNyZWFjdC5jbG9uZWVsZW1lbnRcbiAqL1xuUmVhY3RFbGVtZW50LmNsb25lRWxlbWVudCA9IGZ1bmN0aW9uIChlbGVtZW50LCBjb25maWcsIGNoaWxkcmVuKSB7XG4gIHZhciBwcm9wTmFtZTtcblxuICAvLyBPcmlnaW5hbCBwcm9wcyBhcmUgY29waWVkXG4gIHZhciBwcm9wcyA9IF9hc3NpZ24oe30sIGVsZW1lbnQucHJvcHMpO1xuXG4gIC8vIFJlc2VydmVkIG5hbWVzIGFyZSBleHRyYWN0ZWRcbiAgdmFyIGtleSA9IGVsZW1lbnQua2V5O1xuICB2YXIgcmVmID0gZWxlbWVudC5yZWY7XG4gIC8vIFNlbGYgaXMgcHJlc2VydmVkIHNpbmNlIHRoZSBvd25lciBpcyBwcmVzZXJ2ZWQuXG4gIHZhciBzZWxmID0gZWxlbWVudC5fc2VsZjtcbiAgLy8gU291cmNlIGlzIHByZXNlcnZlZCBzaW5jZSBjbG9uZUVsZW1lbnQgaXMgdW5saWtlbHkgdG8gYmUgdGFyZ2V0ZWQgYnkgYVxuICAvLyB0cmFuc3BpbGVyLCBhbmQgdGhlIG9yaWdpbmFsIHNvdXJjZSBpcyBwcm9iYWJseSBhIGJldHRlciBpbmRpY2F0b3Igb2YgdGhlXG4gIC8vIHRydWUgb3duZXIuXG4gIHZhciBzb3VyY2UgPSBlbGVtZW50Ll9zb3VyY2U7XG5cbiAgLy8gT3duZXIgd2lsbCBiZSBwcmVzZXJ2ZWQsIHVubGVzcyByZWYgaXMgb3ZlcnJpZGRlblxuICB2YXIgb3duZXIgPSBlbGVtZW50Ll9vd25lcjtcblxuICBpZiAoY29uZmlnICE9IG51bGwpIHtcbiAgICBpZiAoaGFzVmFsaWRSZWYoY29uZmlnKSkge1xuICAgICAgLy8gU2lsZW50bHkgc3RlYWwgdGhlIHJlZiBmcm9tIHRoZSBwYXJlbnQuXG4gICAgICByZWYgPSBjb25maWcucmVmO1xuICAgICAgb3duZXIgPSBSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50O1xuICAgIH1cbiAgICBpZiAoaGFzVmFsaWRLZXkoY29uZmlnKSkge1xuICAgICAga2V5ID0gJycgKyBjb25maWcua2V5O1xuICAgIH1cblxuICAgIC8vIFJlbWFpbmluZyBwcm9wZXJ0aWVzIG92ZXJyaWRlIGV4aXN0aW5nIHByb3BzXG4gICAgdmFyIGRlZmF1bHRQcm9wcztcbiAgICBpZiAoZWxlbWVudC50eXBlICYmIGVsZW1lbnQudHlwZS5kZWZhdWx0UHJvcHMpIHtcbiAgICAgIGRlZmF1bHRQcm9wcyA9IGVsZW1lbnQudHlwZS5kZWZhdWx0UHJvcHM7XG4gICAgfVxuICAgIGZvciAocHJvcE5hbWUgaW4gY29uZmlnKSB7XG4gICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChjb25maWcsIHByb3BOYW1lKSAmJiAhUkVTRVJWRURfUFJPUFMuaGFzT3duUHJvcGVydHkocHJvcE5hbWUpKSB7XG4gICAgICAgIGlmIChjb25maWdbcHJvcE5hbWVdID09PSB1bmRlZmluZWQgJiYgZGVmYXVsdFByb3BzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAvLyBSZXNvbHZlIGRlZmF1bHQgcHJvcHNcbiAgICAgICAgICBwcm9wc1twcm9wTmFtZV0gPSBkZWZhdWx0UHJvcHNbcHJvcE5hbWVdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByb3BzW3Byb3BOYW1lXSA9IGNvbmZpZ1twcm9wTmFtZV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBDaGlsZHJlbiBjYW4gYmUgbW9yZSB0aGFuIG9uZSBhcmd1bWVudCwgYW5kIHRob3NlIGFyZSB0cmFuc2ZlcnJlZCBvbnRvXG4gIC8vIHRoZSBuZXdseSBhbGxvY2F0ZWQgcHJvcHMgb2JqZWN0LlxuICB2YXIgY2hpbGRyZW5MZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoIC0gMjtcbiAgaWYgKGNoaWxkcmVuTGVuZ3RoID09PSAxKSB7XG4gICAgcHJvcHMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgfSBlbHNlIGlmIChjaGlsZHJlbkxlbmd0aCA+IDEpIHtcbiAgICB2YXIgY2hpbGRBcnJheSA9IEFycmF5KGNoaWxkcmVuTGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuTGVuZ3RoOyBpKyspIHtcbiAgICAgIGNoaWxkQXJyYXlbaV0gPSBhcmd1bWVudHNbaSArIDJdO1xuICAgIH1cbiAgICBwcm9wcy5jaGlsZHJlbiA9IGNoaWxkQXJyYXk7XG4gIH1cblxuICByZXR1cm4gUmVhY3RFbGVtZW50KGVsZW1lbnQudHlwZSwga2V5LCByZWYsIHNlbGYsIHNvdXJjZSwgb3duZXIsIHByb3BzKTtcbn07XG5cbi8qKlxuICogVmVyaWZpZXMgdGhlIG9iamVjdCBpcyBhIFJlYWN0RWxlbWVudC5cbiAqIFNlZSBodHRwczovL2ZhY2Vib29rLmdpdGh1Yi5pby9yZWFjdC9kb2NzL3RvcC1sZXZlbC1hcGkuaHRtbCNyZWFjdC5pc3ZhbGlkZWxlbWVudFxuICogQHBhcmFtIHs/b2JqZWN0fSBvYmplY3RcbiAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgYG9iamVjdGAgaXMgYSB2YWxpZCBjb21wb25lbnQuXG4gKiBAZmluYWxcbiAqL1xuUmVhY3RFbGVtZW50LmlzVmFsaWRFbGVtZW50ID0gZnVuY3Rpb24gKG9iamVjdCkge1xuICByZXR1cm4gdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiYgb2JqZWN0ICE9PSBudWxsICYmIG9iamVjdC4kJHR5cGVvZiA9PT0gUkVBQ1RfRUxFTUVOVF9UWVBFO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdEVsZW1lbnQ7XG59LHtcIjExXCI6MTEsXCIyMFwiOjIwLFwiMzBcIjozMCxcIjMxXCI6MzEsXCI4XCI6OH1dLDExOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcbi8qKlxuICogQ29weXJpZ2h0IDIwMTQtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIFxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLy8gVGhlIFN5bWJvbCB1c2VkIHRvIHRhZyB0aGUgUmVhY3RFbGVtZW50IHR5cGUuIElmIHRoZXJlIGlzIG5vIG5hdGl2ZSBTeW1ib2xcbi8vIG5vciBwb2x5ZmlsbCwgdGhlbiBhIHBsYWluIG51bWJlciBpcyB1c2VkIGZvciBwZXJmb3JtYW5jZS5cblxudmFyIFJFQUNUX0VMRU1FTlRfVFlQRSA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sWydmb3InXSAmJiBTeW1ib2xbJ2ZvciddKCdyZWFjdC5lbGVtZW50JykgfHwgMHhlYWM3O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJFQUNUX0VMRU1FTlRfVFlQRTtcbn0se31dLDEyOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcbi8qKlxuICogQ29weXJpZ2h0IDIwMTQtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqL1xuXG4vKipcbiAqIFJlYWN0RWxlbWVudFZhbGlkYXRvciBwcm92aWRlcyBhIHdyYXBwZXIgYXJvdW5kIGEgZWxlbWVudCBmYWN0b3J5XG4gKiB3aGljaCB2YWxpZGF0ZXMgdGhlIHByb3BzIHBhc3NlZCB0byB0aGUgZWxlbWVudC4gVGhpcyBpcyBpbnRlbmRlZCB0byBiZVxuICogdXNlZCBvbmx5IGluIERFViBhbmQgY291bGQgYmUgcmVwbGFjZWQgYnkgYSBzdGF0aWMgdHlwZSBjaGVja2VyIGZvciBsYW5ndWFnZXNcbiAqIHRoYXQgc3VwcG9ydCBpdC5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdEN1cnJlbnRPd25lciA9IF9kZXJlcV8oOCk7XG52YXIgUmVhY3RDb21wb25lbnRUcmVlSG9vayA9IF9kZXJlcV8oNyk7XG52YXIgUmVhY3RFbGVtZW50ID0gX2RlcmVxXygxMCk7XG5cbnZhciBjaGVja1JlYWN0VHlwZVNwZWMgPSBfZGVyZXFfKDIxKTtcblxudmFyIGNhbkRlZmluZVByb3BlcnR5ID0gX2RlcmVxXygyMCk7XG52YXIgZ2V0SXRlcmF0b3JGbiA9IF9kZXJlcV8oMjIpO1xudmFyIHdhcm5pbmcgPSBfZGVyZXFfKDMwKTtcblxuZnVuY3Rpb24gZ2V0RGVjbGFyYXRpb25FcnJvckFkZGVuZHVtKCkge1xuICBpZiAoUmVhY3RDdXJyZW50T3duZXIuY3VycmVudCkge1xuICAgIHZhciBuYW1lID0gUmVhY3RDdXJyZW50T3duZXIuY3VycmVudC5nZXROYW1lKCk7XG4gICAgaWYgKG5hbWUpIHtcbiAgICAgIHJldHVybiAnIENoZWNrIHRoZSByZW5kZXIgbWV0aG9kIG9mIGAnICsgbmFtZSArICdgLic7XG4gICAgfVxuICB9XG4gIHJldHVybiAnJztcbn1cblxuZnVuY3Rpb24gZ2V0U291cmNlSW5mb0Vycm9yQWRkZW5kdW0oZWxlbWVudFByb3BzKSB7XG4gIGlmIChlbGVtZW50UHJvcHMgIT09IG51bGwgJiYgZWxlbWVudFByb3BzICE9PSB1bmRlZmluZWQgJiYgZWxlbWVudFByb3BzLl9fc291cmNlICE9PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgc291cmNlID0gZWxlbWVudFByb3BzLl9fc291cmNlO1xuICAgIHZhciBmaWxlTmFtZSA9IHNvdXJjZS5maWxlTmFtZS5yZXBsYWNlKC9eLipbXFxcXFxcL10vLCAnJyk7XG4gICAgdmFyIGxpbmVOdW1iZXIgPSBzb3VyY2UubGluZU51bWJlcjtcbiAgICByZXR1cm4gJyBDaGVjayB5b3VyIGNvZGUgYXQgJyArIGZpbGVOYW1lICsgJzonICsgbGluZU51bWJlciArICcuJztcbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbi8qKlxuICogV2FybiBpZiB0aGVyZSdzIG5vIGtleSBleHBsaWNpdGx5IHNldCBvbiBkeW5hbWljIGFycmF5cyBvZiBjaGlsZHJlbiBvclxuICogb2JqZWN0IGtleXMgYXJlIG5vdCB2YWxpZC4gVGhpcyBhbGxvd3MgdXMgdG8ga2VlcCB0cmFjayBvZiBjaGlsZHJlbiBiZXR3ZWVuXG4gKiB1cGRhdGVzLlxuICovXG52YXIgb3duZXJIYXNLZXlVc2VXYXJuaW5nID0ge307XG5cbmZ1bmN0aW9uIGdldEN1cnJlbnRDb21wb25lbnRFcnJvckluZm8ocGFyZW50VHlwZSkge1xuICB2YXIgaW5mbyA9IGdldERlY2xhcmF0aW9uRXJyb3JBZGRlbmR1bSgpO1xuXG4gIGlmICghaW5mbykge1xuICAgIHZhciBwYXJlbnROYW1lID0gdHlwZW9mIHBhcmVudFR5cGUgPT09ICdzdHJpbmcnID8gcGFyZW50VHlwZSA6IHBhcmVudFR5cGUuZGlzcGxheU5hbWUgfHwgcGFyZW50VHlwZS5uYW1lO1xuICAgIGlmIChwYXJlbnROYW1lKSB7XG4gICAgICBpbmZvID0gJyBDaGVjayB0aGUgdG9wLWxldmVsIHJlbmRlciBjYWxsIHVzaW5nIDwnICsgcGFyZW50TmFtZSArICc+Lic7XG4gICAgfVxuICB9XG4gIHJldHVybiBpbmZvO1xufVxuXG4vKipcbiAqIFdhcm4gaWYgdGhlIGVsZW1lbnQgZG9lc24ndCBoYXZlIGFuIGV4cGxpY2l0IGtleSBhc3NpZ25lZCB0byBpdC5cbiAqIFRoaXMgZWxlbWVudCBpcyBpbiBhbiBhcnJheS4gVGhlIGFycmF5IGNvdWxkIGdyb3cgYW5kIHNocmluayBvciBiZVxuICogcmVvcmRlcmVkLiBBbGwgY2hpbGRyZW4gdGhhdCBoYXZlbid0IGFscmVhZHkgYmVlbiB2YWxpZGF0ZWQgYXJlIHJlcXVpcmVkIHRvXG4gKiBoYXZlIGEgXCJrZXlcIiBwcm9wZXJ0eSBhc3NpZ25lZCB0byBpdC4gRXJyb3Igc3RhdHVzZXMgYXJlIGNhY2hlZCBzbyBhIHdhcm5pbmdcbiAqIHdpbGwgb25seSBiZSBzaG93biBvbmNlLlxuICpcbiAqIEBpbnRlcm5hbFxuICogQHBhcmFtIHtSZWFjdEVsZW1lbnR9IGVsZW1lbnQgRWxlbWVudCB0aGF0IHJlcXVpcmVzIGEga2V5LlxuICogQHBhcmFtIHsqfSBwYXJlbnRUeXBlIGVsZW1lbnQncyBwYXJlbnQncyB0eXBlLlxuICovXG5mdW5jdGlvbiB2YWxpZGF0ZUV4cGxpY2l0S2V5KGVsZW1lbnQsIHBhcmVudFR5cGUpIHtcbiAgaWYgKCFlbGVtZW50Ll9zdG9yZSB8fCBlbGVtZW50Ll9zdG9yZS52YWxpZGF0ZWQgfHwgZWxlbWVudC5rZXkgIT0gbnVsbCkge1xuICAgIHJldHVybjtcbiAgfVxuICBlbGVtZW50Ll9zdG9yZS52YWxpZGF0ZWQgPSB0cnVlO1xuXG4gIHZhciBtZW1vaXplciA9IG93bmVySGFzS2V5VXNlV2FybmluZy51bmlxdWVLZXkgfHwgKG93bmVySGFzS2V5VXNlV2FybmluZy51bmlxdWVLZXkgPSB7fSk7XG5cbiAgdmFyIGN1cnJlbnRDb21wb25lbnRFcnJvckluZm8gPSBnZXRDdXJyZW50Q29tcG9uZW50RXJyb3JJbmZvKHBhcmVudFR5cGUpO1xuICBpZiAobWVtb2l6ZXJbY3VycmVudENvbXBvbmVudEVycm9ySW5mb10pIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbWVtb2l6ZXJbY3VycmVudENvbXBvbmVudEVycm9ySW5mb10gPSB0cnVlO1xuXG4gIC8vIFVzdWFsbHkgdGhlIGN1cnJlbnQgb3duZXIgaXMgdGhlIG9mZmVuZGVyLCBidXQgaWYgaXQgYWNjZXB0cyBjaGlsZHJlbiBhcyBhXG4gIC8vIHByb3BlcnR5LCBpdCBtYXkgYmUgdGhlIGNyZWF0b3Igb2YgdGhlIGNoaWxkIHRoYXQncyByZXNwb25zaWJsZSBmb3JcbiAgLy8gYXNzaWduaW5nIGl0IGEga2V5LlxuICB2YXIgY2hpbGRPd25lciA9ICcnO1xuICBpZiAoZWxlbWVudCAmJiBlbGVtZW50Ll9vd25lciAmJiBlbGVtZW50Ll9vd25lciAhPT0gUmVhY3RDdXJyZW50T3duZXIuY3VycmVudCkge1xuICAgIC8vIEdpdmUgdGhlIGNvbXBvbmVudCB0aGF0IG9yaWdpbmFsbHkgY3JlYXRlZCB0aGlzIGNoaWxkLlxuICAgIGNoaWxkT3duZXIgPSAnIEl0IHdhcyBwYXNzZWQgYSBjaGlsZCBmcm9tICcgKyBlbGVtZW50Ll9vd25lci5nZXROYW1lKCkgKyAnLic7XG4gIH1cblxuICBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICdFYWNoIGNoaWxkIGluIGFuIGFycmF5IG9yIGl0ZXJhdG9yIHNob3VsZCBoYXZlIGEgdW5pcXVlIFwia2V5XCIgcHJvcC4nICsgJyVzJXMgU2VlIGh0dHBzOi8vZmIubWUvcmVhY3Qtd2FybmluZy1rZXlzIGZvciBtb3JlIGluZm9ybWF0aW9uLiVzJywgY3VycmVudENvbXBvbmVudEVycm9ySW5mbywgY2hpbGRPd25lciwgUmVhY3RDb21wb25lbnRUcmVlSG9vay5nZXRDdXJyZW50U3RhY2tBZGRlbmR1bShlbGVtZW50KSkgOiB2b2lkIDA7XG59XG5cbi8qKlxuICogRW5zdXJlIHRoYXQgZXZlcnkgZWxlbWVudCBlaXRoZXIgaXMgcGFzc2VkIGluIGEgc3RhdGljIGxvY2F0aW9uLCBpbiBhblxuICogYXJyYXkgd2l0aCBhbiBleHBsaWNpdCBrZXlzIHByb3BlcnR5IGRlZmluZWQsIG9yIGluIGFuIG9iamVjdCBsaXRlcmFsXG4gKiB3aXRoIHZhbGlkIGtleSBwcm9wZXJ0eS5cbiAqXG4gKiBAaW50ZXJuYWxcbiAqIEBwYXJhbSB7UmVhY3ROb2RlfSBub2RlIFN0YXRpY2FsbHkgcGFzc2VkIGNoaWxkIG9mIGFueSB0eXBlLlxuICogQHBhcmFtIHsqfSBwYXJlbnRUeXBlIG5vZGUncyBwYXJlbnQncyB0eXBlLlxuICovXG5mdW5jdGlvbiB2YWxpZGF0ZUNoaWxkS2V5cyhub2RlLCBwYXJlbnRUeXBlKSB7XG4gIGlmICh0eXBlb2Ygbm9kZSAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKEFycmF5LmlzQXJyYXkobm9kZSkpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjaGlsZCA9IG5vZGVbaV07XG4gICAgICBpZiAoUmVhY3RFbGVtZW50LmlzVmFsaWRFbGVtZW50KGNoaWxkKSkge1xuICAgICAgICB2YWxpZGF0ZUV4cGxpY2l0S2V5KGNoaWxkLCBwYXJlbnRUeXBlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAoUmVhY3RFbGVtZW50LmlzVmFsaWRFbGVtZW50KG5vZGUpKSB7XG4gICAgLy8gVGhpcyBlbGVtZW50IHdhcyBwYXNzZWQgaW4gYSB2YWxpZCBsb2NhdGlvbi5cbiAgICBpZiAobm9kZS5fc3RvcmUpIHtcbiAgICAgIG5vZGUuX3N0b3JlLnZhbGlkYXRlZCA9IHRydWU7XG4gICAgfVxuICB9IGVsc2UgaWYgKG5vZGUpIHtcbiAgICB2YXIgaXRlcmF0b3JGbiA9IGdldEl0ZXJhdG9yRm4obm9kZSk7XG4gICAgLy8gRW50cnkgaXRlcmF0b3JzIHByb3ZpZGUgaW1wbGljaXQga2V5cy5cbiAgICBpZiAoaXRlcmF0b3JGbikge1xuICAgICAgaWYgKGl0ZXJhdG9yRm4gIT09IG5vZGUuZW50cmllcykge1xuICAgICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYXRvckZuLmNhbGwobm9kZSk7XG4gICAgICAgIHZhciBzdGVwO1xuICAgICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgICAgaWYgKFJlYWN0RWxlbWVudC5pc1ZhbGlkRWxlbWVudChzdGVwLnZhbHVlKSkge1xuICAgICAgICAgICAgdmFsaWRhdGVFeHBsaWNpdEtleShzdGVwLnZhbHVlLCBwYXJlbnRUeXBlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBHaXZlbiBhbiBlbGVtZW50LCB2YWxpZGF0ZSB0aGF0IGl0cyBwcm9wcyBmb2xsb3cgdGhlIHByb3BUeXBlcyBkZWZpbml0aW9uLFxuICogcHJvdmlkZWQgYnkgdGhlIHR5cGUuXG4gKlxuICogQHBhcmFtIHtSZWFjdEVsZW1lbnR9IGVsZW1lbnRcbiAqL1xuZnVuY3Rpb24gdmFsaWRhdGVQcm9wVHlwZXMoZWxlbWVudCkge1xuICB2YXIgY29tcG9uZW50Q2xhc3MgPSBlbGVtZW50LnR5cGU7XG4gIGlmICh0eXBlb2YgY29tcG9uZW50Q2xhc3MgIT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIG5hbWUgPSBjb21wb25lbnRDbGFzcy5kaXNwbGF5TmFtZSB8fCBjb21wb25lbnRDbGFzcy5uYW1lO1xuICBpZiAoY29tcG9uZW50Q2xhc3MucHJvcFR5cGVzKSB7XG4gICAgY2hlY2tSZWFjdFR5cGVTcGVjKGNvbXBvbmVudENsYXNzLnByb3BUeXBlcywgZWxlbWVudC5wcm9wcywgJ3Byb3AnLCBuYW1lLCBlbGVtZW50LCBudWxsKTtcbiAgfVxuICBpZiAodHlwZW9mIGNvbXBvbmVudENsYXNzLmdldERlZmF1bHRQcm9wcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyhjb21wb25lbnRDbGFzcy5nZXREZWZhdWx0UHJvcHMuaXNSZWFjdENsYXNzQXBwcm92ZWQsICdnZXREZWZhdWx0UHJvcHMgaXMgb25seSB1c2VkIG9uIGNsYXNzaWMgUmVhY3QuY3JlYXRlQ2xhc3MgJyArICdkZWZpbml0aW9ucy4gVXNlIGEgc3RhdGljIHByb3BlcnR5IG5hbWVkIGBkZWZhdWx0UHJvcHNgIGluc3RlYWQuJykgOiB2b2lkIDA7XG4gIH1cbn1cblxudmFyIFJlYWN0RWxlbWVudFZhbGlkYXRvciA9IHtcblxuICBjcmVhdGVFbGVtZW50OiBmdW5jdGlvbiAodHlwZSwgcHJvcHMsIGNoaWxkcmVuKSB7XG4gICAgdmFyIHZhbGlkVHlwZSA9IHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJztcbiAgICAvLyBXZSB3YXJuIGluIHRoaXMgY2FzZSBidXQgZG9uJ3QgdGhyb3cuIFdlIGV4cGVjdCB0aGUgZWxlbWVudCBjcmVhdGlvbiB0b1xuICAgIC8vIHN1Y2NlZWQgYW5kIHRoZXJlIHdpbGwgbGlrZWx5IGJlIGVycm9ycyBpbiByZW5kZXIuXG4gICAgaWYgKCF2YWxpZFR5cGUpIHtcbiAgICAgIGlmICh0eXBlb2YgdHlwZSAhPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgdHlwZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgdmFyIGluZm8gPSAnJztcbiAgICAgICAgaWYgKHR5cGUgPT09IHVuZGVmaW5lZCB8fCB0eXBlb2YgdHlwZSA9PT0gJ29iamVjdCcgJiYgdHlwZSAhPT0gbnVsbCAmJiBPYmplY3Qua2V5cyh0eXBlKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBpbmZvICs9ICcgWW91IGxpa2VseSBmb3Jnb3QgdG8gZXhwb3J0IHlvdXIgY29tcG9uZW50IGZyb20gdGhlIGZpbGUgJyArICdpdFxcJ3MgZGVmaW5lZCBpbi4nO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNvdXJjZUluZm8gPSBnZXRTb3VyY2VJbmZvRXJyb3JBZGRlbmR1bShwcm9wcyk7XG4gICAgICAgIGlmIChzb3VyY2VJbmZvKSB7XG4gICAgICAgICAgaW5mbyArPSBzb3VyY2VJbmZvO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGluZm8gKz0gZ2V0RGVjbGFyYXRpb25FcnJvckFkZGVuZHVtKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbmZvICs9IFJlYWN0Q29tcG9uZW50VHJlZUhvb2suZ2V0Q3VycmVudFN0YWNrQWRkZW5kdW0oKTtcblxuICAgICAgICBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICdSZWFjdC5jcmVhdGVFbGVtZW50OiB0eXBlIGlzIGludmFsaWQgLS0gZXhwZWN0ZWQgYSBzdHJpbmcgKGZvciAnICsgJ2J1aWx0LWluIGNvbXBvbmVudHMpIG9yIGEgY2xhc3MvZnVuY3Rpb24gKGZvciBjb21wb3NpdGUgJyArICdjb21wb25lbnRzKSBidXQgZ290OiAlcy4lcycsIHR5cGUgPT0gbnVsbCA/IHR5cGUgOiB0eXBlb2YgdHlwZSwgaW5mbykgOiB2b2lkIDA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGVsZW1lbnQgPSBSZWFjdEVsZW1lbnQuY3JlYXRlRWxlbWVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgLy8gVGhlIHJlc3VsdCBjYW4gYmUgbnVsbGlzaCBpZiBhIG1vY2sgb3IgYSBjdXN0b20gZnVuY3Rpb24gaXMgdXNlZC5cbiAgICAvLyBUT0RPOiBEcm9wIHRoaXMgd2hlbiB0aGVzZSBhcmUgbm8gbG9uZ2VyIGFsbG93ZWQgYXMgdGhlIHR5cGUgYXJndW1lbnQuXG4gICAgaWYgKGVsZW1lbnQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfVxuXG4gICAgLy8gU2tpcCBrZXkgd2FybmluZyBpZiB0aGUgdHlwZSBpc24ndCB2YWxpZCBzaW5jZSBvdXIga2V5IHZhbGlkYXRpb24gbG9naWNcbiAgICAvLyBkb2Vzbid0IGV4cGVjdCBhIG5vbi1zdHJpbmcvZnVuY3Rpb24gdHlwZSBhbmQgY2FuIHRocm93IGNvbmZ1c2luZyBlcnJvcnMuXG4gICAgLy8gV2UgZG9uJ3Qgd2FudCBleGNlcHRpb24gYmVoYXZpb3IgdG8gZGlmZmVyIGJldHdlZW4gZGV2IGFuZCBwcm9kLlxuICAgIC8vIChSZW5kZXJpbmcgd2lsbCB0aHJvdyB3aXRoIGEgaGVscGZ1bCBtZXNzYWdlIGFuZCBhcyBzb29uIGFzIHRoZSB0eXBlIGlzXG4gICAgLy8gZml4ZWQsIHRoZSBrZXkgd2FybmluZ3Mgd2lsbCBhcHBlYXIuKVxuICAgIGlmICh2YWxpZFR5cGUpIHtcbiAgICAgIGZvciAodmFyIGkgPSAyOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhbGlkYXRlQ2hpbGRLZXlzKGFyZ3VtZW50c1tpXSwgdHlwZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFsaWRhdGVQcm9wVHlwZXMoZWxlbWVudCk7XG5cbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfSxcblxuICBjcmVhdGVGYWN0b3J5OiBmdW5jdGlvbiAodHlwZSkge1xuICAgIHZhciB2YWxpZGF0ZWRGYWN0b3J5ID0gUmVhY3RFbGVtZW50VmFsaWRhdG9yLmNyZWF0ZUVsZW1lbnQuYmluZChudWxsLCB0eXBlKTtcbiAgICAvLyBMZWdhY3kgaG9vayBUT0RPOiBXYXJuIGlmIHRoaXMgaXMgYWNjZXNzZWRcbiAgICB2YWxpZGF0ZWRGYWN0b3J5LnR5cGUgPSB0eXBlO1xuXG4gICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICBpZiAoY2FuRGVmaW5lUHJvcGVydHkpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHZhbGlkYXRlZEZhY3RvcnksICd0eXBlJywge1xuICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGZhbHNlLCAnRmFjdG9yeS50eXBlIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB0aGUgY2xhc3MgZGlyZWN0bHkgJyArICdiZWZvcmUgcGFzc2luZyBpdCB0byBjcmVhdGVGYWN0b3J5LicpIDogdm9pZCAwO1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICd0eXBlJywge1xuICAgICAgICAgICAgICB2YWx1ZTogdHlwZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdHlwZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB2YWxpZGF0ZWRGYWN0b3J5O1xuICB9LFxuXG4gIGNsb25lRWxlbWVudDogZnVuY3Rpb24gKGVsZW1lbnQsIHByb3BzLCBjaGlsZHJlbikge1xuICAgIHZhciBuZXdFbGVtZW50ID0gUmVhY3RFbGVtZW50LmNsb25lRWxlbWVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGZvciAodmFyIGkgPSAyOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YWxpZGF0ZUNoaWxkS2V5cyhhcmd1bWVudHNbaV0sIG5ld0VsZW1lbnQudHlwZSk7XG4gICAgfVxuICAgIHZhbGlkYXRlUHJvcFR5cGVzKG5ld0VsZW1lbnQpO1xuICAgIHJldHVybiBuZXdFbGVtZW50O1xuICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3RFbGVtZW50VmFsaWRhdG9yO1xufSx7XCIxMFwiOjEwLFwiMjBcIjoyMCxcIjIxXCI6MjEsXCIyMlwiOjIyLFwiMzBcIjozMCxcIjdcIjo3LFwiOFwiOjh9XSwxMzpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG4vKipcbiAqIENvcHlyaWdodCAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgd2FybmluZyA9IF9kZXJlcV8oMzApO1xuXG5mdW5jdGlvbiB3YXJuTm9vcChwdWJsaWNJbnN0YW5jZSwgY2FsbGVyTmFtZSkge1xuICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICB2YXIgY29uc3RydWN0b3IgPSBwdWJsaWNJbnN0YW5jZS5jb25zdHJ1Y3RvcjtcbiAgICBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICclcyguLi4pOiBDYW4gb25seSB1cGRhdGUgYSBtb3VudGVkIG9yIG1vdW50aW5nIGNvbXBvbmVudC4gJyArICdUaGlzIHVzdWFsbHkgbWVhbnMgeW91IGNhbGxlZCAlcygpIG9uIGFuIHVubW91bnRlZCBjb21wb25lbnQuICcgKyAnVGhpcyBpcyBhIG5vLW9wLiBQbGVhc2UgY2hlY2sgdGhlIGNvZGUgZm9yIHRoZSAlcyBjb21wb25lbnQuJywgY2FsbGVyTmFtZSwgY2FsbGVyTmFtZSwgY29uc3RydWN0b3IgJiYgKGNvbnN0cnVjdG9yLmRpc3BsYXlOYW1lIHx8IGNvbnN0cnVjdG9yLm5hbWUpIHx8ICdSZWFjdENsYXNzJykgOiB2b2lkIDA7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGlzIGlzIHRoZSBhYnN0cmFjdCBBUEkgZm9yIGFuIHVwZGF0ZSBxdWV1ZS5cbiAqL1xudmFyIFJlYWN0Tm9vcFVwZGF0ZVF1ZXVlID0ge1xuXG4gIC8qKlxuICAgKiBDaGVja3Mgd2hldGhlciBvciBub3QgdGhpcyBjb21wb3NpdGUgY29tcG9uZW50IGlzIG1vdW50ZWQuXG4gICAqIEBwYXJhbSB7UmVhY3RDbGFzc30gcHVibGljSW5zdGFuY2UgVGhlIGluc3RhbmNlIHdlIHdhbnQgdG8gdGVzdC5cbiAgICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiBtb3VudGVkLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqIEBwcm90ZWN0ZWRcbiAgICogQGZpbmFsXG4gICAqL1xuICBpc01vdW50ZWQ6IGZ1bmN0aW9uIChwdWJsaWNJbnN0YW5jZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcblxuICAvKipcbiAgICogRW5xdWV1ZSBhIGNhbGxiYWNrIHRoYXQgd2lsbCBiZSBleGVjdXRlZCBhZnRlciBhbGwgdGhlIHBlbmRpbmcgdXBkYXRlc1xuICAgKiBoYXZlIHByb2Nlc3NlZC5cbiAgICpcbiAgICogQHBhcmFtIHtSZWFjdENsYXNzfSBwdWJsaWNJbnN0YW5jZSBUaGUgaW5zdGFuY2UgdG8gdXNlIGFzIGB0aGlzYCBjb250ZXh0LlxuICAgKiBAcGFyYW0gez9mdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGVkIGFmdGVyIHN0YXRlIGlzIHVwZGF0ZWQuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgZW5xdWV1ZUNhbGxiYWNrOiBmdW5jdGlvbiAocHVibGljSW5zdGFuY2UsIGNhbGxiYWNrKSB7fSxcblxuICAvKipcbiAgICogRm9yY2VzIGFuIHVwZGF0ZS4gVGhpcyBzaG91bGQgb25seSBiZSBpbnZva2VkIHdoZW4gaXQgaXMga25vd24gd2l0aFxuICAgKiBjZXJ0YWludHkgdGhhdCB3ZSBhcmUgKipub3QqKiBpbiBhIERPTSB0cmFuc2FjdGlvbi5cbiAgICpcbiAgICogWW91IG1heSB3YW50IHRvIGNhbGwgdGhpcyB3aGVuIHlvdSBrbm93IHRoYXQgc29tZSBkZWVwZXIgYXNwZWN0IG9mIHRoZVxuICAgKiBjb21wb25lbnQncyBzdGF0ZSBoYXMgY2hhbmdlZCBidXQgYHNldFN0YXRlYCB3YXMgbm90IGNhbGxlZC5cbiAgICpcbiAgICogVGhpcyB3aWxsIG5vdCBpbnZva2UgYHNob3VsZENvbXBvbmVudFVwZGF0ZWAsIGJ1dCBpdCB3aWxsIGludm9rZVxuICAgKiBgY29tcG9uZW50V2lsbFVwZGF0ZWAgYW5kIGBjb21wb25lbnREaWRVcGRhdGVgLlxuICAgKlxuICAgKiBAcGFyYW0ge1JlYWN0Q2xhc3N9IHB1YmxpY0luc3RhbmNlIFRoZSBpbnN0YW5jZSB0aGF0IHNob3VsZCByZXJlbmRlci5cbiAgICogQGludGVybmFsXG4gICAqL1xuICBlbnF1ZXVlRm9yY2VVcGRhdGU6IGZ1bmN0aW9uIChwdWJsaWNJbnN0YW5jZSkge1xuICAgIHdhcm5Ob29wKHB1YmxpY0luc3RhbmNlLCAnZm9yY2VVcGRhdGUnKTtcbiAgfSxcblxuICAvKipcbiAgICogUmVwbGFjZXMgYWxsIG9mIHRoZSBzdGF0ZS4gQWx3YXlzIHVzZSB0aGlzIG9yIGBzZXRTdGF0ZWAgdG8gbXV0YXRlIHN0YXRlLlxuICAgKiBZb3Ugc2hvdWxkIHRyZWF0IGB0aGlzLnN0YXRlYCBhcyBpbW11dGFibGUuXG4gICAqXG4gICAqIFRoZXJlIGlzIG5vIGd1YXJhbnRlZSB0aGF0IGB0aGlzLnN0YXRlYCB3aWxsIGJlIGltbWVkaWF0ZWx5IHVwZGF0ZWQsIHNvXG4gICAqIGFjY2Vzc2luZyBgdGhpcy5zdGF0ZWAgYWZ0ZXIgY2FsbGluZyB0aGlzIG1ldGhvZCBtYXkgcmV0dXJuIHRoZSBvbGQgdmFsdWUuXG4gICAqXG4gICAqIEBwYXJhbSB7UmVhY3RDbGFzc30gcHVibGljSW5zdGFuY2UgVGhlIGluc3RhbmNlIHRoYXQgc2hvdWxkIHJlcmVuZGVyLlxuICAgKiBAcGFyYW0ge29iamVjdH0gY29tcGxldGVTdGF0ZSBOZXh0IHN0YXRlLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIGVucXVldWVSZXBsYWNlU3RhdGU6IGZ1bmN0aW9uIChwdWJsaWNJbnN0YW5jZSwgY29tcGxldGVTdGF0ZSkge1xuICAgIHdhcm5Ob29wKHB1YmxpY0luc3RhbmNlLCAncmVwbGFjZVN0YXRlJyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNldHMgYSBzdWJzZXQgb2YgdGhlIHN0YXRlLiBUaGlzIG9ubHkgZXhpc3RzIGJlY2F1c2UgX3BlbmRpbmdTdGF0ZSBpc1xuICAgKiBpbnRlcm5hbC4gVGhpcyBwcm92aWRlcyBhIG1lcmdpbmcgc3RyYXRlZ3kgdGhhdCBpcyBub3QgYXZhaWxhYmxlIHRvIGRlZXBcbiAgICogcHJvcGVydGllcyB3aGljaCBpcyBjb25mdXNpbmcuIFRPRE86IEV4cG9zZSBwZW5kaW5nU3RhdGUgb3IgZG9uJ3QgdXNlIGl0XG4gICAqIGR1cmluZyB0aGUgbWVyZ2UuXG4gICAqXG4gICAqIEBwYXJhbSB7UmVhY3RDbGFzc30gcHVibGljSW5zdGFuY2UgVGhlIGluc3RhbmNlIHRoYXQgc2hvdWxkIHJlcmVuZGVyLlxuICAgKiBAcGFyYW0ge29iamVjdH0gcGFydGlhbFN0YXRlIE5leHQgcGFydGlhbCBzdGF0ZSB0byBiZSBtZXJnZWQgd2l0aCBzdGF0ZS5cbiAgICogQGludGVybmFsXG4gICAqL1xuICBlbnF1ZXVlU2V0U3RhdGU6IGZ1bmN0aW9uIChwdWJsaWNJbnN0YW5jZSwgcGFydGlhbFN0YXRlKSB7XG4gICAgd2Fybk5vb3AocHVibGljSW5zdGFuY2UsICdzZXRTdGF0ZScpO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0Tm9vcFVwZGF0ZVF1ZXVlO1xufSx7XCIzMFwiOjMwfV0sMTQ6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xuLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3RQcm9wVHlwZUxvY2F0aW9uTmFtZXMgPSB7fTtcblxuaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIFJlYWN0UHJvcFR5cGVMb2NhdGlvbk5hbWVzID0ge1xuICAgIHByb3A6ICdwcm9wJyxcbiAgICBjb250ZXh0OiAnY29udGV4dCcsXG4gICAgY2hpbGRDb250ZXh0OiAnY2hpbGQgY29udGV4dCdcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdFByb3BUeXBlTG9jYXRpb25OYW1lcztcbn0se31dLDE1OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcbi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBfcmVxdWlyZSA9IF9kZXJlcV8oMTApLFxuICAgIGlzVmFsaWRFbGVtZW50ID0gX3JlcXVpcmUuaXNWYWxpZEVsZW1lbnQ7XG5cbnZhciBmYWN0b3J5ID0gX2RlcmVxXygzMyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShpc1ZhbGlkRWxlbWVudCk7XG59LHtcIjEwXCI6MTAsXCIzM1wiOjMzfV0sMTY6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xuLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSAnU0VDUkVUX0RPX05PVF9QQVNTX1RISVNfT1JfWU9VX1dJTExfQkVfRklSRUQnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0UHJvcFR5cGVzU2VjcmV0O1xufSx7fV0sMTc6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xuLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIF9hc3NpZ24gPSBfZGVyZXFfKDMxKTtcblxudmFyIFJlYWN0Q29tcG9uZW50ID0gX2RlcmVxXyg2KTtcbnZhciBSZWFjdE5vb3BVcGRhdGVRdWV1ZSA9IF9kZXJlcV8oMTMpO1xuXG52YXIgZW1wdHlPYmplY3QgPSBfZGVyZXFfKDI4KTtcblxuLyoqXG4gKiBCYXNlIGNsYXNzIGhlbHBlcnMgZm9yIHRoZSB1cGRhdGluZyBzdGF0ZSBvZiBhIGNvbXBvbmVudC5cbiAqL1xuZnVuY3Rpb24gUmVhY3RQdXJlQ29tcG9uZW50KHByb3BzLCBjb250ZXh0LCB1cGRhdGVyKSB7XG4gIC8vIER1cGxpY2F0ZWQgZnJvbSBSZWFjdENvbXBvbmVudC5cbiAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICB0aGlzLnJlZnMgPSBlbXB0eU9iamVjdDtcbiAgLy8gV2UgaW5pdGlhbGl6ZSB0aGUgZGVmYXVsdCB1cGRhdGVyIGJ1dCB0aGUgcmVhbCBvbmUgZ2V0cyBpbmplY3RlZCBieSB0aGVcbiAgLy8gcmVuZGVyZXIuXG4gIHRoaXMudXBkYXRlciA9IHVwZGF0ZXIgfHwgUmVhY3ROb29wVXBkYXRlUXVldWU7XG59XG5cbmZ1bmN0aW9uIENvbXBvbmVudER1bW15KCkge31cbkNvbXBvbmVudER1bW15LnByb3RvdHlwZSA9IFJlYWN0Q29tcG9uZW50LnByb3RvdHlwZTtcblJlYWN0UHVyZUNvbXBvbmVudC5wcm90b3R5cGUgPSBuZXcgQ29tcG9uZW50RHVtbXkoKTtcblJlYWN0UHVyZUNvbXBvbmVudC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBSZWFjdFB1cmVDb21wb25lbnQ7XG4vLyBBdm9pZCBhbiBleHRyYSBwcm90b3R5cGUganVtcCBmb3IgdGhlc2UgbWV0aG9kcy5cbl9hc3NpZ24oUmVhY3RQdXJlQ29tcG9uZW50LnByb3RvdHlwZSwgUmVhY3RDb21wb25lbnQucHJvdG90eXBlKTtcblJlYWN0UHVyZUNvbXBvbmVudC5wcm90b3R5cGUuaXNQdXJlUmVhY3RDb21wb25lbnQgPSB0cnVlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0UHVyZUNvbXBvbmVudDtcbn0se1wiMTNcIjoxMyxcIjI4XCI6MjgsXCIzMVwiOjMxLFwiNlwiOjZ9XSwxODpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG4vKipcbiAqIENvcHlyaWdodCAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2Fzc2lnbiA9IF9kZXJlcV8oMzEpO1xuXG52YXIgUmVhY3QgPSBfZGVyZXFfKDMpO1xuXG4vLyBgdmVyc2lvbmAgd2lsbCBiZSBhZGRlZCBoZXJlIGJ5IHRoZSBSZWFjdCBtb2R1bGUuXG52YXIgUmVhY3RVTURFbnRyeSA9IF9hc3NpZ24oUmVhY3QsIHtcbiAgX19TRUNSRVRfSU5URVJOQUxTX0RPX05PVF9VU0VfT1JfWU9VX1dJTExfQkVfRklSRUQ6IHtcbiAgICBSZWFjdEN1cnJlbnRPd25lcjogX2RlcmVxXyg4KVxuICB9XG59KTtcblxuaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIF9hc3NpZ24oUmVhY3RVTURFbnRyeS5fX1NFQ1JFVF9JTlRFUk5BTFNfRE9fTk9UX1VTRV9PUl9ZT1VfV0lMTF9CRV9GSVJFRCwge1xuICAgIC8vIFJlYWN0Q29tcG9uZW50VHJlZUhvb2sgc2hvdWxkIG5vdCBiZSBpbmNsdWRlZCBpbiBwcm9kdWN0aW9uLlxuICAgIFJlYWN0Q29tcG9uZW50VHJlZUhvb2s6IF9kZXJlcV8oNyksXG4gICAgZ2V0TmV4dERlYnVnSUQ6IF9kZXJlcV8oMjMpXG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0VU1ERW50cnk7XG59LHtcIjIzXCI6MjMsXCIzXCI6MyxcIjMxXCI6MzEsXCI3XCI6NyxcIjhcIjo4fV0sMTk6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xuLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSAnMTUuNS40Jztcbn0se31dLDIwOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcbi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIFxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGNhbkRlZmluZVByb3BlcnR5ID0gZmFsc2U7XG5pZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdHJ5IHtcbiAgICAvLyAkRmxvd0ZpeE1lIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9mbG93L2lzc3Vlcy8yODVcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICd4JywgeyBnZXQ6IGZ1bmN0aW9uICgpIHt9IH0pO1xuICAgIGNhbkRlZmluZVByb3BlcnR5ID0gdHJ1ZTtcbiAgfSBjYXRjaCAoeCkge1xuICAgIC8vIElFIHdpbGwgZmFpbCBvbiBkZWZpbmVQcm9wZXJ0eVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2FuRGVmaW5lUHJvcGVydHk7XG59LHt9XSwyMTpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG4oZnVuY3Rpb24gKHByb2Nlc3Mpe1xuLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIF9wcm9kSW52YXJpYW50ID0gX2RlcmVxXygyNSk7XG5cbnZhciBSZWFjdFByb3BUeXBlTG9jYXRpb25OYW1lcyA9IF9kZXJlcV8oMTQpO1xudmFyIFJlYWN0UHJvcFR5cGVzU2VjcmV0ID0gX2RlcmVxXygxNik7XG5cbnZhciBpbnZhcmlhbnQgPSBfZGVyZXFfKDI5KTtcbnZhciB3YXJuaW5nID0gX2RlcmVxXygzMCk7XG5cbnZhciBSZWFjdENvbXBvbmVudFRyZWVIb29rO1xuXG5pZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHByb2Nlc3MuZW52ICYmIFwiZGV2ZWxvcG1lbnRcIiA9PT0gJ3Rlc3QnKSB7XG4gIC8vIFRlbXBvcmFyeSBoYWNrLlxuICAvLyBJbmxpbmUgcmVxdWlyZXMgZG9uJ3Qgd29yayB3ZWxsIHdpdGggSmVzdDpcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2lzc3Vlcy83MjQwXG4gIC8vIFJlbW92ZSB0aGUgaW5saW5lIHJlcXVpcmVzIHdoZW4gd2UgZG9uJ3QgbmVlZCB0aGVtIGFueW1vcmU6XG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9wdWxsLzcxNzhcbiAgUmVhY3RDb21wb25lbnRUcmVlSG9vayA9IF9kZXJlcV8oNyk7XG59XG5cbnZhciBsb2dnZWRUeXBlRmFpbHVyZXMgPSB7fTtcblxuLyoqXG4gKiBBc3NlcnQgdGhhdCB0aGUgdmFsdWVzIG1hdGNoIHdpdGggdGhlIHR5cGUgc3BlY3MuXG4gKiBFcnJvciBtZXNzYWdlcyBhcmUgbWVtb3JpemVkIGFuZCB3aWxsIG9ubHkgYmUgc2hvd24gb25jZS5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gdHlwZVNwZWNzIE1hcCBvZiBuYW1lIHRvIGEgUmVhY3RQcm9wVHlwZVxuICogQHBhcmFtIHtvYmplY3R9IHZhbHVlcyBSdW50aW1lIHZhbHVlcyB0aGF0IG5lZWQgdG8gYmUgdHlwZS1jaGVja2VkXG4gKiBAcGFyYW0ge3N0cmluZ30gbG9jYXRpb24gZS5nLiBcInByb3BcIiwgXCJjb250ZXh0XCIsIFwiY2hpbGQgY29udGV4dFwiXG4gKiBAcGFyYW0ge3N0cmluZ30gY29tcG9uZW50TmFtZSBOYW1lIG9mIHRoZSBjb21wb25lbnQgZm9yIGVycm9yIG1lc3NhZ2VzLlxuICogQHBhcmFtIHs/b2JqZWN0fSBlbGVtZW50IFRoZSBSZWFjdCBlbGVtZW50IHRoYXQgaXMgYmVpbmcgdHlwZS1jaGVja2VkXG4gKiBAcGFyYW0gez9udW1iZXJ9IGRlYnVnSUQgVGhlIFJlYWN0IGNvbXBvbmVudCBpbnN0YW5jZSB0aGF0IGlzIGJlaW5nIHR5cGUtY2hlY2tlZFxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gY2hlY2tSZWFjdFR5cGVTcGVjKHR5cGVTcGVjcywgdmFsdWVzLCBsb2NhdGlvbiwgY29tcG9uZW50TmFtZSwgZWxlbWVudCwgZGVidWdJRCkge1xuICBmb3IgKHZhciB0eXBlU3BlY05hbWUgaW4gdHlwZVNwZWNzKSB7XG4gICAgaWYgKHR5cGVTcGVjcy5oYXNPd25Qcm9wZXJ0eSh0eXBlU3BlY05hbWUpKSB7XG4gICAgICB2YXIgZXJyb3I7XG4gICAgICAvLyBQcm9wIHR5cGUgdmFsaWRhdGlvbiBtYXkgdGhyb3cuIEluIGNhc2UgdGhleSBkbywgd2UgZG9uJ3Qgd2FudCB0b1xuICAgICAgLy8gZmFpbCB0aGUgcmVuZGVyIHBoYXNlIHdoZXJlIGl0IGRpZG4ndCBmYWlsIGJlZm9yZS4gU28gd2UgbG9nIGl0LlxuICAgICAgLy8gQWZ0ZXIgdGhlc2UgaGF2ZSBiZWVuIGNsZWFuZWQgdXAsIHdlJ2xsIGxldCB0aGVtIHRocm93LlxuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyBpcyBpbnRlbnRpb25hbGx5IGFuIGludmFyaWFudCB0aGF0IGdldHMgY2F1Z2h0LiBJdCdzIHRoZSBzYW1lXG4gICAgICAgIC8vIGJlaGF2aW9yIGFzIHdpdGhvdXQgdGhpcyBzdGF0ZW1lbnQgZXhjZXB0IHdpdGggYSBiZXR0ZXIgbWVzc2FnZS5cbiAgICAgICAgISh0eXBlb2YgdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0gPT09ICdmdW5jdGlvbicpID8gXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICclczogJXMgdHlwZSBgJXNgIGlzIGludmFsaWQ7IGl0IG11c3QgYmUgYSBmdW5jdGlvbiwgdXN1YWxseSBmcm9tIFJlYWN0LlByb3BUeXBlcy4nLCBjb21wb25lbnROYW1lIHx8ICdSZWFjdCBjbGFzcycsIFJlYWN0UHJvcFR5cGVMb2NhdGlvbk5hbWVzW2xvY2F0aW9uXSwgdHlwZVNwZWNOYW1lKSA6IF9wcm9kSW52YXJpYW50KCc4NCcsIGNvbXBvbmVudE5hbWUgfHwgJ1JlYWN0IGNsYXNzJywgUmVhY3RQcm9wVHlwZUxvY2F0aW9uTmFtZXNbbG9jYXRpb25dLCB0eXBlU3BlY05hbWUpIDogdm9pZCAwO1xuICAgICAgICBlcnJvciA9IHR5cGVTcGVjc1t0eXBlU3BlY05hbWVdKHZhbHVlcywgdHlwZVNwZWNOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgbnVsbCwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgZXJyb3IgPSBleDtcbiAgICAgIH1cbiAgICAgIFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyghZXJyb3IgfHwgZXJyb3IgaW5zdGFuY2VvZiBFcnJvciwgJyVzOiB0eXBlIHNwZWNpZmljYXRpb24gb2YgJXMgYCVzYCBpcyBpbnZhbGlkOyB0aGUgdHlwZSBjaGVja2VyICcgKyAnZnVuY3Rpb24gbXVzdCByZXR1cm4gYG51bGxgIG9yIGFuIGBFcnJvcmAgYnV0IHJldHVybmVkIGEgJXMuICcgKyAnWW91IG1heSBoYXZlIGZvcmdvdHRlbiB0byBwYXNzIGFuIGFyZ3VtZW50IHRvIHRoZSB0eXBlIGNoZWNrZXIgJyArICdjcmVhdG9yIChhcnJheU9mLCBpbnN0YW5jZU9mLCBvYmplY3RPZiwgb25lT2YsIG9uZU9mVHlwZSwgYW5kICcgKyAnc2hhcGUgYWxsIHJlcXVpcmUgYW4gYXJndW1lbnQpLicsIGNvbXBvbmVudE5hbWUgfHwgJ1JlYWN0IGNsYXNzJywgUmVhY3RQcm9wVHlwZUxvY2F0aW9uTmFtZXNbbG9jYXRpb25dLCB0eXBlU3BlY05hbWUsIHR5cGVvZiBlcnJvcikgOiB2b2lkIDA7XG4gICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvciAmJiAhKGVycm9yLm1lc3NhZ2UgaW4gbG9nZ2VkVHlwZUZhaWx1cmVzKSkge1xuICAgICAgICAvLyBPbmx5IG1vbml0b3IgdGhpcyBmYWlsdXJlIG9uY2UgYmVjYXVzZSB0aGVyZSB0ZW5kcyB0byBiZSBhIGxvdCBvZiB0aGVcbiAgICAgICAgLy8gc2FtZSBlcnJvci5cbiAgICAgICAgbG9nZ2VkVHlwZUZhaWx1cmVzW2Vycm9yLm1lc3NhZ2VdID0gdHJ1ZTtcblxuICAgICAgICB2YXIgY29tcG9uZW50U3RhY2tJbmZvID0gJyc7XG5cbiAgICAgICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgaWYgKCFSZWFjdENvbXBvbmVudFRyZWVIb29rKSB7XG4gICAgICAgICAgICBSZWFjdENvbXBvbmVudFRyZWVIb29rID0gX2RlcmVxXyg3KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGRlYnVnSUQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudFN0YWNrSW5mbyA9IFJlYWN0Q29tcG9uZW50VHJlZUhvb2suZ2V0U3RhY2tBZGRlbmR1bUJ5SUQoZGVidWdJRCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50ICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb21wb25lbnRTdGFja0luZm8gPSBSZWFjdENvbXBvbmVudFRyZWVIb29rLmdldEN1cnJlbnRTdGFja0FkZGVuZHVtKGVsZW1lbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyhmYWxzZSwgJ0ZhaWxlZCAlcyB0eXBlOiAlcyVzJywgbG9jYXRpb24sIGVycm9yLm1lc3NhZ2UsIGNvbXBvbmVudFN0YWNrSW5mbykgOiB2b2lkIDA7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2hlY2tSZWFjdFR5cGVTcGVjO1xufSkuY2FsbCh0aGlzLHVuZGVmaW5lZClcbn0se1wiMTRcIjoxNCxcIjE2XCI6MTYsXCIyNVwiOjI1LFwiMjlcIjoyOSxcIjMwXCI6MzAsXCI3XCI6N31dLDIyOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcbi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIFxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyogZ2xvYmFsIFN5bWJvbCAqL1xuXG52YXIgSVRFUkFUT1JfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuaXRlcmF0b3I7XG52YXIgRkFVWF9JVEVSQVRPUl9TWU1CT0wgPSAnQEBpdGVyYXRvcic7IC8vIEJlZm9yZSBTeW1ib2wgc3BlYy5cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBpdGVyYXRvciBtZXRob2QgZnVuY3Rpb24gY29udGFpbmVkIG9uIHRoZSBpdGVyYWJsZSBvYmplY3QuXG4gKlxuICogQmUgc3VyZSB0byBpbnZva2UgdGhlIGZ1bmN0aW9uIHdpdGggdGhlIGl0ZXJhYmxlIGFzIGNvbnRleHQ6XG4gKlxuICogICAgIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihteUl0ZXJhYmxlKTtcbiAqICAgICBpZiAoaXRlcmF0b3JGbikge1xuICogICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmF0b3JGbi5jYWxsKG15SXRlcmFibGUpO1xuICogICAgICAgLi4uXG4gKiAgICAgfVxuICpcbiAqIEBwYXJhbSB7P29iamVjdH0gbWF5YmVJdGVyYWJsZVxuICogQHJldHVybiB7P2Z1bmN0aW9ufVxuICovXG5mdW5jdGlvbiBnZXRJdGVyYXRvckZuKG1heWJlSXRlcmFibGUpIHtcbiAgdmFyIGl0ZXJhdG9yRm4gPSBtYXliZUl0ZXJhYmxlICYmIChJVEVSQVRPUl9TWU1CT0wgJiYgbWF5YmVJdGVyYWJsZVtJVEVSQVRPUl9TWU1CT0xdIHx8IG1heWJlSXRlcmFibGVbRkFVWF9JVEVSQVRPUl9TWU1CT0xdKTtcbiAgaWYgKHR5cGVvZiBpdGVyYXRvckZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGl0ZXJhdG9yRm47XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRJdGVyYXRvckZuO1xufSx7fV0sMjM6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xuLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgbmV4dERlYnVnSUQgPSAxO1xuXG5mdW5jdGlvbiBnZXROZXh0RGVidWdJRCgpIHtcbiAgcmV0dXJuIG5leHREZWJ1Z0lEKys7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TmV4dERlYnVnSUQ7XG59LHt9XSwyNDpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG4vKipcbiAqIENvcHlyaWdodCAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIF9wcm9kSW52YXJpYW50ID0gX2RlcmVxXygyNSk7XG5cbnZhciBSZWFjdEVsZW1lbnQgPSBfZGVyZXFfKDEwKTtcblxudmFyIGludmFyaWFudCA9IF9kZXJlcV8oMjkpO1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGZpcnN0IGNoaWxkIGluIGEgY29sbGVjdGlvbiBvZiBjaGlsZHJlbiBhbmQgdmVyaWZpZXMgdGhhdCB0aGVyZVxuICogaXMgb25seSBvbmUgY2hpbGQgaW4gdGhlIGNvbGxlY3Rpb24uXG4gKlxuICogU2VlIGh0dHBzOi8vZmFjZWJvb2suZ2l0aHViLmlvL3JlYWN0L2RvY3MvdG9wLWxldmVsLWFwaS5odG1sI3JlYWN0LmNoaWxkcmVuLm9ubHlcbiAqXG4gKiBUaGUgY3VycmVudCBpbXBsZW1lbnRhdGlvbiBvZiB0aGlzIGZ1bmN0aW9uIGFzc3VtZXMgdGhhdCBhIHNpbmdsZSBjaGlsZCBnZXRzXG4gKiBwYXNzZWQgd2l0aG91dCBhIHdyYXBwZXIsIGJ1dCB0aGUgcHVycG9zZSBvZiB0aGlzIGhlbHBlciBmdW5jdGlvbiBpcyB0b1xuICogYWJzdHJhY3QgYXdheSB0aGUgcGFydGljdWxhciBzdHJ1Y3R1cmUgb2YgY2hpbGRyZW4uXG4gKlxuICogQHBhcmFtIHs/b2JqZWN0fSBjaGlsZHJlbiBDaGlsZCBjb2xsZWN0aW9uIHN0cnVjdHVyZS5cbiAqIEByZXR1cm4ge1JlYWN0RWxlbWVudH0gVGhlIGZpcnN0IGFuZCBvbmx5IGBSZWFjdEVsZW1lbnRgIGNvbnRhaW5lZCBpbiB0aGVcbiAqIHN0cnVjdHVyZS5cbiAqL1xuZnVuY3Rpb24gb25seUNoaWxkKGNoaWxkcmVuKSB7XG4gICFSZWFjdEVsZW1lbnQuaXNWYWxpZEVsZW1lbnQoY2hpbGRyZW4pID8gXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdSZWFjdC5DaGlsZHJlbi5vbmx5IGV4cGVjdGVkIHRvIHJlY2VpdmUgYSBzaW5nbGUgUmVhY3QgZWxlbWVudCBjaGlsZC4nKSA6IF9wcm9kSW52YXJpYW50KCcxNDMnKSA6IHZvaWQgMDtcbiAgcmV0dXJuIGNoaWxkcmVuO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG9ubHlDaGlsZDtcbn0se1wiMTBcIjoxMCxcIjI1XCI6MjUsXCIyOVwiOjI5fV0sMjU6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xuLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIFxuICovXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogV0FSTklORzogRE8gTk9UIG1hbnVhbGx5IHJlcXVpcmUgdGhpcyBtb2R1bGUuXG4gKiBUaGlzIGlzIGEgcmVwbGFjZW1lbnQgZm9yIGBpbnZhcmlhbnQoLi4uKWAgdXNlZCBieSB0aGUgZXJyb3IgY29kZSBzeXN0ZW1cbiAqIGFuZCB3aWxsIF9vbmx5XyBiZSByZXF1aXJlZCBieSB0aGUgY29ycmVzcG9uZGluZyBiYWJlbCBwYXNzLlxuICogSXQgYWx3YXlzIHRocm93cy5cbiAqL1xuXG5mdW5jdGlvbiByZWFjdFByb2RJbnZhcmlhbnQoY29kZSkge1xuICB2YXIgYXJnQ291bnQgPSBhcmd1bWVudHMubGVuZ3RoIC0gMTtcblxuICB2YXIgbWVzc2FnZSA9ICdNaW5pZmllZCBSZWFjdCBlcnJvciAjJyArIGNvZGUgKyAnOyB2aXNpdCAnICsgJ2h0dHA6Ly9mYWNlYm9vay5naXRodWIuaW8vcmVhY3QvZG9jcy9lcnJvci1kZWNvZGVyLmh0bWw/aW52YXJpYW50PScgKyBjb2RlO1xuXG4gIGZvciAodmFyIGFyZ0lkeCA9IDA7IGFyZ0lkeCA8IGFyZ0NvdW50OyBhcmdJZHgrKykge1xuICAgIG1lc3NhZ2UgKz0gJyZhcmdzW109JyArIGVuY29kZVVSSUNvbXBvbmVudChhcmd1bWVudHNbYXJnSWR4ICsgMV0pO1xuICB9XG5cbiAgbWVzc2FnZSArPSAnIGZvciB0aGUgZnVsbCBtZXNzYWdlIG9yIHVzZSB0aGUgbm9uLW1pbmlmaWVkIGRldiBlbnZpcm9ubWVudCcgKyAnIGZvciBmdWxsIGVycm9ycyBhbmQgYWRkaXRpb25hbCBoZWxwZnVsIHdhcm5pbmdzLic7XG5cbiAgdmFyIGVycm9yID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICBlcnJvci5uYW1lID0gJ0ludmFyaWFudCBWaW9sYXRpb24nO1xuICBlcnJvci5mcmFtZXNUb1BvcCA9IDE7IC8vIHdlIGRvbid0IGNhcmUgYWJvdXQgcmVhY3RQcm9kSW52YXJpYW50J3Mgb3duIGZyYW1lXG5cbiAgdGhyb3cgZXJyb3I7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVhY3RQcm9kSW52YXJpYW50O1xufSx7fV0sMjY6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xuLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIF9wcm9kSW52YXJpYW50ID0gX2RlcmVxXygyNSk7XG5cbnZhciBSZWFjdEN1cnJlbnRPd25lciA9IF9kZXJlcV8oOCk7XG52YXIgUkVBQ1RfRUxFTUVOVF9UWVBFID0gX2RlcmVxXygxMSk7XG5cbnZhciBnZXRJdGVyYXRvckZuID0gX2RlcmVxXygyMik7XG52YXIgaW52YXJpYW50ID0gX2RlcmVxXygyOSk7XG52YXIgS2V5RXNjYXBlVXRpbHMgPSBfZGVyZXFfKDEpO1xudmFyIHdhcm5pbmcgPSBfZGVyZXFfKDMwKTtcblxudmFyIFNFUEFSQVRPUiA9ICcuJztcbnZhciBTVUJTRVBBUkFUT1IgPSAnOic7XG5cbi8qKlxuICogVGhpcyBpcyBpbmxpbmVkIGZyb20gUmVhY3RFbGVtZW50IHNpbmNlIHRoaXMgZmlsZSBpcyBzaGFyZWQgYmV0d2VlblxuICogaXNvbW9ycGhpYyBhbmQgcmVuZGVyZXJzLiBXZSBjb3VsZCBleHRyYWN0IHRoaXMgdG8gYVxuICpcbiAqL1xuXG4vKipcbiAqIFRPRE86IFRlc3QgdGhhdCBhIHNpbmdsZSBjaGlsZCBhbmQgYW4gYXJyYXkgd2l0aCBvbmUgaXRlbSBoYXZlIHRoZSBzYW1lIGtleVxuICogcGF0dGVybi5cbiAqL1xuXG52YXIgZGlkV2FybkFib3V0TWFwcyA9IGZhbHNlO1xuXG4vKipcbiAqIEdlbmVyYXRlIGEga2V5IHN0cmluZyB0aGF0IGlkZW50aWZpZXMgYSBjb21wb25lbnQgd2l0aGluIGEgc2V0LlxuICpcbiAqIEBwYXJhbSB7Kn0gY29tcG9uZW50IEEgY29tcG9uZW50IHRoYXQgY291bGQgY29udGFpbiBhIG1hbnVhbCBrZXkuXG4gKiBAcGFyYW0ge251bWJlcn0gaW5kZXggSW5kZXggdGhhdCBpcyB1c2VkIGlmIGEgbWFudWFsIGtleSBpcyBub3QgcHJvdmlkZWQuXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGdldENvbXBvbmVudEtleShjb21wb25lbnQsIGluZGV4KSB7XG4gIC8vIERvIHNvbWUgdHlwZWNoZWNraW5nIGhlcmUgc2luY2Ugd2UgY2FsbCB0aGlzIGJsaW5kbHkuIFdlIHdhbnQgdG8gZW5zdXJlXG4gIC8vIHRoYXQgd2UgZG9uJ3QgYmxvY2sgcG90ZW50aWFsIGZ1dHVyZSBFUyBBUElzLlxuICBpZiAoY29tcG9uZW50ICYmIHR5cGVvZiBjb21wb25lbnQgPT09ICdvYmplY3QnICYmIGNvbXBvbmVudC5rZXkgIT0gbnVsbCkge1xuICAgIC8vIEV4cGxpY2l0IGtleVxuICAgIHJldHVybiBLZXlFc2NhcGVVdGlscy5lc2NhcGUoY29tcG9uZW50LmtleSk7XG4gIH1cbiAgLy8gSW1wbGljaXQga2V5IGRldGVybWluZWQgYnkgdGhlIGluZGV4IGluIHRoZSBzZXRcbiAgcmV0dXJuIGluZGV4LnRvU3RyaW5nKDM2KTtcbn1cblxuLyoqXG4gKiBAcGFyYW0gez8qfSBjaGlsZHJlbiBDaGlsZHJlbiB0cmVlIGNvbnRhaW5lci5cbiAqIEBwYXJhbSB7IXN0cmluZ30gbmFtZVNvRmFyIE5hbWUgb2YgdGhlIGtleSBwYXRoIHNvIGZhci5cbiAqIEBwYXJhbSB7IWZ1bmN0aW9ufSBjYWxsYmFjayBDYWxsYmFjayB0byBpbnZva2Ugd2l0aCBlYWNoIGNoaWxkIGZvdW5kLlxuICogQHBhcmFtIHs/Kn0gdHJhdmVyc2VDb250ZXh0IFVzZWQgdG8gcGFzcyBpbmZvcm1hdGlvbiB0aHJvdWdob3V0IHRoZSB0cmF2ZXJzYWxcbiAqIHByb2Nlc3MuXG4gKiBAcmV0dXJuIHshbnVtYmVyfSBUaGUgbnVtYmVyIG9mIGNoaWxkcmVuIGluIHRoaXMgc3VidHJlZS5cbiAqL1xuZnVuY3Rpb24gdHJhdmVyc2VBbGxDaGlsZHJlbkltcGwoY2hpbGRyZW4sIG5hbWVTb0ZhciwgY2FsbGJhY2ssIHRyYXZlcnNlQ29udGV4dCkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiBjaGlsZHJlbjtcblxuICBpZiAodHlwZSA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgLy8gQWxsIG9mIHRoZSBhYm92ZSBhcmUgcGVyY2VpdmVkIGFzIG51bGwuXG4gICAgY2hpbGRyZW4gPSBudWxsO1xuICB9XG5cbiAgaWYgKGNoaWxkcmVuID09PSBudWxsIHx8IHR5cGUgPT09ICdzdHJpbmcnIHx8IHR5cGUgPT09ICdudW1iZXInIHx8XG4gIC8vIFRoZSBmb2xsb3dpbmcgaXMgaW5saW5lZCBmcm9tIFJlYWN0RWxlbWVudC4gVGhpcyBtZWFucyB3ZSBjYW4gb3B0aW1pemVcbiAgLy8gc29tZSBjaGVja3MuIFJlYWN0IEZpYmVyIGFsc28gaW5saW5lcyB0aGlzIGxvZ2ljIGZvciBzaW1pbGFyIHB1cnBvc2VzLlxuICB0eXBlID09PSAnb2JqZWN0JyAmJiBjaGlsZHJlbi4kJHR5cGVvZiA9PT0gUkVBQ1RfRUxFTUVOVF9UWVBFKSB7XG4gICAgY2FsbGJhY2sodHJhdmVyc2VDb250ZXh0LCBjaGlsZHJlbixcbiAgICAvLyBJZiBpdCdzIHRoZSBvbmx5IGNoaWxkLCB0cmVhdCB0aGUgbmFtZSBhcyBpZiBpdCB3YXMgd3JhcHBlZCBpbiBhbiBhcnJheVxuICAgIC8vIHNvIHRoYXQgaXQncyBjb25zaXN0ZW50IGlmIHRoZSBudW1iZXIgb2YgY2hpbGRyZW4gZ3Jvd3MuXG4gICAgbmFtZVNvRmFyID09PSAnJyA/IFNFUEFSQVRPUiArIGdldENvbXBvbmVudEtleShjaGlsZHJlbiwgMCkgOiBuYW1lU29GYXIpO1xuICAgIHJldHVybiAxO1xuICB9XG5cbiAgdmFyIGNoaWxkO1xuICB2YXIgbmV4dE5hbWU7XG4gIHZhciBzdWJ0cmVlQ291bnQgPSAwOyAvLyBDb3VudCBvZiBjaGlsZHJlbiBmb3VuZCBpbiB0aGUgY3VycmVudCBzdWJ0cmVlLlxuICB2YXIgbmV4dE5hbWVQcmVmaXggPSBuYW1lU29GYXIgPT09ICcnID8gU0VQQVJBVE9SIDogbmFtZVNvRmFyICsgU1VCU0VQQVJBVE9SO1xuXG4gIGlmIChBcnJheS5pc0FycmF5KGNoaWxkcmVuKSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNoaWxkID0gY2hpbGRyZW5baV07XG4gICAgICBuZXh0TmFtZSA9IG5leHROYW1lUHJlZml4ICsgZ2V0Q29tcG9uZW50S2V5KGNoaWxkLCBpKTtcbiAgICAgIHN1YnRyZWVDb3VudCArPSB0cmF2ZXJzZUFsbENoaWxkcmVuSW1wbChjaGlsZCwgbmV4dE5hbWUsIGNhbGxiYWNrLCB0cmF2ZXJzZUNvbnRleHQpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgaXRlcmF0b3JGbiA9IGdldEl0ZXJhdG9yRm4oY2hpbGRyZW4pO1xuICAgIGlmIChpdGVyYXRvckZuKSB7XG4gICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYXRvckZuLmNhbGwoY2hpbGRyZW4pO1xuICAgICAgdmFyIHN0ZXA7XG4gICAgICBpZiAoaXRlcmF0b3JGbiAhPT0gY2hpbGRyZW4uZW50cmllcykge1xuICAgICAgICB2YXIgaWkgPSAwO1xuICAgICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgICAgY2hpbGQgPSBzdGVwLnZhbHVlO1xuICAgICAgICAgIG5leHROYW1lID0gbmV4dE5hbWVQcmVmaXggKyBnZXRDb21wb25lbnRLZXkoY2hpbGQsIGlpKyspO1xuICAgICAgICAgIHN1YnRyZWVDb3VudCArPSB0cmF2ZXJzZUFsbENoaWxkcmVuSW1wbChjaGlsZCwgbmV4dE5hbWUsIGNhbGxiYWNrLCB0cmF2ZXJzZUNvbnRleHQpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICB2YXIgbWFwc0FzQ2hpbGRyZW5BZGRlbmR1bSA9ICcnO1xuICAgICAgICAgIGlmIChSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50KSB7XG4gICAgICAgICAgICB2YXIgbWFwc0FzQ2hpbGRyZW5Pd25lck5hbWUgPSBSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50LmdldE5hbWUoKTtcbiAgICAgICAgICAgIGlmIChtYXBzQXNDaGlsZHJlbk93bmVyTmFtZSkge1xuICAgICAgICAgICAgICBtYXBzQXNDaGlsZHJlbkFkZGVuZHVtID0gJyBDaGVjayB0aGUgcmVuZGVyIG1ldGhvZCBvZiBgJyArIG1hcHNBc0NoaWxkcmVuT3duZXJOYW1lICsgJ2AuJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGRpZFdhcm5BYm91dE1hcHMsICdVc2luZyBNYXBzIGFzIGNoaWxkcmVuIGlzIG5vdCB5ZXQgZnVsbHkgc3VwcG9ydGVkLiBJdCBpcyBhbiAnICsgJ2V4cGVyaW1lbnRhbCBmZWF0dXJlIHRoYXQgbWlnaHQgYmUgcmVtb3ZlZC4gQ29udmVydCBpdCB0byBhICcgKyAnc2VxdWVuY2UgLyBpdGVyYWJsZSBvZiBrZXllZCBSZWFjdEVsZW1lbnRzIGluc3RlYWQuJXMnLCBtYXBzQXNDaGlsZHJlbkFkZGVuZHVtKSA6IHZvaWQgMDtcbiAgICAgICAgICBkaWRXYXJuQWJvdXRNYXBzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBJdGVyYXRvciB3aWxsIHByb3ZpZGUgZW50cnkgW2ssdl0gdHVwbGVzIHJhdGhlciB0aGFuIHZhbHVlcy5cbiAgICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICAgIHZhciBlbnRyeSA9IHN0ZXAudmFsdWU7XG4gICAgICAgICAgaWYgKGVudHJ5KSB7XG4gICAgICAgICAgICBjaGlsZCA9IGVudHJ5WzFdO1xuICAgICAgICAgICAgbmV4dE5hbWUgPSBuZXh0TmFtZVByZWZpeCArIEtleUVzY2FwZVV0aWxzLmVzY2FwZShlbnRyeVswXSkgKyBTVUJTRVBBUkFUT1IgKyBnZXRDb21wb25lbnRLZXkoY2hpbGQsIDApO1xuICAgICAgICAgICAgc3VidHJlZUNvdW50ICs9IHRyYXZlcnNlQWxsQ2hpbGRyZW5JbXBsKGNoaWxkLCBuZXh0TmFtZSwgY2FsbGJhY2ssIHRyYXZlcnNlQ29udGV4dCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgdmFyIGFkZGVuZHVtID0gJyc7XG4gICAgICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgYWRkZW5kdW0gPSAnIElmIHlvdSBtZWFudCB0byByZW5kZXIgYSBjb2xsZWN0aW9uIG9mIGNoaWxkcmVuLCB1c2UgYW4gYXJyYXkgJyArICdpbnN0ZWFkIG9yIHdyYXAgdGhlIG9iamVjdCB1c2luZyBjcmVhdGVGcmFnbWVudChvYmplY3QpIGZyb20gdGhlICcgKyAnUmVhY3QgYWRkLW9ucy4nO1xuICAgICAgICBpZiAoY2hpbGRyZW4uX2lzUmVhY3RFbGVtZW50KSB7XG4gICAgICAgICAgYWRkZW5kdW0gPSAnIEl0IGxvb2tzIGxpa2UgeW91XFwncmUgdXNpbmcgYW4gZWxlbWVudCBjcmVhdGVkIGJ5IGEgZGlmZmVyZW50ICcgKyAndmVyc2lvbiBvZiBSZWFjdC4gTWFrZSBzdXJlIHRvIHVzZSBvbmx5IG9uZSBjb3B5IG9mIFJlYWN0Lic7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQpIHtcbiAgICAgICAgICB2YXIgbmFtZSA9IFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQuZ2V0TmFtZSgpO1xuICAgICAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgICAgICBhZGRlbmR1bSArPSAnIENoZWNrIHRoZSByZW5kZXIgbWV0aG9kIG9mIGAnICsgbmFtZSArICdgLic7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB2YXIgY2hpbGRyZW5TdHJpbmcgPSBTdHJpbmcoY2hpbGRyZW4pO1xuICAgICAgIWZhbHNlID8gXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdPYmplY3RzIGFyZSBub3QgdmFsaWQgYXMgYSBSZWFjdCBjaGlsZCAoZm91bmQ6ICVzKS4lcycsIGNoaWxkcmVuU3RyaW5nID09PSAnW29iamVjdCBPYmplY3RdJyA/ICdvYmplY3Qgd2l0aCBrZXlzIHsnICsgT2JqZWN0LmtleXMoY2hpbGRyZW4pLmpvaW4oJywgJykgKyAnfScgOiBjaGlsZHJlblN0cmluZywgYWRkZW5kdW0pIDogX3Byb2RJbnZhcmlhbnQoJzMxJywgY2hpbGRyZW5TdHJpbmcgPT09ICdbb2JqZWN0IE9iamVjdF0nID8gJ29iamVjdCB3aXRoIGtleXMgeycgKyBPYmplY3Qua2V5cyhjaGlsZHJlbikuam9pbignLCAnKSArICd9JyA6IGNoaWxkcmVuU3RyaW5nLCBhZGRlbmR1bSkgOiB2b2lkIDA7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHN1YnRyZWVDb3VudDtcbn1cblxuLyoqXG4gKiBUcmF2ZXJzZXMgY2hpbGRyZW4gdGhhdCBhcmUgdHlwaWNhbGx5IHNwZWNpZmllZCBhcyBgcHJvcHMuY2hpbGRyZW5gLCBidXRcbiAqIG1pZ2h0IGFsc28gYmUgc3BlY2lmaWVkIHRocm91Z2ggYXR0cmlidXRlczpcbiAqXG4gKiAtIGB0cmF2ZXJzZUFsbENoaWxkcmVuKHRoaXMucHJvcHMuY2hpbGRyZW4sIC4uLilgXG4gKiAtIGB0cmF2ZXJzZUFsbENoaWxkcmVuKHRoaXMucHJvcHMubGVmdFBhbmVsQ2hpbGRyZW4sIC4uLilgXG4gKlxuICogVGhlIGB0cmF2ZXJzZUNvbnRleHRgIGlzIGFuIG9wdGlvbmFsIGFyZ3VtZW50IHRoYXQgaXMgcGFzc2VkIHRocm91Z2ggdGhlXG4gKiBlbnRpcmUgdHJhdmVyc2FsLiBJdCBjYW4gYmUgdXNlZCB0byBzdG9yZSBhY2N1bXVsYXRpb25zIG9yIGFueXRoaW5nIGVsc2UgdGhhdFxuICogdGhlIGNhbGxiYWNrIG1pZ2h0IGZpbmQgcmVsZXZhbnQuXG4gKlxuICogQHBhcmFtIHs/Kn0gY2hpbGRyZW4gQ2hpbGRyZW4gdHJlZSBvYmplY3QuXG4gKiBAcGFyYW0geyFmdW5jdGlvbn0gY2FsbGJhY2sgVG8gaW52b2tlIHVwb24gdHJhdmVyc2luZyBlYWNoIGNoaWxkLlxuICogQHBhcmFtIHs/Kn0gdHJhdmVyc2VDb250ZXh0IENvbnRleHQgZm9yIHRyYXZlcnNhbC5cbiAqIEByZXR1cm4geyFudW1iZXJ9IFRoZSBudW1iZXIgb2YgY2hpbGRyZW4gaW4gdGhpcyBzdWJ0cmVlLlxuICovXG5mdW5jdGlvbiB0cmF2ZXJzZUFsbENoaWxkcmVuKGNoaWxkcmVuLCBjYWxsYmFjaywgdHJhdmVyc2VDb250ZXh0KSB7XG4gIGlmIChjaGlsZHJlbiA9PSBudWxsKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICByZXR1cm4gdHJhdmVyc2VBbGxDaGlsZHJlbkltcGwoY2hpbGRyZW4sICcnLCBjYWxsYmFjaywgdHJhdmVyc2VDb250ZXh0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0cmF2ZXJzZUFsbENoaWxkcmVuO1xufSx7XCIxXCI6MSxcIjExXCI6MTEsXCIyMlwiOjIyLFwiMjVcIjoyNSxcIjI5XCI6MjksXCIzMFwiOjMwLFwiOFwiOjh9XSwyNzpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIFxuICovXG5cbmZ1bmN0aW9uIG1ha2VFbXB0eUZ1bmN0aW9uKGFyZykge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBhcmc7XG4gIH07XG59XG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbiBhY2NlcHRzIGFuZCBkaXNjYXJkcyBpbnB1dHM7IGl0IGhhcyBubyBzaWRlIGVmZmVjdHMuIFRoaXMgaXNcbiAqIHByaW1hcmlseSB1c2VmdWwgaWRpb21hdGljYWxseSBmb3Igb3ZlcnJpZGFibGUgZnVuY3Rpb24gZW5kcG9pbnRzIHdoaWNoXG4gKiBhbHdheXMgbmVlZCB0byBiZSBjYWxsYWJsZSwgc2luY2UgSlMgbGFja3MgYSBudWxsLWNhbGwgaWRpb20gYWxhIENvY29hLlxuICovXG52YXIgZW1wdHlGdW5jdGlvbiA9IGZ1bmN0aW9uIGVtcHR5RnVuY3Rpb24oKSB7fTtcblxuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJucyA9IG1ha2VFbXB0eUZ1bmN0aW9uO1xuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc0ZhbHNlID0gbWFrZUVtcHR5RnVuY3Rpb24oZmFsc2UpO1xuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc1RydWUgPSBtYWtlRW1wdHlGdW5jdGlvbih0cnVlKTtcbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNOdWxsID0gbWFrZUVtcHR5RnVuY3Rpb24obnVsbCk7XG5lbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zVGhpcyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXM7XG59O1xuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc0FyZ3VtZW50ID0gZnVuY3Rpb24gKGFyZykge1xuICByZXR1cm4gYXJnO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBlbXB0eUZ1bmN0aW9uO1xufSx7fV0sMjg6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xuLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBlbXB0eU9iamVjdCA9IHt9O1xuXG5pZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicpIHtcbiAgT2JqZWN0LmZyZWV6ZShlbXB0eU9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZW1wdHlPYmplY3Q7XG59LHt9XSwyOTpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG4vKipcbiAqIENvcHlyaWdodCAoYykgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBVc2UgaW52YXJpYW50KCkgdG8gYXNzZXJ0IHN0YXRlIHdoaWNoIHlvdXIgcHJvZ3JhbSBhc3N1bWVzIHRvIGJlIHRydWUuXG4gKlxuICogUHJvdmlkZSBzcHJpbnRmLXN0eWxlIGZvcm1hdCAob25seSAlcyBpcyBzdXBwb3J0ZWQpIGFuZCBhcmd1bWVudHNcbiAqIHRvIHByb3ZpZGUgaW5mb3JtYXRpb24gYWJvdXQgd2hhdCBicm9rZSBhbmQgd2hhdCB5b3Ugd2VyZVxuICogZXhwZWN0aW5nLlxuICpcbiAqIFRoZSBpbnZhcmlhbnQgbWVzc2FnZSB3aWxsIGJlIHN0cmlwcGVkIGluIHByb2R1Y3Rpb24sIGJ1dCB0aGUgaW52YXJpYW50XG4gKiB3aWxsIHJlbWFpbiB0byBlbnN1cmUgbG9naWMgZG9lcyBub3QgZGlmZmVyIGluIHByb2R1Y3Rpb24uXG4gKi9cblxudmFyIHZhbGlkYXRlRm9ybWF0ID0gZnVuY3Rpb24gdmFsaWRhdGVGb3JtYXQoZm9ybWF0KSB7fTtcblxuaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhbGlkYXRlRm9ybWF0ID0gZnVuY3Rpb24gdmFsaWRhdGVGb3JtYXQoZm9ybWF0KSB7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFyaWFudCByZXF1aXJlcyBhbiBlcnJvciBtZXNzYWdlIGFyZ3VtZW50Jyk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBpbnZhcmlhbnQoY29uZGl0aW9uLCBmb3JtYXQsIGEsIGIsIGMsIGQsIGUsIGYpIHtcbiAgdmFsaWRhdGVGb3JtYXQoZm9ybWF0KTtcblxuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHZhciBlcnJvcjtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKCdNaW5pZmllZCBleGNlcHRpb24gb2NjdXJyZWQ7IHVzZSB0aGUgbm9uLW1pbmlmaWVkIGRldiBlbnZpcm9ubWVudCAnICsgJ2ZvciB0aGUgZnVsbCBlcnJvciBtZXNzYWdlIGFuZCBhZGRpdGlvbmFsIGhlbHBmdWwgd2FybmluZ3MuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBhcmdzID0gW2EsIGIsIGMsIGQsIGUsIGZdO1xuICAgICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKGZvcm1hdC5yZXBsYWNlKC8lcy9nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBhcmdzW2FyZ0luZGV4KytdO1xuICAgICAgfSkpO1xuICAgICAgZXJyb3IubmFtZSA9ICdJbnZhcmlhbnQgVmlvbGF0aW9uJztcbiAgICB9XG5cbiAgICBlcnJvci5mcmFtZXNUb1BvcCA9IDE7IC8vIHdlIGRvbid0IGNhcmUgYWJvdXQgaW52YXJpYW50J3Mgb3duIGZyYW1lXG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbnZhcmlhbnQ7XG59LHt9XSwzMDpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG4vKipcbiAqIENvcHlyaWdodCAyMDE0LTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW1wdHlGdW5jdGlvbiA9IF9kZXJlcV8oMjcpO1xuXG4vKipcbiAqIFNpbWlsYXIgdG8gaW52YXJpYW50IGJ1dCBvbmx5IGxvZ3MgYSB3YXJuaW5nIGlmIHRoZSBjb25kaXRpb24gaXMgbm90IG1ldC5cbiAqIFRoaXMgY2FuIGJlIHVzZWQgdG8gbG9nIGlzc3VlcyBpbiBkZXZlbG9wbWVudCBlbnZpcm9ubWVudHMgaW4gY3JpdGljYWxcbiAqIHBhdGhzLiBSZW1vdmluZyB0aGUgbG9nZ2luZyBjb2RlIGZvciBwcm9kdWN0aW9uIGVudmlyb25tZW50cyB3aWxsIGtlZXAgdGhlXG4gKiBzYW1lIGxvZ2ljIGFuZCBmb2xsb3cgdGhlIHNhbWUgY29kZSBwYXRocy5cbiAqL1xuXG52YXIgd2FybmluZyA9IGVtcHR5RnVuY3Rpb247XG5cbmlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJykge1xuICAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBwcmludFdhcm5pbmcgPSBmdW5jdGlvbiBwcmludFdhcm5pbmcoZm9ybWF0KSB7XG4gICAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgICAgYXJnc1tfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgICB9XG5cbiAgICAgIHZhciBhcmdJbmRleCA9IDA7XG4gICAgICB2YXIgbWVzc2FnZSA9ICdXYXJuaW5nOiAnICsgZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107XG4gICAgICB9KTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIC0tLSBXZWxjb21lIHRvIGRlYnVnZ2luZyBSZWFjdCAtLS1cbiAgICAgICAgLy8gVGhpcyBlcnJvciB3YXMgdGhyb3duIGFzIGEgY29udmVuaWVuY2Ugc28gdGhhdCB5b3UgY2FuIHVzZSB0aGlzIHN0YWNrXG4gICAgICAgIC8vIHRvIGZpbmQgdGhlIGNhbGxzaXRlIHRoYXQgY2F1c2VkIHRoaXMgd2FybmluZyB0byBmaXJlLlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgICB9IGNhdGNoICh4KSB7fVxuICAgIH07XG5cbiAgICB3YXJuaW5nID0gZnVuY3Rpb24gd2FybmluZyhjb25kaXRpb24sIGZvcm1hdCkge1xuICAgICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignYHdhcm5pbmcoY29uZGl0aW9uLCBmb3JtYXQsIC4uLmFyZ3MpYCByZXF1aXJlcyBhIHdhcm5pbmcgJyArICdtZXNzYWdlIGFyZ3VtZW50Jyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChmb3JtYXQuaW5kZXhPZignRmFpbGVkIENvbXBvc2l0ZSBwcm9wVHlwZTogJykgPT09IDApIHtcbiAgICAgICAgcmV0dXJuOyAvLyBJZ25vcmUgQ29tcG9zaXRlQ29tcG9uZW50IHByb3B0eXBlIGNoZWNrLlxuICAgICAgfVxuXG4gICAgICBpZiAoIWNvbmRpdGlvbikge1xuICAgICAgICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMiA+IDIgPyBfbGVuMiAtIDIgOiAwKSwgX2tleTIgPSAyOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG4gICAgICAgICAgYXJnc1tfa2V5MiAtIDJdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaW50V2FybmluZy5hcHBseSh1bmRlZmluZWQsIFtmb3JtYXRdLmNvbmNhdChhcmdzKSk7XG4gICAgICB9XG4gICAgfTtcbiAgfSkoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB3YXJuaW5nO1xufSx7XCIyN1wiOjI3fV0sMzE6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xuLypcbm9iamVjdC1hc3NpZ25cbihjKSBTaW5kcmUgU29yaHVzXG5AbGljZW5zZSBNSVRcbiovXG5cbid1c2Ugc3RyaWN0Jztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG52YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgcHJvcElzRW51bWVyYWJsZSA9IE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbCkge1xuICBpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcbiAgfVxuXG4gIHJldHVybiBPYmplY3QodmFsKTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkVXNlTmF0aXZlKCkge1xuICB0cnkge1xuICAgIGlmICghT2JqZWN0LmFzc2lnbikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIERldGVjdCBidWdneSBwcm9wZXJ0eSBlbnVtZXJhdGlvbiBvcmRlciBpbiBvbGRlciBWOCB2ZXJzaW9ucy5cblxuICAgIC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTQxMThcbiAgICB2YXIgdGVzdDEgPSBuZXcgU3RyaW5nKCdhYmMnKTsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3LXdyYXBwZXJzXG4gICAgdGVzdDFbNV0gPSAnZGUnO1xuICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MSlbMF0gPT09ICc1Jykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcbiAgICB2YXIgdGVzdDIgPSB7fTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICAgIHRlc3QyWydfJyArIFN0cmluZy5mcm9tQ2hhckNvZGUoaSldID0gaTtcbiAgICB9XG4gICAgdmFyIG9yZGVyMiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QyKS5tYXAoZnVuY3Rpb24gKG4pIHtcbiAgICAgIHJldHVybiB0ZXN0MltuXTtcbiAgICB9KTtcbiAgICBpZiAob3JkZXIyLmpvaW4oJycpICE9PSAnMDEyMzQ1Njc4OScpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG4gICAgdmFyIHRlc3QzID0ge307XG4gICAgJ2FiY2RlZmdoaWprbG1ub3BxcnN0Jy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAobGV0dGVyKSB7XG4gICAgICB0ZXN0M1tsZXR0ZXJdID0gbGV0dGVyO1xuICAgIH0pO1xuICAgIGlmIChPYmplY3Qua2V5cyhPYmplY3QuYXNzaWduKHt9LCB0ZXN0MykpLmpvaW4oJycpICE9PVxuICAgICAgICAnYWJjZGVmZ2hpamtsbW5vcHFyc3QnKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIC8vIFdlIGRvbid0IGV4cGVjdCBhbnkgb2YgdGhlIGFib3ZlIHRvIHRocm93LCBidXQgYmV0dGVyIHRvIGJlIHNhZmUuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvdWxkVXNlTmF0aXZlKCkgPyBPYmplY3QuYXNzaWduIDogZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG4gIHZhciBmcm9tO1xuICB2YXIgdG8gPSB0b09iamVjdCh0YXJnZXQpO1xuICB2YXIgc3ltYm9scztcblxuICBmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuICAgIGZyb20gPSBPYmplY3QoYXJndW1lbnRzW3NdKTtcblxuICAgIGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG4gICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG4gICAgICAgIHRvW2tleV0gPSBmcm9tW2tleV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGdldE93blByb3BlcnR5U3ltYm9scykge1xuICAgICAgc3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9scyhmcm9tKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3ltYm9scy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAocHJvcElzRW51bWVyYWJsZS5jYWxsKGZyb20sIHN5bWJvbHNbaV0pKSB7XG4gICAgICAgICAgdG9bc3ltYm9sc1tpXV0gPSBmcm9tW3N5bWJvbHNbaV1dO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRvO1xufTtcblxufSx7fV0sMzI6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xuLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5pZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFyIGludmFyaWFudCA9IF9kZXJlcV8oMjkpO1xuICB2YXIgd2FybmluZyA9IF9kZXJlcV8oMzApO1xuICB2YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSBfZGVyZXFfKDM1KTtcbiAgdmFyIGxvZ2dlZFR5cGVGYWlsdXJlcyA9IHt9O1xufVxuXG4vKipcbiAqIEFzc2VydCB0aGF0IHRoZSB2YWx1ZXMgbWF0Y2ggd2l0aCB0aGUgdHlwZSBzcGVjcy5cbiAqIEVycm9yIG1lc3NhZ2VzIGFyZSBtZW1vcml6ZWQgYW5kIHdpbGwgb25seSBiZSBzaG93biBvbmNlLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSB0eXBlU3BlY3MgTWFwIG9mIG5hbWUgdG8gYSBSZWFjdFByb3BUeXBlXG4gKiBAcGFyYW0ge29iamVjdH0gdmFsdWVzIFJ1bnRpbWUgdmFsdWVzIHRoYXQgbmVlZCB0byBiZSB0eXBlLWNoZWNrZWRcbiAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhdGlvbiBlLmcuIFwicHJvcFwiLCBcImNvbnRleHRcIiwgXCJjaGlsZCBjb250ZXh0XCJcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb21wb25lbnROYW1lIE5hbWUgb2YgdGhlIGNvbXBvbmVudCBmb3IgZXJyb3IgbWVzc2FnZXMuXG4gKiBAcGFyYW0gez9GdW5jdGlvbn0gZ2V0U3RhY2sgUmV0dXJucyB0aGUgY29tcG9uZW50IHN0YWNrLlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gY2hlY2tQcm9wVHlwZXModHlwZVNwZWNzLCB2YWx1ZXMsIGxvY2F0aW9uLCBjb21wb25lbnROYW1lLCBnZXRTdGFjaykge1xuICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBmb3IgKHZhciB0eXBlU3BlY05hbWUgaW4gdHlwZVNwZWNzKSB7XG4gICAgICBpZiAodHlwZVNwZWNzLmhhc093blByb3BlcnR5KHR5cGVTcGVjTmFtZSkpIHtcbiAgICAgICAgdmFyIGVycm9yO1xuICAgICAgICAvLyBQcm9wIHR5cGUgdmFsaWRhdGlvbiBtYXkgdGhyb3cuIEluIGNhc2UgdGhleSBkbywgd2UgZG9uJ3Qgd2FudCB0b1xuICAgICAgICAvLyBmYWlsIHRoZSByZW5kZXIgcGhhc2Ugd2hlcmUgaXQgZGlkbid0IGZhaWwgYmVmb3JlLiBTbyB3ZSBsb2cgaXQuXG4gICAgICAgIC8vIEFmdGVyIHRoZXNlIGhhdmUgYmVlbiBjbGVhbmVkIHVwLCB3ZSdsbCBsZXQgdGhlbSB0aHJvdy5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBUaGlzIGlzIGludGVudGlvbmFsbHkgYW4gaW52YXJpYW50IHRoYXQgZ2V0cyBjYXVnaHQuIEl0J3MgdGhlIHNhbWVcbiAgICAgICAgICAvLyBiZWhhdmlvciBhcyB3aXRob3V0IHRoaXMgc3RhdGVtZW50IGV4Y2VwdCB3aXRoIGEgYmV0dGVyIG1lc3NhZ2UuXG4gICAgICAgICAgaW52YXJpYW50KHR5cGVvZiB0eXBlU3BlY3NbdHlwZVNwZWNOYW1lXSA9PT0gJ2Z1bmN0aW9uJywgJyVzOiAlcyB0eXBlIGAlc2AgaXMgaW52YWxpZDsgaXQgbXVzdCBiZSBhIGZ1bmN0aW9uLCB1c3VhbGx5IGZyb20gJyArICdSZWFjdC5Qcm9wVHlwZXMuJywgY29tcG9uZW50TmFtZSB8fCAnUmVhY3QgY2xhc3MnLCBsb2NhdGlvbiwgdHlwZVNwZWNOYW1lKTtcbiAgICAgICAgICBlcnJvciA9IHR5cGVTcGVjc1t0eXBlU3BlY05hbWVdKHZhbHVlcywgdHlwZVNwZWNOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgbnVsbCwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAgIGVycm9yID0gZXg7XG4gICAgICAgIH1cbiAgICAgICAgd2FybmluZyghZXJyb3IgfHwgZXJyb3IgaW5zdGFuY2VvZiBFcnJvciwgJyVzOiB0eXBlIHNwZWNpZmljYXRpb24gb2YgJXMgYCVzYCBpcyBpbnZhbGlkOyB0aGUgdHlwZSBjaGVja2VyICcgKyAnZnVuY3Rpb24gbXVzdCByZXR1cm4gYG51bGxgIG9yIGFuIGBFcnJvcmAgYnV0IHJldHVybmVkIGEgJXMuICcgKyAnWW91IG1heSBoYXZlIGZvcmdvdHRlbiB0byBwYXNzIGFuIGFyZ3VtZW50IHRvIHRoZSB0eXBlIGNoZWNrZXIgJyArICdjcmVhdG9yIChhcnJheU9mLCBpbnN0YW5jZU9mLCBvYmplY3RPZiwgb25lT2YsIG9uZU9mVHlwZSwgYW5kICcgKyAnc2hhcGUgYWxsIHJlcXVpcmUgYW4gYXJndW1lbnQpLicsIGNvbXBvbmVudE5hbWUgfHwgJ1JlYWN0IGNsYXNzJywgbG9jYXRpb24sIHR5cGVTcGVjTmFtZSwgdHlwZW9mIGVycm9yKTtcbiAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IgJiYgIShlcnJvci5tZXNzYWdlIGluIGxvZ2dlZFR5cGVGYWlsdXJlcykpIHtcbiAgICAgICAgICAvLyBPbmx5IG1vbml0b3IgdGhpcyBmYWlsdXJlIG9uY2UgYmVjYXVzZSB0aGVyZSB0ZW5kcyB0byBiZSBhIGxvdCBvZiB0aGVcbiAgICAgICAgICAvLyBzYW1lIGVycm9yLlxuICAgICAgICAgIGxvZ2dlZFR5cGVGYWlsdXJlc1tlcnJvci5tZXNzYWdlXSA9IHRydWU7XG5cbiAgICAgICAgICB2YXIgc3RhY2sgPSBnZXRTdGFjayA/IGdldFN0YWNrKCkgOiAnJztcblxuICAgICAgICAgIHdhcm5pbmcoZmFsc2UsICdGYWlsZWQgJXMgdHlwZTogJXMlcycsIGxvY2F0aW9uLCBlcnJvci5tZXNzYWdlLCBzdGFjayAhPSBudWxsID8gc3RhY2sgOiAnJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjaGVja1Byb3BUeXBlcztcblxufSx7XCIyOVwiOjI5LFwiMzBcIjozMCxcIjM1XCI6MzV9XSwzMzpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG4vKipcbiAqIENvcHlyaWdodCAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8vIFJlYWN0IDE1LjUgcmVmZXJlbmNlcyB0aGlzIG1vZHVsZSwgYW5kIGFzc3VtZXMgUHJvcFR5cGVzIGFyZSBzdGlsbCBjYWxsYWJsZSBpbiBwcm9kdWN0aW9uLlxuLy8gVGhlcmVmb3JlIHdlIHJlLWV4cG9ydCBkZXZlbG9wbWVudC1vbmx5IHZlcnNpb24gd2l0aCBhbGwgdGhlIFByb3BUeXBlcyBjaGVja3MgaGVyZS5cbi8vIEhvd2V2ZXIgaWYgb25lIGlzIG1pZ3JhdGluZyB0byB0aGUgYHByb3AtdHlwZXNgIG5wbSBsaWJyYXJ5LCB0aGV5IHdpbGwgZ28gdGhyb3VnaCB0aGVcbi8vIGBpbmRleC5qc2AgZW50cnkgcG9pbnQsIGFuZCBpdCB3aWxsIGJyYW5jaCBkZXBlbmRpbmcgb24gdGhlIGVudmlyb25tZW50LlxudmFyIGZhY3RvcnkgPSBfZGVyZXFfKDM0KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXNWYWxpZEVsZW1lbnQpIHtcbiAgLy8gSXQgaXMgc3RpbGwgYWxsb3dlZCBpbiAxNS41LlxuICB2YXIgdGhyb3dPbkRpcmVjdEFjY2VzcyA9IGZhbHNlO1xuICByZXR1cm4gZmFjdG9yeShpc1ZhbGlkRWxlbWVudCwgdGhyb3dPbkRpcmVjdEFjY2Vzcyk7XG59O1xuXG59LHtcIjM0XCI6MzR9XSwzNDpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG4vKipcbiAqIENvcHlyaWdodCAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBlbXB0eUZ1bmN0aW9uID0gX2RlcmVxXygyNyk7XG52YXIgaW52YXJpYW50ID0gX2RlcmVxXygyOSk7XG52YXIgd2FybmluZyA9IF9kZXJlcV8oMzApO1xuXG52YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSBfZGVyZXFfKDM1KTtcbnZhciBjaGVja1Byb3BUeXBlcyA9IF9kZXJlcV8oMzIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGlzVmFsaWRFbGVtZW50LCB0aHJvd09uRGlyZWN0QWNjZXNzKSB7XG4gIC8qIGdsb2JhbCBTeW1ib2wgKi9cbiAgdmFyIElURVJBVE9SX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLml0ZXJhdG9yO1xuICB2YXIgRkFVWF9JVEVSQVRPUl9TWU1CT0wgPSAnQEBpdGVyYXRvcic7IC8vIEJlZm9yZSBTeW1ib2wgc3BlYy5cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaXRlcmF0b3IgbWV0aG9kIGZ1bmN0aW9uIGNvbnRhaW5lZCBvbiB0aGUgaXRlcmFibGUgb2JqZWN0LlxuICAgKlxuICAgKiBCZSBzdXJlIHRvIGludm9rZSB0aGUgZnVuY3Rpb24gd2l0aCB0aGUgaXRlcmFibGUgYXMgY29udGV4dDpcbiAgICpcbiAgICogICAgIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihteUl0ZXJhYmxlKTtcbiAgICogICAgIGlmIChpdGVyYXRvckZuKSB7XG4gICAqICAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhdG9yRm4uY2FsbChteUl0ZXJhYmxlKTtcbiAgICogICAgICAgLi4uXG4gICAqICAgICB9XG4gICAqXG4gICAqIEBwYXJhbSB7P29iamVjdH0gbWF5YmVJdGVyYWJsZVxuICAgKiBAcmV0dXJuIHs/ZnVuY3Rpb259XG4gICAqL1xuICBmdW5jdGlvbiBnZXRJdGVyYXRvckZuKG1heWJlSXRlcmFibGUpIHtcbiAgICB2YXIgaXRlcmF0b3JGbiA9IG1heWJlSXRlcmFibGUgJiYgKElURVJBVE9SX1NZTUJPTCAmJiBtYXliZUl0ZXJhYmxlW0lURVJBVE9SX1NZTUJPTF0gfHwgbWF5YmVJdGVyYWJsZVtGQVVYX0lURVJBVE9SX1NZTUJPTF0pO1xuICAgIGlmICh0eXBlb2YgaXRlcmF0b3JGbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yRm47XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENvbGxlY3Rpb24gb2YgbWV0aG9kcyB0aGF0IGFsbG93IGRlY2xhcmF0aW9uIGFuZCB2YWxpZGF0aW9uIG9mIHByb3BzIHRoYXQgYXJlXG4gICAqIHN1cHBsaWVkIHRvIFJlYWN0IGNvbXBvbmVudHMuIEV4YW1wbGUgdXNhZ2U6XG4gICAqXG4gICAqICAgdmFyIFByb3BzID0gcmVxdWlyZSgnUmVhY3RQcm9wVHlwZXMnKTtcbiAgICogICB2YXIgTXlBcnRpY2xlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgKiAgICAgcHJvcFR5cGVzOiB7XG4gICAqICAgICAgIC8vIEFuIG9wdGlvbmFsIHN0cmluZyBwcm9wIG5hbWVkIFwiZGVzY3JpcHRpb25cIi5cbiAgICogICAgICAgZGVzY3JpcHRpb246IFByb3BzLnN0cmluZyxcbiAgICpcbiAgICogICAgICAgLy8gQSByZXF1aXJlZCBlbnVtIHByb3AgbmFtZWQgXCJjYXRlZ29yeVwiLlxuICAgKiAgICAgICBjYXRlZ29yeTogUHJvcHMub25lT2YoWydOZXdzJywnUGhvdG9zJ10pLmlzUmVxdWlyZWQsXG4gICAqXG4gICAqICAgICAgIC8vIEEgcHJvcCBuYW1lZCBcImRpYWxvZ1wiIHRoYXQgcmVxdWlyZXMgYW4gaW5zdGFuY2Ugb2YgRGlhbG9nLlxuICAgKiAgICAgICBkaWFsb2c6IFByb3BzLmluc3RhbmNlT2YoRGlhbG9nKS5pc1JlcXVpcmVkXG4gICAqICAgICB9LFxuICAgKiAgICAgcmVuZGVyOiBmdW5jdGlvbigpIHsgLi4uIH1cbiAgICogICB9KTtcbiAgICpcbiAgICogQSBtb3JlIGZvcm1hbCBzcGVjaWZpY2F0aW9uIG9mIGhvdyB0aGVzZSBtZXRob2RzIGFyZSB1c2VkOlxuICAgKlxuICAgKiAgIHR5cGUgOj0gYXJyYXl8Ym9vbHxmdW5jfG9iamVjdHxudW1iZXJ8c3RyaW5nfG9uZU9mKFsuLi5dKXxpbnN0YW5jZU9mKC4uLilcbiAgICogICBkZWNsIDo9IFJlYWN0UHJvcFR5cGVzLnt0eXBlfSguaXNSZXF1aXJlZCk/XG4gICAqXG4gICAqIEVhY2ggYW5kIGV2ZXJ5IGRlY2xhcmF0aW9uIHByb2R1Y2VzIGEgZnVuY3Rpb24gd2l0aCB0aGUgc2FtZSBzaWduYXR1cmUuIFRoaXNcbiAgICogYWxsb3dzIHRoZSBjcmVhdGlvbiBvZiBjdXN0b20gdmFsaWRhdGlvbiBmdW5jdGlvbnMuIEZvciBleGFtcGxlOlxuICAgKlxuICAgKiAgdmFyIE15TGluayA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICogICAgcHJvcFR5cGVzOiB7XG4gICAqICAgICAgLy8gQW4gb3B0aW9uYWwgc3RyaW5nIG9yIFVSSSBwcm9wIG5hbWVkIFwiaHJlZlwiLlxuICAgKiAgICAgIGhyZWY6IGZ1bmN0aW9uKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSkge1xuICAgKiAgICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICogICAgICAgIGlmIChwcm9wVmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgcHJvcFZhbHVlICE9PSAnc3RyaW5nJyAmJlxuICAgKiAgICAgICAgICAgICEocHJvcFZhbHVlIGluc3RhbmNlb2YgVVJJKSkge1xuICAgKiAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKFxuICAgKiAgICAgICAgICAgICdFeHBlY3RlZCBhIHN0cmluZyBvciBhbiBVUkkgZm9yICcgKyBwcm9wTmFtZSArICcgaW4gJyArXG4gICAqICAgICAgICAgICAgY29tcG9uZW50TmFtZVxuICAgKiAgICAgICAgICApO1xuICAgKiAgICAgICAgfVxuICAgKiAgICAgIH1cbiAgICogICAgfSxcbiAgICogICAgcmVuZGVyOiBmdW5jdGlvbigpIHsuLi59XG4gICAqICB9KTtcbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuXG4gIHZhciBBTk9OWU1PVVMgPSAnPDxhbm9ueW1vdXM+Pic7XG5cbiAgLy8gSW1wb3J0YW50IVxuICAvLyBLZWVwIHRoaXMgbGlzdCBpbiBzeW5jIHdpdGggcHJvZHVjdGlvbiB2ZXJzaW9uIGluIGAuL2ZhY3RvcnlXaXRoVGhyb3dpbmdTaGltcy5qc2AuXG4gIHZhciBSZWFjdFByb3BUeXBlcyA9IHtcbiAgICBhcnJheTogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ2FycmF5JyksXG4gICAgYm9vbDogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ2Jvb2xlYW4nKSxcbiAgICBmdW5jOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignZnVuY3Rpb24nKSxcbiAgICBudW1iZXI6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdudW1iZXInKSxcbiAgICBvYmplY3Q6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdvYmplY3QnKSxcbiAgICBzdHJpbmc6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdzdHJpbmcnKSxcbiAgICBzeW1ib2w6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdzeW1ib2wnKSxcblxuICAgIGFueTogY3JlYXRlQW55VHlwZUNoZWNrZXIoKSxcbiAgICBhcnJheU9mOiBjcmVhdGVBcnJheU9mVHlwZUNoZWNrZXIsXG4gICAgZWxlbWVudDogY3JlYXRlRWxlbWVudFR5cGVDaGVja2VyKCksXG4gICAgaW5zdGFuY2VPZjogY3JlYXRlSW5zdGFuY2VUeXBlQ2hlY2tlcixcbiAgICBub2RlOiBjcmVhdGVOb2RlQ2hlY2tlcigpLFxuICAgIG9iamVjdE9mOiBjcmVhdGVPYmplY3RPZlR5cGVDaGVja2VyLFxuICAgIG9uZU9mOiBjcmVhdGVFbnVtVHlwZUNoZWNrZXIsXG4gICAgb25lT2ZUeXBlOiBjcmVhdGVVbmlvblR5cGVDaGVja2VyLFxuICAgIHNoYXBlOiBjcmVhdGVTaGFwZVR5cGVDaGVja2VyXG4gIH07XG5cbiAgLyoqXG4gICAqIGlubGluZWQgT2JqZWN0LmlzIHBvbHlmaWxsIHRvIGF2b2lkIHJlcXVpcmluZyBjb25zdW1lcnMgc2hpcCB0aGVpciBvd25cbiAgICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2lzXG4gICAqL1xuICAvKmVzbGludC1kaXNhYmxlIG5vLXNlbGYtY29tcGFyZSovXG4gIGZ1bmN0aW9uIGlzKHgsIHkpIHtcbiAgICAvLyBTYW1lVmFsdWUgYWxnb3JpdGhtXG4gICAgaWYgKHggPT09IHkpIHtcbiAgICAgIC8vIFN0ZXBzIDEtNSwgNy0xMFxuICAgICAgLy8gU3RlcHMgNi5iLTYuZTogKzAgIT0gLTBcbiAgICAgIHJldHVybiB4ICE9PSAwIHx8IDEgLyB4ID09PSAxIC8geTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU3RlcCA2LmE6IE5hTiA9PSBOYU5cbiAgICAgIHJldHVybiB4ICE9PSB4ICYmIHkgIT09IHk7XG4gICAgfVxuICB9XG4gIC8qZXNsaW50LWVuYWJsZSBuby1zZWxmLWNvbXBhcmUqL1xuXG4gIC8qKlxuICAgKiBXZSB1c2UgYW4gRXJyb3ItbGlrZSBvYmplY3QgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgYXMgcGVvcGxlIG1heSBjYWxsXG4gICAqIFByb3BUeXBlcyBkaXJlY3RseSBhbmQgaW5zcGVjdCB0aGVpciBvdXRwdXQuIEhvd2V2ZXIsIHdlIGRvbid0IHVzZSByZWFsXG4gICAqIEVycm9ycyBhbnltb3JlLiBXZSBkb24ndCBpbnNwZWN0IHRoZWlyIHN0YWNrIGFueXdheSwgYW5kIGNyZWF0aW5nIHRoZW1cbiAgICogaXMgcHJvaGliaXRpdmVseSBleHBlbnNpdmUgaWYgdGhleSBhcmUgY3JlYXRlZCB0b28gb2Z0ZW4sIHN1Y2ggYXMgd2hhdFxuICAgKiBoYXBwZW5zIGluIG9uZU9mVHlwZSgpIGZvciBhbnkgdHlwZSBiZWZvcmUgdGhlIG9uZSB0aGF0IG1hdGNoZWQuXG4gICAqL1xuICBmdW5jdGlvbiBQcm9wVHlwZUVycm9yKG1lc3NhZ2UpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIHRoaXMuc3RhY2sgPSAnJztcbiAgfVxuICAvLyBNYWtlIGBpbnN0YW5jZW9mIEVycm9yYCBzdGlsbCB3b3JrIGZvciByZXR1cm5lZCBlcnJvcnMuXG4gIFByb3BUeXBlRXJyb3IucHJvdG90eXBlID0gRXJyb3IucHJvdG90eXBlO1xuXG4gIGZ1bmN0aW9uIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKSB7XG4gICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICB2YXIgbWFudWFsUHJvcFR5cGVDYWxsQ2FjaGUgPSB7fTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY2hlY2tUeXBlKGlzUmVxdWlyZWQsIHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSwgc2VjcmV0KSB7XG4gICAgICBjb21wb25lbnROYW1lID0gY29tcG9uZW50TmFtZSB8fCBBTk9OWU1PVVM7XG4gICAgICBwcm9wRnVsbE5hbWUgPSBwcm9wRnVsbE5hbWUgfHwgcHJvcE5hbWU7XG5cbiAgICAgIGlmIChzZWNyZXQgIT09IFJlYWN0UHJvcFR5cGVzU2VjcmV0KSB7XG4gICAgICAgIGlmICh0aHJvd09uRGlyZWN0QWNjZXNzKSB7XG4gICAgICAgICAgLy8gTmV3IGJlaGF2aW9yIG9ubHkgZm9yIHVzZXJzIG9mIGBwcm9wLXR5cGVzYCBwYWNrYWdlXG4gICAgICAgICAgaW52YXJpYW50KFxuICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICAnQ2FsbGluZyBQcm9wVHlwZXMgdmFsaWRhdG9ycyBkaXJlY3RseSBpcyBub3Qgc3VwcG9ydGVkIGJ5IHRoZSBgcHJvcC10eXBlc2AgcGFja2FnZS4gJyArXG4gICAgICAgICAgICAnVXNlIGBQcm9wVHlwZXMuY2hlY2tQcm9wVHlwZXMoKWAgdG8gY2FsbCB0aGVtLiAnICtcbiAgICAgICAgICAgICdSZWFkIG1vcmUgYXQgaHR0cDovL2ZiLm1lL3VzZS1jaGVjay1wcm9wLXR5cGVzJ1xuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgdHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgLy8gT2xkIGJlaGF2aW9yIGZvciBwZW9wbGUgdXNpbmcgUmVhY3QuUHJvcFR5cGVzXG4gICAgICAgICAgdmFyIGNhY2hlS2V5ID0gY29tcG9uZW50TmFtZSArICc6JyArIHByb3BOYW1lO1xuICAgICAgICAgIGlmICghbWFudWFsUHJvcFR5cGVDYWxsQ2FjaGVbY2FjaGVLZXldKSB7XG4gICAgICAgICAgICB3YXJuaW5nKFxuICAgICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgICAgJ1lvdSBhcmUgbWFudWFsbHkgY2FsbGluZyBhIFJlYWN0LlByb3BUeXBlcyB2YWxpZGF0aW9uICcgK1xuICAgICAgICAgICAgICAnZnVuY3Rpb24gZm9yIHRoZSBgJXNgIHByb3Agb24gYCVzYC4gVGhpcyBpcyBkZXByZWNhdGVkICcgK1xuICAgICAgICAgICAgICAnYW5kIHdpbGwgdGhyb3cgaW4gdGhlIHN0YW5kYWxvbmUgYHByb3AtdHlwZXNgIHBhY2thZ2UuICcgK1xuICAgICAgICAgICAgICAnWW91IG1heSBiZSBzZWVpbmcgdGhpcyB3YXJuaW5nIGR1ZSB0byBhIHRoaXJkLXBhcnR5IFByb3BUeXBlcyAnICtcbiAgICAgICAgICAgICAgJ2xpYnJhcnkuIFNlZSBodHRwczovL2ZiLm1lL3JlYWN0LXdhcm5pbmctZG9udC1jYWxsLXByb3B0eXBlcyAnICsgJ2ZvciBkZXRhaWxzLicsXG4gICAgICAgICAgICAgIHByb3BGdWxsTmFtZSxcbiAgICAgICAgICAgICAgY29tcG9uZW50TmFtZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIG1hbnVhbFByb3BUeXBlQ2FsbENhY2hlW2NhY2hlS2V5XSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocHJvcHNbcHJvcE5hbWVdID09IG51bGwpIHtcbiAgICAgICAgaWYgKGlzUmVxdWlyZWQpIHtcbiAgICAgICAgICBpZiAocHJvcHNbcHJvcE5hbWVdID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ1RoZSAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2AgaXMgbWFya2VkIGFzIHJlcXVpcmVkICcgKyAoJ2luIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBidXQgaXRzIHZhbHVlIGlzIGBudWxsYC4nKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignVGhlICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBpcyBtYXJrZWQgYXMgcmVxdWlyZWQgaW4gJyArICgnYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGJ1dCBpdHMgdmFsdWUgaXMgYHVuZGVmaW5lZGAuJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGNoYWluZWRDaGVja1R5cGUgPSBjaGVja1R5cGUuYmluZChudWxsLCBmYWxzZSk7XG4gICAgY2hhaW5lZENoZWNrVHlwZS5pc1JlcXVpcmVkID0gY2hlY2tUeXBlLmJpbmQobnVsbCwgdHJ1ZSk7XG5cbiAgICByZXR1cm4gY2hhaW5lZENoZWNrVHlwZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKGV4cGVjdGVkVHlwZSkge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSwgc2VjcmV0KSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgIGlmIChwcm9wVHlwZSAhPT0gZXhwZWN0ZWRUeXBlKSB7XG4gICAgICAgIC8vIGBwcm9wVmFsdWVgIGJlaW5nIGluc3RhbmNlIG9mLCBzYXksIGRhdGUvcmVnZXhwLCBwYXNzIHRoZSAnb2JqZWN0J1xuICAgICAgICAvLyBjaGVjaywgYnV0IHdlIGNhbiBvZmZlciBhIG1vcmUgcHJlY2lzZSBlcnJvciBtZXNzYWdlIGhlcmUgcmF0aGVyIHRoYW5cbiAgICAgICAgLy8gJ29mIHR5cGUgYG9iamVjdGAnLlxuICAgICAgICB2YXIgcHJlY2lzZVR5cGUgPSBnZXRQcmVjaXNlVHlwZShwcm9wVmFsdWUpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIHByZWNpc2VUeXBlICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkICcpICsgKCdgJyArIGV4cGVjdGVkVHlwZSArICdgLicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlQW55VHlwZUNoZWNrZXIoKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKGVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNOdWxsKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUFycmF5T2ZUeXBlQ2hlY2tlcih0eXBlQ2hlY2tlcikge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgaWYgKHR5cGVvZiB0eXBlQ2hlY2tlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ1Byb3BlcnR5IGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgY29tcG9uZW50IGAnICsgY29tcG9uZW50TmFtZSArICdgIGhhcyBpbnZhbGlkIFByb3BUeXBlIG5vdGF0aW9uIGluc2lkZSBhcnJheU9mLicpO1xuICAgICAgfVxuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShwcm9wVmFsdWUpKSB7XG4gICAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIHByb3BUeXBlICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGFuIGFycmF5LicpKTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcFZhbHVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBlcnJvciA9IHR5cGVDaGVja2VyKHByb3BWYWx1ZSwgaSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSArICdbJyArIGkgKyAnXScsIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlRWxlbWVudFR5cGVDaGVja2VyKCkge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIGlmICghaXNWYWxpZEVsZW1lbnQocHJvcFZhbHVlKSkge1xuICAgICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcm9wVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhIHNpbmdsZSBSZWFjdEVsZW1lbnQuJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVJbnN0YW5jZVR5cGVDaGVja2VyKGV4cGVjdGVkQ2xhc3MpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGlmICghKHByb3BzW3Byb3BOYW1lXSBpbnN0YW5jZW9mIGV4cGVjdGVkQ2xhc3MpKSB7XG4gICAgICAgIHZhciBleHBlY3RlZENsYXNzTmFtZSA9IGV4cGVjdGVkQ2xhc3MubmFtZSB8fCBBTk9OWU1PVVM7XG4gICAgICAgIHZhciBhY3R1YWxDbGFzc05hbWUgPSBnZXRDbGFzc05hbWUocHJvcHNbcHJvcE5hbWVdKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgYWN0dWFsQ2xhc3NOYW1lICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkICcpICsgKCdpbnN0YW5jZSBvZiBgJyArIGV4cGVjdGVkQ2xhc3NOYW1lICsgJ2AuJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVFbnVtVHlwZUNoZWNrZXIoZXhwZWN0ZWRWYWx1ZXMpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZXhwZWN0ZWRWYWx1ZXMpKSB7XG4gICAgICBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICdJbnZhbGlkIGFyZ3VtZW50IHN1cHBsaWVkIHRvIG9uZU9mLCBleHBlY3RlZCBhbiBpbnN0YW5jZSBvZiBhcnJheS4nKSA6IHZvaWQgMDtcbiAgICAgIHJldHVybiBlbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zTnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGV4cGVjdGVkVmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChpcyhwcm9wVmFsdWUsIGV4cGVjdGVkVmFsdWVzW2ldKSkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciB2YWx1ZXNTdHJpbmcgPSBKU09OLnN0cmluZ2lmeShleHBlY3RlZFZhbHVlcyk7XG4gICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHZhbHVlIGAnICsgcHJvcFZhbHVlICsgJ2AgJyArICgnc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIG9uZSBvZiAnICsgdmFsdWVzU3RyaW5nICsgJy4nKSk7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVPYmplY3RPZlR5cGVDaGVja2VyKHR5cGVDaGVja2VyKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBpZiAodHlwZW9mIHR5cGVDaGVja2VyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignUHJvcGVydHkgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiBjb21wb25lbnQgYCcgKyBjb21wb25lbnROYW1lICsgJ2AgaGFzIGludmFsaWQgUHJvcFR5cGUgbm90YXRpb24gaW5zaWRlIG9iamVjdE9mLicpO1xuICAgICAgfVxuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICBpZiAocHJvcFR5cGUgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIHByb3BUeXBlICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGFuIG9iamVjdC4nKSk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBrZXkgaW4gcHJvcFZhbHVlKSB7XG4gICAgICAgIGlmIChwcm9wVmFsdWUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIHZhciBlcnJvciA9IHR5cGVDaGVja2VyKHByb3BWYWx1ZSwga2V5LCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lICsgJy4nICsga2V5LCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlVW5pb25UeXBlQ2hlY2tlcihhcnJheU9mVHlwZUNoZWNrZXJzKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGFycmF5T2ZUeXBlQ2hlY2tlcnMpKSB7XG4gICAgICBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICdJbnZhbGlkIGFyZ3VtZW50IHN1cHBsaWVkIHRvIG9uZU9mVHlwZSwgZXhwZWN0ZWQgYW4gaW5zdGFuY2Ugb2YgYXJyYXkuJykgOiB2b2lkIDA7XG4gICAgICByZXR1cm4gZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc051bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5T2ZUeXBlQ2hlY2tlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNoZWNrZXIgPSBhcnJheU9mVHlwZUNoZWNrZXJzW2ldO1xuICAgICAgICBpZiAoY2hlY2tlcihwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIFJlYWN0UHJvcFR5cGVzU2VjcmV0KSA9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBzdXBwbGllZCB0byAnICsgKCdgJyArIGNvbXBvbmVudE5hbWUgKyAnYC4nKSk7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVOb2RlQ2hlY2tlcigpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGlmICghaXNOb2RlKHByb3BzW3Byb3BOYW1lXSkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBzdXBwbGllZCB0byAnICsgKCdgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYSBSZWFjdE5vZGUuJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVTaGFwZVR5cGVDaGVja2VyKHNoYXBlVHlwZXMpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgaWYgKHByb3BUeXBlICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgYCcgKyBwcm9wVHlwZSArICdgICcgKyAoJ3N1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBgb2JqZWN0YC4nKSk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBrZXkgaW4gc2hhcGVUeXBlcykge1xuICAgICAgICB2YXIgY2hlY2tlciA9IHNoYXBlVHlwZXNba2V5XTtcbiAgICAgICAgaWYgKCFjaGVja2VyKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVycm9yID0gY2hlY2tlcihwcm9wVmFsdWUsIGtleSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSArICcuJyArIGtleSwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNOb2RlKHByb3BWYWx1ZSkge1xuICAgIHN3aXRjaCAodHlwZW9mIHByb3BWYWx1ZSkge1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICByZXR1cm4gIXByb3BWYWx1ZTtcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gcHJvcFZhbHVlLmV2ZXJ5KGlzTm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb3BWYWx1ZSA9PT0gbnVsbCB8fCBpc1ZhbGlkRWxlbWVudChwcm9wVmFsdWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaXRlcmF0b3JGbiA9IGdldEl0ZXJhdG9yRm4ocHJvcFZhbHVlKTtcbiAgICAgICAgaWYgKGl0ZXJhdG9yRm4pIHtcbiAgICAgICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYXRvckZuLmNhbGwocHJvcFZhbHVlKTtcbiAgICAgICAgICB2YXIgc3RlcDtcbiAgICAgICAgICBpZiAoaXRlcmF0b3JGbiAhPT0gcHJvcFZhbHVlLmVudHJpZXMpIHtcbiAgICAgICAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgICAgICAgaWYgKCFpc05vZGUoc3RlcC52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gSXRlcmF0b3Igd2lsbCBwcm92aWRlIGVudHJ5IFtrLHZdIHR1cGxlcyByYXRoZXIgdGhhbiB2YWx1ZXMuXG4gICAgICAgICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgICAgICAgIHZhciBlbnRyeSA9IHN0ZXAudmFsdWU7XG4gICAgICAgICAgICAgIGlmIChlbnRyeSkge1xuICAgICAgICAgICAgICAgIGlmICghaXNOb2RlKGVudHJ5WzFdKSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpc1N5bWJvbChwcm9wVHlwZSwgcHJvcFZhbHVlKSB7XG4gICAgLy8gTmF0aXZlIFN5bWJvbC5cbiAgICBpZiAocHJvcFR5cGUgPT09ICdzeW1ib2wnKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyAxOS40LjMuNSBTeW1ib2wucHJvdG90eXBlW0BAdG9TdHJpbmdUYWddID09PSAnU3ltYm9sJ1xuICAgIGlmIChwcm9wVmFsdWVbJ0BAdG9TdHJpbmdUYWcnXSA9PT0gJ1N5bWJvbCcpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIEZhbGxiYWNrIGZvciBub24tc3BlYyBjb21wbGlhbnQgU3ltYm9scyB3aGljaCBhcmUgcG9seWZpbGxlZC5cbiAgICBpZiAodHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBwcm9wVmFsdWUgaW5zdGFuY2VvZiBTeW1ib2wpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIEVxdWl2YWxlbnQgb2YgYHR5cGVvZmAgYnV0IHdpdGggc3BlY2lhbCBoYW5kbGluZyBmb3IgYXJyYXkgYW5kIHJlZ2V4cC5cbiAgZnVuY3Rpb24gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKSB7XG4gICAgdmFyIHByb3BUeXBlID0gdHlwZW9mIHByb3BWYWx1ZTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShwcm9wVmFsdWUpKSB7XG4gICAgICByZXR1cm4gJ2FycmF5JztcbiAgICB9XG4gICAgaWYgKHByb3BWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgLy8gT2xkIHdlYmtpdHMgKGF0IGxlYXN0IHVudGlsIEFuZHJvaWQgNC4wKSByZXR1cm4gJ2Z1bmN0aW9uJyByYXRoZXIgdGhhblxuICAgICAgLy8gJ29iamVjdCcgZm9yIHR5cGVvZiBhIFJlZ0V4cC4gV2UnbGwgbm9ybWFsaXplIHRoaXMgaGVyZSBzbyB0aGF0IC9ibGEvXG4gICAgICAvLyBwYXNzZXMgUHJvcFR5cGVzLm9iamVjdC5cbiAgICAgIHJldHVybiAnb2JqZWN0JztcbiAgICB9XG4gICAgaWYgKGlzU3ltYm9sKHByb3BUeXBlLCBwcm9wVmFsdWUpKSB7XG4gICAgICByZXR1cm4gJ3N5bWJvbCc7XG4gICAgfVxuICAgIHJldHVybiBwcm9wVHlwZTtcbiAgfVxuXG4gIC8vIFRoaXMgaGFuZGxlcyBtb3JlIHR5cGVzIHRoYW4gYGdldFByb3BUeXBlYC4gT25seSB1c2VkIGZvciBlcnJvciBtZXNzYWdlcy5cbiAgLy8gU2VlIGBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcmAuXG4gIGZ1bmN0aW9uIGdldFByZWNpc2VUeXBlKHByb3BWYWx1ZSkge1xuICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgaWYgKHByb3BUeXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKHByb3BWYWx1ZSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgcmV0dXJuICdkYXRlJztcbiAgICAgIH0gZWxzZSBpZiAocHJvcFZhbHVlIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgIHJldHVybiAncmVnZXhwJztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHByb3BUeXBlO1xuICB9XG5cbiAgLy8gUmV0dXJucyBjbGFzcyBuYW1lIG9mIHRoZSBvYmplY3QsIGlmIGFueS5cbiAgZnVuY3Rpb24gZ2V0Q2xhc3NOYW1lKHByb3BWYWx1ZSkge1xuICAgIGlmICghcHJvcFZhbHVlLmNvbnN0cnVjdG9yIHx8ICFwcm9wVmFsdWUuY29uc3RydWN0b3IubmFtZSkge1xuICAgICAgcmV0dXJuIEFOT05ZTU9VUztcbiAgICB9XG4gICAgcmV0dXJuIHByb3BWYWx1ZS5jb25zdHJ1Y3Rvci5uYW1lO1xuICB9XG5cbiAgUmVhY3RQcm9wVHlwZXMuY2hlY2tQcm9wVHlwZXMgPSBjaGVja1Byb3BUeXBlcztcbiAgUmVhY3RQcm9wVHlwZXMuUHJvcFR5cGVzID0gUmVhY3RQcm9wVHlwZXM7XG5cbiAgcmV0dXJuIFJlYWN0UHJvcFR5cGVzO1xufTtcblxufSx7XCIyN1wiOjI3LFwiMjlcIjoyOSxcIjMwXCI6MzAsXCIzMlwiOjMyLFwiMzVcIjozNX1dLDM1OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcbi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0UHJvcFR5cGVzU2VjcmV0ID0gJ1NFQ1JFVF9ET19OT1RfUEFTU19USElTX09SX1lPVV9XSUxMX0JFX0ZJUkVEJztcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdFByb3BUeXBlc1NlY3JldDtcblxufSx7fV19LHt9LFsxOF0pKDE4KVxufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
