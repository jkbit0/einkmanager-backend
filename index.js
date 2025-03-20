const express = require("express");
const app = express();
const port = 3000;

app.post("/changequeue", (req, res) => {
  res.send(req.body);
});

app.get("/", (req, res) => {
  res.send("Queue");
});

app.listen(port, () => {
  console.log(`E-Ink Manager Backend listening on port ${port}`);
});
