import path from "node:path";
import fs from "node:fs";
import https from "node:https";
import { Server } from "socket.io";
import app from "./app.js";
import "dotenv/config";
import { getEnvironment, isProduction } from "./utilities/checkENV.js";
import { getESMPaths } from "./utilities/esmPath.js";
import { logger } from "./configs/logger.js";
import { connectDatabase } from "./configs/db.js";

const PORT = process.env.PORT || 8000;

const { __dirname } = getESMPaths(import.meta.url);

const key = await fs.readFileSync(
  path.join(__dirname, "./certificates/localhost-key.pem"),
);
const cert = fs.readFileSync(
  path.join(__dirname, "./certificates/localhost.pem"),
);

const server = https.createServer({ key, cert }, app);

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

export const userSocketMap: { [userId: string]: string } = {}; // {userId: socketId}

io.on("connection", (socket) => {
  const userId: string = socket.handshake.query.userId as string;

  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", (reason) => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

const run = async () => {
  await connectDatabase();
  // if (isProduction()) {
  //   app.listen(PORT, () => {
  //     console.log(`Server(${getEnvironment()}) running`);
  //   });
  // } else {
  //   server.listen(PORT, () => {
  //     logger.info(
  //       `Server(${getEnvironment()}) running at https://localhost:${PORT}`,
  //     );
  //   });
  // }
  server.listen(PORT, () => {
    logger.info(
      `Server(${getEnvironment()}) running at https://localhost:${PORT}`,
    );
  });
};

run();
