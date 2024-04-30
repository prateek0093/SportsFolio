const express = require("express");
const mongoose = require("mongoose");
const app = express();
const { connectMongodB } = require("./connection");
const cors = require("cors");
const user = require("./models/index");
const host = require("./models/registration");
const team = require("./models/player.host");

const playerMate = require("./models/player.mate");
const update = require("./models/news");

connectMongodB("mongodb://127.0.0.1:27017/SportsFolio")
  .then(() => console.log("MongodB connected !!!"))
  .catch((err) => console.log("Error Occured", err));
app.use(express.urlencoded({ extended: false })); // middleware ---> form ka data bhi support karenge
app.use(express.json());
app.use(cors());
const PORT = 8000;
app.get("/", cors(), (req, res) => {});
app.post("/signup", async (req, res) => {
  const details = req.body.formValues;
  const check = await user.findOne({ username: details.username });
  if (!check) {
    await user.create({
      fullname: details.fullname,
      username: details.username,
      email: details.email,
      password: details.password,
    });
    res.json("Username is unique");
  } else {
    res.json("Username Exist");
  }
});
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const check = await user.find({ username: username });
  console.log(check[0].password);
  if (check) {
    if (password == check[0].password) {
      res.json({
        status: true,
        message: "Login Successfully",
        check,
      });
    }
  } else {
    res.json("Bad");
  }
});

