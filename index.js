const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

app.use(express.json());

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
