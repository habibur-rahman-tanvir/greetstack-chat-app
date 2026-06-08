import type { RequestHandler } from "express";
import { User } from "../models/user/User.model.js";
import { Message } from "../models/message/Message.model.js";
import type mongoose from "mongoose";
import { cloudinary } from "../configs/cloudinary.js";
import { io, userSocketMap } from "../index.js";
import { CLOUDINAR_FOLDER } from "../constants/constatnt.js";

export const getUsersForSidebar: RequestHandler = async (req, res) => {
  try {
    // @ts-ignore
    const userId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password",
    );

    const unseenMessages = {};

    const promises = filteredUsers.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      if (messages.length > 0) {
        // @ts-ignore
        unseenMessages[user._id] = messages.length;
      }
    });

    await Promise.all(promises);

    res.json({ success: true, users: filteredUsers, unseenMessages });
  } catch (err: any) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

export const getMessages: RequestHandler = async (req, res) => {
  try {
    // @ts-ignore
    const { id: selectedUserId }: { id: mongoose.Types.ObjectId } = req.params;
    // @ts-ignore
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    });

    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId },
      { seen: true },
    );

    res.json({ success: true, messages });
  } catch (err: any) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

export const markMessageAsSeen: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true });
    res.json({ success: true });
  } catch (err: any) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

export const sendMessage: RequestHandler = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    // @ts-ignore
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: `${CLOUDINAR_FOLDER}/chat_images`,
      });
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      // @ts-ignore
      receiverId,
      text,
      image: imageUrl,
    });

    // @ts-ignore
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.json({ success: true, newMessage });
  } catch (err: any) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};
