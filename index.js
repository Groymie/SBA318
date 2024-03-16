const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const port = 5000;

const bands = require("./data/bands.js");
const users = require("./data/users.js");
const newUsers = require("./data/newusers.js");

app.listen(port, () => {
  console.log(`The server is listening on port: ${port}`);
});

// body-parser middleware
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

// Get Methods
app.get("/", (req, res) => {
  res.send("Welcome to the fantastic bands database homepage!");
});

app.get("/api/users", (req, res) => {
  res.json(users);
});

app.get("/api/bands", (req, res) => {
  res.json(bands);
});

app.get("/api/bands/:bandName", (req, res) => {
  const requestedBand = bands.find(
    (band) => band.bandName.toLowerCase() == req.params.bandName.toLowerCase()
  );
  res.json(requestedBand);
});

app.get("/api/bands/:bandName/discography/:albumName", (req, res) => {
  const requestedBand = bands.find(
    (band) => band.bandName.toLowerCase() == req.params.bandName.toLowerCase()
  );
  const requestedAlbum = requestedBand.discography.find(
    (album) =>
      album.albumName.toLowerCase() == req.params.albumName.toLowerCase()
  );
  res.json(requestedAlbum);
});

app.get("/api/bands/:bandName/discography", (req, res) => {
  const requestedBand = bands.find(
    (band) => band.bandName.toLowerCase() == req.params.bandName.toLowerCase()
  );
  res.json(requestedBand.discography);
});

// New user methods, includes post and delete

app
  .route("/api/newusers/:userID")
  .get((req, res) => {
    const requestedNewUser = newUsers.find(
      (newUser) => newUser.userID == req.params.userID
    );
    res.json(requestedNewUser);
  })
  .post((req, res) => {
    if (
      !req.body.fname ||
      !req.body.lname ||
      !req.body.age ||
      !req.body.username ||
      !req.body.email
    ) {
      res
        .status(400)
        .send("Must provide all required information to register a new user");
    } else {
      const userToRegister = {
        id: newUsers.length + 1,
        fname: req.body.fname,
        lname: req.body.lname,
        age: req.body.age,
        username: req.body.username,
        email: req.body.email,
      };
      newUsers.push(userToRegister);
      res.json(newUsers[newUsers.length - 1]);
    }
  });
// .delete((req, res, next) => {
//   const userToDelete = newUsers.findIndex((newUser) => {
//     newUser.userID == req.params.userID;
//   });
//   newUsers.splice(userToDelete, 1);
//   return true;
// });
