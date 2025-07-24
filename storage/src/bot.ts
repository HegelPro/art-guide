import "dotenv/config";
import * as path from "path";
import express from "express";
import https from "https";
import * as fs from "fs";

const app = express();
const port = 443;

const options = {
  key: fs.readFileSync(path.join(__dirname, "../certs/privkey.pem")),
  cert: fs.readFileSync(path.join(__dirname, "../certs/fullchain.pem")),
};
const server = https.createServer(options, app);

app.use("/static", express.static(path.join(__dirname, "../assets")));

server.listen(port, async () => {
  console.log(`Example app listening on port ${port}`);
});
