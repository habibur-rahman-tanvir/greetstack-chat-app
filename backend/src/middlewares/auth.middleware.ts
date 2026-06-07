import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user/User.model.js";

export const protectRoute: RequestHandler = async (req, res, next) => {
  try {
    const token = req.headers.token;
    const decoded = jwt.verify(
      token as string,
      process.env.JWT_SECRET ?? "JWT_SECRET",
    );

    const user = await User.findById(decoded.userId);

    if (!user) return res.json({ success: false, message: "User not found" });

    req.user = user;
    next();
  } catch (err: any) {
    console.log(err);
    return res.json({ success: false, message: err.message });
  }
};
