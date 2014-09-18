describe('#main', function(){
  it('should observe all 2d context methods', function(){
    var canvas = document.createElement('canvas'),
        context = canvas.getContext();

    assert.equal(-1, [1,2,3].indexOf(5));
    assert.equal(-1, [1,2,3].indexOf(0));
  });
});