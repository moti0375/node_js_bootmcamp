const fs = require("fs");
const server = require("http").createServer();

server.on("request", (req, res) => {
  // Solutions 1 - Reading entire file
  //   const file = fs.readFile("./test-file.txt", (err, data) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       //   console.log(`${data}`);
  //       res.end(data);
  //     }
  //   });
  //Solution 2 - Streams
  const readable = fs.createReadStream("./testfile.txt");
  //   readable.on("data", chunk => {
  //     res.write(chunk);
  //   });

  //   readable.on("end", () => {
  //     console.log("Data end");
  //     res.end();
  //   });

  //Solution 3 - Streams with backpressure (Pipe)
  //readable - a readable stream, res - a writable stream  pipe = connect a readable stream to writeable stream =
  readable.pipe(res, err => {
    res.statusCode = 500;
    res.end("File not found");
  });

  readable.on("error", err => {
    console.log("There was an error: ", err);
    res.statusCode = 500;
    res.end("File not found");
  });
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server is listening to requests");
});
