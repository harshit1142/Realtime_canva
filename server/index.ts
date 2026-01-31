import { createServer } from "http";
import express from "express";
import next from "next";
import { Server } from "socket.io";
import {} from "@/common/types/global";
import { socket } from "@/common/lib/socket";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

nextApp.prepare().then(async () => {
  const app = express();
  const server = createServer(app);
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
    // allow connections from the frontend; set CLIENT_ORIGIN in production
    cors: {
      origin: process.env.CLIENT_ORIGIN || "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  app.get("/hello", async (_, res) => {
    res.send("Hello ji!");
  });


  app.all("*", (req, res) => nextHandler(req, res));
  server.listen(port, () => {
    console.log(`Server is ready on ${port}`);
  });
});
