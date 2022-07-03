import express from "express";
import cors from "cors";
import http from "http";
import { logSuccess } from "./utils/log";
import { socket } from "./socket";

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
socket(server);

app.get("/", (_req, res) => {
  res.json({ message: "Hello World" });
});

server.listen(process.env.DEV_LOG_PORT || 3333, () => {
  logSuccess("server", `started on port ${process.env.DEV_LOG_PORT || 3333} 😎`);
});
