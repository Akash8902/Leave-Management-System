var express = require("express");
const mongoose = require("mongoose");
var ejs = require("ejs");
var async = require("async");
var path = require("path");
var sweetalert = require("sweetalert2");

const leaveRoutes = require("./Routes/leaveRoutes");

var app = express();

const dbURI =
 "mongodb+srv://akash:akash123@cluster0.mwdnrs5.mongodb.net/flmsystem?retryWrites=true&w=majority";

mongoose
  .connect(dbURI)
  .then((result) => {
    console.log("connected to db");
    app.listen(5000);
  })
  .catch((err) => console.log(err));

app.set("view engine", "ejs");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/leaves", leaveRoutes);
