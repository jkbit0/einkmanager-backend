const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

app.post("/changequeue", (req, res) => {
  console.log(req.body);
});

app.get("/", (req, res) => {
  res.send("Queue");
});

app.listen(port, () => {
  console.log(`E-Ink Manager Backend listening on port ${port}`);
});
