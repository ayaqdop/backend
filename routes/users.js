const router = require("express").Router();
const { MongoClient } = require("mongodb");
const CryptoJS = require("crypto-js");

const dbUrl = require("../secrets.js");

router.post("/users/create", (req, res) => {
  MongoClient.connect(
    dbUrl,
    { useNewUrlParser: true }
  )
    .then(
      client => {
        const db = client.db("ayaqdop");
        const coll = db.collection("users");
        const pass = CryptoJS.SHA256(req.body.password).toString(
          CryptoJS.enc.Base64
        );
        console.log(pass);
        coll.insertOne({
          name: req.body.username,
          password: pass
        });
      },
      err => res.status(500).send(err)
    )
    .catch(err => res.status(500).send(err))
    .then(() => res.sendStatus(200));
});

router.post("/users/check", (req, res) => {
  MongoClient.connect(
    dbUrl,
    { useNewUrlParser: true }
  ).then(
    client => {
      const db = client.db("ayaqdop");
      const coll = db.collection("users");
      const pass = CryptoJS.SHA256(req.body.password).toString(
        CryptoJS.enc.Base64
      );
      console.log(pass);
      coll
        .findOne({
          name: req.body.username,
          password: pass
        })
        .then(user => res.status(200).send(user.name));
    },
    err => res.status(500).send(err)
  );
});

module.exports = router;
