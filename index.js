const express = require("express");
const fs = require("fs").promises;
const bodyparser = require("body-parser");
const app = express();
const port = 5000;

const bands = "./data/bands.json";
const users = "./data/users.json";
const newUsers = "./data/newusers.json";

app.listen(port, () => {
  console.log(`The server is listening on port: ${port}`);
});

// body-parser middleware
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.use(express.json());

// Get Methods
app.get("/", (req, res) => {
  res.send("Welcome to the fantastic bands database homepage!");
});

app.get("/api/users", async (req, res) => {
  const sendThisUnparsed = await fs.readFile(users);
  const sendThis = JSON.parse(sendThisUnparsed);
  // console.log(typeof sendThis);
  res.send(sendThis);
});

app.get("/api/bands", async (req, res) => {
  const sendThisUnparsed = await fs.readFile(bands);
  const sendThis = JSON.parse(sendThisUnparsed);
  res.send(sendThis);
});

app.get("/api/bands/:bandName", async (req, res) => {
  const bandsUnparsed = await fs.readFile(bands);
  const bandsData = JSON.parse(bandsUnparsed);
  console.log(typeof bandsData);
  const requestedBand = bandsData.find(
    (band) => band.bandName.toLowerCase() == req.params.bandName.toLowerCase()
  );
  res.send(requestedBand);
});

app.get("/api/bands/:bandName/discography/:albumName", async (req, res) => {
  const bandsUnparsed = await fs.readFile(bands);
  const bandsData = JSON.parse(bandsUnparsed);
  const requestedBand = bandsData.find(
    (band) => band.bandName.toLowerCase() == req.params.bandName.toLowerCase()
  );
  const requestedAlbum = requestedBand.discography.find(
    (album) =>
      album.albumName.toLowerCase() == req.params.albumName.toLowerCase()
  );
  res.send(requestedAlbum);
});

app.get("/api/bands/:bandName/discography", async (req, res) => {
  const bandsUnparsed = await fs.readFile(bands);
  const bandsData = JSON.parse(bandsUnparsed);
  const requestedBand = bandsData.find(
    (band) => band.bandName.toLowerCase() == req.params.bandName.toLowerCase()
  );
  res.send(requestedBand.discography);
});

app.get("/api/newusers", async (req, res) => {
  const newUsersUnparsed = await fs.readFile(newUsers);
  const newUsersData = await JSON.parse(newUsersUnparsed);
  res.send(newUsersData);
});

// New user methods, includes post and delete

app
  .route("/api/newusers/:userID")
  .get(async (req, res) => {
    const newUsersUnparsed = await fs.readFile(newUsers);
    const newUsersData = JSON.parse(newUsersUnparsed);
    const requestedNewUser = newUsersData.find(
      (newUser) => newUser.id == req.params.userID
    );
    console.log(requestedNewUser);
    res.json(requestedNewUser);
  })
  .post(async (req, res) => {
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
      const newUsersUnparsed = await fs.readFile(newUsers);
      const newUsersData = await JSON.parse(newUsersUnparsed);
      const userToRegister = {
        id: newUsers.length + 1,
        fname: req.body.fname,
        lname: req.body.lname,
        age: req.body.age,
        username: req.body.username,
        email: req.body.email,
      };
      console.log(typeof newUsersData, newUsersData);
      newUsersData.push(userToRegister);
      const newUsersDataString = JSON.stringify(newUsersData, null, 2);
      // console.log(newUsersData);
      await fs.writeFile("./data/newusers.json", newUsersDataString);
      res.json(newUsers[newUsers.length - 1]);
    }
  })
  .delete(async (req, res) => {
    // console.log(typeof req.params.userID);
    // console.log(newUsers);
    const newUsersUnparsed = await fs.readFile(newUsers);
    const newUsersData = await JSON.parse(newUsersUnparsed);

    // console.log(newUsersData, " :this is the newUsersData type before push");

    // console.log(typeof Number(req.params.userID), "params type");
    // console.log(newUsersArray, " :this is the array type after push");
    const userToDelete = newUsersData.find((newUser) => {
      // console.log(
      //   `here is new userID: ${newUser}. Here is user id: ${newUser.id}`
      // );
      newUser.id == Number(req.params.userID);
    });
    console.log(typeof userToDelete, "this is the type of user to delete");
    const indexToDelete = newUsersData.indexOf(userToDelete);
    deletedUser = newUsersData.splice(indexToDelete, 1);
    // console.log(deletedUser);
  });
