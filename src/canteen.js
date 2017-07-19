(function() {
  // ================================ Constants ================================
  var CONTEXT_2D_ATTRIBUTES = [
    'fillStyle',
    'font',
    'globalAlpha',
    'globalCompositeOperation',
    'lineCap',
    'lineDashOffset',
    'lineJoin',
    'lineWidth',
    'miterLimit',
    'shadowBlur',
    'shadowColor',
    'shadowOffsetX',
    'shadowOffsetY',
    'strokeStyle',
    'textAlign',
    'textBaseline'
  ];

  // ================================ Utils ================================

  function each(arr, func) {
    var len = arr.length,
        n;

    for (n=0; n<len; n++) {
      func(arr[n], n);
    }
  }

  function round(val, decimalPoints) {
    var power = Math.pow(10, decimalPoints);
    return Math.round(val * power) / power; 
  }

  function roundArr(arr, decimalPoints) {
    var len = arr.length,
        ret = [],
        n;

    for (n=0; n<len; n++) {
      if (isNumber(arr[n])) {
        ret.push(round(arr[n], decimalPoints));
      }
      else {
        ret.push(arr[n]);
      }
    }

    return ret;
  }

  function isFunction(func) {
    return func && {}.toString.call(func) === '[object Function]';
  }

  function isNumber(val) {
    return typeof val === 'number';
  }
  
  // ================================ Canteen Class ================================

  /**
   * Canteen Constructor
   * @constructor
   */
  var Canteen = function(context) {
    var that = this;

    this._stack = [];
    this.context = context;

    // add observable attributes
    each(CONTEXT_2D_ATTRIBUTES, function(key, n) {
      Object.defineProperty(that, key, {
        get: function() {
          return that.context[key];
        },
        set: function(val) {
          that._pushAttr(key, val);
          that.context[key] = val;
        }
      }); 
    });
	
	// Proxy readonly canvas property
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/canvas
    Object.defineProperty(that, 'canvas', {
      get: function() {
        return that.context.canvas;
      }
    });
  };

  // Canteen methods 
  Canteen.prototype = { 
    /**
     * get a stack of operations
     * @method stack
     * @param {Object} config
     * @param {String} [config.loose=false] - strict mode returns method calls with arguments and property names 
     *  with values.  loose mode only returns method calls and property names
     * @param {Number} [config.decimalPoints=3] - number of decimal points to round numeric values to.  The default is 
     *  3, i.e. 1.23456 will round to 1.234
     * @returns {Array}
     * @public
     */  
    stack: function(config) {
      var config = config || {},
          loose = config.loose,
          decimalPoints = config.decimalPoints === undefined ? 3 : config.decimalPoints,
          ret = [];

      if (loose) {
        each(this._stack, function(el, n) {
          ret.push(el.method || el.attr);
        });
      } 
      else {
        each(this._stack, function(el, n) {
          // if method instruction
          if (el.method) {
            ret.push({
              method: el.method,
              arguments: roundArr(el.arguments, decimalPoints)
            });
          }
          // if attr
          else if (el.attr) {
            ret.push({
              attr: el.attr,
              val: isNumber(el.val) ? round(el.val, decimalPoints) : el.val
            });
          }
        });
      }

      return ret;
    },
    /**
     * serialize a stack into a string
     * @method json
     * @param {Object} config
     * @param {String} [config.loose=false] - strict mode returns method calls with arguments and property names 
     *  with values.  loose mode only returns method calls and property names
     * @param {Number} [config.decimalPoints=3] - number of decimal points to round numeric values to.  The default is 
     *  3, i.e. 1.23456 will round to 1.234
     * @returns {String}
     * @public
     */  
    json: function(config) {
      return JSON.stringify(this.stack(config));
    },
    /**
     * convert a stack into a small hash string for easy comparisons
     * @method hash
     * @param {Object} config
     * @param {String} [config.loose=false] - strict mode returns method calls with arguments and property names 
     *  with values.  loose mode only returns method calls and property names
     * @param {Number} [config.decimalPoints=3] - number of decimal points to round numeric values to.  The default is 
     *  3, i.e. 1.23456 will round to 1.234
     * @public
     * @returns {String}
     */  
    hash: function(config) {
      return Canteen.md5(this.json(config));
    },
    /**
     * clear the stack
     * @method clear
     * @public
     */  
    clear: function() {
      this._stack = [];
    },
    /**
     * push instruction method onto the stack
     * @method _pushMethod
     * @param {String} method
     * @param {arguments} args
     * @private
     */
    _pushMethod: function(method, args) {
      this._stack.push({
        method: method,
        arguments: Array.prototype.slice.call(args, 0)
      }); 

      // this._slice();
    },
    /**
     * push instruction attribute onto the stack
     * @method _pushAttr
     * @param {String} attr
     * @param {*} val
     * @private
     */
    _pushAttr: function(attr, val) {
      this._stack.push({
        attr: attr,
        val: val
      }); 

      //  this._slice();
    },
    /**
     * slice the stack if needed.  This means making sure that it doesn't exceed
     *  the STACK_SIZE.  if it does, then shorten the stack starting from the beginning
     * @method _slice
     * @private
     */
    _slice: function() {
      var stack = this._stack,
          len = stack.length,
          exceded = len - Canteen.globals.STACK_SIZE;
      if (exceded > 0) {
        this._stack = stack.slice(exceded);
      }
    }
  }; 

  // generate observable methods and add them to the Canteen prototype
  (function(){
    var proto = CanvasRenderingContext2D.prototype,
      key, val, desc;

    function addMethod(key, val) {
      Canteen.prototype[key] = function() {
        this._pushMethod(key, arguments);
        return this.context[key].apply(this.context, arguments);
      };
    }

    for (key in proto) {
	  desc = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, key);
      val = (desc && desc.value ? proto[key] : null);
      if (isFunction(val)) {
        addMethod(key, val);
      }
    }
  })();

  // ================================ Global Config ================================
  /**
   * global config.  You can directly change these values in order to configure Canteen
   * @static
   * @example 
   *  // change stack size to 3000
   *  Canteen.globals.STACK_SIZE = 3000;
   */ 
  Canteen.globals = {
    STACK_SIZE: 10000
  };

  // ================================ Initialization ================================

  // override the canvas context getContext method in order to automatically instantiate
  // a Canteen instance and wrap the native context object
  (function(){
    var origGetContext = HTMLCanvasElement.prototype.getContext;

    HTMLCanvasElement.prototype.getContext = function() {
      var context = origGetContext.apply(this, arguments);

      // if the context already has a canteen instance, then return it
      if (context.canteen) {
        return context.canteen
      }
      // if the context does not have a canteen instance, then instantiate one
      // and return it
      else {
        context.canteen = new Canteen(context);
        return context.canteen;
      }
    }
  })();

  // make the Canteen namespace global so that developers can configure
  // it via Canteen.globals, or override methods if desired
  window.Canteen = Canteen;
})();
