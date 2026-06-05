import path from "node:path";
import fs from "node:fs";
import https from "node:https";
import app from "./app.js";
import "dotenv/config";
import { getEnvironment, isProduction } from "./utilities/checkENV.js";
import { getESMPaths } from "./utilities/esmPath.js";

const PORT = process.env.PORT || 8000;

const run = async () => {
  if (isProduction()) {
    app.listen(PORT, () => {
      console.log(`Server(${getEnvironment()}) running`);
    });
  } else {
    const { __dirname } = getESMPaths(import.meta.url);
    const key = await fs.readFileSync(
      path.join(__dirname, "./certificates/localhost-key.pem"),
    );
    const cert = fs.readFileSync(
      path.join(__dirname, "./certificates/localhost.pem"),
    );

    const server = https.createServer({ key, cert }, app);
    server.listen(PORT, () => {
      console.log(
        `Server(${getEnvironment()}) running at https://localhost:${PORT}`,
      );
    });
  }
};

run();
