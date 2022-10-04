```
 ____                     __                            
/\  _`\                  /\ \__                         
\ \ \/\_\     __      ___\ \ ,_\    __     __    ___    
 \ \ \/_/_  /'__`\  /' _ `\ \ \/  /'__`\ /'__`\/' _ `\  
  \ \ \L\ \/\ \L\.\_/\ \/\ \ \ \_/\  __//\  __//\ \/\ \ 
   \ \____/\ \__/.\_\ \_\ \_\ \__\ \____\ \____\ \_\ \_\
    \/___/  \/__/\/_/\/_/\/_/\/__/\/____/\/____/\/_/\/_/
  ```
  
## Overview

Canteen is an open source JavaScript library which makes it super easy to test canvas outputs in a cross browser, and cross browser version way.  The name "Canteen" is obtained by shortening the phrase "Canvas in Test Environments".

## Features

* All drawing instructions are recorded as a stack data structure, including method calls and attribute changes
* Developers can access the stack via context.stack(), context.json(), or context.hash()
* Developers can capture instructions in a strict mode or loose mode.  Strict mode captures method calls and arguments, as well as property changes and values.  Loose mode only captures method calls and property changes.  Use strict mode if you care about the arguments and values, and use loose mode if you just care about the sequence of drawing instructions.
* Developers can round numeric values from method parameters or property values by setting the decimalPoints property to a number like 2, 1, or 0.  A value of 0 means that all numeric values are rounded to the nearest integer

## Examples

```html
<script src="canteen.min.js"></script>
```

```javascript
var canvas = document.getElementById('canvas');
// when getContext() is called, Canteen automatically instantiates
// and returns a Canteen canvas context wrapper
var context = canvas.getContext('2d');
    
// draw stuff
context.beginPath();
context.arc(50, 50, 30, 0, Math.PI * 2, false);
context.fillStyle = 'red';
context.fill();

// return a strict array of the instruction stack
var stack = context.stack(); 

// return a strict json string of the instruction stack, i.e. [{"method":"beginPath","arguments":[]},{"method":"arc","arguments":[50,50,30,0,6.283,false]},{"attr":"fillStyle","val":"red"},{"method":"fill","arguments":[]}] 
var json = context.json();

// return a strict md5 hash of the instruction stack, i.e. "ae4a4d42eb0d3701ab31125bf2cb2ba8"
var hash = context.hash();

// return a loose array of the instruction stack
var stack = context.stack({
  loose: true
}); 

// return a loose json string of the instruction stack, i.e. ["beginPath","arc","fillStyle","fill"]
var json = context.json({
  loose: true
}); 

// return a loose md5 hash of the instruction stack, i.e. "7f2734b2c8027e5f8a1429e83361cb5c"
var hash = context.hash({
  loose: true
}); 

// return json string of the instruction stack with numeric values rounded to 2 decimal points (the default is 3)
var json = context.json({
  decimalPoints: 2
}); 

// return json string of the instruction stack with numeric values rounded to integers
var json = context.json({
  decimalPoints: 0
}); 

// example unit test assertion
assert.equal(context.hash(), 'ae4a4d42eb0d3701ab31125bf2cb2ba8'); // test passes

// clear the stack
context.clear();
```
 // hacktoberfest 2022 
  
