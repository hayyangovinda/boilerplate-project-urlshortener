require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const dns = require("dns");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});
app.use(bodyParser.urlencoded({ extended: false }));

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

const urlStores = [];
let counter = 0;
app.post("/api/shorturl", (req, res) => {
  const url = req.body.url;
  const hostname = new URL(url).hostname;
  dns.lookup(hostname, (err, add) => {
    if (err) {
      res.json({ error: "invalid url" });
    } else {
      counter++;
      urlStores.push({ original_url: url, short_url: counter });
      res.json({
        original_url: url,
        short_url: counter,
      });
    }
  });
});

app.get("/api/shorturl/:url", (req, res) => {
  const { url } = req.params;

  const storedUrl = urlStores.find((urlStored) => urlStored.short_url === +url);

  if (storedUrl) {
    res.redirect(storedUrl.original_url);
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
