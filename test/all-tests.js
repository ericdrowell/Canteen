var PI2 = Math.PI * 2;

describe('#main', function(){
  it('should capture instructions for simple circle', function(){
    var context = this.test.context;

    context.beginPath();
    context.arc(50, 50, 30, 0, PI2, false);
    context.fillStyle = 'red';
    context.fill();

    // test strict serialization
    assert.equal(context.canteen.serialize(), '[{"method":"beginPath","arguments":[]},{"method":"arc","arguments":[50,50,30,0,6.283185307179586,false]},{"method":"fill","arguments":[]}]');
  });

  it('should capture instructions for simple rectangle', function(){
    var context = this.test.context;

    context.beginPath();
    context.rect(10, 10, 100, 80, PI2, false);
    context.fillStyle = 'red';
    context.fill();

    // test strict serialization
    assert.equal(context.canteen.serialize(), '[{"method":"beginPath","arguments":[]},{"method":"rect","arguments":[10,10,100,80,6.283185307179586,false]},{"method":"fill","arguments":[]}]');
  });
});