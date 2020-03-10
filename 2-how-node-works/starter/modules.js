// console.log(arguments);
// console.log(require("module").wrapper);

//module.exports
const C = require("./test-module-1");

const calc = new C();
const a = 5;
const b = 10;

console.log(`${calc.add(a, b)}`);
console.log(`${calc.multiply(a, b)}`);

//exports
const c = require("./test-modules-2");
const { add, multiply, divide } = require("./test-modules-2");

console.log(`${c.add(a, a)}`);
console.log(`${c.multiply(a, a)}`);
console.log(`${c.divide(6, 2)}`);

//execute by variable
console.log(`${add(45, 1)}`);
console.log(`${multiply(34, 5)}`);

//chaching
require("./test-modules-3")();
require("./test-modules-3")();
require("./test-modules-3")();
