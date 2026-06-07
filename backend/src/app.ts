import express, { type Express, type Request, type Response } from "express";
import morgan from "morgan";
import { isProduction } from "./utilities/checkENV.js";
import { corsMiddleware } from "./middlewares/cors.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { userRouter } from "./routes/user.route.js";
import { messageRouter } from "./routes/message.route.js";

const app: Express = express();
app.set("trust proxy", 1);

app.use(corsMiddleware);

app.use(morgan("dev", { skip: () => isProduction() }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

app.use(errorMiddleware);

export default app;
