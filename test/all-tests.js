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
});