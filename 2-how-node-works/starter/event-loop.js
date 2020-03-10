const fs = require("fs");
const crypto = require("crypto");

const start = Date.now();
process.env.UV_THREADPOOL_SIZE = 4;

setTimeout(() => {
  console.log("Timer 1 finish");
}, 0);
setImmediate(() => {
  console.log("Immediate 1 finish");
});

fs.readFile("./test-file.txt", () => {
  console.log("I/O finish");
  console.log("---------------");

  setTimeout(() => {
    console.log("Timer 2 finish");
  }, 0);

  setTimeout(() => {
    console.log("Timer 3 finish");
  }, 3000);
  setImmediate(() => {
    console.log("Immediate 2 finish");
  });

  process.nextTick(() => {
    console.log("Next tick");
  });

  crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512");
  console.log(Date.now() - start, "Passowrd encrypted sync");

  crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512");
  console.log(Date.now() - start, "Passowrd encrypted sync");

  crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512");
  console.log(Date.now() - start, "Passowrd encrypted sync");

  crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512");
  console.log(Date.now() - start, "Passowrd encrypted sync");
});

console.log("Hello from top level code");
