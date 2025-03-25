const express = require("express");
const fs = require("fs");
var cors = require("cors");
const app = express();
const port = 3000;
const dotenv = require("dotenv");
dotenv.config();

app.use(express.json());
app.use(cors());

let SendInterval = setInterval(function () {
  SendSlideData();
}, 60000);

let i = 0;

function SendSlideData() {
  let rawdata = fs.readFileSync("slides.json");
  let slides = JSON.parse(rawdata);
  if (i >= slides.length) {
    i = 0;
  }
  console.log(JSON.stringify({"markup":slides[i]["html"]}))
  const options = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer 2|' + process.env.API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"markup":slides[i]["html"]})
  };
  
  fetch('http://192.168.178.68:4567/api/display/update?device_id=1', options)
    .catch(err => console.error(err));
  console.log(`Sent '${slides[i]["html"]}' to E-Ink Display`)
  i++;
}

function stopSendInverval() {
  clearInterval(SendInterval);
}

app.post("/changeslidequeue", async (req, res) => {
  console.log("Changed queue to: " + JSON.stringify(req.body));
  let data = JSON.stringify(req.body);
  fs.writeFileSync("slides.json", data);
  res.send("Change Slidequeue succesfully!");
});

app.get("/", (req, res) => {
  let rawdata = fs.readFileSync("slides.json");
  let slides = JSON.parse(rawdata);
  res.send(slides);
});

app.listen(port, () => {
  console.log(`E-Ink Manager Backend listening on port ${port}`);
});
