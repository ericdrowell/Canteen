mocha.ui('tdd');
mocha.setup('bdd');
var assert = chai.assert;

beforeEach(function() {
  var canvas = document.createElement('canvas'),
      context = canvas.getContext('2d');

  canvas.width = 600;
  canvas.height = 100;

  this.currentTest.canvas = canvas;
  this.currentTest.context = context;
});

afterEach(function() {
  var test = this.currentTest,
      testElements = document.getElementsByClassName('test'),
      len = testElements.length,
      testElement = testElements[len-1],
      p;

  testElement.appendChild(test.canvas);

  p = document.createElement('p');
  p.innerHTML = '<strong>strict JSON:</strong> ' + test.context.json();
  testElement.appendChild(p);

  p = document.createElement('p');
  p.innerHTML = '<strong>strict hash:</strong> ' + test.context.hash();
  testElement.appendChild(p);

  p = document.createElement('p');
  p.innerHTML = '<strong>loose JSON:</strong> ' + test.context.json({type: 'loose'});
  testElement.appendChild(p);

  p = document.createElement('p');
  p.innerHTML = '<strong>loose hash:</strong> ' + test.context.hash({type: 'loose'});
  testElement.appendChild(p);


  // console.log('%c' + test.title, 'background-color: #ddd');
  // console.log('strict JSON: ', test.context.json());
  // console.log('strict hash: ', test.context.hash());
  // console.log('loose JSON: ', test.context.json({type: 'loose'}));
  // console.log('loose hash: ', test.context.hash({type: 'loose'}));
});