# munkey

```JavaScript
var µ = require("munkey");

/**
 * Simple Object with a straightforward 'add' method
 */
var original = {
  add: function (x, y) {
    return x + y;
  }
};
console.log(original.add(1.3, 1.4)); // 2.7

/**
 * Mutated version that floors both arguments before applying the original 'add'
 */
var floorArgs = µ(original).before("add", function (x, y) {
  // Return an array which content will be passed as arguments to the original
  return [Math.floor(x), Math.floor(y)];
});
console.log(floorArgs.add(1.3, 1.4)); // 2

/**
 * Mutated version that rounds the result of the original 'add'
 */
var roundResult = µ(original).after("add", function (result) {
  return Math.round(result);
});
console.log(roundResult.add(1.3, 1.4)); // 3

/**
 * Mutated version that subtracts instead of adding
 */
var subtract = µ(original).insteadOf("add", function (x, y) {
  return x - y;
});
console.log(subtract.add(1, 1)); // 0

/**
 * Mutated version for tracing (won't work in strict mode)
 */
 var tracer = µ(original).intercept("add", function interceptor (method, original, args, self) {
  var result = original.apply(self, args);
  console.log("'add' was called from", method.caller.name);
  console.log("arguments: (", args[0], ",", args[1], ")");
  return result;
 });
 (function main () {
  console.log(tracer.add(1, 2));  // 'add' was called from main
                                  // arguments: ( 1 , 2 )
                                  // 3
 }());
```