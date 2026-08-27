const express = require("express");

const app = express();

app.post("/", (req, res) => {
  res.json({ message: "post request successful" });
});

app.get("/", (req, res) => {
  res.json({ message: "get request successful" });
});

app.put("/", (req, res) => {
  res.json({ message: "put request successful" });
});

app.delete("/", (req, res) => {
  res.json({ message: "delete request successful" });
});

app.listen(3000);