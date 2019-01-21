const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const bodyParser = require("body-parser");
const morgan = require("morgan");
const uuidv4 = require("uuid/v4");
const users = require("./routes/users.js");

const gamers = [];

app.use(morgan("dev"));
app.use(bodyParser.json());

app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.set("Access-Control-Allow-Origin", origin);
  res.set({
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Methods": "POST",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  });
  res.type("json");
  res.status(200);
  next();
});

app.use(users);

app.post("/uuid", (req, res) => {
  console.log(JSON.stringify(req.body));
  const id = uuidv4();
  res.cookie("uuid", id);
  res.send();
});

app.post("/init", (req, res) => {
  const gameObjects = {
    teams: [
      {
        name: "Barcelona",
        players: [
          { number: 1, position: [1, 8] },
          { number: 18, position: [6, 3] },
          { number: 23, position: [4, 6] },
          { number: 3, position: [4, 11] },
          { number: 20, position: [6, 14] },
          { number: 8, position: [10, 5] },
          { number: 5, position: [8, 8] },
          { number: 4, position: [10, 12] },
          { number: 14, position: [12, 4] },
          { number: 10, position: [12, 13] },
          { number: 9, position: [12, 8] }
        ]
      },
      {
        name: "Bayern",
        players: [
          { number: 1, position: [24, 9] },
          { number: 32, position: [19, 3] },
          { number: 5, position: [22, 7] },
          { number: 17, position: [22, 10] },
          { number: 27, position: [19, 14] },
          { number: 25, position: [16, 4] },
          { number: 6, position: [18, 9] },
          { number: 11, position: [16, 13] },
          { number: 10, position: [13, 14] },
          { number: 7, position: [13, 3] },
          { number: 9, position: [15, 8] }
        ]
      }
    ]
  };
  gameObjects.ball = {
    position: [12, 9]
  };
  gameObjects.teams.forEach(t => {
    t.score = 0;
    t.moves = 0;
    t.players.forEach(p => (p.moves = 0));
  });

  res.json(gameObjects);
});

io.on("connection", socket => {
  socket.on("new gamer", msg => {
    const user = JSON.stringify(msg);
    console.log(`New gamer ${user} joined`);
    socket.gamer = user;
    gamers.push(user);
  });

  socket.on("server", msg => {
    console.log(`Serving messages: ${msg}`);
    io.emit("client", msg);
  });

  socket.on("disconnect", msg => {
    console.log(`${socket.gamer} left us`);
    gamers.splice(gamers.indexOf(msg), 1);
  });
});

server.listen(process.env.PORT || 8080);
