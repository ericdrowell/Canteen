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
* Filters can be applied to the stack for testing purposes, including a strict vs. loose mode, and instruction ranges

## Examples

```javascript
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
    
context.beginPath();
context.arc(50, 50, 30, 0, Math.PI * 2, false);
context.fillStyle = 'red';
context.fill();

// return a strict array of the instruction stack
var stack = context.stack(); 

// return a strict json string of the instruction stack, i.e. [{"method":"beginPath","arguments":[]},{"method":"arc","arguments":[50,50,30,0,6.283185307179586,false]},{"attr":"fillStyle","val":"red"},{"method":"fill","arguments":[]}] 
var json = context.json();

// return a strict md5 hash of the instruction stack, i.e. "593812a5c4abaae60c567bf96e59631d"
var hash = context.hash();

// return a loose array of the instruction stack
var stack = context.stack({
  type: 'loose'
}); 

// return a loose json string of the instruction stack, i.e. ["beginPath","arc","fillStyle","fill"]
var json = context.json({
  type: 'loose'
}); 

// return a loose md5 hash of the instruction stack, i.e. "7f2734b2c8027e5f8a1429e83361cb5c"
var hash = context.hash({
  type: 'loose'
}); 

// example unit test assertion
assert.equal(context.hash(), '6d09e269a28763a02f82c532675da8c8'); // test passes
```
  
  
