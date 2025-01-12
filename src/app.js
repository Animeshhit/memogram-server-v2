const express = require("express");
const cors = require("cors");

//setup router
const router = require("./routes/index.js");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//setup routes
app.use("/api/v1", router);

console.log();

module.exports = app;
