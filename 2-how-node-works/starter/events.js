const EventEmitter = require("events");
const http = require("http");

class Sales extends EventEmitter {
  constructor() {
    super();
  }
}

const emitter = new Sales();

emitter.on("newSale", () => {
  console.log("on: newSale");
});

emitter.on("newSale", () => {
  console.log("on: listener2 newSale");
});

emitter.on("newSale", stack => {
  console.log("on: new sale, there are " + stack + " elements in the stack");
});
emitter.emit("newSale", 9);

////////////////////////////////////////////////////////////////

const server = http.createServer();
server.on("request", (req, res) => {
  console.log(req.url);
  console.log("on: request: ");
  res.end("Request recieved");
});

server.on("request", (req, res) => {
  console.log("Another requset: ");
});

server.on("close", (req, res) => {
  res.end("Server closed");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("waiting for request");
});
