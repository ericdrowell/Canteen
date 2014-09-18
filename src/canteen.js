;(function() {
  // ================================ Utils ================================
  function each(arr, func) {
    var len = arr.length,
        n;

    for (n=0; n<len; n++) {
      func(n, arr[n]);
    }
  }

  // ================================ Canteen Class ================================

  /**
   * Canteen Constructor
   */
  Canteen = function() {
    this.stack = [];
  };

  // Canteen methods
  Canteen.prototype = {
    /**
     * push instruction onto the stacks
     */
    pushMethod: function(method, arguments) {
      this.stack.push({
        method: method,
        arguments: Array.prototype.slice.call(arguments, 0)
      }); 
    },
    /**
     * get a stack of operations
     */    
    getStack: function(type) {
      var ret = [];

      if (!type || type === 'strict') {
        ret = this.stack;
      }
      else {
        each(this.stack, function(n, el) {
          ret.push(el.method);
        });
      }

      return ret;
    },
    /**
     * serialize a stack into a string
     */
    serialize: function(type) {
      return JSON.stringify(this.getStack(type));
    },
    /**
     * convert a stack into a small hash string for easy comparisons
     */
    hash: function(type) {
      return Canteen.md5(this.serialize(type));
    }
  };

  // ================================ Global Config ================================

  Canteen.globals = {
    STACK_SIZE: 100
  };

  // ================================ Initialization Scripts ================================

  function observeCanvasMethods() {
    var origCanvasMethods = {
      getContext: HTMLCanvasElement.prototype.getContext
    };

    HTMLCanvasElement.prototype.getContext = function() {
      var ret = origCanvasMethods.getContext.apply(this, arguments);
      // attach Canteen observer to canvas element
      this.canteen = new Canteen();
      // attach Conteen observer to context object
      ret.canteen = new Canteen();
      return ret;
    }
  }

  function observe(key, method) {
    CanvasRenderingContext2D.prototype[key] = function() {
      var ret = method.apply(this, arguments);
      this.canteen.pushMethod(key, arguments);
      return ret;
    }
  }

  function observe2dContextMethods() {
    var proto = CanvasRenderingContext2D.prototype,
        orig2dContextMethods = {}, key;
    // store original methods
    for (key in proto) {
      orig2dContextMethods[key] = proto[key];
    }
    // override methods
    for (key in orig2dContextMethods) {
      observe(key, orig2dContextMethods[key]);
    }
  }

  observeCanvasMethods();
  observe2dContextMethods();
})();