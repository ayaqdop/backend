const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const bodyParser = require("body-parser");
const morgan = require("morgan");
const uuidv4 = require('uuid/v4');

app.use(morgan("dev"));
app.use(bodyParser.json());

app.get('/game/:name', (req, res, next) => {
  res.end('Hi ' + req.params.name +'!');
});

io.on('connection', socket => {
  socket.on("server", msg => {
    console.log("Serving messages: " + msg);
    io.emit("client", msg);
  });

  socket.on("uuid", () => {
    const id = uuidv4();
    console.log("Asking for uuid. Here it is: " + id);
    io.emit("generateUuid", id);
  });
});

server.listen(process.env.PORT || 8080);