app.post("/landingpage/registration", async (req, res, next) => {
  try {
    const {
      userId,
      name,
      sport,
      email,
      participants,
      tageline,
      venue,
      application_open,
      application_close,
      sportsthon_open,
      sportsthon_close,
    } = req.body;
    if (
      [
        userId,
        name,
        sport,
        email,
        participants,
        tageline,
        venue,
        application_open,
        application_close,
        sportsthon_close,
        sportsthon_open,
      ].some((parameters) => parameters?.trim() === "")
    ) {
      throw new Error("All fields are required");
    }
    const data = {
      admin: userId,
      name: name,
      sport: sport,
      email: email,
      participants: participants,
      tageline: tageline,
      venue: venue,
      application_open: application_open,
      application_close: application_close,
      sportsthon_open: sportsthon_open,
      sportsthon_close: sportsthon_close,
    };
    const organizer = await host.create(data);
    console.log(organizer);
    const tournament = await host.findById(organizer._id);
    res.json({
      status: true,
      message: "exist",
      data: tournament,
    });
  } catch (err) {
    next(err);
  }
});
app.put("/landingpage/registration", async (req, res, next) => {
  try {
    const {
      id,
      userId,
      name,
      sport,
      email,
      participants,
      tageline,
      venue,
      application_open,
      application_close,
      sportsthon_open,
      sportsthon_close,
    } = req.body;
    if (
      !id ||
      !userId ||
      !name ||
      !sport ||
      !email ||
      !participants ||
      !tageline ||
      !venue ||
      !application_open ||
      !application_close ||
      !sportsthon_open ||
      !sportsthon_close
    ) {
      throw new Error("All fields are required");
    }
    const updatedData = {
      admin: userId,
      name: name,
      sport: sport,
      email: email,
      participants: participants,
      tageline: tageline,
      venue: venue,
      application_open: application_open,
      application_close: application_close,
      sportsthon_open: sportsthon_open,
      sportsthon_close: sportsthon_close,
    };

    // Update the document using findByIdAndUpdate
    const organizer = await host.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    const news = await update.create({
      news: name,
      message: "Updated",
    });

    // Check if the document was updated successfully
    if (!organizer) {
      throw new Error("Event not found");
    }

    // Send response with updated document
    res.json({
      status: true,
      message: "exist",
      data: organizer,
    });
  } catch (err) {
    next(err);
  }
});
app.post("/landingpage/HostCard", async (req, res) => {
  try {
    const card = await host.find();
    res.status(200).json({
      status: true,
      data: card,
      message: "Fetched All Events",
    });
  } catch (e) {
    console.log(e);
  }
});
app.post("/landingpage/HostCard/d", async (req, res) => {
  const id = req.body.id;
  const events = await team.find({ eventJoined });
});
app.post("/landingpage/Host", async (req, res) => {
  try {
    console.log(req.body);
    const { username, password } = req.body;
    const User = await user.findOne({ username });
    console.log(username, User);
    if (!User) {
      res.send("error user not found").status(401);
      return;
    }
    const id = User._id.toString();
    const events = await host.find({ admin: id });
    res.status(200).json({
      status: true,
      data: events,
      message: "Fetched All host's event",
    });
  } catch (err) {
    console.log(err);
  }
});
app.delete("/landingpage/Host", async (req, res) => {
  try {
    const id = req.body.id;
    const _id = id.toString();
    const event = await host.findByIdAndDelete(_id);
    const news = await update.create({
      news: event.name,
      message: "delete",
    });
    res.status(200).json({
      status: true,
      message: "Deleted the event",
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/landingpage/details", async (req, res) => {
  try {
    const id = req.body.data.id;
    const _id = id.toString();
    const find = await host.findById(_id);
    res.status(200).json({
      status: true,
      data: find,
      message: "Giving details about event",
    });
  } catch (err) {
    console.log(err);
  }
});
app.post("/details/join", async (req, res) => {
  try {
    const userId = req.body.userId;
    const id = req.body.data.id;
    const teamname = req.body.team;
    const name = req.body.name;
    const size = req.body.size;
    const phone = req.body.phone;
    if (
      [userId, id, teamname, name, size, phone].some(
        (parameters) => parameters?.trim() === ""
      )
    ) {
      throw new Error("All fields are required");
    }
    const data = {
      createdBy: userId,
      eventJoined: id,
      playerName: name,
      teamName: teamname,
      squadSize: size,
      phoneNo: phone,
    };
    const captain = await team.create(data);
    const joined = await team.findById(captain._id);
    res.status(200).json({
      status: true,
      data: joined,
      message: "Captain created",
    });
  } catch (err) {
    console.log(err);
  }
});
app.post("/details/join/team", async (req, res) => {
  try {
    const id = req.body.data.id;
    const teamname = req.body.team;
    const size = req.body.name;
    const phone = req.body.phone;
    if (
      [id, teamname, size, phone].some(
        (parameters) => parameters?.trim() === ""
      )
    ) {
      throw new Error("All fields are required");
    }
    const data = {
      eventJoined: id,
      playerName: size,
      teamName: teamname,
      phoneNo: phone,
    };
    const document = await team.findOne({ teamName: teamname });
    if (document) {
      const captain = await playerMate.create(data);
      const joined = await playerMate.findById(captain._id);
      res.status(200).json({
        status: true,
        data: joined,
        message: "Captain created",
      });
    } else {
      res.status(200).json({
        status: false,
      });
    }
  } catch (err) {
    console.log(err);
  }
});
app.post("/details/join/team/o", async (req, res) => {
  const userId = req.body.data.id;
  try {
    const document = await team.find({
      createdBy: userId,
    });
    console.log(document);
    const name = document[0].teamName;

    const joined = await playerMate.find({ teamName: name });
    if (joined) {
      res.status(200).json({
        status: true,
        data: joined,
        cap: document[0],
        message: "faila do",
      });
    } else {
      res.status(200).json({
        status: false,
      });
    }
  } catch (err) {
    console.log(err);
  }
});
app.post("/pastTeams", async (req, res) => {
  const id = req.body.data.id;
  const userId = req.body.userId;
  try {
    const document = await team.findOne({ createdBy: userId, eventJoined: id });
    if (document) {
      res.status(200).json({
        status: true,
      });
    } else {
      res.status(200).json({
        status: false,
      });
    }
  } catch (err) {
    console.log(err);
  }
});
app.post("/news", async (req, res) => {
  try {
    const news = await update.find();
    res.status(200).json(news);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ message: "Failed to fetch news" });
  }
});
app.listen(PORT, () => {
  console.log("Server Started");
});
