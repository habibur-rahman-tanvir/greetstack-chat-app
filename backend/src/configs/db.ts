import mongoose from "mongoose";
import { logger } from "./logger.js";

export const connectDatabase = async () => {
  const databaseUrl = process.env.DATABASE_URI;

  if (!databaseUrl) {
    logger.error("Database url not found");
    throw new Error("Database url not found");
  }

  try {
    await mongoose.connect(databaseUrl);
    logger.info("Database connected");
  } catch (err: any) {
    logger.error(`Database error: ${err.message ? err.message : "No message"}`);
  }
};
