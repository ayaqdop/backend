const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());

app.get('/game/:name', (req, res, next) => {
  res.end('Hi ' + req.params.name +'!');
});

const hostname = "localhost";
const port = 3000;
const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});