import type { RequestHandler } from "express";
import { User } from "../models/user/User.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utilities/utils.js";
import { cloudinary } from "../configs/cloudinary.js";

export const signup: RequestHandler = async (req, res) => {
  const { fullName, email, password, bio } = req.body;

  if (!fullName || !email || !password || !bio)
    return res.json({ success: false, message: "Missing details" });

  try {
    const user = await User.findOne({ email });

    if (user)
      return res.json({ success: false, message: "Account already exist" });

    // const salt = await bcrypt.getSalt("10");
    // const hashedPasssword = await bcrypt.hash(password, salt);
    const hashedPasssword = password;

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPasssword,
      bio,
    });

    const token = generateToken(newUser._id.toString());

    res.json({
      success: true,
      userData: newUser,
      token,
      messages: "Account created successfully",
    });
  } catch (err: any) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.json({ success: false, message: "Missing details" });

  try {
    const userData = await User.findOne({ email });

    // const isPasswordCorrect = await bcrypt.compare(
    //   password,
    //   userData?.password!,
    // );
    const isPasswordCorrect = password === userData?.password;

    if (!userData || !isPasswordCorrect)
      return res.json({ success: false, message: "Invalid credentials" });

    const token = generateToken(userData._id.toString());

    res.json({
      success: true,
      userData: userData,
      token,
      messages: "Login successfull",
    });
  } catch (err: any) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

export const checkAuth: RequestHandler = (req, res) => {
  // @ts-ignore
  res.json({ success: true, user: req.user });
};

export const updateProfile: RequestHandler = async (req, res) => {
  try {
    const { profilePic, fullName, bio } = req.body;

    // @ts-ignore
    const userId = req.user._id;
    let updatedUser;

    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { returnDocument: "after" },
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic, {
        folder: "/greetstack_chat_app",
      });
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: upload.secure_url, bio, fullName },
        { returnDocument: "after" },
      );
    }
    res.json({ success: true, user: updatedUser });
  } catch (err: any) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};
