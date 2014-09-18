var PI2 = Math.PI * 2;

describe('#main', function(){
  it('should capture instructions for a simple circle', function(){
    var context = this.test.context;

    context.beginPath();
    context.arc(50, 50, 30, 0, PI2, false);
    context.fillStyle = 'red';
    context.fill();

    assert.equal(context.canteen.hash(), '8fdebdf8ddc19b5c75ea9d2e402aebc7');
  });

  it('should capture instructions for a simple rectangle', function(){
    var context = this.test.context;

    context.beginPath();
    context.rect(10, 10, 100, 80, PI2, false);
    context.fillStyle = 'red';
    context.fill();

    assert.equal(context.canteen.hash(), 'e8320dcfb249196972ad1d403e22de9e');
  });

  it('should shorten the stack if it gets too large', function(){
    var context = this.test.context,
        origStackSize = Canteen.globals.STACK_SIZE;

    Canteen.globals.STACK_SIZE = 3;

    assert.equal(context.canteen.getStack().length, 0);

    context.beginPath();
    assert.equal(context.canteen.getStack().length, 1);

    context.closePath();
    assert.equal(context.canteen.getStack().length, 2);

    context.beginPath();
    assert.equal(context.canteen.getStack().length, 3);
    assert.equal(context.canteen.serialize(), '[{"method":"beginPath","arguments":[]},{"method":"closePath","arguments":[]},{"method":"beginPath","arguments":[]}]');

  
    // because the stack size is set to 3, pushing a new element on the stack
    // should result in the removal of the first item, therefore keeping the
    // stack at size 3
    context.closePath();
    assert.equal(context.canteen.getStack().length, 3);
    assert.equal(context.canteen.serialize(), '[{"method":"closePath","arguments":[]},{"method":"beginPath","arguments":[]},{"method":"closePath","arguments":[]}]');

    // put the stack size back to the default for future tests
    Canteen.globals.STACK_SIZE = origStackSize;
  });
});