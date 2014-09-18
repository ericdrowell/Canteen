;(function() {
  // ================================ Canteen Class ================================

  /**
   * Canteen Constructor
   */
  Canteen = function() {
    this.stack = {
      strict: [],
      loose: []
    };
  };

  // Canteen methods
  Canteen.prototype = {
    /**
     * push instruction onto the stacks
     */
    pushMethod: function(method, arguments) {
      this.stack.strict.push({
        method: method,
        arguments: Array.prototype.slice.call(arguments, 0)
      }); 
    },    
    /**
     * serialize a stack into a string
     */
    serialize: function(type) {
      return JSON.stringify(this.stack[type || 'strict']);
    },
    /**
     * convert a stack into a small hash string for easy comparisons
     */
    hash: function(type) {

    }
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