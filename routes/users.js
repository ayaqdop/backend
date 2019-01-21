const router = require("express").Router();
const { MongoClient } = require("mongodb");

const dbUrl = require("../secrets.js");

router.route("/users").post((req, res) => {
  MongoClient.connect(
    dbUrl,
    { useNewUrlParser: true }
  )
    .then(client => {
      const db = client.db("ayaqdop");
      const coll = db.collection("users");
      coll.insertOne({
        name: req.body.username,
        password: req.body.password
      });
    })
    .then(() => res.sendStatus(200))
    .catch(err => res.status(500).send(err));
});

module.exports = router;
