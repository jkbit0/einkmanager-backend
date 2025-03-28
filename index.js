const express = require("express");
const fs = require("fs");
var cors = require("cors");
const dotenv = require("dotenv");

const app = express();
const port = 3000;
dotenv.config();

app.use(express.json());
app.use(cors());

let i = 0;
let lastdata;
let SendIntervalTimout = 1;
let SendInterval;
let IntervalRunning;

startSendInvterval();

/**
 * Function to send slide data to the E-Ink display.
 * Reads the slides from `slides.json`, sends the current slide to the server,
 * and skips sending if the data is the same as the last sent data.
 */
function SendSlideData() {
  let rawdata = fs.readFileSync("slides.json");
  let slides = JSON.parse(rawdata);

  if (i >= slides.length) {
    i = 0;
  }

  const options = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer 2|' + process.env.API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ "markup": slides[i]["html"] })
  };

  if (lastdata == options["body"]) {
    console.log("Same Data, not sending");
    i++;
    return;
  }

  lastdata = options["body"];

  fetch('http://' + process.env.SERVER_IP + '/api/display/update?device_id=1', options)
    .catch(err => console.error(err));

  console.log(`Sent '${slides[i]["html"]}' to E-Ink Display on: ` + process.env.SERVER_IP);
  i++;
}

/**
 * Stops the interval that sends slide data.
 */
function stopSendInverval() {
  clearInterval(SendInterval);
  IntervalRunning = false
}

/**
 * Starts the interval that sends slide data.
 * The interval is based on the `SendIntervalTimout` value.
 */
function startSendInvterval() {
  SendInterval = setInterval(function () {
    SendSlideData();
  }, SendIntervalTimout * 1000);
  IntervalRunning = true
}

// API endpoint to update the slide queue
app.post("/changeslidequeue", async (req, res) => {
  console.log("Changed queue to: " + JSON.stringify(req.body));
  let data = JSON.stringify(req.body);
  fs.writeFileSync("slides.json", data);
  res.send("Change Slidequeue successfully!");
});

// API endpoint to get the current slide queue
app.get("/", (req, res) => {
  let rawdata = fs.readFileSync("slides.json");
  let slides = JSON.parse(rawdata);
  res.send(slides);
});

// API endpoint to start the slide update interval
app.get("/sendinterval/start", (req, res) => {
  startSendInvterval();
  res.send("Started E-INK Updater");
});

// API endpoint to stop the slide update interval
app.get("/sendinterval/stop", (req, res) => {
  stopSendInverval();
  res.send("Stopped E-INK Updater");
});

app.get("/sendinterval/status", (req, res) => {
  res.send(IntervalRunning);
});

// Start the Express server
app.listen(port, () => {
  console.log(`E-Ink Manager Backend listening on port ${port}`);
});
